<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\Barang;
use App\Models\Divisi;
use App\Models\Permintaan;
use App\Models\DetailPermintaan;
use App\Models\AkunPengguna;
use App\Models\Notifikasi;

class AjukanPermintaanController extends Controller
{

    public $divisi;
    public $barang;
    public $permintaan;
    public $detail_permintaan;

    public function __construct(){
        $this->divisi = new Divisi();
        $this->barang = new Barang();
        $this->permintaan = new Permintaan();
        $this->detail_permintaan = new DetailPermintaan();
    }

    public function ajukan_permintaan(Request $request){
        $user = Auth::user();
        $nama = $user->nama_user;
        $divisi = $user->divisi->nama_divisi;

        $kategori = $request->input('kategori');

        $query = Barang::with('kategori');

        if ($kategori) {
            $query->whereHas('kategori', function ($q) use ($kategori) {
                $q->where('nama_kategori', $kategori);
            });
        }

        $barang = $query->get();

        // Ambil daftar kategori unik
        $kategoriList = DB::table('barang')
            ->join('kategori', 'barang.id_kategori', '=', 'kategori.id_kategori')
            ->select('kategori.nama_kategori')
            ->distinct()
            ->pluck('nama_kategori');

        // Jika request dari axios (expects JSON)
        if ($request->expectsJson()) {
            return response()->json([
                'barang' => $barang,
                'kategoriList' => $kategoriList,
                'nama' => $nama,
                'divisi' => $divisi,
            ]);
        }

        $data = [
            'nama' => $nama,
            'divisi' => $divisi,
            'barang' => $barang,
            'kategori' => $kategori,
            'kategoriList' => $kategoriList,
        ];
        
        return view('pegawai.ajukan_permintaan', $data);
    }

    public function simpan_permintaan(Request $request){
        $user = Auth::user();
        $id_barang = $request->input('id_barang');
        $jumlah_minta = $request->input('jumlah_minta');

        DB::beginTransaction(); // Gunakan transaksi untuk menjaga konsistensi data

        try {
            // Cek dan kurangi stok
            $barang = Barang::findOrFail($id_barang);
            if ($barang->stok < $jumlah_minta) {
                DB::rollBack();
                return response()->json(['error' => 'Stok tidak mencukupi.'], 400);
            }

            // Simpan ke tabel permintaan
            $permintaan = Permintaan::create([
                'id_user' => $user->id_user,
                'tanggal_minta' => now(),
                'status' => "menunggu",
            ]);

            DetailPermintaan::create([
                'id_permintaan' => $permintaan->id_permintaan,
                'id_barang' => $id_barang,
                'jumlah_minta' => $jumlah_minta,
            ]);
            

            // Kurangi stok
            $barang->stok -= $jumlah_minta;
            $barang->save();

            // NOTIFIKASI KE ADMIN
            $admins = AkunPengguna::where('id_role', 1)->get(); 
            $peminta = $user->nama_user;

            foreach ($admins as $admin) {
                Notifikasi::create([
                    'id_user' => $admin->id_user,
                    'pesan' => "Permintaan barang baru #{$permintaan->id_permintaan} dari {$peminta}",
                    'link' => '/admin/permintaan',
                ]);
            }

            DB::commit(); // Commit transaksi jika semua berhasil

            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            DB::rollBack(); // Rollback jika terjadi error
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
