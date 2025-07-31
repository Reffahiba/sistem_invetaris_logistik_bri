// src/components/modal/EditBarangModal.tsx

import React, {
    useState,
    FormEvent,
    useRef,
    useEffect,
    useCallback,
} from "react";
import axios from "axios";
import { UploadCloud, X, FileImage, Loader2, ChevronDown } from "lucide-react";

// Tipe data untuk Kategori
type KategoriOption = {
    id_kategori: number;
    nama_kategori: string;
};

// Tipe data untuk Barang yang akan diedit (diterima dari parent)
type Barang = {
    id_barang: number;
    nama_barang: string;
    kategori: { id_kategori: number; nama_kategori: string } | null;
    stok: number;
    satuan: string;
    gambar_barang: string; // URL gambar yang sudah ada
};

// Tipe data untuk state form
type EditBarangData = {
    nama_barang: string;
    id_kategori: number | null;
    stok: number;
    satuan: string;
    gambar_barang: File | string | null; // Bisa File baru atau string URL lama
};

// Props untuk EditBarangModal
interface EditBarangModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (message: string) => void; //
    itemToEdit: Barang | null; // <-- Prop baru untuk menerima data barang
}

const EditBarangModal: React.FC<EditBarangModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    itemToEdit,
}) => {
    const [editData, setEditData] = useState<EditBarangData>({
        gambar_barang: null,
        nama_barang: "",
        id_kategori: null,
        stok: 0,
        satuan: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    // State untuk dropdown kategori (logika sama seperti Add modal)
    const [kategoriOptions, setKategoriOptions] = useState<KategoriOption[]>(
        []
    );

    // <-- EFEK UNTUK MENGISI FORM SAAT MODAL DIBUKA -->
    useEffect(() => {
        if (itemToEdit && isOpen) {
            setEditData({
                nama_barang: itemToEdit.nama_barang,
                id_kategori: itemToEdit.kategori?.id_kategori || null,
                stok: itemToEdit.stok,
                satuan: itemToEdit.satuan,
                gambar_barang: itemToEdit.gambar_barang || null, // URL gambar lama
            });
            // Reset state file upload setiap kali modal dibuka dengan item baru
            setUploadedFile(null);
            setUploadProgress(0);
        }
    }, [itemToEdit, isOpen]);

    // Fetch kategori (sama seperti Add modal)
    useEffect(() => {
        const fetchKategori = async () => {
            if (!isOpen) return;
            try {
                const response = await axios.get("/api/admin/list-kategori");
                setKategoriOptions(response.data);
            } catch (error) {
                console.error("Gagal mengambil kategori:", error);
            }
        };
        fetchKategori();
    }, [isOpen]);

    // Handler untuk klik di luar modal (sama)
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                modalRef.current &&
                !modalRef.current.contains(event.target as Node)
            ) {
                onClose();
            }
        };
        if (isOpen) document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, onClose]);

    // Logika Dropzone dan file handling (sama persis)
    const handleFileChange = useCallback((files: FileList | null) => {
        if (!files || files.length === 0) return;
        const file = files[0];
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
        const maxSize = 1 * 1024 * 1024; // 1 MB

        if (!allowedTypes.includes(file.type)) {
            alert(
                "Format file tidak didukung. Harap unggah JPG, JPEG, atau PNG."
            );
            return;
        }
        if (file.size > maxSize) {
            alert("Ukuran file terlalu besar. Maksimal 1 MB.");
            return;
        }
        setUploadedFile(file);
        setEditData((prev) => ({ ...prev, gambar_barang: file }));
        setUploadProgress(100); // Langsung 100% untuk preview, progress asli saat submit
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);
    const handleDragLeave = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);
        },
        []
    );
    const handleDrop = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);
            handleFileChange(e.dataTransfer.files);
        },
        [handleFileChange]
    );
    const handleBrowseClick = () => {
        fileInputRef.current?.click();
    };

    // <-- LOGIKA SUBMIT UNTUK EDIT -->
    const handleEditSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!itemToEdit) return; // Guard clause

        setIsLoading(true);
        setUploadProgress(0);

        const formData = new FormData();
        formData.append("_method", "PUT"); // <-- Method spoofing untuk Laravel
        formData.append("nama_barang", editData.nama_barang);
        formData.append(
            "id_kategori",
            editData.id_kategori ? String(editData.id_kategori) : ""
        );
        formData.append("stok", String(editData.stok));
        formData.append("satuan", editData.satuan);

        // Kirim file gambar hanya jika ada file baru yang diunggah
        if (uploadedFile) {
            formData.append("gambar_barang", uploadedFile);
        }

        try {
            await axios.post(
                `/api/admin/barang/${itemToEdit.id_barang}`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    onUploadProgress: (progressEvent) => {
                        if (progressEvent.total) {
                            let percentCompleted = Math.round(
                                (progressEvent.loaded * 100) /
                                    progressEvent.total
                            );
                            setUploadProgress(percentCompleted);
                        }
                    },
                }
            );
            onClose();
            onSuccess("Barang berhasil diperbarui!");
        } catch (error) {
            console.error("Gagal memperbarui barang:", error);
            alert("Gagal memperbarui barang. Periksa konsol untuk detail.");
        } finally {
            setIsLoading(false);
            setUploadProgress(0);
        }
    };

    if (!isOpen) return null;

    // Logika untuk menampilkan preview gambar
    const previewImageSrc = uploadedFile
        ? URL.createObjectURL(uploadedFile) // Tampilkan file baru jika ada
        : typeof editData.gambar_barang === "string"
        ? editData.gambar_barang
        : null; // Tampilkan URL lama jika tidak

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div
                ref={modalRef}
                className="bg-white p-6 rounded-lg shadow-xl w-11/12 max-w-[500px] flex flex-col max-h-[90vh]"
            >
                {/* Header Modal */}
                <div className="flex justify-between items-center pb-4 border-b border-gray-200 mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Edit Barang
                    </h2>{" "}
                    {/* <-- Teks diubah */}
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Konten Form */}
                <div className="flex-grow overflow-y-auto pr-4 -mr-4">
                    <form onSubmit={handleEditSubmit} className="grid gap-4">
                        {/* Field Nama Barang */}
                        <div>
                            <label
                                htmlFor="nama_barang_edit"
                                className="text-sm font-medium text-gray-700 mb-1 block"
                            >
                                Nama Barang{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="nama_barang_edit"
                                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-0.5rem focus:ring-[#F46F23] focus:border-[#F46F23]"
                                value={editData.nama_barang}
                                onChange={(e) =>
                                    setEditData({
                                        ...editData,
                                        nama_barang: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>

                        {/* Field Kategori */}
                        <div>
                            <label
                                htmlFor="id_kategori_edit"
                                className="text-sm font-medium text-gray-700 mb-1 block"
                            >
                                Kategori <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <select
                                    id="id_kategori_edit"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-sm appearance-none focus:outline-none focus:ring-0.5rem focus:ring-[#F46F23] focus:border-[#F46F23]"
                                    value={editData.id_kategori ?? ""}
                                    onChange={(e) =>
                                        setEditData({
                                            ...editData,
                                            id_kategori: e.target.value
                                                ? Number(e.target.value)
                                                : null,
                                        })
                                    }
                                    required
                                >
                                    <option value="">
                                        -- Pilih Kategori --
                                    </option>
                                    {kategoriOptions.map((k) => (
                                        <option
                                            key={k.id_kategori}
                                            value={k.id_kategori}
                                        >
                                            {k.nama_kategori}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <ChevronDown className="h-4 w-4" />
                                </div>
                            </div>
                        </div>

                        {/* Field Stok & Satuan */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                {/* 3. (Opsional) Sesuaikan label agar terlihat non-aktif */}
                                <label
                                    htmlFor="stok_edit"
                                    className="text-sm font-medium text-gray-500 mb-1 block"
                                >
                                    Stok
                                </label>
                                <input
                                    type="number"
                                    id="stok_edit"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-sm disabled:bg-gray-100 disabled:cursor-not-allowed" // 2. Tambahkan class untuk styling saat disabled
                                    value={editData.stok}
                                    min="0"
                                    disabled // 1. Tambahkan atribut 'disabled'
                                    // onChange dan required tidak lagi diperlukan untuk field yang disabled
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="satuan_edit"
                                    className="text-sm font-medium text-gray-700 mb-1 block"
                                >
                                    Satuan{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="satuan_edit"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-0.5rem focus:ring-[#F46F23] focus:border-[#F46F23]"
                                    value={editData.satuan}
                                    onChange={(e) =>
                                        setEditData({
                                            ...editData,
                                            satuan: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>
                        </div>
                        {/* Area Upload Gambar */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">
                                Ganti Gambar Barang
                            </label>
                            <div
                                className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg bg-gray-50 text-gray-600 transition-all cursor-pointer ${
                                    isDragging
                                        ? "border-secondary"
                                        : "border-gray-300"
                                }`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={handleBrowseClick}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={(e) =>
                                        handleFileChange(e.target.files)
                                    }
                                    className="hidden"
                                    accept="image/jpeg,image/jpg,image/png"
                                />
                                {previewImageSrc ? (
                                    <>
                                        <FileImage className="h-10 w-10 mb-2 text-primary" />
                                        <p className="text-sm font-medium text-primary mb-1">
                                            Pratinjau Gambar:
                                        </p>
                                        <img
                                            src={previewImageSrc}
                                            alt="Preview"
                                            className="max-w-full h-24 object-contain rounded-sm shadow-sm mt-2"
                                        />
                                        <p className="text-xs text-gray-500 mt-2">
                                            Klik atau seret file baru untuk
                                            mengganti
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <UploadCloud className="h-10 w-10 mb-2" />
                                        <p className="text-sm font-medium">
                                            Seret dan lepas gambar di sini, atau{" "}
                                            <span className="text-primary font-semibold">
                                                klik untuk memilih
                                            </span>
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Hanya JPG, JPEG, PNG. Maksimal 1 MB.
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Tombol Footer */}
                        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-300 rounded-lg"
                                disabled={isLoading}
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-primary text-white rounded-lg"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader2 className="animate-spin" />
                                ) : (
                                    "Simpan Perubahan"
                                )}{" "}
                                {/* <-- Teks diubah */}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditBarangModal;
