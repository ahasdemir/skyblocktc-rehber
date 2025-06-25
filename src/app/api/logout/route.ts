import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { user, sessionId, browserInfo } = await request.json();

    // Log logout to Discord webhook (if you have one)
    try {
      const response = await fetch('/api/log-admin-logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          admin: user?.displayName,
          username: user?.username,
          role: user?.role,
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
