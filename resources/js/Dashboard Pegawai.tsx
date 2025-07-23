import React, { useEffect, useState } from "react";
import LayoutPegawai from "@/Layout Pegawai";
import {Carousel, CarouselContent, CarouselItem, type CarouselApi} from "@/components/ui/carousel";

function DashboardPegawai() {
    const [nama, setNama] = useState("Guest");
    const [divisi, setDivisi] = useState("Divisi");
    
    const [api, setApi] = useState<CarouselApi | null>(null);
    const slides = [
        {
            title: "Ajukan permintaan logistik",
            subtitle: "cepat, praktis, tinggal klik!",
            href: "/pengajuan_barang",
            buttonText: "Mulai Ajukan",
        },
        {
            title: "Lacak status permintaan barang",
            subtitle: "mudah, cepat, tanpa ribet!",
            href: "/admin_data_barang",
            buttonText: "Lacak Status",
        },
        {
            title: "Tinjau kembali permintaan",
            subtitle: "yang telah diantarakan!",
            href: "/admin_data_barang",
            buttonText: "Lihat Riwayat",
        },
    ];
    
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const el = document.getElementById("app");
        if (el?.dataset) {
            setNama(el.dataset.nama || "Guest");
            setDivisi(el.dataset.divisi || "Divisi");
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
        }, 6000); // 5 detik

        return () => clearInterval(interval);
    }, [api]);

    return (
        <LayoutPegawai>
            <main className="flex-1 overflow-auto">
                <Carousel
                    className="w-full max-w-[1120px] mx-auto"
                    setApi={setApi}
                >
                    <CarouselContent>
                        {slides.map((slide, index) => (
                            <CarouselItem
                                key={index}
                                className="bg-carousel-bg bg-cover bg-center rounded-xl items-left pl-5 py-2 flex flex-col"
                            >
                                <div className="flex justify-between">
                                    <div className="flex flex-col ml-5 mt-3 gap-4">
                                        <div className="text-white p-3 text-4xl font-semibold text-left">
                                            {slide.title}
                                            <br />
                                            <span className="italic">
                                                {slide.subtitle}
                                            </span>
                                        </div>
                                        <div className="flex items-end justify-start p-3">
                                            <a href={slide.href}>
                                                <button className="bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 text-white text-md py-2 px-3 rounded-xl mt-2 font-semibold border-b-orange-700 flex items-center gap-2">
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

                                    {/* Optional gambar di kanan */}
                                    {/* <div className="relative h-full w-48 mr-20 mt-3">
                                        <img
                                            src="/assets/desain.png"
                                            alt="gambar"
                                            className="h-full w-full object-contain"
                                        />
                                        <img
                                            src="/assets/pngwing 1.png"
                                            alt="gambar"
                                            className="absolute top-1 left-[-18px] h-full object-contain z-10 scale-125"
                                        />
                                    </div> */}
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
            </main>
        </LayoutPegawai>
    );
}

export default DashboardPegawai;
