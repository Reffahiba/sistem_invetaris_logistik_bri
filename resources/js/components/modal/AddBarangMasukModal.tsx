import React, { useState, useEffect } from "react";
import axios from "axios";
import { X, Loader2, Plus, Minus } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Tipe data untuk opsi dropdown barang
type BarangOption = {
    id_barang: number;
    nama_barang: string;
};

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (message: string) => void;
    onFail: (message: string) => void;
}

const AddBarangMasukModal: React.FC<Props> = ({
    isOpen,
    onClose,
    onSuccess,
    onFail,
}) => {
    const [kodeTransaksi, setKodeTransaksi] = useState("");
    const [tanggalMasuk, setTanggalMasuk] = useState<Date | null>(new Date());
    const [selectedBarang, setSelectedBarang] = useState<string>("");
    const [jumlahMasuk, setJumlahMasuk] = useState<number>(1);
    const [deskripsi, setDeskripsi] = useState("");
    const [barangOptions, setBarangOptions] = useState<BarangOption[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch kode transaksi baru dan daftar barang saat modal terbuka
    useEffect(() => {
        if (isOpen) {
            // Fetch new transaction code
            axios
                .get("/api/admin/barang-masuk/code-generate")
                .then((res) => setKodeTransaksi(res.data.kode_transaksi))
                .catch((err) =>
                    console.error("Gagal fetch kode transaksi:", err)
                );

            // Fetch all items for dropdown (tanpa paginasi)
            axios
                .get("/api/admin/list-barang") // Tambahkan parameter untuk mengambil semua barang
                .then((res) => setBarangOptions(res.data))
                .catch((err) =>
                    console.error("Gagal fetch daftar barang:", err)
                );
        } else {
            // Reset form saat modal ditutup
            setTanggalMasuk(new Date());
            setSelectedBarang("");
            setJumlahMasuk(1);
            setDeskripsi("");
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedBarang || jumlahMasuk <= 0) {
            alert("Harap pilih barang dan masukkan jumlah yang valid.");
            return;
        }
        setIsLoading(true);
        try {
            await axios.post("/api/admin/barang-masuk", {
                kode_transaksi: kodeTransaksi,
                tanggal_masuk: tanggalMasuk
                    ? tanggalMasuk.toISOString().split("T")[0]
                    : null,
                id_barang: Number(selectedBarang),
                jumlah_masuk: jumlahMasuk,
                deskripsi: deskripsi,
            });
            onSuccess("Transaksi barang masuk berhasil ditambahkan!");
            onClose();
        } catch (error) {
            console.error("Gagal menambah transaksi:", error);
            onFail("Transaksi barang masuk gagal ditambahkan!");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
                <div className="flex justify-between items-center pb-3 border-b">
                    <h3 className="text-lg font-semibold text-gray-800">
                        Tambah Transaksi Barang Masuk
                    </h3>
                    <button onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Kode Transaksi
                                <span className="text-red-500"> *</span>
                            </label>
                            <input
                                type="text"
                                value={kodeTransaksi}
                                className="mt-1 block w-full bg-gray-100 px-3 py-2 border rounded-sm"
                                disabled
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Tanggal Masuk
                                <span className="text-red-500"> *</span>
                            </label>
                            <DatePicker
                                selected={tanggalMasuk}
                                onChange={(date) => setTanggalMasuk(date)}
                                className="mt-1 block w-full px-3 py-2 border rounded-sm"
                                dateFormat="dd/MM/yyyy"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Nama Barang<span className="text-red-500"> *</span>
                        </label>
                        <select
                            value={selectedBarang}
                            onChange={(e) => setSelectedBarang(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border rounded-sm"
                            required
                        >
                            <option value="" disabled>
                                -- Pilih Barang --
                            </option>
                            {barangOptions.map((barang) => (
                                <option
                                    key={barang.id_barang}
                                    value={barang.id_barang}
                                >
                                    {barang.nama_barang}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Jumlah Masuk<span className="text-red-500"> *</span>
                        </label>
                        <div className="mt-1 flex items-center">
                            <button
                                type="button"
                                onClick={() =>
                                    setJumlahMasuk((p) => Math.max(1, p - 1))
                                }
                                className="p-2 border rounded-l-sm"
                            >
                                <Minus size={16} />
                            </button>
                            <input
                                type="number"
                                value={jumlahMasuk}
                                onChange={(e) =>
                                    setJumlahMasuk(Number(e.target.value))
                                }
                                className="w-20 text-center border-t border-b px-2 py-1.5"
                                min="1"
                            />
                            <button
                                type="button"
                                onClick={() => setJumlahMasuk((p) => p + 1)}
                                className="p-2 border rounded-r-sm"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Catatan
                        </label>
                        <textarea
                            value={deskripsi}
                            onChange={(e) => setDeskripsi(e.target.value)}
                            rows={3}
                            className="mt-1 block w-full px-3 py-2 border rounded-sm"
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 rounded-sm"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 bg-primary text-white rounded-sm flex items-center"
                        >
                            {isLoading && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Simpan Transaksi
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddBarangMasukModal;
