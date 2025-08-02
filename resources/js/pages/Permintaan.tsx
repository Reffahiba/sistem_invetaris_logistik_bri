// FRONTEND: DaftarPermintaan.tsx (mirroring DataBarang.tsx style)

import React, { useEffect, useState, useRef } from "react";
import Layout from "@/LayoutAdmin";
import axios from "axios";
import { Eye, ChevronDown, ChevronUp, Search } from "lucide-react";
import ImageDetailModal from "@/components/modal/ImageDetailModal";
import Breadcrumb from "@/components/ui/breadcrumb";
import SuccessModal from "@/components/modal/SuccessModal";
import FailModal from "@/components/modal/FailModal";
import ConfirmationModal from "@/components/modal/ConfirmationModal";
import RejectReasonModal from "@/components/modal/RejectModal";
import { Spa } from "@mui/icons-material";


type Barang = {
    id_barang: number;
    nama_barang: string;
    stok: number;
    gambar_barang?: string;
};

// Tipe data untuk permintaan
interface DetailPermintaan {
    id_detail: number;
    nama_barang: string;
    jumlah_minta: number;
    id_permintaan: number;
    id_barang: number;
    status: string;
    tanggal_minta: Date;
    gambar_barang?: string | null;
    nama_user: string;
}

const breadcrumbPaths = [
    { label: "Manajemen Barang", href: "/admin/data-barang" },
    { label: "Daftar Permintaan" },
];

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

interface Props {
    daftarPermintaan?: DetailPermintaan[]; // buat opsional agar tidak error jika undefined
}

