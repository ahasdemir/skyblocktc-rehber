# MongoDB Authentication System

## 📋 Kurulum Adımları

### 1. MongoDB Kurulumu

#### Yerel MongoDB (Önerilen)
```bash
# Windows için MongoDB Community Server indirin:
https://www.mongodb.com/try/download/community

# macOS için (Homebrew ile):
brew tap mongodb/brew
brew install mongodb-community

# Ubuntu/Debian için:
sudo apt install mongodb

# MongoDB servisini başlatın:
# Windows: MongoDB Compass ile veya manuel
# macOS/Linux:
sudo systemctl start mongodb
# veya
brew services start mongodb/brew/mongodb-community
```

#### MongoDB Atlas (Cloud - Ücretsiz)
1. https://cloud.mongodb.com/ adresine gidin
2. Ücretsiz hesap oluşturun
3. Cluster oluşturun
4. Connection string'i alın
5. `.env.local` dosyasında `MONGODB_URI`'yi güncelleyin

### 2. Proje Kurulumu

```bash
# Bağımlılıkları yükleyin
npm install

# Veritabanını başlangıç verileri ile doldurun
npm run seed

# Geliştirme sunucusunu başlatın
npm run dev
```

### 3. Environment Variables

`.env.local` dosyasında şu değişkenlerin doğru ayarlandığından emin olun:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/minecraft-admin

# JWT Secret (Production'da değiştirin!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-minecraft-admin-2025

# Discord Webhook (Mevcut)
DISCORD_WEBHOOK_URL=your-discord-webhook-url
```

## 🔐 Varsayılan Kullanıcılar

Seed işleminden sonra şu kullanıcılar oluşturulacak:

- **admin** / **admin123** (Administrator)
- **moderator** / **mod123** (Moderator)  
- **helper** / **helper123** (Helper)

## 🚀 Yeni Özellikler

### ✅ MongoDB Integration
- Kullanıcı verileri artık MongoDB'de saklanıyor
- Şifreler bcrypt ile hashleniyor
- JWT token tabanlı authentication

### ✅ Gelişmiş Güvenlik
- Password hashing (bcrypt)
- JWT token authentication
- Role-based access control
- Token expiration (7 gün)

### ✅ Admin Panel
- `/admin` sayfasında kullanıcı yönetimi
- Yeni kullanıcı oluşturma
- Kullanıcı düzenleme/silme
- Kullanıcı durumu görüntüleme

### ✅ API Endpoints
- `POST /api/login` - Kullanıcı girişi
- `GET /api/users` - Kullanıcı listesi (Admin only)
- `POST /api/users` - Yeni kullanıcı oluşturma (Admin only)
- `PUT /api/users/[id]` - Kullanıcı güncelleme
- `DELETE /api/users/[id]` - Kullanıcı silme (Admin only)

## 🛠️ MongoDB Commands

### Veritabanını sıfırlama:
```bash
# MongoDB shell'e bağlanın
mongosh minecraft-admin

# Tüm kullanıcıları silin
db.users.deleteMany({})

# Seed'i tekrar çalıştırın
npm run seed
```

### Veritabanı durumunu kontrol etme:
```bash
mongosh minecraft-admin
db.users.find().pretty()
```

## 🔧 Troubleshooting

### MongoDB bağlantı hatası:
1. MongoDB servisinin çalıştığından emin olun
2. Connection string'in doğru olduğunu kontrol edin
3. Firewall ayarlarını kontrol edin

### Seed hatası:
1. MongoDB'ye bağlantı olduğundan emin olun
2. `npm run seed` komutunu tekrar çalıştırın

### Login problemi:
1. Seed işleminin başarılı olduğunu kontrol edin
2. Doğru kullanıcı adı/şifre kombinasyonunu kullandığınızdan emin olun
3. Browser console'unda hata mesajlarını kontrol edin

## 📚 Teknoloji Stack

- **Database:** MongoDB + Mongoose
- **Authentication:** JWT + bcrypt
- **Frontend:** Next.js 14 + React
- **Styling:** Tailwind CSS
- **TypeScript:** Full type safety

## 🔗 Yararlı Linkler

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT.io](https://jwt.io/)
- [bcrypt Documentation](https://github.com/kelektiv/node.bcrypt.js)
