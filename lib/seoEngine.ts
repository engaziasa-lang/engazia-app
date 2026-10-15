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
    'taif', 'al-bahha', 'hafr-al-batin', 'unayzah', 'al-kharj'
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
    dammam: "الدمام", khobar: "الخبر", dhahran: "الظهران"
  };

  const nicheDetails: Record<string, { title: string, keywordIntent: string, problem: string, solution: string, deepContext: string }> = {
    perfume: { title: "متاجر العطور والروائح", keywordIntent: "تسعير زجاجات العطور، حساب تكلفة التغليف الفاخر", problem: "التهام تكاليف العبوات الزجاجية وأجور الشحن المبرد لأجزاء ضخمة من الأرباح", solution: "معادلة تسعير دقيقة تضمن هامش ربح صافي يحمي التاجر من تلف الشحنات", deepContext: "سوق العطور في المملكة يشهد تنافسية ضخمة تتطلب من التاجر حساب كل هللة تتعلق بثمن الزجاج والمضخة." },
    abaya: { title: "متاجر العبايات والأزياء", keywordIntent: "حساب تكلفة الشحن العكسي، تقليل مرتجعات المقاسات", problem: "استنزاف السيولة النقدية بسبب كثرة طلبات الاستبدال وتبديل المقاسات", solution: "تضمين تكاليف التوصيل المتبادل ضمن سعر البيع الأساسي بذكاء", deepContext: "قطاع الأقمشة والعبايات يتميز بارتفاع معدلات تبديل المقاسات، وكل عملية استرجاع تعني خسارة مزدوجة." },
    dates: { title: "متاجر التمور والصناعات الغذائية", keywordIntent: "حساب تكاليف المستودعات الباردة، مواسم الحصاد", problem: "ارتفاع مصاريف التبريد الطويل وتفاوت أسعار مواد التعبئة والتغليف", solution: "جدولة التدفقات النقدية وحساب تكلفة العبوة الكرتونية بدقة", deepContext: "تجارة التمور ترتبط بمواسم محددة وتتطلب حفظاً خاصاً في مستودعات مبردة تحافظ على جودة المنتج." }
  };

  const toolDetails: Record<string, { name: string, path: string, focus: string, benefit: string, deepDesc: string, image: string }> = {
    platforms: { name: "مقارن منصات التجارة", path: "platforms", focus: "مقارنة منصات سلة وصد وشوبيفاي", benefit: "اختيار المنصة الأنسب لنشاطك التجاري بدقة", deepDesc: "تساعدك هذه الأداة في تقارير ومقارنات واضحة لاختيار المنصة الأفضل لمشروعك.", image: "tool-1.png" },
    profit: { name: "حاسبة الأرباح الشاملة", path: "profit", focus: "تحديد الربح الصافي الحقيقي", benefit: "معرفة الأرقام الحقيقية لأرباحك بعد خصم كافة المصاريف", deepDesc: "تحديد الصافي الحقيقي للأرباح بعد خصم كافة المصاريف.", image: "tool-8.png" },
    fees: { name: "حاسبة رسوم بوابات الدفع", path: "fees", focus: "حساب الصافي بعد خصم الرسوم", benefit: "معرفة المتبقي في جيبك بعد خصم نسب البنوك وبوابات الدفع", deepDesc: "حساب دقيق لعمولات بوابات الدفع والتقسيط.", image: "tool-7.png" }
  };

  const currentNiche = nicheDetails[nicheKey] || nicheDetails['perfume'];
  const currentTool = toolDetails[toolKey] || toolDetails['profit'];
  const currentPlatform = platformNames[platformKey] || "منصة سلة";
  const currentCity = cityNames[cityKey] || "الرياض";

  const asciiHash = urlPath.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const dynamicRelatedLinks = [];
  
  for (let i = 1; i <= 9; i++) {
    const tIdx = (asciiHash + i * 7) % toolsList.length;
    const pIdx = (asciiHash + i * 3) % platformsList.length;
    const nIdx = (asciiHash + i * 11) % nichesList.length;
    const cIdx = (asciiHash + i * 13) % citiesList.length;

    const tKey = toolsList[tIdx];
    const pKey = platformsList[pIdx];
    const nKey = nichesList[nIdx];
    const cKey = citiesList[cIdx];

    const generatedToolName = toolDetails[tKey]?.name || "أداة إنجازيا";
    const generatedPlatformName = platformNames[pKey] || "منصة سلة";
    const generatedNicheTitle = nicheDetails[nKey]?.title || "المتاجر";

    dynamicRelatedLinks.push({
      title: `${generatedToolName} لـ ${generatedNicheTitle} عبر ${generatedPlatformName}`,
      href: `/seo/${tKey}-${pKey}-${nKey}-${cKey}`
    });
  }

  return {
    slug: urlPath,
    title: `${currentTool.name} لتجار ${currentNiche.title} على ${currentPlatform} في ${currentCity} 2026`,
    subtitle: `الدليل الشامل والمفصل: احسب ${currentNiche.keywordIntent} بكل دقة. ${currentTool.benefit} لتجار ${currentCity} عبر ${currentPlatform}.`,
    badge: `أداة معتمدة لرواد الأعمال في السعودية`,
    actionUrl: `https://engazia-app.vercel.app/hub/sa`,
    imagePath: `/images/tools/${currentTool.image || 'tool-1.png'}`,
    article: {
      h1: `الدليل الشامل: استخدام ${currentTool.name} لمتاجر ${currentNiche.title} على ${currentPlatform} في ${currentCity}`,
      intro: `يشهد قطاع ${currentNiche.title} في مدينة ${currentCity} نمواً متسارعاً وحركة تجارية نشطة للغاية. ومع التوسع الكبير في اعتماد التجار على ${currentPlatform} لإدارة أعمالهم الرقمية، أصبح التحدي الأكبر لا يقتصر فقط على جذب الزوار، بل في القدرة على إدارة الهوامش المالية بحرفية تامة. ${currentNiche.deepContext} إن الاعتماد على التخمين في وضع أسعار المنتجات أو إغفال المصاريف التشغيلية يضع المتجر في دائرة الخطر، ولذلك صُممت ${currentTool.name} لتكون بوصلتك الدقيقة نحو النمو المستدام.`,
      h2_1: `التحديات المالية الخاصة بمتاجر ${currentNiche.title} في ${currentCity}`,
      p_1: `عندما يتعلق الأمر بإدارة متجر إلكتروني متخصص في ${currentNiche.title} ضمن نطاق ${currentCity} وخارجها، يبرز بوضوح تحدي ${currentNiche.problem}. ${currentNiche.solution}. الكثير من رواد الأعمال يبدؤون مشاريعهم بحماس كبير، ولكنهم يصطدمون لاحقاً بتآكل الأرباح نتيجة عدم احتساب المصاريف الخفية مثل رسوم بوابات الدفع، تكاليف التغليف، وهامش المرتجعات. هذه الأداة تضع بين يديك رؤية كشفية كاملة تمنع أي مفاجآت غير سارة.`,
      h2_2: `دور ${currentTool.name} في ${currentTool.focus} ورفع كفاءة متجرك`,
      p_2: `${currentTool.deepDesc} وفي بيئة تنافسية تتطلب قرارات سريعة ومدروسة على ${currentPlatform}، لم يعد متاحاً إهدار الوقت في العمل اليدوي وجداول الحسابات البدائية. إن استخدام ${currentTool.name} يضمن لك الحصول على نتائج فورية ومبنية على معادلات رياضية دقيقة معتمدة في السوق السعودي لتنظيم عملياتك باحترافية تامة.`,
      h2_3: `استراتيجيات التكامل الرقمي والأتمتة لمضاعفة أرباح ${currentNiche.title}`,
      p_3: `التجارة الإلكترونية الناجحة تعتمد بشكل أساسي على تقليل الجهد البشري في العمليات الروتينية وزيادة الاعتماد على الأنظمة الذكية. عبر ربط متجرك بهذه المنظومة، ستتمكن من تحقيق ${currentTool.benefit}، مما يتيح لك توجيه تركيزك الكامل نحو التوسع التسويقي، بناء ولاء العملاء، وابتكار عروض تنافسية تجذب شرائح جديدة من المستهلكين في ${currentCity}.`,
      h2_4: `خطوات عملية للبدء الفوري وتحقيق الاستدامة المالية`,
      p_4: `للبدء في جني الثمار وضمان استقرار متجرك على ${currentPlatform}، كل ما تحتاجه هو الضغط على زر تفعيل الأداة بالأعلى وإدخال بياناتك الحقيقية لتعطيك الأداة مؤشرات واضحة تسير على هداها. إن امتلاك الأدوات الصحيحة في الوقت المناسب هو الفارق الحقيقي بين متجر يتعثر ومتجر آخر يتصدر قطاعه.`
    },
    faqs: [
      { q: `كيف تسهم ${currentTool.name} بشكل مباشر في معالجة تحديات ${currentNiche.title} في ${currentCity}؟`, a: `تقدم الأداة تحليلاً محاسبياً وتشغيلياً مخصصاً يعالج ${currentNiche.problem} عبر ${currentTool.focus}، مما يضمن تسعيرًا محكماً ومربحًا على ${currentPlatform}.` },
      { q: `هل تشتمل العمليات الحسابية للأداة على نسب ضريبة القيمة المضافة 15% وعمولات بوابات الدفع؟`, a: `نعم، تتضمن المنظومة بشكل كامل كافة نسب بوابات الدفع المعتمدة في المملكة والضرائب النظامية لتعطيك الأرقام الصافية بدقة مطلقة.` },
      { q: `هل أحتاج إلى خبرة محاسبية متقدمة للتعامل مع ${currentTool.name}؟`, a: `إطلاقاً، الواجهة صممت خصيصاً لتكون سهلة ومرنة، وتمنحك النتائج والقرارات الفورية بضغطة زر ودون أي تعقيدات تقنية.` },
      { q: `ما هي العوائد المتوقعة عند استخدام هذه الأداة بشكل دوري في إدارة المتجر؟`, a: `تساعدك على ${currentTool.benefit}، وتمنع استنزاف السيولة النقدية، مما ينعكس بشكل إيجابي ومباشر على صافي أرباح متجرك ونمو نشاطك التجاري.` }
    ],
    relatedLinks: dynamicRelatedLinks
  };
}
