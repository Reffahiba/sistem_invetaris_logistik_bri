import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react';

// Path ke file Lottie di folder public
const LOTTIE_JSON_PATH = '/assets/caution.json';

interface LogoutConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutConfirmationModal: React.FC<LogoutConfirmationModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [animationData, setAnimationData] = useState<object | null>(null);

  // Ambil data animasi dari folder public
  useEffect(() => {
    if (isOpen) {
      fetch(LOTTIE_JSON_PATH)
        .then(response => response.json())
        .then(data => setAnimationData(data))
        .catch(error => console.error("Gagal memuat animasi Lottie:", error));
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
      onClick={onClose}
    >
      <div 
        className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Animasi Lottie */}
        <div className="mx-auto w-32 h-32">
            {animationData && (
                <Lottie 
                    animationData={animationData} 
                    loop={false} 
                />
            )}
        </div>

        {/* Konten Teks */}
        <h2 className="text-xl font-bold text-gray-800 mt-4">Anda Yakin Ingin Keluar?</h2>
        <p className="text-gray-600 mt-2 text-sm">
          Anda akan keluar dari sesi saat ini dan perlu login kembali untuk melanjutkan.
        </p>

        {/* Tombol Aksi */}
        <div className="mt-6 flex gap-3">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition"
            >
              Batal
            </button>
            <button
              onClick={onConfirm}
              className="w-full px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
            >
              Ya, Keluar Sesi
            </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmationModal;
