'use client';

import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import AuthGuard from '../components/AuthGuard';

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

export default function SSSYonetimPage() {
  const [user, setUser] = useState<User | null>(null);
  const [questions, setQuestions] = useState<SSSQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    question: '',
    answer: ''
  });
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  React.useEffect(() => {
    const saved = localStorage.getItem('minecraftAdmin');
    const token = localStorage.getItem('authToken');
    
    if (saved && token) {
      try {
        const userData = JSON.parse(saved);
        setUser(userData);
        
        // Yetki kontrolü
        if (!['admin', 'moderator', 'assistant', 'helper+'].includes(userData.role)) {
          setMessage({
            type: 'error',
            text: 'Bu sayfaya erişim yetkiniz yok. Helper+ ve üstü roller gereklidir.'
          });
          return;
        }
        
        loadQuestions(token);
      } catch (error) {
        localStorage.removeItem('minecraftAdmin');
        localStorage.removeItem('authToken');
      }
    }
  }, []);

  const loadQuestions = async (token: string) => {
    try {
      const response = await fetch('/api/sss', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setQuestions(data.data || []);
      }
    } catch (error) {
      console.error('SSS soruları yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('minecraftAdmin');
    localStorage.removeItem('authToken');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.question.trim() || !formData.answer.trim()) {
      setMessage({
        type: 'error',
        text: 'Soru ve cevap alanları zorunludur'
      });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/sss', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          question: formData.question,
          answer: formData.answer
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: 'success',
          text: 'SSS sorusu başarıyla eklendi!'
        });
        setFormData({ question: '', answer: '' });
        
        // Soruları yeniden yükle
        if (token) {
          loadQuestions(token);
        }
      } else {
        setMessage({
          type: 'error',
          text: data.error || 'Soru eklenirken bir hata oluştu'
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Bir hata oluştu. Lütfen tekrar deneyin.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (questionId: number) => {
    if (!confirm('Bu soruyu silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/sss?id=${questionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: 'success',
          text: 'SSS sorusu başarıyla silindi!'
        });
        
        // Soruları yeniden yükle
        if (token) {
          loadQuestions(token);
        }
      } else {
        setMessage({
          type: 'error',
          text: data.error || 'Soru silinirken bir hata oluştu'
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Bir hata oluştu. Lütfen tekrar deneyin.'
      });
    }
  };

  if (!user || !['admin', 'moderator', 'assistant', 'helper+'].includes(user.role)) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-red-400 mb-4">❌ Erişim Reddedildi</h1>
            <p className="text-gray-300">Bu sayfaya erişim yetkiniz yok. Helper+ ve üstü roller gereklidir.</p>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
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
                📚 SSS Yönetimi
              </h1>
              <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                Sıkça sorulan sorular ekleyin ve yönetin
              </p>
            </div>

            {/* Yetki Bilgisi */}
            <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 backdrop-blur-xl border border-blue-500/30 rounded-3xl p-6 mb-8">
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {user.role === 'admin' ? '👑' : 
                   user.role === 'moderator' ? '🛡️' :
                   user.role === 'assistant' ? '🎯' : '⭐'}
                </span>
                <div>
                  <h3 className="text-xl font-bold text-blue-400">
                    {user.role === 'admin' ? 'Admin Yetkisi' : 
                     user.role === 'moderator' ? 'Moderatör Yetkisi' :
                     user.role === 'assistant' ? 'Assistant Yetkisi' : 'Helper+ Yetkisi'}
                  </h3>
                  <p className="text-gray-300">
                    {['admin', 'moderator', 'assistant'].includes(user.role)
                      ? 'SSS sorusu ekleyebilir ve silebilirsiniz' 
                      : 'SSS sorusu ekleyebilirsiniz.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Mesaj */}
            {message && (
              <div className={`p-4 rounded-2xl mb-6 ${
                message.type === 'success' 
                  ? 'bg-green-900/20 border border-green-500/30 text-green-300' 
                  : 'bg-red-900/20 border border-red-500/30 text-red-300'
              }`}>
                <div className="flex items-center gap-2">
                  <span>{message.type === 'success' ? '✅' : '❌'}</span>
                  <span>{message.text}</span>
                </div>
              </div>
            )}

            {/* Form */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Soru Ekleme Formu */}
              <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-2xl">
                <h2 className="text-2xl font-bold text-purple-400 mb-6 flex items-center gap-2">
                  <span>➕</span> Yeni SSS Sorusu Ekle
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Soru *
                    </label>
                    <input
                      type="text"
                      value={formData.question}
                      onChange={(e) => setFormData({...formData, question: e.target.value})}
                      placeholder="Örn: Jeneratör nasıl çalışır?"
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Cevap *
                    </label>
                    <textarea
                      value={formData.answer}
                      onChange={(e) => setFormData({...formData, answer: e.target.value})}
                      placeholder="Detaylı cevap yazın..."
                      rows={6}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                      required
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 disabled:scale-100 shadow-lg"
                  >
                    {submitting ? '⏳ Ekleniyor...' : '✅ Soruyu Ekle'}
                  </button>
                </form>
              </div>

              {/* Mevcut Sorular */}
              <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-2xl">
                <h2 className="text-2xl font-bold text-blue-400 mb-6 flex items-center gap-2">
                  <span>📋</span> Mevcut SSS Soruları ({questions.length})
                </h2>
                
                {loading ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">⏳</div>
                    <p className="text-gray-400">Sorular yükleniyor...</p>
                  </div>
                ) : questions.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">📝</div>
                    <p className="text-gray-400">Henüz SSS sorusu eklenmemiş</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {questions.map((q, index) => (
                      <div key={q.id || index} className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/30">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <h3 className="font-bold text-yellow-400 mb-2">
                              {q.q}
                            </h3>
                            <p className="text-gray-300 text-sm line-clamp-3">
                              {q.a}
                            </p>
                            {q.addedBy && (
                              <div className="mt-2 text-xs text-gray-500">
                                {q.addedBy} ({q.role}) tarafından eklendi
                              </div>
                            )}
                          </div>
                          
                          {['admin', 'moderator', 'assistant'].includes(user.role) && q.id && (
                            <button
                              onClick={() => handleDelete(q.id)}
                              className="flex-shrink-0 p-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400 hover:text-red-300 transition-colors"
                              title="Soruyu Sil"
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
