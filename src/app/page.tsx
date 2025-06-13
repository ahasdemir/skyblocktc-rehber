"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Header from './components/Header';
import AdminLogin from './components/AdminLogin';

export default function Home() {
  const [adminName, setAdminName] = useState<string | null>(null);

  const tools = [
    {
      title: 'Mute Yardımcısı',
      description: 'Sunucu yönetimi için susturma kuralları ve komut hazırlayıcı.',
      href: '/mute',
      icon: '🔇',
      color: 'from-red-500 to-orange-500'
    },
    {
      title: 'Spawner Bilgileri',
      description: 'Spawner türleri ve özellikleri hakkında detaylı bilgiler.',
      href: '/spawner',
      icon: '🐷',
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Oyuncular Tarafından Sıkça Sorulan Sorular',
      description: 'Oyuncuların genelde sorduğu soruların cevaplarını buradan kopyala yapıştır yapabilirsiniz.',
      href: '/sss',
      icon: '📝',
      color: 'from-blue-500 to-cyan-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-gray-900 text-white flex flex-col">
      <Header
        adminName={adminName}
        onChangeAdmin={() => { setAdminName(null); localStorage.removeItem('minecraftAdmin'); }}
        onAdminNameChange={name => { setAdminName(name); localStorage.setItem('minecraftAdmin', name); }}
      />
      <AdminLogin onLogin={setAdminName} />
      
      <div className="flex-1 flex flex-col items-center py-10 px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-2 text-center bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent drop-shadow-lg">
          SkyBlockTC Admin Paneli
        </h1>
        <p className="text-lg text-gray-300 mb-12 text-center max-w-2xl">
          Sunucu yönetimi için gerekli tüm araçlar ve bilgiler burada.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          {tools.map((tool) => (
            <Link
              key={tool.title}
              href={tool.href}
              className="group relative bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl" style={{ backgroundImage: `linear-gradient(to bottom right, ${tool.color})` }} />
              <div className="relative">
                <div className="text-4xl mb-4">{tool.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-white group-hover:text-blue-400 transition-colors">
                  {tool.title}
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                  {tool.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4 text-blue-300">Hoş Geldiniz!</h2>
          <p className="text-gray-300 max-w-2xl">
            Bu panel, SkyBlockTC sunucusunun yönetimi için özel olarak tasarlanmıştır.
            Yetkili işlemlerinizi kolaylaştırmak ve standartlaştırmak için gerekli tüm araçlar burada bulunmaktadır.
          </p>
        </div>
      </div>
    </div>
  );
} 