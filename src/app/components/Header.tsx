import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';

interface HeaderProps {
  adminName?: string | null;
  onChangeAdmin?: () => void;
  onAdminNameChange?: (name: string) => void;
}

const Header: React.FC<HeaderProps> = ({ adminName, onChangeAdmin, onAdminNameChange }) => {
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState(adminName || '');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  // Close mobile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-gray-800 shadow-lg border-b border-gray-700 w-full z-20 relative">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          {/* Logo/Home Link - Visible on all screens */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-white select-none hover:text-green-300 transition-colors flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="hidden sm:inline">Ana Sayfa</span>
            </Link>
          </div>

          {/* Desktop Navigation - Hidden on mobile */}
          <div className="hidden md:flex flex-1 justify-center">
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

          {/* Right side: Admin name on desktop, admin + hamburger on mobile */}
          <div className="flex items-center gap-2">
            {/* Admin section - Adaptive size on mobile */}
            {adminName && (
              <span className="text-gray-300 flex items-center gap-1 sm:gap-2 mr-2">
                <span className="hidden xs:inline">Yetkili:</span> 
                <span className="text-green-400 font-semibold text-sm sm:text-base truncate max-w-[80px] sm:max-w-none">{adminName}</span>
                <button
                  type="button"
                  onClick={handleOpen}
                  className="p-1 rounded hover:bg-gray-700 transition-colors"
                  title="İsmini değiştir"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 hover:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.536-6.536a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.94l-4.243 1.415 1.415-4.243a4 4 0 01.94-1.414z" />
                  </svg>
                </button>
              </span>
            )}
            
            {/* Mobile menu button - Only visible on mobile */}
            <button 
              className="md:hidden p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu - Only visible when open on mobile */}
      {mobileMenuOpen && (
        <div 
          ref={menuRef}
          className="md:hidden absolute top-16 inset-x-0 z-20 bg-gray-800 border-t border-b border-gray-700 shadow-lg"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              href="/mute" 
              className="block px-3 py-2 rounded-md text-base font-medium text-green-400 hover:text-green-300 hover:bg-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Mute Yardımcısı
            </Link>
            <Link 
              href="/spawner" 
              className="block px-3 py-2 rounded-md text-base font-medium text-pink-400 hover:text-pink-300 hover:bg-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Spawner Bilgileri
            </Link>
            <Link 
              href="/sss" 
              className="block px-3 py-2 rounded-md text-base font-medium text-yellow-400 hover:text-yellow-300 hover:bg-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              SSS
            </Link>
          </div>
        </div>
      )}

      {/* Modal - Same for both mobile and desktop */}
      {showModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <form onSubmit={handleSubmit} className="bg-gray-800 rounded-xl shadow-xl p-6 flex flex-col gap-4 w-full max-w-[300px]">
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