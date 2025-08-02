import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";

const placeholderTexts = [
    "Cari data barang...",
    "Cari permintaan...",
    "Cari pengguna...",
];

const SearchInput: React.FC = () => {
    const [isFocused, setIsFocused] = useState(false);
    const [animate, setAnimate] = useState(false);
    const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);

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

    return (
        <div className="relative w-full">
            <input
                type="text"
                className="w-full rounded-full border px-3 py-2 pl-10 text-sm outline-none focus:outline-none focus:ring-1 focus:ring-gray-200"
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <span
                className={`absolute left-10 top-1/2 transform -translate-y-1/2 text-sm text-gray-400 pointer-events-none transition-all duration-200 ${
                    isFocused || animate
                        ? "opacity-0 -translate-y-2"
                        : "opacity-100"
                }`}
            >
                {placeholderTexts[currentPlaceholderIndex]}
            </span>
        </div>
    );
};

export default SearchInput;
