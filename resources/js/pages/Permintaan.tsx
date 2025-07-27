import React, { useState } from "react";
import Layout from "../LayoutAdmin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const barangList = [
    {
        id: 1,
        nama: "Kertas HVS",
        stok: 10,
        gambar: "/assets/hvs.jpg",
    },
    {
        id: 2,
        nama: "Pena",
        stok: 10,
        gambar: "/assets/pena.jpg",
    },
    {
        id: 3,
        nama: "Bindex",
        stok: 10,
        gambar: "/assets/bindex.jpg",
    },
];

function DataBarang() {
    const [jumlah, setJumlah] = useState<Record<number, number>>({});

    const tambah = (id: number) => {
        setJumlah((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    };

    const kurang = (id: number) => {
        setJumlah((prev) => ({
            ...prev,
            [id]: Math.max((prev[id] || 0) - 1, 0),
        }));
    };

    const el = document.getElementById("app");

    // Ambil data dari attribute
    const nama = el?.dataset.nama || "Guest";
    const divisi = el?.dataset.divisi || "Divisi";

    return (
        <Layout>
            <main className="flex-1 overflow-auto">
                {/* <h1 className="text-2xl font-bold">
                    Selamat datang di dashboard! <br />
                    Nama: {nama}! <br />
                    Divisi: {divisi}
                </h1> */}

                <h1 className="text-2xl font-bold mb-4">Daftar Barang</h1>

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
                                    <p>Stok: {barang.stok} Rim</p>
                                    <div className="flex items-center justify-center text-center space-x-3">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => kurang(barang.id)}
                                        >
                                            −
                                        </Button>
                                        <span className="min-w-[20px] text-sm">
                                            {jumlah[barang.id] || 0}
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => tambah(barang.id)}
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
            </main>
        </Layout>
    );
}

export default DataBarang;
