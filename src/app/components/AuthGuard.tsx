'use client';

import { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin';

interface User {
  id: number;
  username: string;
  role: string;
}

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: string; // Opsiyonel: belirli rol gerektiren sayfalar için
}

export default function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
    setIsLoading(false);
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('minecraftAdmin', JSON.stringify(userData));
    // Token is already set in AdminLogin component
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-400 mx-auto mb-4"></div>
          <p className="text-lg text-gray-300">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-gray-900 text-white flex flex-col">
        <AdminLogin onLogin={handleLogin} />
      </div>
    );
  }

  // Role check (if required)
  if (requiredRole && user.role !== requiredRole && user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-gray-900 text-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-red-400 mb-4">Erişim Engellendi</h1>
          <p className="text-gray-300 mb-6">
            Bu sayfaya erişmek için <span className="text-yellow-400 font-semibold">{requiredRole}</span> yetkisine sahip olmanız gerekiyor.
          </p>
          <p className="text-sm text-gray-400">
            Mevcut yetkiniz: <span className="text-blue-400">{user.role}</span>
          </p>
          <button
            onClick={() => {
              localStorage.removeItem('minecraftAdmin');
              localStorage.removeItem('authToken');
              window.location.reload();
            }}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Farklı Hesapla Giriş Yap
          </button>
        </div>
      </div>
    );
  }

  // Authenticated and authorized
  return <>{children}</>;
}
