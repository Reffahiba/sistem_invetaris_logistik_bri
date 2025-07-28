import React, {useState} from "react";
import Status from "@/Status";
import axios from "axios";

interface DetailPermintaanProps {
    detail_permintaan: {
        id_detail: number;
        nama_barang: string;
        jumlah_minta: number;
        id_permintaan: number;
        id_barang: number;
        status: string;
        gambar_barang: string;
        daftarBarang: Barang[];
    };
}

const DetailPermintaan: React.FC<DetailPermintaanProps> = ({detail_permintaan,}) => {
    const [permintaan, setPermintaan] = useState(detail_permintaan);

    const handleKonfirmasi = async () => {
        try {
            const updatedStatus = "telah diterima";

            const tokenElement = document.querySelector(
                'meta[name="csrf-token"]'
            );
            const csrfToken = tokenElement?.getAttribute("content");

            if (!csrfToken) {
                alert("CSRF token tidak ditemukan di dokumen HTML.");
                return;
            }

            await axios.patch(
                `/lacak-permintaan/${permintaan.id_permintaan}`,
                { status: updatedStatus },
                {
                    headers: {
                        "X-CSRF-TOKEN": csrfToken,
                    },
                }
            );

            setPermintaan((prev) => ({
                ...prev,
                status: updatedStatus,
            }));

            alert("Status berhasil dikonfirmasi sebagai 'Telah Diterima'");
        } catch (error) {
            console.error("Gagal konfirmasi:", error);
            alert("Terjadi kesalahan saat konfirmasi. Silakan coba lagi.");
        }
    };
    
    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">Status Permintaan</h2>
            <Status currentStep={permintaan.status} />

            <div className="mt-6 space-y-4">
                {detail_permintaan.daftarBarang.map((barang) => (
                    <div
                        key={barang.id}
                        className="bg-white p-4 shadow rounded flex items-center space-x-4"
                    >
                        <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                            <img
                                src={detail_permintaan.gambar_barang || "/placeholder.png"}
                                alt="Gambar"
                                className="w-12 h-12 object-cover"
                            />
                        </div>
                        <div>
                            <p className="font-medium">{detail_permintaan.nama_barang}</p>
                        </div>
                    </div>
                ))}
            </div>

            <h2 className="text-xl font-bold mb-2 mt-5">
                Detail Permintaan #{permintaan.id_permintaan}
            </h2>

            <div className="bg-white shadow p-4 rounded">
                <p>
                    <strong>Nama Barang:</strong>{" "}
                    {detail_permintaan.nama_barang}
                </p>
                <p>
                    <strong>Jumlah Minta:</strong>{" "}
                    {detail_permintaan.jumlah_minta}
                </p>
            </div>
            {/* Tombol Konfirmasi */}
            {permintaan.status.toLowerCase() === "sedang diantar" ? (
                <button
                    onClick={() => handleKonfirmasi()}
                    className="mt-6 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                    Konfirmasi
                </button>
            ) : (
                <button
                    disabled
                    className="mt-6 bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed"
                >
                    Konfirmasi
                </button>
            )}
        </div>
    );
};

export default DetailPermintaan;
