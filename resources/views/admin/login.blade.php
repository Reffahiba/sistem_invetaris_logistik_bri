@extends('layouts.app')

@section('content')
<div class="min-h-screen flex">
    <div x-data="{
            current: 0,
            images: [
                '{{ asset('assets/ilustrasi1.png') }}',
                '{{ asset('assets/ilustrasi2.png') }}',
                '{{ asset('assets/ilustrasi3.png') }}'
            ],
            init() {
                setInterval(() => {
                    this.current = (this.current + 1) % this.images.length
                }, 4000)
            }
        }"
        class="relative w-1/2 bg-gradient-to-br from-primary to-[#036ED1] flex items-center justify-center overflow-hidden"
    >
        <template x-for="(image, index) in images" :key="index">
            <img :src="image" alt="slide"
                class="absolute transition-all duration-700 w-5/6"
                :class="{
                    'opacity-100 scale-100 z-10': current === index,
                    'opacity-0 scale-95 z-0': current !== index
                }"
            >
        </template>
    </div>

    <div class="w-1/2 flex flex-col justify-center px-16 bg-white">
        <div class="w-full max-w-sm mx-auto space-y-6">
            <div>
                <h1 class="text-3xl font-semibold text-gray-800">
                    Welcome Back! <span class="inline-block">👋</span>
                </h1>
                <p class="text-gray-500 mt-2">Login to access your account</p>
            </div>

            @if(session('alert'))
                <script>
                    alert("{{ session('alert') }}");
                </script>
            @endif

            <form class="space-y-5" action="{{ route('admin_proses_login') }}" method="POST">
                @csrf
                {{-- Email --}}
                <label for="Email" class="relative block">
                    <div class="flex items-center relative">
                        <img src="{{ asset('assets/sms.png') }}" alt="User Icon" class="w-6 h-6 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <input
                            type="email"
                            id="Email"
                            name="email"
                            placeholder="Masukkan Email"
                            class="peer w-full pl-12 pr-4 py-3 bg-white border border-gray-200 text-sm text-gray-800
                                rounded-lg shadow-sm focus:outline-none focus:ring-2 
                                focus:ring-blue-400 transition"
                        />
                    </div>
                </label>

                {{-- Password --}}
                <label for="password" class="relative block mt-4">
                    <div class="flex items-center relative">
                        <img src="{{ asset('assets/lock.png') }}" alt="Password Icon" class="w-6 h-6 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Masukkan Password"
                            class="peer w-full pl-12 pr-4 py-3 bg-white border border-gray-200 text-sm text-gray-800
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
                    class="w-full mt-4 bg-[#F46F23] text-white px-4 py-2 rounded-lg shadow-lg shadow-[#F46F23]/40 hover:bg-orange-600 hover:shadow-xl hover:shadow-orange-600/40 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-300 font-semibold"
                >
                    Login
                </button>
            </form>

            <p class="text-center text-sm text-gray-600">
                No account yet? <a href="admin-register" class="text-primary font-medium hover:underline">Sign Up</a>
            </p>
        </div>
    </div>
</div>
@endsection