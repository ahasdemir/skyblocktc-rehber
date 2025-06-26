'use client';
import AuthGuard from '../components/AuthGuard';
import Header from '../components/Header';
import { useState, useEffect } from 'react';
import { getSessionId, getBrowserInfo } from '../../lib/sessionUtils';

interface User {
  id: number;
  username: string;
  role: string;
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
			const token = localStorage.getItem('authToken');
			
			// API'ye POST isteği gönder
			await fetch('/api/log-sss-copy', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`,
				},
				body: JSON.stringify({
					question,
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
		<div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white flex flex-col relative overflow-hidden">
			{/* Animated background */}
			<div className="absolute inset-0">
				<div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl animate-pulse"></div>
				<div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
			</div>
			
			<Header 
				user={user}
				onLogout={handleLogout}
			/>
			
			<div className="flex-1 flex flex-col items-center py-12 px-4 relative z-10">
				{/* Update Banner */}
				<div className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-black px-6 py-4 rounded-2xl mb-8 font-bold text-center w-full max-w-4xl shadow-2xl animate-bounce">
					<div className="flex items-center justify-center gap-3">
						<span className="text-2xl">🚀</span>
						<span>SSS Güncellemeleri: Arama özelliği eklendi 🔍 Soruların yerleri düzenlendi.</span>
					</div>
				</div>
				
				{/* Hero Header */}
				<div className="text-center mb-10 animate-fade-in-up">
					<div className="inline-flex items-center gap-4 mb-4">
						<div className="text-6xl">❓</div>
						<h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
							SSS
						</h1>
					</div>
					<div className="w-32 h-1 bg-gradient-to-r from-yellow-500 to-orange-500 mx-auto mb-4"></div>
					<p className="text-lg text-gray-400 max-w-3xl mx-auto">
						Sıkça sorulan sorular ve kapsamlı cevaplar
					</p>
				</div>
				
				{/* Modern Search Bar */}
				<div className="w-full max-w-3xl mb-8">
					<div className="relative bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-2 shadow-2xl">
						<div className="flex items-center">
							<div className="flex items-center justify-center w-12 h-12 text-yellow-400 text-xl">
								🔍
							</div>
							<input
								type="text"
								placeholder="Soruları ara... (örn: para, minyon, farm)"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="flex-1 px-4 py-3 bg-transparent text-white placeholder-gray-400 focus:outline-none text-lg"
							/>
							{searchTerm && (
								<button 
									onClick={() => setSearchTerm('')}
									className="flex items-center justify-center w-12 h-12 text-gray-400 hover:text-white transition-colors rounded-2xl hover:bg-gray-700/50"
								>
									✖
								</button>
							)}
						</div>
					</div>
				</div>
				
				{/* FAQ Content */}
				<div className="w-full max-w-4xl bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-3xl shadow-2xl p-8">
					{filteredFaq.length > 0 ? (
						<div className="space-y-6">
							{filteredFaq.map((item, i) => (
								<div key={i} className="group bg-gray-900/50 rounded-2xl p-6 border border-gray-700/30 hover:border-yellow-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/10">
									<div className="flex items-start gap-4">
										<div className="flex-1">
											<div className="flex items-center gap-3 mb-4">
												<div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center text-black font-bold text-sm">
													{i + 1}
												</div>
												<h3 className="font-bold text-xl text-yellow-400 group-hover:text-yellow-300 transition-colors">
													{item.q}
												</h3>
											</div>
											<div className="bg-gray-800/50 rounded-xl p-4 border-l-4 border-yellow-400">
												<pre className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap font-sans">
													{item.a}
												</pre>
											</div>
										</div>
										<button
											onClick={(e) => copyToClipboard(item.a, item.q, e.currentTarget)}
											className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-2xl flex items-center justify-center text-white transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-blue-500/25"
											title="Cevabı kopyala"
										>
											📋
										</button>
									</div>
								</div>
							))}
						</div>
					) : (
						<div className="text-center py-16">
							<div className="text-yellow-400 text-6xl mb-6">🔍</div>
							<h3 className="text-2xl font-bold text-white mb-4">Sonuç Bulunamadı</h3>
							<p className="text-gray-300 text-lg mb-2">Aramanızla eşleşen soru bulunamadı.</p>
							<p className="text-gray-400 mb-8">Farklı anahtar kelimeler ile tekrar deneyin.</p>
							<button
								onClick={() => setSearchTerm('')}
								className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-yellow-500/25"
							>
								🔄 Tüm Soruları Göster
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}