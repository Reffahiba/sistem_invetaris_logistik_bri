import React, { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, UserCircle, LogOutIcon } from "lucide-react";
import LogoutConfirmationModal from "../modal/LogoutConfirmationModal";

interface Props {
    nama: string;
    divisi: string;
    onLogoutClick: () => void;
}

const UserDropdown: React.FC<Props> = ({ nama, divisi }) => {
    const [showProfile, setShowProfile] = React.useState(false);
    const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);

    const onLogoutClick = () => {
        const form = document.createElement("form");
        form.method = "POST";
        form.action = "/logout";

        const csrf = document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content");

        const input = document.createElement("input");
        input.type = "hidden";
        input.name = "_token";
        input.value = csrf || "";
        form.appendChild(input);

        document.body.appendChild(form);
        form.submit();
    };

    return (
        <>
            <div className="rounded-full overflow-hidden w-8 h-8 object-cover">
                <img src="/assets/default_avatar.png" alt="User Avatar" />
            </div>
            <div className="hidden sm:flex flex-col text-start">
                <p className="text-sm font-semibold truncate">{nama}</p>
                <p className="text-xs font-normal truncate">{divisi}</p>
            </div>

            <DropdownMenu onOpenChange={setShowProfile}>
                <DropdownMenuTrigger className="focus:outline-none">
                    <img
                        src="/assets/arrow-circle-down.png"
                        alt="User"
                        className={`w-4 h-4 transition-transform duration-300 ${
                            showProfile ? "rotate-180" : ""
                        }`}
                    />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-43 mr-3">
                    <DropdownMenuLabel>
                        <p className="text-sm">{nama}</p>
                        <span className="text-xs font-normal">
                            {nama.toLowerCase().replace(" ", "")}@bri.corp.id
                        </span>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <UserCircle />
                        <a href="/profile" className="ml-2 text-sm">
                            Edit profil
                        </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Settings />
                        <a href="/profile" className="ml-2 text-sm">
                            Pengaturan
                        </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <LogOutIcon className="text-red-500" />
                        <button
                            onClick={() => setLogoutModalOpen(true)}
                            className="ml-2 text-sm text-left text-red-500 font-semibold"
                        >
                            Keluar
                        </button>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <LogoutConfirmationModal
                isOpen={isLogoutModalOpen}
                onClose={() => setLogoutModalOpen(false)}
                onConfirm={onLogoutClick}
            />
        </>
    );
};

export default UserDropdown;
