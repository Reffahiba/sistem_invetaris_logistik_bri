<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    @if (Auth::guard('admin')->check())
        <meta name="user-role" content="1">
    @elseif (Auth::guard('pegawai')->check())
        <meta name="user-role" content="2">
    @endif
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
    @vite('resources/css/app.css')
    <title>Sistem Manajemen Inventaris Logistik - BRI KC Tanjung Karang</title>
</head>
<body>
    @yield('content')

    @viteReactRefresh
    @stack('scripts')
</body>
</html>