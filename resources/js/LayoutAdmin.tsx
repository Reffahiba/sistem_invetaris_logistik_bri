import React, { useState } from "react";
import axios from "axios";

// Import komponen navigasi baru kita
import Sidebar from '@/components/navigations/Sidebar';
import Topbar from '@/components/navigations/Topbar'; 

// Fungsi logout tetap sama
const handleLogout = async () => {
    try {
        const csrfTokenMeta = document.querySelector('meta[name="csrf-token"]');
        const csrfToken = csrfTokenMeta ? csrfTokenMeta.getAttribute("content") : "";
        await axios.post("/admin-logout", {}, {
            headers: { "X-CSRF-TOKEN": csrfToken || "" },
        });
        window.location.href = "/admin";
    } catch (error) {
        console.error("Logout error:", error);
    }
};

// Ambil data dari elemen #app
const el = document.getElementById("app");
const nama: string = el?.dataset.nama || "Guest";
const divisi: string = el?.dataset.divisi || "Divisi";
const currentPath: string = window.location.pathname;

// Tipe untuk props Layout
interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    // State untuk mengontrol visibilitas sidebar di mobile
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="min-h-screen">
            {/* Render Sidebar. Ia akan menangani logikanya sendiri */}
            <Sidebar 
                currentPath={currentPath}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Konten utama*/}
            <div className="lg:ml-64 flex flex-col flex-1">
                {/* Render Topbar */}
                <Topbar 
                    onToggleSidebar={toggleSidebar}
                    userName={nama}
                    userRole={divisi}
                    onLogout={handleLogout}
                />
                
                {/* Render konten halaman */}
                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;