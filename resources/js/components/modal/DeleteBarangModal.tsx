// src/components/modal/DeleteBarangModal.tsx

import React, { useState } from 'react';
import axios from 'axios'; // <-- 1. Import axios
import { X, AlertTriangle } from 'lucide-react';

// Definisikan tipe data Barang (bisa juga diimpor dari file terpisah)
type Barang = {
  id_barang: number;
  nama_barang: string;
};

// 2. Ubah props
type Props = {
  isOpen: boolean;
  onClose: () => void;
  item: Barang | null; // <-- Terima objek 'item' lengkap, bukan hanya 'itemName'
  onDeleteSuccess: () => void; // <-- Callback setelah sukses hapus
};

const DeleteBarangModal: React.FC<Props> = ({ isOpen, onClose, item, onDeleteSuccess }) => {
  // 3. State 'isDeleting' sekarang dikelola di dalam modal ini
  const [isDeleting, setIsDeleting] = useState(false);

  // Jangan render apa pun jika modal tidak terbuka atau tidak ada item
  if (!isOpen || !item) return null;

  // 4. Logika penghapusan sekarang berada di sini
  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      // Panggil API dengan metode DELETE
      await axios.delete(`/api/admin/barang/${item.id_barang}`);
      
      // Tampilkan notifikasi sukses
      alert(`Barang "${item.nama_barang}" berhasil dihapus.`);
      
      // Panggil callback untuk me-refresh data di parent component
      onDeleteSuccess();
      
      // Tutup modal
      onClose();

    } catch (error) {
      console.error("Gagal menghapus barang:", error);
      alert("Terjadi kesalahan saat menghapus barang.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4 animate-fade-in-scale">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
            </div>
            <div className="ml-4 text-left">
              <h3 className="text-lg font-medium text-gray-900">
                Konfirmasi Hapus Barang
              </h3>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        
        <div className="mt-4">
          <p className="text-sm text-gray-600">
            Apakah Anda yakin ingin menghapus barang <strong className="font-semibold text-gray-800">"{item.nama_barang}"</strong>? Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row-reverse gap-3">
          <button
            type="button"
            onClick={handleConfirmDelete} // <-- Panggil handler lokal
            disabled={isDeleting}
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:w-auto sm:text-sm disabled:bg-red-400 disabled:cursor-not-allowed"
          >
            {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteBarangModal;