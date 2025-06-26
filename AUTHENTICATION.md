# SkyBlockTC Admin Panel - Authentication System

## 🔐 Authentication Overview

This project provides a secure admin panel using MongoDB-based user management and JWT (JSON Web Token) authentication.

## 🏗️ System Architecture

### Authentication Components

1. **MongoDB Database**: Secure storage of user information and passwords
2. **JWT Token**: Session management and API authentication
3. **bcryptjs**: Password hashing and verification
4. **AuthGuard**: Frontend route protection
5. **Middleware**: API endpoint protection

### User Roles

- **👑 Admin**: Full permissions (all features + user management)
- **🛡️ Moderator**: Mid-level permissions
- **🆘 Helper**: Basic assistance permissions

## 🚀 Installation and Configuration

### Required Packages

```bash
npm install mongoose bcryptjs jsonwebtoken dotenv
npm install --save-dev @types/bcryptjs @types/jsonwebtoken
```

### Environment Variables (.env.local)

```bash
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name

# JWT Secret Key
JWT_SECRET=your-super-secret-jwt-key-here

# Discord Webhook (Optional)
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/your-webhook-url

# Application Settings
NODE_ENV=development
```

### Initial Setup

1. **Database Setup**: Create MongoDB Atlas account or install local MongoDB
2. **Setup Environment Variables**: Configure `.env.local` file
3. **Create Initial Users**: Run seed script

```bash
node scripts/seed.js
```

## 👥 User Management

### Default Users

When seed script is run, the following users are created:

```javascript
// Admin User
{
  username: "admin",
  displayName: "Main Admin",
  password: "admin123", // Stored as hash
  role: "admin"
}

// Moderator User
{
  username: "moderator",
  displayName: "Moderator",
  password: "mod123",
  role: "moderator"
}

// Helper User
{
  username: "helper",
  displayName: "Helper",
  password: "helper123",
  role: "helper"
}
```

### User CRUD Operations

Admin users can manage users from `/admin` panel:
- ✅ Create new users
- ✅ Edit existing users
- ✅ Delete users
- ✅ Change roles

## 🔑 JWT Token System

### Token Structure

```javascript
{
  id: "user_id",
  username: "username",
  displayName: "Display Name",
  role: "admin|moderator|helper",
  iat: 1640995200, // Issued at
  exp: 1641081600  // Expires in 24 hours
}
```

### Token Management

- **Storage**: `localStorage.setItem('authToken', token)`
- **Access**: `localStorage.getItem('authToken')`
- **Cleanup**: `localStorage.removeItem('authToken')`
- **Validity**: 24 hours (1 day)

## 🛡️ Security Features

### Frontend Security

1. **AuthGuard Component**: Protects all pages
2. **Token Validation**: Token checked on every page load
3. **Auto Logout**: For invalid/expired tokens
4. **Route Protection**: Prevents access without authentication

### Backend Security

1. **JWT Validation**: On all API endpoints
2. **Password Hashing**: Secure password storage with bcrypt
3. **Role-based Access**: Role-based permission control
4. **Input Validation**: Input data validation

## 📊 API Endpoints

### Authentication

```typescript
POST /api/login
Body: { username: string, password: string }
Response: { success: boolean, user: User, token: string }

POST /api/logout
Headers: { Authorization: "Bearer <token>" }
Body: { sessionId: string, browserInfo: object }
Response: { success: boolean }
```

### User Management (Admin Only)

```typescript
GET /api/users
Headers: { Authorization: "Bearer <token>" }
Response: { users: User[] }

POST /api/users
Headers: { Authorization: "Bearer <token>" }
Body: { username, displayName, password, role }
Response: { success: boolean, user: User }

PUT /api/users/[id]
Headers: { Authorization: "Bearer <token>" }
Body: { username?, displayName?, password?, role? }
Response: { success: boolean, user: User }

DELETE /api/users/[id]
Headers: { Authorization: "Bearer <token>" }
Response: { success: boolean }
```

## 📝 Logging and Monitoring

### Discord Webhook Integration

All admin actions are logged to Discord:

- **🔐 Login/Logout**: User session operations
- **👤 User Operations**: CRUD operations
- **⚡ System Operations**: Mute, spawner etc.
- **📋 Content Operations**: FAQ copying

### Log Features

- **Role-based Colors**: Different color for each role
- **Detailed Information**: User, session, browser information
- **Security**: Session IDs shown truncated
- **Timestamps**: All operations timestamped

## 🔧 Debugging

### Discord Webhook Test

```bash
# Check webhook status
GET /api/test-discord-webhook

# Send test message
POST /api/test-discord-webhook
```

### Common Issues

1. **Token Error**: Token expired or invalid
2. **MongoDB Connection**: Connection string incorrect
3. **Webhook 404**: Discord webhook URL invalid
4. **Role Permission**: User doesn't have sufficient permissions

### Error Solutions

```javascript
// Token refresh
localStorage.removeItem('authToken');
window.location.reload();

// Connection check
console.log('MongoDB URI:', process.env.MONGODB_URI);

// Webhook test
fetch('/api/test-discord-webhook', { method: 'POST' });
```

## 🚀 Production Ready

### Security Checklist

- ✅ `.env.local` file not included in git
- ✅ JWT_SECRET is strong and unique
- ✅ MongoDB connection protected with SSL
- ✅ All passwords hashed
- ✅ API endpoints protected with JWT
- ✅ Frontend routes protected with AuthGuard

### Performance Optimizations

- ✅ JWT token refreshes every 24 hours
- ✅ MongoDB connection pooling active
- ✅ Complete error handling and logging

### Backup Strategy

1. **MongoDB Backup**: Regular database backups
2. **Environment Variables**: Secure environment variables backup
3. **Application Code**: Git repository backup

## 📚 Developer Notes

### Adding New Features

1. **API Endpoint**: Add JWT validation
2. **Frontend Component**: Use AuthGuard
3. **Role Control**: Check required roles
4. **Logging**: Add Discord webhook integration

### Code Standards

- TypeScript must be used
- Error handling mandatory
- JWT validation on all APIs
- Consistent naming conventions

---

## 📞 Support

For any issues:
1. Check console logs
2. Inspect Network tab
3. Test MongoDB connection
4. Check JWT token validity