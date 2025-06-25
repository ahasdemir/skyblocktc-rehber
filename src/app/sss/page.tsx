'use client';
import AuthGuard from '../components/AuthGuard';
import Header from '../components/Header';
import { useState, useEffect } from 'react';
import { getSessionId, getBrowserInfo } from '../../lib/sessionUtils';

interface User {
  id: number;
  username: string;
  role: string;
  displayName: string;
}

const faq = [
	{
		q: 'Nasıl para kasabilirim?',
		a: "Para kazanmak için:\n- /warp tarla ile ekin kırıp /sat hepsi ile satabilirsin.\n- /spawn'da minyon yerlerinde çilek veya mango kesebilirsin.\n- /iş ile işçi olabilir, başkaları için çalışabilirsin.\n- Adanda farm kurarak pasif gelir elde edebilirsin.",
	},
	{
		q: 'Oto toplama var mı?',
		a: 'Oto toplama yok onun yerine /çiftçi ve /madenci kullanabilirsin!',
	},
	{
		q: 'Trident Coin nedir?',
		a: 'TC (Trident Coin), gerçek para ile satın alıp /sitemarket aracılığıyla harcayabileceğiniz özel bir para birimidir. Bu coin ile spawnerlar, VIP paketleri, kasa anahtarları, uçuş süresi ve /çiftçi sat, AFK hesap gibi avantajlar satın alabilirsiniz.',
	},
	{
		q: 'Boxcoin nedir?',
		a: 'Boxcoin /boxcoin\'den özel itemler alabileceğiniz, /warp boxcoin\'de ise özel kasası bulunan bir para birimidir. ',
	},
	{
		q: 'Adama birini nasıl eklerim?',
		a: 'Adanıza birini eklemek için /is invite <oyuncu> komutunu kullanabilirsiniz. Bu komut, belirtilen oyuncuya ada davetiyesi gönderir. Oyuncu daveti kabul ettiğinde yani /is accept komutunu kullanırsa adanıza eklenebilir.',
	},
	{
		q: 'Adamdan birini nasıl atabilirim?',
		a: 'Adanızdan birini atmak için /is kick <isim> komudunu kullanabilirsiniz.',
	},
	{
		q: 'Hangi farmları kurabilirim?',
		a: 'Adanız için kaktüs, arı, şeker kamışı ve hibrit farm(karpuz, balkabağı) gibi otomatik farmları kurabilirsiniz.',
	},
	{
		q: 'Yumurta etkinliği nedir?',
		a: 'Yumurta etkinliği, oyuncuların yumurta toplayarak ödüller kazandığı özel bir etkinliktir. Yumurtalar spawn bölgesinde belirli yerlerde bulunabilir ve toplandığında çeşitli ödüller kazanabilirsiniz.',
	},
	{
		q: 'Minyonlar nedir?',
		a: "Minyonlar, adanızda otomatik olarak kaynak toplayan yardımcı NPC'lerdir. Farklı seviyelerde olabilirler ve her seviyede daha hızlı ve verimli çalışırlar. Minyonlar, oyuncuların pasif gelir elde etmesini sağlar.",
	},
	{
		q: 'Mango ve Çilek nasıl elde edilir?',
		a: 'Mango ve çilek, spawn bölgesinin sol çaprazında bulunan minyon yerlerinde kesilerek elde edilir. Elde ettiğiniz mango ve çilekleri, kendi bölgelerinde bulunan köylüler ile takas yapabilirsiniz.',
	},
	{
		q: 'Hile kullanmak yasak mı?',
		a: 'Evet, hile kullanmak yasaktır. Hile kullananlar kalıcı olarak yasaklanabilir. Ancak ada içinde auto clicker(F3+T gibi), bazı makroları, fullbright gibi rekabeti bozmayan araçları kullanabilirsiniz. KillAura, X-Ray, Fly gibi hileler kesinlikle yasaktır.',
	},
	{
		q: 'Oyunda kaç tane boss var?',
		a: 'Oyunda 2 tane boss vardır. Bu bosslara spawn bölgesinden sağdan gidebilirsiniz.',
	},
	{
		q: 'X\'in piyasası ne? (Piyasası belli olan golem gibi itemlere fiyatını verin, bu cevabı kullanmayın bence)',
		a: 'Sunucu ekonomisi sürekli değişken, net bir fiyat vermek zor. Ama serbest piyasa var, alıcı veya satıcı olarak işinize yarayacak bir fiyat verip kendi aranızda anlaşabilirsiniz. Piyasayı belileyecek olan sizlersiniz!',
	},
];

