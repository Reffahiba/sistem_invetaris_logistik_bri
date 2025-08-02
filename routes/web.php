<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminFiturController;
use App\Http\Controllers\AdminLoginController;
use App\Http\Controllers\AjukanPermintaanController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\BarangController;
use App\Http\Controllers\KategoriController;
use App\Http\Controllers\StokController;
use App\Http\Controllers\PegawaiFiturController;
use App\Http\Controllers\PegawaiLoginController;
use App\Http\Controllers\DashboardPegawaiController;
use App\Http\Controllers\RiwayatPermintaanController;
use App\Http\Controllers\LacakPermintaanController;
use App\Http\Controllers\PermintaanController;
use App\Http\Controllers\NotifikasiController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// ---------------- Admin Pages ----------------
Route::middleware(['auth:admin', 'prevent.back.history'])->group(function () {
    Route::get('/admin/dashboard', [AdminFiturController::class, 'dashboard'])->name('admin-dashboard');
    Route::get('/dashboard-data', [AdminFiturController::class, 'getDashboardData']);
    Route::get('/admin/data-barang', [BarangController::class, 'kelolaBarang'])->name('admin-barang');
    Route::get('/admin/data-kategori', [KategoriController::class, 'kelolaKategori'])->name('admin-kategori');
    Route::get('/admin/barang-masuk', [StokController::class, 'kelolaBarangMasuk'])->name('admin-barang-masuk');
    Route::get('/admin/barang-keluar', [StokController::class, 'kelolaBarangKeluar'])->name('admin-barang-keluar');
    Route::get('/admin/permintaan', [PermintaanController::class, 'kelolaPermintaan'])->name('admin-permintaan');
    Route::get('/admin/kelola-akun', [AdminFiturController::class, 'kelolaAkun'])->name('admin-kelola-akun');
    Route::patch('/admin/update-status/{id}', [PermintaanController::class, 'updateStatus'])->name('admin-update-status');

    Route::post('/admin-tambah-akun', [AdminFiturController::class, 'admin_tambah_akun'])->name('admin_tambah_akun');
    Route::put('/admin-edit-akun/{id}', [AdminFiturController::class, 'admin_edit_akun'])->name('admin_edit_akun');
    Route::delete('/admin-hapus-akun/{id}', [AdminFiturController::class, 'admin_hapus_akun'])->name('admin_hapus_akun');

    Route::get('admin/barang-masuk/preview-pdf', [StokController::class, 'previewBarangMasukPdf'])
        ->name('admin.barang-masuk.preview-pdf');
    Route::get('admin/barang-masuk/export-excel', [StokController::class, 'exportBarangMasukExcel'])
        ->name('admin.barang-masuk.export-excel');
    Route::get('admin/barang-keluar/preview-pdf', [StokController::class, 'previewBarangKeluarPdf'])
        ->name('admin.barang-keluar.preview-pdf');
    Route::get('admin/barang-keluar/export-excel', [StokController::class, 'exportBarangKeluarExcel'])
        ->name('admin.barang-keluar.export-excel');

});


// ---------------- Admin Data ----------------
Route::middleware(['auth:admin'])->prefix('api/admin')->group(function () {
    Route::get('/dashboard-data', [DashboardController::class, 'getDashboardData']);
    Route::get('/barang', [BarangController::class, 'apiBarang'])->name('api_barang');
    Route::post('/barang', [BarangController::class, 'tambahBarang'])->name('api_tambah_barang');
    Route::delete('/barang/{id}', [BarangController::class, 'hapusBarang'])->name('api_hapus_barang');
    Route::put('/barang/{id}', [BarangController::class, 'editBarang'])->name('api_edit_barang');
    Route::get('/list-barang', [BarangController::class, 'getAllBarang'])->name('api_get_barang');

    Route::get('/kategori', [KategoriController::class, 'indexKategori'])->name('api_kategori');
    Route::post('/kategori', [KategoriController::class, 'tambahKategori'])->name('api_tambah_kategori');
    Route::delete('/kategori/{id}', [KategoriController::class, 'hapusKategori'])->name('api_hapus_kategori');
    Route::put('/kategori/{id}', [KategoriController::class, 'editKategori'])->name('api_edit_kategori');
    Route::get('/list-kategori', [KategoriController::class, 'getAllKategoris'])->name('api_get_kategoris');

    Route::get('/barang-masuk', [StokController::class, 'index'])->name('api_barang_masuk');
    Route::post('/barang-masuk', [StokController::class, 'tambahBarangMasuk'])->name('api_tambah_barang_masuk');
    Route::get('/barang-masuk/code-generate', [StokController::class, 'getNewTransactionCode']);

    Route::get('/barang-keluar', [StokController::class, 'getBarangKeluar'])->name('api_barang_keluar');

    Route::get('/notifications/unread', [NotifikasiController::class, 'getUnread']);
    Route::post('/notifications/{id}/read', [NotifikasiController::class, 'markAsRead']);
    Route::post('/notifications/read-all', [NotifikasiController::class, 'markAllAsRead']);

});

// Login dan register admin (tidak perlu middleware karena belum login)
Route::get('/admin', [AdminLoginController::class, 'admin_login'])->name('admin_login');
Route::post('/admin-proses-login', [AdminLoginController::class, 'admin_proses_login'])->name('admin_proses_login');
Route::get('/admin-register', [AdminLoginController::class, 'admin_register'])->name('admin_register');
Route::post('/admin-register-proses', [AdminLoginController::class, 'admin_proses_register'])->name('admin_proses_register');
Route::post('/admin-logout', [AdminLoginController::class, 'admin_logout'])->name('admin-logout');

// ---------------- Pegawai ----------------
Route::middleware(['auth:pegawai'])->group(function () {
    Route::get('/dashboard', [DashboardPegawaiController::class, 'dashboard'])->name('dashbord');
    Route::get('/ajukan-permintaan', [AjukanPermintaanController::class, 'ajukanPermintaan'])->name('ajukan_permintaan');
    Route::post('/simpan-permintaan', [AjukanPermintaanController::class, 'simpanPermintaan'])->name("simpan_permintaan");
    Route::get('/lacak-permintaan', [LacakPermintaanController::class, 'lacakPermintaan'])->name('lacak_permintaan');
    Route::patch('/lacak-permintaan/{id}', [LacakPermintaanController::class, 'updateStatusPermintaan'])->name('update_status_permintaan');
    Route::get('/riwayat-permintaan', [RiwayatPermintaanController::class, 'riwayatPermintaan'])->name('riwayat_permintaan');
    Route::get('/notifikasi/unread', [NotifikasiController::class, 'belumDibaca'])->name('notifikasi_unread');
    Route::post('/notifikasi/{id}/read', [NotifikasiController::class, 'tandaiDibaca'])->name('notifikasi_read');
    Route::post('/notifikasi/read-all', [NotifikasiController::class, 'dibacaSemua'])->name('notifikasi_read_all');
});

// Login pegawai (tanpa middleware)
Route::get('/', [PegawaiLoginController::class, 'login'])->name('login');
Route::post('/proses-login', [PegawaiLoginController::class, 'proses_login'])->name('proses_login');
Route::post('/logout', [PegawaiLoginController::class, 'logout'])->name('logout');

// ---------------- Error Pages ----------------
Route::fallback(function () {
  return view('errors.404'); 
});