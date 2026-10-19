// app/api/activate/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { code, deviceId } = await request.json();

    if (!code || !deviceId) {
      return NextResponse.json({ success: false, message: 'الرجاء إدخال كود التفعيل وبصمة الجهاز.' }, { status: 400 });
    }

    const licenseKey = code.trim();

    // إرسال طلب تحقق وتفعيل إلى API الخاص بـ Lemon Squeezy مباشرة
    const response = await fetch('https://api.lemonsqueezy.com/v1/licenses/activate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: new URLSearchParams({
        license_key: licenseKey,
        instance_id: deviceId, // بصمة جهاز الطالب لمنع تكراره من متجر Lemon Squeezy
      }),
    });

    const data = await response.json();

    if (data.activated) {
      // تم التفعيل بنجاح وربط المفتاح بهذا الجهاز فقط
      return NextResponse.json({ 
        success: true, 
        message: '🎉 تم تفعيل الاشتراك بنجاح! استمتع بالوصول الكامل لجميع الاختبارات.' 
      });
    } else {
      // المفتاح خاطئ أو مستخدم مسبقاً على جهاز آخر ووصل للحد الأقصى المسموح (1)
      return NextResponse.json({ 
        success: false, 
        message: data.error || 'عذراً، كود التفعيل غير صحيح أو مستخدم بالفعل على جهاز آخر.' 
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Lemon Squeezy Activation Error:', error);
    return NextResponse.json({ success: false, message: 'حدث خطأ أثناء الاتصال ببوابة الدفع، حاول مرة أخرى.' }, { status: 500 });
  }
}
