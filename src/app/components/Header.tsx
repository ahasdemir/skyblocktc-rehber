'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { getSessionId, getBrowserInfo } from '../../lib/sessionUtils';

interface User {
  id: number;
  username: string;
  role: string;
}

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

const Header = ({ user, onLogout }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const adminMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
      if (adminMenuRef.current && !adminMenuRef.current.contains(event.target as Node)) {
        setIsAdminMenuOpen(false);
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
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
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
      // Local storage'ı temizle ve callback'i çağır
      localStorage.removeItem('minecraftAdmin');
      localStorage.removeItem('authToken');
      onLogout();
    }
  };

  return (
    <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-700/50 relative z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand - Modern */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center transform group-hover:scale-105 transition-all duration-300 shadow-lg group-hover:shadow-cyan-500/25">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Minecraft Admin
            </span>
          </Link>

          {/* Navigation - Modern Desktop */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const colorClasses = {
                  green: 'border-green-500/30 text-green-400 hover:text-green-300 hover:bg-green-500/10',
                  pink: 'border-pink-500/30 text-pink-400 hover:text-pink-300 hover:bg-pink-500/10',
                  yellow: 'border-yellow-500/30 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10',
                  red: 'border-red-500/30 text-red-400 hover:text-red-300 hover:bg-red-500/10',
                };

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      relative flex flex-col items-center px-4 py-3 rounded-2xl border backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg group
                      ${isActive 
                        ? `${colorClasses[item.color as keyof typeof colorClasses]} bg-opacity-20 shadow-md border-opacity-60` 
                        : `${colorClasses[item.color as keyof typeof colorClasses]} bg-opacity-0 border-opacity-30`
                      }
                    `}
                  >
                    <div className="flex items-center justify-center w-6 h-6 mb-1">
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

          {/* Right side: Admin + User info */}
          <div className="flex items-center gap-3">
            {/* Admin/Moderator Panel */}
            {user && ['admin', 'moderator', 'assistant', 'helper+'].includes(user.role) && (
              <div className="relative" ref={adminMenuRef}>
                <button
                  onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 hover:from-purple-500/30 hover:to-blue-500/30 border border-purple-500/30 rounded-xl text-purple-400 hover:text-purple-300 transition-all duration-300"
                >
                  <span>⚙️</span>
                  <span className="font-medium hidden sm:block">Admin Panel</span>
                  <span className={`transition-transform duration-200 ${isAdminMenuOpen ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>

                {isAdminMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-gray-800/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl z-50">
                    <div className="p-2">
                      {user.role === 'admin' && (
                        <a
                          href="/admin"
                          className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-xl transition-all duration-200"
                        >
                          <span>👑</span>
                          <span>Admin Paneli</span>
                        </a>
                      )}
                      <a
                        href="/sss-yonetim"
                        className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-xl transition-all duration-200"
                      >
                        <span>📚</span>
                        <span>SSS Yönetimi</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User info */}
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
            
            {/* Mobile menu button */}
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

        {/* Mobile Navigation - Modern */}
        {isMobileMenuOpen && (
          <div ref={menuRef} className="md:hidden mt-4 pb-4 border-t border-gray-700/50 pt-4">
            <div className="grid grid-cols-2 gap-3">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const colorClasses = {
                  green: 'border-green-500/30 text-green-400 bg-green-500/10',
                  pink: 'border-pink-500/30 text-pink-400 bg-pink-500/10',
                  yellow: 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10',
                  red: 'border-red-500/30 text-red-400 bg-red-500/10',
                };

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      flex flex-col items-center py-4 px-3 rounded-2xl border backdrop-blur-sm transition-all duration-300
                      ${isActive 
                        ? `${colorClasses[item.color as keyof typeof colorClasses]} border-opacity-60` 
                        : 'border-gray-600/30 text-gray-400 hover:text-gray-300 hover:bg-gray-700/30'
                      }
                    `}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="flex items-center justify-center w-8 h-8 mb-2">
                      {item.icon}
                    </div>
                    <span className="text-sm font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
