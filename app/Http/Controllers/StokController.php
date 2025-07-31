<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Routing\Controller as BaseController;
use App\Models\BarangMasuk;
use App\Models\Barang;
use App\Models\DetailPermintaan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class StokController extends BaseController
{
    public function kelolaBarangMasuk()
    {
        $user = Auth::user();
        $nama = $user->nama_user;
        $divisi = $user->divisi->nama_divisi;

        $data = [
            'nama' => $nama,
            'divisi' => $divisi,
        ];

        return view('admin.barang-masuk', $data);
    }
    

    public function index(Request $request)
    {
        $query = BarangMasuk::with('barang:id_barang,nama_barang') 
            ->orderBy($request->input('sortBy', 'tanggal_masuk'), $request->input('sortOrder', 'desc'));

        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->whereHas('barang', function ($q) use ($search) {
                $q->where('nama_barang', 'like', "%{$search}%");
            });
        }
            
        if ($request->has('start_date') && $request->has('end_date')) {
            $startDate = Carbon::parse($request->input('start_date'))->startOfDay();
            $endDate = Carbon::parse($request->input('end_date'))->endOfDay();
            $query->whereBetween('tanggal_masuk', [$startDate, $endDate]);
        }
        
        $transaksi = $query->paginate($request->input('perPage', 10));
        return response()->json($transaksi);
    }

    public function getNewTransactionCode()
    {
        $latest = BarangMasuk::latest('id_transaksi')->first();
        $nextId = $latest ? $latest->id_transaksi + 1 : 1;
        $kode_transaksi = 'IN-' . str_pad($nextId, 4, '0', STR_PAD_LEFT);

        return response()->json(['kode_transaksi' => $kode_transaksi]);
    }

    // Method untuk menyimpan transaksi baru
    public function tambahBarangMasuk(Request $request)
    {
        $request->validate([
            'kode_transaksi' => 'required|string|unique:barang_masuk',
            'tanggal_masuk' => 'required|date',
            'id_barang' => 'required|exists:barang,id_barang',
            'jumlah_masuk' => 'required|integer|min:1',
            'deskripsi' => 'required|string',
        ]);

        DB::transaction(function () use ($request) {
            // 1. Catat transaksi barang masuk
            BarangMasuk::create($request->all());

            // 2. Update stok di tabel barang
            $barang = Barang::find($request->input('id_barang'));
            $barang->stok += $request->input('jumlah_masuk');
            $barang->save();
        });

        return response()->json(['message' => 'Transaksi barang masuk berhasil dicatat.'], 201);
    }

    public function kelolaBarangKeluar()
    {
        $user = Auth::user();
        $nama = $user->nama_user;
        $divisi = $user->divisi->nama_divisi;

        $data = [
            'nama' => $nama,
            'divisi' => $divisi,
        ];

        return view('admin.barang-keluar', $data);
    }

    public function barangKeluar(Request $request)
    {
        // Mulai query dari DetailPermintaan
        $query = DetailPermintaan::with([
                'permintaan:id_permintaan,tanggal_minta,id_user', // Ambil tanggal & id_user dari permintaan
                'permintaan.id_user:id_user,nama_user', // Ambil nama user dari relasi di permintaan
                'barang:id_barang,nama_barang' // Ambil nama barang
            ])
            // Hanya tampilkan permintaan yang sudah disetujui (misalnya status 'selesai')
            ->whereHas('permintaan', function ($q) {
                $q->where('status', 'telah diterima'); // Sesuaikan dengan status Anda
            });

        // Sorting
        $sortBy = $request->input('sortBy', 'tanggal_minta');
        $sortOrder = $request->input('sortOrder', 'desc');

        // Lakukan sorting berdasarkan relasi jika diperlukan
        if ($sortBy === 'peminta') {
            $query->select('detail_permintaan.*') // Hindari ambiguitas kolom id
                    ->join('permintaan', 'detail_permintaan.id_permintaan', '=', 'permintaan.id_permintaan')
                    ->join('users', 'permintaan.id_user', '=', 'akun_pengguna.id_user')
                    ->orderBy('akun_pengguna.nama_user', $sortOrder);
        } elseif ($sortBy === 'barang') {
            $query->select('detail_permintaan.*')
                    ->join('barang', 'detail_permintaan.id_barang', '=', 'barang.id_barang')
                    ->orderBy('barang.nama_barang', $sortOrder);
        } else {
            $query->select('detail_permintaan.*')
                    ->join('permintaan', 'detail_permintaan.id_permintaan', '=', 'permintaan.id_permintaan')
                    ->orderBy('permintaan.tanggal_minta', $sortOrder);
        }

        // Filtering berdasarkan rentang tanggal
        if ($request->has('start_date') && $request->input('start_date')) {
            $query->whereHas('permintaan', function ($q) use ($request) {
                $q->whereDate('tanggal_minta', '>=', Carbon::parse($request->input('start_date')));
            });
        }
        if ($request->has('end_date') && $request->input('end_date')) {
            $query->whereHas('permintaan', function ($q) use ($request) {
                $q->whereDate('tanggal_minta', '<=', Carbon::parse($request->input('end_date')));
            });
        }

        // Filtering berdasarkan pencarian (nama barang atau peminta)
        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->whereHas('barang', function ($subq) use ($search) {
                    $subq->where('nama_barang', 'like', "%{$search}%");
                })->orWhereHas('permintaan.id_user', function ($subq) use ($search) {
                    $subq->where('nama_user', 'like', "%{$search}%");
                });
            });
        }
        
        $transaksi = $query->paginate($request->input('perPage', 10));

        return response()->json($transaksi);
    }
}
