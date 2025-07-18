<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Divisi extends Model
{
    use HasFactory;

    protected $guarded = ['id_divisi'];
    protected $table = 'divisi';
    protected $fillable = ['nama_divisi'];

    public function getDivisi(){
        return $this->all();
    }
}
