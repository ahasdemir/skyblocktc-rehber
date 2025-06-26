# 🎮 SkyBlockTC Admin Panel

This project is a professional management panel and guide application developed for the SkyBlockTC Minecraft server. Built with secure JWT-based authentication system using MongoDB.

## ✨ Features

### 🔐 Authentication and Authorization
- **JWT Token Based Authentication**: Secure session management
- **MongoDB User Management**: Scalable user database
- **Role-based Access Control**: Admin, Moderator, Helper roles
- **Secure Password Hashing**: Password security with bcrypt

### 👥 User Management
- **Admin Panel**: Complete user CRUD operations
- **Real-time Updates**: Instant user information updates
- **Role Management**: Dynamic role assignment and management
- **Session Tracking**: Session tracking and security

### 🛠️ Management Tools
- **Mute System**: Player muting management
- **Spawner Management**: Spawner management tools
- **FAQ System**: Frequently asked questions with search
- **Discord Integration**: Automatic Discord notifications

### 📊 Logging and Monitoring
- **Discord Webhooks**: Log all admin operations to Discord
- **Session Tracking**: Detailed session tracking
- **Action Logging**: User action logging
- **Security Monitoring**: Security event monitoring

## 🚀 Installation

### Requirements
- Node.js 18+
- MongoDB Atlas account or local MongoDB
- Discord Webhook URL (optional)

### 1. Clone the Project
```bash
git clone https://github.com/ahasdemir/skyblocktc-rehber.git
cd skyblocktc-rehber
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables

Create `.env.local` file:

```bash
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/minecraft-admin

# JWT Secret Key (Create a strong key)
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-complex

# Discord Webhook (Optional)
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/your-webhook-url

# Application Settings
NODE_ENV=development
```

### 4. Initialize Database

Create initial users:

```bash
node scripts/seed.js
```

This command creates the following default users:
- **Admin**: `admin` / `admin123`
- **Moderator**: `moderator` / `mod123`
- **Helper**: `helper` / `helper123`

### 5. Start Development Server

```bash
npm run dev
```

You can view the application at [http://localhost:3000](http://localhost:3000).

## 📁 Project Structure

```
minecraft-admin/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/             # Admin panel pages
│   │   ├── api/               # API endpoints
│   │   │   ├── login/         # Login API
│   │   │   ├── users/         # User management API
│   │   │   ├── log-*/         # Logging APIs
│   │   │   └── test-*/        # Test endpoints
│   │   ├── components/        # React components
│   │   │   ├── AuthGuard.tsx  # Route protection
│   │   │   ├── AdminLogin.tsx # Login form
│   │   │   └── Header.tsx     # Navigation
│   │   ├── mute/             # Mute management
│   │   ├── spawner/          # Spawner management
│   │   └── sss/              # FAQ system
│   ├── lib/                   # Utility functions
│   │   ├── mongodb.ts        # MongoDB connection
│   │   ├── jwt.ts            # JWT utilities
│   │   └── sessionUtils.ts   # Session helpers
│   └── models/               # MongoDB models
│       └── User.ts           # User model
├── scripts/
│   └── seed.js               # Database seed script
├── docs/                     # Documentation
│   ├── AUTHENTICATION.md     # Authentication guide
│   ├── MONGODB_SETUP.md      # MongoDB setup
│   └── LOGGING_UPDATE.md     # Logging system
└── README.md
```

## 🔧 Configuration

### MongoDB Setup

1. **MongoDB Atlas** (Recommended):
   - Create [MongoDB Atlas](https://cloud.mongodb.com/) account
   - Create new cluster
   - Copy connection string
   - Add to `.env.local` file

2. **Local MongoDB**:
   ```bash
   # Run MongoDB locally
   mongod --dbpath /path/to/data
   
   # Use local connection in .env.local
   MONGODB_URI=mongodb://localhost:27017/minecraft-admin
   ```

### Discord Webhook Setup

1. Create a new webhook in your Discord server
2. Copy the webhook URL
3. Add to `.env.local` file as `DISCORD_WEBHOOK_URL`
4. Test connection with test endpoint:
   ```bash
   curl -X POST http://localhost:3000/api/test-discord-webhook
   ```

## 🎯 Usage

### Logging In
1. Login on the main page
2. Default admin: `admin` / `admin123`
3. After successful login, you'll be redirected to the panel

### Admin Panel
- **User Management**: `/admin` - User CRUD operations
- **Mute Management**: `/mute` - Player muting tools
- **Spawner Management**: `/spawner` - Spawner tools
- **FAQ System**: `/sss` - Frequently asked questions

### Logging
All admin operations are automatically logged to Discord:
- Login/logout operations
- User changes
- Mute operations
- Content copying operations

## 🛡️ Security

### Authentication
- JWT token based authentication
- 24-hour token validity period
- Automatic token refresh handling
- Secure password hashing with bcrypt

### API Security
- All API endpoints protected with JWT
- Role-based access control
- Input validation and sanitization
- Rate limiting (optional)

### Frontend Security
- Route protection with AuthGuard component
- Automatic logout on token expiry
- Secure token storage
- XSS protection

## 📊 API Documentation

### Authentication
```typescript
// Login
POST /api/login
Body: { username: string, password: string }
Response: { success: boolean, user: User, token: string }

