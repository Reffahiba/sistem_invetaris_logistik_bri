<?php

namespace App\Http\Controllers;

use App\Models\AkunPengguna;
use App\Models\Role;
use App\Models\LogActivity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;

class AdminLoginController extends Controller
{
    public function admin_login(){
        return view('admin/login');
    }

    public function admin_register(){
        $roleModel = new Role();
        $role = $roleModel->getRole();

        if(!$role->contains('nama_role', 'admin')){
            $role->push(new Role(['nama_role' => 'admin']));
        }

        $data = [
            'role' => $role
        ];

        return view('admin/register', $data);
    }

    public function admin_proses_register(Request $request){
        $request->validate([
            'nama_user' => 'required|string|max:255',
            'email' => 'required|email|unique:akun_pengguna,email',
            'nomor_telepon' => 'required|string|regex:/^[0-9]+$/|max:15',
            'password' => 'required|string|confirmed|min:8',
        ]);

        $user = AkunPengguna::create([
            'nama_user' => $request->input('nama_user'),
            'email' => $request->input('email'),
            'nomor_telepon' => $request->input('nomor_telepon'),
            'password' => bcrypt($request->input('password')),
            'id_role' => 1,
            'id_divisi' => 1,
        ]);

        return redirect()->route('admin_login');
    }

    public function admin_proses_login(Request $request){
        if(Auth::guard('admin')->check() && Auth::guard('admin')->user()->id_role == 1){
            return redirect('admin/dashboard');
        }

        $kredensial = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $remember = $request->has('remember');

        $user = AkunPengguna::where('email', $kredensial['email'])->first();

        if (!$user || !in_array($user->id_role, [1])) {
            return back()->with('alert', 'Akses hanya diperbolehkan untuk admin logistik BRI.');
        }

        if(Auth::guard('admin')->attempt($kredensial, $remember)){
            $request->session()->regenerate();
            LogActivity::create([
                'id_user' => Auth::guard('admin')->id(),
                'activity' => 'login',
                'description' => 'ke sistem',
            ]);
            return redirect()->intended('admin/dashboard');
        }

        return back()->withErrors([
            'nama_user' => 'Kredensial yang dimasukkan tidak sesuai.',
        ]);
    }

    public function admin_logout(Request $request){
        Auth::logout();
        LogActivity::create([
            'id_user' => Auth::guard('admin')->id(),
            'activity' => 'logout',
            'description' => 'dari sistem',
        ]);
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/admin')->with('sukses', 'Telah berhasil logout');
    }
}
