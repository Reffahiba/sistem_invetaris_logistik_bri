<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\BarangController;
use App\Http\Controllers\KategoriController;
use App\Http\Controllers\StokController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/
                                
Route::get('/admin/dashboard-data', [DashboardController::class, 'getDashboardData']);
Route::get('/admin/barang', [BarangController::class, 'apiBarang'])->name('api_barang');
Route::post('/admin/barang', [BarangController::class, 'tambahBarang'])->name('api_tambah_barang');
Route::delete('/admin/barang/{id}', [BarangController::class, 'hapusBarang'])->name('api_hapus_barang');
Route::put('/admin/barang/{id}', [BarangController::class, 'editBarang'])->name('api_edit_barang');
Route::get('/admin/list-barang', [BarangController::class, 'getAllBarang'])->name('api_get_barang');

Route::get('/admin/kategori', [KategoriController::class, 'indexKategori'])->name('api_kategori');
Route::post('/admin/kategori', [KategoriController::class, 'tambahKategori'])->name('api_tambah_kategori');
Route::delete('/admin/kategori/{id}', [KategoriController::class, 'hapusKategori'])->name('api_hapus_kategori');
Route::put('/admin/kategori/{id}', [KategoriController::class, 'editKategori'])->name('api_edit_kategori');
Route::get('/admin/list-kategori', [KategoriController::class, 'getAllKategoris'])->name('api_get_kategoris');

Route::get('/admin/barang-masuk', [StokController::class, 'index'])->name('api_barang_masuk');
Route::post('/admin/barang-masuk', [StokController::class, 'tambahBarangMasuk'])->name('api_tambah_barang_masuk');
Route::get('/admin/barang-masuk/code-generate', [StokController::class, 'getNewTransactionCode']);

Route::get('/admin/barang-keluar', [StokController::class, 'getBarangKeluar'])->name('api_barang_keluar');


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});




