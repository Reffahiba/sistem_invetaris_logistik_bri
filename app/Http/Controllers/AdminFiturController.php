<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AkunPengguna;
use App\Models\Divisi;
use App\Models\Barang;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AdminFiturController extends Controller
{
    public $divisi;

    public function __construct(){
        $this->divisi = new Divisi();
    }

    public function dashboard(){
        $user = Auth::user();
        $nama = $user->nama_user;
        $divisi = $user->divisi->nama_divisi;

        $data = [
            'nama' => $nama,
            'divisi' => $divisi,
        ];

        return view('admin.dashboard', $data);
    }

    public function kelolaPermintaan(){
        $user = Auth::user();
        $nama = $user->nama_user;
        $divisi = $user->divisi->nama_divisi;

        $data = [
            'nama' => $nama,
            'divisi' => $divisi,
        ];
        
        return view('admin.permintaan', $data);
    }

    public function kelolaAkun(){
        $akun = AkunPengguna::with('divisi')
            ->where('id_divisi', '!=', 1)
            ->get();
        $user = Auth::user();
        $nama = $user->nama_user;
        $divisi = $user->divisi->nama_divisi;

        $daftarDivisi = Divisi::where('id_divisi', '!=', 1)->get();

        $data = [
            'akun' => $akun,
            'nama' => $nama,
            'divisi' => $divisi,
            'daftarDivisi' => $daftarDivisi,
        ];
        
        return view('admin.kelola-akun', $data);
    }

    public function admin_tambah_akun(Request $request)
    {
        $passwordRules = 'required|string|min:6';
        if ($request->isMethod('PUT')) {
            $passwordRules = 'nullable|string|min:6';
        }

        $validated = $request->validate([
            'nama_user' => 'required|string|max:255',
            'email' => 'required|email|unique:akun_pengguna,email',
            'nomor_telepon' => 'required|string|max:20',
            'password' => $passwordRules,
            'id_divisi' => 'required|exists:divisi,id_divisi',
        ]);

        $akun = AkunPengguna::create([
            'nama_user' => $validated['nama_user'],
            'email' => $validated['email'],
            'nomor_telepon' => $validated['nomor_telepon'],
            'password' => Hash::make($validated['password']),
            'id_divisi' => $validated['id_divisi'],
            'id_role' => 2,
            'remember_token' => null,
        ]);

        return response()->json(['message' => 'Akun berhasil ditambahkan', 'akun' => $akun], 201);
    }

    public function admin_edit_akun(Request $request, $id)
    {
        $akun = AkunPengguna::findOrFail($id);

        $validated = $request->validate([
            'nama_user' => 'required|string|max:255',
            'nomor_telepon' => 'required|string|max:20',
        ]);

        $akun->update($validated);

        return response()->json(['message' => 'Akun berhasil diperbarui', 'akun' => $akun]);
    }

    public function admin_hapus_akun($id)
    {
        $akun = AkunPengguna::findOrFail($id);
        $akun->delete();

        return response()->json(['message' => 'Akun berhasil dihapus']);
    }
}
