import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { getSessionId, getBrowserInfo } from '../../lib/sessionUtils';

interface User {
  id: number;
  username: string;
  role: string;
}

interface HeaderProps {
  user?: User | null;
  onLogout?: () => void;
}

const Header = ({ user, onLogout }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

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
    },
    {
      name: 'Kurallar',
      href: '/kurallar',
      color: 'red',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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
      // Sayfayı yeniden yükle
      window.location.reload();
    }
  };

  return (
    <header className="bg-gradient-to-r from-gray-800/95 to-gray-900/95 backdrop-blur-xl shadow-2xl border-b border-gray-700/50 w-full z-20 relative">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-20 items-center">
          {/* Logo/Home Link - Modern */}
          <div className="flex items-center">
            <Link href="/" className="group flex items-center gap-3 text-white hover:text-cyan-400 transition-all duration-300">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div className="hidden sm:block">
                <div className="font-bold text-xl bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  SkyBlockTC
                </div>
                <div className="text-xs text-gray-400 -mt-1">Ana Sayfa</div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation - Modern Cards */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="flex items-center gap-4">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link 
                    key={item.href}
                    href={item.href} 
                    className={`group relative flex items-center gap-2 px-6 py-3 rounded-2xl transition-all duration-300 backdrop-blur-sm font-medium ${
                      isActive 
                        ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/10' 
                        : 'text-gray-300 hover:bg-gray-700/50 hover:text-white border border-transparent hover:border-gray-600/50'
                    }`}
                  >
                    <div className={`p-2 rounded-xl transition-all duration-300 ${
                      isActive 
                        ? 'bg-cyan-500/20 text-cyan-400' 
                        : 'bg-gray-700/50 text-gray-400 group-hover:bg-gray-600/50 group-hover:text-white'
                    }`}>
                      {item.icon}
                    </div>
                    <span className="text-sm">{item.name}</span>
                    {isActive && (
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"></div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right side: User info - Modern */}
          <div className="flex items-center gap-3">
            {user && (
              <div className="flex items-center gap-3 bg-gray-700/50 backdrop-blur-sm rounded-2xl px-4 py-2 border border-gray-600/50">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block">
                  <div className="text-white font-semibold text-sm">{user.username}</div>
                  <div className="text-green-400 text-xs">{user.role}</div>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-300 transition-all duration-300 border border-red-500/30"
                  title="Çıkış yap"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            )}
            
            {/* Mobile menu button - Modern */}
            <button 
              className="md:hidden p-3 rounded-2xl bg-gray-700/50 backdrop-blur-sm text-gray-300 hover:text-white hover:bg-gray-600/50 focus:outline-none transition-all duration-300 border border-gray-600/50"
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

      {/* Mobile Navigation Menu - Modern */}
      {isMobileMenuOpen && (
        <div 
          ref={menuRef}
          className="md:hidden absolute top-20 inset-x-0 z-20 bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-xl border-t border-gray-700/50 shadow-2xl"
        >
          <div className="px-4 pt-4 pb-4 space-y-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 backdrop-blur-sm ${
                    isActive 
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30' 
                      : 'text-gray-300 hover:bg-gray-700/50 hover:text-white border border-transparent hover:border-gray-600/50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className={`p-2 rounded-xl ${
                    isActive 
                      ? 'bg-cyan-500/20 text-cyan-400' 
                      : 'bg-gray-700/50 text-gray-400'
                  }`}>
                    {item.icon}
                  </div>
                  <span className="font-medium">{item.name}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-cyan-400 rounded-full"></div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;