// FRONTEND: DaftarPermintaan.tsx (mirroring DataBarang.tsx style)

import React, { useEffect, useState, useRef } from "react";
import Layout from "@/LayoutAdmin";
import axios from "axios";
import { Eye, ChevronDown, ChevronUp } from "lucide-react";
import ImageDetailModal from "@/components/modal/ImageDetailModal";
import Breadcrumb from "@/components/ui/breadcrumb";
import SuccessModal from "@/components/modal/SuccessModal";
import FailModal from "@/components/modal/FailModal";
import ConfirmationModal from "@/components/modal/ConfirmationModal";
import RejectReasonModal from "@/components/modal/RejectModal";
import { Spa } from "@mui/icons-material";

// Tipe data untuk permintaan
interface DetailPermintaan {
    id_detail: number;
    nama_barang: string;
    jumlah_minta: number;
    id_permintaan: number;
    id_barang: number;
    status: string;
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
    const [perPage, setPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [currentImageModalUrl, setCurrentImageModalUrl] = useState<
        string | null
    >(null);
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
            setTotalPages(res.data.last_page);
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

    // Jumlah angka halaman yang akan ditampilkan
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

    // Pagination Disabled & Activated Effect
    const basePaginationButtonClass =
        "px-3 py-1 rounded-sm font-medium transition duration-150 ease-in-out text-sm";
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
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">
                        Daftar Permintaan
                    </h1>
                    <Breadcrumb paths={breadcrumbPaths} />
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-gray-200 mb-6">
                        <input
                            type="text"
                            placeholder="Cari nama barang..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                        <div className="w-full sm:w-48">
                            <select
                                value={perPage}
                                onChange={(e) => {
                                    setPerPage(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                            >
                                {[10, 25, 50].map((n) => (
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
                                ) : data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="text-center py-4 text-gray-400 italic"
                                        >
                                            Tidak ada permintaan.
                                        </td>
                                    </tr>
                                ) : (
                                    data.map((p) => (
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
                                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
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
                                                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
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
                                                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                                                    >
                                                        Antar
                                                    </button>
                                                )}
                                                {p.status ===
                                                "sedang diantar" ? (
                                                    <p className="font-semibold text-sm">
                                                        <span className="text-blue-600 bg-blue-100 ring-1 ring-blue-600 py-1 px-2 rounded-xl">
                                                            Sedang Diantar
                                                        </span>
                                                    </p>
                                                ) : p.status ===
                                                  "telah diterima" ? (
                                                    <p className="font-semibold text-sm">
                                                        <span className="text-green-600 bg-green-100 ring-1 ring-green-600 py-1 px-2 rounded-xl">
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
