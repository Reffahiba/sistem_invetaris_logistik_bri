import React, { useEffect, useState, useRef } from "react";
import Layout from "@/LayoutAdmin";
import axios from "axios";
import { ChevronDown, ChevronUp, Calendar, X } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Breadcrumb from "@/components/ui/breadcrumb";

// Tipe data baru untuk transaksi keluar
type TransaksiKeluar = {
    id_detail: number;
    jumlah_minta: number;
    permintaan: {
        id_permintaan: string;
        tanggal_minta: string;
        user: {
            nama: string;
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

// SortArrow Component (tidak berubah)
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

    // 2. Kembalikan state untuk start dan end date
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

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
                            onChange={(date) => setStartDate(date)}
                            placeholderText="Tanggal Akhir"
                            className="border rounded-lg px-3 py-2 w-40"
                            dateFormat="dd/MM/yyyy"
                            isClearable
                        />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
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
                                        ID Permintaan
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
                                            Barang{" "}
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
                                            <td className="px-6 py-4 font-medium text-gray-700">
                                                {trans.permintaan.user.nama}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-700">
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
                    {/* Pagination */}
                </div>
            </main>
        </Layout>
    );
}

export default BarangKeluar;
