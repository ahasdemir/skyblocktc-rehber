import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { getSessionId, getBrowserInfo } from '../../lib/sessionUtils';

interface User {
  id: number;
  username: string;
  role: string;
  displayName: string;
}

interface HeaderProps {
  user?: User | null;
  onLogout?: () => void;
  onUserUpdate?: (user: User) => void;
}

const Header = ({ user, onLogout, onUserUpdate }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const handleOpen = () => {
    setNewName(user?.displayName || '');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newName.trim() && user && user.displayName !== newName.trim()) {
      const oldName = user.displayName; // Önceki ismi sakla
      const updatedName = newName.trim();
      
      // Kullanıcı bilgilerini güncelle
      const updatedUser = { ...user, displayName: updatedName };
      onUserUpdate?.(updatedUser);
      setShowModal(false);
      setNewName('');
      
      // Session ID ve tarayıcı bilgilerini al
      const sessionId = getSessionId();
      const browserInfo = getBrowserInfo();
      
      // Discord webhook'una isim değişikliğini logla
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('/api/log-admin-name-change', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            oldName,
            newName: updatedName,
            timestamp: new Date().toISOString(),
            sessionId,
            browserInfo
          }),
        });
        
        if (!response.ok) {
          console.error('İsim değişikliği bildirimi gönderilemedi');
        }
      } catch (error) {
        console.error('İsim değişikliği bildirimi hatası:', error);
      }
    } else {
      // İsim değişmemişse sadece modalı kapat
      setShowModal(false);
      setNewName('');
    }
  };
  
  // Close mobile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Navigation items with their properties
  const navItems = [
    {
      name: 'Mute Yardımcısı',
      href: '/mute',
      color: 'green',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
      )
    },
    {
      name: 'Spawner Bilgileri',
      href: '/spawner',
      color: 'pink',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      )
    },
    {
      name: 'SSS',
      href: '/sss',
      color: 'yellow',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  const handleLogout = async () => {
    try {
      // Session ID ve tarayıcı bilgilerini al
      const sessionId = getSessionId();
      const browserInfo = getBrowserInfo();
      const token = localStorage.getItem('authToken');
      
      // Logout API'sini çağır
      await fetch('/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          sessionId,
          browserInfo
        }),
      });
    } catch (error) {
      console.error('Logout logging error:', error);
    } finally {
      // Her durumda çıkış yap ve token'ı temizle
      localStorage.removeItem('authToken');
      onLogout?.();
    }
  };

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
            <div className="flex items-center space-x-5">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link 
                    key={item.href}
                    href={item.href} 
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200
                      font-medium select-none text-base
                      ${isActive 
                        ? `bg-${item.color}-500/20 text-${item.color}-400 border border-${item.color}-500/30 shadow-sm` 
                        : `text-${item.color}-400 hover:bg-${item.color}-500/10 hover:text-${item.color}-300 hover:shadow`
                      }
                    `}
                  >
                    {item.icon}
                    {item.name}
                    {isActive && (
                      <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-${item.color}-400 hidden`} />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>          {/* Right side: User info on desktop, user + hamburger on mobile */}
          <div className="flex items-center gap-2">
            {/* User section - Adaptive size on mobile */}
            {user && (
              <span className="text-gray-300 flex items-center gap-1 sm:gap-2 mr-2">
                <span className="hidden xs:inline">{user.role}:</span> 
                <span className="text-green-400 font-semibold text-sm sm:text-base truncate max-w-[80px] sm:max-w-none">{user.displayName}</span>
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
                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-1 rounded hover:bg-gray-700 transition-colors ml-1"
                  title="Çıkış yap"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 hover:text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </span>
            )}
            
            {/* Mobile menu button - Only visible on mobile */}
            <button 
              className="md:hidden p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
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
      {isMobileMenuOpen && (
        <div 
          ref={menuRef}
          className="md:hidden absolute top-16 inset-x-0 z-20 bg-gray-800 border-t border-b border-gray-700 shadow-lg"
        >
          <div className="px-2 pt-2 pb-3 space-y-2 sm:px-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200
                    ${isActive 
                      ? `bg-${item.color}-500/20 text-${item.color}-400 border border-${item.color}-500/30` 
                      : `text-${item.color}-400 hover:bg-${item.color}-500/10 hover:text-${item.color}-300`
                    }
                  `}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.icon}
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
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