export default function Permintaan() {
    const [data, setData] = useState<DetailPermintaan[]>([]);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState<keyof DetailPermintaan>("nama_barang");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(5);
    const [isLoading, setIsLoading] = useState(false);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");

    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [currentImageModalUrl, setCurrentImageModalUrl] = useState<string | null>(null);
    const [currentImageModalAlt, setCurrentImageModalAlt] = useState("");
    const [hoveredImageId, setHoveredImageId] = useState<number | null>(null);

    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [failMessage, setFailMessage] = useState<string | null>(null);

    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [selectedAction, setSelectedAction] = useState<{
        id: number;
        status: string;
    } | null>(null);

    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [rejectingId, setRejectingId] = useState<number | null>(null);

    function normalizeDate(date: Date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }

    const filteredPermintaan = data.filter((item) => {
        const tanggalItem = normalizeDate(new Date(item.tanggal_minta));
        const start = startDate ? normalizeDate(startDate) : null;
        const end = endDate ? normalizeDate(endDate) : null;

        // Jika startDate ada dan tanggal item lebih kecil, exclude
        if (start && tanggalItem < start) return false;

        // Jika endDate ada dan tanggal item lebih besar, exclude
        if (end && tanggalItem > end) return false;

        const matchesSearch =
        item.nama_barang.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nama_user.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesSearch;
    });

    // Pagination
    const totalItems = filteredPermintaan.length;
    const totalPages = Math.ceil(totalItems / perPage);

    const paginatedPermintaan = filteredPermintaan.slice(
        (currentPage - 1) * perPage,
        currentPage * perPage
    );

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get("/admin/permintaan", {
                params: {
                    search,
                    sortBy,
                    sortOrder,
                    page: currentPage,
                    perPage,
                },
            });
            setData(res.data.detail_permintaan);
        } catch (err) {
            console.error("Gagal memuat data permintaan", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const handler = setTimeout(fetchData, 300);

        return () => clearTimeout(handler);
    }, [search, sortBy, sortOrder, currentPage, perPage]);

    const handleSort = (key: keyof DetailPermintaan) => {
        if (sortBy === key) {
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortBy(key);
            setSortOrder("asc");
        }
        setCurrentPage(1);
    };

    const openImageModal = (imageUrl: string, imageAlt: string) => {
        setCurrentImageModalUrl(imageUrl);
        setCurrentImageModalAlt(imageAlt);
        setIsImageModalOpen(true);
    };
    const closeImageModal = () => {
        setIsImageModalOpen(false);
        setCurrentImageModalUrl(null);
        setCurrentImageModalAlt("");
    };

    const confirmUpdateStatus = (id: number, newStatus: string) => {
        setSelectedAction({ id, status: newStatus });
        setConfirmModalOpen(true);
    };

    const handleConfirmedStatus = async () => {
        if (!selectedAction) return;

        const { id, status } = selectedAction;
        try {
            await axios.patch(`/admin/update-status/${id}`, {
                status,
            });

            setData((prev) =>
                prev.map((data) =>
                    data.id_permintaan === id ? { ...data, status } : data
                )
            );

            setSuccessMessage(`Status berhasil diperbarui menjadi '${status}'`);
        } catch (error) {
            console.error("Gagal memperbarui status:", error);
            setFailMessage("Terjadi kesalahan saat memperbarui status");
        } finally {
            setConfirmModalOpen(false);
            setSelectedAction(null);
        }
    };

    const handleRejectWithReason = async (reason: string) => {
        if (!rejectingId) return;
        try {
            await axios.patch(`/admin/update-status/${rejectingId}`, {
                status: "ditolak",
                alasan: reason,
            });

            setData((prev) =>
                prev.map((item) =>
                    item.id_permintaan === rejectingId
                        ? { ...item, status: "ditolak" }
                        : item
                )
            );

            setSuccessMessage("Permintaan berhasil ditolak.");
            setTimeout(() => {
                window.location.href = "/permintaan";
            }, 1000);
        } catch (error) {
            console.error("Gagal menolak permintaan:", error);
            setFailMessage("Terjadi kesalahan saat menolak permintaan.");
        } finally {
            setIsRejectModalOpen(false);
            setRejectingId(null);
        }
    };

    return (
        <Layout>
            <main className="min-h-screen">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">
                        Daftar Permintaan
                    </h1>
                    <Breadcrumb paths={breadcrumbPaths} />
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-gray-200 mb-6">
                        <div className="relative w-full md:w-48">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full rounded-full border px-3 py-1 pl-10 text-sm outline-none focus:outline-none focus:ring-1 focus:ring-gray-200"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        </div>
                        <div className="w-full sm:w-48">
                            <select
                                value={perPage}
                                onChange={(e) => {
                                    setPerPage(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                            >
                                {[5, 10, 25, 50].map((n) => (
                                    <option key={n} value={n}>
                                        {n} entri / halaman
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Gambar
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                                        onClick={() =>
                                            handleSort("nama_barang")
                                        }
                                    >
                                        Nama Barang{" "}
                                        {sortBy === "nama_barang" && (
                                            <SortArrow order={sortOrder} />
                                        )}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Tanggal Minta
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Jumlah Minta
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Nama Peminta
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {isLoading ? (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="text-center py-4"
                                        >
                                            Memuat...
                                        </td>
                                    </tr>
                                ) : filteredPermintaan.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="text-center py-4 text-gray-400 italic"
                                        >
                                            Tidak ada permintaan.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredPermintaan.map((p) => (
                                        <tr
                                            key={p.id_detail}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4">
                                                <img
                                                    src={p.gambar_barang}
                                                    alt={p.nama_barang}
                                                    onMouseEnter={() =>
                                                        setHoveredImageId(
                                                            p.id_detail
                                                        )
                                                    }
                                                    onMouseLeave={() =>
                                                        setHoveredImageId(null)
                                                    }
                                                    className="h-20 w-20 object-cover rounded-sm"
                                                />
                                                {hoveredImageId ===
                                                    p.id_detail && (
                                                    <div
                                                        onClick={() =>
                                                            openImageModal(
                                                                p.gambar_barang,
                                                                p.nama_barang
                                                            )
                                                        }
                                                        className="absolute mt-[-3rem] ml-10 h-12 w-12 bg-black bg-opacity-40 flex items-center justify-center rounded-sm cursor-pointer"
                                                    >
                                                        <Eye
                                                            className="text-white"
                                                            size={20}
                                                        />
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                {p.nama_barang}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                {new Date(
                                                    p.tanggal_minta
                                                ).toLocaleDateString("id-ID")}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                {p.jumlah_minta}
                                            </td>
                                            <td className="px-6 py-4 space-x-2">
                                                {p.status === "menunggu" && (
                                                    <>
                                                        <button
                                                            onClick={() => {
                                                                setRejectingId(
                                                                    p.id_permintaan
                                                                );
                                                                setIsRejectModalOpen(
                                                                    true
                                                                );
                                                            }}
                                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-md"
                                                        >
                                                            Tolak
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                confirmUpdateStatus(
                                                                    p.id_permintaan,
                                                                    "sedang diproses"
                                                                )
                                                            }
                                                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg text-md"
                                                        >
                                                            Setujui
                                                        </button>
                                                    </>
                                                )}
                                                {p.status ===
                                                    "sedang diproses" && (
                                                    <button
                                                        onClick={() =>
                                                            confirmUpdateStatus(
                                                                p.id_permintaan,
                                                                "sedang diantar"
                                                            )
                                                        }
                                                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-md"
                                                    >
                                                        Antar
                                                    </button>
                                                )}
                                                {p.status ===
                                                "sedang diantar" ? (
                                                    <p className="font-semibold text-md text-center">
                                                        <span className="text-blue-600 bg-blue-100 ring-1 ring-blue-600 py-1 rounded-xl block break-words sm:text-sm">
                                                            Sedang Diantar
                                                        </span>
                                                    </p>
                                                ) : p.status ===
                                                  "telah diterima" ? (
                                                    <p className="font-semibold text-md text-center">
                                                        <span className="text-green-600 bg-green-100 ring-1 ring-green-600 py-1 rounded-xl block break-words sm:text-sm">
                                                            Telah Diterima
                                                        </span>
                                                    </p>
                                                ) : null}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                {p.nama_user}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages >= 1 && (
                        <div className="flex justify-between mt-4 gap-2">
                            <span className="text-gray-600">
                                Halaman {currentPage} dari {totalPages}
                            </span>
                            <div className="space-x-2 flex flex-row">
                                <button
                                    onClick={() =>
                                        setCurrentPage((p) =>
                                            Math.max(p - 1, 1)
                                        )
                                    }
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
                                >
                                    Prev
                                </button>

                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`px-3 py-1 rounded-xl ${
                                            currentPage === i + 1
                                                ? "bg-green-500 text-white"
                                                : "bg-gray-100"
                                        }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}

                                <button
                                    onClick={() =>
                                        setCurrentPage((p) =>
                                            Math.min(p + 1, totalPages)
                                        )
                                    }
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <ImageDetailModal
                    isOpen={isImageModalOpen}
                    onClose={closeImageModal}
                    imageUrl={currentImageModalUrl}
                    imageAlt={currentImageModalAlt}
                />

                <SuccessModal
                    isOpen={!!successMessage}
                    onClose={() => setSuccessMessage(null)}
                    message={successMessage || ""}
                />
                <ConfirmationModal
                    isOpen={confirmModalOpen}
                    onClose={() => setConfirmModalOpen(false)}
                    onConfirm={handleConfirmedStatus}
                    message={`Apakah Anda yakin ingin mengubah status menjadi '${selectedAction?.status}'?`}
                />
                <RejectReasonModal
                    isOpen={isRejectModalOpen}
                    onClose={() => {
                        setIsRejectModalOpen(false);
                        setRejectingId(null);
                    }}
                    onConfirm={handleRejectWithReason}
                />

                <FailModal
                    isOpen={!!failMessage}
                    onClose={() => setFailMessage(null)}
                    message={failMessage || ""}
                />
            </main>
        </Layout>
    );
}
