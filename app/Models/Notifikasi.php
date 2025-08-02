<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notifikasi extends Model
{
    protected $table = 'notifikasi';
    protected $primaryKey = 'id_notifikasi';

    protected $fillable = [
        'id_user',
        'id_sender',
        'id_receiver',
        'pesan',
        'link',
        'is_read',
    ];

    public function user()
    {
        return $this->belongsTo(AkunPengguna::class, 'id_user', 'id_user');
    }
}
