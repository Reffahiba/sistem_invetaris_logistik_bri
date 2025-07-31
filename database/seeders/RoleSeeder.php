<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'nama_role' => 'Admin',
                'deskripsi' => 'Mengelola sistem',
            ],
            [
                'nama_role' => 'Pegawai',
                'deskripsi' => 'Melakukan permintaan barang',
            ],
        ];

        foreach($data as $role){
            Role::create($role);
        }
    }
}
