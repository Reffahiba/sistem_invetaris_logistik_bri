import React from "react";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import {
    Menu,
    Bell,
    Search,
    Settings,
    UserCircle,
    LogOutIcon,
} from "lucide-react";
import NotificationDropdown from "./components/navigations/NotificationDropdown";
import { NavigationMenu } from "@/components/ui/navigation-menu";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
                        <DropdownMenu
                            onOpenChange={(open) => setShowNotifications(open)}
                        >
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