/* eslint-disable */

export interface SeoPageData {
  slug: string;
  title: string;
  subtitle: string;
  badge: string;
  actionUrl: string;
  imagePath: string;
  article: {
    h1: string;
    intro: string;
    h2_1: string;
    p_1: string;
    h2_2: string;
    p_2: string;
    h2_3: string;
    p_3: string;
    h2_4: string;
    p_4: string;
  };
  faqs: { q: string; a: string }[];
  relatedLinks: { title: string; href: string }[];
}

export function generateSeoContent(slug: string): SeoPageData {
  const urlPath = (slug || "profit-salla-perfumes-riyadh").toLowerCase();
  
  let toolKey = "profit";
  let platformKey = "salla";
  let nicheKey = "perfume";
  let cityKey = "riyadh";

  const toolsList = [
    'platforms', 'vat-report', 'returns', 'whatsapp', 'roas', 'invoices', 'fees', 
    'profit', 'tips', 'ab-test', 'ltv', 'promos', 'support', 'copy', 'dropshipping', 
    'reviews', 'jasmal', 'legal', 'expenses', 'inventory', 'shipping', 'cod-risk', 
    'influencer'
  ];
  
  const platformsList = ['salla', 'zid', 'shopify', 'woocommerce'];
  
  const nichesList = [
    'perfume', 'abaya', 'dates', 'coffee', 'electronics', 'fashion', 
    'cosmetics', 'furniture', 'gifting', 'supplements', 'shoes', 'jewelery',
    'sports', 'toys', 'books'
  ];
  
  const citiesList = [
    'riyadh', 'jeddah', 'mecca', 'medina', 'dammam', 'khobar', 'dhahran', 
    'tabuk', 'buraidah', 'khamis-mushait', 'abha', 'hail', 'najran', 
    'yanbu', 'al-jubail', 'arar', 'sakaka', 'jizan', 'qatif', 'al-hasa', 
    'taif', 'al-bahha', 'hafr-al-batin', 'unayzah', 'al-kharj', 
    'qurayyat', 'al-qunfudhah', 'bishe', 'rafha', 'khafji', 
    'sharurah', 'al-ula', 'huraymila', 'duwadimi', 'zulfi', 
    'majmaah', 'wadi-al-dawasir', 'tanumah', 'ar-rass',
    'saihat', 'tarout', 'safwa', 'tubarjal', 'abu-arish', 
    'samtah', 'ahad-rufaidah', 'badr', 'rabigh', 'al-wajh'
  ];

  toolsList.forEach(t => { if (urlPath.includes(t)) toolKey = t; });
  platformsList.forEach(p => { if (urlPath.includes(p)) platformKey = p; });
  nichesList.forEach(n => { if (urlPath.includes(n)) nicheKey = n; });
  citiesList.forEach(c => { if (urlPath.includes(c)) cityKey = c; });

  const platformNames: Record<string, string> = { 
    salla: "منصة سلة", 
    zid: "منصة زد", 
    shopify: "متجر شوبيفاي",
    woocommerce: "متجر ووكومرس"
  };

  const cityNames: Record<string, string> = {
    riyadh: "الرياض", jeddah: "جدة", mecca: "مكة المكرمة", medina: "المدينة المنورة",
    dammam: "الدمام", khobar: "الخبر", dhahran: "الظهران", tabuk: "تبوك", 
    buraidah: "بريدة", "khamis-mushait": "خميس مشيط", abha: "أبها", hail: "حائل", 
    najran: "نجران", yanbu: "ينبع", "al-jubail": "الجبيل", arar: "عرعر", 
    sakaka: "سكاكا", jizan: "جيزان", qatif: "القطيف", "al-hasa": "الأحساء", 
    taif: "الطائف", "al-bahha": "الباحة", "hafr-al-batin": "حفر الباطن", 
    unayzah: "عنيزة", "al-kharj": "الخرج", qurayyat: "القريات", 
    "al-qunfudhah": "القنفذة", bishe: "بيشة", rafha: "رفحاء", khafji: "الخفجي", 
    sharurah: "شرورة", "al-ula": "العلا", huraymila: "حريملاء", duwadimi: "الدوادمي", 
    zulfi: "المجمعة", majmaah: "المجمعة", "wadi-al-dawasir": "وادي الدواسر", 
    tanumah: "تنومة", "ar-rass": "الرس", saihat: "سيهات", tarout: "تاروت", 
    safwa: "صفوى", tubarjal: "طبرجل", "abu-arish": "أبو عريش", samtah: "صامطة", 
    "ahad-rufaidah": "أحد رفيدة", badr: "بدر", rabigh: "رابغ", "al-wajh": "الوجه"
  };

  const nicheDetails: Record<string, { title: string, keywordIntent: string, problem: string, solution: string, deepContext: string }> = {
    perfume: { title: "متاجر العطور والروائح", keywordIntent: "تسعير زجاجات العطور، حساب تكلفة التغليف الفاخر", problem: "التهام تكاليف العبوات الزجاجية وأجور الشحن المبرد لأجزاء ضخمة من الأرباح", solution: "معادلة تسعير دقيقة تضمن هامش ربح صافي يحمي التاجر من تلف الشحنات", deepContext: "سوق العطور في المملكة يشهد تنافسية ضخمة تتطلب من التاجر حساب كل هللة تتعلق بثمن الزجاج والمضخة." },
    abaya: { title: "متاجر العبايات والأز

            
