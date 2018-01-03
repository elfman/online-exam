@extends('layouts.app')

@section('content')
    <table class="table table-bordered">
        <thead>
        <tr>
            <th>#</th>
            <th>标题</th>
            <th>分数</th>
            <th>总分</th>
            <th>开始时间</th>
            <th>用时</th>
        </tr>
        </thead>
        <tbody>
        @foreach($scores as $index => $score)
            <tr>
                <th scope="row">{{ $index }}</th>
                <td>{{ $score->paper->title }}</td>
                <td>{{ $score->score }}</td>
                <td>{{ $score->paper->total_score }}</td>
                <td>{{ $score->start_time }}</td>
                <td>{{ \Carbon\Carbon::parse($score->start_time)->diffInMinutes(\Carbon\Carbon::parse($score->complete_time)) }}分钟</td>
            </tr>
        @endforeach
        </tbody>
    </table>
    {!! $scores->render() !!}
@endsection