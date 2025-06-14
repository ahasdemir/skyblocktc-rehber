import { NextResponse } from 'next/server';

// Discord webhook URL'ini çevre değişkeninden almanız önerilir
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || "YOUR_DISCORD_WEBHOOK_URL_HERE";

export async function POST(request: Request) {
  try {
    const { command, timestamp, admin, sessionId, browserInfo } = await request.json();
    
    // Komutu parçala
    const commandParts = command.split(' ');
    const username = commandParts[1] || "Belirtilmemiş";
    const duration = commandParts[2] || "Belirtilmemiş";
    
    // Reason'ı birleştir (3. elemandan sonraki tüm kısımlar)
    const reason = commandParts.slice(3).join(' ') || "Belirtilmemiş";
    
    // Discord webhook mesajını hazırla
    const webhookData = {
      embeds: [{
        title: "🚫 Mute İşlemi Uygulandı",
        description: `\`${command}\`\n\n**👮 Uygulayan Yetkili:** \`${admin}\``,
        color: 15548997, // Kırmızı renk
        fields: [
          {
            name: "Kullanıcı",
            value: username,
            inline: true
          },
          {
            name: "Süre",
            value: duration,
            inline: true
          },
          {
            name: "Sebep",
            value: reason,
            inline: true
          },
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