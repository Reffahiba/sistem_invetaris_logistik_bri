import React, { useEffect, useState } from "react";
import Layout from "@/Layout";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

function Dashboard() {
    const [nama, setNama] = useState("Guest");
    const [divisi, setDivisi] = useState("Divisi");

    useEffect(() => {
        const el = document.getElementById("app");
        if (el?.dataset) {
            setNama(el.dataset.nama || "Guest");
            setDivisi(el.dataset.divisi || "Divisi");
        }
    }, []);

    return (
        <Layout>
            <main className="flex-1 overflow-auto bg-background">
                {/* <h1 className="text-2xl font-bold">
                    Selamat datang di dashboard! <br />
                    Nama: {nama}! <br />
                    Divisi: {divisi}
                </h1> */}

                <Carousel className="w-full max-w-[1120px] mx-auto">
                    <CarouselContent>
                        <CarouselItem className="bg-carousel-bg bg-cover bg-center rounded-xl items-left pl-5 py-2 flex flex-col">
                            <div className="flex justify-between">
                                <div className="flex flex-col ml-5 mt-3 gap-4">
                                    <div className="text-white p-3 text-4xl font-semibold text-left">
                                        Ajukan permintaan logisitk <br />
                                        <span className="italic">
                                            cepat, praktik, tinggal klik!
                                        </span>
                                    </div>
                                    <div className="flex items-end justify-start p-3">
                                        <button className="bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 text-white text-md py-2 px-3 rounded-xl mt-2 font-semiboldn">
                                            <div className="flex flex-row items-center">
                                                <a
                                                    href="/admin_data_barang"
                                                    className="text-center"
                                                >
                                                    Mulai Ajukan
                                                </a>
                                                <img
                                                    src="/assets/arrow-right.png"
                                                    alt="panah kanan"
                                                    className="w-6 h-6"
                                                />
                                            </div>
                                        </button>
                                    </div>
                                </div>
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
                        <CarouselItem className="bg-carousel-bg bg-cover bg-center rounded-xl items-left pl-5 py-2 flex flex-col">
                            <div className="flex justify-between">
                                <div className="flex flex-col ml-5 mt-3 gap-4">
                                    <div className="text-white p-3 text-4xl font-semibold text-left">
                                        Lacak status permintaan barang
                                        <br />
                                        <span className="italic">
                                            mudah, cepat, tanpa ribet!
                                        </span>
                                    </div>
                                    <div className="flex items-end justify-start p-3">
                                        <button className="bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 text-white text-md py-2 px-3 rounded-xl mt-2 font-semibol">
                                            <div className="flex flex-row items-center">
                                                <a
                                                    href="/admin_data_barang"
                                                    className="text-center"
                                                >
                                                    Lacak Status
                                                </a>
                                                <img
                                                    src="/assets/arrow-right.png"
                                                    alt="panah kanan"
                                                    className="w-6 h-6"
                                                />
                                            </div>
                                        </button>
                                    </div>
                                </div>
                                <div className="relative h-full w-48 mr-20 mt-3">
                                    {/* <img
                                        src="/assets/desain.png"
                                        alt="gambar"
                                        className="h-full w-full object-contain"
                                    />
                                    <img
                                        src="/assets/pngwing 1.png"
                                        alt="gambar"
                                        className="absolute top-1 left-[-18px] h-full object-contain z-10 scale-125"
                                    /> */}
                                </div>
                            </div>
                        </CarouselItem>
                        <CarouselItem className="bg-carousel-bg bg-cover bg-center rounded-xl items-left pl-5 py-2 flex flex-col">
                            <div className="flex justify-between">
                                <div className="flex flex-col ml-5 mt-3 gap-4">
                                    <div className="text-white p-3 text-4xl font-semibold text-left">
                                        Tinjau kembali permintaan
                                        <br />
                                        <span className="italic">
                                            yang telah diantarakan!
                                        </span>
                                    </div>
                                    <div className="flex items-end justify-start p-3">
                                        <button className="bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 text-white text-md py-2 px-3 rounded-xl mt-2 font-semibold">
                                            <div className="flex flex-row items-center">
                                                <a
                                                    href="/admin_data_barang"
                                                    className="text-center"
                                                >
                                                    Lihat Riwayat
                                                </a>
                                                <img
                                                    src="/assets/arrow-right.png"
                                                    alt="panah kanan"
                                                    className="w-6 h-6"
                                                />
                                            </div>
                                        </button>
                                    </div>
                                </div>
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
                    </CarouselContent>
                    <CarouselPrevious className="z-50" />
                    <CarouselNext className="z-50" />
                </Carousel>
            </main>
        </Layout>
    );
}

export default Dashboard;
