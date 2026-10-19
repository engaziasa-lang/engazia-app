import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

// الاتصال بقاعدة البيانات
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function POST(request: Request) {
  try {
    const { code, deviceId } = await request.json();

    if (!code || !deviceId) {
      return NextResponse.json({ success: false, message: 'الكود ومعرف الجهاز مطلوبان' }, { status: 400 });
    }

    const upperCode = code.trim().toUpperCase();

    // البحث عن الكود في قاعدة البيانات
    const codeData = await redis.get(`code:${upperCode}`);

    if (!codeData) {
      return NextResponse.json({ success: false, message: 'الكود غير صحيح أو غير موجود.' }, { status: 404 });
    }

    const data: any = typeof codeData === 'string' ? JSON.parse(codeData) : codeData;

    // إذا كان الكود جديداً ولم يُستخدم
    if (data.status === 'unused') {
      await redis.set(`code:${upperCode}`, {
        status: 'used',
        boundDevice: deviceId,
        activatedAt: new Date().toISOString()
      });
      return NextResponse.json({ success: true, message: '🎉 تم التفعيل بنجاح! تم ربط الاشتراك بهذا الجهاز.' });
    } 
    
    // إذا كان الكود مستخدماً
    else if (data.status === 'used') {
      if (data.boundDevice === deviceId) {
        return NextResponse.json({ success: true, message: 'مرحباً بعودتك! تم التحقق من جهازك بنجاح.' });
      } else {
        return NextResponse.json({ success: false, message: 'عذراً، هذا الكود مستخدم ومسجل على جهاز آخر!' }, { status: 403 });
      }
    }

    return NextResponse.json({ success: false, message: 'حالة الكود غير معروفة.' }, { status: 500 });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ success: false, message: 'حدث خطأ في الخادم أثناء التحقق.' }, { status: 500 });
  }
}
