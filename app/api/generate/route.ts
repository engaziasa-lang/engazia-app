import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

const ADMIN_SECRET = 'rakan2026'; 

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const pass = searchParams.get('pass');
  const count = Number(searchParams.get('count')) || 1000; // الافتراضي أصبح 1000 كود
  const days = Number(searchParams.get('days')) || 365; // الافتراضي 365 يوم

  if (pass !== ADMIN_SECRET) {
    return new NextResponse('غير مصرح لك بالدخول', { status: 401 });
  }

  const generatedCodes: string[] = [];
  const promises = [];
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    const randomString = () => Math.random().toString(36).substring(2, 6).toUpperCase();
    const newCode = `QUD-${randomString()}-${randomString()}`;
    
    generatedCodes.push(newCode);

    const codeData = {
      durationDays: days,
      deviceId: null, 
      createdAt: now,
      expiresAt: null 
    };

    // حفظ الأكواد دفعة واحدة بسرعة عالية
    promises.push(kv.set(`code:${newCode}`, codeData));
  }

  await Promise.all(promises);

  // إخراج الأكواد كنص عادي (قائمة طولية) ليسهل نسخها إلى إكسيل
  const header = `تم إنشاء ${count} كود بنجاح (صلاحية ${days} يوم من أول استخدام)\n\n`;
  const textOutput = header + generatedCodes.join('\n');

  return new NextResponse(textOutput, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
