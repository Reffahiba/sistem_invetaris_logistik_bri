import React from "react";
import ReactDOM from "react-dom/client";
import Dashboard from "@/DashboardAdmin";
import DataBarang from "@/pages/DataBarang";
import DataKategori from "@/pages/DataKategori";
import BarangMasuk from "@/pages/BarangMasuk";
import BarangKeluar from "@/pages/BarangKeluar";
import Permintaan from "@/pages/Permintaan";
import KelolaAkun from "@/pages/KelolaAkun";
import DashboardPegawai from "@/DashboardPegawai";
import AjukanPermintaan from "@/pages/AjukanPermintaan";
import LacakPermintaan from "@/pages/LacakPermintaan";
import RiwayatPermintaan from "@/pages/RiwayatPermintaan";
import NotFound from "@/pages/error/404";
import "/resources/css/app.css";

const dashboard = document.getElementById("dashboard-root");
const dataBarang = document.getElementById("dataBarang-root");
const dataKategori = document.getElementById("dataKategori-root");
const barangMasuk = document.getElementById("barangMasuk-root");
const barangKeluar = document.getElementById("barangKeluar-root");
const permintaan = document.getElementById("permintaan-root");
const kelolaAkun = document.getElementById("kelolaAkun-root");

const dashboardPegawai = document.getElementById("dashboardPegawai-root");
const ajukanPermintaan = document.getElementById("ajukanPermintaan-root");
const lacakPermintaan = document.getElementById("lacakStatus-root");
const riwayatPermintaan = document.getElementById("riwayatPermintaan-root");

const notFound = document.getElementById("notFound-root");

if (dashboard) {
    ReactDOM.createRoot(dashboard).render(
        <React.StrictMode>
            <Dashboard />
        </React.StrictMode>
    );
}

if (dataBarang) {
    ReactDOM.createRoot(dataBarang).render(
        <React.StrictMode>
            <DataBarang />
        </React.StrictMode>
    );
}

if (dataKategori) {
    ReactDOM.createRoot(dataKategori).render(
        <React.StrictMode>
            <DataKategori />
        </React.StrictMode>
    );
}

if (barangMasuk) {
    ReactDOM.createRoot(barangMasuk).render(
        <React.StrictMode>
            <BarangMasuk />
        </React.StrictMode>
    );
}

if (barangKeluar) {
    ReactDOM.createRoot(barangKeluar).render(
        <React.StrictMode>
            <BarangKeluar />
        </React.StrictMode>
    );
}


if (permintaan) {
    ReactDOM.createRoot(permintaan).render(
        <React.StrictMode>
            <Permintaan />
        </React.StrictMode>
    );
}

if (kelolaAkun) {
    ReactDOM.createRoot(kelolaAkun).render(
        <React.StrictMode>
            <KelolaAkun />
        </React.StrictMode>
    );
}

if (dashboardPegawai) {
    ReactDOM.createRoot(dashboardPegawai).render(
        <React.StrictMode>
            <DashboardPegawai />
        </React.StrictMode>
    );
}

if (ajukanPermintaan) {
    ReactDOM.createRoot(ajukanPermintaan).render(
        <React.StrictMode>
            <AjukanPermintaan />
        </React.StrictMode>
    );
}

if (lacakPermintaan) {
    ReactDOM.createRoot(lacakPermintaan).render(
        <React.StrictMode>
            <LacakPermintaan />
        </React.StrictMode>
    );
}

if (riwayatPermintaan) {
    ReactDOM.createRoot(riwayatPermintaan).render(
        <React.StrictMode>
            <RiwayatPermintaan />
        </React.StrictMode>
    );
}

if (notFound) {
    ReactDOM.createRoot(notFound).render(
        <React.StrictMode>
            <NotFound />
        </React.StrictMode>
    );
}