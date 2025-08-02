@extends('layouts.app')

@section('content')
    <div id="dashboardPegawai-root"></div>
    <div id="app" 
        data-nama="{{ $nama }}"
        data-divisi="{{ $divisi}}"
        data-total="{{ $totalPermintaan }}"
        data-menunggu="{{ $jumlahMenunggu }}"
        data-diproses="{{ $jumlahDiproses }}"
        data-diantar="{{ $jumlahDiantar }}"
        data-diterima="{{ $jumlahDiterima }}"
        data-ditolak="{{ $jumlahDitolak }}"
        data-persen-total="{{ $persenTotal }}"
        data-persen-menunggu="{{ $persenMenunggu }}"
        data-persen-diproses="{{ $persenDiproses }}"
        data-persen-diantar="{{ $persenDiantar }}"
        data-persen-diterima="{{ $persenDiterima }}"
        data-persen-ditolak="{{ $persenDitolak }}">>
    </div>
@endsection

@push('scripts')
    @viteReactRefresh
    @vite('resources/js/main.tsx')
@endpush
