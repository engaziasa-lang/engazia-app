import { NextResponse } from 'next/server';
import { google } from 'googleapis';

const BATCH_SIZE = 50;

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('غير مصرح', { status: 401 });
  }

  try {
    const sitemapUrl = 'https://engazia-app.vercel.app/sitemap.xml';
    const sitemapResponse = await fetch(sitemapUrl);
    
    if (!sitemapResponse.ok) {
        return NextResponse.json({ error: 'لم نتمكن من الوصول لخريطة الموقع' }, { status: 500 });
    }

    const sitemapXml = await sitemapResponse.text();
    const urlMatches = sitemapXml.match(/<loc>(.*?)<\/loc>/g);
    let allUrls: string[] = [];
    
    if (urlMatches) {
        // استخراج الروابط مع تنظيفها من أي مسافات مخفية
        allUrls = urlMatches.map(match => match.replace(/<\/?loc>/g, '').trim());
    }

    if (allUrls.length === 0) {
         console.log('لم يتم العثور على روابط.');
         return NextResponse.json({ message: 'لم يتم العثور على روابط' });
    }

    const urlsToIndex = allUrls.slice(0, BATCH_SIZE);

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

    let successCount = 0;
    let failCount = 0;

    const publishPromises = urlsToIndex.map(async (url) => {
      try {
        await indexing.urlNotifications.publish({
          requestBody: { url: url, type: 'URL_UPDATED' },
        });
        successCount++;
      } catch (e: any) {
        // هنا سيتم طباعة الرابط الذي فشل والسبب الحرفي من جوجل
        console.error(`❌ فشل الرابط ${url} - السبب: ${e.message}`);
        failCount++;
      }
    });

    await Promise.all(publishPromises);

    console.log(`✅ اكتملت الأرشفة: نجاح ${successCount}، فشل ${failCount}`);

    return NextResponse.json({
      success: true,
      message: `تم إرسال ${successCount} رابط بنجاح.`,
    });

  } catch (error: any) {
    console.error('❌ خطأ شامل:', error.message);
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 });
  }
}
