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
    /**
     * Menampilkan halaman untuk mengelola barang masuk.
     *
     * @return \Illuminate\View\View
     */
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
    
    /**
     * Mengambil data barang masuk dengan filter, sorting, dan pagination.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
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

    /**
     * Menghasilkan kode transaksi baru untuk barang masuk.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getNewTransactionCode()
    {
        $latest = BarangMasuk::latest('id_transaksi')->first();
        $nextId = $latest ? $latest->id_transaksi + 1 : 1;
        $kode_transaksi = 'IN-' . str_pad($nextId, 4, '0', STR_PAD_LEFT);

        return response()->json(['kode_transaksi' => $kode_transaksi]);
    }

    /**
     * Menambahkan transaksi barang masuk ke database.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
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

    /**
     * Menampilkan halaman untuk mengelola barang keluar.
     *
     * @return \Illuminate\View\View
     */
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

    /**
     * Mengambil data barang keluar dengan filter, sorting, dan pagination.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getBarangKeluar(Request $request)
    {
        // Mulai query dari DetailPermintaan
        $query = DetailPermintaan::with([
                'permintaan:id_permintaan,tanggal_minta,id_user', // Ambil tanggal & id_user dari permintaan
                'permintaan.akun_pengguna:id_user,nama_user', // Ambil nama user dari relasi di permintaan
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
                    ->join('akun_pengguna', 'permintaan.id_user', '=', 'akun_pengguna.id_user')
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
                // Cari di relasi 'barang'
                $q->whereHas('barang', function ($subq) use ($search) {
                    $subq->where('nama_barang', 'like', "%{$search}%");
                })
                // Cari di relasi bersarang 'permintaan.user'
                ->orWhereHas('permintaan.akun_pengguna', function ($subq) use ($search) {
                    $subq->where('nama_user', 'like', "%{$search}%");
                });
            });
        }
        
        $transaksi = $query->paginate($request->input('perPage', 10));

        return response()->json($transaksi);
    }

    /**
     * Menghasilkan pratinjau PDF untuk data barang masuk.
     */
    public function previewBarangMasukPdf(Request $request)
    {

        $query = BarangMasuk::query()->with('barang:id_barang,nama_barang');

        if ($request->filled('start_date') && $request->filled('end_date')) {
            $startDate = Carbon::parse($request->input('start_date'))->startOfDay();
            $endDate = Carbon::parse($request->input('end_date'))->endOfDay();
            $query->whereBetween('tanggal_masuk', [$startDate, $endDate]);
        }
        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('barang', function ($q) use ($search) {
                $q->where('nama_barang', 'like', "%{$search}%");
            });
        }
        
        $data = $query->orderBy($request->input('sortBy', 'tanggal_masuk'), $request->input('sortOrder', 'desc'))->get();
            
        // Kirim data ke view Blade
        return view('exports.barang_masuk_pdf', [
            'data' => $data,
            'timestamp' => Carbon::now()->translatedFormat('d F Y, H:i'),
            'filters' => $request->all()
        ]);
    }

    /**
     * Menghasilkan dan mengunduh file CSV data barang masuk.
     */
    public function exportBarangMasukExcel(Request $request)
    {
        $fileName = 'laporan-barang-masuk-' . Carbon::now()->format('Ymd-His') . '.csv';

        // 1. Ambil data dari database dengan menerapkan filter dari request
        $query = BarangMasuk::query()->with('barang:id_barang,nama_barang');

        // Terapkan filter tanggal jika ada
        if ($request->filled('start_date') && $request->filled('end_date')) {
            $startDate = Carbon::parse($request->input('start_date'))->startOfDay();
            $endDate = Carbon::parse($request->input('end_date'))->endOfDay();
            $query->whereBetween('tanggal_masuk', [$startDate, $endDate]);
        }

        // Terapkan filter pencarian jika ada
        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('barang', function ($q) use ($search) {
                $q->where('nama_barang', 'like', "%{$search}%");
            });
        }
        
        // Ambil semua data yang cocok (tanpa paginasi)
        $data = $query->orderBy($request->input('sortBy', 'tanggal_masuk'), $request->input('sortOrder', 'desc'))->get();

        // 2. Siapkan header untuk file CSV
        $headers = [
            'Content-type'        => 'text/csv',
            'Content-Disposition' => "attachment; filename=$fileName",
            'Pragma'              => 'no-cache',
            'Cache-Control'       => 'must-revalidate, post-check=0, pre-check=0',
            'Expires'             => '0'
        ];

        // 3. Buat file CSV menggunakan fungsi bawaan PHP
        $callback = function() use ($data) {
            $file = fopen('php://output', 'w');

            // Tulis baris header
            fputcsv($file, [
                'ID Transaksi',
                'Kode Transaksi',
                'Tanggal Masuk',
                'Nama Barang',
                'Jumlah Masuk',
                'Deskripsi',
            ]);

            // Tulis setiap baris data
            foreach ($data as $transaksi) {
                fputcsv($file, [
                    $transaksi->id_transaksi,
                    $transaksi->kode_transaksi,
                    Carbon::parse($transaksi->tanggal_masuk)->format('d-m-Y'),
                    $transaksi->barang->nama_barang ?? '-',
                    $transaksi->jumlah_masuk,
                    $transaksi->deskripsi,
                ]);
            }

            fclose($file);
        };

        // 4. Kembalikan respons sebagai stream
        return response()->stream($callback, 200, $headers);
    }

    public function previewBarangKeluarPdf(Request $request)
    {
        // Gunakan eager loading untuk memuat relasi, bukan join manual untuk data
        $query = DetailPermintaan::with([
            'permintaan:id_permintaan,tanggal_minta,id_user',
            'permintaan.akun_pengguna:id_user,nama_user',
            'barang:id_barang,nama_barang'
        ])->whereHas('permintaan', function ($q) {
            $q->where('status', 'telah diterima');
        });

        // Terapkan filter tanggal
        if ($request->filled('start_date') && $request->filled('end_date')) {
            $startDate = Carbon::parse($request->input('start_date'))->startOfDay();
            $endDate = Carbon::parse($request->input('end_date'))->endOfDay();
            $query->whereHas('permintaan', function ($q) use ($startDate, $endDate) {
                $q->whereBetween('tanggal_minta', [$startDate, $endDate]);
            });
        }

        // Terapkan filter pencarian
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->whereHas('barang', function ($subq) use ($search) {
                    $subq->where('nama_barang', 'like', "%{$search}%");
                })->orWhereHas('permintaan.akun_pengguna', function ($subq) use ($search) {
                    $subq->where('nama_user', 'like', "%{$search}%");
                });
            });
        }

        // Lakukan join HANYA untuk sorting jika diperlukan
        $sortBy = $request->input('sortBy', 'tanggal_minta');
        $sortOrder = $request->input('sortOrder', 'desc');
        
        $query->select('detail_permintaan.*')
              ->join('permintaan', 'detail_permintaan.id_permintaan', '=', 'permintaan.id_permintaan');

        if ($sortBy === 'peminta') {
            $query->join('akun_pengguna', 'permintaan.id_user', '=', 'akun_pengguna.id_user')
                  ->orderBy('akun_pengguna.nama_user', $sortOrder);
        } elseif ($sortBy === 'barang') {
            $query->join('barang', 'detail_permintaan.id_barang', '=', 'barang.id_barang')
                  ->orderBy('barang.nama_barang', $sortOrder);
        } else {
            $query->orderBy('permintaan.tanggal_minta', $sortOrder);
        }

        $data = $query->get();
            
        return view('exports.barang_keluar_pdf', [
            'data' => $data,
            'timestamp' => Carbon::now()->translatedFormat('d F Y, H:i'),
            'filters' => $request->all()
        ]);
    }

    /**
     * Menghasilkan dan mengunduh file CSV data barang keluar.
     */
    public function exportBarangKeluarExcel(Request $request)
    {
        $fileName = 'laporan-barang-keluar-' . Carbon::now()->format('Ymd-His') . '.csv';

        // Query awal
        $query = DetailPermintaan::with([
            'permintaan:id_permintaan,id_user,tanggal_minta', // pastikan juga include id_user
            'permintaan.akun_pengguna:id_user,nama_user',
            'barang:id_barang,nama_barang'
        ])->whereHas('permintaan', function ($q) {
            $q->where('status', 'telah diterima');
        });

        // Filter tanggal
        if ($request->filled('start_date') && $request->filled('end_date')) {
            $startDate = Carbon::parse($request->start_date)->startOfDay();
            $endDate = Carbon::parse($request->end_date)->endOfDay();
            $query->whereHas('permintaan', function ($q) use ($startDate, $endDate) {
                $q->whereBetween('tanggal_minta', [$startDate, $endDate]);
            });
        }

        // Filter pencarian
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->whereHas('barang', function ($subq) use ($search) {
                    $subq->where('nama_barang', 'like', "%{$search}%");
                })->orWhereHas('akun_pengguna', function ($subq) use ($search) {
                    $subq->where('nama_user', 'like', "%{$search}%");
                });
            });
        }

        // Sorting dengan relasi
        $sortBy = $request->input('sortBy', 'tanggal_minta');
        $sortOrder = $request->input('sortOrder', 'desc');

        if ($sortBy === 'tanggal_minta') {
            $query->join('permintaan', 'detail_permintaan.id_permintaan', '=', 'permintaan.id_permintaan')
                ->orderBy('permintaan.tanggal_minta', $sortOrder)
                ->select('detail_permintaan.*'); // pastikan hanya kolom dari detail_permintaan yang di-select untuk hindari konflik
        }

        $data = $query->get();

        // Header CSV
        $headers = [
            'Content-type'        => 'text/csv',
            'Content-Disposition' => "attachment; filename=$fileName",
            'Pragma'              => 'no-cache',
            'Cache-Control'       => 'must-revalidate, post-check=0, pre-check=0',
            'Expires'             => '0'
        ];

        // Isi file
        $callback = function () use ($data) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['ID Permintaan', 'Tanggal', 'Peminta', 'Barang', 'Jumlah Keluar']);

            foreach ($data as $transaksi) {
                fputcsv($file, [
                    $transaksi->permintaan->id_permintaan ?? '-',
                    Carbon::parse($transaksi->permintaan->tanggal_minta ?? now())->format('d-m-Y'),
                    $transaksi->permintaan->akun_pengguna->nama_user ?? '-',
                    $transaksi->barang->nama_barang ?? '-',
                    $transaksi->jumlah_minta ?? 0,
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
