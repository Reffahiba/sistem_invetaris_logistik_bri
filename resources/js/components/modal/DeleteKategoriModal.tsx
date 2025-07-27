// src/components/modal/DeleteKategoriModal.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { X, Loader2, AlertTriangle } from 'lucide-react';

type Kategori = {
  id_kategori: number;
  nama_kategori: string;
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  itemToDelete: Kategori | null;
}

const DeleteKategoriModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, itemToDelete }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!itemToDelete) return;
    setIsLoading(true);
    try {
      await axios.delete(`/api/admin/kategori/${itemToDelete.id_kategori}`);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Gagal menghapus kategori:", error);
      alert("Gagal menghapus kategori.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4 text-left">
                <h3 className="text-lg font-medium">Hapus Kategori</h3>
                <p className="text-sm text-gray-600 mt-2">
                    Apakah Anda yakin ingin menghapus kategori <strong className="font-semibold">"{itemToDelete?.nama_kategori}"</strong>?
                </p>
            </div>
        </div>
        <div className="flex justify-end gap-3 pt-4 mt-4 border-t">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">Batal</button>
          <button onClick={handleDelete} disabled={isLoading} className="px-4 py-2 bg-red-600 text-white rounded-md flex items-center">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteKategoriModal;