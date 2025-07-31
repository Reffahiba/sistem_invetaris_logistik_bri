@extends('layouts.app')

@section('content')
<div class="min-h-screen flex">
    <div class="w-1/2 bg-gradient-to-br from-primary to-[#036ED1] flex items-center justify-center">
        <img src="{{ asset('assets/illustration.png') }}" alt="login-illustration" class="w-2/3">
    </div>

    <div class="w-1/2 flex flex-col justify-center px-16 bg-white">
        <div class="w-full max-w-sm mx-auto space-y-6">
            <div>
                <h1 class="text-3xl font-semibold text-gray-800">
                    Welcome Back! <span class="inline-block">👋</span>
                </h1>
                <p class="text-gray-500 mt-2">Login to access your account</p>
            </div>

            <form class="space-y-5" action="{{ route('admin_proses_register') }}" method="POST">
                @csrf
                {{-- Username --}}
                <label for="Email" class="relative block">
                    <div class="flex items-center relative">
                        <img src="{{ asset('assets/user.png') }}" alt="User Icon" class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <input
                            type="text"
                            id="nama_user"
                            name="nama_user"
                            placeholder="Masukkan Username"
                            class="peer w-full pl-10 pr-4 py-3 bg-white border border-gray-200 text-sm text-gray-800
                                rounded-lg shadow-sm focus:outline-none focus:ring-2 
                                focus:ring-blue-400 transition"
                        />
                    </div>
                </label>

                {{-- Email --}}
                <label for="Email" class="relative block">
                    <div class="flex items-center relative">
                        <img src="{{ asset('assets/sms.png') }}" alt="User Icon" class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <input
                            type="email"
                            id="Email"
                            name="email"
                            placeholder="Masukkan Email"
                            class="peer w-full pl-10 pr-4 py-3 bg-white border border-gray-200 text-sm text-gray-800
                                rounded-lg shadow-sm focus:outline-none focus:ring-2 
                                focus:ring-blue-400 transition"
                        />
                    </div>
                </label>

                {{-- Nomor Telepon --}}
                <label for="Email" class="relative block">
                    <div class="flex items-center relative">
                        <img src="{{ asset('assets/call.png') }}" alt="User Icon" class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <input
                            type="tel"
                            id="nomor_telepon"
                            name="nomor_telepon"
                            placeholder="Masukkan Nomor Telepon"
                            class="peer w-full pl-10 pr-4 py-3 bg-white border border-gray-200 text-sm text-gray-800
                                rounded-lg shadow-sm focus:outline-none focus:ring-2 
                                focus:ring-blue-400 transition"
                        />
                    </div>
                </label>

                {{-- Password --}}
                <label for="password" class="relative block mt-4">
                    <div class="flex items-center relative">
                        <img src="{{ asset('assets/lock.png') }}" alt="Password Icon" class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Masukkan Password"
                            class="peer w-full pl-10 pr-4 py-3 bg-white border border-gray-200 text-sm text-gray-800
                                    rounded-lg shadow-sm focus:outline-none focus:ring-2 
                                    focus:ring-blue-400 transition"
                        />
                    </div>
                </label>

                {{-- Confirm Password --}}
                <label for="password" class="relative block mt-4">
                    <div class="flex items-center relative">
                        <img src="{{ asset('assets/lock.png') }}" alt="Password Icon" class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <input
                            type="password"
                            id="password_confirmation"
                            name="password_confirmation"
                            placeholder="Masukkan Konfirmasi Password"
                            class="peer w-full pl-10 pr-4 py-3 bg-white border border-gray-200 text-sm text-gray-800
                                    rounded-lg shadow-sm focus:outline-none focus:ring-2 
                                    focus:ring-blue-400 transition"
                        />
                    </div>
                </label>

                {{-- Button --}}
                <button
                    type="submit"
                    class="w-full mt-4 rounded-sm text-white px-4 py-2 shadow-sm transition duration-300 
                    [background:radial-gradient(circle_at_center,#F46F23,#d35400)] 
                    hover:shadow-orange-400/70 hover:shadow-lg 
                    focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-60 font-semibold"
                >
                    Register
                </button>
            </form>

            <p class="text-center text-sm text-gray-600">
                Have account yet? <a href="admin" class="text-primary font-medium hover:underline">Login</a>
            </p>
        </div>
    </div>
</div>
@endsection