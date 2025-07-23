<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminFiturController;
use App\Http\Controllers\AdminLoginController;
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
    Route::get('/admin_dashboard', [AdminFiturController::class, 'admin_dashboard'])->name('admin_dashbord');
    Route::get('/admin_data_barang', [AdminFiturController::class, 'admin_data_barang'])->name('admin_data_barang');
    Route::get('/admin_permintaan', [AdminFiturController::class, 'admin_permintaan'])->name('admin_permintaan');
    Route::get('/admin_kelola_akun', [AdminFiturController::class, 'admin_kelola_akun'])->name('admin_kelola_akun');

    Route::post('/admin_tambah_akun', [AdminFiturController::class, 'admin_tambah_akun'])->name('admin_tambah_akun');
    Route::put('/admin_edit_akun/{id}', [AdminFiturController::class, 'admin_edit_akun'])->name('admin_edit_akun');
    Route::delete('/admin_hapus_akun/{id}', [AdminFiturController::class, 'admin_hapus_akun'])->name('admin_hapus_akun');
});

// Login dan register admin (tidak perlu middleware karena belum login)
Route::get('/admin', [AdminLoginController::class, 'admin_login'])->name('admin_login');
Route::post('/admin_proses_login', [AdminLoginController::class, 'admin_proses_login'])->name('admin_proses_login');
Route::get('/admin_register', [AdminLoginController::class, 'admin_register'])->name('admin_register');
Route::post('/admin_register_proses', [AdminLoginController::class, 'admin_proses_register'])->name('admin_proses_register');
Route::post('/admin_logout', [AdminLoginController::class, 'admin_logout'])->name('admin.logout');

// ---------------- Pegawai ----------------
Route::middleware(['auth:pegawai'])->group(function () {
    Route::get('/dashboard', [PegawaiFiturController::class, 'dashboard'])->name('dashbord');
    Route::get('/ajukan_permintaan', [PegawaiFiturController::class, 'ajukan_permintaan'])->name('ajukan_permintaan');
});

// Login pegawai (tanpa middleware)
Route::get('/', [PegawaiLoginController::class, 'login'])->name('login');
Route::post('/proses_login', [PegawaiLoginController::class, 'proses_login'])->name('proses_login');