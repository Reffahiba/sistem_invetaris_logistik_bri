import React, { useState, useEffect } from "react";
import LayoutPegawai from "@/Layout Pegawai";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axios from "axios";

type Barang = {
    id: number;
    nama: string;
    stok: number;
    gambar?: string;
};

function AjukanPermintaan() {
    const [barangList, setBarangList] = useState<Barang[]>([]);
    const [jumlah, setJumlah] = useState<Record<number, number>>({});
    const [loading, setLoading] = useState(true);

    const tambah = (id: number) => {
        setJumlah((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    };

    const kurang = (id: number) => {
        setJumlah((prev) => ({
            ...prev,
            [id]: Math.max((prev[id] || 0) - 1, 0),
        }));
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

        setLoading(false); // tetap set loading meskipun tanpa fetch
    }, []);

    const el = document.getElementById("app");

    // Ambil data dari attribute
    const nama = el?.dataset.nama || "Guest";
    const divisi = el?.dataset.divisi || "Divisi";

    return (
        <LayoutPegawai>
            <main className="flex-1 overflow-auto">
                <h1 className="text-2xl font-bold mb-4">Daftar Barang</h1>

                {loading ? (
                    <p>Memuat data barang...</p>
                ) : barangList.length === 0 ? (
                    <table className="min-w-full bg-white rounded-xl">
                        <tbody>
                            <tr>
                                <td
                                    colSpan={5}
                                    className="text-center py-4 text-black font-semibold"
                                >
                                    Belum ada barang di gudang
                                </td>
                            </tr>
                        </tbody>
                    </table>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {barangList.map((barang) => (
                            <Card
                                key={barang.id}
                                className="rounded-xl shadow-md p-2"
                            >
                                <CardHeader className="flex items-center justify-center">
                                    {barang.gambar ? (
                                        <img
                                            src={barang.gambar}
                                            alt={barang.nama}
                                            className="w-32 h-32 object-contain rounded-md"
                                        />
                                    ) : (
                                        <div className="w-32 h-32 bg-gray-200 rounded-md" />
                                    )}
                                </CardHeader>
                                <CardContent className="text-left space-y-2">
                                    <CardTitle className="text-md font-semibold">
                                        {barang.nama}
                                    </CardTitle>
                                    <div className="flex flex-row justify-between pb-3">
                                        <p>Stok: {barang.stok}</p>
                                        <div className="flex items-center justify-center text-center space-x-3">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    kurang(barang.id)
                                                }
                                            >
                                                −
                                            </Button>
                                            <span className="min-w-[20px] text-sm">
                                                {jumlah[barang.id] || 0}
                                            </span>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    tambah(barang.id)
                                                }
                                            >
                                                +
                                            </Button>
                                        </div>
                                    </div>
                                    <Button className="bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 text-white text-md w-full rounded-full mt-2">
                                        Ajukan Permintaan
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
        </LayoutPegawai>
    );
}

export default AjukanPermintaan;
