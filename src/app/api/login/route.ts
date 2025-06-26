import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import User from '../../../models/User';
import { signToken } from '../../../lib/jwt';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Kullanıcı adı ve şifre gerekli' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Find user by username (exact match, case sensitive)
    const user = await User.findOne({ 
      username: username.trim(),
      isActive: true 
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Geçersiz kullanıcı adı veya şifre' },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Geçersiz kullanıcı adı veya şifre' },
        { status: 401 }
      );
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = signToken({
      userId: user._id.toString(),
      username: user.username,
      role: user.role
    });

    // Return user info and token
    const userInfo = {
      id: user._id.toString(),
      username: user.username,
      role: user.role,
      lastLogin: user.lastLogin
    };

    return NextResponse.json({
      success: true,
      user: userInfo,
      token,
      message: 'Giriş başarılı'
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}
