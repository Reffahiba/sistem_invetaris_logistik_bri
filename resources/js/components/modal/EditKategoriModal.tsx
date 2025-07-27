// src/components/modal/EditKategoriModal.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Loader2 } from 'lucide-react';

// Tipe data Kategori
type Kategori = {
  id_kategori: number;
  nama_kategori: string;
  deskripsi: string;
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  itemToEdit: Kategori | null;
}

const EditKategoriModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, itemToEdit }) => {
  const [namaKategori, setNamaKategori] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (itemToEdit) {
      setNamaKategori(itemToEdit.nama_kategori);
      setDeskripsi(itemToEdit.deskripsi || '');
    }
  }, [itemToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemToEdit) return;
    setIsLoading(true);
    try {
      await axios.put(`/api/admin/kategori/${itemToEdit.id_kategori}`, {
        nama_kategori: namaKategori,
        deskripsi: deskripsi,
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Gagal mengedit kategori:", error);
      alert("Gagal mengedit kategori.");
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!isOpen) return null;

  return (
    // ... JSX sama persis seperti AddKategoriModal, hanya ganti judul dan teks tombol
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center pb-3 border-b">
          <h3 className="text-lg font-medium">Edit Kategori</h3>
          <button onClick={onClose}><X size={24} /></button>
        </div>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="nama_kategori_edit" className="block text-sm font-medium text-gray-700">Nama Kategori <span className="text-red-500">*</span></label>
            <input id="nama_kategori_edit" type="text" value={namaKategori} onChange={(e) => setNamaKategori(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required />
          </div>
          <div>
            <label htmlFor="deskripsi_edit" className="block text-sm font-medium text-gray-700">Deskripsi <span className="text-red-500">*</span></label>
            <textarea id="deskripsi_edit" value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">Batal</button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 bg-primary text-white rounded-md flex items-center">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditKategoriModal;