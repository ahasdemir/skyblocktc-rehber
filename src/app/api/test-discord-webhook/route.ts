import { NextResponse } from 'next/server';

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || "YOUR_DISCORD_WEBHOOK_URL_HERE";

export async function POST() {
  try {
    const testData = {
      embeds: [{
        title: "🧪 Discord Webhook Test",
        description: "This is a test message to verify Discord webhook connectivity.",
        color: 3447003, // Blue
        timestamp: new Date().toISOString(),
        footer: {
          text: "SkyBlockTC Test Message"
        }
      }]
    };

    console.log('Testing Discord webhook URL:', DISCORD_WEBHOOK_URL?.slice(0, 50) + '...');
    
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    console.log('Discord webhook response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Discord webhook error response:', errorText);
      throw new Error(`Discord webhook yanıtı başarısız: ${response.status} - ${errorText}`);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Discord webhook test başarılı!',
      status: response.status 
    });
  } catch (error) {
    console.error('Discord webhook test hatası:', error);
    return NextResponse.json(
      { 
        error: 'Discord webhook test başarısız', 
        details: error instanceof Error ? error.message : 'Bilinmeyen hata'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Discord webhook test endpoint. POST request ile test edebilirsiniz.',
    webhookConfigured: !!process.env.DISCORD_WEBHOOK_URL && process.env.DISCORD_WEBHOOK_URL !== "YOUR_DISCORD_WEBHOOK_URL_HERE"
  });
}
