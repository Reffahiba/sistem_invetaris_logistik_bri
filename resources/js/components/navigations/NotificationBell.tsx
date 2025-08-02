import React, { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import NotificationDropdown from "@/components/navigations/NotificationDropdown";
import axios from "axios";

const NotificationBell: React.FC = () => {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [isAudioEnabled, setIsAudioEnabled] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const prevNotifCount = useRef(notifications.length);
    const audioRef = useRef<HTMLAudioElement>(null);

    const fetchNotifications = () => {
        axios.get(`/notifikasi/unread`)
        .then(res => setNotifications(res.data))
        .catch(err => console.error("Gagal fetch notifikasi:", err));
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // Polling setiap 30 detik
        return () => clearInterval(interval);
    }, []);

    // Contoh ambil notifikasi
    useEffect(() => {
        if (notifications.length > prevNotifCount.current) {
            // Notifikasi baru masuk, mainkan suara
            if (audioRef.current) {
                audioRef.current.play();
            }
        }
        prevNotifCount.current = notifications.length;
    }, [notifications]);

    const handleMarkAsRead = (id: number) => {
        axios.post(`/notifikasi/${id}/read`).then(() => {
            // Hapus notifikasi dari state agar langsung hilang dari UI
            setNotifications((prev) =>
                prev.filter((n) => n.id_notifikasi !== id)
            );
        });
    };

    const handleMarkAllAsRead = () => {
        axios.post(`/notifikasi/read-all`).then(() => {
            setNotifications([]); // Kosongkan state notifikasi
        });
    };

    return (
        <>
            {!isAudioEnabled && (
                <button
                    onClick={() => {
                        audioRef.current?.play();
                        setIsAudioEnabled(true);
                    }}
                    className="fixed bottom-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-lg shadow-lg z-50"
                >
                    Aktifkan Suara Notifikasi 🔊
                </button>
            )}
            <audio ref={audioRef} src="/audio/notification.mp3" preload="auto" />

            <DropdownMenu onOpenChange={setShowNotifications}>
                <DropdownMenuTrigger className="relative focus:outline-none">
                    <Bell className="h-5 w-5 text-gray-500 cursor-pointer hover:text-sky-500" />
                    {notifications.length > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-xs">
                            {notifications.length}
                        </span>
                    )}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <NotificationDropdown
                        notifications={notifications}
                        onMarkAsRead={handleMarkAsRead}
                        onMarkAllAsRead={handleMarkAllAsRead}
                    />
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};

export default NotificationBell;
