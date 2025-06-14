import { NextResponse } from 'next/server';

// Discord webhook URL'ini çevre değişkeninden alın
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || "https://discord.com/api/webhooks/1383456153828200478/13Vn7ckBkG-wCNjXI1GqcZZ6nxnyTS87NgVlTn-YkoC8plysQ2mGzFAJ_JHkzitGSeDa";

export async function POST(request: Request) {
  try {
    const { oldName, newName, timestamp, sessionId, browserInfo } = await request.json();
    
    // Discord webhook mesajını hazırla
    const webhookData = {
      embeds: [{
        title: "🔄 Yetkili İsmi Değiştirildi",
        description: `**${oldName}** isimli yetkili ismini **${newName}** olarak değiştirdi.`,
        color: 3447003, // Mavi renk
        timestamp: timestamp,
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