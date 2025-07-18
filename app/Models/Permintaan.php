<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Permintaan extends Model
{
    use HasFactory;

    protected $guarded = ['id_permintaan'];
    protected $table = 'permintaan';
    protected $fillable = ['tanggal_minta', 'status', 'id_user'];

    public function user(){
        return $this->belongsTo(Akun_Pengguna::class, 'id_user');
    }

    public function detailPermintaan(){
        return $this->hasMany(Akun_Pengguna::class, 'id_permintaan');
    }

    public function getPermintaan(){
        return $this->all();
    }
}
