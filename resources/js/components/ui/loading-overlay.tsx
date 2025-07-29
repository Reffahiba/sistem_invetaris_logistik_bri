import React from 'react';

interface LoadingOverlayProps {
  isLoading: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isLoading }) => {
  // Jangan render apapun jika tidak sedang loading
  if (!isLoading) {
    return null;
  }

  return (
    // Backdrop semi-transparan dengan efek blur
    <div className="fixed inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-[9999] transition-opacity duration-300">
      <div className="flex flex-col items-center gap-4">
        {/* Dot Loader Kustom menggunakan Tailwind CSS */}
        <div className="flex items-center justify-center space-x-2">
          <div 
            className="w-3 h-3 bg-[#F46F23] rounded-full animate-bounce"
            style={{ animationDelay: '-0.3s' }}
          ></div>
          <div 
            className="w-3 h-3 bg-[#F46F23] rounded-full animate-bounce"
            style={{ animationDelay: '-0.15s' }}
          ></div>
          <div 
            className="w-3 h-3 bg-[#F46F23] rounded-full animate-bounce"
          ></div>
        </div>
        <p className="text-gray-600 font-medium">Memuat data...</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
