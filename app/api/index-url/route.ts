import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET(request: Request) {
  try {
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    const jwtClient = new google.auth.JWT(
      clientEmail, undefined, privateKey,
      ['https://www.googleapis.com/auth/siteverification'], undefined
    );
    await jwtClient.authorize();

    const siteVerification = google.siteVerification({ version: 'v1', auth: jwtClient });
    const { searchParams } = new URL(request.url);

    // الخطوة الثانية: تأكيد الملكية
    if (searchParams.get('step') === '2') {
      const insertResponse = await siteVerification.webResource.insert({
        verificationMethod: 'FILE',
        requestBody: { site: { identifier: 'https://engazia-app.vercel.app/', type: 'SITE' } }
      });
      return NextResponse.json({ success: true, message: '🎉 مبروك! أصبح حساب الخدمة مالكاً بنجاح.' });
    }

    // الخطوة الأولى: جلب ملف التوثيق
    const tokenResponse = await siteVerification.webResource.getToken({
      requestBody: {
        verificationMethod: 'FILE',
        site: { identifier: 'https://engazia-app.vercel.app/', type: 'SITE' }
      }
    });

    return NextResponse.json({
      message: 'انسخ اسم الملف والمحتوى، وأنشئه داخل مجلد public في مشروعك.',
      fileName: tokenResponse.data.token,
      fileContent: `google-site-verification: ${tokenResponse.data.token}`
    });

  } catch (error: any) {
    return NextResponse.json({ error: 'حدث خطأ', details: error.message }, { status: 500 });
  }
}
