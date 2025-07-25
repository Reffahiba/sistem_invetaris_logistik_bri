import React from "react";
import ReactDOM from "react-dom/client";
import Dashboard from "@/Dashboard";
import DataBarang from "@/DataBarang";
import Permintaan from "@/Permintaan";
import KelolaAkun from "@/KelolaAkun";
import DashboardPegawai from "@/DashboardPegawai";
import AjukanPermintaan from "@/AjukanPermintaan";
import LacakPermintaan from "./LacakPermintaan";
import "/resources/css/app.css";

const dashboard = document.getElementById("dashboard-root");
const dataBarang = document.getElementById("dataBarang-root");
const permintaan = document.getElementById("permintaan-root");
const kelolaAkun = document.getElementById("kelolaAkun-root");

const dashboardPegawai = document.getElementById("dashboardPegawai-root");
const ajukanPermintaan = document.getElementById("ajukanPermintaan-root");
const lacakPermintaan = document.getElementById("lacakStatus-root");
const riwayatPermintaan = document.getElementById("riwayatPermintaan-root");

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
