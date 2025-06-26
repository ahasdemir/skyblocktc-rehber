import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '../../../lib/jwt';

export async function POST(request: NextRequest) {
  try {
    // JWT token'ı doğrula
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Token gerekli' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Geçersiz token' }, { status: 401 });
    }

    const { sessionId, browserInfo } = await request.json();

    // Log logout to Discord webhook
    try {
      const baseUrl = process.env.NEXTAUTH_URL || `http://localhost:${process.env.PORT || 3000}`;
      const response = await fetch(`${baseUrl}/api/log-admin-logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          sessionId,
          browserInfo
        }),
      });
      
      if (!response.ok) {
        console.error('Admin çıkış bildirimi gönderilemedi');
      }
    } catch (error) {
      console.error('Admin çıkış bildirimi hatası:', error);
    }

    return NextResponse.json({
      success: true,
      message: 'Çıkış başarılı'
    });

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}
