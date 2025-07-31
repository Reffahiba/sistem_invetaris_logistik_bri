<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Divisi;

class DivisiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            'Logistik',
            'RM BRIGuna',
            'RM KPR',
            'MO',
            'AMOL',
            'SLK-Teller',
            'SLO-Cs',
        ];

        foreach($data as $divisi){
            Divisi::create([
                'nama_divisi' => $divisi,
            ]);
        }
    }
}
