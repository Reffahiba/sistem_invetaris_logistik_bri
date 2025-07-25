import React from "react";

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
    return (
        <div className="max-w-full p-2 mx-auto">
            <h2 className="text-xl font-bold mb-4">Daftar Permintaan</h2>
            <table className="w-full table-auto border border-blue-600">
                {daftarPermintaan.length === 0 ? (
                    <tbody>
                        <tr>
                            <td
                                colSpan={5}
                                className="p-4 text-center text-gray-500 bg-white"
                            >
                                Tidak ada permintaan.
                            </td>
                        </tr>
                    </tbody>
                ) : (
                    <>
                        <thead>
                            <tr className="bg-blue-600">
                                <th className="p-2 border">No</th>
                                <th className="p-2 border">Tanggal</th>
                                <th className="p-2 border">Status</th>
                                <th className="p-2 border">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {daftarPermintaan.map((item, index) => (
                                <tr
                                    key={item.id_permintaan ?? index}
                                    className="text-center bg-white"
                                >
                                    <td className="p-2 border">{index + 1}</td>
                                    <td className="p-2 border">
                                        {new Date(
                                            item.tanggal_minta
                                        ).toLocaleDateString("id-ID")}
                                    </td>
                                    <td className="p-2 border">
                                        {item.status === "menunggu"
                                            ? "Menunggu"
                                            : item.status === "sedang diproses"
                                            ? "Sedang Diproses"
                                            : "Sedang Diantar"}
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
                            ))}
                        </tbody>
                    </>
                )}
            </table>
        </div>
    );
};

export default DaftarPermintaan;
