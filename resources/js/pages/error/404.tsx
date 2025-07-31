import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react'; // Menggunakan Link dari Inertia.js
import { ArrowLeft } from 'lucide-react';
import Lottie from 'lottie-react';

// Path ke file Lottie di folder public
const LOTTIE_JSON_PATH = '/assets/error404.json'; 

const NotFound = () => {
    const [animationData, setAnimationData] = useState<object | null>(null);

    // Ambil data animasi dari folder public saat komponen dimuat
    useEffect(() => {
        fetch(LOTTIE_JSON_PATH)
            .then(response => response.json())
            .then(data => setAnimationData(data))
            .catch(error => console.error("Gagal memuat animasi Lottie 404:", error));
    }, []);

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center text-center">
            <div className="max-w-lg w-full">
                {/* Lottie Animation Container */}
                <div className="w-full h-auto">
                    {animationData && (
                        <Lottie 
                            animationData={animationData} 
                            loop={true}
                        />
                    )}
                </div>

                <h2 className="mt-4 text-3xl font-semibold text-gray-800">Halaman Tidak Ditemukan</h2>
                <p className="mt-2 text-gray-600 text-sm">
                Halaman ini tidak ditemukan atau telah dipindahkan. Periksa kembali URL atau hubungi admin jika perlu bantuan.
                </p>
                <div className="mt-8">
                <button
                    onClick={() => window.location.href = '/'}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
                    >
                    <ArrowLeft size={20} />
                    Kembali ke Halaman Awal
                </button>

                </div>
            </div>
        </div>
    );
};

export default NotFound;
