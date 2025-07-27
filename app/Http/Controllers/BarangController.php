<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use App\Models\Kategori;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage; 
use Illuminate\Support\Facades\Validator;

class BarangController extends Controller
{   
    // --- Menampilkan halaman kelola data barang ---
    public function kelolaBarang()
    {
        $user = Auth::user();
        $nama = $user->nama_user;
        $divisi = $user->divisi->nama_divisi;

        $data = [
            'nama' => $nama,
            'divisi' => $divisi,
        ];

        return view('admin.data-barang', $data);
    }

      // --- API READ: Mengambil data barang dengan filter dan pagination ---
    public function apiBarang(Request $request)
    {
        $query = Barang::with('kategori'); // eager load relasi

        if ($request->has('search') && $request->search !== null) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama_barang', 'like', "%$search%");
            });
        }

        if ($request->has('kategori') && $request->kategori !== null && $request->kategori !== 'null') {
            $selectedKategori = $request->kategori;
            $query->whereHas('kategori', function ($qKategori) use ($selectedKategori) {
                $qKategori->where('nama_kategori', $selectedKategori);
            });
        }

        if ($request->has('sortBy') && $request->has('sortOrder')) {
            $query->orderBy($request->sortBy, $request->sortOrder);
        }

        $perPage = $request->get('perPage', 10);

        return response()->json($query->paginate($perPage));
    }

    // --- API CREATE: Menambahkan barang baru ---
    public function tambahBarang(Request $request)
    {   
        Log::info('Request dari frontend:', $request->all());
        // 1. Validasi Input
        $validator = Validator::make($request->all(), [
            'nama_barang' => 'required|string|max:255',
            'id_kategori' => 'required|integer|exists:kategori,id_kategori',
            'stok' => 'required|integer|min:0',
            'satuan' => 'required|string|max:50',
            'gambar_barang' => 'required|image|mimes:jpeg,png,jpg|max:1024',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422); // 422 Unprocessable Entity
        }

        $gambarPath = null;

        // 2. Handle upload File Gambar
        if ($request->hasFile('gambar_barang')) {
            $file = $request->file('gambar_barang');
            // Simpan file ke direktori 'public/barang_images' di storage
            $gambarPath = $file->store('barang_images', 'public'); 
            $gambarPath = Storage::url($gambarPath);
        } 

        $userId = 1;

        // 3. Buat Entri Barang di Database
        $barang = Barang::create([
            'nama_barang' => $request->nama_barang,
            'id_kategori' => $request->id_kategori, 
            'stok' => $request->stok,
            'satuan' => $request->satuan,
            'gambar_barang' => $gambarPath, // Menyimpan URL gambar
            'id_user' => $userId,
        ]);

        Log::info('Data barang yang dibuat:', $barang->toArray());

        // 4. Respons JSON ke frontend
        return response()->json([
            'message' => 'Barang berhasil ditambahkan!',
            'data' => $barang
        ], 201); 
    }

    // --- API UPDATE: Mengedit data barang ---
    public function editBarang(Request $request, $id_barang) 
    {
        // Validasi input
        $validator = Validator::make($request->all(), [
            'nama_barang' => 'required|string|max:255',
            'id_kategori' => 'required|integer|exists:kategori,id_kategori',
            'stok' => 'required|integer|min:0',
            'satuan' => 'required|string|max:50',
            'gambar_barang' => 'nullable|image|mimes:jpeg,png,jpg|max:1024',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        $barang = Barang::find($id_barang);

        if (!$barang) {
            return response()->json(['message' => 'Barang tidak ditemukan.'], 404);
        }

        // Update data barang
        $barang->nama_barang = $request->nama_barang;
        $barang->id_kategori = $request->id_kategori;
        $barang->stok = $request->stok;
        $barang->satuan = $request->satuan;

        // Handle upload gambar jika ada
        if ($request->hasFile('gambar_barang')) {
            // Hapus gambar lama jika ada
            if ($barang->gambar_barang) {
                $pathSegments = explode('/storage/', $barang->gambar_barang);
                if (count($pathSegments) > 1) {
                    $relativePath = $pathSegments[1];
                    Storage::disk('public')->delete($relativePath);
                }
            }
            // Simpan gambar baru
            $file = $request->file('gambar_barang');
            $gambarPath = $file->store('barang_images', 'public');
            $barang->gambar_barang = Storage::url($gambarPath);
        }

        // Simpan perubahan ke database
        $barang->save();

        return response()->json([
            'message' => 'Barang berhasil diperbarui.',
            'data' => $barang
        ], 200);
    }

    // --- API DELETE: Menghapus barang ---
    public function hapusBarang($id_barang) 
    {
        $barang = Barang::find($id_barang);

        if (!$barang) {
            return response()->json(['message' => 'Barang tidak ditemukan.'], 404);
        }

        // Hapus file gambar terkait dari storagea
        if ($barang->gambar_barang) {
            $pathSegments = explode('/storage/', $barang->gambar_barang);
            if (count($pathSegments) > 1) {
                $relativePath = $pathSegments[1];
                Storage::disk('public')->delete($relativePath);
            }
        }

        $barang->delete();
        return response()->json(['message' => 'Barang berhasil dihapus.'], 200);
    }

    public function getAllBarang()
    {
        $barang = Barang::select('id_barang', 'nama_barang')->orderBy('nama_barang')->get();
        return response()->json($barang);
    }

}
