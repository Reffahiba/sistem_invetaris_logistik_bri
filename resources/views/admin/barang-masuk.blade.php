@extends('layouts.app')

@section('content')
    <div id="barangMasuk-root"></div>
    <div id="app" 
        data-nama="{{ $nama }}"
        data-divisi="{{ $divisi }}">
    </div>
@endsection

@push('scripts')
    @viteReactRefresh
    @vite('resources/js/main.tsx')
@endpush
