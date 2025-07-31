import React, { useEffect, useRef, useState } from 'react';
import {
  Menu, Bell, Search, ChevronDownCircle, Settings, Info, UserCircle, LogOutIcon,
} from 'lucide-react';
import axios from 'axios';
import NotificationDropdown, { Notification } from './NotificationDropdown';
import LogoutConfirmationModal from '@/components/modal/LogoutConfirmationModal';

const placeholderTexts: string[] = [
  'Cari barang yang dibutuhkan...',
  'Ajukan permintaan barang...',
  'Lihat permintaan terakhir...',
  'Filter berdasarkan nama...',
];

// Definisikan tipe untuk props yang diterima dari Layout
interface TopbarProps {
  onToggleSidebar: () => void;
  userName: string;
  userRole: string;
  onLogout: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ onToggleSidebar, userName, userRole, onLogout }) => {
  const [showProfile, setShowProfile] = useState<boolean>(false);
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState<number>(0);
  const [animate, setAnimate] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLogoutModalOpen, setLogoutModalOpen] = useState<boolean>(false);
  const notificationRef = useRef<HTMLDivElement | null>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);

  const fetchNotifications = () => {
    axios.get('/api/admin/notifications/unread')
      .then(res => setNotifications(res.data))
      .catch(err => console.error("Gagal fetch notifikasi:", err));
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Polling setiap 30 detik
    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = (id: number) => {
    axios.post(`/api/admin/notifications/${id}/read`)
      .then(() => {
        // Hapus notifikasi dari state agar langsung hilang dari UI
        setNotifications(prev => prev.filter(n => n.id_notifikasi !== id));
      });
  };

  const handleMarkAllAsRead = () => {
    axios.post('/api/admin/notifications/read-all')
      .then(() => {
        setNotifications([]); // Kosongkan state notifikasi
      });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimate(true);
      setTimeout(() => {
        setCurrentPlaceholderIndex((prev) => (prev + 1) % placeholderTexts.length);
        setAnimate(false);
      }, 300);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Tipe untuk event mouse
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return ( <>
    <header className="h-16 flex items-center justify-between px-4 shadow-sm bg-white border-b border-gray-200 sticky top-0 z-40">
      {/* Sidebar Toggle + Search */}
      <div className="flex items-center gap-2">
        <button
          className="lg:hidden active:scale-95 transition-all duration-200"
          onClick={onToggleSidebar}
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5 text-gray-500" />
        </button>

        {/* Search Bar */}
        <div className="relative w-72">
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 text-sm rounded-full border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <span
            className={`
                absolute left-10 mt-2 transform -translate-y-1/2 text-sm text-gray-400 
                pointer-events-none transition-all duration-200
                ${
                isFocused || animate
                    ? 'opacity-0 -translate-y-2'
                    : 'opacity-100 translate-y-0'
                }
            `}
            >
            {placeholderTexts[currentPlaceholderIndex]}
            </span>
        </div>
      </div>

      {/* Notification + Profile */}
      <div className="flex items-center gap-4">
        {/* Notification + Profile */}
        <div className="flex items-center gap-4">
          <div className="relative" ref={notificationRef}>
            <button onClick={() => setShowNotifications(!showNotifications)} className="relative focus:outline-none" aria-label="Notifications">
              <Bell className="mt-2 w-5 h-5 text-gray-500" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 mt-2 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-xs">
                  {notifications.length}
                </span>
              )}
            </button>
            {showNotifications && (
              <NotificationDropdown 
                notifications={notifications}
                onMarkAsRead={handleMarkAsRead}
                onMarkAllAsRead={handleMarkAllAsRead}
              />
            )}
          </div>
        </div>
            
        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button onClick={() => setShowProfile(!showProfile)} className="flex items-center gap-3 focus:outline-none">
          <img src="/assets/default_avatar.png" alt="User Avatar" className="w-8 h-8 rounded-full object-cover" />
            <div className="text-left text-sm hidden sm:block">
              <div className="font-medium text-gray-800">{userName}</div>
              <div className="text-gray-500 text-xs">{userRole}</div>
            </div>
            <ChevronDownCircle className={`w-4 h-4 text-gray-600 transition-transform duration-200 ml-1 ${showProfile ? 'rotate-180' : ''}`} />
          </button>
          {showProfile && (
            <div className="absolute right-0 mt-2 w-64 bg-white border rounded-md shadow-md z-50">
              <div className="px-4 py-3 border-b">
                <div className="font-medium text-sm">{userName}</div>
                <div className="text-xs text-gray-500">{userName.toLowerCase().replace(' ','')}@bri.corp.id</div>
              </div>
              <ul className="text-sm text-gray-700 py-1">
                <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer"><UserCircle className="w-4 h-4" /> Edit profil</li>
                <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer"><Settings className="w-4 h-4" /> Pengaturan</li>
              </ul>
              <div className="border-t"></div>
              <button 
                  onClick={() => setLogoutModalOpen(true)} 
                  className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-red-600"
                >
                  <LogOutIcon className="w-4 h-4" /> Keluar
                </button>
            </div>
          )}
        </div>
      </div>
    </header>
    <LogoutConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={onLogout} 
    />
    </>
  );
};

export default Topbar;