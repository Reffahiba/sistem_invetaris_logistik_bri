<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use App\Models\BarangMasuk;
use App\Models\DetailPermintaan;
use App\Models\Permintaan;
use App\Models\LogActivity;
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
        $filter = $request->input('filter', 'minggu'); // Default ke 'minggu'
        $lineChartData = [];
        $dates = collect();
        
        $dateFormat = 'd M'; // Format untuk minggu
        $startDate = Carbon::now()->subDays(6)->startOfDay();

        if ($filter === 'bulan') {
            $dateFormat = 'd M'; // Format untuk bulan
            $startDate = Carbon::now()->subDays(29)->startOfDay();
            for ($i = 29; $i >= 0; $i--) {
                $dates->put(Carbon::now()->subDays($i)->format('Y-m-d'), 0);
            }
        } elseif ($filter === 'tahun') {
            $dateFormat = 'M Y'; // Format untuk tahun (e.g., Jul 2025)
            $startDate = Carbon::now()->subMonths(11)->startOfMonth();
            for ($i = 11; $i >= 0; $i--) {
                $dates->put(Carbon::now()->subMonths($i)->format('Y-m-01'), 0);
            }
        } else { // Minggu (default)
            for ($i = 6; $i >= 0; $i--) {
                $dates->put(Carbon::now()->subDays($i)->format('Y-m-d'), 0);
            }
        }

        // Query data barang masuk berdasarkan rentang waktu
        $barangMasukQuery = BarangMasuk::where('tanggal_masuk', '>=', $startDate);
        // Query data barang keluar berdasarkan rentang waktu
        $barangKeluarQuery = DetailPermintaan::whereHas('permintaan', function ($query) use ($startDate) {
            $query->where('status', 'selesai')->where('tanggal_minta', '>=', $startDate);
        })->join('permintaan', 'detail_permintaan.id_permintaan', '=', 'permintaan.id_permintaan');

        // Kelompokkan data berdasarkan format tanggal yang sesuai
        if ($filter === 'tahun') {
            $barangMasukData = $barangMasukQuery
                ->select(DB::raw("DATE_FORMAT(tanggal_masuk, '%Y-%m-01') as date"), DB::raw('SUM(jumlah_masuk) as total'))
                ->groupBy('date')->pluck('total', 'date');
            $barangKeluarData = $barangKeluarQuery
                ->select(DB::raw("DATE_FORMAT(permintaan.tanggal_minta, '%Y-%m-01') as date"), DB::raw('SUM(detail_permintaan.jumlah_minta) as total'))
                ->groupBy('date')->pluck('total', 'date');
        } else {
            $barangMasukData = $barangMasukQuery
                ->select(DB::raw('DATE(tanggal_masuk) as date'), DB::raw('SUM(jumlah_masuk) as total'))
                ->groupBy('date')->pluck('total', 'date');
            $barangKeluarData = $barangKeluarQuery
                ->select(DB::raw('DATE(permintaan.tanggal_minta) as date'), DB::raw('SUM(detail_permintaan.jumlah_minta) as total'))
                ->groupBy('date')->pluck('total', 'date');
        }

        // Gabungkan data
        foreach ($dates as $date => $value) {
            $lineChartData[] = [
                'tanggal' => Carbon::parse($date)->translatedFormat($dateFormat),
                'masuk' => $barangMasukData[$date] ?? 0,
                'keluar' => $barangKeluarData[$date] ?? 0,
            ];
        }

        $logActivities = LogActivity::with('AkunPengguna:id_user,nama_user') // Ambil nama user
            ->latest() // Urutkan dari yang terbaru
            ->take(5) // Batasi hanya 5 data
            ->get();

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
            'logActivities' => $logActivities,
        ]);
    }
}
