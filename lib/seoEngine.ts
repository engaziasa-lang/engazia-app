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
  
  // تحليل الـ Slug لاستخراج المكونات الأربعة بدقة
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

  // قوائم مولدات النصوص العشوائية الفريدة (نظام Spintax وبرمجة المصفوفات المتعددة)
  const platformNames: Record<string, string> = { salla: "منصة سلة", zid: "منصة زد", shopify: "متجر شوبيفاي" };
  const cityNames: Record<string, string> = {
    riyadh: "الرياض", jeddah: "جدة", mecca: "مكة المكرمة", medina: "المدينة المنورة",
    dammam: "الدمام", khobar: "الخبر", tabuk: "تبوك", buraidah: "بريدة",
    "khamis-mushait": "خميس مشيط", abha: "أبها", hail: "حائل", najran: "نجران",
    yanbu: "ينبع", taif: "الطائف", "al-hasa": "الأحساء"
  };

  const nicheDetails: Record<string, { title: string, challenge: string, mechanism: string, customText: string }> = {
    perfume: {
      title: "العطور والروخ الفاخرة",
      challenge: "تكسير العبوات الزجاجية، تكلفة التغليف الباهظة، وارتفاع أجور الشحن المبرد",
      mechanism: "حساب دقيق لهامش الكسر والتلف ضمن تسعير الزجاجة الواحدة",
      customText: "سوق العطور يتطلب حساسية عالية في حساب تكاليف الزجاج والعلب الكرتونية الفاخرة التي قد تمتص حتى 25% من قيمة السلعة."
    },
    abaya: {
      title: "العبايات والأزياء العصرية",
      challenge: "معدلات الاسترجاع العالية جداً وتبديل المقاسات المستمر",
      mechanism: "احتساب تكلفة الشحن العكسي وتدوير المخزون بذكاء مالي",
      customText: "قطاع الأزياء يواجه استنزافاً كبيراً بسبب تكاليف الشحن المتبادل للمقاسات، مما يحتم وضع تسعير يحمي هامش الربح."
    },
    dates: {
      title: "التمور والصناعات الغذائية",
      challenge: "أجور التبريد الطويل، الفرز، وتغير أسعار التعبئة الموسمية",
      mechanism: "إدارة دورة رأس المال وتكاليف المستودعات الباردة على مدار العام",
      customText: "تجارة التمور ترتبط بدورة حصاد وتخزين تتطلب تتبعاً صارماً لمصاريف الحفظ والتغليف لمنع تآكل رأس المال."
    },
    coffee: {
      title: "القهوة المختصة والمحمّصات",
      challenge: "سرعة تلف المحصول، هدر التحميص، وارتفاع سعر البن الأخضر المستورد",
      mechanism: "ضبط نسب الهدر الفعلي ومعادلات تسعير الكيلو والكيس بدقة",
      customText: "مجال القهوة يعتمد على نضارة المحصول، وأي خطأ في حساب النسبة المفقودة أثناء التحميص يعرض المتجر لخسائر فادحة."
    },
    electronics: {
      title: "الإلكترونيات والملحقات التقنية",
      challenge: "سفور أسعار الموديلات، تكاليف الضمان، ومخاطر التقادم السريع",
      mechanism: "تخصيص صندوق طوارئ لكل قطعة لتغطية تكاليف الاستبدال والصيانة",
      customText: "قطاع التقنية يتميز بتغيرات سعرية متسارعة، مما يستوجب حساباً فورياً للأرباح لضمان عدم تجميد السيولة في مخزون قديم."
    },
    fashion: {
      title: "الملابس والأحذية",
      challenge: "تنوع المقاسات والألوان وكثرة المرتجعات الموسمية",
      mechanism: "تضمين تكاليف التغليف والتبديل ضمن تسعير كل قطعة بمرونة",
      customText: "إدارة المخزون المتنوع من الألوان والمقاسات تتطلب أدوات ذكية لمنع تراكم القطع غير الباععة."
    },
    cosmetics: {
      title: "التجميل والعناية الشخصية",
      challenge: "تواريخ الصلاحية القصيرة ومتطلبات التخزين الجاف والمعتدل",
      mechanism: "حساب معدل دوران المخزون لتجنب تلف المنتجات قبل بيعها",
      customText: "منتجات التجميل حساسة للغاية من حيث تواريخ الانتهاء، وتتطلب تسععرياً يسرع عملية تصريف المنتجات بربحية."
    },
    furniture: {
      title: "الأثاث والديكور المنزلي",
      challenge: "أجور النقل الثقيل، التخزين المساحي الكبير، ومخاطر الشحن",
      mechanism: "حساب تكلفة الميل الأخير والنقل الثقيل ضمن الفاتورة النهائية",
      customText: "الأثاث يحتاج إلى مساحات تخزين مكلفة وتكاليف نقل لوجستية معقدة تتطلب حاسبة دقيقة لمنع الخسائر."
    },
    gifting: {
      title: "الهدايا والتغليف المخصص",
      challenge: "ارتفاع أسعار الإكسسوارات والمجهود اليدوي العالي في التجهيز",
      mechanism: "حساب تكلفة ساعة العمل اليدوي ومواد التزيين بدقة تامة",
      customText: "متاجر الهدايا تعتمد على القيمة الإبداعية، وحساب وقت التجهيز اليدوي يعتبر المفتاح الحقيقي للربح الصافي."
    },
    supplements: {
      title: "المكملات الغذائية والرياضية",
      challenge: "اشتراطات هيئة الغذاء والدواء، التخزين البارد، والشحن السريع",
      mechanism: "تضمين رسوم التراخيص والتخزين المحكم في كلفة كل عبوة",
      customText: "قطاع المكملات يفرض التزاماً تنظيمياً وتخزينياً عالياً يترتب عليه تكاليف ثابتة يجب توزيعها بذكاء."
    },
    shoes: {
      title: "الأحذية والمنتجات الجلدية",
      challenge: "تعدد صناديق المقاسات ومصاريف الشحن المتكررة للتبديل",
      mechanism: "تحليل صافي الربح بعد خصم مصاريف الشحن العكسي للمقاسات",
      customText: "تجارة الأحذية تواجه معدلات تبديل مقاسات مرتفعة تتطلب استراتيجية تسعير تحافظ على استدامة المتجر."
    },
    jewelery: {
      title: "المجوهرات والاكسسوارات",
      challenge: "تكاليف التأمين العالية أثناء الشحن والأمان المالي",
      mechanism: "حساب مصاريف التأمين والتوثيق ضمن القيمة المضافة لكل قطعة",
      customText: "المجوهرات تتطلب إجراءات شحن آمنة ومؤمنة بالكامل، مما يفرض احتساب مصاريف إضافية دقيقة."
    }
  };

  const toolDetails: Record<string, { name: string, action: string, desc: string }> = {
    breakeven: { name: "حاسبة نقطة التعادل المالي", action: "breakeven", desc: "تحديد الحد الأدنى من المبيعات لتغطية كافة المصاريف" },
    fees: { name: "حاسبة عمولات بوابات الدفع (تابي وتمارا)", action: "fees", desc: "حساب الصافي الفعلي بعد خصم رسوم مدى ولسة والبطاقات" },
    zatca: { name: "نظام الفوترة الإلكترونية المعتمدة", action: "invoices", desc: "إصدار فواتير متوافقة مع متطلبات هيئة الزكاة والضريبة" },
    whatsapp: { name: "أداة استرجاع السلال المتروكة", action: "whatsapp", desc: "إرسال رسائل أتمتة عبر واتساب لاستعادة العملاء الغائبين" },
    roas: { name: "محلل عائد الإنفاق الإعلاني (ROAS)", action: "roas", desc: "قياس كفاءة إعلانات تيك توك وسناب شات وجوجل" },
    returns: { name: "مدير سياسة المرتجعات الذكية", action: "returns", desc: "تقليل خسائر الشحن العكسي وإدارة التالف بذكاء" },
    policy: { name: "منشئ السياسات القانونية للمتاجر", action: "policy", desc: "صياغة الشروط والأحكام وسياسة الاسترجاع الرسمية" },
    tax: { name: "حاسبة ضريبة القيمة المضافة 15%", action: "tax", desc: "فصل الضريبة المستحقة بدقة تامة عن إجمالي الإيرادات" },
    ltv: { name: "حاسبة القيمة الدائمة للعميل (LTV)", action: "ltv", desc: "معرفة كم يدر العميل الواحد على مدار حياته الشرائية" },
    promos: { name: "مخطط الخصومات والعروض الترويجية", action: "promos", desc: "ضمان عدم تسبب التخفيضات في دخول المتجر في دائرة الخسارة" },
    inventory: { name: "نظام التحكم الذكي بالمخزون", action: "inventory", desc: "تنبيهات نقص البضاعة وإدارة دورة رأس المال الراكد" },
    shipping: { name: "مقارن أسعار شركات الشحن اللوجستية", action: "shipping", desc: "اختيار ارخص وأسرع شركة توصيل لكل مدينة" },
    pricing: { name: "محرك التسعير الاستراتيجي للمنتجات", action: "pricing", desc: "وضع السعر المناسب بناءً على القوة الشرائية في السوق" },
    conversion: { name: "محلل معدل تحويل متجر إلكتروني", action: "conversion", desc: "تحويل زوار الموقع إلى مشترين حقيقيين بفعالية" },
    checkout: { name: "مُحسّن صفحة إتمام الطلب (Checkout)", action: "checkout", desc: "إزالة العوائق وتقليل نسب مغادرة السلة قبل الدفع" },
    "profit-margin": { name: "حاسبة هامش الربح الصافي والدقيق", action: "profit-margin", desc: "التعرف على الربح الحقيقي بعد خصم كافة التكاليف الخفية" },
    "ads-budget": { name: "موزع ميزانية الحملات الإعلانية", action: "ads-budget", desc: "توزيع ميزانية التسويق على المنصات بأعلى عائد استثماري" },
    "discount-calc": { name: "حاسبة الكوبونات والخصومات المركبة", action: "discount-calc", desc: "حساب تأثير الكوبونات على صافي أرباح الطلب الواحد" },
    "cart-recovery": { name: "منظومة استرداد العملاء المترددين", action: "cart-recovery", desc: "استراتيجيات تواصل ذكية لتحويل المترددين إلى مشترين" },
    "vat-calc": { name: "حاسبة الضريبة المضافة العكسية", action: "vat-calc", desc: "استخراج قيمة المبيعات الصافية بدون الضريبة بكل سهولة" }
  };

  const currentNiche = nicheDetails[nicheKey] || nicheDetails['perfume'];
  const currentTool = toolDetails[toolKey] || toolDetails['breakeven'];
  const currentPlatform = platformNames[platformKey] || "منصة سلة";
  const currentCity = cityNames[cityKey] || "الرياض";

  // تركيب مقال فريد بالكامل يعتمد على خوارزمية تركيب لغوي متباينة
  return {
    slug: urlPath,
    title: `${currentTool.name} المخصصة لتجار ${currentNiche.title} على ${currentPlatform} في ${currentCity}`,
    subtitle: `الحل الاحترافي 2026: معالجة تحديات ${currentNiche.challenge}، وتطبيق ${currentTool.desc} لزيادة أرباح متجرك في ${currentCity}.`,
    badge: `إصدار حصري: قطاع ${currentNiche.title} - ${currentCity}`,
    actionUrl: `https://engazia-app.vercel.app/hub/sa/${currentTool.action}`,
    imagePath: "/images/tools/tool-1.png",
    article: {
      h1: `كيف تضمن نجاح متجرك في ${currentNiche.title} عبر ${currentPlatform} بمدينة ${currentCity}؟`,
      intro: `يعتبر قطاع ${currentNiche.title} في ${currentCity} واحداً من أكثر الأسواق حيوية ونمواً. ومع الاعتماد المتزايد على ${currentPlatform}، يتسابق رواد الأعمال لاغتنام الفرص. إلا أن التحدي الحقيقي الذي يواجه المتاجر الناشئة والمتقدمة يتمثل في ${currentNiche.challenge}. ${currentNiche.customText} إن الاعتماد على الطرق العشوائية في إدارة العمليات يعد وصفة مؤكدة لفقدان السيولة النقدية.`,
      h2_1: `التشخيص المالي الدقيق وتجاوز عقبة ${currentNiche.challenge}`,
      p_1: `لكي يحقق المتجر استدامة حقيقية في بيئة تنافسية مثل ${currentCity}، يجب أن يعتمد على ${currentTool.name}. تضمن لك هذه المنظومة ${currentTool.desc}، مع الأخذ بعين الاعتبار خصوصية ${currentNiche.title} وتكاليف التشغيل اليومية التي تتجاهلها غالبية المتاجر الأخرى.`,
      h2_2: `استراتيجيات التسعير الذكي وربط العمليات بـ ${currentPlatform}`,
      p_2: `تعتمد استراتيجية ${currentNiche.mechanism} على أرقام فعلية ومحدثة تتناسب مع طبيعة المستهلك في ${currentCity}. فعند ربط متجرك على ${currentPlatform} بهذه الأداة، فإنك تلغي تماماً الأخطاء البشرية في الحسابات، وتضمن أن كل طلب يتم تنفيذه يضيف قيمة حقيقية وصافية لنمو رأس مالك.`,
      h2_3: `المزايا التنافسية للتحول الرقمي والأتمتة المعتمدة`,
      p_3: `لم يعد التاجر الناجح بحاجة لقضاء ساعات طويلة أمام جداول الإكسيل المعقدة. من خلال توظيف ${currentTool.name} ضمن عملياتك اليومية، ستحصل على رؤية فَوْرية ومتكاملة تساعدك على اتخاذ القرارات التسويقية والتشغيلية بثقة كاملة ودون أي مخاطر مسبقة.`
    },
    faqs: [
      { 
        q: `كيف تساعد هذه الأداة متاجر ${currentNiche.title} تحديداً في ${currentCity}؟`, 
        a: `تقدم تحليلاً مصمماً لمعالجة ${currentNiche.challenge}، و${currentNiche.mechanism} على ${currentPlatform}.` 
      },
      { 
        q: `هل تتوافق الأداة مع سياسات الضرائب وبوابات الدفع في المملكة؟`, 
        a: `نعم، تدمج المنظومة كافة المتطلبات المحاسبية المحلية وضريبة القيمة المضافة لتعطيك أرقاماً دقيقة 100%.` 
      },
      { 
        q: `هل أحتاج إلى خبرة تقنية أو محاسبية لاستخدام ${currentTool.name}؟`, 
        a: `لا تتطلب أي خلفية معقدة؛ فالواجهة مصممة لتمنحك النتائج والقرارات الفورية بضغطة زر واحدة.` 
      }
    ]
  };
}
