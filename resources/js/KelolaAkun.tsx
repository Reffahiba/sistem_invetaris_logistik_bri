import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import axios from "axios";

axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

const token = document.head.querySelector(
    'meta[name="csrf-token"]'
) as HTMLMetaElement;
if (token) {
    axios.defaults.headers.common["X-CSRF-TOKEN"] = token.content;
} else {
    console.error("CSRF token not found in meta tag.");
}

type Divisi = {
    id_divisi: number;
    nama_divisi: string;
};

type AkunPengguna = {
    id_user: number;
    nama_user: string;
    email: string;
    nomor_telepon: string;
    password: string;
    id_divisi: number;
};

const KelolaAkun = () => {
    const [akunList, setAkunList] = useState<AkunPengguna[]>([]);
    const [divisiList, setDivisiList] = useState<Divisi[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        nama_user: "",
        email: "",
        nomor_telepon: "",
        password: "",
        id_divisi: "" as number | "",
    });
    const [editingId, setEditingId] = useState<number | null>(null);

    useEffect(() => {
        const rootElement = document.getElementById("kelolaAkun-root");
        if (rootElement) {
            const akunData = rootElement.getAttribute("data-akun");
            const divisiData = rootElement.getAttribute("data-daftarDivisi");
            if (akunData) {
                try {
                    const parsedData = JSON.parse(akunData);
                    setAkunList(parsedData);
                } catch (err) {
                    console.error("Gagal parsing data-akun:", err);
                }
            } else {
                fetchAkun();
            }

            if (divisiData) {
                try {
                    const parsedDivisi = JSON.parse(divisiData);
                    setDivisiList(parsedDivisi);
                } catch (err) {
                    console.error("Gagal parsing data-divisi:", err);
                }
            }
        }
    }, []);

    const fetchAkun = async () => {
        try {
            const response = await axios.get("/admin_kelola_akun");
            setAkunList(response.data);
        } catch (error){
            console.error("Gagal memuat data akun:", error);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "id_divisi" ? parseInt(value) || "" : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("formData.id_divisi:", formData.id_divisi);
            if (!formData.id_divisi) {
                alert("Silakan pilih divisi terlebih dahulu");
                return;
            }

            const payload = {
                nama_user: formData.nama_user,
                email: formData.email,
                nomor_telepon: formData.nomor_telepon,
                password: formData.password,
                id_divisi: formData.id_divisi,
            };

            if (!formData.password && !editingId) {
                alert("Password tidak boleh kosong.");
                return;
            }

            if (editingId) {
                await axios
                    .put(`/admin_edit_akun/${editingId}`, payload);
                    window.location.href = "/admin_kelola_akun";
                    
            } else {
                await axios
                    .post("/admin_tambah_akun", payload)
                    .then((response) => {
                        alert(response.data.message);
                        window.location.href = "/admin_kelola_akun";
                    })
                    .catch((error) => {
                        console.error(error);
                        alert("Terjadi kesalahan saat menyimpan data.");
                    });;
            }
            closeModal();
        } catch (error) {
            console.error("DETAIL:", error.response?.data || error.message);
            alert("Gagal menyimpan akun. Cek kembali input yang dimasukkan.");
        }
    };

    const handleEdit = (akun: AkunPengguna) => {
        setFormData({
            nama_user: akun.nama_user,
            nomor_telepon: akun.nomor_telepon,
            password: "", // kosongkan password
            id_divisi: akun.id_divisi.toString(),
        });
        setEditingId(akun.id_user);
        setShowModal(true);
    };

    const handleDelete = async (id: number) => {
        if (confirm("Yakin ingin menghapus akun ini?")) {
            try {
                await axios.delete(`/admin_hapus_akun/${id}`);
                window.location.href = "/admin_kelola_akun";
                fetchAkun();
            } catch (error) {
                console.error("Gagal hapus akun", error);
            }
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setFormData({
            nama_user: "",
            email: "",
            nomor_telepon: "",
            password: "",
            id_divisi: "",
        });
        setEditingId(null);
    };

    return (
        <Layout>
            <div className="flex justify-between mb-4">
                <h2 className="text-xl font-bold">Kelola Akun</h2>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Tambah Akun
                </button>
            </div>

            <div className="overflow-auto bg-white shadow rounded-lg">
                <table className="min-w-full bg-white">
                    {akunList.length === 0 ? (
                        <tbody>
                            <tr>
                                <td
                                    colSpan={5}
                                    className="text-center py-4 text-gray-500"
                                >
                                    Belum ada akun pegawai
                                </td>
                            </tr>
                        </tbody>
                    ) : (
                        <>
                            <thead>
                                <tr>
                                    <th className="py-3 px-6 text-left">
                                        Nama
                                    </th>
                                    <th className="py-3 px-6 text-left">
                                        Email
                                    </th>
                                    <th className="py-3 px-6 text-left">
                                        Telepon
                                    </th>
                                    <th className="py-3 px-6 text-left">
                                        Divisi
                                    </th>
                                    <th className="py-3 px-6 text-left">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {akunList.map((user, index) => (
                                    <tr key={index} className="border-b">
                                        <td className="py-3 px-6">
                                            {user.nama_user}
                                        </td>
                                        <td className="py-3 px-6">
                                            {user.email}
                                        </td>
                                        <td className="py-3 px-6">
                                            {user.nomor_telepon}
                                        </td>
                                        <td className="py-3 px-6">
                                            {user.divisi?.nama_divisi || "-"}
                                        </td>
                                        <td className="py-3 px-6">
                                            <button
                                                onClick={() => handleEdit(user)}
                                                className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(user.id_user)
                                                }
                                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                            >
                                                Hapus
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </>
                    )}
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4">
                            {editingId ? "Edit Akun" : "Tambah Akun"}
                        </h3>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    name="nama_user"
                                    value={formData.nama_user}
                                    onChange={handleChange}
                                    placeholder="Nama Pengguna"
                                    className="w-full border px-4 py-2 rounded"
                                />
                                {!editingId && (
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Email"
                                        className="w-full border px-4 py-2 rounded"
                                    />
                                )}
                                <input
                                    type="tel"
                                    name="nomor_telepon"
                                    value={formData.nomor_telepon}
                                    onChange={handleChange}
                                    placeholder="Nomor Telepon"
                                    className="w-full border px-4 py-2 rounded"
                                />
                                {!editingId && (
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Password"
                                        className="w-full border px-4 py-2 rounded"
                                    />
                                )}
                                {!editingId && (
                                    <select
                                        name="id_divisi"
                                        value={formData.id_divisi}
                                        onChange={handleChange}
                                        className="w-full border px-4 py-2 rounded"
                                    >
                                        <option value="">Pilih Divisi</option>
                                        {divisiList.map((divisi) => (
                                            <option
                                                key={divisi.id_divisi}
                                                value={divisi.id_divisi}
                                            >
                                                {divisi.nama_divisi}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            <div className="mt-4 flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    {editingId ? "Update" : "Simpan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default KelolaAkun;
