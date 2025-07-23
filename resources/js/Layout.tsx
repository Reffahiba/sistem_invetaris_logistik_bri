import React from "react";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { Bell, Search, ChevronDownCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import axios from "axios";
import {
    SidebarProvider,
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarHeader,
    SidebarFooter,
} from "@/components/ui/sidebar";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

const Layout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <div className="flex">
            <SidebarProvider>
                <div className="hidden md:flex h-screen">
                    <Sidebar collapsible="none" className="h-full">
                        <SidebarHeader>
                            <h1 className="text-xl font-bold pt-1">Logo App</h1>
                            <h1 className="text-lg font-semibold text-blue-600">
                                BRI<span className="text-orange-400">Log</span>
                            </h1>
                        </SidebarHeader>
                        <SidebarContent>
                            <SidebarGroup>
                                <div
                                    className={`flex items-center space-x-3 p-2 m-1 rounded-l-lg ${
                                        currentPath === "/admin_dashboard"
                                            ? "bg-blue-100  text-blue-600 font-semibold"
                                            : "hover:bg-gray-200 transition-colors duration-300 ease-in-out"
                                    }`}
                                >
                                    <img
                                        src={
                                            currentPath === "/admin_dashboard"
                                                ? "/assets/chart-2-blue.png"
                                                : "/assets/chart-2.png"
                                        }
                                        alt="User Icon"
                                        className="w-5 h-5 ml-3"
                                    ></img>
                                    <a
                                        href="/admin_dashboard"
                                        className="p-1 rounded text-sm pl-3"
                                    >
                                        Dashboard
                                    </a>
                                </div>
                                <div
                                    className={`flex items-center space-x-3 p-2 m-1 rounded-l-lg ${
                                        currentPath === "/admin_data_barang"
                                            ? "bg-blue-100  text-blue-600 font-semibold"
                                            : "hover:bg-gray-200 transition-colors duration-300 ease-in-out"
                                    }`}
                                >
                                    <img
                                        src={
                                            currentPath === "/admin_data_barang"
                                                ? "/assets/box-blue.png"
                                                : "/assets/box.png"
                                        }
                                        alt="User Icon"
                                        className="w-5 h-5 ml-3"
                                    ></img>
                                    <a
                                        href="/admin_data_barang"
                                        className="p-1 rounded text-sm pl-3"
                                    >
                                        Data Barang
                                    </a>
                                </div>
                                <div
                                    className={`flex items-center space-x-3 p-2 m-1 rounded-l-lg ${
                                        currentPath === "/admin_permintaan"
                                            ? "bg-blue-100  text-blue-600 font-semibold"
                                            : "hover:bg-gray-200 transition-colors duration-300 ease-in-out"
                                    }`}
                                >
                                    <img
                                        src={
                                            currentPath === "/admin_permintaan"
                                                ? "/assets/note-blue.png"
                                                : "/assets/note.png"
                                        }
                                        alt="User Icon"
                                        className="w-5 h-5 ml-3"
                                    ></img>
                                    <a
                                        href="/admin_permintaan"
                                        className="p-1 rounded text-sm pl-3"
                                    >
                                        Permintaan
                                    </a>
                                </div>
                                <div
                                    className={`flex items-center space-x-3 p-2 m-1 rounded-l-lg ${
                                        currentPath === "/admin_kelola_akun"
                                            ? "bg-blue-100  text-blue-600 font-semibold"
                                            : "hover:bg-gray-200 transition-colors duration-300 ease-in-out"
                                    }`}
                                >
                                    <img
                                        src={
                                            currentPath === "/admin_kelola_akun"
                                                ? "/assets/people-blue.png"
                                                : "/assets/people.png"
                                        }
                                        alt="User Icon"
                                        className="w-5 h-5 ml-3"
                                    ></img>
                                    <a
                                        href="/admin_kelola_akun"
                                        className="p-1 rounded text-sm pl-3"
                                    >
                                        Kelola Akun
                                    </a>
                                </div>
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
                            <a
                                href="/admin_dashboard"
                                className="block p-2 rounded hover:bg-gray-100 font-nunito"
                            >
                                Dashboard
                            </a>
                            <a
                                href="/admin_data_barang"
                                className="block p-2 rounded hover:bg-gray-100"
                            >
                                Data Barang
                            </a>
                            <a
                                href="/admin_permintaan"
                                className="block p-2 rounded hover:bg-gray-100"
                            >
                                Permintaan
                            </a>
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
                                placeholder="Search..."
                                className="w-full rounded-full border px-3 py-2 pl-10 text-sm outline-none focus:outline-none focus:ring-1 focus:ring-gray-200"
                            />
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        </div>
                    </div>

                    {/* <div className="flex justify-center flex-1">
                        <NavigationMenuList className="flex gap-4">
                            <NavigationMenuItem>
                                <NavigationMenuTrigger>
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <NavigationMenuLink>
                                    </NavigationMenuLink>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </div> */}

                    <div className="flex items-center gap-4 justify-end flex-1 max-w-xs">
                        {/* Notifikasi Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger className="focus:outline-none">
                                <Bell className="h-6 w-6 text-gray-600 cursor-pointer hover:text-sky-500" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-64">
                                <DropdownMenuLabel>
                                    Notifikasi Terbaru
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    Barang masuk hari ini
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    Permintaan persetujuan pengadaan
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    Stok barang hampir habis
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Profil Dropdown */}
                        <div className="rounded-full overflow-hidden w-7 h-7">
                            <Avatar className="w-full h-full">
                                <AvatarImage
                                    src="/assets/user.png"
                                    alt="User"
                                />
                                <AvatarFallback>UN</AvatarFallback>
                            </Avatar>
                        </div>
                        <div className="hidden sm:flex flex-col text-start">
                            <p className="text-sm font-semibold truncate">
                                {nama}
                            </p>
                            <p className="text-sm font-normal truncate">
                                {divisi}
                            </p>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger className="focus:outline-none">
                                <div className="rounded-full overflow-hidden w-7 h-7 cursor-pointer">
                                    <Avatar className="w-full h-full">
                                        <AvatarImage
                                            src="/assets/arrow-circle-down.png"
                                            alt="User"
                                        />
                                        <AvatarFallback>UN</AvatarFallback>
                                    </Avatar>
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-40">
                                <DropdownMenuLabel>Profil</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <a href="/profile">Lihat Profil</a>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <form method="POST" action="/admin_logout">
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
                                            className="w-full text-left"
                                        >
                                            Logout Admin
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
}

export default Layout;
