import { NextResponse } from 'next/server';
import { getSessionId, getBrowserInfo } from '../../../lib/sessionUtils';

// Discord webhook URL'ini çevre değişkeninden almanız önerilir
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || "YOUR_DISCORD_WEBHOOK_URL_HERE";

export async function POST(request: Request) {
  try {
    const { question, adminName, timestamp, sessionId, browserInfo } = await request.json();
    
    // Discord webhook mesajını hazırla
    const webhookData = {
      embeds: [{
        title: "📋 SSS Sorusu Kopyalandı",
        description: `**${adminName || "İsimsiz Yetkili"}** şu soruyu kopyaladı:\n"${question}"`,
        color: 15844367, // Sarı renk
        fields: [
          {
            name: "🔍 Session ID",
            value: `\`${sessionId}\``,
            inline: true
          },
          {
            name: "🌐 Tarayıcı",
            value: browserInfo,
            inline: true
          }
        ],
        timestamp: timestamp
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
