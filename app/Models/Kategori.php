<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kategori extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_kategori';
    protected $table = 'kategori';
    protected $fillable = ['nama_kategori', 'deskripsi'];

    public function barang(){
        return $this->hasMany(Barang::class, 'id_kategori');
    }

    public function getKategori(){
        return $this->all();
    }

}
