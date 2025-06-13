import Link from 'next/link';
import React, { useState } from 'react';

interface HeaderProps {
  adminName?: string | null;
  onChangeAdmin?: () => void;
  onAdminNameChange?: (name: string) => void;
}

const Header: React.FC<HeaderProps> = ({ adminName, onChangeAdmin, onAdminNameChange }) => {
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState(adminName || '');

  const handleOpen = () => {
    setNewName(adminName || '');
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAdminNameChange && newName.trim()) {
      onAdminNameChange(newName.trim());
      setShowModal(false);
    }
  };

  return (
    <header className="bg-gray-800 shadow-lg border-b border-gray-700 w-full z-20 relative">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-xl font-bold text-white select-none hover:text-green-300 transition-colors flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Ana Sayfa
            </Link>
          </div>

          <div className="flex-1 flex justify-center">
            <div className="flex items-center space-x-4">
              <Link href="/mute" className="text-xl font-bold text-green-400 select-none hover:text-green-300 transition-colors">
                Mute Yardımcısı
              </Link>
              <Link href="/spawner" className="text-xl font-bold text-pink-400 select-none hover:text-pink-300 transition-colors">
                Spawner Bilgileri
              </Link>
              <Link href="/sss" className="text-xl font-bold text-yellow-400 select-none hover:text-yellow-300 transition-colors">
                SSS
              </Link>
            </div>
          </div>

          <div className="flex items-center">
            {adminName && (
              <span className="text-gray-300 flex items-center gap-2">
                Yetkili: <span className="text-green-400 font-semibold">{adminName}</span>
                <button
                  type="button"
                  onClick={handleOpen}
                  className="ml-1 p-1 rounded hover:bg-gray-700 transition-colors"
                  title="İsmini değiştir"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 hover:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.536-6.536a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.94l-4.243 1.415 1.415-4.243a4 4 0 01.94-1.414z" />
                  </svg>
                </button>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-50">
          <form onSubmit={handleSubmit} className="bg-gray-800 rounded-xl shadow-xl p-6 flex flex-col gap-4 min-w-[300px]">
            <h2 className="text-lg font-bold text-green-300 mb-2">Yetkili İsmini Değiştir</h2>
            <input
              type="text"
              className="rounded px-3 py-2 bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="Yeni isminiz"
              autoFocus
              maxLength={32}
            />
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                className="px-3 py-1 rounded bg-gray-700 text-gray-300 hover:bg-gray-600"
                onClick={() => setShowModal(false)}
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 font-semibold"
                disabled={!newName.trim()}
              >
                Onayla
              </button>
            </div>
          </form>
        </div>
      )}
    </header>
  );
};

export default Header; 