export default function SSSPage() {
  return (
    <AuthGuard>
      <SSSPageContent />
    </AuthGuard>
  );
}

function SSSPageContent() {
	const [user, setUser] = useState<User | null>(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [filteredFaq, setFilteredFaq] = useState(faq);

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

	useEffect(() => {
		if (searchTerm.trim() === '') {
			setFilteredFaq(faq);
		} else {
			const lowercasedSearchTerm = searchTerm.toLowerCase();
			const filtered = faq.filter(item => 
				item.q.toLowerCase().includes(lowercasedSearchTerm)
			);
			setFilteredFaq(filtered);
		}
	}, [searchTerm]);
	const copyToClipboard = (text: string, question: string, button: HTMLButtonElement) => {
		navigator.clipboard.writeText(text).then(() => {
			// Buton animasyonu
			button.classList.add('shake');
			setTimeout(() => {
				button.classList.remove('shake');
			}, 500); // Sallanma efekti 500ms sürer
			
			// Discord webhook'una kopyalama işlemini logla
			logCopyAction(question);
		});
	};
	
	// Kopyalama işlemini Discord'a loglamak için fonksiyon
	const logCopyAction = async (question: string) => {
		try {
			// Session ID ve tarayıcı bilgilerini al
			const sessionId = getSessionId();
			const browserInfo = getBrowserInfo();
			
			// API'ye POST isteği gönder
			await fetch('/api/log-sss-copy', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					question,
					admin: user?.displayName,
					username: user?.username,
					role: user?.role,
					timestamp: new Date().toISOString(),
					sessionId,
					browserInfo
				}),
			});
		} catch (error) {
			console.error('SSS kopyalama loglama hatası:', error);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-gray-900 text-white flex flex-col">
			<Header 
				user={user}
				onLogout={handleLogout}
				onUserUpdate={handleUserUpdate}
			/>
			<div className="flex-1 flex flex-col items-center py-10 px-2">
				<div className="bg-yellow-500 text-black px-4 py-2 rounded-md mb-4 font-bold text-center w-full max-w-2xl animate-bounce">
					SSS Güncellemeleri: Arama özelliği eklendi 🔍 Soruların yerleri düzenlendi.
				</div>
				<h1 className="text-3xl md:text-4xl font-extrabold mb-6 text-center text-yellow-300 drop-shadow-lg">
					Sıkça Sorulan Sorular (SSS)
				</h1>
				<div className="w-full max-w-2xl mb-6">
					<div className="relative">
						<input
							type="text"
							placeholder="Ara... (örn: arı, minyon, para)"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 pl-10"
						/>
						<div className="absolute left-3 top-2.5 text-gray-400">
							🔍
						</div>
						{searchTerm && (
							<button 
								onClick={() => setSearchTerm('')}
								className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
							>
								✖
							</button>
						)}
					</div>
				</div>				<div className="w-full max-w-2xl bg-gray-800 rounded-xl shadow-lg p-6">
					{filteredFaq.length > 0 ? (
						<ul className="space-y-6">
							{filteredFaq.map((item, i) => (
								<li key={i} className="flex items-start justify-between">
									<div>
										<div className="font-bold text-lg text-yellow-300 mb-1">
											{item.q}
										</div>
										<div className="text-gray-200 text-base pl-2 border-l-4 border-yellow-400">
											{item.a}
										</div>
									</div>
									<button
										onClick={(e) => copyToClipboard(item.a, item.q, e.currentTarget)}
										className="ml-4 p-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors text-yellow-300"
										title="Cevabı kopyala"
									>
										📋
									</button>
								</li>
							))}
						</ul>
					) : (
						<div className="text-center py-10">
							<div className="text-yellow-300 text-5xl mb-4">🔍</div>
							<p className="text-gray-300 text-lg">Aramanızla eşleşen soru bulunamadı.</p>
							<p className="text-gray-400 mt-2">Farklı anahtar kelimeler ile tekrar deneyin.</p>
							<button
								onClick={() => setSearchTerm('')}
								className="mt-4 px-4 py-2 bg-yellow-500 text-black rounded-md hover:bg-yellow-400 transition-colors"
							>
								Tüm Soruları Göster
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}