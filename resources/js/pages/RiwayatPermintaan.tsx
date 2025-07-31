import React, { useEffect, useState } from "react";
import LayoutPegawai from "@/LayoutPegawai";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
    const [detailPermintaan, setDetailPermintaan] = useState<
        DetailPermintaan[]
    >([]);
    const [selected, setSelected] = useState<DetailPermintaan[] | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(5);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    function normalizeDate(date: Date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }

    // Filter data berdasarkan rentang tanggal
    const filteredPermintaan = daftarPermintaan.filter((item) => {
        // Hanya ambil item yang sudah diterima
        if (item.status !== "telah diterima") return false;

        const tanggalItem = normalizeDate(new Date(item.tanggal_minta));
        const start = startDate ? normalizeDate(startDate) : null;
        const end = endDate ? normalizeDate(endDate) : null;

        // Jika startDate ada dan tanggal item lebih kecil, exclude
        if (start && tanggalItem < start) return false;

        // Jika endDate ada dan tanggal item lebih besar, exclude
        if (end && tanggalItem > end) return false;

        return true;
    });

    // Pagination
    const totalItems = filteredPermintaan.length;
    const totalPages = Math.ceil(totalItems / perPage);

    const paginatedPermintaan = filteredPermintaan.slice(
        (currentPage - 1) * perPage,
        currentPage * perPage
    );

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

        setCurrentPage(1);
    }, [startDate, endDate, perPage]);

    return (
        <LayoutPegawai>
            <div className="max-w-full p-2 mx-auto">
                <h2 className="text-2xl font-bold mb-5">
                    Permintaan Telah Diterima
                </h2>

                <div className="bg-white p-6 rounded-2xl">
                    {/* Filter tanggal */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-4 items-start sm:items-center justify-between">
                        <div className="flex items-center gap-2">
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                placeholderText="Tanggal Mulai"
                                className="border px-3 py-2 rounded-sm outline-none text-sm"
                            />
                            <span>-</span>
                            <DatePicker
                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                placeholderText="Tanggal Akhir"
                                className="border px-3 py-2 rounded-sm outline-none text-sm"
                            />
                        </div>
                        <select
                            value={perPage}
                            onChange={(e) => setPerPage(Number(e.target.value))}
                            className="border p-1 rounded-sm outline-none text-sm"
                        >
                            {[5, 10, 25, 50].map((n) => (
                                <option key={n} value={n}>
                                    {n} halaman
                                </option>
                            ))}
                        </select>
                    </div>

                    <table className="w-full table-auto">
                        {daftarPermintaan.length === 0 ? (
                            <>
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr className="bg-gray-200 text-white">
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            No
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tanggal
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="p-4 text-center text-gray-500 italic"
                                        >
                                            Tidak ada permintaan yang telah
                                            diterima.
                                        </td>
                                    </tr>
                                </tbody>
                            </>
                        ) : (
                            <>
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr className="bg-gray-200 text-white">
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            No
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tanggal
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {paginatedPermintaan.map((item, index) => (
                                        <tr
                                            key={item.id_permintaan}
                                            className="text-center bg-white"
                                        >
                                            <td className="py-4 text-gray-500">
                                                {index + 1}
                                            </td>
                                            <td className="py-4 text-gray-500">
                                                {new Date(
                                                    item.tanggal_minta
                                                ).toLocaleDateString("id-ID")}
                                            </td>
                                            <td className="py-4 text-gray-500">
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

                    {/* Pagination */}
                    {totalPages >= 1 && (
                        <div className="flex justify-between mt-4 gap-2">
                            <span className="text-gray-600">
                                Halaman {currentPage} dari {totalPages}
                            </span>
                            <div className="space-x-2 flex flex-row">
                                <button
                                    onClick={() =>
                                        setCurrentPage((p) =>
                                            Math.max(p - 1, 1)
                                        )
                                    }
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
                                >
                                    Prev
                                </button>

                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`px-3 py-1 rounded-xl ${
                                            currentPage === i + 1
                                                ? "bg-green-500 text-white"
                                                : "bg-gray-100"
                                        }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}

                                <button
                                    onClick={() =>
                                        setCurrentPage((p) =>
                                            Math.min(p + 1, totalPages)
                                        )
                                    }
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {selected && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                        <div className="bg-white w-full max-w-sm p-6 rounded-xl shadow-lg relative">
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
                                className="mt-6 w-full bg-red-500 text-white px-4 py-2 rounded-sm hover:bg-red-600 transition duration-200"
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
