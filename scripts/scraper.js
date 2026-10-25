const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  console.log('🚀 بدء تشغيل الروبوت (وضع محاكاة لوحة المفاتيح للتخفي)...');
  
  const browser = await puppeteer.launch({ 
    headless: true, 
    args: [
      '--no-sandbox', 
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu'
    ] 
  }); 
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  const searchQuery = 'مطاعم المدينة المنورة';
  console.log(`🔍 جاري البحث عن: ${searchQuery}...`);
  
  await page.goto(`https://www.google.com/maps/search/${searchQuery.split(' ').join('+')}`, { waitUntil: 'networkidle2' });

  console.log('⏳ ننتظر تحميل الدفعة الأولى...');
  await page.waitForSelector('a[href*="/maps/place/"]', { timeout: 15000 });

  console.log('🤖 تم العثور على النتائج! جاري الضغط على زر النزول (PageDown) 30 مرة لجمع أكبر عدد...');
  
  // التركيز على أول محل لتفعيل لوحة المفاتيح داخل القائمة الجانبية
  await page.focus('a[href*="/maps/place/"]');

  // محاكاة إنسان يضغط زر النزول للأسفل 30 مرة متتالية
  for (let i = 0; i < 30; i++) {
    await page.keyboard.press('PageDown');
    // الانتظار ثانية ونصف بعد كل ضغطة للسماح لقوقل بتحميل المحلات الجديدة
    await new Promise(resolve => setTimeout(resolve, 1500));
  }

  console.log('📥 انتهى النزول، جاري استخراج وحفظ المحلات الآن...');

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

    // فلترة الأسماء المكررة
    const uniqueResults = Array.from(new Set(results.map(a => a.name)))
      .map(name => {
        return results.find(a => a.name === name)
      });

    return uniqueResults;
  });

  fs.writeFileSync('madinah_places.json', JSON.stringify(places, null, 2), 'utf-8');
  
  console.log(`🎉 نجاح مبهر! تم سحب ${places.length} نشاط تجاري وتخزينها في قاعدة البيانات.`);
  
  await browser.close();
})();
