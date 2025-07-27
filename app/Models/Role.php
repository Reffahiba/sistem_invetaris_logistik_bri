<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;

    protected $guarded = ['id'];
    protected $table = 'role';
    protected $fillable = ['nama_role'];

    public function user(){
        return $this->hasMany(AkunPengguna::class, 'id_role');
    }

    public function getRole(){
        return $this->whereIn('nama_role', ['pegawai'])->get();
    }
}
