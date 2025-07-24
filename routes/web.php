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
    Route::get('/admin-dashboard', [AdminFiturController::class, 'admin_dashboard'])->name('admin_dashbord');
    Route::get('/admin-data_barang', [AdminFiturController::class, 'admin_data_barang'])->name('admin_data_barang');
    Route::get('/admin-permintaan', [AdminFiturController::class, 'admin_permintaan'])->name('admin_permintaan');
    Route::get('/admin-kelola-akun', [AdminFiturController::class, 'admin_kelola_akun'])->name('admin_kelola_akun');

    Route::post('/admin-tambah-akun', [AdminFiturController::class, 'admin_tambah_akun'])->name('admin_tambah_akun');
    Route::put('/admin-edit-akun/{id}', [AdminFiturController::class, 'admin_edit_akun'])->name('admin_edit_akun');
    Route::delete('/admin-hapus-akun/{id}', [AdminFiturController::class, 'admin_hapus_akun'])->name('admin_hapus_akun');
});

// Login dan register admin (tidak perlu middleware karena belum login)
Route::get('/admin', [AdminLoginController::class, 'admin_login'])->name('admin_login');
Route::post('/admin-proses-login', [AdminLoginController::class, 'admin_proses_login'])->name('admin_proses_login');
Route::get('/admin-register', [AdminLoginController::class, 'admin_register'])->name('admin_register');
Route::post('/admin-register-proses', [AdminLoginController::class, 'admin_proses_register'])->name('admin_proses_register');
Route::post('/admin-logout', [AdminLoginController::class, 'admin_logout'])->name('admin.logout');

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