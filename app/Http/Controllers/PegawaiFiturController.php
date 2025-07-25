<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Akun_Pengguna;
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

    public function lacak_permintaan(Request $request){
        $user = Auth::user();
        $nama = $user->nama_user;
        $divisi = $user->divisi->nama_divisi;

        $permintaan = $this->permintaan->getPermintaan();

        // Ambil semua detail permintaan beserta status permintaan (dari relasi)
        $detail_permintaan = DetailPermintaan::with(['permintaan', 'barang'])->get()->map(function ($detail) {
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

        return view('pegawai.lacak_permintaan', [
            'permintaan' => $permintaan,
            'detail_permintaan' => $detail_permintaan,
            'nama' => $nama,
            'divisi' => $divisi,
        ]);
    }

    public function update_status_permintaan(Request $request, $id){
        // Validasi input
        $request->validate([
            'status' => 'required|in:menunggu,diproses,sedang diantar,telah diterima',
        ]);

        // Cari permintaan berdasarkan ID
        $permintaan = Permintaan::findOrFail($id);

        if (!$permintaan) {
            return response()->json([
                'message' => 'Data permintaan tidak ditemukan.'
            ], 404);
        }

        // Update status
        $permintaan->status = $request->status;
        $permintaan->save();

        return response()->json([
            'message' => 'Status berhasil diperbarui.',
            'data' => $permintaan
        ], 200);
    }
}
