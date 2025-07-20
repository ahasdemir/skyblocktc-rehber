import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '../../../lib/jwt';
import connectDB from '../../../lib/mongodb';
import SSSQuestion from '../../../models/SSSQuestion';

// GET - Tüm aktif SSS sorularını getir (kimlik doğrulama gerektirmez)
export async function GET() {
  try {
    await connectDB();
    
    const questions = await SSSQuestion.find({ isActive: true })
      .sort({ createdAt: -1 })
      .lean();
    
    // Frontend için id field'ını düzenle
    const formattedQuestions = questions.map((q: any) => ({
      id: q._id.toString(),
      q: q.q,
      a: q.a,
      addedBy: q.addedBy,
      addedAt: q.createdAt,
      role: q.role
    }));
    
    return NextResponse.json({ 
      success: true, 
      data: formattedQuestions 
    });
  } catch (error) {
    console.error('SSS verileri getirilirken hata:', error);
    return NextResponse.json(
      { error: 'SSS verileri getirilemedi' },
      { status: 500 }
    );
  }
}

// POST - Yeni SSS sorusu ekle (Admin/Moderator gerekli)
export async function POST(request: NextRequest) {
  try {
    // Token kontrolü
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Yetkilendirme gerekli' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    
    if (!payload || !['admin', 'moderator', 'assistant', 'helper+'].includes(payload.role)) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 });
    }

    const { question, answer } = await request.json();
    
    if (!question?.trim() || !answer?.trim()) {
      return NextResponse.json({ error: 'Soru ve cevap gerekli' }, { status: 400 });
    }

    await connectDB();
    
    const newQuestion = new SSSQuestion({
      q: question.trim(),
      a: answer.trim(),
      addedBy: payload.username,
      role: payload.role,
      isActive: true
    });
    
    await newQuestion.save();
    
    // Discord webhook için notification gönder
    try {
      const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
      if (webhookUrl) {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            embeds: [{
              title: '📚 Yeni SSS Sorusu Eklendi',
              description: `**Soru:** ${question}\n**Cevap:** ${answer.substring(0, 100)}${answer.length > 100 ? '...' : ''}`,
              color: 0x00ff00,
              fields: [
                { name: 'Ekleyen', value: payload.username, inline: true },
                { name: 'Rol', value: payload.role, inline: true }
              ],
              timestamp: new Date().toISOString()
            }]
          })
        });
      }
    } catch (webhookError) {
      console.error('Discord webhook hatası:', webhookError);
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'SSS sorusu başarıyla eklendi',
      data: {
        id: newQuestion._id.toString(),
        q: newQuestion.q,
        a: newQuestion.a,
        addedBy: newQuestion.addedBy,
        role: newQuestion.role
      }
    });
  } catch (error) {
    console.error('SSS sorusu eklenirken hata:', error);
    return NextResponse.json(
      { error: 'SSS sorusu eklenemedi' },
      { status: 500 }
    );
  }
}

// DELETE - SSS sorusu sil (Sadece Admin)
export async function DELETE(request: NextRequest) {
  try {
    // Token kontrolü
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Yetkilendirme gerekli' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    
    if (!payload || !['admin', 'moderator', 'assistant'].includes(payload.role)) {
      return NextResponse.json({ error: 'SSS sorusu silebilmeniz için admin, moderator veya assistant rolüne sahip olmanız gerekir' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const questionId = searchParams.get('id');
    
    if (!questionId) {
      return NextResponse.json({ error: 'Soru ID gerekli' }, { status: 400 });
    }

    await connectDB();
    
    const deletedQuestion = await SSSQuestion.findByIdAndDelete(questionId);
    
    if (!deletedQuestion) {
      return NextResponse.json({ error: 'SSS sorusu bulunamadı' }, { status: 404 });
    }
    
    // Discord webhook için notification gönder
    try {
      const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
      if (webhookUrl) {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            embeds: [{
              title: '🗑️ SSS Sorusu Silindi',
              description: `**Silinen Soru:** ${deletedQuestion.q}`,
              color: 0xff0000,
              fields: [
                { name: 'Silen Admin', value: payload.username, inline: true }
              ],
              timestamp: new Date().toISOString()
            }]
          })
        });
      }
    } catch (webhookError) {
      console.error('Discord webhook hatası:', webhookError);
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'SSS sorusu başarıyla silindi' 
    });
  } catch (error) {
    console.error('SSS sorusu silinirken hata:', error);
    return NextResponse.json(
      { error: 'SSS sorusu silinemedi' },
      { status: 500 }
    );
  }
}
