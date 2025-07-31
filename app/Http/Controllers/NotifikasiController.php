<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Notifikasi; // Pastikan model yang benar diimpor

class NotifikasiController extends Controller
{
    /**
     * Mengambil notifikasi yang belum dibaca HANYA untuk admin yang sedang login.
     */
    public function getUnread()
    {
        $adminId = Auth::guard('admin')->id();
        
        // Query langsung ke model Notifikasi dengan filter user_id
        $notifications = Notifikasi::where('id_user', $adminId)
                                   ->where('is_read', false)
                                   ->latest()
                                   ->get();
        
        return response()->json($notifications);
    }

    /**
     * Menandai satu notifikasi sebagai sudah dibaca, memastikan notifikasi tersebut milik admin.
     */
    public function markAsRead($id)
    {
        $adminId = Auth::guard('admin')->id();
        
        // Cari notifikasi berdasarkan ID-nya DAN ID admin yang login
        $notification = Notifikasi::where('id_notifikasi', $id)
                                  ->where('id_user', $adminId)
                                  ->first();

        if ($notification) {
            $notification->is_read = true;
            $notification->save();
            return response()->json(['message' => 'Notifikasi ditandai sebagai dibaca.']);
        }

        return response()->json(['message' => 'Notifikasi tidak ditemukan atau Anda tidak berwenang.'], 404);
    }

    /**
     * Menandai semua notifikasi milik admin yang login sebagai sudah dibaca.
     */
    public function markAllAsRead()
    {
        $adminId = Auth::guard('admin')->id();
        
        // Update notifikasi hanya untuk user_id yang cocok
        Notifikasi::where('id_user', $adminId)
                  ->where('is_read', false)
                  ->update(['is_read' => true]);

        return response()->json(['message' => 'Semua notifikasi ditandai sebagai dibaca.']);
    }
}
