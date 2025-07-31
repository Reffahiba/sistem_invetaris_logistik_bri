import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { Bell, CheckCheck } from 'lucide-react';
import Lottie from 'lottie-react';

// Path ke file Lottie di folder public
const LOTTIE_JSON_PATH = '/assets/searching-data.json'; 

// Fungsi helper untuk format waktu relatif
const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " tahun lalu";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " bulan lalu";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " hari lalu";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " jam lalu";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " menit lalu";
    return "Baru saja";
};

// Tipe data untuk notifikasi, disesuaikan untuk menyertakan data user
export interface Notification {
  id_notifikasi: number;
  pesan: string;
  link: string;
  created_at: string;
  user: { // Objek user yang mengirim notifikasi
    nama_user: string;
  } | null;
}

interface NotificationDropdownProps {
  notifications: Notification[];
  isLoading: boolean; // Prop baru untuk status loading
  onMarkAsRead: (id: number) => void;
  onMarkAllAsRead: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ notifications, isLoading, onMarkAsRead, onMarkAllAsRead }) => {
  const [animationData, setAnimationData] = useState<object | null>(null);

  // Ambil data animasi Lottie saat komponen dimuat
  useEffect(() => {
    fetch(LOTTIE_JSON_PATH)
      .then(response => response.json())
      .then(data => setAnimationData(data))
      .catch(error => console.error("Gagal memuat animasi Lottie:", error));
  }, []);
  
  return (
    <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-md shadow-lg z-50">
      <div className="flex justify-between items-center px-4 py-3 border-b">
        <h3 className="font-semibold text-gray-800">Notifikasi</h3>
        <button onClick={onMarkAllAsRead} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
          <CheckCheck size={14}/> Tandai semua dibaca
        </button>
      </div>
      
      {isLoading ? (
        // Tampilan saat sedang memuat data
        <div className="flex flex-col items-center justify-center h-48">
          {animationData && <Lottie animationData={animationData} loop={true} style={{ width: 100, height: 100 }} />}
          <p className="text-sm text-gray-500">Memuat notifikasi...</p>
        </div>
      ) : notifications.length > 0 ? (
        // Tampilan jika ada notifikasi
        <ul className="max-h-80 overflow-y-auto text-sm divide-y divide-gray-100">
          {notifications.map(notif => {
            const userName = notif.user?.nama_user || 'Sistem';
            
            return (
              <li key={notif.id_notifikasi}>
                <Link 
                  href={notif.link} 
                  onClick={() => onMarkAsRead(notif.id_notifikasi)}
                  className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50"
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                        {userName.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white"></span>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700">{notif.pesan}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatRelativeTime(notif.created_at)}
                    </p>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      ) : (
        // Tampilan jika tidak ada notifikasi
        <div className="text-center py-10 px-4">
          <Bell size={32} className="mx-auto text-gray-300"/>
          <p className="mt-2 text-sm text-gray-500">Tidak ada notifikasi baru.</p>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
