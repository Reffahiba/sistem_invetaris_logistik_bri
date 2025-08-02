// import React from "react";
// import axios from "axios";
// import { useEffect, useState, useRef } from "react";
// import { Menu, Bell, Search, Settings, UserCircle, LogOutIcon } from "lucide-react";
// import NotificationDropdown from "./components/navigations/NotificationDropdown";
// import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarHeader, SidebarFooter, SidebarItem } from "@/components/ui/sidebar";
// import { NavigationMenu } from "@/components/ui/navigation-menu";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// const placeholderTexts: string[] = [
//     "Cari barang yang dibutuhkan...",
//     "Ajukan permintaan barang...",
//     "Lihat permintaan terakhir...",
//     "Filter berdasarkan nama...",
// ];

// const handleLogout = async () => {
//     try {
//         await axios.post("/admin_logout", {},
//             {
//                 headers: {
//                     "X-CSRF-TOKEN":
//                         document
//                             .querySelector('meta[name="csrf-token"]')!
//                             .getAttribute("content") || "",
//                 },
//             }
//         );
//         window.location.href = "/admin"; // Redirect manual
//     } catch (error) {
//         console.error("Logout error:", error);
//     }
// };

// const el = document.getElementById("app");

// // Ambil data dari attribute
// const nama = el?.dataset.nama || "Guest";
// const divisi = el?.dataset.divisi || "Divisi";
// const currentPath = window.location.pathname;

// const LayoutPegawai = ({ children }) => {
//     const [showProfile, setShowProfile] = useState<boolean>(false);
//     const [showNotifications, setShowNotifications] = useState<boolean>(false);
//     const [notifications, setNotifications] = useState<Notification[]>([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [sidebarOpen, setSidebarOpen] = useState(false);
//     const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
//     const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState<number>(0);
//     const [animate, setAnimate] = useState<boolean>(false);
//     const [isFocused, setIsFocused] = useState<boolean>(false);
//     const notificationRef = useRef<HTMLDivElement | null>(null);
//     const profileRef = useRef<HTMLDivElement | null>(null);
//     const audioRef = useRef<HTMLAudioElement | null>(null);
//     const prevNotifCount = useRef(notifications.length);
//     const [isAudioEnabled, setIsAudioEnabled] = useState(false);

//     const fetchNotifications = () => {
//         axios.get(`/notifikasi/unread`)
//         .then(res => setNotifications(res.data))
//         .catch(err => console.error("Gagal fetch notifikasi:", err));
//     };

//     useEffect(() => {
//         fetchNotifications();
//         const interval = setInterval(fetchNotifications, 30000); // Polling setiap 30 detik
//         return () => clearInterval(interval);
//     }, []);

//     useEffect(() => {
//         if (notifications.length > prevNotifCount.current) {
//             // Notifikasi baru masuk, mainkan suara
//             if (audioRef.current) {
//                 audioRef.current.play();
//             }
//         }
//         prevNotifCount.current = notifications.length;
//     }, [notifications]);

//     const handleMarkAsRead = (id: number) => {
//         axios.post(`/notifikasi/${id}/read`).then(() => {
//             // Hapus notifikasi dari state agar langsung hilang dari UI
//             setNotifications((prev) =>
//                 prev.filter((n) => n.id_notifikasi !== id)
//             );
//         });
//     };

//     const handleMarkAllAsRead = () => {
//         axios.post(`/notifikasi/read-all`).then(() => {
//             setNotifications([]); // Kosongkan state notifikasi
//         });
//     };

//     return (
//         <div className="flex">
//             <SidebarProvider className="bg-white">
//                 <div className="flex h-screen">
//                     <Sidebar collapsible="none" className="h-screen overflow-y-auto">
//                         <SidebarHeader>
//                             <img
//                                 src="/assets/Logo Brilog.png"
//                                 alt="logo"
//                                 className="w-40 h-20"
//                             />
//                         </SidebarHeader>
//                         <SidebarContent>
//                             <SidebarGroup>
//                                 <SidebarItem
//                                     href="/dashboard"
//                                     icon="/assets/chart-2.png"
//                                     activeIcon="/assets/chart-2-blue.png"
//                                     currentPath={currentPath}
//                                     label="Dashboard"
//                                 />
//                                 <SidebarItem
//                                     href="/ajukan-permintaan"
//                                     icon="/assets/box-add.png"
//                                     activeIcon="/assets/box-add-blue.png"
//                                     currentPath={currentPath}
//                                     label="Ajukan Permintaan"
//                                 />
//                                 <SidebarItem
//                                     href="/lacak-permintaan"
//                                     icon="/assets/search-status.png"
//                                     activeIcon="/assets/search-status-blue.png"
//                                     currentPath={currentPath}
//                                     label="Lacak Permintaan"
//                                 />
//                                 <SidebarItem
//                                     href="/riwayat-permintaan"
//                                     icon="/assets/archive-tick.png"
//                                     activeIcon="/assets/archive-tick-blue.png"
//                                     currentPath={currentPath}
//                                     label="Riwayat Permintaan"
//                                 />
//                             </SidebarGroup>
//                         </SidebarContent>
//                     </Sidebar>
//                 </div>
//             </SidebarProvider>

