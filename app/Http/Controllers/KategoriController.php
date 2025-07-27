<?php

namespace App\Http\Controllers;

use App\Models\Kategori;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class KategoriController extends Controller
{   
    public function kelolaKategori()
    {
        $user = Auth::user();
        $nama = $user->nama_user;
        $divisi = $user->divisi->nama_divisi;

        $data = [
            'nama' => $nama,
            'divisi' => $divisi,
        ];

        return view('admin.data-kategori', $data);
    }

    public function indexKategori(Request $request)
    {
        $search = $request->input('search', '');
        $perPage = $request->input('perPage', 10);
        $sortBy = $request->input('sortBy', 'nama_kategori');
        $sortOrder = $request->input('sortOrder', 'asc');

        $query = Kategori::query()
            ->when($search, function ($q) use ($search) {
                $q->where('nama_kategori', 'like', "%{$search}%")
                  ->orWhere('deskripsi', 'like', "%{$search}%");
            })
            ->orderBy($sortBy, $sortOrder);

        $kategori = $query->paginate($perPage);

        return response()->json($kategori);
    }

    /**
     * Menyimpan kategori baru.
     */
    public function tambahKategori(Request $request)
    {
        $request->validate([
            'nama_kategori' => 'required|string|max:255|unique:kategori,nama_kategori',
            'deskripsi' => 'required|string',
        ]);

        $kategori = Kategori::create($request->all());

        return response()->json($kategori, 201);
    }

    /**
     * Memperbarui kategori yang ada.
     */
    public function editKategori(Request $request, $id_kategori)
    {
        $kategori = Kategori::findOrFail($id_kategori);

        $request->validate([
            'nama_kategori' => 'required|string|max:255|unique:kategori,nama_kategori,' . $kategori->id_kategori . ',id_kategori',
            'deskripsi' => 'required|string',
        ]);

        $kategori->update($request->all());

        return response()->json($kategori);
    }

    /**
     * Menghapus kategori.
     */
    public function hapusKategori($id_kategori)
    {
        $kategori = Kategori::findOrFail($id_kategori);
        $kategori->delete();

        return response()->json(['message' => 'Kategori berhasil dihapus.']);
    }

    public function getAllKategoris()
    {
        $kategoris = Kategori::select('id_kategori', 'nama_kategori')->orderBy('nama_kategori')->get();
        return response()->json($kategoris);
    }
}
