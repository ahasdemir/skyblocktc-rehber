'use client';

import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import AuthGuard from '../components/AuthGuard';
import { getSessionId, getBrowserInfo } from '../../lib/sessionUtils';

interface User {
  id: number;
  username: string;
  role: string;
}

interface SSSQuestion {
  id: number;
  q: string;
  a: string;
  addedBy?: string;
  addedAt?: string;
  role?: string;
}

export default function SSSPage() {
  return (
    <AuthGuard>
      <SSSPageContent />
    </AuthGuard>
  );
}

function SSSPageContent() {
  const [user, setUser] = useState<User | null>(null);
  const [faq, setFaq] = useState<SSSQuestion[]>([]);
  const [recentFaq, setRecentFaq] = useState<SSSQuestion[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showRecent, setShowRecent] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('minecraftAdmin');
    if (saved) {
      try {
        const userData = JSON.parse(saved);
        setUser(userData);
      } catch (error) {
        localStorage.removeItem('minecraftAdmin');
      }
    }
    
    // FAQ verilerini yükle
    loadFAQData();
  }, []);

  const loadFAQData = async () => {
    try {
      // Önce cache'den kontrol et
      const cachedData = localStorage.getItem('sss-cache');
      const cacheTime = localStorage.getItem('sss-cache-time');
      const now = Date.now();
      
      // Cache 5 dakika geçerli
      if (cachedData && cacheTime && (now - parseInt(cacheTime)) < 5 * 60 * 1000) {
        const data = JSON.parse(cachedData);
        setRecentFaq(data.slice(0, 3)); // Son 3 soruyu al
        setFaq(data.reverse());
        setLoading(false);
        return;
      }
      
      // Cache yoksa veya eski ise API'den çek
      const response = await fetch('/api/sss');
      if (response.ok) {
        const data = await response.json();
        const faqData = data.data || [];
        
        setRecentFaq(faqData.slice(0, 3)); // Son 3 soruyu al

        // Cache'e kaydet
        localStorage.setItem('sss-cache', JSON.stringify(faqData));
        localStorage.setItem('sss-cache-time', now.toString());
        
        // Son eklenen en sonda gözüksün diye veriyi ters çevir
        setFaq(faqData.reverse());
      }
    } catch (error) {
      console.error('SSS verileri yüklenirken hata:', error);
      setFaq([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('minecraftAdmin');
    localStorage.removeItem('authToken');
  };

  const filteredFaq = faq.filter(item =>
    item.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.a.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      
      // Log copy action
      const token = localStorage.getItem('authToken');
      if (token && user) {
        const sessionId = getSessionId();
        const browserInfo = getBrowserInfo();
        
        await fetch('/api/log-sss-copy', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            username: user.username,
            role: user.role,
            copiedText: text.substring(0, 50) + (text.length > 50 ? '...' : ''),
            sessionId,
            browserInfo
          })
        });
      }
      
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Kopyalama başarısız:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-gray-300">SSS soruları yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white flex flex-col relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-10 right-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <Header user={user} onLogout={handleLogout} />

      <div className="flex-1 py-8 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-purple-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent leading-tight">
              🎯 Sıkça Sorulan Sorular
            </h1>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-6">
              Buradan soru cevaplarını kopyayıp yapıştır yapabilirsiniz.
            </p>
          </div>

          {/* Son Eklenenler Duyurusu */}
          {recentFaq.length > 0 && (
            <div className="mb-8 bg-gradient-to-r from-blue-900/50 to-purple-900/50 backdrop-blur-lg border border-blue-500/30 rounded-3xl p-6 relative shadow-lg">
              <h2 className="text-lg font-bold text-cyan-300 mb-3 flex items-center gap-2">
                <span className="text-xl">📢</span>
                Yeni Eklenen Sorular
              </h2>
              <ul className="space-y-2 pl-2">
                {recentFaq.map(item => (
                  <li key={`recent-${item.id}`} className="text-sm text-gray-300 hover:text-white transition-colors">
                    <span className="font-semibold">{item.q}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Search */}
          <div className="mb-8">
            <div className="relative max-w-md mx-auto">
              <input
                type="text"
                placeholder="Soru ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 bg-gray-800/80 border border-gray-700/50 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent pl-12"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
                🔍
              </div>
            </div>
          </div>

          {/* FAQ Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredFaq.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <div className="text-6xl mb-4">🤔</div>
                <h3 className="text-2xl font-bold text-gray-400 mb-2">Sonuç bulunamadı</h3>
                <p className="text-gray-500">Arama teriminizi değiştirmeyi deneyin.</p>
              </div>
            ) : (
              filteredFaq.map((item, index) => (
                <div 
                  key={item.id || index}
                  className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 hover:scale-105 hover:border-purple-500/30"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-yellow-400 leading-relaxed pr-4">
                      {item.q}
                    </h3>
                    <button
                      onClick={() => copyToClipboard(item.a, index)}
                      className="flex-shrink-0 p-3 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-xl text-purple-400 hover:text-purple-300 transition-colors group"
                      title="Cevabı kopyala"
                    >
                      {copiedIndex === index ? (
                        <span className="text-green-400">✅</span>
                      ) : (
                        <span className="group-hover:scale-110 transition-transform">📋</span>
                      )}
                    </button>
                  </div>
                  
                  <div className="text-gray-300 leading-relaxed whitespace-pre-line">
                    {item.a}
                  </div>
                  
                  {item.addedBy && item.addedBy !== 'System' && (
                    <div className="mt-4 pt-3 border-t border-gray-700/50">
                      <p className="text-xs text-gray-500">
                        {item.addedBy} ({item.role}) tarafından eklendi
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Admin Panel Link */}
          {user && ['admin', 'moderator'].includes(user.role) && (
            <div className="mt-12 text-center">
              <a
                href="/sss-yonetim"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <span>⚙️</span>
                SSS Yönetimi
                <span>→</span>
              </a>
            </div>
          )}

          {/* Stats */}
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 backdrop-blur-xl border border-blue-500/30 rounded-3xl p-6 inline-block">
              <p className="text-blue-400 font-bold">
                📊 Toplam {faq.length} SSS sorusu mevcut
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
