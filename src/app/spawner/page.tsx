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
    <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-gray-900 text-white">
      <Header 
        user={user}
        onLogout={handleLogout}
      />
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-gray-800 rounded-xl shadow-xl p-6">
          <h1 className="text-3xl font-bold text-purple-300 mb-6">Spawner Bilgileri</h1>
          
          <div className="bg-gray-900 rounded-xl overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="text-gray-300 border-b border-gray-700">
                  <th className="py-3 px-4">Spawner İsmi</th>
                  <th className="py-3 px-4">Nerede Çalışır?</th>
                  <th className="py-3 px-4">Düşen Eşyalar</th>
                </tr>
              </thead>
              <tbody>
                {spawnerData.map((row, i) => (
                  <tr key={row.name} className={i % 2 === 0 ? 'bg-gray-900' : 'bg-gray-800'}>
                    <td className="py-2 px-4 font-semibold text-green-200">{row.name}</td>
                    <td className="py-2 px-4 text-gray-200">{row.where}</td>
                    <td className="py-2 px-4 text-gray-200">{row.drops}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 