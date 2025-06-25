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
  displayName: string;
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

  const handleUserUpdate = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('minecraftAdmin', JSON.stringify(updatedUser));
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
    <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-gray-900 text-white flex flex-col">
      <Header
        user={user}
        onLogout={handleLogout}
        onUserUpdate={handleUserUpdate}
      />
      
      <main className="flex-1 flex flex-col items-center py-8 sm:py-10 px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 text-center bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent drop-shadow-lg">
          SkyBlockTC Mute Yardımcısı
        </h1>
        <p className="text-base sm:text-lg text-gray-300 mb-8 text-center max-w-2xl">
          Sunucu yönetimi için susturma kuralları ve rehberler için hızlı mute yardımcısı.
        </p>

        {/* Mute Command Helper */}
        <section className="bg-gray-900/90 rounded-xl p-5 sm:p-6 shadow-lg w-full max-w-4xl mb-8 border border-gray-700/50">
          <h3 className="text-xl font-bold text-blue-300 mb-4">Mute Komutu Hazırlayıcı</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
            <label className="text-sm font-medium text-blue-300 md:text-center" htmlFor="mute-user">Kullanıcı Adı</label>
            <label className="text-sm font-medium text-green-300 md:text-center" htmlFor="mute-reason">Suç</label>
            <label className="text-sm font-medium text-yellow-300 md:text-center" htmlFor="mute-duration">Süre</label>
          </div>
          
          <div className="flex flex-col md:flex-row gap-3">
            {/* Kullanıcı adı input'u yerine otomatik tamamlama bileşeni */}
            <div className="relative flex-1">
              <input
                id="mute-user"
                className="w-full h-[42px] rounded px-3 py-2 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 border border-gray-700"
                placeholder="Kullanıcı ismi"
                value={muteUser}
                onChange={handleUserInputChange}
                onFocus={() => muteUser.length > 0 && setShowAutocomplete(true)}
              />
              {/* Autocomplete dropdown */}
              {showAutocomplete && filteredPlayers.length > 0 && (
                <div 
                  ref={autocompleteRef}
                  className="absolute z-10 mt-1 w-full bg-gray-800 border border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto"
                >
                  {filteredPlayers.map((playerName) => (
                    <div
                      key={playerName}
                      className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-white transition-colors"
                      onClick={() => {
                        setMuteUser(playerName);
                        setShowAutocomplete(false);
                      }}
                    >
                      {playerName}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <select
              id="mute-reason"
              className="flex-1 rounded px-3 py-2 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 border border-gray-700"
              value={reason}
              onChange={e => { setReason(e.target.value); setDuration(''); }}
            >
              <option value="">Sebep seçin</option>
              {allReasons.map(r => (
                <option key={r.reason} value={r.reason}>{r.reason}</option>
              ))}
            </select>
            <div className="flex-1 flex flex-col items-center md:items-start">
              {selectedReason && (
                <div className="text-xs text-gray-400 mb-1 w-full text-center md:text-left">
                  Süre: min <span className="text-green-300 font-bold">{safeMin}{unit}</span> - max <span className="text-red-300 font-bold">{safeMax}{unit}</span>
                </div>
              )}
              {selectedReason && safeMin === safeMax ? (
                <div className="relative w-28 max-w-xs">
                  <input
                    id="mute-duration"
                    type="text"
                    className="rounded px-3 py-2 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full text-center pr-8 border border-gray-700"
                    value={safeMin}
                    disabled
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 select-none">{unit}</span>
                </div>
              ) : (
                <div className="relative w-28 max-w-xs">
                  <input
                    id="mute-duration"
                    type="number"
                    min={safeMin}
                    max={safeMax}
                    step={1}
                    className="rounded px-3 py-2 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full text-center pr-8 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-inner-spin-button]:m-0 border border-gray-700"
                    style={{ MozAppearance: 'textfield' }}
                    placeholder={`Süre`}
                    value={duration}
                    onChange={e => {
                      // Only allow numbers
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      setDuration(val);
                    }}
                    onInput={e => {
                      const val = e.currentTarget.value.replace(/[^0-9]/g, '');
                      let num = parseInt(val);
                      if (!isNaN(num)) {
                        if (num < safeMin) num = safeMin;
                        if (num > safeMax) num = safeMax;
                        setDuration(num.toString());
                      } else if (val === '') {
                        setDuration('');
                      }
                    }}
                    disabled={!selectedReason}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 select-none">{unit}</span>
                </div>
              )}
              
              {/* Sertlik butonları */}
              {selectedReason && safeMin !== safeMax && (
                <div className="flex justify-between mt-2 gap-1 w-full">
                  {(() => {
                    const minVal = safeMin;
                    const maxVal = safeMax;
                    const midVal = Math.round((minVal + maxVal) / 2);
                    const levels = [
                      { label: 'Hafif', value: minVal },
                      { label: 'Orta', value: midVal },
                      { label: 'Sert', value: maxVal },
                    ];
                    return levels.map(l => (
                      <button
                        key={l.label}
                        type="button"
                        className={`px-2 py-1 rounded text-xs font-semibold border transition-colors ${
                          duration === l.value.toString() 
                            ? 'bg-blue-600 text-white border-blue-700' 
                            : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-blue-700 hover:text-white'
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
          </div>
          
          <div className="mt-4 flex flex-wrap items-center gap-2 bg-gray-800/50 p-3 rounded-lg border border-gray-700/50">
            <span className="text-sm text-gray-300">Oluşan komut:</span>
            <span className="font-mono bg-gray-800 px-2 py-1 rounded text-green-300 flex-1 overflow-x-auto">
              {muteCommand || '/mute {kullanıcı} {süre} {sebep}'}
            </span>
            {muteCommand && (
              <div className="flex gap-2 flex-shrink-0">
                <button
                  className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs transition-colors"
                  onClick={() => {
                    navigator.clipboard.writeText(muteCommand);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1200);
                  }}
                >
                  {copied ? 'Kopyalandı!' : 'Kopyala'}
                </button>
                <button
                  className="px-3 py-1 rounded bg-green-600 hover:bg-green-700 text-white text-xs transition-colors"
                  onClick={async () => {
                    if (!user) {
                      alert('Lütfen önce yetkili girişi yapın!');
                      return;
                    }
                    try {
                      // Session ID ve tarayıcı bilgilerini al
                      const sessionId = getSessionId();
                      const browserInfo = getBrowserInfo();
                      
                      const response = await fetch('/api/log-mute', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          command: muteCommand,
                          timestamp: new Date().toISOString(),
                          admin: user.displayName,
                          username: user.username,
                          role: user.role,
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
                  {applied ? 'Kaydedildi!' : 'Uyguladım'}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Mute Rules Section */}
        <section className="bg-gray-800/80 rounded-xl shadow-lg p-6 sm:p-8 w-full max-w-4xl mb-8">
          <h2 className="text-2xl font-bold mb-6 text-green-300 border-l-4 border-green-400 pl-2">Mute Kuralları</h2>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {muteRules.map((rule) => (
              <div key={rule.title} className="bg-gray-900 rounded-lg p-4 shadow-md border border-gray-700/30 hover:shadow-xl transition-all duration-300">
                <h3 className="font-semibold mb-2 text-lg text-blue-300">{rule.title}</h3>
                <div className="text-gray-200 text-sm">{rule.content}</div>
              </div>
            ))}
          </div>
          
          <h2 className="text-xl font-bold mb-4 text-yellow-300 border-l-4 border-yellow-400 pl-2">Susturma Seviyeleri</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {muteLevels.map((level) => (
              <div key={level.level} className="bg-gray-900 rounded-lg p-4 shadow-md border border-gray-700/30 hover:shadow-xl transition-all duration-300">
                <h4 className="font-semibold mb-2 text-yellow-200">{level.level} Susturma</h4>
                <ul className="list-disc list-inside text-gray-200 text-sm">
                  {level.rules.filter(r => typeof r === 'object' && r.reason).map((r, i) => (
                    <li key={i} className="mb-1">
                      <span className="text-blue-400">{r.min !== r.max ? `${r.min}-${r.max}${r.unit}` : `${r.min}${r.unit}`}</span> {r.reason}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}