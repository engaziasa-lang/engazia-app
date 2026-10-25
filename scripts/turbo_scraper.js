const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  console.log('🚀 بدء تشغيل روبوت "التوربو" السريع (10 مهام في نفس الوقت)...');
  
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] });
  
  const sectors = ['مطاعم', 'كافيهات', 'فنادق', 'صيدليات', 'سوبر ماركت', 'مستوصفات', 'عقار', 'مقاولات', 'ورش', 'حلاقة', 'بنوك', 'حلويات', 'عطور', 'ملابس'];
  const neighborhoods = ['العزيزية', 'العوالي', 'قباء', 'شوران', 'الخالدية', 'سيد الشهداء', 'الهدا', 'البحر', 'الإسكان', 'المبعوث', 'الجرف', 'عروة'];

  const searchQueries = [];
  for(let s of sectors) for(let n of neighborhoods) searchQueries.push(`${s} ${n} المدينة المنورة`);

  let allPlaces = [];
  const CONCURRENCY = 10; 

  console.log(`📋 الإجمالي: ${searchQueries.length} عملية بحث. سيتم تنفيذها بسرعة فائقة على دفعات...`);

  for (let i = 0; i < searchQueries.length; i += CONCURRENCY) {
    const batch = searchQueries.slice(i, i + CONCURRENCY);
    console.log(`\n⚡ جاري التنفيذ المتوازي للدفعة... (${i} إلى ${i + batch.length})`);
    
    const promises = batch.map(async (query) => {
      const page = await browser.newPage();
      try {
        await page.goto(`https://www.google.com/maps/search/${query.split(' ').join('+')}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
        await page.waitForSelector('a[href*="/maps/place/"]', { timeout: 3000 });
        await page.focus('a[href*="/maps/place/"]');
        
        for (let j = 0; j < 4; j++) {
          await page.keyboard.press('PageDown');
          await new Promise(r => setTimeout(r, 300)); 
        }
        
        const places = await page.evaluate(() => {
          const results = [];
          document.querySelectorAll('a[href*="/maps/place/"]').forEach(item => {
            const name = item.getAttribute('aria-label');
            if (name) results.push({ name, url: item.href });
          });
          return results;
        });
        
        await page.close();
        return places;
      } catch (e) {
        await page.close();
        return []; 
      }
    });

    const results = await Promise.all(promises);
    results.forEach(res => allPlaces.push(...res));
    console.log(`✅ تمت الدفعة. (عدد الأنشطة المحصودة حتى الآن: ${allPlaces.length})`);
  }

  const categorize = (name) => {
    const n = name.toLowerCase();
    if (n.match(/مطعم|مشويات|بخاري|بروست|مطبخ|شاورما|كباب|مندي|فطير|دجاج|برجر|بيتزا|وجبات/)) return 'المطاعم 🍔';
    if (n.match(/مقهى|كافيه|قهوة|روستري|حلى|حلويات|مخبز|عصير/)) return 'المقاهي والحلويات ☕';
    if (n.match(/فندق|شقق|أجنحة|نزل|منتجع/)) return 'الفنادق والسكن 🏨';
    if (n.match(/صيدلية|مستشفى|مستوصف|عيادة|طبية|حلاقة|مشغل/)) return 'الصحة والتجميل 💊';
    if (n.match(/سوبر|ماركت|تموينات|سوق|مول|بقالة|خضار/)) return 'الأسواق والتموينات 🛒';
    if (n.match(/عقار|أملاك|مقاولات|بناء|ورشة|سيارات|مؤسسة|مكتب|شركة|بنك/)) return 'خدمات ومقاولات 🏢';
    if (n.match(/متجر|محل|ملابس|أحذية|عطور|مجوهرات|كمبيوتر|جوالات/)) return 'التسوق والمتاجر 🛍️';
    return 'منشآت ومتاجر متنوعة 🌟';
  };

  const finalUnique = Array.from(new Set(allPlaces.map(a => a.name))).map(name => allPlaces.find(a => a.name === name));
  const updated = finalUnique.map((p, index) => ({ id: index.toString(), name: p.name, url: p.url, category: categorize(p.name) }));

  fs.writeFileSync('madinah_places.json', JSON.stringify(updated, null, 2), 'utf-8');
  console.log(`\n🎉 إنجاز أسطوري سريع جداً! تم سحب إجمالي ${updated.length} نشاط تجاري.`);
  await browser.close();
})();
