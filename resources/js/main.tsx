import React from "react";
import ReactDOM from "react-dom/client";
import Dashboard from "@/Dashboard";
import DataBarang from "@/Data Barang";
import Permintaan from "@/Permintaan";
import KelolaAkun from "@/Kelola Akun";
import DashboardPegawai from "@/Dashboard Pegawai";
import AjukanPermintaan from "@/Ajukan Permintaan";
import '/resources/css/app.css';

const dashboard = document.getElementById("dashboard-root");
const dataBarang = document.getElementById("dataBarang-root");
const permintaan = document.getElementById("permintaan-root");
const kelolaAkun = document.getElementById("kelolaAkun-root");

const dashboardPegawai = document.getElementById("dashboardPegawai-root");
const ajukanPermintaan = document.getElementById("ajukanPermintaan-root");
 
if(dashboard){
    ReactDOM.createRoot(dashboard).render(
        <React.StrictMode>
            <Dashboard />
        </React.StrictMode>
    );
}

if(dataBarang){
    ReactDOM.createRoot(dataBarang).render(
        <React.StrictMode>
            <DataBarang />
        </React.StrictMode>
    );
}

if(permintaan){
    ReactDOM.createRoot(permintaan).render(
        <React.StrictMode>
            <Permintaan/>
        </React.StrictMode>
    )
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
            <AjukanPermintaan/>
        </React.StrictMode>
    )
}