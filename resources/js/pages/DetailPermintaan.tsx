import React from "react";
import LacakPermintaan from "./LacakPermintaan";

interface DetailPermintaanProps {
    permintaan: {
        id: number;
        namaBarang: string;
        tanggal: string;
        status: number;
        jumlah: number;
        deskripsi: string;
    };
}

const DetailPermintaan: React.FC<DetailPermintaanProps> = ({ permintaan }) => {
    return (
        <div className="max-w-3xl mx-auto mt-10">
            <h2 className="text-xl font-bold mb-4">Detail Permintaan</h2>
            <div className="bg-white shadow p-4 rounded">
                <p>
                    <strong>Nama Barang:</strong> {permintaan.namaBarang}
                </p>
                <p>
                    <strong>Tanggal:</strong> {permintaan.tanggal}
                </p>
                <p>
                    <strong>Jumlah:</strong> {permintaan.jumlah}
                </p>
                <p>
                    <strong>Deskripsi:</strong> {permintaan.deskripsi}
                </p>
            </div>

            <h3 className="text-lg font-semibold mt-6 mb-2">
                Status Permintaan
            </h3>
            <LacakStatus currentStep={permintaan.status} />
        </div>
    );
};

export default DetailPermintaan;
