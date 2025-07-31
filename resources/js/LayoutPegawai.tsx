import React from "react";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { Menu, Link } from "lucide-react";
import { Bell, Search, Settings, UserCircle, LogOutIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
    SidebarProvider,
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarHeader,
    SidebarFooter,
    SidebarItem,
} from "@/components/ui/sidebar";
import { NavigationMenu } from "@/components/ui/navigation-menu";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Notifikasi {
    id_permintaan: number;
    message: string;
    status: string;
}

const placeholderTexts: string[] = [
    "Cari barang yang dibutuhkan...",
    "Ajukan permintaan barang...",
    "Lihat permintaan terakhir...",
    "Filter berdasarkan nama...",
];

const handleLogout = async () => {
    try {
        await axios.post(
            "/admin_logout",
            {},
            {
                headers: {
                    "X-CSRF-TOKEN":
                        document
                            .querySelector('meta[name="csrf-token"]')!
                            .getAttribute("content") || "",
                },
            }
        );
        window.location.href = "/admin"; // Redirect manual
    } catch (error) {
        console.error("Logout error:", error);
    }
};

const el = document.getElementById("app");

// Ambil data dari attribute
const nama = el?.dataset.nama || "Guest";
const divisi = el?.dataset.divisi || "Divisi";

const currentPath = window.location.pathname;

