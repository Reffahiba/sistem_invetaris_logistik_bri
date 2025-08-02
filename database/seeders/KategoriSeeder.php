<?php

namespace Database\Seeders;

use App\Models\Kategori;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class KategoriSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'nama_kategori' => 'Kertas',
                'deskripsi' => 'Jenis-jenis kertas yang digunakan untuk dokumen perbankan seperti formulir, tanda setoran, nota debit/kredit, kuittansi, dan foto.'
            ],
            [
                'nama_kategori' => 'Map',
                'deskripsi' => 'Map atau folder yang digunakan untuk menyimpan dan mengelompokkan dokumen nasabah.'
            ],
            [
                'nama_kategori' => 'Cap',
                'deskripsi' => 'Cap/stempel yang digunakan pada dokumen, termasuk cap tanda tangan dan cap yang telah discan.'
            ],
            [
                'nama_kategori' => 'Sign Here',
                'deskripsi' => 'Label atau penanda pada dokumen yang menunjukkan tempat untuk menandatangani.'
            ],
            [
                'nama_kategori' => 'Amplop Formal',
                'deskripsi' => 'Amplop resmi yang digunakan untuk pengiriman atau penyimpanan dokumen penting.'
            ],
            [
                'nama_kategori' => 'Buku Tabungan',
                'deskripsi' => 'Dokumen resmi yang mencatat transaksi dan saldo tabungan nasabah.'
            ],
            [
                'nama_kategori' => 'Bindeless',
                'deskripsi' => 'Pengikat dokumen yang tidak menggunakan staples atau penjepit logam.'
            ],
            [
                'nama_kategori' => 'Overlay dan Spesifikasi',
                'deskripsi' => 'Lembar tambahan seperti overlay atau dokumen spesifikasi yang menyertai dokumen utama.'
            ]
        ];

        foreach($data as $kategori){
            Kategori::create($kategori);
        }
    }
}
