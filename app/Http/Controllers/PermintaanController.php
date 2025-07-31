<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\Models\Permintaan;
use App\Models\DetailPermintaan;
use App\Models\Barang;
use App\Models\AkunPengguna;
use Illuminate\Http\Request;

class PermintaanController extends Controller
{
    public $permintaan;

    public function __construct(){
        $this->permintaan = new Permintaan();
    }

    public function kelolaPermintaan(Request $request)
    {
        $user = Auth::user();
        $nama = $user->nama_user;
        $divisi = $user->divisi->nama_divisi;

        $permintaan = $this->permintaan->getPermintaan();

        // Ambil semua detail permintaan beserta status permintaan (dari relasi)
        $detail_permintaan = DetailPermintaan::with(['permintaan.akun_pengguna', 'barang'])
            ->whereHas('permintaan', function ($query) {
                $query->where('status', '!=', 'ditolak');
            })
            ->get()
            ->map(function ($detail) {
            return [
                'id_detail' => $detail->id_detail,
                'nama_barang' => $detail->barang->nama_barang,
                'jumlah_minta' => $detail->jumlah_minta,
                'id_permintaan' => $detail->id_permintaan,
                'status' => $detail->permintaan->status ?? 'Tidak diketahui',
                'nama_user' => $detail->permintaan->akun_pengguna->nama_user ?? 'Tidak diketahui',
                'gambar_barang' => $detail->barang->gambar_barang 
                        ? asset($detail->barang->gambar_barang)
                        : null,
            ];
        });

        if ($request->expectsJson() || $request->ajax()) {
            return response()->json([
                'permintaan' => $permintaan,
                'detail_permintaan' => $detail_permintaan,
            ]);
        }

        return view('admin.permintaan', [
            'permintaan' => $permintaan,
            'detail_permintaan' => $detail_permintaan,
            'nama' => $nama,
            'divisi' => $divisi,
        ]);
    }

    public function index()
    {
        $permintaan = DetailPermintaan::with('barang')
            ->get()
            ->map(function ($detail) {
                return [
                    'id_detail' => $detail->id,
                    'nama_barang' => $detail->barang->nama_barang,
                    'jumlah_minta' => $detail->jumlah_minta,
                    'id_permintaan' => $detail->id_permintaan,
                    'id_barang' => $detail->id_barang,
                    'status' => $detail->status,
                    'gambar_barang' => $detail->barang?->gambar_barang 
                        ? asset($detail->barang->gambar_barang)
                        : null,
                ];
            });

        return response()->json($permintaan);
        
    }

    public function updateStatus(Request $request, $id)
    {
        $permintaan = Permintaan::findOrFail($id);
        $statusBaru = $request->input('status');

        // Cek jika status berubah ke "ditolak"
        if ($statusBaru === 'ditolak' && $permintaan->status !== 'ditolak') {
            // Ambil semua detail permintaan
            $detailPermintaan = DetailPermintaan::with('barang')->where('id_permintaan', $permintaan->id_permintaan)->get();

            foreach ($detailPermintaan as $detail) {
                $barang = $detail->barang;
                if ($barang) {
                    $barang->stok += $detail->jumlah_minta;
                    $barang->save();
                }
            }
        }

        $permintaan->status = $statusBaru;
        $permintaan->alasan_penolakan = $request->input('alasan');
        $permintaan->save();

        return response()->json(['message' => 'Status updated successfully']);
    }

    public function getNotifikasi(){
        $notif = Permintaan::whereIn('status', ['sedang diproses', 'sedang diantar'])
            ->latest()
            ->limit(10)
            ->get()
            ->map(function ($item) {
                return [
                    'id_permintaan' => $item->id_permintaan,
                    'status' => $item->status,
                    'message' => "Permintaan #{$item->id_permintaan} {$item->status}",
                ];
            });

        return response()->json($notif);
    }

    public function destroy($id)
    {
        $detail = DetailPermintaan::findOrFail($id);
        $detail->delete();

        return response()->json(['message' => 'Permintaan deleted successfully']);
    }
}