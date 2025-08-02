<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Divisi;
use App\Models\Permintaan;

class DashboardPegawaiController extends Controller
{
    public $divisi;
    public $permintaan;

    public function __construct(){
        $this->divisi = new Divisi();
        $this->permintaan = new Permintaan();
    }

    public function dashboard(){
        $user = Auth::user();
        $id_user = $user->id_user;
        $nama = $user->nama_user;
        $divisi = $user->divisi->nama_divisi;

        $permintaan_perUser = $this->permintaan->where('id_user', $id_user);

        $totalPermintaan = $permintaan_perUser->count();

        $jumlahMenunggu = (clone $permintaan_perUser)->where('status', 'Menunggu')->count();
        $jumlahSedangDiproses = (clone $permintaan_perUser)->where('status', 'Sedang Diproses')->count();
        $jumlahSedangDiantar = (clone $permintaan_perUser)->where('status', 'Sedang Diantar')->count();
        $jumlahTelahDiterima = (clone $permintaan_perUser)->where('status', 'Telah Diterima')->count();
        $jumlahDitolak = (clone $permintaan_perUser)->where('status', 'Ditolak')->count();

        $persen = function ($jumlah) use ($totalPermintaan) {
            return $totalPermintaan > 0 ? round(($jumlah / $totalPermintaan) * 100) : 0;
        };

        $data = [
            'nama' => $nama,
            'divisi' => $divisi,
            'totalPermintaan' => $totalPermintaan,
            'jumlahMenunggu' => $jumlahMenunggu,
            'jumlahDiproses' => $jumlahSedangDiproses,
            'jumlahDiantar' => $jumlahSedangDiantar,
            'jumlahDiterima' => $jumlahTelahDiterima,
            'jumlahDitolak' => $jumlahDitolak,
            'persenTotal' => $persen($totalPermintaan),
            'persenMenunggu' => $persen($jumlahMenunggu),
            'persenDiproses' => $persen($jumlahSedangDiproses),
            'persenDiantar' => $persen($jumlahSedangDiantar),
            'persenDiterima' => $persen($jumlahTelahDiterima),
            'persenDitolak' => $persen($jumlahDitolak),
        ];
        
        return view('pegawai.dashboard', $data);
    }
}
