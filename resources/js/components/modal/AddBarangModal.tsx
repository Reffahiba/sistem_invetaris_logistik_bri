import React, { useState, FormEvent, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import { UploadCloud, X, FileImage, Loader2, ChevronDown} from 'lucide-react';

// Tipe data untuk data barang baru sesuai sama tabel di database
type NewBarang = { 
  nama_barang: string;
  id_kategori: number | null;
  stok: number;
  satuan: string;
  gambar_barang: File | string | null;
};

type KategoriOption = {
  id_kategori: number;
  nama_kategori: string;
};

// Logic untuk modal tambah barang baru
interface AddBarangModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddBarangModal: React.FC<AddBarangModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [newBarangData, setNewBarangData] = useState<NewBarang>({
    gambar_barang: null,
    nama_barang: "",
    id_kategori: null,
    stok: 0,
    satuan: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // State untuk fetch list kategori buat dropdown
  const [kategoriOptions, setKategoriOptions] = useState<KategoriOption[]>([]);
  const [kategoriLoading, setKategoriLoading] = useState(false);
  const [kategoriError, setKategoriError] = useState<string | null>(null);

  useEffect(() => {
    const fetchKategori = async () => {
      if (!isOpen) return;

      setKategoriLoading(true);
      setKategoriError(null);
      try {
        const response = await axios.get("/api/admin/list-kategori"); 
        setKategoriOptions(response.data);
      } catch (error) {
        console.error("Gagal mengambil kategori:", error);
        setKategoriError("Gagal memuat kategori");
      } finally {
        setKategoriLoading(false);
      }
    };

    fetchKategori();
  }, [isOpen]);


  // State untuk menyimpan objek File yang telah diupload, agar nama file mudah diakses
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Effect untuk menangani klik di luar modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, onClose]);

  // Reset form data dan state terkait file saat modal dibuka atau ditutup
  useEffect(() => {
    if (!isOpen) {
      setNewBarangData({
        gambar_barang: null,
        nama_barang: "",
        id_kategori: null,
        stok: 0,
        satuan: "",
      });
      setUploadProgress(0);
      setIsDragging(false);
      setUploadedFile(null); // Reset uploaded file
    }
  }, [isOpen]);

  // Dropzone Logic
  const handleFileChange = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 1 * 1024 * 1024; // 1 MB

    if (!allowedTypes.includes(file.type)) {
      alert("Format file tidak didukung. Harap unggah JPG, JPEG, atau PNG.");
      return;
    }
    if (file.size > maxSize) {
      alert("Ukuran file terlalu besar. Maksimal 1 MB.");
      return;
    }

    setUploadedFile(file); // Simpan objek File di state terpisah
    setNewBarangData((prev) => ({ ...prev, gambar_barang: file })); // Simpan juga di newBarangData untuk submit

    setUploadProgress(1); // Mulai progress bar dari 1% untuk indikasi awal
    // Simulasi progress bar upload, ini perlu diganti dengan progress Axios di handleAddSubmit
    let progress = 1;
    const interval = setInterval(() => {
      progress += 10;
      if (progress < 100) {
        setUploadProgress(progress);
      } else {
        setUploadProgress(100); // Pastikan mencapai 100%
        clearInterval(interval);
      }
    }, 100);

  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  }, [handleFileChange]);

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleAddSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setUploadProgress(1); // Set progress to 1% when starting actual upload

    try {
      if (!newBarangData.nama_barang || newBarangData.stok <= 0 || !newBarangData.satuan) {
        alert("Nama barang, stok, dan satuan harus diisi dengan benar.");
        setIsLoading(false);
        setUploadProgress(0); 
        return;
      }

      const formData = new FormData();
      formData.append('nama_barang', newBarangData.nama_barang);
      formData.append('id_kategori', newBarangData.id_kategori ? String(newBarangData.id_kategori) : '');
      formData.append('stok', String(newBarangData.stok));
      formData.append('satuan', newBarangData.satuan);

      if (uploadedFile) { // Menggunakan uploadedFile state untuk mengirim file
        formData.append('gambar_barang', uploadedFile);
      } else if (typeof newBarangData.gambar_barang === 'string' && newBarangData.gambar_barang) {

        formData.append('gambar_barang_url', newBarangData.gambar_barang);
      }
      
      await axios.post("/api/admin/barang", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        }
      });

      alert("Barang baru berhasil ditambahkan!");
      onClose();
      onSuccess();
    }catch (error) {
        console.error("Gagal menambahkan barang:", error);
        alert("Gagal menambahkan barang. Periksa konsol untuk detail.");
    }finally {
        setIsLoading(false);
        setUploadProgress(0);
        setUploadedFile(null);
    }
  };

  if (!isOpen) return null;

  const previewImageSrc = uploadedFile
    ? URL.createObjectURL(uploadedFile)
    : (typeof newBarangData.gambar_barang === 'string' ? newBarangData.gambar_barang : null);


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
      <div
        ref={modalRef}
        className={`
          bg-white p-6 rounded-lg shadow-xl w-11/12 max-w-[500px] flex flex-col max-h-[90vh]
          transform transition-all duration-300 ease-out
          ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
        `}
      >
        {/* Header Modal */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-200 mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Tambah Barang Baru</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition"
            aria-label="Tutup Modal"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Konten Form yang Dapat Di-scroll */}
        <div className="flex-grow overflow-y-auto pr-4 -mr-4">
          <form onSubmit={handleAddSubmit} className="grid gap-4">
            {/* Field Nama Barang (1 row) */}
            <div className="flex flex-col">
              <label htmlFor="nama_barang" className="text-sm font-medium text-gray-700 mb-1 block">
                Nama Barang <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="nama_barang"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0.5rem focus:ring-[#F46F23] focus:border-[#F46F23]"
                value={newBarangData.nama_barang}
                onChange={(e) => setNewBarangData({ ...newBarangData, nama_barang: e.target.value })}
                required
              />
            </div>
            
            {/* Field Kategori */}
            <div className="flex flex-col">
              <label htmlFor="id_kategori" className="text-sm font-medium text-gray-700 mb-1 block">
                Kategori<span className="text-red-500">*</span>
              </label>
              <div className="relative">
              <select
                  id="id_kategori"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-0.5rem focus:ring-[#F46F23] focus:border-[#F46F23] pr-8 text-gray-900"
                  value={newBarangData.id_kategori ? String(newBarangData.id_kategori) : ""}
                  onChange={(e) =>
                    setNewBarangData({
                      ...newBarangData,
                      id_kategori: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                >
                  <option value="">-- Pilih Kategori --</option>
                  {kategoriOptions.map((kategori) => (
                    <option key={kategori.id_kategori} value={String(kategori.id_kategori)}>
                      {kategori.nama_kategori}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <ChevronDown className="h-4 w-4" /> {/* Lucide React ChevronDown icon */}
                </div>
              </div>
            </div>
            {/* Field Kategori */}

            {/* Field Stok & Satuan*/}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="stok" className="text-sm font-medium text-gray-700 mb-1 block">
                  Stok <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="stok"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0.5rem focus:ring-[#F46F23] focus:border-[#F46F23]"
                  value={newBarangData.stok}
                  onChange={(e) => setNewBarangData({ ...newBarangData, stok: Number(e.target.value) })}
                  min="0"
                  required
                />
              </div>
              <div>
                <label htmlFor="satuan" className="text-sm font-medium text-gray-700 mb-1 block">
                  Satuan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="satuan"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0.5rem focus:ring-[#F46F23] focus:border-[#F46F23]"
                  value={newBarangData.satuan}
                  onChange={(e) => setNewBarangData({ ...newBarangData, satuan: e.target.value })}
                  required
                />
              </div>
            </div>
            {/* Field Stok & Satuan*/}
            
            {/* Area Upload Gambar */}
            <div className="flex flex-col"> {/* Bungkus label dan dropzone */}
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Gambar Barang
              </label>
              <div
                className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg bg-gray-50 text-gray-600 transition-all cursor-pointer
                  ${isDragging ? 'border-secondary bg-gray-100' : 'border-gray-300 hover:border-gray-400 hover:bg-blue-100'}
                `}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleBrowseClick}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => handleFileChange(e.target.files)}
                  className="hidden" // Sembunyikan input file asli
                  accept="image/jpeg,image/jpg,image/png"
                />
                
                {/* Animasi Progress Bar */}
                {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
                        <div 
                            className="bg-primary h-2.5 rounded-full" 
                            style={{width: `${uploadProgress}%`}}
                        ></div>
                    </div>
                )}

                {/* Tampilan Ketika File Sudah Dipilih/Preview */}
                {uploadedFile && uploadProgress === 100 ? (
                  <>
                    <FileImage className="h-10 w-10 mb-2 text-primary" />
                    <p className="text-sm font-medium text-primary mb-1">Gambar Terpilih:</p>
                    <p className="text-sm font-semibold text-gray-800 break-all text-center">{uploadedFile.name}</p> {/* Nama file */}
                    {previewImageSrc && (
                        <img
                            src={previewImageSrc}
                            alt="Preview"
                            className="max-w-full h-24 object-contain rounded-md shadow-sm border border-gray-200 mt-2"
                            onError={(e) => (e.currentTarget.src = 'https://placehold.co/100x100?text=Error')}
                        />
                    )}
                    <p className="text-xs text-gray-500 mt-2">Klik untuk mengganti gambar</p>
                  </>
                ) : uploadProgress > 0 && uploadProgress < 100 ? ( // Tampilan Saat Mengunggah
                    <>
                        <Loader2 className="h-10 w-10 animate-spin mb-2 text-primary" />
                        <p className="text-sm font-medium text-primary">Mengunggah... {uploadProgress}%</p>
                    </>
                ) : ( // Tampilan Default Drop Zone
                  <>
                    <UploadCloud className="h-10 w-10 mb-2" />
                    <p className="text-sm font-medium">Seret dan lepas gambar di sini, atau <span className="text-[#01529D] font-semibold">klik untuk memilih</span></p>
                    <p className="text-xs text-gray-500 mt-1">Hanya JPG, JPEG, PNG. Maksimal 1 MB.</p>
                  </>
                )}
              </div>
            </div>
            {/* Area Upload Gambar */}

            {/* Footer Tombol */}
            <div className="flex justify-end space-x-3 pt-4 border-gray-200 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || (uploadProgress > 0 && uploadProgress < 100)} // Disable jika sedang upload
              >
                {isLoading || (uploadProgress > 0 && uploadProgress < 100) ? (
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : null}
                Tambah Barang
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBarangModal;