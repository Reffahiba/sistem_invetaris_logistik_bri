import React, { useEffect, useState } from "react";
import LayoutPegawai from "@/LayoutPegawai";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

function DashboardPegawai() {
    const [nama, setNama] = useState("Guest");
    const [divisi, setDivisi] = useState("Divisi");

    const [jumlah, setJumlah] = useState({
        total: 0,
        menunggu: 0,
        diproses: 0,
        diantar: 0,
        diterima: 0,
        ditolak: 0,
    });

    const [persen, setPersen] = useState({
        total: 0,
        menunggu: 0,
        diproses: 0,
        diantar: 0,
        diterima: 0,
        ditolak: 0,
    });

    const [api, setApi] = useState<CarouselApi | null>(null);
    const slides = [
        {
            title: "Ajukan permintaan logistik",
            subtitle: "cepat, praktis, tinggal klik!",
            href: "/ajukan-permintaan",
            buttonText: "Mulai Ajukan",
        },
        {
            title: "Lacak status permintaan barang",
            subtitle: "mudah, cepat, tanpa ribet!",
            href: "/lacak-permintaan",
            buttonText: "Lacak Status",
        },
        {
            title: "Tinjau kembali permintaan",
            subtitle: "yang telah diantarakan!",
            href: "/riwayat-permintaan",
            buttonText: "Lihat Riwayat",
        },
    ];

    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const el = document.getElementById("app");
        if (el?.dataset) {
            setNama(el.dataset.nama || "Guest");
            setDivisi(el.dataset.divisi || "Divisi");

            setJumlah({
                total: parseInt(el.dataset.total || "0"),
                menunggu: parseInt(el.dataset.menunggu || "0"),
                diproses: parseInt(el.dataset.diproses || "0"),
                diantar: parseInt(el.dataset.diantar || "0"),
                diterima: parseInt(el.dataset.diterima || "0"),
                ditolak: parseInt(el.dataset.ditolak || "0"),
            });

            setPersen({
                total: parseInt(el.dataset.persenTotal || "0"),
                menunggu: parseInt(el.dataset.persenMenunggu || "0"),
                diproses: parseInt(el.dataset.persenDiproses || "0"),
                diantar: parseInt(el.dataset.persenDiantar || "0"),
                diterima: parseInt(el.dataset.persenDiterima || "0"),
                ditolak: parseInt(el.dataset.persenDitolak || "0"),
            });
        }

        if (!api) return;

        const interval = setInterval(() => {
            if (!api) return;
            if (api.canScrollNext()) {
                api.scrollNext();
                setCurrent((prev) => (prev + 1) % slides.length);
            } else {
                api.scrollTo(0);
                setCurrent(0); // Kembali ke slide pertama
            }
        }, 4000); //

        return () => clearInterval(interval);
    }, [api]);

    return (
        <LayoutPegawai>
            <main className="flex-1 overflow-x-hidden">
                <Carousel className="w-full max-w-full mx-auto" setApi={setApi}>
                    <CarouselContent>
                        {slides.map((slide, index) => (
                            <CarouselItem
                                key={index}
                                className="bg-carousel-bg bg-cover bg-center rounded-xl items-left pl-5 py-2 flex flex-col"
                            >
                                <div className="flex justify-between">
                                    <div className="flex flex-col ml-3 mt-2 gap-4">
                                        <div className="text-white p-3 text-4xl font-semibold text-left">
                                            {slide.title}
                                            <br />
                                            <span className="italic">
                                                {slide.subtitle}
                                            </span>
                                        </div>
                                        <div className="flex items-end justify-start p-2">
                                            <a href={slide.href}>
                                                <button className="bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 text-white text-sm py-2 px-3 rounded-xl mt-2 font-semibold border-b-orange-700 flex items-center gap-2">
                                                    {slide.buttonText}
                                                    <img
                                                        src="/assets/arrow-right.png"
                                                        alt="panah kanan"
                                                        className="w-6 h-6"
                                                    />
                                                </button>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    {/* Bullet Indicators with Glassmorphism Background */}
                    <div
                        style={{
                            position: "absolute",
                            bottom: "10px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            padding: "6px 16px",
                            borderRadius: "9999px",
                            background:
                                "linear-gradient(to right, rgba(255, 255, 255, 0.4), rgba(200, 200, 200, 0.2))",
                            backdropFilter: "blur(12px)",
                            WebkitBackdropFilter: "blur(12px)",
                            display: "flex",
                            gap: "10px",
                            alignItems: "center",
                        }}
                    >
                        {slides.map((_, index) => (
                            <div
                                key={index}
                                style={{
                                    width: current === index ? "24px" : "10px",
                                    height: "10px",
                                    borderRadius: "9999px",
                                    backgroundColor:
                                        current === index
                                            ? "rgba(255,255,255,0.9)"
                                            : "rgba(255,255,255,0.4)",
                                    transition: "all 0.3s ease",
                                }}
                            />
                        ))}
                    </div>
                </Carousel>

                {/* Statistik Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                    {[
                        {
                            label: "Total Permintaan",
                            key: "total",
                            color: "text-gray-400",
                            image: "/assets/bookmark.png",
                            bg: "bg-gray-400",
                        },
                        {
                            label: "Menunggu",
                            key: "menunggu",
                            color: "text-orange-400",
                            image: "/assets/menunggu.png",
                            bg: "bg-orange-400",
                        },
                        {
                            label: "Sedang Diproses",
                            key: "diproses",
                            color: "text-yellow-400",
                            image: "/assets/refresh-square-2.png",
                            bg: "bg-yellow-400",
                        },
                        {
                            label: "Sedang Diantar",
                            key: "diantar",
                            color: "text-blue-400",
                            image: "/assets/send-sqaure-2.png",
                            bg: "bg-blue-400",
                        },
                        {
                            label: "Telah Diterima",
                            key: "diterima",
                            color: "text-green-400",
                            image: "/assets/tick-square.png",
                            bg: "bg-green-400",
                        },
                        {
                            label: "Ditolak",
                            key: "ditolak",
                            color: "text-red-400",
                            image: "/assets/close-square.png",
                            bg: "bg-red-400",
                        },
                    ].map((item, idx) => (
                        <Card key={idx} className="shadow-sm">
                            <CardContent className="p-4">
                                <div className="flex justify-between">
                                    <h3
                                        className={`text-sm font-semibold ${item.color}`}
                                    >
                                        {item.label}
                                    </h3>
                                    <img
                                        src={item.image}
                                        alt="menunggu"
                                        className={`w-10 h-10 p-2 rounded-full ${item.bg}`}
                                    />
                                </div>
                                <p className="text-3xl font-bold mt-1">
                                    {jumlah[item.key as keyof typeof jumlah]}
                                </p>
                                <div className="w-full bg-gray-200 h-2 mt-4 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all ${item.bg}`}
                                        style={{
                                            width: `${
                                                persen[
                                                    item.key as keyof typeof persen
                                                ]
                                            }%`,
                                        }}
                                    />
                                </div>
                                <p className="text-sm mt-1 text-gray-600 text-right">
                                    {persen[item.key as keyof typeof persen]}%
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </main>
        </LayoutPegawai>
    );
}

export default DashboardPegawai;
