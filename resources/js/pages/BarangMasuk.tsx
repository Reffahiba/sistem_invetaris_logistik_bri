import React, { useEffect, useState, useRef } from "react";
import Layout from "@/LayoutAdmin";
import axios from "axios";
import { PlusCircle, ChevronDown, ChevronUp } from 'lucide-react';;
import AddBarangMasukModal from "@/components/modal/AddBarangMasukModal";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

// Tipe data untuk transaksi
type TransaksiMasuk = {
  id_transaksi: number;
  kode_transaksi: string;
  tanggal_masuk: string;
  jumlah_masuk: number;
  deskripsi: string;
  barang: {
    nama_barang: string;
  };
};

// SortArrow Component (sama)
const SortArrow = ({ order }: { order: 'asc' | 'desc' }) => (
  <div className="inline-flex flex-col items-center justify-center ml-1">
    <ChevronUp
      className={`h-3 w-3  ${
        order === 'asc' ? 'text-gray-800' : 'text-gray-400'
      }`}
    />
    <ChevronDown
      className={`h-3 w-3 -mt-1 ${
        order === 'desc' ? 'text-gray-800' : 'text-gray-400'
      }`}
    />
  </div>
);

function BarangMasuk() {
  const [data, setData] = useState<TransaksiMasuk[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState('tanggal_masuk');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  // State untuk filter tanggal
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/api/admin/barang-masuk", {
        params: { 
            sortBy, 
            search,
            sortOrder, 
            page: currentPage, 
            perPage,
            start_date: startDate ? startDate.toISOString().split('T')[0] : null,
            end_date: endDate ? endDate.toISOString().split('T')[0] : null,
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
  
  useEffect(() => {
    const handler = setTimeout(() => {
        fetchData();
    }, 300);

    return () => {
        clearTimeout(handler);
    };
  }, [sortBy, sortOrder, currentPage, perPage, startDate, endDate, search]);

  useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
          setShowExportMenu(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, currentPage + Math.floor(maxPagesToShow / 2));

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
  const basePaginationButtonClass = "px-3 py-1 rounded-md font-medium transition duration-150 ease-in-out text-sm";
  const activePaginationButtonClass = "bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2";
  const inactivePaginationButtonClass = "bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed";
  const activePageNumberClass = "bg-blue-600 text-white font-bold";
  const inactivePageNumberClass = "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100";
  
  return (
    <Layout>
      <main className="min-h-screen">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Barang Masuk</h1>

        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <div className="flex items-center gap-2">
                <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} placeholderText="Tanggal Mulai" className="border rounded-lg px-3 py-2 w-40" />
                <span>-</span>
                <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} placeholderText="Tanggal Akhir" className="border rounded-lg px-3 py-2 w-40" />
            </div>
            <div className="flex items-center space-x-3 w-full md:w-auto justify-end mt-4 md:mt-0">
            <button
              onClick={() => setModalOpen(true)}
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
                onClick={() => setShowExportMenu(!showExportMenu)}
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
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Export sebagai PDF
                  </button>
                  <button
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
                {[10, 25, 50, 100].map(n => (
                <option key={n} value={n}>{n} entri / halaman</option>
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
          {/* Tabel */}
           <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-16">No</th>
                  <th onClick={() => handleSort('kode_transaksi')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer">Kode
                    {sortBy === "kode_transaksi" && (
                        <SortArrow order={sortOrder} />
                    )}
                  </th>
                  <th onClick={() => handleSort('tanggal_masuk')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer">Tanggal
                    {sortBy === "tanggal_masuk" && (
                        <SortArrow order={sortOrder} />
                    )}
                  </th>
                  <th onClick={() => handleSort('barang.nama_barang')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer">
                    Nama Barang
                    {sortBy === "barang.nama_barang" && (
                        <SortArrow order={sortOrder} />
                    )}
                  </th>
                  <th onClick={() => handleSort('jumlah_masuk')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer">
                    Jumlah Masuk
                    {sortBy === "jumlah_masuk" && (
                        <SortArrow order={sortOrder} />
                    )}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Catatan</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y">
                 {isLoading ? (
                  <tr><td colSpan={6} className="text-center py-4 text-gray-500">Memuat data...</td></tr>
                ) : data.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-4 italic text-gray-500">Tidak ada transaksi ditemukan.</td></tr>
                ) : (
                  data.map((trans, index) => (
                    <tr key={trans.id_transaksi} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-500">{(currentPage - 1) * perPage + index + 1}</td>
                      <td className="px-6 py-4 font-mono text-gray-500 text-sm">{trans.kode_transaksi}</td>
                      <td className="px-6 py-4 text-gray-500">{new Date(trans.tanggal_masuk).toLocaleDateString('id-ID')}</td>
                      <td className="px-6 py-4 font-medium text-gray-500">{trans.barang.nama_barang}</td>
                      <td className="px-6 py-4 text-[#F46F23] font-bold ml-8">+{trans.jumlah_masuk}</td>
                      <td className="px-6 py-4 text-gray-500 text-sm">{trans.deskripsi || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
           </div>
           {/* Pagination Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t border-gray-200">
            <span className="text-gray-600 mb-2 sm:mb-0">
              Halaman <span className="font-semibold">{currentPage}</span> dari{" "}
              <span className="font-semibold">{totalPages}</span>
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1 || isLoading}
                className={`${basePaginationButtonClass} ${
                  currentPage === 1 ? inactivePaginationButtonClass : activePaginationButtonClass
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
                    ${pageNumber === currentPage ? activePageNumberClass : inactivePageNumberClass}
                    ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                >
                  {pageNumber}
                </button>
              ))}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages || isLoading}
                className={`${basePaginationButtonClass} ${
                  currentPage === totalPages ? inactivePaginationButtonClass : activePaginationButtonClass
                }`}
              >
                Selanjutnya
              </button>
            </div>
          </div>
          {/* Pagination Footer */}
        </div>
      </main>
      
      <AddBarangMasukModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} onSuccess={fetchData} />
    </Layout>
  );
}

export default BarangMasuk;