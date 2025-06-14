'use client';

import { useState, useEffect } from 'react';
import { getSessionId, getBrowserInfo } from '../../lib/sessionUtils';

interface AdminLoginProps {
  onLogin: (name: string) => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [adminName, setAdminName] = useState('');
  const [savedAdmin, setSavedAdmin] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('minecraftAdmin');
    setSavedAdmin(saved);
    if (saved) onLogin(saved);
  }, [onLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (adminName.trim()) {
      // Set admin name in local storage
      localStorage.setItem('minecraftAdmin', adminName);
      
      // Update savedAdmin state to close the popup immediately
      setSavedAdmin(adminName);
      
      // Call onLogin prop function
      onLogin(adminName);
      
      // Session ID ve tarayıcı bilgilerini al
      const sessionId = getSessionId();
      const browserInfo = getBrowserInfo();
      
      // Log admin login to Discord webhook
      try {
        const response = await fetch('/api/log-admin-login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            admin: adminName,
            timestamp: new Date().toISOString(),
            sessionId,
            browserInfo
          }),
        });
        
        if (!response.ok) {
          console.error('Admin giriş bildirimi gönderilemedi');
        }
      } catch (error) {
        console.error('Admin giriş bildirimi hatası:', error);
      }
      
      // Clear the form
      setAdminName('');
    }
  };

  // Eğer kayıtlı admin varsa login formunu gösterme
  if (savedAdmin) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/40">
      <div className="bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-green-400 mb-4">Yetkili Girişi</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="adminName" className="block text-sm font-medium text-gray-300 mb-1">
              Yetkili İsmi
            </label>
            <input
              type="text"
              id="adminName"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Minecraft yetkili isminizi girin"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition duration-200"
          >
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
}