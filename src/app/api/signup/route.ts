import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { signToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Input validation
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Kullanıcı adı ve şifre gereklidir' },
        { status: 400 }
      );
    }

    // Username validation (3-20 characters, allow any characters)
    if (username.length < 3 || username.length > 20) {
      return NextResponse.json(
        { error: 'Kullanıcı adı 3-20 karakter arasında olmalıdır' },
        { status: 400 }
      );
    }

    // Password validation (minimum 6 characters)
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Şifre en az 6 karakter olmalıdır' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Bu kullanıcı adı zaten kullanılıyor, lütfen farklı bir ad deneyin' },
        { status: 409 }
      );
    }

    // Create new user with helper role (password will be hashed by pre('save') middleware)
    const newUser = new User({
      username,
      password, // Don't hash here, let the model middleware handle it
      role: 'helper', // Automatically assign helper role
      createdAt: new Date(),
      lastLogin: new Date()
    });

    await newUser.save();

    // Generate JWT token
    const token = signToken({
      userId: newUser._id.toString(),
      username: newUser.username,
      role: newUser.role
    });

    // Log the signup to Discord webhook if configured
    try {
      if (process.env.DISCORD_WEBHOOK_URL) {
        const webhookPayload = {
          embeds: [{
            title: "🆕 Yeni Rehber Kaydı",
            description: `Yönetim paneline yeni bir rehber kaydoldu`,
            color: 0x00ff00,
            fields: [
              {
                name: "Kullanıcı Adı",
                value: newUser.username,
                inline: true
              },
              {
                name: "Rol",
                value: "Rehber",
                inline: true
              },
              {
                name: "Kayıt Zamanı",
                value: new Date().toLocaleString('tr-TR', {
                  timeZone: 'Europe/Istanbul',
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit'
                }),
                inline: false
              }
            ],
            timestamp: new Date().toISOString()
          }]
        };

        await fetch(process.env.DISCORD_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(webhookPayload)
        });
      }
    } catch (webhookError) {
      console.error('Discord webhook error:', webhookError);
      // Don't fail the signup if webhook fails
    }

    // Return success response without password
    const userResponse = {
      id: newUser._id.toString(),
      username: newUser.username,
      role: newUser.role,
      createdAt: newUser.createdAt
    };

    return NextResponse.json({
      success: true,
      message: 'Rehber hesabı başarıyla oluşturuldu',
      user: userResponse,
      token
    });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}
