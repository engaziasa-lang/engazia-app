const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  console.log('🚀 بدء تشغيل روبوت الحصاد العميق (تكتيك الكشط المناطقي)...');
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] }); 
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  // القطاعات المستهدفة
  const sectors = ['مطاعم', 'كافيهات', 'فنادق', 'صيدليات', 'سوبر ماركت', 'مستوصفات'];
  // الأحياء المستهدفة
  const neighborhoods = ['العزيزية', 'العوالي', 'قباء', 'شوران', 'الخالدية', 'سيد الشهداء'];
  
  const searchQueries = [];
  for(let s of sectors) {
      for(let n of neighborhoods) {
          searchQueries.push(`${s} ${n} المدينة المنورة`);
      }
  }

  console.log(`📋 الروبوت سيقوم بتنفيذ ${searchQueries.length} عملية بحث دقيقة (ستستغرق العملية حوالي 10-15 دقيقة، يرجى الانتظار)...`);
  let allPlaces = [];

  for (let i = 0; i < searchQueries.length; i++) {
    const query = searchQueries[i];
    console.log(`\n🔍 (${i+1}/${searchQueries.length}) جاري كشط: ${query}...`);
    try {
      await page.goto(`https://www.google.com/maps/search/${query.split(' ').join('+')}`, { waitUntil: 'networkidle2' });
      await page.waitForSelector('a[href*="/maps/place/"]', { timeout: 8000 });
      await page.focus('a[href*="/maps/place/"]');
      
      // النزول 12 مرة كافية لكل حي لتسريع العملية
      for (let j = 0; j < 12; j++) {
        await page.keyboard.press('PageDown');
        await new Promise(r => setTimeout(r, 800));
      }
      const places = await page.evaluate(() => {
        const results = [];
        document.querySelectorAll('a[href*="/maps/place/"]').forEach(item => {
          const name = item.getAttribute('aria-label');
          if (name) results.push({ name, url: item.href });
        });
        return results;
      });
      const uniquePlaces = Array.from(new Set(places.map(a => a.name))).map(name => places.find(a => a.name === name));
      console.log(`✅ تم جمع ${uniquePlaces.length} نشاط.`);
      allPlaces.push(...uniquePlaces);
    } catch (e) {
      console.log(`⚠️ تخطي (لا توجد نتائج كافية).`);
    }
  }
  const finalUnique = Array.from(new Set(allPlaces.map(a => a.name))).map(name => allPlaces.find(a => a.name === name));
  fs.writeFileSync('madinah_places.json', JSON.stringify(finalUnique, null, 2), 'utf-8');
  console.log(`\n🎉 إنجاز أسطوري! تم سحب إجمالي ${finalUnique.length} نشاط تجاري من أحياء المدينة.`);
  await browser.close();
})();
