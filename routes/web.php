<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminLoginController;
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


// Pegawai
Route::get('/', [PegawaiLoginController::class, 'login'])->name('login');
Route::post('/proses_login', [PegawaiLoginController::class, 'proses_login'])->name('proses_login');
Route::get('/dashboard', [PegawaiLoginController::class, 'dashboard'])->name('dashbord');


// Admin
Route::get('/admin', [AdminLoginController::class, 'admin_login'])->name('admin_login');
Route::post('/admin_proses_login', [AdminLoginController::class, 'admin_proses_login'])->name('admin_proses_login');
Route::get('/admin_register', [AdminLoginController::class, 'admin_register'])->name('admin_register');
Route::post('/admin_register_proses', [AdminLoginController::class, 'admin_register_proses'])->name('admin_register_proses');

Route::get('/admin_dashboard', [AdminLoginController::class, 'admin_dashboard'])->name('admin_dashbord');

