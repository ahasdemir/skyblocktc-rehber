"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from './components/Header';
import AdminLogin from './components/AdminLogin';

interface User {
  id: number;
  username: string;
  role: string;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('minecraftAdmin');
    const token = localStorage.getItem('authToken');
    
    if (saved && token) {
      try {
        const userData = JSON.parse(saved);
        setUser(userData);
      } catch (error) {
        localStorage.removeItem('minecraftAdmin');
        localStorage.removeItem('authToken');
      }
    }
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('minecraftAdmin', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('minecraftAdmin');
    localStorage.removeItem('authToken');
  };

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
    },
    {
      title: 'Sunucu Kuralları',
      description: 'SkyblockTC sunucu kuralları ve yaptırımları hakkında detaylı bilgiler.',
      href: '/kurallar',
      icon: '📜',
      color: 'from-yellow-500 to-red-500'
    }
  ];

  const adminTools = user?.role === 'admin' ? [
    {
      title: 'Admin Panel',
      description: 'Kullanıcı yönetimi ve sistem yönetimi için admin paneli.',
      href: '/admin',
      icon: '👑',
      color: 'from-purple-500 to-pink-500'
    }
  ] : [];

  const allTools = [...tools, ...adminTools];

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white flex flex-col">
        <AdminLogin onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white flex flex-col relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
      
      <Header user={user} onLogout={handleLogout} />
      
      <div className="flex-1 flex flex-col items-center py-16 px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent leading-tight">
            SkyBlockTC
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-300">
            Rehber Yönetim Paneli
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-6"></div>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Gelişmiş araçlar ve otomatik sistemlerle sunucu yönetimini 
            <span className="text-blue-400 font-semibold"> kolaylaştıran</span> ve 
            <span className="text-purple-400 font-semibold"> standartlaştıran</span> modern platform.
          </p>
        </div>

        <div className="flex flex-col items-center gap-8 w-full max-w-7xl mb-16">
          {/* İlk 3 kart üst sırada */}
          <div className="flex flex-wrap justify-center gap-6">
            {allTools.slice(0, 3).map((tool, index) => (
              <Link
                key={tool.title}
                href={tool.href}
                className="group relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-6 shadow-2xl hover:shadow-cyan-500/10 transition-all duration-500 hover:-translate-y-2 hover:scale-105 animate-fade-in-up w-full sm:w-72"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-3xl`}></div>
                
                <div className="relative z-10">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{tool.icon}</div>
                  <h3 className="text-xl font-bold mb-3 text-white group-hover:text-cyan-400 transition-colors duration-300">
                    {tool.title}
                  </h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 leading-relaxed text-sm">
                    {tool.description}
                  </p>
                  
                  <div className="absolute top-4 right-4 text-gray-500 group-hover:text-cyan-400 transition-all duration-300 group-hover:translate-x-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          {/* Geri kalan kartlar alt sırada - ortalanmış */}
          {allTools.length > 3 && (
            <div className="flex flex-wrap justify-center gap-6">
              {allTools.slice(3).map((tool, index) => (
                <Link
                  key={tool.title}
                  href={tool.href}
                  className="group relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-6 shadow-2xl hover:shadow-cyan-500/10 transition-all duration-500 hover:-translate-y-2 hover:scale-105 animate-fade-in-up w-full sm:w-72"
                  style={{ animationDelay: `${(index + 3) * 0.1}s` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-3xl`}></div>
                  
                  <div className="relative z-10">
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{tool.icon}</div>
                    <h3 className="text-xl font-bold mb-3 text-white group-hover:text-cyan-400 transition-colors duration-300">
                      {tool.title}
                    </h3>
                    <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 leading-relaxed text-sm">
                      {tool.description}
                    </p>
                    
                    <div className="absolute top-4 right-4 text-gray-500 group-hover:text-cyan-400 transition-all duration-300 group-hover:translate-x-1">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="text-center max-w-4xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-12 shadow-2xl">
          <div className="text-4xl mb-6">🎯</div>
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Hoş Geldiniz!
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            Bu platform, SkyBlockTC sunucusunun yönetimi için özel olarak geliştirilmiştir.
          </p>
        </div>
      </div>
    </div>
  );
}
