<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Laporan Barang Masuk</title>
    <style>
        body { font-family: 'Helvetica', sans-serif; font-size: 11px; color: #333; }
        .header-table { width: 100%; border-bottom: 2px solid #333; padding-bottom: 10px; }
        .header-table td { vertical-align: middle; }
        .header-text { text-align: center; }
        .header-text p { margin: 2px 0; font-size: 11px; }
        .info { margin-top: 20px; margin-bottom: 20px; font-size: 10px; }
        .table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .table th, .table td { border: 1px solid #ddd; padding: 7px; text-align: left; }
        .table th { background-color: #f2f2f2; font-weight: bold; }
        
        .footer { 
            position: fixed; 
            bottom: -30px; /* Disesuaikan agar ada ruang untuk nomor halaman */
            left: 0px; 
            right: 0px; 
            height: 50px;
            font-size: 9px; 
            color: #888;
        }
        .footer .page-info {
            text-align: center;
        }

        .logo { 
            width: auto; 
            height: 60px; /* Sesuaikan tinggi logo sesuai kebutuhan */
        }

        .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            z-index: -1000;
            opacity: 0.05;
            pointer-events: none;
        }
        .watermark img {
            width: 400px;
        }
        .report-title {
            text-align: center;
            font-size: 22px;
            font-weight: bold;
            color: #004a99;
            margin-top: 25px;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
 

    <table class="header-table">
        <tr>
            <td style="width: 90px;">
                <img src="/assets/logo-bri.png" alt="Logo BRI" class="logo">
            </td>
            <td class="header-text">
                <p style="font-size: 14px; font-weight: bold; margin:0;">PT. BANK RAKYAT INDONESIA (PERSERO) Tbk.</p>
                <p style="font-size: 12px; font-weight: bold; margin:0;">KANTOR CABANG TANJUNG KARANG</p>
                <p style="font-size: 10px; margin:0;">Jl. Raden Intan No. 51 Tanjung Karang 35118</p>
                <p style="font-size: 10px; margin:0;">Telpon (0721) 260000 (Hunting) Telex 26180 facsimile 262927</p>
            </td>
            {{-- Tambahkan sel kosong di kanan agar teks tetap di tengah --}}
            <td style="width: 90px;"></td> 
        </tr>
    </table>
    
    <h1 class="report-title">Laporan Transaksi Barang Masuk Logistik</h1>
    
    <div class="info">
        <strong>Tanggal Cetak:</strong> {{ $timestamp }} WIB<br>
        <strong>Total Transaksi:</strong> {{ count($data) }}
    </div>

    <table class="table">
        <thead>
            <tr>
                <th>No</th>
                <th>Kode Transaksi</th>
                <th>Tanggal Masuk</th>
                <th>Nama Barang</th>
                <th>Jumlah</th>
                <th>Catatan</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($data as $index => $item)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $item->kode_transaksi }}</td>
                    <td>{{ \Carbon\Carbon::parse($item->tanggal_masuk)->format('d-m-Y') }}</td>
                    <td>{{ $item->barang->nama_barang ?? '-' }}</td>
                    <td>+{{ $item->jumlah_masuk }}</td>
                    <td>{{ $item->deskripsi ?? '-' }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="6" style="text-align: center;">Tidak ada data.</td>
                </tr>
            @endforelse
        </tbody>
    </table>
    
    <div class="footer">
        <table width="100%">
            <tr>
                <td class="page-info" width="50%">
                    "Amanah, Kompeten, Harmonis, Loyal, Adaptif, dan Kolaboratif"
                </td>
            </tr>
        </table>
    </div>
</body>
</html>
