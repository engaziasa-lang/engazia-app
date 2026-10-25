const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  console.log('🚀 بدء تشغيل الروبوت الشامل لجمع كافة أنشطة المدينة المنورة...');
  
  const browser = await puppeteer.launch({ 
    headless: true, 
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] 
  }); 
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  // قائمة القطاعات لتجاوز حد قوقل وجمع أكبر عدد ممكن
  const searchQueries = [
    'مطاعم المدينة المنورة',
    'كافيهات ومقاهي المدينة المنورة',
    'فنادق وشقق مفروشة المدينة المنورة',
    'مستوصفات ومستشفيات المدينة المنورة',
    'أسواق ومولات المدينة المنورة',
    'مكاتب عقار المدينة المنورة',
    'شركات مقاولات المدينة المنورة',
    'صيدليات المدينة المنورة',
    'ورش سيارات المدينة المنورة',
    'صالونات حلاقة وتجميل المدينة المنورة'
  ];

  let allPlaces = [];

  for (const query of searchQueries) {
    console.log(`\n🔍 جاري كشط قسم: ${query}...`);
    try {
      await page.goto(`https://www.google.com/maps/search/${query.split(' ').join('+')}`, { waitUntil: 'networkidle2' });
      await page.waitForSelector('a[href*="/maps/place/"]', { timeout: 10000 });

      await page.focus('a[href*="/maps/place/"]');

      // النزول 30 مرة لكل قسم
      for (let i = 0; i < 30; i++) {
        await page.keyboard.press('PageDown');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      const places = await page.evaluate(() => {
        const results = [];
        const items = document.querySelectorAll('a[href*="/maps/place/"]');
        items.forEach(item => {
          const name = item.getAttribute('aria-label');
          const url = item.href;
          if (name) results.push({ name, url });
        });
        return results;
      });

      // إزالة المكرر في نفس القسم
      const uniquePlaces = Array.from(new Set(places.map(a => a.name)))
        .map(name => places.find(a => a.name === name));

      console.log(`✅ تم جمع ${uniquePlaces.length} نشاط من ${query}`);
      allPlaces.push(...uniquePlaces);

    } catch (error) {
      console.log(`⚠️ تخطي ${query} لعدم وجود نتائج كافية.`);
    }
  }

  // تنظيف القائمة النهائية من أي تكرار بين الأقسام
  const finalUniquePlaces = Array.from(new Set(allPlaces.map(a => a.name)))
    .map(name => allPlaces.find(a => a.name === name));

  fs.writeFileSync('madinah_places.json', JSON.stringify(finalUniquePlaces, null, 2), 'utf-8');
  
  console.log(`\n🎉 إنجاز ضخم! تم بنجاح سحب إجمالي ${finalUniquePlaces.length} نشاط تجاري من مختلف القطاعات.`);
  
  await browser.close();
})();
