const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  console.log('🚀 بدء تشغيل روبوت الحصاد الأسطوري للوصول إلى آلاف الأنشطة...');
  console.log('⏳ تنبيه: هذه العملية ستستغرق وقتاً طويلاً (حوالي 45 دقيقة) لأنها ستنفذ 500 عملية بحث دقيقة.');
  
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  const sectors = ['مطاعم', 'كافيهات', 'فنادق وشقق', 'صيدليات', 'سوبر ماركت', 'مستوصفات', 'مكاتب عقار', 'شركات مقاولات', 'ورش سيارات', 'صالونات حلاقة', 'نوادي رياضية', 'مدارس', 'بنوك', 'خياطين', 'حلويات', 'إلكترونيات', 'مفروشات', 'عطور', 'تأجير سيارات', 'مكاتب محاماة'];
  const neighborhoods = ['العزيزية', 'العوالي', 'قباء', 'شوران', 'الخالدية', 'سيد الشهداء', 'الهدا', 'البحر', 'الإسكان', 'المبعوث', 'الجرف', 'عروة', 'القبلتين', 'الملك فهد', 'العريض', 'الحمراء', 'الدفاع', 'الشهداء', 'بني خدرة', 'الروابي', 'الوبرة', 'الفيصلية', 'المصانع', 'بني حارثة', 'تلعة الهبوب'];

  const searchQueries = [];
  for(let s of sectors) for(let n of neighborhoods) searchQueries.push(`${s} ${n} المدينة المنورة`);

  let allPlaces = [];

  for (let i = 0; i < searchQueries.length; i++) {
    const query = searchQueries[i];
    console.log(`\n🔍 (${i+1}/${searchQueries.length}) جاري كشط: ${query}...`);
    try {
      await page.goto(`https://www.google.com/maps/search/${query.split(' ').join('+')}`, { waitUntil: 'networkidle2' });
      await page.waitForSelector('a[href*="/maps/place/"]', { timeout: 5000 });
      await page.focus('a[href*="/maps/place/"]');
      for (let j = 0; j < 6; j++) {
        await page.keyboard.press('PageDown');
        await new Promise(r => setTimeout(r, 600));
      }
      const places = await page.evaluate(() => {
        const results = [];
        document.querySelectorAll('a[href*="/maps/place/"]').forEach(item => {
          const name = item.getAttribute('aria-label');
          if (name) results.push({ name, url: item.href });
        });
        return results;
      });
      allPlaces.push(...places);
      console.log(`✅ تم جمع ${places.length} نشاط. (الإجمالي المؤقت: ${allPlaces.length})`);
    } catch (e) {
      console.log(`⚠️ تخطي (لا توجد نتائج).`);
    }
  }

  const categorize = (name) => {
    const n = name.toLowerCase();
    if (n.match(/مطعم|مشويات|بخاري|بروست|مطبخ|شاورما|كباب|مندي|فطير|دجاج|برجر|بيتزا|طعام|كافتيريا|بوفيه|مأكولات|شواية|وجبات|فلافل|شعرية|سوشي|كاب|فرايد|لحم|جريل|kebabs/)) return 'المطاعم 🍔';
    if (n.match(/مقهى|كافيه|قهوة|cafe|روستري|حلى|حلويات|مخبز|ايسكريم|عصير|مشروبات|tea|coffee|بسبوسة|كيك/)) return 'المقاهي والحلويات ☕';
    if (n.match(/فندق|شقق|أجنحة|هوتيل|hotel|سكن|نزل|منتجع|شاليه/)) return 'الفنادق والسكن 🏨';
    if (n.match(/صيدلية|مستشفى|مستوصف|عيادة|طبية|دواء|بصريات|نظارات|أسنان|تجميل|صالون|حلاقة|مشغل|سبا|مساج|عناية/)) return 'الصحة والتجميل 💊';
    if (n.match(/سوبر|ماركت|تموينات|سوق|مول|هايبر|بقالة|خضار|فواكه|لحوم|مزارع|تمور|عطارة|محمصة/)) return 'الأسواق والتموينات 🛒';
    if (n.match(/عقار|أملاك|مقاولات|بناء|صيانة|سباكة|كهرباء|ورشة|سيارات|مغسلة|تنظيف|شركة|مؤسسة|مكتب|مدرسة|معهد|مركز|طباعة|دعاية|سفريات|نقل|تأجير|محاماة|بنك|مصرف/)) return 'خدمات ومقاولات 🏢';
    if (n.match(/متجر|محل|ملابس|أحذية|عطور|مجوهرات|ذهب|هدايا|ألعاب|كمبيوتر|جوالات|إلكترونيات|قرطاسية|مكتبة|خردوات|أواني|مفروشات|أثاث|خياط/)) return 'التسوق والمتاجر 🛍️';
    return 'منشآت ومتاجر متنوعة 🌟';
  };

  const finalUnique = Array.from(new Set(allPlaces.map(a => a.name))).map(name => allPlaces.find(a => a.name === name));
  const updated = finalUnique.map((p, index) => ({ id: index.toString(), name: p.name, url: p.url, category: categorize(p.name) }));

  fs.writeFileSync('madinah_places.json', JSON.stringify(updated, null, 2), 'utf-8');
  console.log(`\n🎉 إنجاز أسطوري! تم سحب وتصنيف إجمالي ${updated.length} نشاط تجاري.`);
  await browser.close();
})();
