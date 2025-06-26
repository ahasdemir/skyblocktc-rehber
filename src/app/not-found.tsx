'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import AuthGuard from './components/AuthGuard';

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-gray-900 text-white flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        {/* 404 Büyük Numara */}
        <div className="relative mb-8">
          <h1 className="text-9xl md:text-[12rem] font-extrabold text-transparent bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text opacity-80 select-none">
            404
          </h1>
          <div className="absolute inset-0 text-9xl md:text-[12rem] font-extrabold text-gray-800/30 blur-sm select-none">
            404
          </div>
        </div>

        {/* Ana Mesaj */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-red-400">
            🚫 Sayfa Bulunamadı
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mb-6">
            Aradığınız sayfa mevcut değil veya kaldırılmış olabilir.
          </p>
          <p className="text-base text-gray-400">
            Belki yanlış bir bağlantıya tıkladınız veya URL'yi yanlış yazdınız?
          </p>
        </div>

        {/* Butonlar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Link 
            href="/" 
            className="group relative px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <span className="relative z-10 flex items-center gap-2">
              🏠 Ana Sayfaya Dön
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 opacity-0 group-hover:opacity-20 rounded-lg transition-opacity duration-300"></div>
          </Link>
          
          <button 
            onClick={() => window.history.back()} 
            className="group relative px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <span className="relative z-10 flex items-center gap-2">
              ⬅️ Geri Git
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-500 opacity-0 group-hover:opacity-20 rounded-lg transition-opacity duration-300"></div>
          </button>
        </div>

        {/* Yardımcı Bağlantılar */}
        <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm border border-gray-700/50">
          <h3 className="text-lg font-semibold text-blue-300 mb-4">
            📋 Popüler Sayfalar
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link 
              href="/mute" 
              className="text-green-400 hover:text-green-300 transition-colors p-2 rounded hover:bg-gray-700/50 flex items-center gap-2"
            >
              🔇 Mute Yardımcısı
            </Link>
            <Link 
              href="/spawner" 
              className="text-purple-400 hover:text-purple-300 transition-colors p-2 rounded hover:bg-gray-700/50 flex items-center gap-2"
            >
              🐷 Spawner Bilgileri
            </Link>
            <Link 
              href="/sss" 
              className="text-yellow-400 hover:text-yellow-300 transition-colors p-2 rounded hover:bg-gray-700/50 flex items-center gap-2"
            >
              📝 SSS
            </Link>
            <Link 
              href="/admin" 
              className="text-red-400 hover:text-red-300 transition-colors p-2 rounded hover:bg-gray-700/50 flex items-center gap-2"
            >
              👑 Admin Panel
            </Link>
          </div>
        </div>

        {/* Alt Bilgi */}
        <div className="mt-8 text-sm text-gray-500">
          <p>SkyBlockTC Rehber Paneli</p>
          <p className="mt-1">Bir sorun olduğunu düşünüyorsanız, lütfen yöneticilere bildirin.</p>
        </div>
      </div>

      {/* Arka Plan Animasyon Efekti */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
    </div>
    </AuthGuard>
  );
}
