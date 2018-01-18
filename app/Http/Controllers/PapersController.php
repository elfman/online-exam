<?php

namespace App\Http\Controllers;

use App\Models\Score;
use App\Models\Paper;
use DateTime;
use Illuminate\Http\Request;
use App\Http\Requests\PaperRequest;
use Auth;
use Illuminate\Support\Facades\Mail;
use Log;
use Cache;

class PapersController extends Controller
{
    protected $answer_cache_prefix = 'answer_';

    public function __construct()
    {
        if (isApiRequest()) {
            $this->middleware('auth:api');
        } else {
            $this->middleware('auth');
        }
    }

	public function index()
	{
		$papers = Paper::where('creator_id', Auth::id())->orderBy('created_at')->paginate(30);
		return view('papers.index', compact('papers'));
	}

    public function myPapers()
    {
        $papers = Paper::where('creator_id', Auth::id())->select(
            'id', 'creator_id', 'title', 'total_score', 'content', 'time_limit', 'participation_count', 'created_at')->orderBy('created_at')->get();
        return response()->json([
            'errors' => 0,
            'papers' => $papers
        ]);
	}

    public function show($id)
    {

        return view('papers.show', ['paperId' => $id]);
    }

	public function create(Paper $paper)
	{
		return view('papers.create_and_edit', compact('paper'));
	}

	public function store(PaperRequest $request)
	{
        $data = $request->only(['title', 'questions', 'time_limit', 'answers']);
        $total_score = 0;

        foreach ($data['questions'] as $question) {
            $total_score += $question['score'];
        }
        $data['total_score'] = $total_score;
        $data['creator_id'] = Auth::id();
        $data['content'] = $data['questions'];
		$paper = Paper::create($data);
        return response()->json([
            'error' => 0,
            'id' => $paper->id,
        ]);
	}

	public function edit(Paper $paper)
	{
        $this->authorize('update', $paper);
        if (isApiRequest()) {
            return response()->json([
                'errors' => 0,
                'paper' => $paper,
            ]);
        } else {
            return view('papers.create_and_edit', compact('paper'));
        }
	}

	public function update(PaperRequest $request, Paper $paper)
	{
		$this->authorize('update', $paper);
		$data = $request->only(['title', 'questions', 'time_limit', 'answers']);
		$total_score = 0;

		foreach ($data['questions'] as $question) {
		    $total_score += $question['score'];
        }
        $data['total_score'] = $total_score;

		$paper->update($data);

		return response()->json([
		    'error' => 0,
        ]);
	}

	public function destroy(Paper $paper)
	{
		$this->authorize('destroy', $paper);
		$paper->delete();

		if (isApiRequest()) {
		    return response()->json([
		        'errors' => 0,
            ]);
        }

		return redirect()->route('papers.index')->with('message', 'Deleted successfully.');
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

    public function checkTestStatus(Paper $paper)
    {
        $user_id = Auth::id();
        $cacheData = Cache::get($this->getAnswerCacheKey($paper->id, $user_id));
        // 如果有缓存，且还有考试时间
        if ($cacheData && $cacheData['deadline'] > new DateTime()) {
            return response()->json([
                'errors' => 1,
                'score_id' => $cacheData['score_id'],
                'paper' => json_encode($paper),
                'answers' => $cacheData['answers'],
                'deadline' => $cacheData['deadline']->format('c'),
            ]);
        }

        $score = Score::where('user_id', $user_id)
            ->where('paper_id', $paper->id)
            ->first();

        if ($score) {
            if ($score->score === null) {
                return response()->json([
                    'errors' => 2,
                    'score_id' => $score->id,
                    'paper' => json_encode($paper),
                    'answers' => $score->answers,
                    'deadline' => $this->getScoreDeadline($score->start_time, $paper->time_limit),
                ]);
            } else {
                return response()->json([
                    'errors' => 3,
                    'score' => $score->score,
                ]);
            }
        }

        return response()->json([
            'errors' => 0,
        ]);
	}

    public function startTest(Request $request, $id)
    {
        $paper = Paper::where('id', $id)->select('id', 'title', 'content', 'total_score', 'time_limit')->first();
        $user_id = Auth::id();
        if (!$paper) {
            return response()->json([
                'error' => 'paper id not exist',
            ]);
        }

        $cacheKey = $this->getAnswerCacheKey($id, $user_id);
//
//        $cacheData = Cache::get($cacheKey);
//
//        if ($cacheData) {
//            if ($cacheData['deadline'] > new DateTime()) {
//                return response()->json([
//                    'errors' => 0,
//                    'continue' => true,
//                    'score_id' => $cacheData['score_id'],
//                    'paper' => json_encode($paper),
//                    'answers' => $cacheData['answers'],
//                    'deadline' => $cacheData['deadline']->format('c'),
//                ]);
//            } else {
//                return response()->json([
//                    'errors' => 'This test is over',
//                ]);
//            }
//        }

        $score = Score::where('user_id', $user_id)
            ->where('paper_id', $id)
            ->first();

        if ($score && !$request->query('force')) {
            return response()->json([
                'errors' => 1,
                'msg' => 'User has complete this test',
                'id' => $score->id,
            ]);
        }
        if (!$score) {
            $score = Score::create([
                'user_id' => $user_id,
                'paper_id' => $id,
                'start_time' => now(),
            ]);
        } else {
            $score->start_time = now();
            $score->score = null;
            $score->save();
        }

        $deadline = $this->getScoreDeadline($score->start_time, $paper->time_limit);
        $cacheData = [
            'score_id' => $score->id,
            'deadline' => $deadline,
            'answers' => null,
        ];

        Cache::put($cacheKey, $cacheData, $deadline);

        return response()->json([
            'errors' => 0,
            'score_id' => $score->id,
            'paper' => json_encode($paper),
            'deadline' => $deadline->format('c'),
        ]);
	}

    public function getAnswerCacheKey($paper_id, $user_id)
    {
        return $this->answer_cache_prefix . $user_id . '_' . $paper_id;
	}

    public function getScoreDeadline($startTime, $timeLimit)
    {
        return (new DateTime($startTime))->add(new \DateInterval('PT' . $timeLimit . 'M'));
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

        $deadline = $this->getScoreDeadline($score->start_time, $paper->time_limit);
        if ($deadline->add(new \DateInterval('PT20S')) < new DateTime()) { //考虑延迟，限时可推迟20秒
            $isOvertime = true;
            if ($score->score === null) {
                // 如提交超时，以缓存中的答案为准
                $answers = (Cache::get($this->getAnswerCacheKey($paper->id, Auth::id())))['answers'];
            } else {
                // 已有分数，不再重新评分
                return response()->json([
                    'errors' => 1,
                    'score' => $score->score,
                ]);
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
}