import React from 'react';
import { X, Eye } from 'lucide-react';

interface ImageDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  imageAlt: string;
}

const ImageDetailModal: React.FC<ImageDetailModalProps> = ({ isOpen, onClose, imageUrl, imageAlt }) => {
  if (!isOpen || !imageUrl) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity duration-300"
      onClick={onClose} // Memungkinkan menutup modal dengan mengklik backdrop
    >
      <div 
        className="bg-white p-4 rounded-lg shadow-xl max-w-xl w-11/12 max-h-[90vh] overflow-hidden flex flex-col transform transition-all duration-300 ease-out"
        onClick={(e) => e.stopPropagation()} // Mencegah penutupan modal saat mengklik di dalam konten
      >
        {/* Header dengan Title, Ikon, dan Tombol X */}
        <div className="flex justify-between items-center pb-3 border-b mb-3">
            <div className="flex items-center gap-3">
                <Eye className="h-5 w-5 text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-800">Pratinjau Gambar</h3>
            </div>
            <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition"
                aria-label="Tutup Gambar"
            >
                <X className="h-6 w-6" />
            </button>
        </div>
        
        {/* --- Kontainer untuk Gambar dan Watermark --- */}
        <div className="relative flex-grow flex items-center justify-center overflow-hidden">
          {/* Gambar Asli */}
          <img
            src={imageUrl}
            alt={imageAlt}
            className="max-w-full max-h-full object-contain rounded-md"
            onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x300?text=Gambar+Tidak+Ditemukan'; }}
          />

          {/* Watermark Overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p 
              className="text-white font-bold text-4xl md:text-5xl opacity-25 transform -rotate-45 select-none text-center"
              style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }} // Menambahkan sedikit shadow agar lebih terbaca
            >
              Logistik BRI KC Tanjung Karang
            </p>
          </div>
        </div>

        {/* Footer dengan Alt Text dan Tombol Tutup */}
        <div className="flex justify-between items-center pt-3 border-t mt-3">
            <p className="text-sm text-gray-600 truncate pr-4">{imageAlt}</p>
            <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition text-sm font-medium"
            >
                Tutup
            </button>
        </div>
      </div>
    </div>
  );
};

export default ImageDetailModal;
