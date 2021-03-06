<?php

namespace App\Http\Controllers;

use App\Models\Paper;
use App\Models\Score;
use DateTime;
use Illuminate\Http\Request;
use Auth;
use Cache;


class ScoresController extends Controller
{
    protected $answer_cache_prefix = 'answer_';

    public function checkTestStatus(Paper $paper)
    {
        $user_id = Auth::id();
        $cacheData = Cache::get($this->getAnswerCacheKey($paper->id, $user_id));

        $now = new DateTime();

        // 如果有缓存，且还有考试时间
        if ($cacheData) {
            if ($paper->open_time !== null && new DateTime($paper->open_time) > $now) {
                return response()->json([
                    'errors' => 5,
                    'msg' => 'this test has not start yet',
                    'open_time' => (new DateTime($paper->open_time))->format('c'),
                ]);
            }
            if ($cacheData['deadline'] > $now) {
                return response()->json([
                    'errors' => 1,
                    'score_id' => $cacheData['score_id'],
                    'paper' => $paper,
                    'answers' => $cacheData['answers'],
                    'deadline' => $cacheData['deadline']->format('c'),
                ]);
            }
        }

        $score = Score::where('user_id', $user_id)
            ->where('paper_id', $paper->id)
            ->first();

        if ($score) {
            if ($paper->open_time !== null && new DateTime($paper->open_time) > $now) {
                return response()->json([
                    'errors' => 5,
                    'msg' => 'this test has not start yet',
                    'open_time' => (new DateTime($paper->open_time))->format('c'),
                ]);
            }
            $deadline = $this->getScoreDeadline($score->start_time, $paper);
            if ($score->score === null && $deadline > new DateTime()) { // 未提交，返回题目继续
                return response()->json([
                    'errors' => 2,
                    'score_id' => $score->id,
                    'paper' => $paper,
                    'answers' => $score->answers,
                    'deadline' => $deadline,
                ]);
            } else { // 已提交，返回分数
                $count = Score::where('user_id', $user_id)->where('paper_id', $paper->id)->withTrashed()->count();
                return response()->json([
                    'errors' => $count >= $paper->repeat_limit ? 6 : 3,
                    'score' => $score->score,
                    'repeat_limit' => $paper->repeat_limit,
                    'count' => $count,
                ]);
            }
        }

        return response()->json([
            'errors' => $paper->password ? 4 : 0,
        ]);
    }

    public function startTest(Request $request, Paper $paper)
    {
        $user_id = Auth::id();
        $cacheKey = $this->getAnswerCacheKey($paper->id, $user_id);

        $score = Score::where('user_id', $user_id)
            ->where('paper_id', $paper->id)
            ->first();

        if ($score && !$request->get('force')) {
            return response()->json([
                'errors' => 2,
                'msg' => 'User has complete this test',
                'id' => $score->id,
            ]);
        }
        if (!$score) {
            if ($paper->password && $paper->password !== $request->get('password')) {
                return response()->json([
                    'errors' => 3,
                    'msg' => 'wrong password',
                ]);
            }
        } else {
            $count = Score::where('user_id', $user_id)->where('paper_id', $paper->id)->withTrashed()->count();
            if ($count >= $paper->repeat_limit) {
                return response()->json([
                    'errors' => 6,
                    'msg' => 'you has exam too many times',
                    'repeat_limit' => $paper->repeat_limit,
                    'count' => $count,
                ]);
            }
            $score->delete();
        }
        $score = Score::create([
            'user_id' => $user_id,
            'paper_id' => $paper->id,
            'start_time' => now(),
        ]);

        $deadline = $this->getScoreDeadline($score->start_time, $paper);
        $cacheData = [
            'score_id' => $score->id,
            'deadline' => $deadline,
            'answers' => null,
        ];

        Cache::put($cacheKey, $cacheData, $deadline);

        if ($paper->open_time !== null && new DateTime($paper->open_time) > new DateTime()) {
            return response()->json([
                'errors' => 5,
                'msg' => 'this test has not start yet',
                'open_time' => (new DateTime($paper->open_time))->format('c'),
            ]);
        }

        $paperData = [
            'id' => $paper->id,
            'title' => $paper->title,
            'content' => $paper->content,
            'total_score' => $paper->total_score,
            'time_limit' => $paper->time_limit,
        ];

        return response()->json([
            'errors' => 0,
            'score_id' => $score->id,
            'paper' => $paperData,
            'deadline' => $deadline->format('c'),
        ]);
    }

