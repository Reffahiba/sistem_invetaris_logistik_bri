import React, { useState, useEffect } from "react";
import DaftarPermintaan from "./DaftarPermintaan";
import DetailPermintaan from "./DetailPermintaan";
import LayoutPegawai from "./LayoutPegawai";
import axios from "axios";

const LacakPermintaan: React.FC = () => {
    const [daftarPermintaan, setDaftarPermintaan] = useState<any[]>([]);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        const fetchPermintaan = async () => {
            try {
                const response = await axios.get("/lacak-permintaan");
                setDaftarPermintaan(response.data);
            } catch (error) {
                console.error("Gagal mengambil data permintaan:", error);
            }
        };

        fetchPermintaan();
    }, []);

    return (
        <LayoutPegawai>
            {selected ? (
                <DetailPermintaan permintaan={selected} />
            ) : (
                <DaftarPermintaan
                    daftarPermintaan={daftarPermintaan}
                    onLihatDetail={setSelected}
                />
            )}
        </LayoutPegawai>
    );
};

export default LacakPermintaan;
