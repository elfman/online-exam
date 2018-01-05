@extends('layouts.app')

@section('content')
    <paper-editor
            @if ($paper)
                paper-json="{{ json_encode($paper) }}"
                url="{{ route('papers.update', $paper->id) }}"
            @endif
    ></paper-editor>
@endsection

@section('script')
    <script src="//cdn.bootcss.com/element-ui/2.0.9/index.js"></script>
    <script src="//cdn.bootcss.com/axios/0.17.1/axios.min.js"></script>
    <link rel="stylesheet" href="//cdn.bootcss.com/element-ui/2.0.9/theme-chalk/index.css">
    <script>
        new Vue({
            el: '#app'
        });
    </script>
@endsection