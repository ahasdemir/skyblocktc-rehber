const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI environment variable is not defined');
  process.exit(1);
}

// User Schema
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['admin', 'moderator', 'helper'],
    default: 'helper'
  },
  displayName: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 100
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model('User', UserSchema);

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    console.log('🌱 Starting database seeding...');
    
    // Check if users already exist
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      console.log('👥 Users already exist in database. Skipping seed.');
      await mongoose.disconnect();
      return;
    }

    // Create default users
    const defaultUsers = [
      {
        username: 'admin',
        password: 'admin123',
        role: 'admin',
        displayName: 'Administrator',
        isActive: true
      },
      {
        username: 'moderator',
        password: 'mod123',
        role: 'moderator',
        displayName: 'Moderator',
        isActive: true
      },
      {
        username: 'helper',
        password: 'helper123',
        role: 'helper',
        displayName: 'Helper',
        isActive: true
      }
    ];

    for (const userData of defaultUsers) {
      const user = new User(userData);
      await user.save();
      console.log(`✅ Created user: ${userData.username} (${userData.role})`);
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log('📝 Default users created:');
    console.log('   • admin / admin123 (Administrator)');
    console.log('   • moderator / mod123 (Moderator)');
    console.log('   • helper / helper123 (Helper)');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit();
  }
}

seedDatabase();
