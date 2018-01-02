@extends('layouts.app')

@section('content')

<div class="container">
    <paper-component paper-json="{{ json_encode($paper) }}" url="{{ route('papers', $paper->id) }}"></paper-component>
</div>

@endsection
