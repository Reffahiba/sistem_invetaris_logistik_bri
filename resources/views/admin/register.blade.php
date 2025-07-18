<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Register</title>
    <link rel="icon" href="{{ asset('assets/img/image.png') }}">
    @vite('resources/css/app.css')
    <style>
        body {
            background-image: url('{{ asset('assets/img/background.png') }}');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
        }
    </style>
</head>
<body>
    <div class="container mx-auto h-screen flex justify-center items-center">
        <div class="w-full max-w-4xl">
            <div class="bg-blue-200 rounded-2xl overflow-hidden flex shadow-2xl border border-rust">
                <div class="w-1/2 justify-center items-center p-8">
                    <img src="{{ asset('assets/img/potter-wheel 1.png') }}" alt="logo-login" class="w-80 h-100 ml-20 mt-28">
                </div>
                <div class="w-1/2 justify-center items-center p-8">
                    <div class="flex flex-col justify-center items-center mr-3 mt-5">
                        <img src="{{ asset('assets/img/craftory-word.png') }}" alt="craftory-word" class="mb-3">
                        <h1 class="font-bold text-3xl my-3 text-blue-600">REGISTER</h1>

                        @if ($errors->any())
                            <div class="alert alert-danger mb-4">
                                <ul>
                                    @foreach ($errors->all() as $error)
                                        <li class="text-red-600">{{ $error }}</li>
                                    @endforeach
                                </ul>
                            </div>
                        @endif

                        <form action="{{ route('admin_register_proses') }}" method="POST" enctype="multipart/form-data">
                            @csrf
                            <div class="flex flex-col justify-center items-center">
                                <input type="text" name="nama_user" id="nama_user" placeholder="Nama Lengkap" class="outline-none px-3 py-2 rounded-full my-2">
                                <input type="email" name="email" id="email" placeholder="Email" class="outline-none px-3 py-2 rounded-full my-2">
                                <input type="tel" name="nomor_telepon" id="nomor_telepon" placeholder="Nomor Telepon" class="outline-none px-3 py-2 rounded-full my-2">
                                <input type="password" name="password" id="password" placeholder="Password" class="outline-none px-3 py-2 rounded-full my-2">
                                <input type="password" name="password_confirmation" id="password_confirmation" placeholder="Re-enter Password" class="outline-none px-3 py-2 rounded-full my-2">
                                <button type="submit" class="bg-blue-600 text-white text-lg rounded-full my-3 px-8 font-semibold">REGISTER</button>
                            </div>
                        </form>
                        <p class="text-sm text-blue-600 font-bold">Sudah punya akun? <a href="/admin_login" class="text-reddish-brown">Login</a></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
</body>
</html>