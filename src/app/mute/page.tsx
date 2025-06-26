"use client";
import React, { useState, useEffect, useRef } from 'react'; // useRef ve useEffect ekledim
import AuthGuard from '../components/AuthGuard';
import Header from '../components/Header';
import oyuncuListesi from '../../../oyuncular.json'; // Oyuncular listesini import et
import { getSessionId, getBrowserInfo } from '../../lib/sessionUtils';

interface User {
  id: number;
  username: string;
  role: string;
}

const muteRules = [
  {
    title: 'Mute Nedir?',
    content: 'Mute oyun içinde yapılan kural ihlallerine karşı verilen susturma cezasıdır.'
  },
  {
    title: 'Mute Nasıl Atılır?',
    content: 'Komut: /mute <kullanıcı> <süre> <sebep> şeklinde yazarak atabilirsiniz.'
  },
  {
    title: 'Susturma Sürelerinin Anlamları',
    content: (
      <ul className="list-disc list-inside ml-2">
        <li>Saniye = s</li>
        <li>Dakika = m</li>
        <li>Saat = h</li>
        <li>Gün = d</li>
      </ul>
    )
  },
];

const muteLevels = [
  {
    level: '1. Seviye',
    rules: [
      { reason: 'Chat Kirletimi', min: 10, max: 60, unit: 'm' },
      { reason: 'Cinsellik', min: 30, max: 60, unit: 'm' },
      { reason: 'Argo Kelime Kullanımı', min: 30, max: 60, unit: 'm' },
      { reason: 'Amacı Dışında AdaReklam Kullanımı', min: 30, max: 60, unit: 'm' },
      { reason: 'Argo Kelime Benzetmeleri', min: 30, max: 60, unit: 'm' },
      { reason: 'Chati Amacı Dışında Kullanma', min: 30, max: 60, unit: 'm' },
    ]
  },
  {
    level: '2. Seviye',
    rules: [
      { reason: 'Hakaret', min: 3, max: 3, unit: 'h' },
      { reason: 'Küfür Kullanımı', min: 3, max: 3, unit: 'h' },
      { reason: 'Tartışma', min: 3, max: 3, unit: 'h' },
      { reason: 'Kışkırtma', min: 3, max: 3, unit: 'h' },
      { reason: 'Yetkilileri Rahatsız Etmek', min: 3, max: 3, unit: 'h' },
      { reason: 'Sohbete Ada Reklamını Mesaj Olarak Atmak', min: 3, max: 3, unit: 'h' },
    ]
  },
  {
    level: '3. Seviye',
    rules: [
      { reason: 'Din ve Siyaset Yapmak', min: 6, max: 12, unit: 'h' },
      { reason: 'Link Paylaşımı', min: 12, max: 12, unit: 'h' },
      { reason: 'Reklam', min: 12, max: 12, unit: 'h' },
      { reason: 'Ailevi Küfür Kullanımı', min: 12, max: 12, unit: 'h' },
      { reason: 'Yetkiliye Özelden Hakaret', min: 12, max: 12, unit: 'h' },
    ]
  },
];

const allReasons = muteLevels.flatMap(l => l.rules.map(r => ({ ...r, level: l.level })));

export default function MuteHelper() {
  return (
    <AuthGuard>
      <MuteHelperContent />
    </AuthGuard>
  );
}

