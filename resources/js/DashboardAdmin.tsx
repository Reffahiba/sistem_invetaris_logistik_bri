import React, { useEffect, useState } from "react";
import Layout from "@/LayoutAdmin";
import axios from "axios";
import {
    Package,
    ArrowUpCircle,
    ArrowDownCircle,
    Clock,
    MoreHorizontal,
} from "lucide-react";
import {
    ResponsiveContainer,
    AreaChart,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Area,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import LoadingOverlay from "@/components/ui/loading-overlay";

interface LogActivity {
    id: number;
    activity: string;
    description: string;
    created_at: string;
    akun_pengguna: {
        nama_user: string;
    } | null;
}

// Tipe data untuk data yang diterima dari API
interface DashboardData {
    summary: {
        totalBarang: number;
        totalBarangMasuk: number;
        totalBarangKeluar: number;
        totalPending: number;
    };
    kategoriComposition: { name: string; value: number }[];
    lineChartData: { tanggal: string; masuk: number; keluar: number }[];
    logActivities: LogActivity[];
}

// Komponen Card untuk ringkasan data
const SummaryCard = ({
    icon,
    title,
    value,
    description,
}: {
    icon: React.ReactNode;
    title: string;
    value: string;
    description: string;
}) => (
    <div className="bg-white p-6 rounded-lg shadow-sm flex items-start justify-between">
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
            <p className="text-xs text-gray-400 mt-2">{description}</p>
        </div>
        <div className="bg-gray-100 p-3 rounded-full">{icon}</div>
    </div>
);

const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " tahun lalu";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " bulan lalu";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " hari lalu";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " jam lalu";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " menit lalu";
    return "Baru saja";
};

// Tipe untuk filter
type ChartFilter = "minggu" | "bulan" | "tahun";

