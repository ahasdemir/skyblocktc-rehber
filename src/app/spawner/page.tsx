'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AuthGuard from '../components/AuthGuard';
import Header from '../components/Header';

interface User {
  id: number;
  username: string;
  role: string;
}

interface SpawnerData {
  name: string;
  where: string;
  drops: string;
}

const spawnerData: SpawnerData[] = [
  {
    name: 'Golem Spawner',
    where: 'Işıklı ortam, Konumu fark etmez',
    drops: 'Gül ve Demir düşer',
  },
  {
    name: 'Guardiyan Spawner',
    where: 'Karanlık ortamda çalışır (karanlık ve suda verimi artar)',
    drops: 'Morina, Prizmarin parçacığı, ve prizmarin kristali düşer',
  },
  {
    name: 'Örümcek Spawner',
    where: 'Karanlık ortam ve konulduğu blok fark etmez',
    drops: 'İp ve Örümcek gözü düşer',
  },
  {
    name: 'Cadı Spawner',
    where: 'Karanlık ortam ve konulduğu blok fark etmez',
    drops: 'Cam şişe, ışık tozu, şeker, çubuk ve kızıltaş düşer',
  },
  {
    name: 'Blaze Spawner',
    where: 'Karanlık ortam ve konulduğu blok fark etmez',
    drops: 'Blaze Çubuğu Düşer',
  },
  {
    name: 'İskelet Spawner',
    where: 'Karanlık ortam ve konulduğu blok fark etmez',
    drops: 'Ok ve Kemik Düşer',
  },
  {
    name: 'Zombified Piglin Spawner',
    where: 'Karanlık ortam ve konulduğu blok fark etmez',
    drops: 'Altın parçacığı ve havuç düşer',
  },
  {
    name: 'Zombie Spawner',
    where: 'Karanlık ortam ve konulduğu blok fark etmez',
    drops: 'Çürük et (istisna demir, patates vb. ürünler düşer)',
  },
  {
    name: 'Squid Spawner',
    where: 'Karanlık ortamda çalışır (karanlık ve suda verimi artar), 60. katmanın altında çalışır',
    drops: 'Mürekkep kesesi düşer',
  },
  {
    name: 'Chiken Spawner',
    where: 'Işıklı ortamda ve çim bloğunda çalışır',
    drops: 'Tavuk eti ve tüy düşer',
  },
  {
    name: 'İnek Spawner',
    where: 'Işıklı ortamda ve çim bloğunda çalışır',
    drops: 'Deri ve İnek eti düşer',
  },
  {
    name: 'Koyun Spawner',
    where: 'Işıklı ortamda ve çim bloğunda çalışır',
    drops: 'Yün (renkli yünler dahil) ve koyun eti düşer',
  },
  {
    name: 'Domuz Spawner',
    where: 'Işıklı ortamda ve çim bloğunda çalışır',
    drops: 'Domuz eti düşer',
  },
  {
    name: 'Tavşan Spawner',
    where: 'Işıklı ortamda ve çim bloğunda çalışır',
    drops: 'Tavşan ayağı, Tavşan eti ve Tavşan postu düşer',
  },
  {
    name: 'Ghast Spawner',
    where: 'Karanlık ortam ve konulduğu blok fark etmez',
    drops: 'Işık tozu düşer',
  },
];

export default function SpawnerPage() {
  return (
    <AuthGuard>
      <SpawnerPageContent />
    </AuthGuard>
  );
}

function SpawnerPageContent() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('minecraftAdmin');
    if (saved) {
      try {
        const userData = JSON.parse(saved);
        setUser(userData);
      } catch (error) {
        localStorage.removeItem('minecraftAdmin');
      }
    }
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('minecraftAdmin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-green-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <Header 
        user={user}
        onLogout={handleLogout}
      />
      
      <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        {/* Hero Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-4 mb-4">
            <div className="text-6xl">🐷</div>
            <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-green-400 bg-clip-text text-transparent">
              Spawner Rehberi
            </h1>
          </div>
          <div className="w-32 h-1 bg-gradient-to-r from-purple-500 to-green-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Tüm spawner türleri ve çalışma koşulları hakkında detaylı bilgiler
          </p>
        </div>
        
        
        {/* Modern Spawner Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {spawnerData.map((spawner, index) => (
            <div 
              key={spawner.name} 
              className="group bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-6 shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 hover:-translate-y-2 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center text-2xl">
                  {spawner.name.includes('Golem') ? '🤖' :
                   spawner.name.includes('Guardiyan') ? '🐟' :
                   spawner.name.includes('Örümcek') ? '🕷️' :
                   spawner.name.includes('Cadı') ? '🧙‍♀️' :
                   spawner.name.includes('Blaze') ? '🔥' :
                   spawner.name.includes('İskelet') ? '💀' :
                   spawner.name.includes('Piglin') ? '🐷' :
                   spawner.name.includes('Zombie') ? '🧟' :
                   spawner.name.includes('Squid') ? '🐙' :
                   spawner.name.includes('Chiken') ? '🐔' :
                   spawner.name.includes('İnek') ? '🐄' :
                   spawner.name.includes('Koyun') ? '🐑' :
                   spawner.name.includes('Domuz') ? '🐖' :
                   spawner.name.includes('Tavşan') ? '🐰' :
                   spawner.name.includes('Ghast') ? '👻' : '⚡'}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
                    {spawner.name}
                  </h3>
                </div>
              </div>
              
              {/* Content */}
              <div className="space-y-4">
                <div className="bg-gray-900/50 rounded-2xl p-4 border border-gray-700/30">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    <span className="text-sm font-semibold text-green-400">Çalışma Koşulları</span>
                  </div>
                  <p className="text-gray-200 text-sm leading-relaxed">{spawner.where}</p>
                </div>
                
                <div className="bg-gray-900/50 rounded-2xl p-4 border border-gray-700/30">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                    <span className="text-sm font-semibold text-yellow-400">Düşen Eşyalar</span>
                  </div>
                  <p className="text-gray-200 text-sm leading-relaxed">{spawner.drops}</p>
                </div>
              </div>
              
              {/* Hover Effect Indicator */}
              <div className="absolute top-4 right-4 text-gray-500 group-hover:text-purple-400 transition-all duration-300 group-hover:scale-110">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          ))}
        </div>
        
        {/* Info Section */}
        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-2xl text-center">
          <div className="text-4xl mb-4">💡</div>
          <h2 className="text-2xl font-bold text-white mb-4">Spawner İpuçları</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="bg-gray-900/50 rounded-2xl p-4">
              <div className="text-green-400 font-semibold mb-2">🌞 Işıklı Ortam</div>
              <p className="text-gray-300 text-sm">Hayvancılık spawnerları için gerekli. İyi aydınlatma sağlayın.</p>
            </div>
            <div className="bg-gray-900/50 rounded-2xl p-4">
              <div className="text-red-400 font-semibold mb-2">🌙 Karanlık Ortam</div>
              <p className="text-gray-300 text-sm">Canavar spawnerları için gerekli. Işık seviyesini düşük tutun.</p>
            </div>
            <div className="bg-gray-900/50 rounded-2xl p-4">
              <div className="text-blue-400 font-semibold mb-2">💧 Su Ortamı</div>
              <p className="text-gray-300 text-sm">Deniz canlıları için su içinde konumlandırın.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 