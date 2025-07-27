import React from 'react';
import { X } from 'lucide-react';

interface ImageDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  imageAlt: string;
}

const ImageDetailModal: React.FC<ImageDetailModalProps> = ({ isOpen, onClose, imageUrl, imageAlt }) => {
  if (!isOpen || !imageUrl) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-white p-4 rounded-lg shadow-xl max-w-xl max-h-[90vh] overflow-hidden flex flex-col transform transition-all duration-300 ease-out ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'">
        <div className="flex justify-end pb-2">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition"
            aria-label="Tutup Gambar"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="flex-grow flex items-center justify-center overflow-y-auto">
          <img
            src={imageUrl}
            alt={imageAlt}
            className="max-w-full max-h-full object-contain rounded-md"
            onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x300?text=Gambar+Tidak+Ditemukan'; }}
          />
        </div>
        <div className="pt-2 text-center text-sm text-gray-600">
          {imageAlt}
        </div>
      </div>
    </div>
  );
};

export default ImageDetailModal;