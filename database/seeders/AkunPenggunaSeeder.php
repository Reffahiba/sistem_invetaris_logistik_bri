<?php

namespace Database\Seeders;

use App\Models\AkunPengguna;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AkunPenggunaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'nama_user' => 'Ahmad Rizki',
                'email' => 'ahmadrizki@gmail.com',
                'nomor_telepon' => '0812300203020',
                'password' => Hash::make('logistik'),
                'id_divisi' => 1,
                'id_role' => 1,
            ],
        ];

        foreach($data as $akun){
            AkunPengguna::create($akun);
        }
    }
}