    public function submit(Request $request, Score $score)
    {
        $this->authorize('update', $score);

        $paper = Paper::find($score->paper_id);
        if (!$paper) {
            return response()->json([
                'errors' => 1,
                'msg' => 'Paper not exist',
            ]);
        }

        $isOvertime = false;
        $totalScore = null;
        $answers = null;

        if ($score->score !== null) {
            // 已有分数，不再重新评分
            return response()->json([
                'errors' => 3,
                'score' => $score->score,
            ]);
        }

        $deadline = $this->getScoreDeadline($score->start_time, $paper);
        if ($deadline->add(new \DateInterval('PT30S')) < new DateTime()) { //考虑延迟，限时可推迟20秒
            $isOvertime = true;
            if ($score->score === null) {
                // 如提交超时，以缓存中的答案为准
                $answers = (Cache::get($this->getAnswerCacheKey($paper->id, Auth::id())))['answers'];
            }
        }

        if (!$isOvertime) {
            $answers = $request->input('answers');
        }
        $totalScore = computeScore($answers, $paper);
        if ($totalScore < 0) {
            return response()->json([
                'errors' => 'invalid answer',
            ]);
        }

        $score->score = $totalScore;
        $score->answers = json_encode($answers);
        $score->complete_time = now();
        $score->save();

        Cache::forget($this->getAnswerCacheKey($paper->id, Auth::id()));

        if ($isOvertime) {
            return response()->json([
                'errors' => 2,
                'score' => $totalScore,
            ]);
        }
        return response()->json([
            'errors' => 0,
            'score' => $totalScore,
        ]);
    }

    public function autoSave(Request $request)
    {
        $paper_id = $request->get('paper_id');
        $answers = $request->get('answers');
        $user_id = Auth::id();

        $cacheKey = $this->getAnswerCacheKey($paper_id, $user_id);

        $score = Cache::get($cacheKey);

        if (!$score) {
            return response()->json([
                'errors' => 'This test is not exist',
            ]);
        }

        if ($score['deadline'] < new DateTime()) {
            return response()->json([
                'errors' => 'this test is over',
            ]);
        }

        $score['answers'] = $answers;

        Cache::put($cacheKey, $score, $score['deadline']);

        return response()->json([
            'errors' => 0
        ]);
    }

    public function removeScore(Score $score)
    {
        $this->authorize('delete', $score);

        $score->forceDelete();

        return response()->json([
            'errors' => 0,
        ]);
    }

    public function getAnswerCacheKey($paper_id, $user_id)
    {
        return $this->answer_cache_prefix . $user_id . '_' . $paper_id;
    }

    public function getScoreDeadline($startTime, $paper)
    {
        $deadline = (new DateTime($startTime))->add(new \DateInterval('PT' . $paper->time_limit . 'M'));
        if ($paper->close_time !== null) {
            $closeTime = new DateTime($paper->close_time);
            if ($deadline > $closeTime) {
                return $closeTime;
            }
        }
        return $deadline;
    }


    public function myScores()
    {
        $scores = Score::where('user_id', Auth::id())->with('paper');
        if (isApiRequest()) {
            $data = $scores->get()->map(function($score) {
                return [
                    'id' => $score->id,
                    'paper_id' => $score->paper_id,
                    'title' => $score->paper->title,
                    'score' => $score->score,
                    'total_score' => $score->paper->total_score,
                    'start_time' => $score->start_time,
                    'complete_time' => $score->complete_time,
                ];
            });
            return response()->json([
                'errors' => 0,
                'scores' => $data,
            ]);
        }
        $scores = $scores->paginate(30);
        return view('papers.scores', compact('scores'));
    }

}
