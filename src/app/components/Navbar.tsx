'use client';

import { useState } from 'react';

interface SpawnerData {
  name: string;
  where: string;
  drops: string;
}

interface NavbarProps {
  adminName: string | null;
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

const Navbar: React.FC<NavbarProps> = ({ adminName }) => {
  const [isSpawnerOpen, setIsSpawnerOpen] = useState(false);

  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold text-green-400">SkyblockTC Rehber Yardımcısı</span>
          </div>

          <div className="flex items-center space-x-4">
            {adminName && (
              <span className="text-gray-300">
                Yetkili: <span className="text-green-400 font-semibold">{adminName}</span>
              </span>
            )}
            <button
              onClick={() => setIsSpawnerOpen(!isSpawnerOpen)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Spawner Bilgileri
            </button>
          </div>
        </div>
      </div>

      {/* Spawner Bilgileri Modal */}
      {isSpawnerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-purple-300">Spawner Bilgileri</h2>
              <button
                onClick={() => setIsSpawnerOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
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
      )}
    </nav>
  );
};

export default Navbar; 