//             {sidebarOpen && (
//                 <div className="fixed inset-0 z-50 flex md:hidden bg-black bg-opacity-50">
//                     <div className="bg-white w-64 p-4 h-full">
//                         {/* Sidebar Content Mobile */}
//                         <div className="flex justify-between items-center mb-4">
//                             <h1 className="text-lg font-bold">Menu</h1>
//                             <button onClick={toggleSidebar}>&times;</button>
//                         </div>
//                         <div className="space-y-3">
//                             <SidebarItem
//                                 href="/dashboard"
//                                 icon="/assets/chart-2.png"
//                                 activeIcon="/assets/chart-2-blue.png"
//                                 currentPath={currentPath}
//                                 label="Dashboard"
//                             />
//                             <SidebarItem
//                                 href="/ajukan-permintaan"
//                                 icon="/assets/box-add.png"
//                                 activeIcon="/assets/box-add-blue.png"
//                                 currentPath={currentPath}
//                                 label="Ajukan Permintaan"
//                             />
//                             <SidebarItem
//                                 href="/lacak-permintaan"
//                                 icon="/assets/search-status.png"
//                                 activeIcon="/assets/search-status-blue.png"
//                                 currentPath={currentPath}
//                                 label="Lacak Permintaan"
//                             />
//                             <SidebarItem
//                                 href="/riwayat-permintaan"
//                                 icon="/assets/archive-tick.png"
//                                 activeIcon="/assets/archive-tick-blue.png"
//                                 currentPath={currentPath}
//                                 label="Riwayat Permintaan"
//                             />
//                         </div>
//                     </div>
//                     {/* Klik area luar untuk tutup */}
//                     <div className="flex-1" onClick={toggleSidebar}></div>
//                 </div>
//             )}

//             <div className="flex flex-col flex-1 h-full">
//                 {/* Navbar */}
//                 <NavigationMenu className="border-b p-4 w-full flex items-center justify-between">
//                     <div className="md:hidden">
//                         <button onClick={toggleSidebar}>
//                             <Menu className="h-6 w-6 text-gray-700 hover:text-sky-600 mr-5" />
//                         </button>
//                     </div>
//                     <div className="flex items-center gap-2 flex-1 max-w-xs">
//                         <div className="relative w-full">
//                             <input
//                                 type="text"
//                                 className="w-full rounded-full border px-3 py-2 pl-10 text-sm outline-none focus:outline-none focus:ring-1 focus:ring-gray-200"
//                                 onFocus={() => setIsFocused(true)}
//                                 onBlur={() => setIsFocused(false)}
//                             />
//                             <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />

//                             {/* Placeholder animasi */}
//                             <span
//                                 className={`
//                                     absolute left-10 top-1/2 transform -translate-y-1/2 text-sm text-gray-400
//                                     pointer-events-none transition-all duration-200
//                                     ${
//                                         isFocused || animate
//                                             ? "opacity-0 -translate-y-2"
//                                             : "opacity-100"
//                                     }
//                             `}
//                             >
//                                 {placeholderTexts[currentPlaceholderIndex]}
//                             </span>
//                         </div>
//                     </div>

//                     <div className="flex items-center gap-4 justify-end flex-1 max-w-xs">
//                         {/* Notifikasi Dropdown */}
//                         {!isAudioEnabled && (
//                             <button
//                                 onClick={() => {
//                                     audioRef.current?.play();
//                                     setIsAudioEnabled(true);
//                                 }}
//                                 className="fixed bottom-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-lg shadow-lg z-50"
//                             >
//                                 Aktifkan Suara Notifikasi 🔊
//                             </button>
//                         )}
//                         <DropdownMenu
//                             onOpenChange={(open) => setShowNotifications(open)}
//                         >
//                             <DropdownMenuTrigger className="relative focus:outline-none">
//                                 <Bell className="h-5 w-5 text-gray-500 cursor-pointer hover:text-sky-500" />
//                                 {notifications.length > 0 && (
//                                     <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-xs">
//                                         {notifications.length}
//                                     </span>
//                                 )}
//                             </DropdownMenuTrigger>

