import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('X-Signature') || '';
    const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET || '';

    const hmac = crypto.createHmac('sha256', secret);
    const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
    const signatureBuffer = Buffer.from(signature, 'utf8');

    if (digest.length !== signatureBuffer.length || !crypto.timingSafeEqual(digest, signatureBuffer)) {
      return NextResponse.json({ error: 'مرفوض' }, { status: 401 });
    }

    const data = JSON.parse(rawBody);

    if (data.meta.event_name === 'license_key_created') {
      const licenseKey = data.data.attributes.key; 

      // بما أنك ربطت Vercel بـ Upstash، هذه المتغيرات موجودة تلقائياً
      const kvUrl = process.env.KV_REST_API_URL;
      const kvToken = process.env.KV_REST_API_TOKEN;

      if (!kvUrl || !kvToken) {
        return NextResponse.json({ error: 'إعدادات القاعدة ناقصة' }, { status: 500 });
      }

      const value = JSON.stringify({ status: 'unused' });

      await fetch(`${kvUrl}/set/code:${licenseKey}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${kvToken}`,
          'Content-Type': 'application/json'
        },
        body: value
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: 'خطأ' }, { status: 500 });
  }
}
