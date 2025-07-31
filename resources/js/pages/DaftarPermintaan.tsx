import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Permintaan {
    id_permintaan: number;
    tanggal_minta: Date;
    status: string;
}

interface Props {
    daftarPermintaan?: Permintaan[]; // buat opsional agar tidak error jika undefined
    onLihatDetail: (permintaan: Permintaan) => void;
}

const DaftarPermintaan: React.FC<Props> = ({
    daftarPermintaan = [], // fallback ke array kosong
    onLihatDetail,
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(5);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    function normalizeDate(date: Date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }

    const permintaan = daftarPermintaan.filter((item) => {
        if (item.status === "telah diterima") return false;

        const tanggalItem = normalizeDate(new Date(item.tanggal_minta));
        const start = startDate ? normalizeDate(startDate) : null;
        const end = endDate ? normalizeDate(endDate) : null;
        if (start && tanggalItem < start) return false;
        if (end && tanggalItem > end) return false;

        return true;
    });

    const totalPages = Math.ceil(permintaan.length / perPage);

    const paginatedData = permintaan.slice(
        (currentPage - 1) * perPage,
        currentPage * perPage
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [startDate, endDate, perPage]);

    return (
        <div className="max-w-full p-2 mx-auto">
            <h2 className="text-2xl font-bold mb-5">Daftar Permintaan</h2>

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

                {/* Tabel */}
                <table className="w-full table-auto">
                    {paginatedData.length === 0 ? (
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
                                        Status
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
                                        Tidak ada permintaan.
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
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {paginatedData.map((item, index) => (
                                    <tr
                                        key={item.id_permintaan}
                                        className="text-center text-sm bg-white hover:bg-gray-50 transition-colors duration-200"
                                    >
                                        <td className="py-4 text-gray-500">
                                            {(currentPage - 1) * perPage +
                                                index +
                                                1}
                                        </td>
                                        <td className="py-4 text-gray-500">
                                            {new Date(
                                                item.tanggal_minta
                                            ).toLocaleDateString("id-ID")}
                                        </td>
                                        <td>
                                            <span
                                                className={`text-sm font-semibold px-3 py-1 rounded-xl capitalize
                                            ${
                                                item.status === "menunggu"
                                                    ? "text-red-600 bg-red-100 ring-1 ring-red-600"
                                                    : item.status ===
                                                      "sedang diproses"
                                                    ? "text-yellow-600 bg-yellow-100 ring-1 ring-yellow-600"
                                                    : item.status ===
                                                      "sedang diantar"
                                                    ? "text-blue-600 bg-blue-100 ring-1 ring-blue-600"
                                                    : item.status ===
                                                      "telah diterima"
                                                    ? "text-green-600 bg-green-100 ring-1 ring-green-600"
                                                    : "text-gray-600 bg-gray-100 ring-1 ring-gray-600"
                                            }`}
                                            >
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="py-4 text-gray-500">
                                            <button
                                                onClick={() =>
                                                    onLihatDetail(item)
                                                }
                                                className="bg-blue-500 text-white px-3 py-1 rounded-sm hover:bg-blue-600"
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
                    <div className="flex justify-between items-center mt-4">
                        <span className="text-gray-600">
                            Halaman {currentPage} dari {totalPages}
                        </span>
                        <div className="space-x-2 flex flex-row">
                            <button
                                onClick={() =>
                                    setCurrentPage((p) => Math.max(p - 1, 1))
                                }
                                disabled={currentPage === 1}
                                className="px-3 py-1 rounded border bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                            >
                                Prev
                            </button>
                            <p className="rounded-xl bg-blue-500 text-white px-3 py-1">
                                {currentPage}
                            </p>
                            <button
                                onClick={() =>
                                    setCurrentPage((p) =>
                                        Math.min(p + 1, totalPages)
                                    )
                                }
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 rounded border bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DaftarPermintaan;
