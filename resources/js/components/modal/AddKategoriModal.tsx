// src/components/modal/AddKategoriModal.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { X, Loader2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  onFail: (message: string) => void;
}

const AddKategoriModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, onFail }) => {
  const [namaKategori, setNamaKategori] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post('/api/admin/kategori', {
        nama_kategori: namaKategori,
        deskripsi: deskripsi,
      });
      onSuccess("Kateogori berhasil ditambahkan!");
      onClose();
    } catch (error) {
      console.error("Gagal menambah kategori:", error);
      onFail("Gagal menambah kategori.");
    } finally {
      setIsLoading(false);
      setNamaKategori('');
      setDeskripsi('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center pb-3 border-b">
          <h3 className="text-lg font-semibold text-gray-800">Tambah Kategori Baru</h3>
          <button onClick={onClose}><X size={24} /></button>
        </div>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="nama_kategori" className="block text-sm font-medium text-gray-700">Nama Kategori <span className="text-red-500">*</span></label>
            <input
              id="nama_kategori"
              type="text"
              value={namaKategori}
              onChange={(e) => setNamaKategori(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700">Deskripsi <span className="text-red-500">*</span></label>
            <textarea
              id="deskripsi"
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">Batal</button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 bg-primary text-white rounded-md flex items-center">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddKategoriModal;