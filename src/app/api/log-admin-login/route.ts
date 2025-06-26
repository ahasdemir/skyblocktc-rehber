import { NextResponse } from 'next/server';

// Discord webhook URL'ini çevre değişkeninden alın
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || "YOUR_DISCORD_WEBHOOK_URL_HERE";

export async function POST(request: Request) {
  try {
    const { admin, username, role, timestamp, sessionId, browserInfo } = await request.json();
    
    // Role-based color and emoji
    const roleData = {
      admin: { color: 15158332, emoji: '👑' }, // Red
      moderator: { color: 16776960, emoji: '🛡️' }, // Yellow  
      helper: { color: 3447003, emoji: '🆘' } // Blue
    };
    
    const { color, emoji } = roleData[role as keyof typeof roleData] || roleData.helper;
    
    // Discord webhook mesajını hazırla
    const webhookData = {
      embeds: [{
        title: `${emoji} Yetkili Giriş Bildirimi`,
        description: `**${admin}** yetkili panele giriş yaptı.`,
        color: color,
        fields: [
          {
            name: "👤 Kullanıcı Bilgileri",
            value: `**Görünen Ad:** ${admin}\n**Kullanıcı Adı:** ${username}\n**Rol:** ${role.toUpperCase()}`,
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
      { error: 'Loglama işlemi başarısız oldu' },
      { status: 500 }
    );
  }
}