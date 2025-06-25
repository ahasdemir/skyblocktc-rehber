'use client';

import { useState, useEffect } from 'react';
import { getSessionId, getBrowserInfo } from '../../lib/sessionUtils';

interface User {
  id: number;
  username: string;
  role: string;
  displayName: string;
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
              admin: data.user.displayName,
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
  // Eğer kayıtlı user varsa login formunu gösterme
  if (savedUser) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/40">
      <div className="bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-green-400 mb-4">Yetkili Girişi</h2>
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-200">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
              Kullanıcı Adı
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Kullanıcı adınızı girin"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Şifre
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Şifrenizi girin"
              required
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition duration-200"
          >
            {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
      </div>
    </div>
  );
}