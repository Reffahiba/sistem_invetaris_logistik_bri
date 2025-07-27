<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use App\Models\BarangMasuk;
use App\Models\DetailPermintaan;
use App\Models\Permintaan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Mengambil semua data yang dibutuhkan untuk halaman dashboard.
     */
    public function getDashboardData(Request $request)
    {
        // 1. Data untuk Summary Cards
        $totalBarang = Barang::count();
        $totalBarangMasuk = BarangMasuk::sum('jumlah_masuk');
        $totalBarangKeluar = DetailPermintaan::whereHas('permintaan', function ($query) {
            $query->where('status', 'selesai'); 
        })->sum('jumlah_minta');
        $totalPending = Permintaan::where('status', 'menunggu')->count();

        // 2. Data untuk Pie Chart (Komposisi Kategori)
        $kategoriComposition = DB::table('barang')
            ->join('kategori', 'barang.id_kategori', '=', 'kategori.id_kategori')
            ->select('kategori.nama_kategori as name', DB::raw('COUNT(barang.id_barang) as value'))
            ->groupBy('kategori.nama_kategori')
            ->orderBy('value', 'desc')
            ->get();

        // 3. Data untuk Grafik Garis (Barang Masuk vs Keluar 7 hari terakhir)
        $lineChartData = [];
        $dates = collect();
        // Buat rentang tanggal untuk 7 hari terakhir
        for ($i = 6; $i >= 0; $i--) {
            $dates->put(Carbon::now()->subDays($i)->format('Y-m-d'), 0);
        }

        // Ambil data barang masuk
        $barangMasukData = BarangMasuk::where('tanggal_masuk', '>=', Carbon::now()->subDays(6)->startOfDay())
            ->groupBy('date')
            ->orderBy('date', 'ASC')
            ->get([
                DB::raw('DATE(tanggal_masuk) as date'),
                DB::raw('SUM(jumlah_masuk) as total')
            ])
            ->pluck('total', 'date');

        // Ambil data barang keluar
        $barangKeluarData = DetailPermintaan::whereHas('permintaan', function ($query) {
                $query->where('status', 'selesai')
                      ->where('tanggal_minta', '>=', Carbon::now()->subDays(6)->startOfDay());
            })
            ->join('permintaan', 'detail_permintaan.id_permintaan', '=', 'permintaan.id_permintaan')
            ->groupBy('date')
            ->orderBy('date', 'ASC')
            ->get([
                DB::raw('DATE(permintaan.tanggal_minta) as date'),
                DB::raw('SUM(detail_permintaan.jumlah_minta) as total')
            ])
            ->pluck('total', 'date');

        // Gabungkan semua data menjadi satu array untuk grafik
        foreach ($dates as $date => $value) {
            $lineChartData[] = [
                'tanggal' => Carbon::parse($date)->format('d M'), // Format tanggal (e.g., 27 Jul)
                'masuk' => $barangMasukData[$date] ?? 0,
                'keluar' => $barangKeluarData[$date] ?? 0,
            ];
        }

        // Kembalikan semua data dalam satu respons JSON
        return response()->json([
            'summary' => [
                'totalBarang' => $totalBarang,
                'totalBarangMasuk' => $totalBarangMasuk,
                'totalBarangKeluar' => $totalBarangKeluar,
                'totalPending' => $totalPending,
            ],
            'kategoriComposition' => $kategoriComposition,
            'lineChartData' => $lineChartData,
        ]);
    }
}
