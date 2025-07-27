<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminFiturController;
use App\Http\Controllers\AdminLoginController;
use App\Http\Controllers\BarangController;
use App\Http\Controllers\KategoriController;
use App\Http\Controllers\StokController;
use App\Http\Controllers\PegawaiFiturController;
use App\Http\Controllers\PegawaiLoginController;

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

// Route::get('/', function () {
//     return view('welcome');
// });

Route::get('/test-env', function () {
    return env('DB_USERNAME');
});


Route::middleware(['auth:admin'])->group(function () {
    Route::get('/admin/dashboard', [AdminFiturController::class, 'dashboard'])->name('admin-dashboard');
    Route::get('/admin/data-barang', [BarangController::class, 'kelolaBarang'])->name('admin-barang');
    Route::get('/admin/data-kategori', [KategoriController::class, 'kelolaKategori'])->name('admin-kategori');
    Route::get('/admin/barang-masuk', [StokController::class, 'kelolaBarangMasuk'])->name('admin-barang-masuk');
    Route::get('/admin/barang-keluar', [StokController::class, 'kelolaBarangKeluar'])->name('admin-barang-keluar');
    Route::get('/admin-permintaan', [AdminFiturController::class, 'kelolaPermintaan'])->name('admin-permintaan');
    Route::get('/admin-kelola-akun', [AdminFiturController::class, 'kelolaAkun'])->name('admin-kelola-akun');

    Route::post('/admin-tambah-akun', [AdminFiturController::class, 'admin_tambah_akun'])->name('admin_tambah_akun');
    Route::put('/admin-edit-akun/{id}', [AdminFiturController::class, 'admin_edit_akun'])->name('admin_edit_akun');
    Route::delete('/admin-hapus-akun/{id}', [AdminFiturController::class, 'admin_hapus_akun'])->name('admin_hapus_akun');
});

// Login dan register admin (tidak perlu middleware karena belum login)
Route::get('/admin', [AdminLoginController::class, 'admin_login'])->name('admin_login');
Route::post('/admin-proses-login', [AdminLoginController::class, 'admin_proses_login'])->name('admin_proses_login');
Route::get('/admin-register', [AdminLoginController::class, 'admin_register'])->name('admin_register');
Route::post('/admin-register-proses', [AdminLoginController::class, 'admin_proses_register'])->name('admin_proses_register');
Route::post('/admin-logout', [AdminLoginController::class, 'admin_logout'])->name('admin-logout');

// ---------------- Pegawai ----------------
Route::middleware(['auth:pegawai'])->group(function () {
    Route::get('/dashboard', [PegawaiFiturController::class, 'dashboard'])->name('dashbord');
    Route::get('/ajukan-permintaan', [PegawaiFiturController::class, 'ajukan_permintaan'])->name('ajukan_permintaan');
    Route::get('/lacak-permintaan', [PegawaiFiturController::class, 'lacak_permintaan'])->name('lacak_permintaan'); 
});

// Login pegawai (tanpa middleware)
Route::get('/', [PegawaiLoginController::class, 'login'])->name('login');
Route::post('/proses-login', [PegawaiLoginController::class, 'proses_login'])->name('proses_login');
Route::post('/logout', [PegawaiLoginController::class, 'logout'])->name('logout');