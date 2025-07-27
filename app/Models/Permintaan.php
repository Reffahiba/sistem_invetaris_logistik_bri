<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Permintaan extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_permintaan';
    protected $table = 'permintaan';
    protected $fillable = ['tanggal_minta', 'status', 'id_user'];

    public function user(){
        return $this->belongsTo(Permintaan::class, 'id_user');
    }

    public function detailPermintaan(){
        return $this->hasMany(Permintaan::class, 'id_permintaan');
    }

    public function getPermintaan(){
        return Permintaan::with('detailPermintaan')->where('id_user', Auth::id())->latest()->get();
    }
}
