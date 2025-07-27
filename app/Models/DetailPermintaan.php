<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DetailPermintaan extends Model
{
    use HasFactory;

    protected $guarded = ['id_detail'];
    protected $table = 'detail_permintaan';
    protected $fillable = ['jumlah_minta', 'id_permintaan', 'id_barang'];

    public function permintaan(){
        return $this->belongsTo(Permintaan::class, 'id_permintaan');
    }

    public function barang(){
        return $this->belongsTo(Barang::class, 'id_barang');
    }

    public function getDetailPermintaan(){
        return $this->all();
    }
}
