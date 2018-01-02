@extends('layouts.app')

@section('content')
<div class="container">
    <table class="table table-bordered">
        <thead>
            <tr>
                <th>#</th>
                <th>标题</th>
                <th>题数</th>
                <th>总分</th>
                <th>限时</th>
                <th>已参与人数</th>
                <th>创建时间</th>
                <th>操作</th>
            </tr>
        </thead>
        <tbody>
            @foreach($papers as $index => $paper)
                <tr>
                    <th scope="row">{{ $index }}</th>
                    <td>{{ $paper->title }}</td>
                    <td>{{ count(json_decode($paper->content)) }}</td>
                    <td>{{ $paper->total_score }}</td>
                    <td>{{ $paper->time_limit }}</td>
                    <td>{{ $paper->participation_count }}</td>
                    <td>{{ $paper->created_at }}</td>
                    <td>
                        <a href="{{ route('papers.show', $paper->id) }}">
                            <button class="btn btn-default btn-xs"><i class="fa fa-check"></i> 查看</button>
                        </a>
                        <a href="{{ route('papers.edit', $paper->id) }}" style="margin-bottom: 4px;">
                            <button class="btn btn-default btn-xs"><i class="fa fa-edit"></i> 编辑</button>
                        </a>
                        <form action="{{ route('papers.destroy', $paper->id) }}" method="POST" style="display: inline;">
                            {{ csrf_field() }}
                            <button class="btn btn-default btn-xs" type="submit">
                                <i class="fa fa-remove"></i> 删除
                            </button>
                        </form>
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>

    {!! $papers->render() !!}
</div>

@endsection