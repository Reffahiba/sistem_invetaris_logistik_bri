@extends('layouts.app')

@section('content')
    <div id="permintaan-root"
        data-permintaan="{{ $permintaan }}"
        data-daftarPermintaan="{{ $detail_permintaan }}"></div>
    <div id="app" 
        data-nama="{{ $nama }}"
        data-divisi="{{ $divisi}}">
    </div>
@endsection

@push('scripts')
    @viteReactRefresh
    @vite('resources/js/main.tsx')
@endpush
