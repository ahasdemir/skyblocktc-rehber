import { NextResponse } from 'next/server';
import { verifyToken } from '../../../lib/jwt';

// Discord webhook URL'ini çevre değişkeninden alın
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || "YOUR_DISCORD_WEBHOOK_URL_HERE";

export async function POST(request: Request) {
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

    const { timestamp, sessionId, browserInfo } = await request.json();
    
    // Role-based color and emoji
    const roleData = {
      admin: { color: 15158332, emoji: '👑' }, // Red
      moderator: { color: 16776960, emoji: '🛡️' }, // Yellow
      helper: { color: 3447003, emoji: '🆘' } // Blue
    };

    const { color, emoji } = roleData[decoded.role as keyof typeof roleData] || roleData.helper;
    
    // Discord webhook mesajını hazırla
    const webhookData = {
      embeds: [{
        title: `${emoji} 👋 Yetkili Çıkış Bildirimi`,
        description: `**${decoded.username}** yetkili panelden çıkış yaptı.`,
        color: color,
        fields: [
          {
            name: "👤 Kullanıcı Bilgileri",
            value: `**Kullanıcı Adı:** ${decoded.username}\n**Rol:** ${decoded.role.toUpperCase()}`,
            inline: true
          },
          {
            name: "🌐 Oturum Bilgileri", 
            value: `**Session ID:** \`${sessionId?.slice(0, 12)}...\`\n**Tarayıcı:** ${browserInfo?.browser || 'Bilinmiyor'}\n**Platform:** ${browserInfo?.platform || 'Bilinmiyor'}`,
            inline: true
          }
        ],
        timestamp: timestamp,
        footer: {
          text: "SkyBlockTC MongoDB Auth System"
        }
      }]
    };
    
    // Discord webhook'una POST isteği gönder
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookData),
    });
    
    if (!response.ok) {
      throw new Error(`Discord webhook yanıtı başarısız: ${response.status}`);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Discord webhook hatası:', error);
    return NextResponse.json(
      { error: 'Çıkış bildirimi başarısız oldu' },
      { status: 500 }
    );
  }
}
