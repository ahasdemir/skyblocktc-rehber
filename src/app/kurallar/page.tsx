'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import AuthGuard from '../components/AuthGuard';

interface User {
  id: number;
  username: string;
  role: string;
}

export default function KurallarPage() {
  const [user, setUser] = useState<User | null>(null);

  React.useEffect(() => {
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
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('minecraftAdmin');
    localStorage.removeItem('authToken');
  };

  const seviye1Rules = [
    {
      id: 1,
      title: "Sohbet Kirletimi",
      icon: "💬",
      color: "from-blue-500 to-cyan-500",
      description: "Sohbeti gereksiz mesajlarla kirletmek, spam yapmak, flood atmak ve anlamsız karakterler paylaşmak yasaktır.",
      sanction: "10 dakika susturma"
    },
    {
      id: 2,
      title: "Cinsellik İçeren Kelimeler",
      icon: "🚫",
      color: "from-red-500 to-pink-500",
      description: "Sunucuda cinsel içerikli, uygunsuz kelimeler ve ifadeler kullanmak kesinlikle yasaktır.",
      sanction: "30 dakika susturma"
    },
    {
      id: 3,
      title: "Argo Kelime Kullanımı",
      icon: "🗣️",
      color: "from-yellow-500 to-orange-500",
      description: "Kaba, saygısız ve argo kelimeler kullanmak sunucu ortamını bozar ve yasaktır.",
      sanction: "15 dakika susturma"
    },
    {
      id: 4,
      title: "Argo Kelime Benzetmeleri",
      icon: "🎭",
      color: "from-purple-500 to-indigo-500",
      description: "Argo kelimeleri farklı şekillerde yazarak ya da benzeterek kullanmak yasaktır.",
      sanction: "15 dakika susturma"
    },
    {
      id: 5,
      title: "Amacı Dışında Kullanılan Ada Reklamı",
      icon: "📢",
      color: "from-green-500 to-teal-500",
      description: "Ada reklamlarını gerçek amacı dışında, yanıltıcı veya spam şeklinde kullanmak yasaktır.",
      sanction: "5 dakika susturma"
    }
  ];

  const banRules = [
    {
      id: 6,
      title: "İrkçılık",
      icon: "🚫",
      color: "from-red-600 to-red-700",
      description: "Irk, milliyet veya etnik köken temelli ayrımcılık ve hakaretler kesinlikle yasaktır.",
      sanction: "6 saat ban"
    },
    {
      id: 7,
      title: "Sunucu Huzurunu/Düzenini Bozmak",
      icon: "⚡",
      color: "from-orange-600 to-red-600",
      description: "Sunucunun genel huzurunu ve düzenini bozacak davranışlarda bulunmak yasaktır.",
      sanction: "12 saat ban"
    },
    {
      id: 8,
      title: "Dolandırıcılık Yapmak ve Teşebbüs Etmek",
      icon: "💰",
      color: "from-yellow-600 to-orange-600",
      description: "Oyuncuları kandırarak eşya veya para elde etmeye çalışmak yasaktır.",
      sanction: "3-7 gün ban"
    },
    {
      id: 9,
      title: "Hesap Sınırını Aşmak",
      icon: "👥",
      color: "from-blue-600 to-purple-600",
      description: "Belirlenen hesap sınırlarını aşarak çoklu hesap kullanmak yasaktır.",
      sanction: "3-7 gün ban"
    }
  ];

  const seviye2Rules = [
    {
      id: 6,
      title: "Hakaret",
      icon: "⚔️",
      color: "from-red-600 to-red-800",
      description: "Diğer oyunculara hakaret etmek, aşağılayıcı ifadeler kullanmak yasaktır.",
      sanction: "30 dakika susturma"
    },
    {
      id: 7,
      title: "Küfür Kullanımı",
      icon: "🤬",
      color: "from-red-700 to-red-900",
      description: "Küfürlü ifadeler kullanmak sunucu ortamını bozar ve yasaktır.",
      sanction: "1 saat susturma"
    },
    {
      id: 8,
      title: "Tartışma",
      icon: "�",
      color: "from-orange-500 to-red-500",
      description: "Diğer oyuncularla gereksiz tartışmaya girmek ve sohbeti germek yasaktır.",
      sanction: "15 dakika susturma"
    },
    {
      id: 9,
      title: "Kışkırtma",
      icon: "😈",
      color: "from-purple-600 to-red-600",
      description: "Diğer oyuncuları bilerek kışkırtmak, sinirlendirmek ve provoke etmek yasaktır.",
      sanction: "15 dakika susturma"
    }
  ];

  const seviye3Rules = [
    {
      id: 10,
      title: "Din ve Siyaset Yapmak",
      icon: "🏛️",
      color: "from-gray-600 to-gray-800",
      description: "Sunucuda dini ve siyasi konularda tartışma yapmak, görüş belirtmek yasaktır.",
      sanction: "3 saat susturma"
    },
    {
      id: 11,
      title: "Ailevi Küfür Kullanımı",
      icon: "👨‍👩‍👧‍👦",
      color: "from-red-800 to-black",
      description: "Aile bireylerini hedef alan küfürler ve hakaretler en ağır ihlallerdendir.",
      sanction: "3 saat susturma"
    },
    {
      id: 12,
      title: "Yetkiliye Özelden Hakaret",
      icon: "💬",
      color: "from-indigo-600 to-purple-800",
      description: "Yetkililere özel mesaj yoluyla hakaret etmek ve saygısızlık yapmak yasaktır.",
      sanction: "3 saat susturma"
    },
    {
      id: 13,
      title: "Sohbete Ada Reklamını Mesaj Olarak İletmek",
      icon: "📨",
      color: "from-blue-600 to-purple-600",
      description: "Ada reklamlarını başkalarının mesajı gibi göstererek sohbete iletmek yasaktır.",
      sanction: "3 saat susturma"
    }
  ];

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white flex flex-col relative overflow-hidden">
        {/* Animated background particles */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <Header user={user} onLogout={handleLogout} />

      <div className="flex-1 py-8 px-4 relative z-10">
        {/* Header Section */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="text-center mb-8">

            <h1 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-red-400 via-orange-500 to-yellow-400 bg-clip-text text-transparent leading-tight">
              📜 SkyblockTC
            </h1>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-300">
              Resmî Sohbet Kuralları
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-orange-500 mx-auto mb-6"></div>
            
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-2xl">
              <p className="text-lg text-gray-300 leading-relaxed">
                Bu belge, SkyblockTC sunucusunda oyuncular arasında <span className="text-blue-400 font-semibold">sağlıklı</span>, 
                <span className="text-green-400 font-semibold"> saygılı</span> ve <span className="text-purple-400 font-semibold">keyifli</span> bir 
                iletişim ortamı oluşturmak amacıyla hazırlanmıştır. Aşağıda belirtilen kurallar, sunucu içerisindeki tüm yazılı 
                sohbet alanlarında geçerlidir.
              </p>
              
              <div className="mt-6 p-4 bg-green-900/20 border border-green-500/30 rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-green-400 text-xl">⚠️</span>
                  <span className="text-green-300 font-semibold">Önemli Uyarı</span>
                </div>
                <p className="text-green-200 text-sm">
                  Bu kurallar geçerlidir ve discord #yeni-kurallar kanalındaki Sonsuz'un attığı ilk mk1 pdf  kurallarıdır. Rahatlıkla buraya bakarak uygulayabilirsiniz!
                </p>
              </div>
            </div>
          </div>

          {/* Rules Grid */}
          <div className="space-y-12 mb-12">
            {/* Seviye 1 Kurallar */}
            <div>
              <h3 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                🟢 Seviye 1 - Hafif İhlaller
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {seviye1Rules.map((rule, index) => (
                  <div
                    key={rule.id}
                    className="group relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-6 shadow-2xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${rule.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`}></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="text-3xl">{rule.icon}</div>
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors duration-300 mb-2">
                            {rule.title}
                          </h4>
                          <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 text-sm mb-4">
                            {rule.description}
                          </p>
                          <div className="bg-red-900/30 border border-red-500/50 rounded-xl p-3">
                            <p className="text-red-300 font-semibold text-sm">
                              ⚖️ Ceza: {rule.sanction}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Seviye 2 Kurallar */}
            <div>
              <h3 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                🟡 Seviye 2 - Orta İhlaller
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {seviye2Rules.map((rule, index) => (
                  <div
                    key={rule.id}
                    className="group relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-6 shadow-2xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${rule.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`}></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="text-3xl">{rule.icon}</div>
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors duration-300 mb-2">
                            {rule.title}
                          </h4>
                          <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 text-sm mb-4">
                            {rule.description}
                          </p>
                          <div className="bg-orange-900/30 border border-orange-500/50 rounded-xl p-3">
                            <p className="text-orange-300 font-semibold text-sm">
                              ⚖️ Ceza: {rule.sanction}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Seviye 3 Kurallar */}
            <div>
              <h3 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                🔴 Seviye 3 - Ağır İhlaller
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {seviye3Rules.map((rule, index) => (
                  <div
                    key={rule.id}
                    className="group relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-6 shadow-2xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${rule.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`}></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="text-3xl">{rule.icon}</div>
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-white group-hover:text-red-400 transition-colors duration-300 mb-2">
                            {rule.title}
                          </h4>
                          <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 text-sm mb-4">
                            {rule.description}
                          </p>
                          <div className="bg-red-900/30 border border-red-500/50 rounded-xl p-3">
                            <p className="text-red-300 font-semibold text-sm">
                              ⚖️ Ceza: {rule.sanction}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ban Gerektiren Kurallar */}
            <div>
              <h3 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
                🚨 Ban Gerektiren İhlaller
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {banRules.map((rule, index) => (
                  <div
                    key={rule.id}
                    className="group relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-red-600/50 rounded-3xl p-6 shadow-2xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${rule.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`}></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="text-3xl">{rule.icon}</div>
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-white group-hover:text-red-400 transition-colors duration-300 mb-2">
                            {rule.title}
                          </h4>
                          <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 text-sm mb-4">
                            {rule.description}
                          </p>
                          <div className="bg-red-900/40 border border-red-500/60 rounded-xl p-3">
                            <p className="text-red-200 font-semibold text-sm">
                              🔨 Ceza: {rule.sanction}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-xl border border-blue-500/30 rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                📋 Ek Bilgilendirme
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <div className="text-3xl mb-3 text-center">🛡️</div>
                <p className="text-gray-300 text-sm text-center leading-relaxed">
                  SkyblockTC, kurallarını topluluğun huzuru ve saygılı bir ortam sağlamak amacıyla oluşturmuştur.
                </p>
              </div>
              
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <div className="text-3xl mb-3 text-center">👮</div>
                <p className="text-gray-300 text-sm text-center leading-relaxed">
                  Moderatörler gerekli durumlarda uyarı yapmadan doğrudan susturma cezası uygulayabilir.
                </p>
              </div>
              
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <div className="text-3xl mb-3 text-center">🚨</div>
                <p className="text-gray-300 text-sm text-center leading-relaxed">
                  Sürekli tekrar eden ihlallerde susturma cezası dışında; ada erişimi kısıtlanması, sunucudan uzaklaştırma veya kalıcı ban işlemleri uygulanabilir.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </AuthGuard>
  );
}
