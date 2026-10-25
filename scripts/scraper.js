const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  console.log('🚀 بدء تشغيل روبوت منصة إنجازيا للحصاد الشامل...');
  
  const browser = await puppeteer.launch({ 
    headless: true, 
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] 
  }); 
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  // قائمة القطاعات التي سيبحث عنها الروبوت (يمكنك إضافة أي قطاع تريده هنا)
  const searchQueries = [
    'مطاعم المدينة المنورة',
    'مقاهي المدينة المنورة',
    'فنادق المدينة المنورة',
    'مستوصفات ومستشفيات المدينة المنورة',
    'أسواق ومولات المدينة المنورة',
    'مكاتب عقار المدينة المنورة',
    'شركات مقاولات المدينة المنورة',
    'صيدليات المدينة المنورة'
  ];

  let allPlaces = [];

  for (const query of searchQueries) {
    console.log(`\n🔍 جاري البحث في قطاع: ${query}...`);
    try {
      await page.goto(`https://www.google.com/maps/search/${query.split(' ').join('+')}`, { waitUntil: 'networkidle2' });
      await page.waitForSelector('a[href*="/maps/place/"]', { timeout: 15000 });

      console.log(`🤖 جاري سحب البيانات (محاكاة النزول للأسفل 20 مرة)...`);
      await page.focus('a[href*="/maps/place/"]');

      // النزول 20 مرة لكل قطاع لجمع أكبر عدد
      for (let i = 0; i < 20; i++) {
        await page.keyboard.press('PageDown');
        await new Promise(resolve => setTimeout(resolve, 1500));
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

      // إزالة التكرار من هذا القطاع
      const uniquePlaces = Array.from(new Set(places.map(a => a.name)))
        .map(name => places.find(a => a.name === name));

      console.log(`✅ تم سحب ${uniquePlaces.length} نشاط من قسم ${query}`);
      allPlaces.push(...uniquePlaces);

    } catch (error) {
      console.log(`⚠️ لم نتمكن من سحب ${query}، جاري التخطي للقطاع التالي...`);
    }
  }

  // التنظيف النهائي للقاعدة (إزالة أي تكرار بين القطاعات)
  const finalUniquePlaces = Array.from(new Set(allPlaces.map(a => a.name)))
    .map(name => allPlaces.find(a => a.name === name));

  fs.writeFileSync('madinah_places.json', JSON.stringify(finalUniquePlaces, null, 2), 'utf-8');
  
  console.log(`\n🎉 إنجاز ضخم! تم سحب إجمالي ${finalUniquePlaces.length} نشاط تجاري متنوع وتخزينها بنجاح.`);
  
  await browser.close();
})();
