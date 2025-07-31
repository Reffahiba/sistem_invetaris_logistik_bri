import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface NavItemData {
    href: string;
    iconName: string;
    label: string;
    subItems?: { href: string; label: string }[];
}

interface NavItemProps {
    item: NavItemData;
    isActive: boolean;
    isSubItemActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({
    item,
    isActive,
    isSubItemActive,
}) => {
    const [isOpen, setIsOpen] = useState(isSubItemActive);

    useEffect(() => {
        if (isSubItemActive) {
            setIsOpen(true);
        }
    }, [isSubItemActive]);

    // Jika item adalah dropdown
    if (item.subItems) {
        return (
            <li>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-full flex items-center justify-between p-2 mb-3 rounded-lg text-sm transition-colors duration-300 ease-in-out ${
                        isActive
                            ? "text-blue-600 font-semibold"
                            : "text-gray-700 hover:bg-gray-200"
                    }`}
                >
                    <div className="flex items-center gap-3">
                        <img
                            src={
                                isActive
                                    ? `/assets/${item.iconName}-blue.png`
                                    : `/assets/${item.iconName}.png`
                            }
                            alt={item.label}
                            className="w-6 h-6 ml-1"
                        />
                        <span>{item.label}</span>
                    </div>
                    <ChevronDown
                        size={16}
                        className={`transform transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                        }`}
                    />
                </button>

                <div
                    className={`grid overflow-hidden transition-all duration-300 ease-in-out ${
                        isOpen
                            ? "grid-rows-[1fr] opacity-100"
                            : "grid-rows-[0fr] opacity-0"
                    }`}
                >
                    <div className="overflow-hidden">
                        <ul className="pl-8 pt-1 pb-2 space-y-1">
                            {item.subItems.map((subItem) => (
                                <li key={subItem.href}>
                                    <a
                                        href={subItem.href}
                                        className={`block p-2 rounded-md text-sm ${
                                            window.location.pathname ===
                                            subItem.href
                                                ? "bg-blue-100 text-blue-700 font-medium"
                                                : "hover:bg-gray-100"
                                        }`}
                                    >
                                        {subItem.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </li>
        );
    }

    return (
        <li>
            <a
                href={item.href}
                className={`flex items-center gap-3 p-2 mb-3 rounded-lg text-sm transition-colors duration-300 ease-in-out ${
                    isActive
                        ? "bg-blue-100 text-blue-600 font-semibold"
                        : "text-gray-700 hover:bg-gray-200"
                }`}
            >
                <img
                    src={
                        isActive
                            ? `/assets/${item.iconName}-blue.png`
                            : `/assets/${item.iconName}.png`
                    }
                    alt={item.label}
                    className="w-6 h-6 ml-1"
                />
                <span>{item.label}</span>
            </a>
        </li>
    );
};

interface SidebarProps {
    currentPath: string;
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPath, isOpen, onClose }) => {
    const navItems: NavItemData[] = [
        { href: "/admin/dashboard", iconName: "chart-2", label: "Dashboard" },
        {
            href: "#",
            iconName: "box",
            label: "Manajemen Barang",
            subItems: [
                { href: "/admin/data-barang", label: "Kelola Barang" },
                { href: "/admin/data-kategori", label: "Kelola Kategori" },
            ],
        },
        {
            href: "#",
            iconName: "arrow-right-left",
            label: "Manajemen Stok",
            subItems: [
                { href: "/admin/barang-masuk", label: "Barang Masuk" },
                { href: "/admin/barang-keluar", label: "Barang Keluar" },
            ],
        },
        { href: "/admin-permintaan", iconName: "note", label: "Permintaan" },
        {
            href: "/admin-kelola-akun",
            iconName: "people",
            label: "Kelola Akun",
        },
    ];

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            <div className="px-4 mb-4">
                <img
                    src="/assets/logo-brilog.png"
                    alt="BRI Log Logo"
                    className="h-14 w-28"
                />
            </div>
            <nav className="flex-1">
                <ul>
                    {navItems.map((item) => {
                        const isSubItemActive =
                            item.subItems?.some(
                                (sub) => sub.href === currentPath
                            ) || false;
                        const isActive =
                            currentPath === item.href || isSubItemActive;

                        return (
                            <NavItem
                                key={item.label}
                                item={item}
                                isActive={isActive}
                                isSubItemActive={isSubItemActive}
                            />
                        );
                    })}
                </ul>
            </nav>
        </div>
    );

    return (
        <>
            <aside className="hidden md:flex flex-col w-64 h-screen p-4 bg-white border-r border-gray-200 fixed">
                <SidebarContent />
            </aside>
            <div
                className={`fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity md:hidden ${
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
                onClick={onClose}
                aria-hidden="true"
            ></div>
            <aside
                className={`fixed top-0 left-0 h-full w-64 bg-white z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="p-4 h-full">
                    <SidebarContent />
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
