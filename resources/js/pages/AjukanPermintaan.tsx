import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import LayoutPegawai from "@/LayoutPegawai";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SuccessModal from "@/components/modal/SuccessModal";
import FailModal from "@/components/modal/FailModal";
import axios from "axios";

type Barang = {
    id_barang: number;
    nama_barang: string;
    stok: number;
    gambar_barang?: string;
};

type Kategori = {
    id_kategori: number;
    nama_kategori: string;
};

function AjukanPermintaan() {
    const [barangList, setBarangList] = useState<Barang[]>([]);
    const [kategoriList, setKategoriList] = useState<Kategori[]>([]);
    const [selectedKategori, setSelectedKategori] = useState<string>("");
    const [jumlah, setJumlah] = useState<Record<number, number>>({});
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [loading, setLoading] = useState(true);

    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [failMessage, setFailMessage] = useState<string | null>(null);

    const tambah = (id: number) => {
        setJumlah((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    };

    const kurang = (id: number) => {
        setJumlah((prev) => ({
            ...prev,
            [id]: Math.max((prev[id] || 0) - 1, 0),
        }));
    };

    const fetchBarang = async (kategori = "") => {
        setLoading(true);
        try {
            const res = await axios.get("/ajukan-permintaan", {
                params: { kategori },
            });

            const el = document.getElementById("app");
            setBarangList(res.data.barang || []);
            setKategoriList(res.data.kategoriList || []);
        } catch (err) {
            console.error("Gagal memuat barang:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const rootElement = document.getElementById("ajukanPermintaan-root");
        if (rootElement) {
            const daftarBarangData =
                rootElement.getAttribute("data-daftarBarang");
            if (daftarBarangData) {
                try {
                    const parsedBarang = JSON.parse(daftarBarangData);
                    setBarangList(parsedBarang);
                } catch (err) {
                    console.error("Gagal parsing data-daftarBarang:", err);
                }
            }
        }

        fetchBarang();

        setLoading(false); // tetap set loading meskipun tanpa fetch
    }, []);

    const el = document.getElementById("app");

    // Ambil data dari attribute
    const nama = el?.dataset.nama || "Guest";
    const divisi = el?.dataset.divisi || "Divisi";

    const handleAjukanPermintaan = async (id_barang: number) => {
        const jumlah_minta = jumlah[id_barang] || 0;

        if (jumlah_minta <= 0) {
            alert("Silakan tambahkan jumlah terlebih dahulu.");
            return;
        }

        try {
            await axios.post("/simpan-permintaan", {
                id_barang,
                jumlah_minta,
            });

            setSuccessMessage("Permintaan berhasil diajukan!");
            setJumlah((prev) => ({ ...prev, [id_barang]: 0 }));
        } catch (error) {
            console.error("Gagal mengirim permintaan:", error);
            alert("Terjadi kesalahan saat mengirim permintaan.");
        }
    };

    const filteredBarang = barangList.filter((barang) =>
        barang.nama_barang.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <LayoutPegawai>
            <main className="flex-1 p-2 overflow-auto">
                <h1 className="text-2xl font-bold mb-5">Daftar Barang</h1>

                <div className="bg-white rounded-xl p-6">
                    <div className="flex justify-between">
                        <div className="mb-5">
                            <select
                                className="border outline-none px-2 py-1 rounded-lg text-sm"
                                value={selectedKategori}
                                onChange={(e) => {
                                    const kategori = e.target.value;
                                    setSelectedKategori(kategori);
                                    fetchBarang(kategori); // ambil ulang barang berdasarkan kategori
                                }}
                            >
                                <option value="">Semua Kategori</option>
                                {kategoriList.map((kat, idx) => (
                                    <option key={idx} value={kat}>
                                        {kat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="relative w-full md:w-48">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full rounded-full border px-3 py-1 pl-10 text-sm outline-none focus:outline-none focus:ring-1 focus:ring-gray-200"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        </div>
                    </div>

                    {loading ? (
                        <p>Memuat data barang...</p>
                    ) : filteredBarang.length === 0 ? (
                        <table className="min-w-full bg-gray-200 rounded-xl">
                            <tbody>
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="text-center py-4 text-gray-500"
                                    >
                                        Belum ada barang di gudang
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {filteredBarang.map((barang) => (
                                <Card
                                    key={barang.id_barang}
                                    className="rounded-xl shadow-lg p-2"
                                >
                                    <CardHeader className="flex items-center justify-center">
                                        {barang.gambar_barang ? (
                                            <img
                                                src={barang.gambar_barang}
                                                alt={barang.nama_barang}
                                                className="w-32 h-32 object-contain rounded-sm"
                                            />
                                        ) : (
                                            <div className="w-32 h-32 bg-gray-200 rounded-sm" />
                                        )}
                                    </CardHeader>
                                    <CardContent className="text-left space-y-2">
                                        <CardTitle className="text-sm font-semibold1">
                                            {barang.nama_barang}
                                        </CardTitle>
                                        <div className="flex flex-row justify-between pb-3">
                                            <p>Stok: {barang.stok}</p>
                                            <div className="flex items-center justify-center text-center space-x-3">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        kurang(barang.id_barang)
                                                    }
                                                >
                                                    −
                                                </Button>
                                                <span className="min-w-[20px] text-sm">
                                                    {jumlah[barang.id_barang] ||
                                                        0}
                                                </span>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        tambah(barang.id_barang)
                                                    }
                                                >
                                                    +
                                                </Button>
                                            </div>
                                        </div>
                                        <Button
                                            className="bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 text-white text-sm w-full rounded-full mt-2"
                                            onClick={() =>
                                                handleAjukanPermintaan(
                                                    barang.id_barang
                                                )
                                            }
                                        >
                                            Ajukan Permintaan
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                <SuccessModal
                    isOpen={!!successMessage}
                    onClose={() => {
                        setSuccessMessage(null);
                        window.location.href = "/ajukan-permintaan";
                    }}
                    message={successMessage || ""}
                />
                <FailModal
                    isOpen={!!failMessage}
                    onClose={() => setFailMessage(null)}
                    message={failMessage || ""}
                />
            </main>
        </LayoutPegawai>
    );
}

export default AjukanPermintaan;
