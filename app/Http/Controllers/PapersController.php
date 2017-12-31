<?php

namespace App\Http\Controllers;

use App\Models\Paper;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\PaperRequest;

class PapersController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth', ['except' => ['index', 'show']]);
    }

	public function index()
	{
		$papers = Paper::paginate();
		return view('papers.index', compact('papers'));
	}

    public function show(Paper $paper)
    {
        return view('papers.show', compact('paper'));
    }

	public function create(Paper $paper)
	{
		return view('papers.create_and_edit', compact('paper'));
	}

	public function store(PaperRequest $request)
	{
		$paper = Paper::create($request->all());
		return redirect()->route('papers.show', $paper->id)->with('message', 'Created successfully.');
	}

	public function edit(Paper $paper)
	{
        $this->authorize('update', $paper);
		return view('papers.create_and_edit', compact('paper'));
	}

	public function update(PaperRequest $request, Paper $paper)
	{
		$this->authorize('update', $paper);
		$paper->update($request->all());

		return redirect()->route('papers.show', $paper->id)->with('message', 'Updated successfully.');
	}

	public function destroy(Paper $paper)
	{
		$this->authorize('destroy', $paper);
		$paper->delete();

		return redirect()->route('papers.index')->with('message', 'Deleted successfully.');
	}
}