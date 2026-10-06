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
    abaya: { title: "متاجر العبايات والأزياء", keywordIntent: "حساب تكلفة الشحن العكسي، تقليل مرتجعات المقاسات", problem: "استنزاف السيولة النقدية بسبب كثرة طلبات الاستبدال وتبديل المقاسات", solution: "تضمين تكاليف التوصيل المتبادل ضمن سعر البيع الأساسي بذكاء", deepContext: "قطاع الأقمشة والعبايات يتميز بارتفاع معدلات تبديل المقاسات، وكل عملية استرجاع تعني خسارة مزدوجة." },
    dates: { title: "متاجر التمور والصناعات الغذائية", keywordIntent: "حساب تكاليف المستودعات الباردة، مواسم الحصاد", problem: "ارتفاع مصاريف التبريد الطويل وتفاوت أسعار مواد التعبئة والتغليف", solution: "جدولة التدفقات النقدية وحساب تكلفة العبوة الكرتونية بدقة", deepContext: "تجارة التمور ترتبط بمواسم محددة وتتطلب حفظاً خاصاً في مستودعات مبردة تحافظ على جودة المنتج." },
    coffee: { title: "متاجر القهوة المختصة والمحمّصات", keywordIntent: "حساب هدر التحميص، تكلفة البن الأخضر", problem: "فقدان نسبة من الوزن أثناء عملية التحميص وتلف المخزون السريع", solution: "ضبط معادلة الكيلو الصافي وتحديد سعر البيع الذي يغطي أجور الاستيراد", deepContext: "القهوة المختصة منتج حساس، وأي خطأ في حساب النسبة المفقودة أثناء التحميص يعرض المتجر لخسائر فادحة." },
    electronics: { title: "متاجر الإلكترونيات والملحقات", keywordIntent: "تكاليف الضمان، تقادم المخزون التقني", problem: "تغير أسعار الموديلات السريع وتجميد السيولة في أجهزة قديمة", solution: "تخصيص مخصص طوارئ للصيانة والضمان وضمان تدوير سريع لرأس المال", deepContext: "عالم التقنية متسارع جداً، والهبوط المفاجئ في أسعار الموديلات السابقة يفرض على التاجر تدوير مخزونه بسرعة." },
    fashion: { title: "متاجر الملابس والأحذية", keywordIntent: "إدارة المخزون الموسمي، تسعير القطع", problem: "تراكم القطع غير المباعة واستهلاك مصاريف التخزين للأرباح", solution: "وضع استراتيجية خصومات ذكية تضمن تصفية المخزون بربحية", deepContext: "إدارة تشكيلات الملابس الواسعة تتطلب مراقبة لصيقة لحركة المخزون لضمان عدم تجميد رأس المال." },
    cosmetics: { title: "متاجر التجميل والعناية", keywordIntent: "إدارة تواريخ الصلاحية، تسعير المستحضرات", problem: "انتهاء صلاحية بعض المنتجات قبل بيعها وتكاليف التخزين المعقم", solution: "حساب معدل دوران المخزون وتسعير المنتجات لتسريع مبيعاتها", deepContext: "المنتجات التجميلية تخضع لرقابة واشتراطات صارمة وتواريخ صلاحية قصيرة، مما يحتم بيعها وتسعيرها بحذر." },
    furniture: { title: "متاجر الأثاث والديكور", keywordIntent: "تكاليف الشحن الثقيل، النقل لمسافات طويلة", problem: "أجور النقل الباهظة وحجز مساحات تخزين واسعة ومكلفة", solution: "حساب تكلفة الميل الأخير والنقل الثقيل ضمن الفاتورة النهائية للعميل", deepContext: "الأثاث يحتاج إلى مساحات تخزين ضخمة وعمليات لوجستية معقدة للشحن والنقل الثقيل." },
    gifting: { title: "متاجر الهدايا وتغليف المناسبات", keywordIntent: "حساب تكلفة الوقت اليدوي، إكسسوارات التغليف", problem: "إغفال احتساب قيمة ساعات العمل اليدوي وجهد التجهيز الفاخر", solution: "تضمين تكلفة العمالة وتجهيز الهدايا ضمن صافي ربح الطلب", deepContext: "قيمة متاجر الهدايا تكمن في اللمسة الفنية اليدوية ووقت التجهيز التي تغفل في التكاليف." },
    supplements: { title: "متاجر المكملات الغذائية", keywordIntent: "تراخيص هيئة الغذاء، شحنات المكملات", problem: "تكاليف التخزين المعتدل والالتزام بالاشتراطات التنظيمية الصارمة", solution: "توزيع الرسوم الثابتة على حجم المبيعات الشهرية بشكل آمن وعادل", deepContext: "قطاع المكملات يخضع لتراخيص واشتراطات تخزينية دقيقة تفرض تكاليف ثابتة يجب إدارتها باحترافية." },
    shoes: { title: "متاجر الأحذية والمنتجات الجلدية", keywordIntent: "تبديل المقاسات، تكاليف الشحن العكسي للأحذية", problem: "ارتفاع نسبة استرجاع الأحذية بسبب اختلاف المقاسات", solution: "احتساب تكاليف الشحن المزدوج ضمن هامش الربح التشغيلي", deepContext: "تواجه تجارة الأحذية معدلات استرجاع عالية بسبب المقاسات، مما يتطلب مظلة مالية تحمي المتجر." },
    jewelery: { title: "متاجر المجوهرات والإكسسوارات", keywordIntent: "تأمين الشحن العالي، تكلفة المعادن", problem: "مصاريف التأمين والتوثيق الأمني المشدد أثناء عمليات التوصيل", solution: "إضافة مصاريف الحماية والأمان المالي ضمن السعر النهائي", deepContext: "المجوهرات الثمينة تتطلب بوليصات تأمين عالية وحراسة وشحن مؤمن بالكامل." },
    sports: { title: "متاجر المستلزمات والملابس الرياضية", keywordIntent: "تسعير المعدات الثقيلة، وإدارة المخزون الرياضي", problem: "حجم الأجهزة الرياضية وضخامة تكاليف شحنها وتخزينها", solution: "حساب دقيق لكلفة الاستيراد والتخزين والتوصيل المنزلي", deepContext: "تتنوع منتجات هذا القطاع بين ملابس خفيفة وأجهزة تدريب ثقيلة، مما يتطلب فهماً عميقاً للشحن." },
    toys: { title: "متاجر الألعاب وأدوات الأطفال", keywordIntent: "مواصفات الأمان، تسعير الألعاب", problem: "موسمية الطلب العالية وتكاليف فحص المطابقة ومعايير الأمان", solution: "توزيع التكاليف الموسمية على خطة تسعير متوازنة طوال العام", deepContext: "ألعاب الأطفال تتطلب شهادات مطابقة مواصفات وأمان صارمة، وتعتمد على مواسم ذروة." },
    books: { title: "المكتبات ودور نشر الكتب", keywordIntent: "طباعة النسخ، حقوق النشر", problem: "تكاليف الطباعة المرتفعة وبطء حركة بعض العناوين في المخزون", solution: "حساب نقطة التعادل لكل إصدار كتاب لضمان تغطية تكاليف الفسح", deepContext: "صناعة النشر والكتب تتضمن تكاليف حقوق ملكية، وتراخيص فسح، ورسوم طباعة ورقية." }
  };

  const toolDetails: Record<string, { name: string, path: string, focus: string, benefit: string, deepDesc: string, image: string }> = {
    platforms: { name: "مقارن منصات التجارة", path: "platforms", focus: "مقارنة منصات سلة وصد وشوبيفاي", benefit: "اختيار المنصة الأنسب لنشاطك التجاري بدقة", deepDesc: "تساعدك هذه الأداة في تقارير ومقارنات واضحة لاختيار المنصة الأفضل لمشروعك.", image: "tool-1.png" },
    "vat-report": { name: "مُحضر تقارير القيمة المضافة", path: "vat-report", focus: "تجهيز بيانات الإقرار الضريبي", benefit: "تجنب الأخطاء المحاسبية وتقديم الإقرار بكل سلاسة", deepDesc: "تنظيم بيانات الضرائب وتجهيز الإقرارات بكل سهولة.", image: "tool-2.png" },
    returns: { name: "مدير سياسة المرتجعات الذكية", path: "returns", focus: "تقليل خسائر الشحن العكسي", benefit: "السيطرة على تكاليف التبديل والاسترجاع للمنتجات", deepDesc: "إدارة المرتجعات بطريقة آلية وممنهجة تقلل الهدر اللوجستي.", image: "tool-3.png" },
    whatsapp: { name: "أداة السلال عبر واتساب", path: "whatsapp", focus: "أتمتة الرسائل للعملاء", benefit: "استعادة المبيعات الضائعة وزيادة التحويلات بنسبة 35%", deepDesc: "استهداف المترددين عبر الواتساب لرفع نسب إغلاق الصفقات.", image: "tool-4.png" },
    roas:
