<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AkunPengguna;
use App\Models\Divisi;
use App\Models\Barang;
use App\Models\Permintaan;
use App\Models\DetailPermintaan;
use Illuminate\Support\Facades\Auth;

class PegawaiFiturController extends Controller
{
    public $divisi;
    public $barang;
    public $permintaan;

    public function __construct(){
        $this->divisi = new Divisi();
        $this->barang = new Barang();
        $this->permintaan = new Permintaan();
    }

    public function dashboard(){
        $user = Auth::user();
        $nama = $user->nama_user;
        $divisi = $user->divisi->nama_divisi;

        $total_permintaan = $this->permintaan->getPermintaan()->count();

        $jumlahMenunggu = $this->permintaan->where('status', 'Menunggu')->count();
        $jumlahSedangDiproses = $this->permintaan->where('status', 'Sedang Diproses')->count();
        $jumlahSedangDiantar = $this->permintaan->where('status', 'Sedang Diantar')->count();
        $jumlahTelahDiterima = $this->permintaan->where('status', 'Telah Diterima')->count();

        $persen = function ($jumlah) use ($total_permintaan) {
            return $total_permintaan > 0 ? round(($jumlah / $total_permintaan) * 100) : 0;
        };

        $data = [
            'nama' => $nama,
            'divisi' => $divisi,
            'jumlahMenunggu' => $jumlahMenunggu,
            'jumlahDiproses' => $jumlahSedangDiproses,
            'jumlahDiantar' => $jumlahSedangDiantar,
            'jumlahDiterima' => $jumlahTelahDiterima,
            'persenMenunggu' => $persen($jumlahMenunggu),
            'persenDiproses' => $persen($jumlahSedangDiproses),
            'persenDiantar' => $persen($jumlahSedangDiantar),
            'persenDiterima' => $persen($jumlahTelahDiterima),
        ];
        
        return view('pegawai.dashboard', $data);
    }

    public function ajukan_permintaan(){
        $user = Auth::user();
        $nama = $user->nama_user;
        $divisi = $user->divisi->nama_divisi;

        $barang = $this->barang->getBarang();

        $data = [
            'nama' => $nama,
            'divisi' => $divisi,
            'barang' => $barang,
        ];
        
        return view('pegawai.ajukan_permintaan', $data);
    }

    public function lacak_permintaan(){
        $user = Auth::user();
        $nama = $user->nama_user;
        $divisi = $user->divisi->nama_divisi;

        $permintaan = $this->permintaan->getPermintaan();

        return view('pegawai.lacak_permintaan', compact('permintaan', 'nama', 'divisi'));
    }
}