function DashboardAdmin() {
    const [nama, setNama] = useState("Guest");
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(
        null
    );
    const [isLoading, setIsLoading] = useState(true);

    const [chartFilter, setChartFilter] = useState<ChartFilter>("minggu");

    useEffect(() => {
        const el = document.getElementById("app");
        if (el?.dataset) {
            setNama(el.dataset.nama || "Guest");
        }

        setIsLoading(true); // Set loading true setiap kali filter berubah
        axios
            .get("/api/admin/dashboard-data", {
                params: {
                    filter: chartFilter, // Kirim filter ke backend
                },
            })
            .then((response) => {
                setDashboardData(response.data);
            })
            .catch((error) => {
                console.error("Gagal mengambil data dashboard:", error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [chartFilter]);

    const PIE_COLORS = [
        "#0088FE",
        "#00C49F",
        "#FFBB28",
        "#FF8042",
        "#A239EA",
        "#FF5A5F",
    ];

    if (isLoading) {
        return (
            <Layout>
                <LoadingOverlay isLoading={isLoading} />
            </Layout>
        );
    }

    if (!dashboardData) {
        return (
            <Layout>
                <div className="p-6">Gagal memuat data.</div>
            </Layout>
        );
    }

    return (
        <Layout>
            <main className="flex-1 space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-semibold text-gray-800">
                        Dashboard
                    </h1>
                    {/* <p className="text-gray-500">Selamat datang kembali, {nama}!</p> */}
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <SummaryCard
                        icon={<Package size={22} className="text-blue-500" />}
                        title="Total Barang"
                        value={dashboardData.summary.totalBarang.toLocaleString(
                            "id-ID"
                        )}
                        description="Jumlah jenis barang terdaftar"
                    />
                    <SummaryCard
                        icon={
                            <ArrowDownCircle
                                size={22}
                                className="text-green-500"
                            />
                        }
                        title="Total Barang Masuk"
                        value={dashboardData.summary.totalBarangMasuk.toLocaleString(
                            "id-ID"
                        )}
                        description="Akumulasi stok masuk"
                    />
                    <SummaryCard
                        icon={
                            <ArrowUpCircle size={22} className="text-red-500" />
                        }
                        title="Total Barang Keluar"
                        value={dashboardData.summary.totalBarangKeluar.toLocaleString(
                            "id-ID"
                        )}
                        description="Akumulasi stok keluar"
                    />
                    <SummaryCard
                        icon={<Clock size={22} className="text-yellow-500" />}
                        title="Permintaan Pending"
                        value={dashboardData.summary.totalPending.toLocaleString(
                            "id-ID"
                        )}
                        description="Permintaan menunggu persetujuan"
                    />
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Line Chart */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-gray-800">
                                Aktivitas Stok
                            </h3>
                            <div className="flex items-center bg-gray-100 p-1 rounded-lg text-sm">
                                <button
                                    onClick={() => setChartFilter("minggu")}
                                    className={`px-3 py-1 rounded-sm transition-colors ${
                                        chartFilter === "minggu"
                                            ? "bg-white shadow-sm text-gray-800 font-semibold"
                                            : "text-gray-500 hover:bg-gray-200"
                                    }`}
                                >
                                    Mingguan
                                </button>
                                <button
                                    onClick={() => setChartFilter("bulan")}
                                    className={`px-3 py-1 rounded-sm transition-colors ${
                                        chartFilter === "bulan"
                                            ? "bg-white shadow-sm text-gray-800 font-semibold"
                                            : "text-gray-500 hover:bg-gray-200"
                                    }`}
                                >
                                    Bulanan
                                </button>
                                <button
                                    onClick={() => setChartFilter("tahun")}
                                    className={`px-3 py-1 rounded-sm transition-colors ${
                                        chartFilter === "tahun"
                                            ? "bg-white shadow-sm text-gray-800 font-semibold"
                                            : "text-gray-500 hover:bg-gray-200"
                                    }`}
                                >
                                    Tahunan
                                </button>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart
                                data={dashboardData.lineChartData}
                                margin={{
                                    top: 5,
                                    right: 20,
                                    left: -10,
                                    bottom: 5,
                                }}
                            >
                                <defs>
                                    <linearGradient
                                        id="colorMasuk"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor="#00C49F"
                                            stopOpacity={0.8}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="#00C49F"
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                    <linearGradient
                                        id="colorKeluar"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor="#FF8042"
                                            stopOpacity={0.8}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="#FF8042"
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#e0e0e0"
                                />
                                <XAxis
                                    dataKey="tanggal"
                                    tick={{ fontSize: 12 }}
                                />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip />
                                <Legend verticalAlign="top" height={36} />
                                <Area
                                    type="monotone"
                                    dataKey="masuk"
                                    name="Barang Masuk"
                                    stroke="#00C49F"
                                    fillOpacity={1}
                                    fill="url(#colorMasuk)"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="keluar"
                                    name="Barang Keluar"
                                    stroke="#FF8042"
                                    fillOpacity={1}
                                    fill="url(#colorKeluar)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Pie Chart */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="font-semibold text-gray-800 mb-4">
                            Komposisi Kategori Barang
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={dashboardData.kategoriComposition}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                    nameKey="name"
                                    label={({ name, percent }) =>
                                        `${name} ${(percent * 100).toFixed(0)}%`
                                    }
                                >
                                    {dashboardData.kategoriComposition.map(
                                        (entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={
                                                    PIE_COLORS[
                                                        index %
                                                            PIE_COLORS.length
                                                    ]
                                                }
                                            />
                                        )
                                    )}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-gray-800">
                            Aktivitas Terbaru
                        </h3>
                        <button className="text-gray-400 hover:text-gray-600">
                            <MoreHorizontal size={20} />
                        </button>
                    </div>
                    <div className="space-y-6">
                        {dashboardData.logActivities.map((log, index) => {
                            // Ekstrak identifier dari deskripsi, contoh: 'Laptop ASUS'
                            const identifierMatch =
                                log.description.match(/'([^']*)'/);
                            const identifier = identifierMatch
                                ? identifierMatch[1]
                                : "";

                            return (
                                <div
                                    key={log.id}
                                    className="flex gap-4 relative"
                                >
                                    {/* Avatar dan Garis Timeline */}
                                    <div className="flex flex-col items-center">
                                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500 text-sm">
                                            {log.akun_pengguna
                                                ? log.akun_pengguna.nama_user
                                                      .substring(0, 2)
                                                      .toUpperCase()
                                                : "S"}
                                        </div>
                                        {/* Garis vertikal, jangan tampilkan untuk item terakhir */}
                                        {index <
                                            dashboardData.logActivities.length -
                                                1 && (
                                            <div className="w-px flex-1 bg-gray-200 my-2"></div>
                                        )}
                                    </div>

                                    {/* Konten Teks */}
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-800">
                                            <span className="font-semibold">
                                                {log.akun_pengguna?.nama_user ||
                                                    "Sistem"}
                                            </span>
                                            {` ${log.activity} ${log.description
                                                .split("'")[0]
                                                .replace(log.activity, "")
                                                .trim()}`}
                                        </p>
                                        <p className="text-sm font-semibold text-blue-600 mt-1">
                                            {identifier}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {formatRelativeTime(log.created_at)}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </main>
        </Layout>
    );
}

export default DashboardAdmin;
// Note: This code assumes you have a backend endpoint at /api/admin/dashboard-data
