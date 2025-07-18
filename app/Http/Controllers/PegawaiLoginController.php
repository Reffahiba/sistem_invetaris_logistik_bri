<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Akun_Pengguna;
use Illuminate\Support\Facades\Auth;

class PegawaiLoginController extends Controller
{
    public function login(){
        return view('pegawai/login');
    }

    public function proses_login(Request $request){
        if(Auth::check()){
            $role = Auth::user()->id_role;

            if($role === 2){
                return redirect('pegawai/dashboard');
            }
        }

        $kredensial = $request->validate([
            'nama_user' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = Akun_Pengguna::where('nama_user', $kredensial['nama_user'])->first();

        if (!$user || !in_array($user->id_role, [2])) {
            return back()->withErrors([
                'nama_user' => 'Akses hanya diperbolehkan untuk pegawai BRI.',
            ]);
        }

        if(Auth::attempt($kredensial)){
            $request->session()->regenerate();

            if($user->id_role === 2){
                return redirect()->intended('pegawai/dashboard');
            }
        }

        return back()->withErrors([
            'nama_user' => 'Kredensial yang dimasukkan tidak sesuai.',
        ]);
    }
}
