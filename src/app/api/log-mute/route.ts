import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

export async function POST(request: NextRequest) {
  try {
    // Auth token kontrolü
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'Token bulunamadı' }, { status: 401 });
    }

    // JWT token doğrulama
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as any;
    } catch (error) {
      return NextResponse.json({ error: 'Geçersiz token' }, { status: 401 });
    }

    const body = await request.json();
    const { command, timestamp, sessionId, browserInfo } = body;

    // Discord webhook'a gönder
    if (DISCORD_WEBHOOK_URL) {
      const embed = {
        embeds: [{
          title: "🔇 Mute Komutu Uygulandı",
          description: `\`\`\`${command}\`\`\``,
          color: 16744448, // Turuncu renk
          fields: [
            {
              name: "👤 Yetkili",
              value: decoded.username,
              inline: true
            },
            {
              name: "🌐 Session ID",
              value: sessionId || "Bilinmiyor",
              inline: true
            },
            {
              name: "🕒 Zaman",
              value: new Date(timestamp).toLocaleString('tr-TR'),
              inline: false
            },
            {
              name: "💻 Tarayıcı Bilgisi",
              value: `${browserInfo?.browser || 'Bilinmiyor'} - ${browserInfo?.os || 'Bilinmiyor'}`,
              inline: false
            }
          ],
          timestamp: new Date().toISOString()
        }]
      };

      await fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(embed),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Mute log hatası:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}