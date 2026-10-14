import { NextResponse } from 'next/server';
import { google } from 'googleapis';

// الحد الأقصى للروابط في كل تشغيل (حسب سياسة جوجل)
const BATCH_SIZE = 200;

export async function GET(request: Request) {
  // 1. التحقق من أن الطلب قادم من Vercel Cron
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('غير مصرح', { status: 401 });
  }

  try {
    // 2. قراءة خريطة الموقع الخاصة بك
    const sitemapUrl = 'https://engazia-app.vercel.app/sitemap.xml';
    const sitemapResponse = await fetch(sitemapUrl);
    
    if (!sitemapResponse.ok) {
        return NextResponse.json({ error: 'لم نتمكن من الوصول لخريطة الموقع' }, { status: 500 });
    }

    const sitemapXml = await sitemapResponse.text();
    
    // استخراج جميع الروابط من الخريطة باستخدام تعبير نمطي بسيط
    const urlMatches = sitemapXml.match(/<loc>(.*?)<\/loc>/g);
    let allUrls: string[] = [];
    
    if (urlMatches) {
        allUrls = urlMatches.map(match => match.replace(/<\/?loc>/g, ''));
    }

    if (allUrls.length === 0) {
         return NextResponse.json({ message: 'لم يتم العثور على روابط في خريطة الموقع' });
    }

    // هنا نحن نأخذ أول 200 رابط. 
    // في نظام متقدم، سنحتاج لربط هذا بقاعدة بيانات لمعرفة الروابط التي تم إرسالها سابقاً.
    // لكن للبدء، سنرسل الـ 200 رابط.
    const urlsToIndex = allUrls.slice(0, BATCH_SIZE);

    // 3. إعداد الاتصال بجوجل
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!clientEmail || !privateKey) {
      return NextResponse.json({ error: 'بيانات الاعتماد غير مكتملة' }, { status: 500 });
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

    // 4. إرسال الروابط لجوجل (بشكل متزامن لتجنب الحظر)
    let successCount = 0;
    let failCount = 0;

    for (const url of urlsToIndex) {
        try {
            await indexing.urlNotifications.publish({
                requestBody: { url: url, type: 'URL_UPDATED' },
            });
            successCount++;
        } catch (e) {
            console.error(`فشل أرشفة ${url}:`, e);
            failCount++;
        }
    }

    return NextResponse.json({
      success: true,
      message: `اكتملت العملية الآلية. تم إرسال ${successCount} رابط بنجاح. فشل ${failCount}.`,
      processedUrls: urlsToIndex.length
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: 'حدث خطأ في النظام الآلي',
      details: error.message,
    }, { status: 500 });
  }
}
