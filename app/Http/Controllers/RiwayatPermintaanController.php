<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\Barang;
use App\Models\Divisi;
use App\Models\Permintaan;
use App\Models\DetailPermintaan;

class RiwayatPermintaanController extends Controller
{
    public $divisi;
    public $permintaan;
    public $barang;
    public $detail_permintaan;

    public function __construct(){
        $this->divisi = new Divisi();
        $this->permintaan = new Permintaan();
        $this->detail_permintaan = new DetailPermintaan();
    }

    public function riwayat_permintaan(Request $request){
        $user = Auth::user();
        $nama = $user->nama_user;
        $divisi = $user->divisi->nama_divisi;

        $permintaan = $this->permintaan
            ->where('id_user', $user->id_user)
            ->where('status', 'Telah Diterima')
            ->get();

        // Ambil semua detail permintaan beserta status permintaan (dari relasi)
        $detail_permintaan = DetailPermintaan::with(['permintaan', 'barang'])
            ->whereHas('permintaan', function ($query) use ($user){
                $query->where('id_user', $user->id_user)->where('status', 'Telah Diterima');
            })
            ->get()
            ->map(function ($detail) {
                return [
                    'id_detail' => $detail->id_detail,
                    'nama_barang' => $detail->barang->nama_barang,
                    'jumlah_minta' => $detail->jumlah_minta,
                    'id_permintaan' => $detail->id_permintaan,
                    'status' => $detail->permintaan->status ?? 'Tidak diketahui',
                    'daftarBarang' => [], // bisa diisi jika ada relasi barang
                ];
            });

        if ($request->expectsJson() || $request->ajax()) {
            return response()->json([
                'permintaan' => $permintaan,
                'detail_permintaan' => $detail_permintaan,
            ]);
        }

        return view('pegawai.riwayat_permintaan', [
            'permintaan' => $permintaan,
            'detail_permintaan' => $detail_permintaan,
            'nama' => $nama,
            'divisi' => $divisi,
        ]);
    }
}
