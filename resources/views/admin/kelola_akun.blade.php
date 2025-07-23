@extends('layouts.app')

@section('content')
    <div id="kelolaAkun-root"
        data-akun='@json($akun)'
        data-daftarDivisi='@json($daftarDivisi)'>
    </div>
    <div id="app" 
        data-nama="{{ $nama }}"
        data-divisi="{{ $divisi }}">
    </div>
@endsection

@push('scripts')
    @viteReactRefresh
    @vite('resources/js/main.tsx')
@endpush
