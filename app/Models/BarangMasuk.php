<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BarangMasuk extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_transaksi';
    protected $table = 'barang_masuk';
    protected $fillable = ['kode_transaksi', 'tanggal_masuk', 'jumlah_masuk', 'deskripsi', 'id_barang'];

    public function barang(){
        return $this->belongsTo(Barang::class, 'id_barang');
    }

    public function getBarangMasuk(){
        return $this->all();
    }
}
