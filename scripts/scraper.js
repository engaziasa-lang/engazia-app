const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  console.log('🚀 بدء تشغيل الروبوت المطور (وضع السحب العميق)...');
  
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
  
  // تكبير الشاشة لتستوعب بيانات أكثر
  await page.setViewport({ width: 1280, height: 800 });

  const searchQuery = 'مطاعم المدينة المنورة';
  console.log(`🔍 جاري البحث عن: ${searchQuery}...`);
  
  await page.goto(`https://www.google.com/maps/search/${searchQuery.split(' ').join('+')}`, { waitUntil: 'networkidle2' });

  await page.waitForSelector('a[href*="/maps/place/"]', { timeout: 15000 });
  console.log('✅ تم تحميل الصفحة، جاري النزول للأسفل لجمع المحلات (قد يستغرق بضع دقائق)...');

  // دالة النزول للأسفل (Scroll) داخل قائمة قوقل ماب
  await page.evaluate(async () => {
    const feed = document.querySelector('div[role="feed"]'); // الصندوق الذي يحتوي على المحلات
    if (feed) {
      await new Promise((resolve) => {
        let totalHeight = 0;
        let distance = 800; 
        let scrolls = 0;
        let maxScrolls = 40; // 👈 هذا الرقم يحدد كم مرة سينزل للأسفل (40 مرة ستجلب لك مئات المحلات، يمكنك زيادتها لاحقاً)

        let timer = setInterval(() => {
          let scrollHeight = feed.scrollHeight;
          feed.scrollBy(0, distance);
          totalHeight += distance;
          scrolls++;

          if (totalHeight >= scrollHeight || scrolls >= maxScrolls) {
            clearInterval(timer);
            resolve();
          }
        }, 1500); // ينتظر ثانية ونصف ليسمح لقوقل بتحميل المحلات الجديدة
      });
    }
  });

  console.log('📥 جاري استخراج البيانات الآن...');

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
  
  console.log(`🎉 إنجاز عظيم! تم سحب ${places.length} محل تجاري بنجاح.`);
  
  await browser.close();
})();
