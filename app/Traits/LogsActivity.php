<?php

namespace App\Traits;

use App\Models\LogActivity;
use Illuminate\Support\Facades\Auth;

trait LogsActivity
{
    protected static function bootLogsActivity()
    {
        // Event saat data baru DIBUAT
        static::created(function ($model) {
            static::logActivity($model, 'menambahkan');
        });

        // Event saat data DIEDIT
        static::updated(function ($model) {
            static::logActivity($model, 'mengedit');
        });

        // Event saat data DIHAPUS
        static::deleted(function ($model) {
            static::logActivity($model, 'menghapus');
        });
    }

    protected static function logActivity($model, $activity)
    {
        $user = Auth::user();

        // Hanya log jika user login dan memiliki id_role = 1 (admin)
        if ($user && $user->id_role == 1) {
            LogActivity::create([
                'id_user' => $user->id_user,
                'activity' => $activity,
                'description' => static::getLogDescription($model, $activity),
            ]);
        }
    }

    // Fungsi untuk membuat deskripsi log yang dinamis
    protected static function getLogDescription($model, $activity)
    {
        $logName = static::$logName ?? strtolower(class_basename($model));
        $identifier = $model->nama_barang ?? $model->nama_kategori ?? $model->kode_transaksi ?? $model->id;

        return "{$activity} {$logName} '{$identifier}'";
    }
}
