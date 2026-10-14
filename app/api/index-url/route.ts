import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const urlToIndex = searchParams.get('url');

  if (!urlToIndex) {
    return NextResponse.json({ error: 'يرجى توفير رابط للأرشفة عبر المعلمة ?url=' }, { status: 400 });
  }

  try {
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!clientEmail || !privateKey) {
      return NextResponse.json({ error: 'متغيرات البيئة غير مكتملة في Vercel' }, { status: 500 });
    }

    const jwtClient = new google.auth.JWT(
      clientEmail,
      undefined,
      privateKey,
      ['https://www.googleapis.com/auth/indexing'],
      undefined
    );

    await jwtClient.authorize();

    const indexing = google.indexing({ version: 'v3', auth: jwtClient });

    const response = await indexing.urlNotifications.publish({
      requestBody: { url: urlToIndex, type: 'URL_UPDATED' },
    });

    return NextResponse.json({
      success: true,
      message: 'تم إرسال الرابط لأرشفة جوجل بنجاح!',
      data: response.data,
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: 'فشل في أرشفة الرابط',
      details: error.message,
    }, { status: 500 });
  }
}
