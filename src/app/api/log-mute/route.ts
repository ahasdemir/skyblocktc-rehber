import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { command, timestamp, admin } = await request.json();
    
    // Log dosyasının yolu
    const logPath = path.join(process.cwd(), 'public', 'mute-logs.txt');
    
    // Log formatı: Tarih | Yetkili | Komut
    const logEntry = `${timestamp} | ${admin} | ${command}\n`;
    
    // Dosyaya ekle
    fs.appendFileSync(logPath, logEntry);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Loglama hatası:', error);
    return NextResponse.json(
      { error: 'Loglama işlemi başarısız oldu' },
      { status: 500 }
    );
  }
} 