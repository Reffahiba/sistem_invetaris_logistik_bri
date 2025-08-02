import React, { useState } from "react";
import {
    SidebarProvider,
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarHeader,
    SidebarFooter,
    SidebarItem,
} from "@/components/ui/sidebar";

interface SideItemData {
    href: string;
    icon: string;
    activeIcon: string;
    label: string;
}

interface SidebarLayoutProps {
    sidebarOpen: boolean;
    toggleSidebar: () => void;
}

const sidebarItems: SideItemData[] = [
    {
        href: "/dashboard",
        icon: "/assets/chart-2.png",
        activeIcon: "/assets/chart-2-blue.png",
        label: "Dashboard",
    },
    {
        href: "/ajukan-permintaan",
        icon: "/assets/box-add.png",
        activeIcon: "/assets/box-add-blue.png",
        label: "Ajukan Permintaan",
    },
    {
        href: "/lacak-permintaan",
        icon: "/assets/search-status.png",
        activeIcon: "/assets/search-status-blue.png",
        label: "Lacak Permintaan",
    },
    {
        href: "/riwayat-permintaan",
        icon: "/assets/archive-tick.png",
        activeIcon: "/assets/archive-tick-blue.png",
        label: "Riwayat Permintaan",
    },
];

const SidebarLayout: React.FC<SidebarLayoutProps> = ({sidebarOpen, toggleSidebar}) => {

    const currentPath = window.location.pathname;

    return (
        <SidebarProvider className="bg-white">
            <div className="flex h-screen">
                {/* DESKTOP SIDEBAR */}
                <Sidebar
                    collapsible="none"
                    className="h-screen overflow-y-auto hidden md:block"
                >
                    <SidebarHeader>
                        <img
                            src="/assets/Logo Brilog.png"
                            alt="logo"
                            className="w-40 h-20"
                        />
                    </SidebarHeader>
                    <SidebarContent>
                        <SidebarGroup>
                            {sidebarItems.map((item) => (
                                <SidebarItem
                                    key={item.href}
                                    href={item.href}
                                    icon={item.icon}
                                    activeIcon={item.activeIcon}
                                    currentPath={currentPath}
                                    label={item.label}
                                />
                            ))}
                        </SidebarGroup>
                    </SidebarContent>
                    <SidebarFooter>
                        {/* Optional: Footer content here */}
                    </SidebarFooter>
                </Sidebar>

                {/* MOBILE SIDEBAR */}
                {sidebarOpen && (
                    <div className="fixed inset-0 z-50 flex md:hidden bg-black bg-opacity-50">
                        <div className="bg-white w-64 p-4 h-full">
                            <div className="flex justify-between items-center mb-4">
                                <h1 className="text-lg font-bold">Menu</h1>
                                <button onClick={toggleSidebar}>&times;</button>
                            </div>
                            <div className="space-y-3">
                                {sidebarItems.map((item) => (
                                    <SidebarItem
                                        key={item.href}
                                        href={item.href}
                                        icon={item.icon}
                                        activeIcon={item.activeIcon}
                                        currentPath={currentPath}
                                        label={item.label}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="flex-1" onClick={toggleSidebar}></div>
                    </div>
                )}
            </div>
        </SidebarProvider>
    );
};

export default SidebarLayout;
