<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Barang extends Model
{
    use HasFactory;

    protected $guarded = ['id_barang'];
    protected $table = 'barang';
    protected $primaryKey = 'id_barang';
    protected $fillable = ['gambar_barang', 'nama_barang', 'stok', 'satuan', 'id_kategori', 'id_user'];

    public function barangMasuk(){
        return $this->hasMany(BarangMasuk::class, 'id_barang', 'id_barang');
    }

    public function kategori(){
        return $this->belongsTo(Kategori::class, 'id_kategori', 'id_kategori');
    }

    public function user(){
        return $this->belongsTo(Akun_Pengguna::class, 'id_user');
    }

    public function getBarang(){
        return Barang::with('kategori')->get();
    }
}
