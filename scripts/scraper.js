const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  console.log('🚀 بدء تشغيل الروبوت السحابي...');
  
  const browser = await puppeteer.launch({ 
    headless: true, // تم التحديث للتوافق مع الإصدارات الجديدة
    args: [
      '--no-sandbox', 
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage', // أمر حاسم لمنع انهيار الذاكرة في Codespaces
      '--disable-gpu'
    ] 
  }); 
  const page = await browser.newPage();

  const searchQuery = 'مطاعم المدينة المنورة';
  console.log(`🔍 جاري البحث عن: ${searchQuery}...`);
  
  await page.goto(`https://www.google.com/maps/search/${searchQuery.split(' ').join('+')}`);

  await page.waitForSelector('a[href*="/maps/place/"]', { timeout: 15000 });
  console.log('✅ تم تحميل النتائج، جاري استخراج البيانات...');

  const places = await page.evaluate(() => {
    const results = [];
    const items = document.querySelectorAll('a[href*="/maps/place/"]');

    items.forEach(item => {
      const name = item.getAttribute('aria-label');
      const url = item.href;
      if (name) {
        results.push({ name, url });
      }
    });

    const uniqueResults = Array.from(new Set(results.map(a => a.name)))
      .map(name => {
        return results.find(a => a.name === name)
      });

    return uniqueResults;
  });

  fs.writeFileSync('madinah_places.json', JSON.stringify(places, null, 2), 'utf-8');
  
  console.log(`🎉 نجاح! تم استخراج ${places.length} محل تجاري.`);
  
  await browser.close();
})();
