<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Akun_Pengguna;
use App\Models\Divisi;
use App\Models\Barang;
use Illuminate\Support\Facades\Auth;

class PegawaiFiturController extends Controller
{
    public $divisi;
    public $barang;

    public function __construct(){
        $this->divisi = new Divisi();
        $this->barang = new Barang();
    }

    public function dashboard(){
        $user = Auth::user();
        $nama = $user->nama_user;
        $divisi = $user->divisi->nama_divisi;

        $data = [
            'nama' => $nama,
            'divisi' => $divisi,
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
}
