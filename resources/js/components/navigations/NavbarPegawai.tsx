import React, { useState, useRef } from "react";
import { Menu } from "lucide-react";
import NotificationBell from "@/components/navigations/NotificationBell";
import UserDropdown from "@/components/navigations/UserDropdown";
import SearchInput from "@/components/navigations/SearchInput";
import { NavigationMenu } from "@/components/ui/navigation-menu";

interface Props {
    nama: string;
    divisi: string;
    toggleSidebar: () => void;
}

const NavbarPegawai: React.FC<Props> = ({ nama, divisi, toggleSidebar }) => {
    return (
        <NavigationMenu className="border-b p-4 w-full flex items-center justify-between">
            {/* Sidebar toggle */}
            <div className="md:hidden">
                <button onClick={toggleSidebar}>
                    <Menu className="h-6 w-6 text-gray-700 hover:text-sky-600 mr-5" />
                </button>
            </div>

            {/* Search bar */}
            <div className="flex items-center gap-2 flex-1 max-w-xs">
                <SearchInput />
            </div>

            {/* Notification + Profile */}
            <div className="flex items-center gap-4 justify-end flex-1 max-w-xs">
                <NotificationBell />
                <UserDropdown nama={nama} divisi={divisi} />
            </div>
        </NavigationMenu>
    );
};

export default NavbarPegawai;
