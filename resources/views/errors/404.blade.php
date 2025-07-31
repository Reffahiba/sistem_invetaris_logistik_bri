@extends('layouts.app')

@section('content')
    <div id="notFound-root"></div>
@endsection

@push('scripts')
    @viteReactRefresh
    @vite('resources/js/main.tsx')
@endpush
