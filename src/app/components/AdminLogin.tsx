'use client';

import { useState, useEffect } from 'react';

interface AdminLoginProps {
  onLogin: (adminName: string) => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [adminName, setAdminName] = useState('');
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    // Sayfa yüklendiğinde localStorage'dan yetkili ismini kontrol et
    const savedAdmin = localStorage.getItem('minecraftAdmin');
    if (savedAdmin) {
      onLogin(savedAdmin);
      setIsOpen(false);
    }
  }, [onLogin]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminName.trim()) {
      localStorage.setItem('minecraftAdmin', adminName.trim());
      onLogin(adminName.trim());
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin; 