'use client';
import Header from '../components/Header';
import { useState, useEffect } from 'react';

const faq = [
  {
    q: 'Mute nedir?',
    a: 'Mute, oyuncunun sohbetten belirli bir süre veya kalıcı olarak susturulmasıdır.'
  },
  {
    q: 'Nasıl para kasabilirim?',
    a: "-/warp tarla'ya girip oradan tarlada tarım yapıp, /sat hepsi ile satıp para elde edebilirsiniz. İşçi olarak oyuncular için çalışabilirsiniz. Adanızda farm yapabilirsiniz."
  },
  {
    q: 'Yumurta etkinliği nedir?',
    a: 'Yumurta etkinliği, oyuncuların yumurta toplayarak ödüller kazandığı özel bir etkinliktir. Yumurtalar spawn bölgesinde belirli yerlerde bulunabilir ve toplandığında çeşitli ödüller kazanabilirsiniz.'
  },
  {
    q: 'Minyonlar nedir?',
    a: 'Minyonlar, adanızda otomatik olarak kaynak toplayan yardımcı NPC\'lerdir. Farklı seviyelerde olabilirler ve her seviyede daha hızlı ve verimli çalışırlar. Minyonlar, oyuncuların pasif gelir elde etmesini sağlar.'
  },
  {
    q: 'Mango ve Çilek nasıl elde edilir?',
    a: 'Mango ve çilek spawn bölgesinin solundan gidebileceğiniz yerde bulunan minibosslardır ve öldürünce mango ve çilek düşer. Mango ve çilek ile kendi bölgelerinde bulunan köylüler ile takas yapabilirsiniz.'
  },
  {
    q: 'Oyunda kaç tane boss var?',
    a: 'Oyunda 2 tane boss vardır. Bu bosslara spawn bölgesinden sağdan gidebilirsiniz.'
  },
  {
    q: 'Adama birini nasıl eklerim?',
    a: 'Adanıza birini eklemek için /is invite <oyuncu> komutunu kullanabilirsiniz. Bu komut, belirtilen oyuncuya ada davetiyesi gönderir. Oyuncu daveti kabul ettiğinde yani /is accept komutunu kullanırsa adanıza eklenebilir'
  },
  {
    q: 'Adanızda birini nasıl silebilirim?',
    a: 'Adanızda birini silebilmek için /gardiyan ayarlarını kullanabilirsiniz'
  },
];

export default function SSSPage() {
  const [adminName, setAdminName] = useState<string | null>(null);
  useEffect(() => {
    const savedAdmin = localStorage.getItem('minecraftAdmin');
    if (savedAdmin) setAdminName(savedAdmin);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-gray-900 text-white flex flex-col">
      <Header adminName={adminName} />
      <div className="flex-1 flex flex-col items-center py-10 px-2">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-6 text-center text-yellow-300 drop-shadow-lg">Sıkça Sorulan Sorular (SSS)</h1>
        <div className="w-full max-w-2xl bg-gray-800 rounded-xl shadow-lg p-6">
          <ul className="space-y-6">
            {faq.map((item, i) => (
              <li key={i}>
                <div className="font-bold text-lg text-yellow-300 mb-1">{item.q}</div>
                <div className="text-gray-200 text-base pl-2 border-l-4 border-yellow-400">{item.a}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
} 