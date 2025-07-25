import React, { useState, useEffect } from "react";
import DaftarPermintaan from "./DaftarPermintaan";
import DetailPermintaan from "./DetailPermintaan";
import LayoutPegawai from "./LayoutPegawai";
import axios from "axios";

const LacakPermintaan: React.FC = () => {
    const [daftarPermintaan, setDaftarPermintaan] = useState<any[]>([]);
    const [detailPermintaan, setDetailPermintaan] = useState<any[]>([]);
    const [barang, setBarangList] = useState<any[]>([]);
    const [selected, setSelected] = useState(null);

    const handleLihatDetail = (permintaan: any) => {
        const detail = detailPermintaan.find(
            (d) => String(d.id_permintaan) === String(permintaan.id_permintaan)
        );
        if (detail) {
            setSelected(detail);
        } else {
            console.warn(
                "Detail tidak ditemukan untuk permintaan id:",
                permintaan.id_permintaan
            );
        }
    };

    useEffect(() => {
        const fetchPermintaan = async () => {
            try {
                const response = await axios.get("/lacak-permintaan");
                console.log(response.data);
                console.log("DATA PERMINTAAN:", response.data.permintaan);
                console.log("DATA DETAIL:", response.data.detail_permintaan);
                setDaftarPermintaan(response.data.permintaan);
                setDetailPermintaan(response.data.detail_permintaan);
                setBarangList(response.data.barang);
            } catch (error) {
                console.error("Gagal mengambil data permintaan:", error);
            }
        };

        fetchPermintaan();
    }, []);

    return (
        <LayoutPegawai>
            <DaftarPermintaan
                daftarPermintaan={daftarPermintaan}
                onLihatDetail={handleLihatDetail}
            />

            {selected && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-3xl relative max-h-[90vh] overflow-y-auto">
                        <button
                            className="absolute top-2 right-2 text-red-500 hover:text-gray-700"
                            onClick={() => setSelected(null)}
                        >
                            ✖
                        </button>
                        <DetailPermintaan detail_permintaan={selected} />
                    </div>
                </div>
            )}
        </LayoutPegawai>
    );
};

export default LacakPermintaan;
