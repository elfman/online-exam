@extends('layouts.app')

@section('content')

<div class="container">
    <div class="col-md-10 col-md-offset-1">
        <div class="panel panel-default">
            <div class="panel-heading">
                <h1>Paper / Show #{{ $paper->id }}</h1>
            </div>

            <div class="panel-body">
                <div class="well well-sm">
                    <div class="row">
                        <div class="col-md-6">
                            <a class="btn btn-link" href="{{ route('papers.index') }}"><i class="glyphicon glyphicon-backward"></i> Back</a>
                        </div>
                        <div class="col-md-6">
                             <a class="btn btn-sm btn-warning pull-right" href="{{ route('papers.edit', $paper->id) }}">
                                <i class="glyphicon glyphicon-edit"></i> Edit
                            </a>
                        </div>
                    </div>
                </div>

                <label>Title</label>
<p>
	{{ $paper->title }}
</p> <label>Creator_id</label>
<p>
	{{ $paper->creator_id }}
</p> <label>Total_score</label>
<p>
	{{ $paper->total_score }}
</p> <label>Content</label>
<p>
	{{ $paper->content }}
</p> <label>Time_limit</label>
<p>
	{{ $paper->time_limit }}
</p> <label>Participation_count</label>
<p>
	{{ $paper->participation_count }}
</p>
            </div>
        </div>
    </div>
</div>

@endsection
