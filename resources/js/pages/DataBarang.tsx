import React, { useEffect, useState, useRef } from "react";
import Layout from "@/LayoutAdmin";
import axios from "axios";
import { Pencil, Trash2, Eye, ChevronDown, ChevronUp } from "lucide-react";
import AddBarangModal from "@/components/modal/AddBarangModal";
import ImageDetailModal from "@/components/modal/ImageDetailModal";
import DeleteBarangModal from "@/components/modal/DeleteBarangModal";
import EditBarangModal from "@/components/modal/EditBarangModal";
import SuccessModal from "@/components/modal/SuccessModal";
import FailModal from "@/components/modal/FailModal";
import Breadcrumb from "@/components/ui/breadcrumb";

// Definisi tipe data untuk tabel barang (sesuain yagesya sama database)
type Barang = {
    id_barang: number;
    gambar_barang: string;
    nama_barang: string;
    kategori: {
        id_kategori: number;
        nama_kategori: string;
    };
    stok: number;
    satuan: string;
};

const breadcrumbPaths = [
    { label: "Manajemen Barang", href: "/admin/data-barang" },
    { label: "Kelola Barang" },
];

const SortArrow = ({ order }: { order: "asc" | "desc" }) => (
    <div className="inline-flex flex-col items-center justify-center ml-1">
        <ChevronUp
            className={`h-3 w-3  ${
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
function DataBarang() {
    const el = document.getElementById("app");

    const [data, setData] = useState<Barang[]>([]);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState<keyof Barang>("nama_barang");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [showExportMenu, setShowExportMenu] = useState(false);
    const exportMenuRef = useRef<HTMLDivElement>(null);
    const [selectedKategori, setSelectedKategori] = useState<string | null>(
        null
    );
    const [showKategoriDropdown, setShowKategoriDropdown] = useState(false);
    const kategoriRef = useRef<HTMLDivElement>(null);
    const [allKnownKategoriOptions, setAllKnownKategoriOptions] = useState<
        string[]
    >([]);

    // === STATE FOR MODALS ===
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [currentImageModalUrl, setCurrentImageModalUrl] = useState<
        string | null
    >(null);
    const [currentImageModalAlt, setCurrentImageModalAlt] =
        useState<string>("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<Barang | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [itemToEdit, setItemToEdit] = useState<Barang | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [failMessage, setFailMessage] = useState<string | null>(null);

    // === STATE FOR IMAGE HOVER EFFECT ===
    const [hoveredImageId, setHoveredImageId] = useState<number | null>(null);

    // Fetch Data Function
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get("/api/admin/barang", {
                params: {
                    search,
                    sortBy,
                    sortOrder,
                    page: currentPage,
                    perPage,
                    kategori: selectedKategori,
                },
            });

            setData(res.data.data);
            setTotalPages(res.data.last_page);

            // Fitur Filter Kategori
            const newKategoriFound = (res.data.data as Barang[])
                .map((barang) => barang.kategori?.nama_kategori)
                .filter(Boolean) as string[];

            setAllKnownKategoriOptions((prevOptions) => {
                const combined = new Set([...prevOptions, ...newKategoriFound]);
                return Array.from(combined).sort();
            });
        } catch (err) {
            console.error("Fetch failed", err);
        } finally {
            setIsLoading(false);
        }
    };

    // Search and Sort Effect
    useEffect(() => {
        const handler = setTimeout(() => {
            fetchData();
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [search, sortBy, sortOrder, currentPage, perPage, selectedKategori]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                exportMenuRef.current &&
                !exportMenuRef.current.contains(event.target as Node)
            ) {
                setShowExportMenu(false);
            }
            if (
                kategoriRef.current &&
                !kategoriRef.current.contains(event.target as Node)
            ) {
                setShowKategoriDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSort = (key: keyof Barang) => {
        if (sortBy === key) {
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortBy(key);
            setSortOrder("asc");
        }
        setCurrentPage(1);
    };

    // NGETEST EXPORT(belum fullly functional)
    const handleExportPDF = () => {
        alert("Export sebagai PDF diklik!");
        setShowExportMenu(false);
    };

    const handleExportExcel = () => {
        alert("Export sebagai Excel diklik!");
        setShowExportMenu(false);
    };

    // Modal Handlers
    const handleOpenEditModal = (barang: Barang) => {
        setItemToEdit(barang);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setItemToEdit(null);
    };

    const handleOpenDeleteModal = (barang: Barang) => {
        setItemToDelete(barang);
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setItemToDelete(null);
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

    const handleKategoriSelect = (kategori: string | null) => {
        setSelectedKategori(kategori);
        setShowKategoriDropdown(false);
        setCurrentPage(1);
    };

    const handleSuccess = (message: string) => {
        fetchData(); // Muat ulang data tabel
        setSuccessMessage(message); // Tampilkan modal sukses dengan pesan
    };

    const handleFail = (message: string) => {
        fetchData(); // Muat ulang data tabel
        setFailMessage(message); // Tampilkan modal fail dengan pesan
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
                        Kelola Barang
                    </h1>
                    <Breadcrumb paths={breadcrumbPaths} />
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                    {/* Left Group: Filter Kategori */}
                    <div className="flex items-center gap-4 w-full md:w-auto bg-white rounded-lg">
                        {/* Filter Kategori */}
                        <div
                            className="relative w-full sm:w-48"
                            ref={kategoriRef}
                        >
                            <button
                                onClick={() =>
                                    setShowKategoriDropdown(
                                        !showKategoriDropdown
                                    )
                                }
                                className="flex items-center justify-between border border-gray-300 rounded-lg px-4 py-2 w-full text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                            >
                                {selectedKategori || "Filter Kategori"}
                                <ChevronDown
                                    className={`
                    ml-2 h-4 w-4 shrink-0
                    transition-transform duration-200 ease-in-out
                    ${showKategoriDropdown ? "rotate-180" : ""}
                  `}
                                />
                            </button>
                            {showKategoriDropdown && (
                                <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                                    <button
                                        onClick={() =>
                                            handleKategoriSelect(null)
                                        }
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Semua Kategori
                                    </button>
                                    {allKnownKategoriOptions.map((kategori) => (
                                        <button
                                            key={kategori}
                                            onClick={() =>
                                                handleKategoriSelect(kategori)
                                            }
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            {kategori}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Group: Actions (Tambah Data, Export) */}
                    <div className="flex items-center space-x-3 w-full md:w-auto justify-end mt-4 md:mt-0">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center px-4 py-2 bg-primary text-white font-medium rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 ease-in-out"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                            Tambah Data
                        </button>

                        {/* Dropdown Menu Export */}
                        <div className="relative" ref={exportMenuRef}>
                            <button
                                onClick={() =>
                                    setShowExportMenu(!showExportMenu)
                                }
                                className="p-2 bg-gray-200 text-gray-600 rounded-lg shadow-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition duration-200 ease-in-out"
                                aria-expanded={showExportMenu}
                                aria-haspopup="true"
                            >
                                {/* Ikon titik tiga */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4z" />
                                </svg>
                            </button>

                            {/* Menu Dropdown Export */}
                            {showExportMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                                    <button
                                        onClick={handleExportPDF}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        role="menuitem"
                                    >
                                        Export sebagai PDF
                                    </button>
                                    <button
                                        onClick={handleExportExcel}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        role="menuitem"
                                    >
                                        Export sebagai Excel
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Search Bar dan Entry */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-gray-200 mb-6">
                        <input
                            type="text"
                            placeholder="Cari nama barang..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                        />
                        <div className="relative w-full sm:w-48">
                            <select
                                value={perPage}
                                onChange={(e) => {
                                    setPerPage(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                                className="w-full appearance-none border border-gray-300 rounded-lg pl-4 pr-10 py-2 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out cursor-pointer"
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
                    {/* Search Bar dan Entry */}

                    {/* Tabel Data Barang */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Gambar
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                                        onClick={() =>
                                            handleSort("nama_barang")
                                        }
                                    >
                                        <div className="flex items-center">
                                            Nama Barang
                                            {sortBy === "nama_barang" && (
                                                <SortArrow order={sortOrder} />
                                            )}
                                        </div>
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                                        onClick={() => handleSort("kategori")}
                                    >
                                        <div className="flex items-center">
                                            Kategori
                                            {sortBy === "kategori" && (
                                                <SortArrow order={sortOrder} />
                                            )}
                                        </div>
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                                        onClick={() => handleSort("stok")}
                                    >
                                        <div className="flex items-center">
                                            Stok
                                            {sortBy === "stok" && (
                                                <SortArrow order={sortOrder} />
                                            )}
                                        </div>
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                                        onClick={() => handleSort("satuan")}
                                    >
                                        <div className="flex items-center">
                                            Satuan
                                            {sortBy === "satuan" && (
                                                <SortArrow order={sortOrder} />
                                            )}
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>

                            {/* Kalau mau ganti sesuai table lorang disini aja */}
                            <tbody className="bg-white divide-y divide-gray-200">
                                {isLoading ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="text-center py-4 text-gray-500"
                                        >
                                            Memuat data...
                                        </td>
                                    </tr>
                                ) : data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-6 py-4 text-center text-gray-400 italic"
                                        >
                                            Tidak ada data barang yang
                                            ditemukan.
                                        </td>
                                    </tr>
                                ) : (
                                    data.map((barang) => (
                                        <tr
                                            key={barang.id_barang}
                                            className="hover:bg-gray-50 transition duration-150 ease-in-out"
                                        >
                                            <td
                                                className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 relative group"
                                                onMouseEnter={() =>
                                                    setHoveredImageId(
                                                        barang.id_barang
                                                    )
                                                }
                                                onMouseLeave={() =>
                                                    setHoveredImageId(null)
                                                }
                                            >
                                                {barang.gambar_barang ? (
                                                    <>
                                                        <img
                                                            src={
                                                                barang.gambar_barang
                                                            }
                                                            alt={
                                                                barang.nama_barang
                                                            }
                                                            className="h-12 w-12 object-cover rounded-md shadow-sm"
                                                        />
                                                        {/* Icon preview muncul saat hover */}
                                                        {hoveredImageId ===
                                                            barang.id_barang && (
                                                            <div
                                                                className="absolute inset-0 flex items-center justify-center mt-4 ml-6 h-12 w-12 bg-black bg-opacity-35 rounded-md cursor-pointer transition-opacity duration-200 opacity-0 group-hover:opacity-100"
                                                                onClick={() =>
                                                                    openImageModal(
                                                                        barang.gambar_barang,
                                                                        barang.nama_barang
                                                                    )
                                                                }
                                                            >
                                                                <Eye className="h-6 w-6 text-gray-100" />
                                                            </div>
                                                        )}
                                                    </>
                                                ) : (
                                                    <span className="text-gray-400 italic text-xs">
                                                        Tidak ada gambar
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                                                {barang.nama_barang}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {barang.kategori
                                                    ?.nama_kategori || (
                                                    <span className="italic text-gray-400">
                                                        Tanpa Kategori
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {barang.stok}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {barang.satuan}
                                            </td>
                                            <td className=" py-4 whitespace-nowrap text-center text-sm font-medium">
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() =>
                                                            handleOpenEditModal(
                                                                barang
                                                            )
                                                        }
                                                        className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50 transition duration-150 ease-in-out"
                                                        title="Edit"
                                                    >
                                                        <Pencil className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleOpenDeleteModal(
                                                                barang
                                                            )
                                                        }
                                                        className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition duration-150 ease-in-out"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Tabel Data Barang */}

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

            {/* Modal Tambah Barang, Edit Barang, Hapus Barang dan Modal Detail Gambar */}
            <AddBarangModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={(msg) => handleSuccess(msg)}
                onFail={(msg) => handleFail(msg)}
            />

            <EditBarangModal
                isOpen={isEditModalOpen}
                onClose={handleCloseEditModal}
                onSuccess={(msg) => handleSuccess(msg)}
                itemToEdit={itemToEdit}
            />

            <ImageDetailModal
                isOpen={isImageModalOpen}
                onClose={closeImageModal}
                imageUrl={currentImageModalUrl}
                imageAlt={currentImageModalAlt}
            />

            <DeleteBarangModal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                item={itemToDelete}
                onDeleteSuccess={(msg) => handleSuccess(msg)}
            />

            {/* Modal Sukses dan Gagal */}
            <SuccessModal
                isOpen={!!successMessage}
                onClose={() => setSuccessMessage(null)}
                message={successMessage || ""}
            />

            <FailModal
                isOpen={!!failMessage}
                onClose={() => setFailMessage(null)}
                message={failMessage || ""}
            />
        </Layout>
    );
}
export default DataBarang;