function MuteHelperContent() {
  // User state
  const [user, setUser] = useState<User | null>(null);

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
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('minecraftAdmin');
  };

  // Mute helper state
  const [muteUser, setMuteUser] = useState('');
  const [reason, setReason] = useState('');
  const [duration, setDuration] = useState('');
  const [copied, setCopied] = useState(false);
  const [applied, setApplied] = useState(false);
  
  // Otomatik tamamlama için state
  const [filteredPlayers, setFilteredPlayers] = useState<string[]>([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const autocompleteRef = useRef<HTMLDivElement>(null);

  // Find selected reason info
  const selectedReason = allReasons.find(r => r.reason === reason);
  const min = selectedReason ? selectedReason.min : undefined;
  const max = selectedReason ? selectedReason.max : undefined;
  const unit = selectedReason ? selectedReason.unit : '';

  // Duration input restrictions
  let durationValue = duration;
  let durationNum = parseInt(durationValue);
  const safeMin = typeof min === 'number' ? min : 0;
  const safeMax = typeof max === 'number' ? max : 0;
  if (selectedReason && !isNaN(durationNum)) {
    if (durationNum < safeMin) durationNum = safeMin;
    if (durationNum > safeMax) durationNum = safeMax;
    durationValue = durationNum.toString();
  }
  if (duration === '') durationValue = '';

  // Command preview
  const muteCommand = muteUser && reason && (safeMin === safeMax ? true : durationValue) ? `/mute ${muteUser} ${safeMin === safeMax ? safeMin : durationValue}${unit} ${reason}` : '';

  // Kullanıcı adı otomatik tamamlama mantığı
  const handleUserInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMuteUser(value);
    
    if (value.length > 0) {
      // Kullanıcının yazdığı metni içeren oyuncuları filtrele
      const filtered = oyuncuListesi.filter(name => 
        name.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 7); // En fazla 7 öneri göster
      
      setFilteredPlayers(filtered);
      setShowAutocomplete(true);
    } else {
      setFilteredPlayers([]);
      setShowAutocomplete(false);
    }
  };

  // Dışarı tıklandığında dropdown'ı kapat
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target as Node)) {
        setShowAutocomplete(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white flex flex-col relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-red-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <Header
        user={user}
        onLogout={handleLogout}
      />
      
      <main className="flex-1 flex flex-col items-center py-12 px-4 relative z-10">
        {/* Hero Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-4 mb-4">
            <div className="text-6xl">🔇</div>
            <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
              Mute Yardımcısı
            </h1>
          </div>
          <div className="w-32 h-1 bg-gradient-to-r from-red-500 to-orange-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Gelişmiş susturma sistemi ile hızlı ve etkili yönetim
          </p>
        </div>

        {/* Mute Command Helper - Modern Card */}
        <section className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-2xl w-full max-w-5xl mb-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-2xl">
              ⚡
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Hızlı Mute Komutu</h3>
              <p className="text-gray-400">Otomatik komut oluşturucu</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-blue-400" htmlFor="mute-user">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                Kullanıcı Adı
              </label>
              <div className="relative">
                <input
                  id="mute-user"
                  className="w-full h-12 rounded-2xl px-4 py-3 bg-gray-700/50 backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600/50 transition-all duration-300"
                  placeholder="Oyuncu ismini yazın..."
                  value={muteUser}
                  onChange={handleUserInputChange}
                  onFocus={() => muteUser.length > 0 && setShowAutocomplete(true)}
                />
                {/* Autocomplete dropdown - Modern */}
                {showAutocomplete && filteredPlayers.length > 0 && (
                  <div 
                    ref={autocompleteRef}
                    className="absolute z-20 mt-2 w-full bg-gray-800/95 backdrop-blur-xl border border-gray-600/50 rounded-2xl shadow-2xl max-h-60 overflow-auto"
                  >
                    {filteredPlayers.map((playerName) => (
                      <div
                        key={playerName}
                        className="px-4 py-3 hover:bg-gray-700/80 cursor-pointer text-white transition-colors first:rounded-t-2xl last:rounded-b-2xl border-b border-gray-700/30 last:border-b-0"
                        onClick={() => {
                          setMuteUser(playerName);
                          setShowAutocomplete(false);
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          {playerName}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-green-400" htmlFor="mute-reason">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                Suç
              </label>
              <select
                id="mute-reason"
                className="w-full h-12 rounded-2xl px-4 py-3 bg-gray-700/50 backdrop-blur-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500 border border-gray-600/50 transition-all duration-300"
                value={reason}
                onChange={e => { setReason(e.target.value); setDuration(''); }}
              >
                <option value="">Suç türünü seçin</option>
                {allReasons.map(r => (
                  <option key={r.reason} value={r.reason}>{r.reason}</option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-yellow-400" htmlFor="mute-duration">
                <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                Süre
              </label>
              {selectedReason && (
                <div className="text-xs text-gray-400 mb-2">
                  Aralık: <span className="text-green-400 font-bold">{safeMin}{unit}</span> - <span className="text-red-400 font-bold">{safeMax}{unit}</span>
                </div>
              )}
              {selectedReason && safeMin === safeMax ? (
                <div className="relative">
                  <input
                    id="mute-duration"
                    type="text"
                    className="w-full h-12 rounded-2xl px-4 py-3 bg-gray-700/50 backdrop-blur-sm text-white text-center pr-8 border border-gray-600/50"
                    value={safeMin}
                    disabled
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">{unit}</span>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative">
                    <input
                      id="mute-duration"
                      type="number"
                      min={safeMin}
                      max={safeMax}
                      step={1}
                      className="w-full h-12 rounded-2xl px-4 py-3 bg-gray-700/50 backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-center pr-8 border border-gray-600/50 transition-all duration-300"
                      placeholder="Süre"
                      value={duration}
                      onChange={e => {
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        setDuration(val);
                      }}
                      disabled={!selectedReason}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">{unit}</span>
                  </div>
                  
                  {/* Severity buttons - Modern */}
                  {selectedReason && safeMin !== safeMax && (
                    <div className="flex gap-2">
                      {(() => {
                        const minVal = safeMin;
                        const maxVal = safeMax;
                        const midVal = Math.round((minVal + maxVal) / 2);
                        const levels = [
                          { label: 'Hafif', value: minVal, color: 'from-green-500 to-emerald-500' },
                          { label: 'Orta', value: midVal, color: 'from-yellow-500 to-orange-500' },
                          { label: 'Sert', value: maxVal, color: 'from-red-500 to-pink-500' },
                        ];
                        return levels.map(l => (
                          <button
                            key={l.label}
                            type="button"
                            className={`flex-1 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                              duration === l.value.toString() 
                                ? `bg-gradient-to-r ${l.color} text-white shadow-lg scale-105` 
                                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 border border-gray-600/30'
                            }`}
                            onClick={() => setDuration(l.value.toString())}
                          >
                            {l.label}
                          </button>
                        ));
                      })()}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Command Preview - Modern */}
          <div className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-gray-300">Oluşturulan Komut</span>
              </div>
              {muteCommand && (
                <div className="flex gap-3">
                  <button
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                    onClick={() => {
                      navigator.clipboard.writeText(muteCommand);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 1200);
                    }}
                  >
                    {copied ? '✓ Kopyalandı!' : '📋 Kopyala'}
                  </button>
                  <button
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-sm font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-green-500/25"
                    onClick={async () => {
                      if (!user) {
                        alert('Lütfen önce yetkili girişi yapın!');
                        return;
                      }
                      try {
                        const sessionId = getSessionId();
                        const browserInfo = getBrowserInfo();
                        const token = localStorage.getItem('authToken');
                        
                        const response = await fetch('/api/log-mute', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                          },
                          body: JSON.stringify({
                            command: muteCommand,
                            timestamp: new Date().toISOString(),
                            sessionId,
                            browserInfo
                          }),
                        });
                        
                        if (response.ok) {
                          setApplied(true);
                          setTimeout(() => setApplied(false), 1200);
                        }
                      } catch (error) {
                        console.error('Loglama hatası:', error);
                      }
                    }}
                  >
                    {applied ? '✓ Kaydedildi!' : '🚀 Uyguladım'}
                  </button>
                </div>
              )}
            </div>
            <div className="font-mono text-lg bg-black/30 px-4 py-3 rounded-xl text-green-400 border border-gray-700/30">
              {muteCommand || '/mute {kullanıcı} {süre} {sebep}'}
            </div>
          </div>
        </section>

        {/* Mute Rules Section - Modern */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-7xl">
          {/* Rules Info Cards */}
          <section className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-2xl">
                📚
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Mute Kuralları</h2>
                <p className="text-gray-400">Temel bilgiler</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {muteRules.map((rule, index) => (
                <div key={rule.title} className="bg-gray-900/50 rounded-2xl p-5 border border-gray-700/30 hover:border-green-500/30 transition-all duration-300">
                  <h3 className="font-bold text-lg text-green-400 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    {rule.title}
                  </h3>
                  <div className="text-gray-200 leading-relaxed">{rule.content}</div>
                </div>
              ))}
            </div>
          </section>
          
          {/* Mute Levels */}
          <section className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center text-2xl">
                ⚖️
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Seviye Sistemi</h2>
                <p className="text-gray-400">Susturma seviyeleri</p>
              </div>
            </div>
            
            <div className="space-y-6">
              {muteLevels.map((level, index) => (
                <div key={level.level} className="bg-gray-900/50 rounded-2xl p-5 border border-gray-700/30 hover:border-yellow-500/30 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold ${
                      index === 0 ? 'bg-green-500 text-white' :
                      index === 1 ? 'bg-yellow-500 text-black' :
                      'bg-red-500 text-white'
                    }`}>
                      {index + 1}
                    </div>
                    <h4 className="font-bold text-lg text-yellow-400">{level.level}</h4>
                  </div>
                  <div className="space-y-2">
                    {level.rules.filter(r => typeof r === 'object' && r.reason).map((r, i) => (
                      <div key={i} className="flex items-center justify-between bg-gray-800/50 rounded-xl p-3 border border-gray-700/20">
                        <span className="text-gray-200 text-sm">{r.reason}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          index === 0 ? 'bg-green-500/20 text-green-400' :
                          index === 1 ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {r.min !== r.max ? `${r.min}-${r.max}${r.unit}` : `${r.min}${r.unit}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}