const LayoutPegawai = ({ children }) => {
    const [showProfile, setShowProfile] = useState<boolean>(false);
    const [showNotifications, setShowNotifications] = useState<boolean>(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const [currentPlaceholderIndex, setCurrentPlaceholderIndex] =
        useState<number>(0);
    const [animate, setAnimate] = useState<boolean>(false);
    const [isFocused, setIsFocused] = useState<boolean>(false);

    const notificationRef = useRef<HTMLDivElement | null>(null);
    const profileRef = useRef<HTMLDivElement | null>(null);

    const [notifications, setNotifications] = useState<string[]>([]);
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [notifiedIds, setNotifiedIds] = useState<number[]>([]);
    const [audioEnabled, setAudioEnabled] = useState(false);

    const enableAudio = () => {
        const audio = new Audio("/audio/notification.mp3");
        audio
            .play()
            .then(() => {
                setAudioEnabled(true);
            })
            .catch((error) => {
                console.error("Audio play failed", error);
            });
    };

    const playNotificationSound = () => {
        if (!audioEnabled) return;
        const audio = new Audio("/audio/notification.mp3");
        audio.play().catch((err) => console.error("Gagal memutar audio", err));
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setAnimate(true);
            setTimeout(() => {
                setCurrentPlaceholderIndex(
                    (prev) => (prev + 1) % placeholderTexts.length
                );
                setAnimate(false);
            }, 300);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Tipe untuk event mouse
        const handleClickOutside = (event: MouseEvent) => {
            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target as Node)
            ) {
                setShowNotifications(false);
            }
            if (
                profileRef.current &&
                !profileRef.current.contains(event.target as Node)
            ) {
                setShowProfile(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    });

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get("/notifikasi-permintaan");
                const data = response.data;

                // Filter status yang ingin diberi notifikasi
                const newNotifs: Notifikasi[] = data.filter(
                    (item: Notifikasi) =>
                        item.status === "sedang diproses" ||
                        item.status === "sedang diantar"
                );

                // Cari notifikasi yang ID-nya belum pernah diberi bunyi
                const newUnseen = newNotifs.filter(
                    (item: Notifikasi) =>
                        !notifiedIds.includes(item.id_permintaan)
                );

                if (newUnseen.length > 0) {
                    playNotificationSound();

                    // Simpan ID yang sudah diputar suaranya
                    setNotifiedIds((prev) => [
                        ...prev,
                        ...newUnseen.map((n) => n.id_permintaan),
                    ]);

                    // Update unread count dan tampilan
                    setUnreadCount(newUnseen.length);
                    setNotifications((prev) => [
                        ...newUnseen.map((n) => n.message),
                        ...prev,
                    ]);
                }
            } catch (error) {
                console.error("Error fetching notifications", error);
            }
        };

        const interval = setInterval(fetchNotifications, 10000); // 10 detik
        fetchNotifications(); // run once on mount

        return () => clearInterval(interval);
    }, [notifiedIds]);

    return (
        <div className="flex">
            <SidebarProvider>
                <div className="hidden md:flex h-screen">
                    <Sidebar collapsible="none" className="h-full">
                        <SidebarHeader>
                            <img src="/assets/Logo Brilog.png" alt="logo" className="w-40 h-20" />
                        </SidebarHeader>
                        <SidebarContent>
                            <SidebarGroup>
                                <SidebarItem
                                    href="/dashboard"
                                    icon="/assets/chart-2.png"
                                    activeIcon="/assets/chart-2-blue.png"
                                    currentPath={currentPath}
                                    label="Dashboard"
                                />
                                <SidebarItem
                                    href="/ajukan-permintaan"
                                    icon="/assets/box-add.png"
                                    activeIcon="/assets/box-add-blue.png"
                                    currentPath={currentPath}
                                    label="Ajukan Permintaan"
                                />
                                <SidebarItem
                                    href="/lacak-permintaan"
                                    icon="/assets/search-status.png"
                                    activeIcon="/assets/search-status-blue.png"
                                    currentPath={currentPath}
                                    label="Lacak Permintaan"
                                />
                                <SidebarItem
                                    href="/riwayat-permintaan"
                                    icon="/assets/archive-tick.png"
                                    activeIcon="/assets/archive-tick-blue.png"
                                    currentPath={currentPath}
                                    label="Riwayat Permintaan"
                                />
                            </SidebarGroup>
                        </SidebarContent>
                        <SidebarFooter>
                            <a
                                href="/pengaturan"
                                className="p-2 hover:bg-gray-200 rounded"
                            >
                                Pengaturan
                            </a>
                        </SidebarFooter>
                    </Sidebar>
                </div>
            </SidebarProvider>

            {sidebarOpen && (
                <div className="fixed inset-0 z-50 flex md:hidden bg-black bg-opacity-50">
                    <div className="bg-white w-64 p-4 h-full">
                        {/* Sidebar Content Mobile */}
                        <div className="flex justify-between items-center mb-4">
                            <h1 className="text-lg font-bold">Menu</h1>
                            <button onClick={toggleSidebar}>&times;</button>
                        </div>
                        <div className="space-y-3">
                            <SidebarItem
                                href="/dashboard"
                                icon="/assets/chart-2.png"
                                activeIcon="/assets/chart-2-blue.png"
                                currentPath={currentPath}
                                label="Dashboard"
                            />
                            <SidebarItem
                                href="/ajukan-permintaan"
                                icon="/assets/box-add.png"
                                activeIcon="/assets/box-add-blue.png"
                                currentPath={currentPath}
                                label="Ajukan Permintaan"
                            />
                            <SidebarItem
                                href="/lacak-permintaan"
                                icon="/assets/search-status.png"
                                activeIcon="/assets/search-status-blue.png"
                                currentPath={currentPath}
                                label="Lacak Permintaan"
                            />
                            <SidebarItem
                                href="/riwayat-permintaan"
                                icon="/assets/archive-tick.png"
                                activeIcon="/assets/archive-tick-blue.png"
                                currentPath={currentPath}
                                label="Riwayat Permintaan"
                            />
                            <a
                                href="/pengaturan"
                                className="block p-2 rounded hover:bg-gray-100"
                            >
                                Pengaturan
                            </a>
                        </div>
                    </div>
                    {/* Klik area luar untuk tutup */}
                    <div className="flex-1" onClick={toggleSidebar}></div>
                </div>
            )}

            <div className="flex flex-col flex-1 h-full">
                {/* Navbar */}
                <NavigationMenu className="border-b p-4 w-full flex items-center justify-between">
                    <div className="md:hidden">
                        <button onClick={toggleSidebar}>
                            <Menu className="h-6 w-6 text-gray-700 hover:text-sky-600 mr-5" />
                        </button>
                    </div>
                    <div className="flex items-center gap-2 flex-1 max-w-xs">
                        <div className="relative w-full">
                            <input
                                type="text"
                                className="w-full rounded-full border px-3 py-2 pl-10 text-sm outline-none focus:outline-none focus:ring-1 focus:ring-gray-200"
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                            />
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />

                            {/* Placeholder animasi */}
                            <span
                                className={`
                                    absolute left-10 top-1/2 transform -translate-y-1/2 text-sm text-gray-400
                                    pointer-events-none transition-all duration-200
                                    ${
                                        isFocused || animate
                                            ? "opacity-0 -translate-y-2"
                                            : "opacity-100"
                                    }
                            `}
                            >
                                {placeholderTexts[currentPlaceholderIndex]}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 justify-end flex-1 max-w-xs">
                        {/* Notifikasi Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger className="relative focus:outline-none">
                                <Bell className="h-5 w-5 text-gray-500 cursor-pointer hover:text-sky-500" />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 h-5 min-w-[20px] flex items-center justify-center animate-pulse">
                                        {unreadCount}
                                    </span>
                                )}
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-64">
                                <DropdownMenuLabel>
                                    Notifikasi Terbaru
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {notifications.length > 0 ? (
                                    notifications.map((notif, idx) => (
                                        <DropdownMenuItem key={idx}>
                                            {notif}
                                        </DropdownMenuItem>
                                    ))
                                ) : (
                                    <DropdownMenuItem className="text-gray-400">
                                        Tidak ada notifikasi
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Profil Dropdown */}
                        <div className="rounded-full overflow-hidden w-8 h-8 object-cover">
                            <div className="w-full h-full">
                                <img
                                    src="/assets/default_avatar.png"
                                    alt="User Avatar"
                                />
                            </div>
                        </div>
                        <div className="hidden sm:flex flex-col text-start">
                            <p className="text-sm font-semibold truncate">
                                {nama}
                            </p>
                            <p className="text-xs font-normal truncate">
                                {divisi}
                            </p>
                        </div>
                        <DropdownMenu
                            onOpenChange={(open) => setShowProfile(open)}
                        >
                            <DropdownMenuTrigger className="focus:outline-none">
                                <div className="rounded-full overflow-hidden w-4 h-4 cursor-pointer">
                                    <div className="w-full h-full">
                                        <img
                                            src="/assets/arrow-circle-down.png"
                                            alt="User"
                                            className={`transition-transform duration-300 ${
                                                showProfile ? "rotate-180" : ""
                                            }`}
                                        />
                                    </div>
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-43 mr-3">
                                <DropdownMenuLabel>
                                    {nama} <br />
                                    <span className="text-xs font-normal">
                                        {nama.toLowerCase().replace(" ", "")}
                                        @bri.corp.id
                                    </span>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="flex items-center text-xs gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer">
                                    <UserCircle />
                                    <a href="/profile">Edit profil</a>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex items-center text-xs gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer">
                                    <Settings />
                                    <a href="/profile">Pengaturan</a>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex items-center text-xs gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer">
                                    <LogOutIcon className="text-red-500" />
                                    <form method="POST" action="/logout">
                                        <input
                                            type="hidden"
                                            name="_token"
                                            value={
                                                document
                                                    .querySelector(
                                                        'meta[name="csrf-token"]'
                                                    )
                                                    ?.getAttribute("content") ||
                                                ""
                                            }
                                        />
                                        <button
                                            type="submit"
                                            className="w-full text-left text-red-500 font-semibold"
                                        >
                                            Keluar
                                        </button>
                                    </form>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </NavigationMenu>

                <div className="flex-1 overflow-auto p-6">{children}</div>
            </div>
        </div>
    );
};

export default LayoutPegawai;
