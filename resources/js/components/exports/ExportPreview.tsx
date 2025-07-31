import React, { useRef, useEffect } from 'react';
import { Printer, FileSpreadsheet, ArrowLeft } from 'lucide-react';

interface ExportPreviewProps {
  htmlContent: string;
  onBack: () => void;
  onExportExcel: () => void;
}

const ExportPreview: React.FC<ExportPreviewProps> = ({ htmlContent, onBack, onExportExcel }) => {
  const componentRef = useRef<HTMLDivElement>(null);

  // Tambahkan CSS untuk media print secara dinamis ke <head>
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @media print {
        header {
          display: none !important;
        }
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        @page {
          size: A4;
          margin: 1.15mm;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="bg-white min-h-screen">
      {/* Header yang tidak akan ikut dicetak */}
      <header className="sticky top-0 bg-white shadow-md z-10 p-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Pratinjau Laporan</h2>
          <p className="text-sm text-gray-500">Pastikan data sudah benar sebelum mencetak atau mengekspor.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium">
            <ArrowLeft size={18} /> Kembali
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
            <Printer size={18} /> Cetak
          </button>
        </div>
      </header>

      {/* Konten laporan yang akan dicetak */}
      <main className="p-8 flex justify-center">
        <div
          ref={componentRef}
          className="w-full max-w-4xl bg-white"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </main>
    </div>
  );
};

export default ExportPreview;
