@extends('layouts.app')

@section('content')
<div class="min-h-screen flex">
    <div class="w-1/2 bg-gradient-to-br from-primary to-[#036ED1] flex items-center justify-center">
        <img src="{{ asset('assets/illustration.png') }}" alt="login-illustration" class="w-2/3">
    </div>

    <div class="w-1/2 flex flex-col justify-center px-16 bg-white">
        <div class="w-full max-w-md mx-auto space-y-6">
            <div>
                <h1 class="text-3xl font-semibold text-gray-800">
                    Welcome Back! <span class="inline-block">👋</span>
                </h1>
                <p class="text-gray-500 mt-2">Login to access your account</p>
            </div>

            <form class="space-y-5" action="{{ route('proses_login') }}" method="POST">
                @csrf
                {{-- Email --}}
                <label for="Email" class="relative block">
                    <div class="flex items-center relative">
                        <img src="{{ asset('assets/user.png') }}" alt="User Icon" class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
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


                {{-- Remember Me --}}
                <div class="flex items-center justify-between text-sm text-gray-600">
                    <label class="inline-flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" name="remember" class="accent-secondary w-4 h-4" />
                        Remember me
                    </label>
                    <a href="#" 
                        class="underline decoration-gray-400 underline-offset-2 text-sm text-gray-500 hover:text-blue-600 transition">
                        Forgot Password?
                    </a>
                </div>

                {{-- Button --}}
                <button
                    type="submit"
                    class="w-full mt-4 rounded-md text-white px-4 py-2 shadow-md transition duration-300 
                    [background:radial-gradient(circle_at_center,#F46F23,#d35400)] 
                    hover:shadow-orange-400/70 hover:shadow-lg 
                    focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-60 font-bold"
                >
                    Login
                </button>
            </form>
        </div>
    </div>
</div>
@endsection