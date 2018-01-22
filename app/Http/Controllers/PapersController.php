<?php

namespace App\Http\Controllers;

use App\Models\Score;
use App\Models\Paper;
use DateTime;
use Illuminate\Http\Request;
use App\Http\Requests\PaperRequest;
use Auth;
use Log;
use Cache;

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
            'id', 'creator_id', 'title', 'total_score', 'content', 'time_limit', 'password', 'participation_count', 'created_at', 'open_time')
            ->orderBy('created_at')->get();
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
        $data = $request->only(['title', 'questions', 'time_limit', 'answers', 'repeat_limit']);
        $total_score = 0;

        foreach ($data['questions'] as $question) {
            $total_score += $question['score'];
        }
        $data['total_score'] = $total_score;
        $data['creator_id'] = Auth::id();
        $data['content'] = $data['questions'];

        if ($request->get('need_password')) {
            $data['password'] = $request->get('password');
        }

        if ($request->get('open_later')) {
            $data['open_time'] = $request->get('open_time');
        }

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
		$data = $request->only(['title', 'questions', 'time_limit', 'answers', 'repeat_limit']);
		$total_score = 0;

		foreach ($data['questions'] as $question) {
		    $total_score += $question['score'];
        }
        $data['total_score'] = $total_score;

        $data['password'] = $request->get('need_password') ? $request->get('password') : null;
        $data['open_time'] = $request->get('open_later') ? new DateTime($request->get('open_time')) : null;

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


    public function status(Paper $paper)
    {
        $this->authorize('update', $paper);
        $scores = Score::where('paper_id', $paper->id)->with('user')->get();
        return response()->json([
            'errors' => 0,
            'scores' => $scores,
            'paper' => $paper,
        ]);
	}

}