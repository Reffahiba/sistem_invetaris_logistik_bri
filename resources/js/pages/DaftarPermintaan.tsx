import React from "react";

interface Permintaan {
    id: number;
    namaBarang: string;
    tanggal: string;
    status: number; // 0: Menunggu, 1: Diproses, 2: Diantar
}

interface Props {
    daftarPermintaan?: Permintaan[]; // buat opsional agar tidak error jika undefined
    onLihatDetail: (permintaan: Permintaan) => void;
}

const DaftarPermintaan: React.FC<Props> = ({
    daftarPermintaan = [], // fallback ke array kosong
    onLihatDetail,
}) => {
    return (
        <div className="max-w-5xl mx-auto mt-10">
            <h2 className="text-xl font-bold mb-4">Daftar Permintaan</h2>
            <table className="w-full table-auto border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="p-2 border">No</th>
                        <th className="p-2 border">Nama Barang</th>
                        <th className="p-2 border">Tanggal</th>
                        <th className="p-2 border">Status</th>
                        <th className="p-2 border">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {daftarPermintaan.length === 0 ? (
                        <tr>
                            <td
                                colSpan={5}
                                className="p-4 text-center text-gray-500"
                            >
                                Tidak ada permintaan.
                            </td>
                        </tr>
                    ) : (
                        daftarPermintaan.map((item, index) => (
                            <tr key={item.id} className="text-center">
                                <td className="p-2 border">{index + 1}</td>
                                <td className="p-2 border">
                                    {item.namaBarang}
                                </td>
                                <td className="p-2 border">{item.tanggal}</td>
                                <td className="p-2 border">
                                    {item.status === 0
                                        ? "Menunggu"
                                        : item.status === 1
                                        ? "Diproses"
                                        : "Diantar"}
                                </td>
                                <td className="p-2 border">
                                    <button
                                        onClick={() => onLihatDetail(item)}
                                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                    >
                                        Lihat Detail
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default DaftarPermintaan;
