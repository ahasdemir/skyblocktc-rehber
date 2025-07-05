'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SignupFormData {
  username: string;
  password: string;
  confirmPassword: string;
}

interface SignupComponentProps {
  onBackToLogin: () => void;
  onSignupSuccess?: (user: any) => void;
}

export default function SignupComponent({ onBackToLogin, onSignupSuccess }: SignupComponentProps) {
  const [formData, setFormData] = useState<SignupFormData>({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.username || !formData.password || !formData.confirmPassword) {
      setError('Tüm alanların doldurulması gereklidir');
      return false;
    }

    if (formData.username.length < 3 || formData.username.length > 20) {
      setError('Kullanıcı adı 3-20 karakter arasında olmalıdır');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store the token and user data
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('minecraftAdmin', JSON.stringify(data.user));
        
        setSuccess(true);
        
        // Ana sayfanın login state'ini hemen güncelle
        if (onSignupSuccess) {
          onSignupSuccess(data.user);
        }
        
        // 2 saniye sonra success ekranını kapat
        setTimeout(() => {
          // Success ekranı onSignupSuccess callback'i ile zaten kapanacak
        }, 2000);
      } else {
        setError(data.error || 'Kayıt başarısız');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError('Ağ hatası. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-4">
            Kayıt Başarılı!
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-300 mb-6 leading-relaxed">
            🎉 Rehber hesabınız başarıyla oluşturuldu! 
            <br />
            Ana sayfaya yönlendiriliyorsunuz...
          </p>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Kullanıcı:</span>
              <span className="text-green-400 font-semibold">{formData.username}</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-gray-400">Rol:</span>
              <span className="text-blue-400 font-semibold">Rehber</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Rehber Kaydı</h1>
        <p className="text-gray-300">Rehber hesabınızı oluşturun</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
            Kullanıcı Adı
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Kullanıcı adınızı girin"
            required
            disabled={loading}
          />
          <p className="text-xs text-gray-400 mt-1">3-20 karakter, tüm karakterler kullanılabilir</p>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
            Şifre
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Şifrenizi girin"
            required
            disabled={loading}
          />
          <p className="text-xs text-gray-400 mt-1">En az 6 karakter</p>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
            Şifre Tekrarı
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Şifrenizi tekrar girin"
            required
            disabled={loading}
          />
        </div>

        {error && (
          <div className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Hesap Oluşturuluyor...
            </>
          ) : (
            'Rehber Hesabı Oluştur'
          )}
        </button>

        <div className="text-center">
          <button
            type="button"
            onClick={onBackToLogin}
            className="text-blue-400 hover:text-blue-300 text-sm underline"
            disabled={loading}
          >
            Giriş Sayfasına Dön
          </button>
        </div>
      </form>

      <div className="mt-6 p-4 bg-blue-900 bg-opacity-30 border border-blue-700 rounded-md">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-400 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm text-blue-300 font-medium">Rehber Hesabı</p>
            <p className="text-xs text-blue-200 mt-1">
              Kayıt olarak, rehber hesabı oluşturacaksınız. Sadece varolan rehberlerin kayıt olması için geçici bir sistemdir. Şifrenizi kimse göremez, sadece siz bilirsiniz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
