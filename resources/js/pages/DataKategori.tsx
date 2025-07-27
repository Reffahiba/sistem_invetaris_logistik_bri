import React, { useEffect, useState, useRef } from "react";
import Layout from "@/LayoutAdmin";
import axios from "axios";
import { Pencil, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import AddKategoriModal from "@/components/modal/AddKategoriModal";
import EditKategoriModal from "@/components/modal/EditKategoriModal";
import DeleteKategoriModal from "@/components/modal/DeleteKategoriModal";

// Tipe data Kategori
type Kategori = {
  id_kategori: number;
  nama_kategori: string;
  deskripsi: string;
};

// Komponen SortArrow 
const SortArrow = ({ order }: { order: 'asc' | 'desc' }) => (
  <div className="inline-flex flex-col items-center justify-center ml-1">
    <ChevronUp className={`h-3 w-3 ${order === 'asc' ? 'text-gray-800' : 'text-gray-400'}`} />
    <ChevronDown className={`h-3 w-3 -mt-1 ${order === 'desc' ? 'text-gray-800' : 'text-gray-400'}`} />
  </div>
);

function DataKategori() {
  const [data, setData] = useState<Kategori[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<keyof Kategori>('nama_kategori');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // States for Modals
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<Kategori | null>(null);
  const [itemToDelete, setItemToDelete] = useState<Kategori | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/api/admin/kategori", {
        params: { search, sortBy, sortOrder, page: currentPage, perPage },
      });
      setData(res.data.data);
      setTotalPages(res.data.last_page);
    } catch (err) {
      console.error("Gagal mengambil data kategori:", err);
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
  }, [search, sortBy, sortOrder, currentPage, perPage]);

  const handleSort = (key: keyof Kategori) => {
    if (sortBy === key) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }
  };

  // Handlers to open modals
  const handleOpenEditModal = (kategori: Kategori) => {
    setItemToEdit(kategori);
    setEditModalOpen(true);
  };
  const handleOpenDeleteModal = (kategori: Kategori) => {
    setItemToDelete(kategori);
    setDeleteModalOpen(true);
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
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">Kelola Kategori</h1>
        
        <div className="flex justify-end mb-6">
        <button
              onClick={() => setAddModalOpen(true)}
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
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center pb-6 border-b">
            <input
              type="text"
              placeholder="Cari kategori atau deskripsi..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-80"
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

              {/* Ikon Chevron kustom dari Lucide */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                <ChevronDown
                  size={16}
                  // Animasi rotate akan aktif saat <select> mendapatkan 'focus'
                  className="transform transition-transform duration-200 group-focus-within:rotate-180"
                />
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto mt-6">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-16">No</th>
                  <th onClick={() => handleSort('nama_kategori')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer">
                    <div className="flex items-center">Nama Kategori {sortBy === 'nama_kategori' && <SortArrow order={sortOrder} />}</div>
                  </th>
                  <th onClick={() => handleSort('deskripsi')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer">
                    <div className="flex items-center">Deskripsi {sortBy === 'deskripsi' && <SortArrow order={sortOrder} />}</div>
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y">
                {isLoading ? (
                  <tr><td colSpan={4} className="text-center py-4 text-gray-500">Memuat data...</td></tr>
                ) : data.length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-4 italic text-gray-500">Tidak ada data ditemukan.</td></tr>
                ) : (
                  data.map((kategori, index) => (
                    <tr key={kategori.id_kategori} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {(currentPage - 1) * perPage + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">{kategori.nama_kategori}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{kategori.deskripsi || <span className="italic text-gray-400">Tidak ada deskripsi</span>}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button onClick={() => handleOpenEditModal(kategori)} className="text-blue-600 hover:text-blue-900 p-1"><Pencil size={18} /></button>
                        <button onClick={() => handleOpenDeleteModal(kategori)} className="text-red-600 hover:text-red-900 p-1 ml-2"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination Footer*/}
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
          {/* Pagination Footer*/}
        </div>
      </main>

      {/* Modals */}
      <AddKategoriModal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} onSuccess={fetchData} />
      <EditKategoriModal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} onSuccess={fetchData} itemToEdit={itemToEdit} />
      <DeleteKategoriModal isOpen={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)} onSuccess={fetchData} itemToDelete={itemToDelete} />
    </Layout>
  );
}

export default DataKategori;