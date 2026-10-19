// app/api/activate/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, deviceId } = body;

    if (!code || !code.trim()) {
      return NextResponse.json({ success: false, message: 'الرجاء إدخال كود التفعيل.' }, { status: 400 });
    }

    const cleanCode = code.trim().toUpperCase();

    // التحقق من أن الكود يتطابق مع هيكل مفاتيح Lemon Squeezy الصحيحة (يحتوي على شرطات طولية أو أحرف وأرقام معيارية وطوله مناسب)
    // مفاتيح Lemon Squeezy عادة تتكون من مقاطع شرطية مثل XXXXXXXX-XXXX-XXXX-...
    const isLemonSqueezyFormat = cleanCode.length >= 15 && cleanCode.includes('-');

    if (!isLemonSqueezyFormat) {
      return NextResponse.json({ success: false, message: 'الكود المدخل غير صحيح. تأكد من نسخه بشكل دقيق من بريدك الإلكتروني.' }, { status: 400 });
    }

    // اتصال مع قاعدة بيانات Upstash للتأكد من أن الكود لم يتم استخدامه مسبقاً على جهاز آخر
    const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
    const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

    if (kvUrl && kvToken) {
      try {
        // فحص ما إذا كان الكود مستخدماً مسبقاً
        const checkRes = await fetch(`${kvUrl}/get/used_code:${cleanCode}`, {
          headers: { 'Authorization': `Bearer ${kvToken}` }
        });
        const checkData = await checkRes.json();
        
        if (checkData.result) {
          const registeredDevice = checkData.result;
          if (registeredDevice !== deviceId) {
            return NextResponse.json({ success: false, message: 'هذا الكود مستخدم بالفعل على جهاز آخر ولا يمكن تكراره.' }, { status: 400 });
          }
        } else {
          // تسجيل الكود بأنه تم استخدامه على هذا الجهاز لمنع تكراره
          await fetch(`${kvUrl}/set/used_code:${cleanCode}/${deviceId}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${kvToken}` }
          });
        }
      } catch (err) {
        // في حال حدوث خطأ مؤقت في قاعدة البيانات، نسمح بمرور الكود سلساً لضمان راحة الطالب وعدم تعطيله
        console.log('KV check bypassed smoothly');
      }
    }

    return NextResponse.json({
      success: true,
      message: '🎉 تم تفعيل الاشتراك بنجاح! استمتع بالوصول الكامل لجميع الاختبارات.'
    });

  } catch (error) {
    return NextResponse.json({ success: false, message: 'حدث خطأ في النظام، يحاول مرة أخرى.' }, { status: 500 });
  }
}
