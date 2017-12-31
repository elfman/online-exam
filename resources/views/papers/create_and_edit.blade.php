@extends('layouts.app')

@section('content')

<div class="container">
    <div class="col-md-10 col-md-offset-1">
        <div class="panel panel-default">
            
            <div class="panel-heading">
                <h1>
                    <i class="glyphicon glyphicon-edit"></i> Paper /
                    @if($paper->id)
                        Edit #{{$paper->id}}
                    @else
                        Create
                    @endif
                </h1>
            </div>

            @include('common.error')

            <div class="panel-body">
                @if($paper->id)
                    <form action="{{ route('papers.update', $paper->id) }}" method="POST" accept-charset="UTF-8">
                        <input type="hidden" name="_method" value="PUT">
                @else
                    <form action="{{ route('papers.store') }}" method="POST" accept-charset="UTF-8">
                @endif

                    <input type="hidden" name="_token" value="{{ csrf_token() }}">

                    
                <div class="form-group">
                	<label for="title-field">Title</label>
                	<input class="form-control" type="text" name="title" id="title-field" value="{{ old('title', $paper->title ) }}" />
                </div> 
                <div class="form-group">
                    <label for="creator_id-field">Creator_id</label>
                    <input class="form-control" type="text" name="creator_id" id="creator_id-field" value="{{ old('creator_id', $paper->creator_id ) }}" />
                </div> 
                <div class="form-group">
                    <label for="total_score-field">Total_score</label>
                    <input class="form-control" type="text" name="total_score" id="total_score-field" value="{{ old('total_score', $paper->total_score ) }}" />
                </div> 
                <div class="form-group">
                    <label for="content-field">Content</label>
                    <input class="form-control" type="text" name="content" id="content-field" value="{{ old('content', $paper->content ) }}" />
                </div> 
                <div class="form-group">
                    <label for="time_limit-field">Time_limit</label>
                    <input class="form-control" type="text" name="time_limit" id="time_limit-field" value="{{ old('time_limit', $paper->time_limit ) }}" />
                </div> 
                <div class="form-group">
                    <label for="participation_count-field">Participation_count</label>
                    <input class="form-control" type="text" name="participation_count" id="participation_count-field" value="{{ old('participation_count', $paper->participation_count ) }}" />
                </div>

                    <div class="well well-sm">
                        <button type="submit" class="btn btn-primary">Save</button>
                        <a class="btn btn-link pull-right" href="{{ route('papers.index') }}"><i class="glyphicon glyphicon-backward"></i>  Back</a>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

@endsection