//                             <DropdownMenuContent align="end">
//                                 <NotificationDropdown
//                                     notifications={notifications}
//                                     onMarkAsRead={handleMarkAsRead}
//                                     onMarkAllAsRead={handleMarkAllAsRead}
//                                 />
//                             </DropdownMenuContent>
//                         </DropdownMenu>

//                         {/* Profil Dropdown */}
//                         <div className="rounded-full overflow-hidden w-8 h-8 object-cover">
//                             <div className="w-full h-full">
//                                 <img
//                                     src="/assets/default_avatar.png"
//                                     alt="User Avatar"
//                                 />
//                             </div>
//                         </div>
//                         <div className="hidden sm:flex flex-col text-start">
//                             <p className="text-sm font-semibold truncate">
//                                 {nama}
//                             </p>
//                             <p className="text-xs font-normal truncate">
//                                 {divisi}
//                             </p>
//                         </div>

//                         <DropdownMenu
//                             onOpenChange={(open) => setShowProfile(open)}
//                         >
//                             <DropdownMenuTrigger className="focus:outline-none">
//                                 <div className="rounded-full overflow-hidden w-4 h-4 cursor-pointer">
//                                     <div className="w-full h-full">
//                                         <img
//                                             src="/assets/arrow-circle-down.png"
//                                             alt="User"
//                                             className={`transition-transform duration-300 ${
//                                                 showProfile ? "rotate-180" : ""
//                                             }`}
//                                         />
//                                     </div>
//                                 </div>
//                             </DropdownMenuTrigger>
//                             <DropdownMenuContent className="w-43 mr-3">
//                                 <DropdownMenuLabel>
//                                     {nama} <br />
//                                     <span className="text-xs font-normal">
//                                         {nama.toLowerCase().replace(" ", "")}
//                                         @bri.corp.id
//                                     </span>
//                                 </DropdownMenuLabel>
//                                 <DropdownMenuSeparator />
//                                 <DropdownMenuItem className="flex items-center text-xs gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer">
//                                     <UserCircle />
//                                     <a href="/profile">Edit profil</a>
//                                 </DropdownMenuItem>
//                                 <DropdownMenuItem className="flex items-center text-xs gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer">
//                                     <Settings />
//                                     <a href="/profile">Pengaturan</a>
//                                 </DropdownMenuItem>
//                                 <DropdownMenuItem className="flex items-center text-xs gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer">
//                                     <LogOutIcon className="text-red-500" />
//                                     <form method="POST" action="/logout">
//                                         <input
//                                             type="hidden"
//                                             name="_token"
//                                             value={
//                                                 document
//                                                     .querySelector(
//                                                         'meta[name="csrf-token"]'
//                                                     )
//                                                     ?.getAttribute("content") ||
//                                                 ""
//                                             }
//                                         />
//                                         <button
//                                             type="submit"
//                                             className="w-full text-left text-red-500 font-semibold"
//                                         >
//                                             Keluar
//                                         </button>
//                                     </form>
//                                 </DropdownMenuItem>
//                             </DropdownMenuContent>
//                         </DropdownMenu>
//                     </div>
//                 </NavigationMenu>

//                 <div className="flex-1 overflow-auto p-6">{children}</div>
//                 <audio
//                     ref={audioRef}
//                     src="/audio/notification.mp3"
//                     preload="auto"
//                 />
//             </div>
//         </div>
//     );
// };

// export default LayoutPegawai;

import React, { useRef } from "react";
import SidebarLayout from "@/components/navigations/SidebarPegawai";
import NavbarPegawai from "@/components/navigations/NavbarPegawai";

interface LayoutPegawaiProps {
    children: React.ReactNode;
    nama: string;
    divisi: string;
}

const el = document.getElementById("app");

const LayoutPegawai: React.FC<LayoutPegawaiProps> = ({
    children,
    nama = el?.dataset.nama || "Guest",
    divisi = el?.dataset.divisi || "Divisi",
}) => {
    const [sidebarOpen, setSidebarOpen] = React.useState(false);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const audioRef = useRef<HTMLAudioElement>(null);
    
    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar & Mobile Sidebar */}
            <SidebarLayout
                sidebarOpen={sidebarOpen}
                toggleSidebar={toggleSidebar}
            />

            <div className="flex flex-col flex-1">
                {/* Topbar/Navbar */}
                <NavbarPegawai
                    nama={nama}
                    divisi={divisi}
                    toggleSidebar={toggleSidebar}
                />

                {/* Main Content */}
                <main className="p-4 overflow-y-auto">{children}</main>
            </div>

            <audio ref={audioRef} src="/audio/notification.mp3" preload="auto" />
        </div>
    );
};

export default LayoutPegawai;

