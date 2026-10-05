// lib/toolsData.ts

export interface ToolData {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  imagePath: string;
  actionUrl: string;
  features: string[];
  faqs: { question: string; answer: string }[];
}

export const toolsData: Record<string, ToolData> = {
  "breakeven-calculator": {
    id: 1,
    slug: "breakeven-calculator",
    title: "حاسبة أرباح ونقطة التعادل للمتاجر الإلكترونية",
    subtitle: "احسب صافي أرباحك بدقة متناهية بعد خصم تكلفة المنتج، الشحن، وبوابة الدفع، وضريبة 15%.",
    description: "تعتبر هذه الأداة العمود الفقري لأي تاجر على منصات سلة أو زد؛ حيث تمنع بيع أي منتج بخسارة عبر تحديد حجم المبيعات اللازم لتغطية كافة التكاليف.",
    imagePath: "/images/tools/tool-1.png",
    actionUrl: "https://engazia-app.vercel.app/hub/sa/profit",
    features: [
      "حساب دقيق لهامش الربح الفعلي للقطعة الواحدة",
      "متوافق تماماً مع متطلبات ضريبة القيمة المضافة 15%",
      "تحليل فوري لتكاليف المنصة، التغليف، وعمولة التحصيل"
    ],
    faqs: [
      { question: "كيف تحمي هذه الحاسبة متجري من الخسارة؟", answer: "توضح لك بدقة الحد الأدنى لسعر البيع بحيث لا تتآكل أرباحك بسبب المصاريف التشغيلية الخفية." }
    ]
  },
  "payment-gateway-fees": {
    id: 2,
    slug: "payment-gateway-fees",
    title: "حاسبة رسوم بوابات الدفع (تابي، تمارا، مدى)",
    subtitle: "اعرف كم تخصم بوابات الدفع الإلكتروني من أرباحك في كل طلب تسويه في متجرك.",
    description: "تتعدد خيارات الدفع في المتاجر السعودية بين مدى، بطاقات الائتمان، وخدمات الشراء الآن وادفع لاحقاً مثل تابي وتمارا لتحديد المبلغ الصافي الداخل لحسابك.",
    imagePath: "/images/tools/tool-2.png",
    actionUrl: "https://engazia-app.vercel.app/hub/sa/fees",
    features: [
      "حساب رسوم شبكة مدى وبطاقات ائتمان فيزا وماستركارد",
      "حساب نسب وأقساط خدمات تابي (Tabby) وتمارا (Tamara)",
      "توضيح المبلغ الصافي الفعلي بعد خصم الضريبة المضافة"
    ],
    faqs: [
      { question: "لماذا تختلف رسوم بوابات الدفع؟", answer: "لأن كل مزود خدمة لديه نسبة مئوية ورسوم تشغيلية خاصة تقتطع من قيمة المبيعات." }
    ]
  },
  "zatca-invoice-generator": {
    id: 3,
    slug: "zatca-invoice-generator",
    title: "مولد الفواتير الإلكترونية المعتمدة (زاتكا)",
    subtitle: "أنشئ فواتير مبيعات مبسطة متوافقة مع متطلبات المرحلة الأولى لهيئة الزكاة والضريبة والجمارك.",
    description: "أداة مثالية لأصحاب المتاجر الناشئة لتوليد فواتير نظامية تتضمن رمز الاستجابة السريعة (QR Code) وبيانات المنشأة الضريبية.",
    imagePath: "/images/tools/tool-3.png",
    actionUrl: "https://engazia-app.vercel.app/hub/sa/invoices",
    features: [
      "توليد رمز الاستجابة السريعة QR Code المطابق لاشتراطات زاتكا",
      "إصدار فواتير مبسطة واضحة للعملاء بصيغة احترافية",
      "حساب مبالغ الضريبة والخصومات بشكل آلي وصحيح"
    ],
    faqs: [
      { question: "هل الفواتير المنشأة مطابقة لشروط هيئة الزكاة؟", answer: "نعم، تتضمن كافة العناصر البصرية والتنظيمية المطلوبة للفواتير المبسطة." }
    ]
  },
  "ads-roi-analyzer": {
    id: 4,
    slug: "ads-roi-analyzer",
    title: "محلل عائد الإعلانات (سناب شات وتيك توك)",
    subtitle: "قس بدقة كفاءة إعلاناتك الممولة واكتشف ما إذا كانت تحقق أرباحاً حقيقية أم تستنزف ميزانيتك.",
    description: "صُممت هذه الأداة لمساعدتك في قياس مؤشرات الأداء الأساسية مثل ROAS وتكلفة الاستحواذ على العميل لتتخذ قراراً واثقاً.",
    imagePath: "/images/tools/tool-4.png",
    actionUrl: "https://engazia-app.vercel.app/hub/sa/roas",
    features: [
      "حساب معدل العائد على الإنفاق الإعلاني (ROAS) فورياً",
      "تقدير تكلفة جلب العميل الواحد ومقارنتها بهامش ربح المنتج",
      "توجيهك المباشر لرفع كفاءة الحملات في السوق السعودي"
    ],
    faqs: [
      { question: "ما هو معدل ROAS المقبول للمتاجر الإلكترونية؟", answer: "عادة ما يُعتبر معدل 3x فما فوق علامة جيدة على نجاح الحملة الإعلانية." }
    ]
  },
  "whatsapp-crm": {
    id: 5,
    slug: "whatsapp-crm",
    title: "أداة إدارة عملاء واسترجاع السلال عبر واتساب",
    subtitle: "ضاعف مبيعات متجرك عبر التواصل الفعال مع أصحاب السلال المتروكة وإرسال روابط الدفع.",
    description: "يُعد واتساب قناة التواصل الأعلى تفاعلاً في المملكة لتنظيم محادثات العملاء ورفع معدل إتمام الطلبات بكل سهولة.",
    imagePath: "/images/tools/tool-5.png",
    actionUrl: "https://engazia-app.vercel.app/hub/sa/whatsapp",
    features: [
      "استعادة السلال المتروكة ورفع نسبة إتمام العمليات الشرائية",
      "إرسال روابط دفع سريعة ومباشرة للعملاء المهتمين",
      "قوالب رسائل جاهزة ومصممة باللهجة السعودية المناسبة"
    ],
    faqs: [
      { question: "كيف تساهم رسائل واتساب في زيادة المبيعات؟", answer: "تزيل التردد لدى العميل وتمنحه شعوراً بالطمأنينة وسرعة إتمام الطلب." }
    ]
  }
};

export function getToolBySlug(slug: string): ToolData {
  if (toolsData[slug]) {
    return toolsData[slug];
  }
  const baseKeys = Object.keys(toolsData);
  const fallbackKey = baseKeys[0];
  const base = toolsData[fallbackKey];

  return {
    ...base,
    slug,
    title: `أداة متقدمة للمتاجر الإلكترونية في السعودية`,
    subtitle: `حلول رقمية مبتكرة ومخصصة لرفع كفاءة ومبيعات المتاجر الرقمية.`,
    description: `تتيح لك هذه الأداة الاستفادة من أحدث خوارزميات وأساليب الأتمتة والتحليل المعتمدة في السوق السعودي لتطوير عملك بكل احترافية.`,
    actionUrl: "https://engazia-app.vercel.app/hub/sa"
  };
}
