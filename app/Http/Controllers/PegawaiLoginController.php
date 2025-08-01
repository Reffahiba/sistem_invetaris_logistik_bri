<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AkunPengguna;
use Illuminate\Support\Facades\Auth;

use function Laravel\Prompts\alert;

class PegawaiLoginController extends Controller
{
    public function login(){
        return view('pegawai/login');
    }

    public function proses_login(Request $request){
        if(Auth::guard('pegawai')->check() && Auth::guard('pegawai')->user()->id_role == 2){
            return redirect('dashboard');
        }

        $kredensial = $request->validate([
            'email' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = AkunPengguna::where('email', $kredensial['email'])->first();

        if (!$user || !in_array($user->id_role, [2])) {
            return back()->with('alert', 'Akses hanya diperbolehkan untuk pegawai BRI.');
        }

        if(Auth::guard('pegawai')->attempt($kredensial)){
            $request->session()->regenerate();
            if($user->id_role === 2){
                return redirect()->intended('dashboard');
            }
        }

        return back()->withErrors([
            'nama_user' => 'Kredensial yang dimasukkan tidak sesuai.',
        ]);
        
    }

    public function logout(Request $request){
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/')->with('sukses', 'Telah berhasil logout');
    }
}
