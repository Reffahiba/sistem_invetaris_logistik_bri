@extends('layouts.app')

@section('content')
    <div id="lacakStatus-root"
        data-permintaan='@json($permintaan)'>
    </div>
    <div id="app" 
        data-nama="{{ $nama }}"
        data-divisi="{{ $divisi }}"
        data-permintaan='@json($permintaan)'>
    </div>
@endsection

@push('scripts')
    @viteReactRefresh
    @vite('resources/js/main.tsx')
@endpush