// Logout
POST /api/logout
Headers: { Authorization: "Bearer <token>" }
Response: { success: boolean }
```

### User Management (Admin Only)
```typescript
// User list
GET /api/users
Headers: { Authorization: "Bearer <token>" }

// New user
POST /api/users
Headers: { Authorization: "Bearer <token>" }
Body: { username, displayName, password, role }

// Update user
PUT /api/users/[id]
Headers: { Authorization: "Bearer <token>" }
Body: { username?, displayName?, password?, role? }

// Delete user
DELETE /api/users/[id]
Headers: { Authorization: "Bearer <token>" }
```

### Logging
```typescript
// Discord webhook test
POST /api/test-discord-webhook
Response: { success: boolean, message: string }

// Admin operation logging
POST /api/log-admin-login
POST /api/log-admin-logout
POST /api/log-admin-name-change
POST /api/log-mute
POST /api/log-sss-copy
```

## 🔄 Development

### Adding New Features
1. **API Endpoint**: Add JWT authentication
2. **Frontend Component**: Use AuthGuard
3. **Logging**: Discord webhook integration
4. **Tests**: Appropriate test coverage

### Code Standards
- TypeScript usage mandatory
- ESLint and Prettier configuration
- Consistent naming conventions
- Comprehensive error handling

### Build and Deploy
```bash
# Production build
npm run build

# Production server
npm start

# Lint check
npm run lint

# Type check
npm run type-check
```

## 🧪 Testing

### Discord Webhook Test
```bash
# Check webhook configuration
curl http://localhost:3000/api/test-discord-webhook

# Send test message
curl -X POST http://localhost:3000/api/test-discord-webhook
```

### Database Test
```bash
# Run seed script
node scripts/seed.js

# Test MongoDB connection
npm run test:db
```

## 📋 TODO

### Short Term
- [ ] Rate limiting implementation
- [ ] Refresh token system
- [ ] Email notification system
- [ ] Audit log system

### Long Term
- [ ] Multi-factor authentication
- [ ] OAuth integration (Discord, Google)
- [ ] Mobile responsive improvements
- [ ] API documentation with Swagger

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   ```bash
   # Check connection string
   echo $MONGODB_URI
   
   # Check MongoDB Atlas IP whitelist
   ```

2. **JWT Token Error**
   ```bash
   # Clear token from localStorage
   localStorage.removeItem('authToken');
   
   # Login again
   ```

3. **Discord Webhook 404**
   ```bash
   # Test webhook URL
   curl -X POST http://localhost:3000/api/test-discord-webhook
   
   # Check Discord webhook settings
   ```

### Log Control
```bash
# Development logs
npm run dev

# Production logs
npm run start

# Detailed debug
DEBUG=* npm run dev
```

## 📄 License

This project is licensed under the [MIT License](./LICENSE).

## 🤝 Contributing

1. Fork the project
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Create Pull Request

## 📞 Support

- 📧 Email: support@skyblocktc.com
- 💬 Discord: [SkyBlockTC Discord](https://discord.gg/skyblocktc)
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/minecraft-admin/issues)

## 🙏 Acknowledgments

- Next.js team for the framework
- MongoDB team for database solution
- Discord for webhook support
- All contributors

---

**SkyBlockTC Admin Panel** - Modern web application that professionalizes Minecraft server management. 🎮✨
