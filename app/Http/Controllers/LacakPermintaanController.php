<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\Divisi;
use App\Models\Permintaan;
use App\Models\DetailPermintaan;
use App\Models\AkunPengguna;
use App\Models\Notifikasi;

class LacakPermintaanController extends Controller
{
    public $divisi;
    public $permintaan;

    public function __construct(){
        $this->divisi = new Divisi();
        $this->permintaan = new Permintaan();
    }

    public function lacakPermintaan(Request $request){
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
                'alasan_penolakan' => $detail->permintaan->alasan_penolakan ?? 'Tidak diketahui',
                'gambar_barang' => $detail->barang->gambar_barang,
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

    public function updateStatusPermintaan(Request $request, $id){
        $user = Auth::user();
        
        // Validasi input
        $request->validate([
            'status' => 'required|in:menunggu,sedang diproses,sedang diantar,telah diterima',
        ]);

        // Cari permintaan berdasarkan ID
        $permintaan = Permintaan::findOrFail($id);

        if (!$permintaan) {
            return response()->json([
                'message' => 'Data permintaan tidak ditemukan.'
            ], 404);
        }

        // Update status
        $permintaan->status = $request->input('status');
        $permintaan->save();

        // NOTIFIKASI KE ADMIN
        $admins = AkunPengguna::where('id_role', 1)->get(); 
        $peminta = $user->nama_user;

        foreach ($admins as $admin) {
            Notifikasi::create([
                'id_user' => $admin->id_user,
                'pesan' => "Permintaan barang #{$permintaan->id_permintaan} dari {$peminta} telah diterima",
                'link' => '/admin/permintaan',
            ]);
        }



        return response()->json([
            'message' => 'Status berhasil diperbarui.',
            'data' => $permintaan
        ], 200);
    }
}
