<?php

namespace App\Http\Controllers;

use App\Models\Score;
use App\Models\Paper;
use Illuminate\Http\Request;
use App\Http\Requests\PaperRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class PapersController extends Controller
{
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

		return redirect()->route('papers.index')->with('message', 'Deleted successfully.');
	}

    public function myScores()
    {
        $scores = Score::where('user_id', Auth::id())->where('complete_time', '!=', null)->with('paper')->paginate(30);
        return view('papers.scores', compact('scores'));
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
        $sheet = Score::where('user_id', $user_id)
            ->where('paper_id', $id)
            ->first();
        if ($sheet && !$request->query('force')) {
            return response()->json([
                'error' => 'User has complete this test',
                'id' => $sheet->id,
            ]);
        }
        if (!$sheet) {
            $sheet = Score::create([
                'user_id' => $user_id,
                'paper_id' => $id,
                'start_time' => now(),
            ]);
        }

        return response()->json([
            'sheet_id' => $sheet->id,
            'paper' => json_encode($paper),
        ]);
	}

    public function submit(Request $request)
    {
        $sheetId = $request->input('sheet_id');
        $answerSheet = Score::find($sheetId);
        if (!$answerSheet) {
            return response()->json([
                'error' => 'sheet id not exist',
            ]);
        }

        $paper = Paper::find($answerSheet->paper_id);
        if (!$paper) {
            return response()->json([
                'error' => 'paper id not exist',
            ]);
        }

        $answers = $request->input('answers');
        $score = computeScore($answers, $paper);
        if ($score < 0) {
            return response()->json([
                'error' => 'invalid answer',
            ]);
        }
//        $paperAnswers = json_decode($paper->answers);
//        if (count($answers) != count($paperAnswers)) {
//            return response()->json([
//                'error' => 'answers not enough',
//            ]);
//        }
//        $content = json_decode($paper->content);
//        $score = 0;
//        for ($index = 0; $index < count($paperAnswers); $index++) {
//            $rightAnswer = $paperAnswers[$index];
//            $question = $content[$index];
//            $answer = $answers[$index];
//            if ($question->type === 'single') {
//                if ($rightAnswer === $answer) {
//                    $score += $question->score;
//                }
//            } else if ($question->type === 'multi') {
//                if (count($answer) === count($rightAnswer) &&
//                    count(array_diff($rightAnswer, $answer)) === 0) {
//                    $score += $question->score;
//                }
//            }
//        }

        $answerSheet->score = $score;
        $answerSheet->answers = json_encode($answers);
        $answerSheet->complete_time = now();
        $answerSheet->save();

        return response()->json([
            'error' => 0,
            'score' => $score,
        ]);
	}
}