<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class AkunPengguna extends Authenticatable
{
    use HasFactory;
    use Notifiable;

    protected $guarded = ['id_user'];
    protected $table = 'akun_pengguna';
    protected $primaryKey = 'id_user';
    protected $fillable = ['nama_user', 'email', 'nomor_telepon', 'password', 'remember_token', 'id_divisi', 'id_role'];
    protected $hidden = [
        'password',
    ];

    public function divisi(){
        return $this->belongsTo(Divisi::class, 'id_divisi', 'id_divisi');
    }

    public function role(){
        return $this->belongsTo(Role::class, 'id_role', 'id_role');
    }


    public function getUser($id_user = null){
        if($id_user !== null){
            return $this->select('user.nama_user')->where('user.id', $id_user)->first();
        }
    }

    public function notifications()
    {
        return $this->hasMany(Notifikasi::class, 'id_user', 'id_user');
    }
    

}
