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
    a: "Para kazanmak için birkaç farklı yöntem kullanabilirsin:\n\n- /warp tarla yazarak tarladaki ekinleri kırabilir ve topladığın ürünleri /sat hepsi komutuyla satabilirsin.\n- /spawn bölgesinde sol çaprazda bulunan minyon yerlerine gidip çilek veya mango keserek, bunları kendi bölgelerinde bulunan köylülerle takas yapabilirsin.\n- /iş yazarak işçi olabilir ve diğer oyuncular için çalışabilirsin.\n- Adanda kaktüs, balkabağı, arı gibi birçok farklı farm kurarak pasif gelir elde edebilirsin.\n- Ayrıca işçi olarak oyuncular için çalışmak da ek gelir sağlar."
  },
  {
    q: 'Yumurta etkinliği nedir?',
    a: 'Yumurta etkinliği, oyuncuların yumurta toplayarak ödüller kazandığı özel bir etkinliktir. Yumurtalar spawn bölgesinde belirli yerlerde bulunabilir ve toplandığında çeşitli ödüller kazanabilirsiniz.'
  },
  {
    q: 'Minyonlar nedir?',
    a: "Minyonlar, adanızda otomatik olarak kaynak toplayan yardımcı NPC'lerdir. Farklı seviyelerde olabilirler ve her seviyede daha hızlı ve verimli çalışırlar. Minyonlar, oyuncuların pasif gelir elde etmesini sağlar."
  },
  {
    q: 'Mango ve Çilek nasıl elde edilir?',
    a: 'Mango ve çilek, spawn bölgesinin sol çaprazında bulunan minyon yerlerinde kesilerek elde edilir. Elde ettiğiniz mango ve çilekleri, kendi bölgelerinde bulunan köylüler ile takas yapabilirsiniz.'
  },
  {
    q: 'Hile kullanmak yasak mı?',
    a: 'Evet, hile kullanmak genel itibari ile yasaktır. Hile kullanan oyuncular, sunucudan kalıcı olarak yasaklanabilir. Ancak adada kullanabileceginiz auto clicker, bazı makrolar gibi hile çeşitlerine göz yumulabilir. Bu tür hileler, adada işlerinizi kolaylaştırmak için kullanılabilir. Ancak bu tür hilelerin kullanımı da sunucu kurallarına uygun olmalıdır. Ancak KillAura, X-Ray, Fly gibi hileler kesinlikle yasaktır.'
  },
  {
    q: 'Boxcoin nedir?',
    a: 'Boxcoin /boxcoin\'den özel itemler alabileceğiniz, /warp boxcoin\'de ise özel kasası bulunan bir para birimidir. '
  },
  {
    q: 'Oyunda kaç tane boss var?',
    a: 'Oyunda 2 tane boss vardır. Bu bosslara spawn bölgesinden sağdan gidebilirsiniz.'
  },
  {
    q: 'Adama birini nasıl eklerim?',
    a: 'Adanıza birini eklemek için /is invite <oyuncu> komutunu kullanabilirsiniz. Bu komut, belirtilen oyuncuya ada davetiyesi gönderir. Oyuncu daveti kabul ettiğinde yani /is accept komutunu kullanırsa adanıza eklenebilir.'
  },
  {
    q: 'Adamdan birini nasıl silebilirim?',
    a: 'Adanızdan birini silmek için /is kick <isim> komudunu kullanabilirsiniz.'
  },
];

export default function SSSPage() {
  const [adminName, setAdminName] = useState<string | null>(null);
  useEffect(() => {
    const savedAdmin = localStorage.getItem('minecraftAdmin');
    if (savedAdmin) setAdminName(savedAdmin);
  }, []);

  const copyToClipboard = (text: string, button: HTMLButtonElement) => {
    navigator.clipboard.writeText(text).then(() => {
      button.classList.add('shake');
      setTimeout(() => {
        button.classList.remove('shake');
      }, 500); // Sallanma efekti 500ms sürer
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-gray-900 text-white flex flex-col">
      <Header adminName={adminName} />
      <div className="flex-1 flex flex-col items-center py-10 px-2">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-6 text-center text-yellow-300 drop-shadow-lg">Sıkça Sorulan Sorular (SSS)</h1>
        <div className="w-full max-w-2xl bg-gray-800 rounded-xl shadow-lg p-6">
          <ul className="space-y-6">
            {faq.map((item, i) => (
              <li key={i} className="flex items-start justify-between">
                <div>
                  <div className="font-bold text-lg text-yellow-300 mb-1">{item.q}</div>
                  <div className="text-gray-200 text-base pl-2 border-l-4 border-yellow-400">{item.a}</div>
                </div>
                <button
                  onClick={(e) => copyToClipboard(item.a, e.currentTarget)}
                  className="ml-4 p-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors text-yellow-300"
                  title="Cevabı kopyala"
                >
                  📋
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}