import React, { useEffect, useState, useRef } from "react";
import Layout from "@/LayoutAdmin";
import axios from "axios";
import {
    FileSpreadsheet,
    FileText,
    ChevronDown,
    ChevronUp,
    Calendar,
    X,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Breadcrumb from "@/components/ui/breadcrumb";
import ExportPreview from "@/components/exports/ExportPreview";

// Tipe data baru untuk transaksi keluar
type TransaksiKeluar = {
    id_detail: number;
    jumlah_minta: number;
    permintaan: {
        id_permintaan: string;
        tanggal_minta: string;
        user: {
            nama_user: string;
        };
    };
    barang: {
        nama_barang: string;
    };
};

const breadcrumbPaths = [
    { label: "Manajemen Stok", href: "/admin/barang-masuk" },
    { label: "Barang Keluar" },
];

// SortArrow Component
const SortArrow = ({ order }: { order: "asc" | "desc" }) => (
    <div className="inline-flex flex-col items-center justify-center ml-1">
        <ChevronUp
            className={`h-3 w-3 ${
                order === "asc" ? "text-gray-800" : "text-gray-400"
            }`}
        />
        <ChevronDown
            className={`h-3 w-3 -mt-1 ${
                order === "desc" ? "text-gray-800" : "text-gray-400"
            }`}
        />
    </div>
);

function BarangKeluar() {
    const [data, setData] = useState<TransaksiKeluar[]>([]);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("tanggal_minta");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [showExportMenu, setShowExportMenu] = useState(false);
    const exportMenuRef = useRef<HTMLDivElement>(null);

    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const [isPreviewing, setIsPreviewing] = useState(false);
    const [previewHtml, setPreviewHtml] = useState("");

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get("/api/admin/barang-keluar", {
                params: {
                    sortBy,
                    search,
                    sortOrder,
                    page: currentPage,
                    perPage,
                    // 3. Sesuaikan kembali parameter API
                    start_date: startDate
                        ? startDate.toISOString().split("T")[0]
                        : null,
                    end_date: endDate
                        ? endDate.toISOString().split("T")[0]
                        : null,
                },
            });
            setData(res.data.data);
            setTotalPages(res.data.last_page);
        } catch (err) {
            console.error("Gagal mengambil data:", err);
        } finally {
            setIsLoading(false);
        }
    };

    // 4. Sesuaikan dependensi useEffect
    useEffect(() => {
        const handler = setTimeout(() => {
            fetchData();
        }, 500);
        return () => clearTimeout(handler);
    }, [sortBy, sortOrder, currentPage, perPage, startDate, endDate, search]);

    const handleSort = (key: string) => {
        if (sortBy === key) {
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortBy(key);
            setSortOrder("asc");
        }
    };

    // Preview PDF dan Export Excel
    const handlePreview = async () => {
        setIsLoading(true);
        setShowExportMenu(false);
        try {
            const params = new URLSearchParams({
                search: search,
                start_date: startDate
                    ? startDate.toISOString().split("T")[0]
                    : "",
                end_date: endDate ? endDate.toISOString().split("T")[0] : "",
                sortBy: sortBy,
                sortOrder: sortOrder,
            }).toString();

            const response = await axios.get(
                `/admin/barang-keluar/preview-pdf?${params}`
            );
            setPreviewHtml(response.data);
            setIsPreviewing(true);
        } catch (error) {
            console.error("Gagal memuat preview:", error);
            alert("Gagal memuat pratinjau laporan.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleActualExportExcel = () => {
        // Buat URL dengan parameter filter
        const params = new URLSearchParams({
            search: search,
            start_date: startDate ? startDate.toISOString().split("T")[0] : "",
            end_date: endDate ? endDate.toISOString().split("T")[0] : "",
            sortBy: sortBy,
            sortOrder: sortOrder,
        }).toString();

        // Buka URL di tab baru untuk men-trigger download
        window.open(`/admin/barang-keluar/export-excel?${params}`, "_blank");
        setShowExportMenu(false);
    };

    // 4. Jika isPreviewing true, render halaman preview
    if (isPreviewing) {
        return (
            <ExportPreview
                htmlContent={previewHtml}
                onBack={() => setIsPreviewing(false)}
                onExportExcel={handleActualExportExcel}
            />
        );
    }

    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5;
        let startPage = Math.max(
            1,
            currentPage - Math.floor(maxPagesToShow / 2)
        );
        let endPage = Math.min(
            totalPages,
            currentPage + Math.floor(maxPagesToShow / 2)
        );

        if (endPage - startPage + 1 < maxPagesToShow) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }
        if (startPage === 1 && endPage < totalPages) {
            endPage = Math.min(totalPages, maxPagesToShow);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }
        return pageNumbers;
    };

    // Pagination Disabled & Activated Effect
    const basePaginationButtonClass =
        "px-3 py-1 rounded-md font-medium transition duration-150 ease-in-out text-sm";
    const activePaginationButtonClass =
        "bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2";
    const inactivePaginationButtonClass =
        "bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed";
    const activePageNumberClass = "bg-blue-600 text-white font-bold";
    const inactivePageNumberClass =
        "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100";

    return (
        <Layout>
            <main className="min-h-screen">
                {/* Title & Breadcrumbs */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">
                        Barang Keluar
                    </h1>
                    <Breadcrumb paths={breadcrumbPaths} />
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                    {/* 5. Kembalikan komponen DatePicker ganda */}
                    <div className="flex items-center gap-2">
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            placeholderText="Tanggal Mulai"
                            className="border rounded-lg px-3 py-2 w-40"
                            dateFormat="dd/MM/yyyy"
                            isClearable
                        />
                        <span>-</span>
                        <DatePicker
                            selected={endDate}
                            onChange={(date: Date | null) => setEndDate(date)}
                            placeholderText="Tanggal Akhir"
                            className="border rounded-lg px-3 py-2 w-40"
                            dateFormat="dd/MM/yyyy"
                            isClearable
                        />
                    </div>

                    <div className="relative" ref={exportMenuRef}>
                        <button
                            onClick={() => setShowExportMenu(!showExportMenu)}
                            className="p-2 bg-gray-200 text-gray-600 rounded-lg shadow-md hover:bg-gray-300"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                        </button>
                        {showExportMenu && (
                            <div className="absolute right-0 mt-2 w-52 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-10">
                                <button
                                    onClick={handlePreview}
                                    className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    role="menuitem"
                                >
                                    <FileText
                                        size={16}
                                        className="text-red-500"
                                    />
                                    <span>Export PDF</span>
                                </button>
                                <button
                                    onClick={handleActualExportExcel} // Asumsi ini untuk Excel
                                    className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    role="menuitem"
                                >
                                    <FileSpreadsheet
                                        size={16}
                                        className="text-green-600"
                                    />
                                    <span>Export CSV</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-gray-200 mb-6">
                        <input
                            type="text"
                            placeholder="Cari nama barang atau peminta..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="relative w-full sm:w-48">
                            <select
                                value={perPage}
                                onChange={(e) => {
                                    setPerPage(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                                className="w-full appearance-none border border-gray-300 rounded-lg pl-4 pr-10 py-2 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                            >
                                {[10, 25, 50, 100].map((n) => (
                                    <option key={n} value={n}>
                                        {n} entri / halaman
                                    </option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                                <ChevronDown
                                    size={16}
                                    className="transform transition-transform duration-200 group-focus-within:rotate-180"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-16">
                                        No
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        KODE
                                    </th>
                                    <th
                                        onClick={() =>
                                            handleSort("tanggal_minta")
                                        }
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                                    >
                                        <div className="flex items-center">
                                            Tanggal{" "}
                                            {sortBy === "tanggal_minta" && (
                                                <SortArrow order={sortOrder} />
                                            )}
                                        </div>
                                    </th>
                                    <th
                                        onClick={() => handleSort("peminta")}
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                                    >
                                        <div className="flex items-center">
                                            Peminta{" "}
                                            {sortBy === "peminta" && (
                                                <SortArrow order={sortOrder} />
                                            )}
                                        </div>
                                    </th>
                                    <th
                                        onClick={() => handleSort("barang")}
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                                    >
                                        <div className="flex items-center">
                                            Nama Barang{" "}
                                            {sortBy === "barang" && (
                                                <SortArrow order={sortOrder} />
                                            )}
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Jumlah Keluar
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y">
                                {isLoading ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="text-center py-4  text-gray-500"
                                        >
                                            Memuat data...
                                        </td>
                                    </tr>
                                ) : data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="text-center py-4 italic text-gray-500"
                                        >
                                            Tidak ada transaksi ditemukan.
                                        </td>
                                    </tr>
                                ) : (
                                    data.map((trans, index) => (
                                        <tr
                                            key={trans.id_detail}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4 text-gray-500">
                                                {(currentPage - 1) * perPage +
                                                    index +
                                                    1}
                                            </td>
                                            <td className="px-6 py-4 font-mono text-gray-500 text-sm">
                                                {trans.permintaan.id_permintaan}
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">
                                                {new Date(
                                                    trans.permintaan.tanggal_minta
                                                ).toLocaleDateString("id-ID")}
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">
                                                {
                                                    trans.permintaan.user
                                                        .nama_user
                                                }
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">
                                                {trans.barang.nama_barang}
                                            </td>
                                            <td className="px-6 py-4 text-red-600 font-bold">
                                                -{trans.jumlah_minta}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination Footer */}
                    <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t border-gray-200">
                        <span className="text-gray-600 mb-2 sm:mb-0">
                            Halaman{" "}
                            <span className="font-semibold">{currentPage}</span>{" "}
                            dari{" "}
                            <span className="font-semibold">{totalPages}</span>
                        </span>
                        <div className="flex space-x-2">
                            <button
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        Math.max(prev - 1, 1)
                                    )
                                }
                                disabled={currentPage === 1 || isLoading}
                                className={`${basePaginationButtonClass} ${
                                    currentPage === 1
                                        ? inactivePaginationButtonClass
                                        : activePaginationButtonClass
                                }`}
                            >
                                Sebelumnya
                            </button>

                            {getPageNumbers().map((pageNumber) => (
                                <button
                                    key={pageNumber}
                                    onClick={() => setCurrentPage(pageNumber)}
                                    disabled={isLoading}
                                    className={`
                    ${basePaginationButtonClass}
                    ${
                        pageNumber === currentPage
                            ? activePageNumberClass
                            : inactivePageNumberClass
                    }
                    ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                                >
                                    {pageNumber}
                                </button>
                            ))}

                            <button
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        Math.min(prev + 1, totalPages)
                                    )
                                }
                                disabled={
                                    currentPage === totalPages || isLoading
                                }
                                className={`${basePaginationButtonClass} ${
                                    currentPage === totalPages
                                        ? inactivePaginationButtonClass
                                        : activePaginationButtonClass
                                }`}
                            >
                                Selanjutnya
                            </button>
                        </div>
                    </div>
                    {/* Pagination Footer */}
                </div>
            </main>
        </Layout>
    );
}

export default BarangKeluar;
