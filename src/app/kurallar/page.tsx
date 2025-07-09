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

  const rules = [
    {
      id: 1,
      title: "Sohbet Kirliliği (Spam, Flood, Gereksiz Mesaj, CAPS LOCK, Random)",
      icon: "💬",
      color: "from-red-500 to-orange-500",
      description: "Sohbet kirliliği, oyuncuların yazılı iletişimi anlamlı şekilde kullanmasını zorlaştıran, sohbeti okunmaz hale getiren ve oyun deneyimini olumsuz etkileyen davranışlardır.",
      examples: [
        "Aynı mesajın art arda defalarca yazılması (Flood)",
        "Anlamsız, rastgele karakter dizilerini 8 harften uzun paylaşmak (örnek: asdfghjkl, !@#$%^&*)",
        "Tüm mesajı büyük harflerle yazmak (Caps Lock)",
        "Tek kelimelik, anlamsız, tekrar eden veya gereksiz mesajlar (örnek: gelin, gelin, gelin!)",
        "Uzun, boşluklarla uzatılmış ya da alakasız içerik paylaşımı"
      ],
      sanctions: [
        "1. İhlal: Uyarı",
        "Tekrarı: 15 dakika susturma",
        "Aynı gün içinde tekrar edilirse: Uyarısız 1 saat susturma"
      ]
    },
    {
      id: 2,
      title: "Cinsellik İçeren İfadeler",
      icon: "🚫",
      color: "from-purple-500 to-pink-500",
      description: "SkyblockTC sunucusunda cinsel içerikli, açık veya ima yoluyla uygunsuz ifadeler kullanmak kesinlikle yasaktır.",
      examples: [
        "Cinsel organ isimlerinin yazılması",
        "Cinsel ilişkiye açık veya ima yoluyla atıfta bulunulması",
        "Pornografik göndermeler, erotik hikâyeler, fanteziler",
        "Cinsellikle ilgili argo ve küfürler"
      ],
      sanctions: [
        "Uyarısız 1 saat susturma",
        "Aynı gün içinde tekrar edilirse: Uyarısız 3 saat susturma"
      ]
    },
    {
      id: 3,
      title: "Argo Kelime Kullanımı",
      icon: "🗣️",
      color: "from-yellow-500 to-orange-500",
      description: "Argo kelimeler, toplumda kaba ya da saygısız olarak değerlendirilen ifadelerdir.",
      examples: [
        '"Aptal", "geri zekalı", "beyinsiz", "sürtük", "it" gibi aşağılayıcı ifadeler'
      ],
      sanctions: [
        "Uyarısız 20 dakika susturma",
        "Aynı gün içinde tekrar edilirse: Uyarısız 1 saat susturma"
      ]
    },
    {
      id: 4,
      title: "Amacı Dışında Yapılan Ada Reklamları",
      icon: "📢",
      color: "from-blue-500 to-cyan-500",
      description: "Ada reklamları yalnızca oyunculara doğru ve geçerli bilgi vermek amacıyla kullanılmalıdır.",
      examples: [
        '"Adama gelin, 100M para dağıtıyorum!" (gerçek değilse)',
        '"Gelin, bedava eşya veriyorum!" (gerçek değilse)',
        "Oyuncuları yanıltmak, ilgisini çekmek için abartılı ifadeler kullanmak",
        "Ada reklamı gibi görünerek dış link veya başka sunuculara yönlendirme yapmak"
      ],
      sanctions: [
        "Uyarısız 1 saat susturma",
        "Aynı gün içinde tekrar edilirse: Uyarısız 2 saat susturma"
      ]
    },
    {
      id: 5,
      title: "Hakaret, Küfür, Kavga ve Kışkırtma",
      icon: "⚔️",
      color: "from-red-500 to-red-700",
      description: "Diğer oyunculara yönelik saygısız, saldırgan ve kışkırtıcı ifadeler sunucuda kesinlikle yasaktır.",
      examples: [
        "Oyuncularla kavga başlatmak amacıyla tartışmak",
        "Bilerek sinirlendirme, alay etme, dalga geçme",
        "Küfürlü veya aşağılayıcı hitaplar"
      ],
      sanctions: [
        "Uyarısız 30 dakika susturma",
        "Aynı gün içinde tekrar edilirse: Uyarısız 2 saat susturma"
      ]
    },
    {
      id: 6,
      title: "Dini Değerlere Hakaret",
      icon: "🕊️",
      color: "from-indigo-500 to-purple-600",
      description: "SkyblockTC sunucusu, her bireyin inancına ve dini değerlerine saygı gösterilmesini zorunlu kılar.",
      examples: [
        "Herhangi bir dinin kutsal kitabı ile dalga geçmek",
        "İbadetleri küçümseyen veya aşağılayan ifadeler kullanmak",
        "Dinî liderleri veya figürleri hedef alan hakaretler",
        "İnançlı kişilere yönelik alaycı yaklaşımlar"
      ],
      sanctions: [
        "Uyarısız 3 saat susturma",
        "Aynı gün içinde tekrar edilirse: Uyarısız 8 saat susturma"
      ]
    },
    {
      id: 7,
      title: "Siyaset Yapmak",
      icon: "🏛️",
      color: "from-gray-500 to-gray-700",
      description: "SkyblockTC, siyasi görüşlerin ifade edileceği bir ortam değildir.",
      examples: [
        "Güncel siyasi olaylar hakkında tartışma başlatmak",
        "Siyasi parti, lider veya ideoloji hakkında yorum yapmak",
        "Siyasi sloganlar, seçim propagandaları ya da karşıt ifadeler kullanmak"
      ],
      sanctions: [
        "Uyarısız 3 saat susturma",
        "Aynı gün içinde tekrar edilirse: Uyarısız 8 saat susturma"
      ]
    },
    {
      id: 8,
      title: "Ailevi Küfür Kullanımı",
      icon: "👨‍👩‍👧‍👦",
      color: "from-red-600 to-red-800",
      description: "SkyblockTC'de en ağır ihlallerden biri, aile bireylerine yönelik hakaret ve küfürlerdir.",
      examples: [
        "Anneye, babaya ya da kardeşe yönelik küfür içeren ifadeler",
        "Aile bireylerini hedef alan aşağılayıcı ya da ahlaksız sözler",
        "Alaycı şekilde aile üzerinden hakaret kurmak"
      ],
      sanctions: [
        "Uyarısız 3 saat susturma",
        "Aynı gün içinde tekrar edilirse: Uyarısız 8 saat susturma"
      ]
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
              
              <div className="mt-6 p-4 bg-red-900/20 border border-red-500/30 rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-red-400 text-xl">⚠️</span>
                  <span className="text-red-300 font-semibold">Önemli Uyarı</span>
                </div>
                <p className="text-red-200 text-sm">
                  Bu kurallar şimdilik geçerli değildir. Bu sadece örnek kurallar listesidir. Hademir'in onayını bekleyin.
                </p>
              </div>
            </div>
          </div>

          {/* Rules Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {rules.map((rule, index) => (
              <div
                key={rule.id}
                className="group relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-2xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${rule.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`}></div>
                
                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="text-4xl">{rule.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`text-2xl font-bold bg-gradient-to-r ${rule.color} bg-clip-text text-transparent`}>
                          {rule.id}.
                        </span>
                        <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors duration-300">
                          {rule.title}
                        </h3>
                      </div>
                      <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 leading-relaxed">
                        {rule.description}
                      </p>
                    </div>
                  </div>

                  {/* Examples */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-yellow-400 mb-3 flex items-center gap-2">
                      <span>💡</span> Örnek Davranışlar:
                    </h4>
                    <ul className="space-y-2">
                      {rule.examples.map((example, i) => (
                        <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                          <span className="text-red-400 mt-1">•</span>
                          <span>{example}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Sanctions */}
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/30">
                    <h4 className="text-lg font-semibold text-red-400 mb-3 flex items-center gap-2">
                      <span>⚖️</span> Yaptırımlar:
                    </h4>
                    <ul className="space-y-2">
                      {rule.sanctions.map((sanction, i) => (
                        <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                          <span className="text-orange-400 mt-1">•</span>
                          <span>{sanction}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
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
