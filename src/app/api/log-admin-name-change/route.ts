import { NextResponse } from 'next/server';

// Discord webhook URL'ini çevre değişkeninden alın
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || "YOUR_DISCORD_WEBHOOK_URL_HERE";

export async function POST(request: Request) {
  try {
    const { oldName, newName, timestamp } = await request.json();
    
    // Discord webhook mesajını hazırla
    const webhookData = {
      embeds: [{
        title: "🔄 Yetkili İsmi Değiştirildi",
        description: `**${oldName}** isimli yetkili ismini **${newName}** olarak değiştirdi.`,
        color: 3447003, // Mavi renk
        timestamp: timestamp,
        footer: {
          text: "SkyBlockTC Yönetim Paneli"
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
      { error: 'İsim değişikliği logu başarısız oldu' },
      { status: 500 }
    );
  }
}