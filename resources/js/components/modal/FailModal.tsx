import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';

// Path ke file Lottie di folder public
const LOTTIE_JSON_PATH = '/assets/failed.json'; 

interface FailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
}

const FailModal: React.FC<FailModalProps> = ({ 
  isOpen, 
  onClose, 
  title = "Error!", 
  message 
}) => {
  const [animationData, setAnimationData] = useState<object | null>(null);

  // Ambil data animasi dari folder public saat modal akan dibuka
  useEffect(() => {
    if (isOpen && !animationData) {
      fetch(LOTTIE_JSON_PATH)
        .then(response => response.json())
        .then(data => setAnimationData(data))
        .catch(error => console.error("Gagal memuat animasi Lottie:", error));
    }
  }, [isOpen, animationData]);

  if (!isOpen) {
    return null;
  }

  return (
    // Backdrop
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] transition-opacity duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm text-center transform transition-all duration-300 ease-out"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Animasi Lottie */}
        <div className="mx-auto w-32 h-32">
            {animationData && (
                <Lottie 
                    animationData={animationData} 
                    loop={false} // Animasi hanya berjalan sekali
                />
            )}
        </div>

        {/* Konten Teks */}
        <h2 className="text-2xl font-bold text-red-400 mt-4">{title}</h2>
        <p className="text-gray-600 mt-2">{message}</p>

        {/* Tombol Aksi */}
        <button
          onClick={onClose}
          className="mt-6 w-full px-4 py-2 bg-red-400 text-white font-semibold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition"
        >
          Coba Lagi
        </button>
      </div>
    </div>
  );
};

export default FailModal;
