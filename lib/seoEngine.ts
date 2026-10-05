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
  };
  faqs: { q: string; a: string }[];
}

export function generateSeoContent(slug: string): SeoPageData {
  const urlPath = (slug || "profit-salla-perfumes-riyadh").toLowerCase();
  
  let toolKey = "profit";
  let platformKey = "salla";
  let nicheKey = "perfume";
  let cityKey = "riyadh";

  const toolsList = ['breakeven', 'fees', 'zatca', 'whatsapp', 'roas', 'returns', 'policy', 'tax', 'ltv', 'promos', 'inventory', 'shipping', 'pricing', 'conversion', 'checkout', 'profit-margin', 'ads-budget', 'discount-calc', 'cart-recovery', 'vat-calc'];
  const platformsList = ['salla', 'zid', 'shopify'];
  const nichesList = ['perfume', 'abaya', 'dates', 'coffee', 'electronics', 'fashion', 'cosmetics', 'furniture', 'gifting', 'supplements', 'shoes', 'jewelery'];
  const citiesList = ['riyadh', 'jeddah', 'mecca', 'medina', 'dammam', 'khobar', 'tabuk', 'buraidah', 'khamis-mushait', 'abha', 'hail', 'najran', 'yanbu', 'taif', 'al-hasa'];

  toolsList.forEach(t => { if (urlPath.includes(t)) toolKey = t; });
  platformsList.forEach(p => { if (urlPath.includes(p)) platformKey = p; });
  nichesList.forEach(n => { if (urlPath.includes(n)) nicheKey = n; });
  citiesList.forEach(c => { if (urlPath.includes(c)) cityKey = c; });

  const platformNames: Record<string, string> = { salla: "منصة سلة", zid: "منصة زد", shopify: "متجر شوبيفاي" };
  const cityNames: Record<string, string> = {
    riyadh: "الرياض", jeddah: "جدة", mecca: "مكة المكرمة", medina: "المدينة المنورة",
    dammam: "الدمام", khobar: "الخبر", tabuk: "تبوك", buraidah: "بريدة",
    "khamis-mushait": "خميس مشيط", abha: "أبها", hail: "حائل", najran: "نجران",
    yanbu: "ينبع", taif: "الطائف", "al-hasa": "الأحساء"
  };

  // بيانات المجالات المتقدمة بنية شراء عالية
  const nicheDetails: Record<string, { title: string, keywordIntent: string, problem: string, solution: string, customText: string }> = {
    perfume: {
      title: "متاجر العطور والروائح",
      keywordIntent: "تسعير زجاجات العطور، حساب تكلفة التغليف الفاخر، وتقليل خسائر كسر الشحن",
      problem: "التهام تكاليف العبوات الزجاجية وأجور الشحن المبرد لأكثر من 20% من الأرباح",
      solution: "معادلة تسعير دقيقة تضمن هامش ربح صافي يحمي التاجر من تلف الشحنات",
      customText: "إذا كنت تمتلك متجر عطور وتريد معرفة كيف تسعر زجاجات البارفان بدقة في السوق السعودي، فهذه الأداة صممت خصيصاً لك."
    },
    abaya: {
      title: "متاجر العبايات والأزياء",
      keywordIntent: "حساب تكلفة الشحن العكسي، تقليل مرتجعات المقاسات، وتسعير الأقمشة",
      problem: "استنزاف السيولة النقدية بسبب كثرة طلبات الاستبدال وتبديل المقاسات",
      solution: "تضمين تكاليف التوصيل المتبادل ضمن سعر البيع الأساسي بذكاء",
      customText: "متاجر الأزياء والعبايات تواجه تحدي المرتجعات؛ ولحل هذه المعضلة وتثبيت أرباحك، أنت بحاجة لحاسبة مالية متقدمة."
    },
    dates: {
      title: "متاجر التمور والصناعات الغذائية",
      keywordIntent: "حساب تكاليف المستودعات الباردة، مواسم الحصاد، وتغليف التمور الفاخرة",
      problem: "ارتفاع مصاريف التبريد الطويل وتفاوت أسعار مواد التعبئة والتغليف",
      solution: "جدولة التدفقات النقدية وحساب تكلفة العبوة الكرتونية والنافذة بدقة",
      customText: "تجارة التمور والمنتجات المحلية تتطلب دقة متناهية في حساب تكاليف الحفظ والتخزين لضمان عدم تآكل رأس المال."
    },
    coffee: {
      title: "متاجر القهوة المختصة والمحمّصات",
      keywordIntent: "حساب هدر التحميص، تكلفة البن الأخضر، وتسعير أكياس القهوة",
      problem: "فقدان نسبة من الوزن أثناء عملية التحميص وتلف المخزون السريع",
      solution: "ضبط معادلة الكيلو الصافي وتحديد سعر البيع الذي يغطي أجور الاستيراد والتخزين",
      customText: "سوق القهوة المختصة لا يرحم الأخطاء الحسابية، وتحديد سعر الكيس بربح حقيقي يتطلب أداة تحليل فوري."
    },
    electronics: {
      title: "متاجر الإلكترونيات والملحقات",
      keywordIntent: "تكاليف الضمان، تقادم المخزون التقني، وتسعير الأجهزة",
      problem: "تغير أسعار الموديلات السريع وتجميد السيولة في أجهزة قديمة",
      solution: "تخصيص مخصص طوارئ للصيانة والضمان وضمان تدوير سريع لرأس المال",
      customText: "قطاع التقنية يتطلب سرعة فائقة في الحسابات لضمان عدم الخسارة الناتجة عن هبوط الأسعار المفاجئ."
    },
    fashion: {
      title: "متاجر الملابس والأحذية",
      keywordIntent: "إدارة المخزون الموسمي، تسعير القطع، وتقليل الهدر",
      problem: "تراكم القطع غير المباعة واستهلاك مصاريف التخزين للأرباح",
      solution: "وضع استراتيجية خصومات ذكية تضمن تصفية المخزون بربحية",
      customText: "تحقيق الأرباح في الموضة يعتمد على سرعة التصريف ودقة حساب التكلفة التشغيلية لكل قطعة."
    },
    cosmetics: {
      title: "متاجر التجميل والعناية",
      keywordIntent: "إدارة تواريخ الصلاحية، تسعير مستحضرات التجميل، وتقليل التالف",
      problem: "انتهاء صلاحية بعض المنتجات قبل بيعها وتكاليف التخزين المعقم",
      solution: "حساب معدل دوران المخزون وتسعير المنتجات لتسريع مبيعاتها",
      customText: "منتجات التجميل حساسة، ومعرفة تكلفة المنتج الحقيقية مع الهدر تحمي متجرك من الخسارة."
    },
    furniture: {
      title: "متاجر الأثاث والديكور",
      keywordIntent: "تكاليف الشحن الثقيل، النقل لمسافات طويلة، وتسعير قطع الأثاث",
      problem: "أجور النقل الباهظة وحجز مساحات تخزين واسعة ومكلفة",
      solution: "حساب تكلفة الميل الأخير والنقل الثقيل ضمن الفاتورة النهائية للعميل",
      customText: "تجارة الأثاث تحتاج إلى حسابات دقيقة جداً لأجور اللوجستيات لضمان تغطية مصاريف التوصيل والتركيب."
    },
    gifting: {
      title: "متاجر الهدايا وتغليف المناسبات",
      keywordIntent: "حساب تكلفة الوقت اليدوي، إكسسوارات التغليف، وتسعير البوكسات",
      problem: "إغفال احتساب قيمة ساعات العمل اليدوي وجهد التجهيز الفاخر",
      solution: "تضمين تكلفة العمالة وتجهيز الهدايا ضمن صافي ربح الطلب",
      customText: "متاجر الهدايا تعتمد على الإبداع، واحتساب وقت التجهيز اليدوي هو السر الحقيقي للربح المادي."
    },
    supplements: {
      title: "متاجر المكملات الغذائية",
      keywordIntent: "تراخيص هيئة الغذاء والدواء، شحنات المكملات، وتسعير العبوات",
      problem: "تكاليف التخزين المعتدل والالتزام بالاشتراطات التنظيمية الصارمة",
      solution: "توزيع الرسوم الثابتة على حجم المبيعات الشهرية بشكل آمن وعادل",
      customText: "قطاع المكملات الرياضية يفرض التزامات تنظيمية تتطلب تسعيرًا مدروسًا يغطي كافة المصاريف."
    },
    shoes: {
      title: "متاجر الأحذية والمنتجات الجلدية",
      keywordIntent: "تبديل المقاسات، تكاليف الشحن العكسي للأحذية، وتسعير الجلد",
      problem: "ارتفاع نسبة استرجاع الأحذية بسبب اختلاف القياسات بين الماركات",
      solution: "احتساب تكاليف الشحن المزدوج ضمن هامش الربح التشغيلي",
      customText: "تجارة الأحذية تتطلب دقة في إدارة المرتجعات وحساب تكلفتها الفعلية لتجنب تآكل الأرباح."
    },
    jewelery: {
      title: "متاجر المجوهرات والإكسسوارات الفاخرة",
      keywordIntent: "تأمين الشحن العالي، تكلفة المعادن، وتوثيق المتجر",
      problem: "مصاريف التأمين والتوثيق الأمني المشدد أثناء عمليات التوصيل",
      solution: "إضافة مصاريف الحماية والأمان المالي ضمن السعر النهائي للقطعة",
      customText: "المجوهرات تحتاج إلى أعلى معايير الأمان والشحن المؤمن، مما يستوجب حاسبة دقيقة لتكاليفها."
    }
  };

  // تفاصيل الأدوات المتقدمة
  const toolDetails: Record<string, { name: string, action: string, focus: string, benefit: string }> = {
    breakeven: { name: "حاسبة نقطة التعادل المالي", action: "breakeven", focus: "حساب الحد الأدنى للمبيعات", benefit: "معرفة متى تبدأ بتحقيق الأرباح الحقيقية" },
    fees: { name: "حاسبة عمولات بوابات الدفع (تابي، تمارا، مدى)", action: "fees", focus: "حساب الصافي بعد خصم الرسوم", benefit: "معرفة كم يتبقى في جيبك بعد خصم نسب البنوك وبوابات الدفع" },
    zatca: { name: "نظام الفوترة الإلكترونية المعتمدة", action: "invoices", focus: "الربط مع هيئة الزكاة والضريبة", benefit: "إصدار فواتير نظامية تتجنب المخالفات الحكومية" },
    whatsapp: { name: "أداة استرجاع السلال المتروكة عبر واتساب", action: "whatsapp", focus: "أتمتة الرسائل للعملاء", benefit: "استعادة المبيعات الضائعة وزيادة التحويلات بنسبة 35%" },
    roas: { name: "محلل عائد الإنفاق الإعلاني (ROAS)", action: "roas", focus: "قياس كفاءة الحملات الإعلانية", benefit: "معرفة كل ريال يتم صرفه على إعلانات سناب وتيك توك كم يعود أرباحاً" },
    returns: { name: "مدير سياسة المرتجعات الذكية", action: "returns", focus: "تقليل خسائر الشحن العكسي", benefit: "السيطرة على تكاليف التبديل والاسترجاع للمنتجات" },
    policy: { name: "منشئ السياسات القانونية والشروط", action: "policy", focus: "صياغة الشروط والأحكام", benefit: "حماية متجرك قانونياً بناءً على أنظمة التجارة الإلكترونية السعودية" },
    tax: { name: "حاسبة ضريبة القيمة المضافة 15%", action: "tax", focus: "فصل الضريبة عن الإيرادات", benefit: "تجنب أي أخطاء محاسبية عند تقديم الإقرارات الضريبية" },
    ltv: { name: "حاسبة القيمة الدائمة للعميل (LTV)", action: "ltv", focus: "قياس ولاء واستهلاك العملاء", benefit: "معرفة القيمة المالية للعميل الواحد على مدار تعامله مع متجرك" },
    promos: { name: "مخطط الخصومات والكوبونات", action: "promos", focus: "إدارة العروض الترويجية بأمان", benefit: "عمل خصومات قوية دون الوقوع في فخ الخسارة التشغيلية" },
    inventory: { name: "نظام التحكم الذكي بالمخزون", action: "inventory", focus: "تتبع حركة البضائع وتنبيهات النقص", benefit: "منع تكدس المخزون وتجميد السيولة النقدية" },
    shipping: { name: "مقارن أسعار شركات الشحن", action: "shipping", focus: "اختيار أفضل خيارات التوصيل", benefit: "تقليل تكاليف الشحن على المتجر والعميل نهائياً" },
    pricing: { name: "محرك التسعير الاستراتيجي للمنتجات", action: "pricing", focus: "وضع السعر التنافسي المربح", benefit: "تحقيق التوازن المثالي بين قدرة العميل الشرائية وأرباحك" },
    conversion: { name: "محلل معدل تحويل المتجر", action: "conversion", focus: "رفع نسب الشراء من الزوار", benefit: "تحويل زوار موقعك إلى مشترين فعليين بكل كفاءة" },
    checkout: { name: "مُحسّن صفحة إتمام الطلب", action: "checkout", focus: "إزالة عراقيل الدفع النهائي", benefit: "تقليل حالات مغادرة العملاء في اللحظة الأخيرة" },
    "profit-margin": { name: "حاسبة هامش الربح الصافي والدقيق", action: "profit-margin", focus: "تحديد الربح الصافي الحقيقي", benefit: "معرفة الأرقام الحقيقية لأرباحك بعد خصم جميع المصاريف الخفية" },
    "ads-budget": { name: "موزع ميزانية الحملات الإعلانية", action: "ads-budget", focus: "توزيع ميزانية التسويق بذكاء", benefit: "استثمار أموال الإعلانات في المنصات الأكثر دخذاً للأرباح" },
    "discount-calc": { name: "حاسبة الكوبونات المركبة", action: "discount-calc", focus: "حساب تأثير الخصومات على الأرباح", benefit: "التأكد من أن كوبونات التخفيض لا تلتهم أرباح الطلب" },
    "cart-recovery": { name: "منظومة استرداد المترددين", action: "cart-recovery", focus: "إعادة استهداف السلال غير المؤكدة", benefit: "مضاعفة أرباح المتجر عبر إغلاق صفقات المترددين" },
    "vat-calc": { name: "حاسبة الضريبة المضافة العكسية", action: "vat-calc", focus: "استخراج الإيرادات الصافية بدون الضريبة", benefit: "معرفة دخلك الصافي الحقيقي قبل احتساب الضريبة الحكومية" }
  };

  const currentNiche = nicheDetails[nicheKey] || nicheDetails['perfume'];
  const currentTool = toolDetails[toolKey] || toolDetails['breakeven'];
  const currentPlatform = platformNames[platformKey] || "منصة سلة";
  const currentCity = cityNames[cityKey] || "الرياض";

  return {
    slug: urlPath,
    title: `${currentTool.name} الأصلية لتجار ${currentNiche.title} على ${currentPlatform} في ${currentCity} 2026`,
    subtitle: `احسب ${currentNiche.keywordIntent} بكل دقة. ${currentTool.benefit} لتجار ${currentCity} عبر ${currentPlatform}.`,
    badge: `أداة معتمدة: ${currentNiche.title} (${currentCity})`,
    actionUrl: `https://engazia-app.vercel.app/hub/sa/${currentTool.action}`,
    imagePath: "/images/tools/tool-1.png",
    article: {
      h1: `أفضل ${currentTool.name} لمتاجر ${currentNiche.title} على ${currentPlatform} في ${currentCity}`,
      intro: `يبحث العديد من رواد الأعمال وأصحاب المتاجر الإلكترونية في ${currentCity} عن حلول جذرية لمواجهة تحدي ${currentNiche.problem}. ${currentNiche.customText} إن الاعتماد على التخمين في إدارة الأموال أو وضع أسعار عشوائية يهدد استمرارية المتجر، وهنا يأتي الدور الحيوي لـ ${currentTool.name} المصممة خصيصاً لتلبية احتياجات السوق السعودي بدقة متناهية.`,
      h2_1: `لماذا تحتاج متاجر ${currentNiche.title} في ${currentCity} إلى ${currentTool.name} فوراً؟`,
      p_1: `المعيار الحقيقي لنجاح أي متجر على ${currentPlatform} لا يقاس بحجم المبيعات الإجمالي فحسب، بل بمدى السيطرة على المصاريف الخفية. تساعدك هذه الأداة على ${currentTool.focus}، ومعالجة ${currentNiche.problem} بأسلوب تقني حديث يوفر عليك ساعات طويلة من الحسابات الخاطئة في جداول الإكسيل التقليدية.`,
      h2_2: `آلية العمل والربط المتوافق مع متطلبات السوق في ${currentCity}`,
      p_2: `تعتمد الأداة على خوارزمية ذكية تضمن لك ${currentNiche.solution}. فبدلاً من إهدار الوقت في تخمين الأرباح الصافية بعد خصم عمولات بوابات الدفع، رسوم التوصيل، وضريبة القيمة المضافة 15%، تمنحك ${currentTool.name} النتيجة الفورية لتتخذ قرارك التجاري بثقة تامة.`,
      h2_3: `مضاعفة مبيعات وأرباح متجرك على ${currentPlatform} خطوة بخطوة`,
      p_3: `التحول إلى الأتمتة واستخدام الأدوات الرقمية المتخصصة يضع متجرك في مقدمة المنافسين في ${currentCity}. ابدأ الآن بتطبيق ${currentTool.benefit}، واجعل متجرك على ${currentPlatform} يحقق أعلى كفاءة مالية وتشغيلية ممكنة.`
    },
    // أسئلة شائعة فريدة 100% ومصممة خصيصاً بنية بحث قوية وتجارية
    faqs: [
      { 
        q: `كيف تساعد ${currentTool.name} في حل مشاكل ${currentNiche.title} بمدينة ${currentCity}؟`, 
        a: `تقدم الأداة تحليلاً مباشراً يعالج ${currentNiche.problem} عبر ${currentTool.focus}، مما يضمن لك تسعيرًا آمنًا ومربحًا على ${currentPlatform}.` 
      },
      { 
        q: `هل تتضمن الأداة حسابات ضريبة 15% وعمولات بوابات الدفع في ${currentPlatform}؟`, 
        a: `نعم بالكامل، تدمج الأداة كافة نسب بوابات الدفع المعتمدة والضرائب الحكومية لتظهر لك صافي الأرباح الحقيقية بدقة تامة.` 
      },
      { 
        q: `ما هي الخطوة الأولى لتفعيل ${currentTool.name} على متجري الإلكتروني؟`, 
        a: `فقط اضغط على زر تفعيل الأداة بالأعلى، وأدخل بيانات مبيعاتك لتعطيك النتائج والقرارات الفورية خلال ثوانٍ معدودة دون أي تعقيد.` 
      }
    ]
  };
}
