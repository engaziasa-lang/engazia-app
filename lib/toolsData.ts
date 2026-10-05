// lib/toolsData.ts

export interface ToolData {
  id: number;
  slug: string;
  title: string;
  description: string;
  imagePath: string;
  features: string[];
  faqs?: { question: string; answer: string }[];
}

export const toolsData: Record<string, ToolData> = {
  "breakeven-calculator": {
    id: 1,
    slug: "breakeven-calculator",
    title: "حاسبة أرباح ونقطة التعادل (15% ضريبة)",
    description: "احسب صافي أرباحك بدقة بعد خصم التكاليف، رسوم الشحن، وضريبة القيمة المضافة.",
    imagePath: "/images/tools/tool-1.png",
    features: ["حساب دقيق لهامش الربح", "متوافق مع ضريبة القيمة المضافة 15%", "تحليل فوري للتكاليف والشحن"],
    faqs: [
      { question: "كيف تساعدني حاسبة نقطة التعادل؟", answer: "تحدد لك عدد القطع الواجب بيعها لتغطية التكاليف وتحقيق الأرباح." }
    ]
  },
  "payment-gateway-fees": {
    id: 2,
    slug: "payment-gateway-fees",
    title: "حاسبة رسوم بوابات الدفع (تابي، تمارا، مدى)",
    description: "احسب نسب بوابات الدفع المحلية وتأثيرها الفعلي على هوامش أرباح متجرك.",
    imagePath: "/images/tools/tool-2.png",
    features: ["دعم لجميع بوابات الدفع المحلية", "حساب الرسوم الثابتة والمتغيرة", "معرفة المبلغ الصافي الحقيقي"]
  },
  "zatca-invoice-generator": {
    id: 3,
    slug: "zatca-invoice-generator",
    title: "مولد الفواتير الإلكترونية (زاتكا)",
    description: "أنشئ فواتير مبيعات نظامية مبسطة (QR Code) متوافقة مع متطلبات هيئة الزكاة والضريبة.",
    imagePath: "/images/tools/tool-3.png",
    features: ["متوافق مع اشتراطات هيئة الزكاة والضريبة", "توليد رمز الاستجابة السريعة QR Code", "إصدار فواتير مبسطة"]
  },
  "ads-roi-analyzer": {
    id: 4,
    slug: "ads-roi-analyzer",
    title: "محلل عائد الإعلانات (سناب وتيك توك)",
    description: "قس بدقة أداء إعلاناتك وهل تحقق عوائد مجزية في السوق السعودي أم تستنزف ميزانيتك.",
    imagePath: "/images/tools/tool-4.png",
    features: ["قياس دقيق لعائد الإنفاق الإعلاني (ROAS)", "تتبع أداء حملات سناب شات وتيك توك", "تنبيهات فورية عند ضعف الأداء"]
  },
  "whatsapp-crm": {
    id: 5,
    slug: "whatsapp-crm",
    title: "إدارة عملاء واتساب (إنجازيا Pro Max)",
    description: "إدارة السلال المتروكة، إرسال روابط الدفع السريعة، وتصنيف عملاء المتجر الفاعلين.",
    imagePath: "/images/tools/tool-5.png",
    features: ["استرجاع السلال المتروكة عبر واتساب", "روابط دفع سريعة للعملاء", "تصنيف وتنظيم عملاء المتجر"]
  },
  "returns-loss-analyzer": {
    id: 6,
    slug: "returns-loss-analyzer",
    title: "محلل خسائر المرتجعات والشحن العكسي",
    description: "قس تأثير الاسترجاع والاستبدال على صافي أرباحك الشهرية وتدفقك النقدي.",
    imagePath: "/images/tools/tool-6.png",
    features: ["حساب خسائر الشحن العكسي بدقة", "تتبع تأثير الاسترجاع على التدفق النقدي", "تقليل النسبة المئوية للمرتجعات"]
  },
  "tax-return-prep": {
    id: 7,
    slug: "tax-return-prep",
    title: "مجهز بيانات الإقرار الضريبي",
    description: "اجمع ورتب بيانات مبيعاتك ومشترواتك لتسهيل رفع الإقرار الضريبي لزاتكا بدون أخطاء.",
    imagePath: "/images/tools/tool-7.png",
    features: ["فصل مبيعات ضريبة المخرجات والمداخلات", "تصدير البيانات بصيغة جاهزة للإقرار", "منع الأخطاء الحسابية في الزكاة والضريبة"]
  },
  "platform-fees-calculator": {
    id: 8,
    slug: "platform-fees-calculator",
    title: "حاسبة رسوم المنصات (سلة، زد)",
    description: "احسب التكاليف الخفية واشتراكات المنصات المحلية لضمان تسعير منتجاتك بشكل صحيح.",
    imagePath: "/images/tools/tool-8.png",
    features: ["توزيع اشتراك الباقة على الطلب الواحد", "حساب رسوم العمولة الخفية للمنصات", "ضمان هامش ربح عادل بعد خصم الاشتراكات"]
  },
  "influencer-ads-roi": {
    id: 9,
    slug: "influencer-ads-roi",
    title: "حاسبة جدوى إعلانات المشاهير",
    description: "حلل العائد المتوقع (ROI) من إعلانات المؤثرين قبل دفع مبالغ الحملة التسويقية.",
    imagePath: "/images/tools/tool-9.png",
    features: ["توقع عدد الطلبات والأرباح من المؤثر", "اتخاذ قرار دقيق (تشرع بالإعلان أو لا)", "حساب نقطة التعادل للحملة الإعلانية"]
  },
  "cod-cost-analyzer": {
    id: 10,
    slug: "cod-cost-analyzer",
    title: "محلل تكاليف الدفع عند الاستلام (COD)",
    description: "احسب نسبة المخاطرة، رسوم شركات الشحن، وخسائر عدم الاستلام وتأثيرها على صافي أرباحك.",
    imagePath: "/images/tools/tool-10.png",
    features: ["حساب رسوم خدمة التحصيل للدفع عند الاستلام", "تقدير خسائر الطلبات المرفوضة والمتلفة", "معرفة التكلفة الفعلية الخفية لخدمة COD"]
  },
  "local-shipping-tracker": {
    id: 11,
    slug: "local-shipping-tracker",
    title: "مدير تتبع الشحنات المحلية",
    description: "تابع حالات الشحنات (سمسا، أرامكس، ريدبوكس) وحل استفسارات تأخر التوصيل عبر واتساب.",
    imagePath: "/images/tools/tool-11.png",
    features: ["متابعة حالة الشحنات المسجلة فورياً", "تحديد الشحنات المتأخرة التي تحتاج تدخلاً", "تسهيل خدمة العملاء عبر قوالب جاهزة"]
  },
  "seasonal-inventory-planner": {
    id: 12,
    slug: "seasonal-inventory-planner",
    title: "مخطط المخزون للمواسم السعودية",
    description: "توقع الكميات المطلوبة لمواسم السعودية (رمضان، العيد، اليوم الوطني) لتجنب نفاد المخزون.",
    imagePath: "/images/tools/tool-12.png",
    features: ["حساب الكمية المطلوبة لتغطية الموسم", "توقع نسب نمو الطلب بناءً على بيانات الأعوام السابقة", "حماية المتجر من خسارة المبيعات بنفاد البضاعة"]
  },
  "operating-expenses-manager": {
    id: 13,
    slug: "operating-expenses-manager",
    title: "مدير النفقات والمصاريف التشغيلية",
    description: "تتبع مصاريف المتجر الثابتة والمتغيرة، وتكرار المصروف لضبط التدفق النقدي.",
    imagePath: "/images/tools/tool-13.png",
    features: ["فصل المصاريف الثابتة عن المتغيرة", "تتبع الاشتراكات والرواتب الشهرية والسنوية", "مؤشرات فورية لصافي التدفق النقدي للمتجر"]
  },
  "policy-generator": {
    id: 14,
    slug: "policy-generator",
    title: "مولد السياسات وقوانين وزارة التجارة",
    description: "أنشئ صفحات الاستبدال والاسترجاع وسياسة الخصوصية المتوافقة مع القوانين المحلية.",
    imagePath: "/images/tools/tool-14.png",
    features: ["سياسات استبدال واسترجاع متوافقة نظامياً", "توليد تلقائي مع بيانات متجرك ووسائل الدعم", "حماية قانونية للمتجر الإلكتروني"]
  },
  "jasmal-data-extractor": {
    id: 15,
    slug: "jasmal-data-extractor",
    title: "جاسمال (Jasmal) لاستخراج البيانات",
    description: "اسحب بيانات المنتجات والأسعار من المتاجر المنافسة ورتبها فوراً في ملفات إكسل.",
    imagePath: "/images/tools/tool-15.png",
    features: ["استخراج أسعار ومنتجات المنافسين", "تصدير البيانات المصرودة لملفات إكسل", "مراقبة السوق والتسعير الذكي"]
  },
  "auto-review-request": {
    id: 16,
    slug: "auto-review-request",
    title: "نظام طلب التقييمات الآلي",
    description: "أرسل رسائل تلقائية للعملاء عبر واتساب بعد الاستلام لجمع التقييمات وبناء الموثوقية.",
    imagePath: "/images/tools/tool-16.png",
    features: ["أتمتة طلبات التقييم بعد اكتمال الطلب", "رفع معدل الموثوقية لدى العملاء الجدد", "متابعة استجابة العملاء وتوثيقها"]
  },
  "dropshipping-profit-calculator": {
    id: 17,
    slug: "dropshipping-profit-calculator",
    title: "حاسبة أرباح الدروبشيبينغ",
    description: "احسب هوامش الربح للمنتجات المستوردة مع أخذ رسوم الجمارك والشحن الدولي في الحسبان.",
    imagePath: "/images/tools/tool-17.png",
    features: ["حساب دقيق لتكلفة الشحن الدولي والجمارك", "تحديد صافي الربح الفعلي للقطعة المستوردة", "تحليل ربحية منتجات الموردين الخارجيين"]
  },
  "explore-text-generator": {
    id: 18,
    slug: "explore-text-generator",
    title: "مولد نصوص الإكسبلور (باللهجة السعودية)",
    description: "اصنع سكريبتات تيك توك وإعلانات جذابة باللهجة المحلية لزيادة معدل التحويل.",
    imagePath: "/images/tools/tool-18.png",
    features: ["سكريبتات إعلانية مصممة خصيصاً للسوق السعودي", "هيكل إعلاني احترافي (خطاف، مشكلة، حل، عرض)", "زيادة التفاعل ومعدل المبيعات"]
  },
  "quick-customer-service": {
    id: 19,
    slug: "quick-customer-service",
    title: "قوالب خدمة العملاء السريعة",
    description: "انسخ ردود احترافية جاهزة للرد على استفسارات العملاء المكررة عبر واتساب.",
    imagePath: "/images/tools/tool-19.png",
    features: ["قوالب رد جاهزة لاستفسارات الشحن والتأخير", "توفير الوقت في خدمة العملاء والرد الفوري", "توحيد نبرة الردود الاحترافية للمتجر"]
  },
  "discount-coupon-calculator": {
    id: 20,
    slug: "discount-coupon-calculator",
    title: "حاسبة جدوى أكواد الخصم والعروض",
    description: "تأكد من أن عروضك الترويجية (مثل 1+1 أو الشحن المجاني) لا تسبب لك خسائر مخفية.",
    imagePath: "/images/tools/tool-20.png",
    features: ["حساب صافي الربح بعد تطبيق الخصم الترويجي", "التحقق من حالة العرض (مربح أو مسبب لخسارة)", "حماية العروض الكبرى من تآكل الأرباح"]
  },
  "ltv-calculator": {
    id: 21,
    slug: "ltv-calculator",
    title: "حاسبة القيمة الدائمة للعميل (LTV)",
    description: "احسب القيمة الإجمالية للعميل على مدار طوال فترة تعامله مع متجرك لضبط استراتيجيات الإعلانات.",
    imagePath: "/images/tools/tool-21.png",
    features: ["معرفة معدل الإنفاق السنوي للعميل", "قياس كفاءة الاحتفاظ بالعملاء (Retention Rate)", "مقارنة القيمة بتكلفة الاستحواذ (CAC)"]
  },
  "ab-testing-calculator": {
    id: 22,
    slug: "ab-testing-calculator",
    title: "حاسبة اختبارات الإعلانات (A/B)",
    description: "قارن بين حملتين إعلانيتين لتعرف أيهما يحقق أفضل عائد بأقل تكلفة للطلب.",
    imagePath: "/images/tools/tool-22.png",
    features: ["مقارنة تكلفة الطلب (CPA) بين حملتين", "تحديد الحملة الأفضل بدقة متناهية", "تحسين كفاءة الميزانية الإعلانية"]
  },
  "whatsapp-link-generator": {
    id: 23,
    slug: "whatsapp-link-generator",
    title: "صانع روابط واتساب السريعة",
    description: "أنشئ روابط مخصصة برسائل جاهزة لبيو تيك توك أو تمريرها في حملات الانستغرام.",
    imagePath: "/images/tools/tool-23.png",
    features: ["توليد روابط واتساب مع رسالة جاهزة تلقائياً", "تنظيم تتبع الحملات الإعلانية ومنصات الترافيك", "معاينة وتجربة الرابط فوراً قبل النسخ"]
  },
  "saudi-store-growth-secrets": {
    id: 24,
    slug: "saudi-store-growth-secrets",
    title: "أسرار نمو المتاجر السعودية",
    description: "مكتبة استراتيجيات حصرية لزيادة معدل التحويل ورفع ولاء العملاء في السوق المحلي.",
    imagePath: "/images/tools/tool-24.png",
    features: ["استراتيجيات مجربة لرفع معدلات التحويل", "أفكار برامج ولاء العملاء في السوق السعودي", "خطوات عملية للتطوير المستمر للمتجر"]
  }
};

// دالة مرنة لمعالجة أي مسار ديناميكي ومنع ظهور 404
export function getToolBySlug(slug: string): ToolData | undefined {
  if (toolsData[slug]) {
    return toolsData[slug];
  }
  // إذا كان الرابط ديناميكياً فرعياً، يتم ربطه بالأداة الأولى أو المطابقة لضمان عمل
