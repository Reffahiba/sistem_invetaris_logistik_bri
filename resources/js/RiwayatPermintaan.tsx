import React, { useEffect, useState } from "react";
import LayoutPegawai from "./LayoutPegawai";
import axios from "axios";

interface Permintaan {
    id_permintaan: number;
    tanggal_minta: Date;
    status: string;
}

interface DetailPermintaan {
    id_detail: number;
    id_permintaan: number;
    id_barang: number;
    jumlah_minta: number;
    nama_barang: string;
}

const RiwayatPermintaan: React.FC = () => {
    const [daftarPermintaan, setDaftarPermintaan] = useState<Permintaan[]>([]);
    const [detailPermintaan, setDetailPermintaan] = useState<DetailPermintaan[]>([]);
    const [selected, setSelected] = useState<DetailPermintaan[] | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get("/riwayat-permintaan");

                const semua = res.data.permintaan;
                const diterima = semua.filter(
                    (item: Permintaan) =>
                        item.status.toLowerCase() === "telah diterima"
                );
                setDaftarPermintaan(diterima);
                setDetailPermintaan(res.data.detail_permintaan);
            } catch (error) {
                console.error("Gagal fetch data:", error);
            }
        };

        fetchData();
    }, []);

    const handleLihatDetail = (permintaan: Permintaan) => {
        const detail = detailPermintaan.filter(
            (d) => d.id_permintaan === permintaan.id_permintaan
        );
        if (detail.length > 0) {
            setSelected(detail);
        } else {
            console.warn(
                "Detail tidak ditemukan untuk permintaan:",
                permintaan.id_permintaan
            );
        }
    };

    return (
        <LayoutPegawai>
            <div className="max-w-full p-2 mx-auto">
                <h2 className="text-xl font-bold mb-4">
                    Permintaan Telah Diterima
                </h2>

                <table className="w-full table-auto border border-green-600">
                    {daftarPermintaan.length === 0 ? (
                        <tbody>
                            <tr>
                                <td
                                    colSpan={4}
                                    className="p-4 text-center text-gray-500 bg-white"
                                >
                                    Tidak ada permintaan yang telah
                                    diterima.
                                </td>
                            </tr>
                        </tbody>
                    ) : (
                        <>
                            <thead>
                                <tr className="bg-green-600 text-white">
                                    <th className="p-2 border">No</th>
                                    <th className="p-2 border">Tanggal</th>
                                    <th className="p-2 border">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {daftarPermintaan.map((item, index) => (
                                    <tr
                                        key={item.id_permintaan}
                                        className="text-center bg-white"
                                    >
                                        <td className="p-2 border">
                                            {index + 1}
                                        </td>
                                        <td className="p-2 border">
                                            {new Date(
                                                item.tanggal_minta
                                            ).toLocaleDateString("id-ID")}
                                        </td>
                                        <td className="p-2 border">
                                            <button
                                                onClick={() =>
                                                    handleLihatDetail(item)
                                                }
                                                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                            >
                                                Lihat Detail
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </>
                    )}
                </table>

                {selected && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                        <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg relative">
                            <h3 className="text-xl font-semibold mb-4 text-center">
                                Detail Permintaan
                            </h3>
                            <table className="w-full table-auto border border-gray-200 text-sm">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border p-2 text-left">
                                            Nama Barang
                                        </th>
                                        <th className="border p-2 text-left">
                                            Jumlah Minta
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selected.map((detail) => (
                                        <tr key={detail.id_detail}>
                                            <td className="border p-2">
                                                {detail.nama_barang ??
                                                    "Tidak ditemukan"}
                                            </td>
                                            <td className="border p-2">
                                                {detail.jumlah_minta}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <button
                                onClick={() => setSelected(null)}
                                className="mt-6 w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </LayoutPegawai>
    );
};

export default RiwayatPermintaan;
