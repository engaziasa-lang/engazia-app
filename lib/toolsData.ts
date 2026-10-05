// lib/toolsData.ts

export interface ToolData {
  id: number;
  slug: string;
  title: string;
  description: string;
  imagePath: string;
  features: string[];
}

export const toolsData: Record<string, ToolData> = {
  "breakeven-calculator": {
    id: 1,
    slug: "breakeven-calculator",
    title: "حاسبة أرباح ونقطة التعادل",
    description: "احسب صافي أرباحك بدقة بعد خصم التكاليف، رسوم الشحن، وضريبة القيمة المضافة.",
    imagePath: "/images/tools/tool-1.png",
    features: ["حساب دقيق لهامش الربح", "متوافق مع ضريبة 15%", "تحليل فوري للتكاليف"]
  },
  "payment-gateway-fees": {
    id: 2,
    slug: "payment-gateway-fees",
    title: "حاسبة رسوم بوابات الدفع",
    description: "احسب نسب بوابات الدفع المحلية وتأثيرها الفعلي على هوامش أرباح متجرك.",
    imagePath: "/images/tools/tool-2.png",
    features: ["دعم لجميع البوابات", "حساب الرسوم الثابتة والمتغيرة", "معرفة المبلغ الصافي"]
  },
  "zatca-invoice-generator": {
    id: 3,
    slug: "zatca-invoice-generator",
    title: "مولد الفواتير الإلكترونية (زاتكا)",
    description: "أنشئ فواتير مبيعات نظامية مبسطة (QR Code) متوافقة مع متطلبات هيئة الزكاة.",
    imagePath: "/images/tools/tool-3.png",
    features: ["متوافق مع زاتكا", "توليد QR Code", "إصدار فواتير مبسطة"]
  },
  "ads-roi-analyzer": {
    id: 4,
    slug: "ads-roi-analyzer",
    title: "محلل عائد الإعلانات",
    description: "قس بدقة أداء إعلاناتك وهل تحقق عوائد مجزية في السوق السعودي.",
    imagePath: "/images/tools/tool-4.png",
    features: ["قياس دقيق لـ ROAS", "تتبع حملات سناب وتيك توك", "تنبيهات فورية للأداء"]
  },
  "whatsapp-crm": {
    id: 5,
    slug: "whatsapp-crm",
    title: "إدارة عملاء واتساب",
    description: "إدارة السلال المتروكة، إرسال روابط الدفع السريعة، وتصنيف العملاء.",
    imagePath: "/images/tools/tool-5.png",
    features: ["استرجاع السلال المتروكة", "روابط دفع سريعة", "تنظيم العملاء"]
  },
  "returns-loss-analyzer": {
    id: 6,
    slug: "returns-loss-analyzer",
    title: "محلل خسائر المرتجعات",
    description: "قس تأثير الاسترجاع والاستبدال على صافي أرباحك الشهرية.",
    imagePath: "/images/tools/tool-6.png",
    features: ["حساب خسائر الشحن العكسي", "تتبع التدفق النقدي", "تقليل نسبة المرتجعات"]
  },
  "tax-return-prep": {
    id: 7,
    slug: "tax-return-prep",
    title: "مجهز بيانات الإقرار الضريبي",
    description: "اجمع ورتب بيانات مبيعاتك ومشترواتك لتسهيل رفع الإقرار الضريبي.",
    imagePath: "/images/tools/tool-7.png",
    features: ["فصل مبيعات الضريبة", "تصدير بيانات جاهزة", "منع الأخطاء الحسابية"]
  },
  "platform-fees-calculator": {
    id: 8,
    slug: "platform-fees-calculator",
    title: "حاسبة رسوم المنصات",
    description: "احسب التكاليف الخفية واشتراكات المنصات لضمان تسعير منتجاتك.",
    imagePath: "/images/tools/tool-8.png",
    features: ["توزيع الاشتراك على الطلبات", "حساب عمولة المنصات", "ضمان هامش ربح عادل"]
  },
  "influencer-ads-roi": {
    id: 9,
    slug: "influencer-ads-roi",
    title: "حاسبة جدوى إعلانات المشاهير",
    description: "حلل العائد المتوقع من إعلانات المؤثرين قبل دفع مبالغ الحملة.",
    imagePath: "/images/tools/tool-9.png",
    features: ["توقع الطلبات والأرباح", "قرار دقيق للإعلان", "حساب نقطة التعادل"]
  },
  "cod-cost-analyzer": {
    id: 10,
    slug: "cod-cost-analyzer",
    title: "محلل تكاليف الدفع عند الاستلام",
    description: "احسب نسبة المخاطرة، رسوم الشحن، وخسائر عدم الاستلام.",
    imagePath: "/images/tools/tool-10.png",
    features: ["حساب رسوم التحصيل", "تقدير خسائر الطلبات المرفوضة", "معرفة التكلفة الخفية"]
  },
  "local-shipping-tracker": {
    id: 11,
    slug: "local-shipping-tracker",
    title: "مدير تتبع الشحنات المحلية",
    description: "تابع حالات الشحنات وحل استفسارات تأخر التوصيل عبر واتساب.",
    imagePath: "/images/tools/tool-11.png",
    features: ["متابعة الشحنات فورياً", "تحديد الشحنات المتأخرة", "قوالب خدمة عملاء جاهزة"]
  },
  "seasonal-inventory-planner": {
    id: 12,
    slug: "seasonal-inventory-planner",
    title: "مخطط المخزون للمواسم",
    description: "توقع الكميات المطلوبة لمواسم السعودية لتجنب نفاد المخزون.",
    imagePath: "/images/tools/tool-12.png",
    features: ["حساب الكمية لتغطية الموسم", "توقع نمو الطلب", "حماية المتجر من نفاد البضاعة"]
  },
  "operating-expenses-manager": {
    id: 13,
    slug: "operating-expenses-manager",
    title: "مدير النفقات التشغيلية",
    description: "تتبع مصاريف المتجر الثابتة والمتغيرة لضبط التدفق النقدي.",
    imagePath: "/images/tools/tool-13.png",
    features: ["فصل المصاريف الثابتة", "تتبع الاشتراكات والرواتب", "مؤشرات التدفق النقدي"]
  },
  "policy-generator": {
    id: 14,
    slug: "policy-generator",
    title: "مولد السياسات وقوانين التجارة",
    description: "أنشئ صفحات الاستبدال والاسترجاع وسياسة الخصوصية المتوافقة نظامياً.",
    imagePath: "/images/tools/tool-14.png",
    features: ["سياسات متوافقة نظامياً", "توليد تلقائي بالبيانات", "حماية قانونية للمتجر"]
  },
  "jasmal-data-extractor": {
    id: 15,
    slug: "jasmal-data-extractor",
    title: "جاسمال لاستخراج البيانات",
    description: "اسحب بيانات المنتجات والأسعار من المنافسين ورتبها في إكسل.",
    imagePath: "/images/tools/tool-15.png",
    features: ["استخراج أسعار المنافسين", "تصدير لملفات إكسل", "مراقبة السوق والتسعير"]
  },
  "auto-review-request": {
    id: 16,
    slug: "auto-review-request",
    title: "نظام طلب التقييمات الآلي",
    description: "أرسل رسائل تلقائية للعملاء بعد الاستلام لجمع التقييمات وبناء الموثوقية.",
    imagePath: "/images/tools/tool-16.png",
    features: ["أتمتة طلب التقييم", "رفع معدل الموثوقية", "متابعة استجابة العملاء"]
  },
  "dropshipping-profit-calculator": {
    id: 17,
    slug: "dropshipping-profit-calculator",
    title: "حاسبة أرباح الدروبشيبينغ",
    description: "احسب هوامش الربح للمنتجات المستوردة مع رسوم الجمارك والشحن.",
    imagePath: "/images/tools/tool-17.png",
    features: ["حساب تكلفة الشحن الدولي", "تحديد صافي الربح الفعلي", "تحليل ربحية الموردين"]
  },
  "explore-text-generator": {
    id: 18,
    slug: "explore-text-generator",
    title: "مولد نصوص الإكسبلور",
    description: "اصنع سكريبتات تيك توك وإعلانات جذابة باللهجة المحلية.",
    imagePath: "/images/tools/tool-18.png",
    features: ["سكريبتات إعلانية سعودية", "هيكل إعلاني احترافي", "زيادة التفاعل والمبيعات"]
  },
  "quick-customer-service": {
    id: 19,
    slug: "quick-customer-service",
    title: "قوالب خدمة العملاء السريعة",
    description: "انسخ ردود احترافية جاهزة للرد على الاستفسارات المكررة.",
    imagePath: "/images/tools/tool-19.png",
    features: ["قوالب رد فورية", "توفير وقت الدعم", "توحيد نبرة الردود"]
  },
  "discount-coupon-calculator": {
    id: 20,
    slug: "discount-coupon-calculator",
    title: "حاسبة جدوى أكواد الخصم",
    description: "تأكد من أن عروضك الترويجية لا تسبب لك خسائر مخفية.",
    imagePath: "/images/tools/tool-20.png",
    features: ["حساب الربح بعد الخصم", "التحقق من حالة العرض", "حماية الأرباح الكبرى"]
  },
  "ltv-calculator": {
    id: 21,
    slug: "ltv-calculator",
    title: "حاسبة القيمة الدائمة للعميل",
    description: "احسب القيمة الإجمالية للعميل طوال فترة تعامله لضبط الإعلانات.",
    imagePath: "/images/tools/tool-21.png",
    features: ["معرفة الإنفاق السنوي", "قياس الاحتفاظ بالعملاء", "مقارنة القيمة بالتكلفة"]
  },
  "ab-testing-calculator": {
    id: 22,
    slug: "ab-testing-calculator",
    title: "حاسبة اختبارات الإعلانات",
    description: "قارن بين حملتين إعلانيتين لتعرف أيهما يحقق أفضل عائد.",
    imagePath: "/images/tools/tool-22.png",
    features: ["مقارنة تكلفة الطلب CPA", "تحديد الحملة الرابحة", "تحسين الميزانية الإعلانية"]
  },
  "whatsapp-link-generator": {
    id: 23,
    slug: "whatsapp-link-generator",
    title: "صانع روابط واتساب السريعة",
    description: "أنشئ روابط مخصصة برسائل جاهزة لبيو تيك توك أو انستغرام.",
    imagePath: "/images/tools/tool-23.png",
    features: ["توليد روابط برسائل جاهزة", "تنظيم تتبع الحملات", "معاينة الرابط فوراً"]
  },
  "saudi-store-growth-secrets": {
    id: 24,
    slug: "saudi-store-growth-secrets",
    title: "أسرار نمو المتاجر السعودية",
    description: "مكتبة استراتيجيات حصرية لزيادة معدل التحويل وولاء العملاء.",
    imagePath: "/images/tools/tool-24.png",
    features: ["استراتيجيات رفع التحويل", "برامج ولاء العملاء", "خطوات عملية للتطوير"]
  },
  "tool-25": {
    id: 25,
    slug: "tool-25",
    title: "أداة إنجازيا المتقدمة 25",
    description: "أداة تحليل متطورة لمضاعفة المبيعات وكفاءة التشغيل.",
    imagePath: "/images/tools/tool-25.png",
    features: ["أداء سريع ودقيق", "متوافقة مع المنصات", "تحليلات فورية"]
  },
  "tool-26": {
    id: 26,
    slug: "tool-26",
    title: "أداة إنجازيا المتقدمة 26",
    description: "نظام أتمتة مخصص لرفع كفاءة التسويق الرقمي وإدارة العملاء.",
    imagePath: "/images/tools/tool-26.png",
    features: ["أتمتة العمليات", "واجهة ميسرة", "دعم وتحديثات مستمرة"]
  },
  "tool-27": {
    id: 27,
    slug: "tool-27",
    title: "أداة إنجازيا المتقدمة 27",
    description: "مساعد رقمي لضبط الحسابات المالية وإدارة التدفقات النقدية.",
    imagePath: "/images/tools/tool-27.png",
    features: ["ضبط الحسابات والتدفقات", "تقارير مالية دورية", "سهولة القراءة"]
  },
  "tool-28": {
    id: 28,
    slug: "tool-28",
    title: "أداة إنجازيا المتقدمة 28",
    description: "الحل الشامل لتعزيز تجربة التسوق ورفع معدلات التحويل.",
    imagePath: "/images/tools/tool-28.png",
    features: ["تحسين تجربة المستخدم", "زيادة نسبة المبيعات", "حلول مبتكرة للتجار"]
  }
};

export function getToolBySlug(slug: string): ToolData {
  if (toolsData[slug]) {
    return toolsData[slug];
  }
  const firstKey = Object.keys(toolsData)[0];
  const base = toolsData[firstKey];
  return {
    ...base,
    slug,
    title: `${base.title} (مخصص للمتاجر السعودية)`,
  };
}
