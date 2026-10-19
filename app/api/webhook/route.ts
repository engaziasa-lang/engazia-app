import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('X-Signature') || '';
    
    // كلمة المرور السرية التي سنضعها في Vercel
    const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET || '';

    // التحقق من أن الطلب قادم فعلاً من Lemon Squeezy
    const hmac = crypto.createHmac('sha256', secret);
    const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
    const signatureBuffer = Buffer.from(signature, 'utf8');

    if (digest.length !== signatureBuffer.length || !crypto.timingSafeEqual(digest, signatureBuffer)) {
      return NextResponse.json({ error: 'مرفوض' }, { status: 401 });
    }

    const data = JSON.parse(rawBody);

    // إذا كان الحدث هو: إنشاء كود تفعيل جديد
    if (data.meta.event_name === 'license_key_created') {
      const licenseKey = data.data.attributes.key; 

      // جلب بيانات الاتصال بقاعدة Upstash (تدعم كلاً من متغيرات Vercel الافتراضية و Upstash)
      const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
      const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

      if (!kvUrl || !kvToken) {
        console.error('مفاتيح قاعدة البيانات غير متوفرة في Vercel');
        return NextResponse.json({ error: 'إعدادات القاعدة ناقصة' }, { status: 500 });
      }

      // إعداد الكود كـ "غير مستخدم"
      const value = JSON.stringify({ status: 'unused' });

      // حفظ الكود مباشرة في قاعدة البيانات
      await fetch(`${kvUrl}/set/code:${licenseKey}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${kvToken}`,
          'Content-Type': 'application/json'
        },
        body: value
      });
      
      console.log('تم تسجيل الكود بنجاح في قاعدة البيانات:', licenseKey);
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}
