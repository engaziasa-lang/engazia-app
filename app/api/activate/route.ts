import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function POST(req: Request) {
  try {
    const { code, deviceId } = await req.json();

    if (!code || !deviceId) {
      return NextResponse.json({ success: false, message: 'الرجاء إدخال الكود' }, { status: 400 });
    }

    // ---------------------------------------------------------
    // 1. مسار الأكواد اليدوية (التي تبدأ بـ QUD-) للتحويل البنكي
    // ---------------------------------------------------------
    if (code.startsWith('QUD-')) {
      const codeKey = `code:${code}`;
      const codeData: any = await kv.get(codeKey);

      if (!codeData) {
        return NextResponse.json({ success: false, message: 'الكود اليدوي غير صحيح' }, { status: 400 });
      }

      const now = Date.now();

      if (codeData.expiresAt && now > codeData.expiresAt) {
        return NextResponse.json({ success: false, message: 'هذا الكود منتهي الصلاحية' }, { status: 400 });
      }

      if (codeData.deviceId && codeData.deviceId !== deviceId) {
        return NextResponse.json({ success: false, message: 'هذا الكود مستخدم في جهاز آخر' }, { status: 400 });
      }

      if (!codeData.deviceId) {
        codeData.deviceId = deviceId;
        codeData.activatedAt = now;
        if (codeData.durationDays) {
          codeData.expiresAt = now + (codeData.durationDays * 24 * 60 * 60 * 1000);
        }
        await kv.set(codeKey, codeData);
      }

      return NextResponse.json({ success: true, message: 'تم تفعيل اشتراكك (التحويل البنكي) بنجاح!' });
    }

    // ---------------------------------------------------------
    // 2. مسار أكواد الدفع أونلاين (Lemon Squeezy License Keys)
    // ---------------------------------------------------------
    else {
      // الاتصال ببوابة ليمون سكويزي لتفعيل الكود وربطه بجهاز الطالب
      const res = await fetch('https://api.lemonsqueezy.com/v1/licenses/activate', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          license_key: code,
          instance_name: deviceId, // هذا المتغير سيربط الكود بجهاز الطالب لمنع المشاركة
        }),
      });

      const data = await res.json();

      // إذا نجح التفعيل في البوابة
      if (data.activated || (data.meta && data.meta.message === 'License activated')) {
         return NextResponse.json({ success: true, message: 'تم تفعيل اشتراكك عبر البوابة بنجاح!' });
      } else {
         // إذا كان الكود خطأ، أو منتهي، أو تم استخدامه في جهاز آخر
         return NextResponse.json({ success: false, message: data.error || 'كود الدفع غير صحيح أو مستخدم في جهاز آخر' }, { status: 400 });
      }
    }

  } catch (error) {
    console.error('Activation Error:', error);
    return NextResponse.json({ success: false, message: 'حدث خطأ في النظام، حاول مرة أخرى' }, { status: 500 });
  }
}
