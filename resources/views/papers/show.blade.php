@extends('layouts.app')

@section('content')

    <paper-component :paper-id="{{ $paperId }}" start-url="{{ route('papers.start', $paperId) }}" submit-url="{{ route('papers.submit') }}"></paper-component>

@endsection

@section('script')
    <script>
         const app = new Vue({
             el: '#app'
         });
    </script>
@endsection