@extends('layouts.app')

@section('content')
    <div id="ajukanPermintaan-root"
        data-daftarBarang='@json($barang)'>
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
