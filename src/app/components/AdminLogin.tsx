'use client';

import { useState, useEffect } from 'react';
import { getSessionId, getBrowserInfo } from '../../lib/sessionUtils';
import SignupComponent from './SignupComponent';

interface User {
  id: number;
  username: string;
  role: string;
}

interface AdminLoginProps {
  onLogin: (user: User) => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [savedUser, setSavedUser] = useState<User | null>(null);
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('minecraftAdmin');
    const token = localStorage.getItem('authToken');
    
    if (saved && token) {
      try {
        const user = JSON.parse(saved);
        setSavedUser(user);
        onLogin(user);
      } catch (error) {
        localStorage.removeItem('minecraftAdmin');
        localStorage.removeItem('authToken');
      }
    }
  }, [onLogin]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim()
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Giriş başarısız');
        return;
      }

      if (data.success && data.user && data.token) {
        // Store user info and token in localStorage
        localStorage.setItem('minecraftAdmin', JSON.stringify(data.user));
        localStorage.setItem('authToken', data.token);
        
        // Update savedUser state to close the popup immediately
        setSavedUser(data.user);
        
        // Call onLogin prop function
        onLogin(data.user);
        
        // Session ID ve tarayıcı bilgilerini al
        const sessionId = getSessionId();
        const browserInfo = getBrowserInfo();
        
        // Log admin login to Discord webhook
        try {
          const logResponse = await fetch('/api/log-admin-login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              admin: data.user.username,
              username: data.user.username,
              role: data.user.role,
              timestamp: new Date().toISOString(),
              sessionId,
              browserInfo
            }),
          });
          
          if (!logResponse.ok) {
            console.error('Admin giriş bildirimi gönderilemedi');
          }
        } catch (error) {
          console.error('Admin giriş bildirimi hatası:', error);
        }
        
        // Clear the form
        setUsername('');
        setPassword('');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Bağlantı hatası. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };
  // If saved user exists, don't show login form
  if (savedUser) return null;

  // Show signup form if requested
  if (showSignup) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/60">
        <div className="bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-md border border-gray-700/50 animate-fade-in-up">
          <SignupComponent 
            onBackToLogin={() => setShowSignup(false)} 
            onSignupSuccess={(user) => {
              setSavedUser(user);
              setShowSignup(false);
              onLogin(user);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/60">
      <div className="bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-md border border-gray-700/50 animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
            👑
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Yetkili Girişi
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-green-500 to-blue-500 mx-auto mt-2"></div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-2xl text-red-200 text-center backdrop-blur-sm">
            <div className="flex items-center justify-center gap-2">
              <span className="text-red-400">⚠️</span>
              {error}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-semibold text-gray-300">
              Kullanıcı Adı
            </label>
            <div className="relative">
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700/50 backdrop-blur-sm rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 border border-gray-600/50 transition-all duration-300"
                placeholder="Kullanıcı adınızı girin"
                required
                disabled={isLoading}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                👤
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-300">
              Şifre
            </label>
            <div className="relative">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700/50 backdrop-blur-sm rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 border border-gray-600/50 transition-all duration-300"
                placeholder="Şifrenizi girin"
                required
                disabled={isLoading}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                🔐
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 px-6 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-green-500/25 hover:scale-105 active:scale-95"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Giriş yapılıyor...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <span>🚀</span>
                Giriş Yap
              </div>
            )}
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-gray-700/50">
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-4">
              <span className="text-blue-400">💡</span> Yeni rehber misiniz? Hesap oluşturun, burası rehberler için özel bir alandır.
            </p>
            <p className="text-xs text-gray-500 mb-4">
              Oyundaki isminiz ile kaydolun!
            </p>
            <button
              onClick={() => setShowSignup(true)}
              className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-blue-500/25 hover:scale-105 active:scale-95"
              disabled={isLoading}
            >
              <div className="flex items-center justify-center gap-2">
                <span>✨</span>
                Rehber Olarak Kayıt Ol
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}