// lib/toolsData.ts

export interface ToolData {
  slug: string;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  imagePath: string;
  actionUrl: string;
  features: string[];
  articleTitle: string;
  articleText1: string;
  articleText2: string;
  faqs: { question: string; answer: string }[];
}

// أبقينا هذا المتغير لكي لا تنهار ملفات مشروعك الأخرى التي تستدعيه
export const toolsData: Record<string, ToolData> = {
  "fallback-tool": {
    slug: "fallback-tool",
    title: "أداة منصة إنجازيا",
    subtitle: "أدوات مخصصة للمتاجر",
    badge: "أداة متقدمة",
    description: "أداة قوية للمتاجر",
    imagePath: "/images/tools/tool-1.png",
    actionUrl: "https://engazia-app.vercel.app/hub/sa",
    features: ["أداء سريع"],
    articleTitle: "مقال دليلي",
    articleText1: "نص 1",
    articleText2: "نص 2",
    faqs: [{ question: "سؤال", answer: "جواب" }]
  }
};

// المحرك الديناميكي الذي يولد 30 ألف صفحة بناءً على الرابط
export function getToolBySlug(slug: string): ToolData {
  const safeSlug = slug ? String(slug).toLowerCase() : "profit-salla";
  
  let toolName = "حاسبة الأرباح ونقطة التعادل";
  let platformName = "المتاجر الإلكترونية";
  let nicheName = "المنتجات";
  let actionPath = "profit";

  // تحليل المنصة
  if (safeSlug.includes('salla') || safeSlug.includes('سلة')) platformName = "منصة سلة";
  else if (safeSlug.includes('zid') || safeSlug.includes('زد')) platformName = "منصة زد";

  // تحليل المجال (Niche)
  if (safeSlug.includes('perfume')) nicheName = "العطور";
  else if (safeSlug.includes('abaya')) nicheName = "العبايات";
  else if (safeSlug.includes('dates')) nicheName = "التمور";
  else if (safeSlug.includes('coffee')) nicheName = "القهوة المختصة";
  else if (safeSlug.includes('fashion')) nicheName = "الأزياء والملابس";

  // تحليل الأداة
  if (safeSlug.includes('fees')) {
    toolName = "حاسبة رسوم بوابات الدفع";
    actionPath = "fees";
  } else if (safeSlug.includes('whatsapp')) {
    toolName = "أداة استرجاع السلال عبر واتساب";
    actionPath = "whatsapp";
  } else if (safeSlug.includes('roas')) {
    toolName = "محلل عائد الإعلانات";
    actionPath = "roas";
  }

  return {
    slug: safeSlug,
    title: `${toolName} لمتاجر ${nicheName} على ${platformName} في السعودية`,
    subtitle: `الدليل الشامل والعملي لزيادة مبيعات ${nicheName} وتقليل التكاليف التشغيلية على ${platformName}.`,
    badge: `أداة مخصصة لمتاجر ${nicheName} السعودية`,
    description: `تتيح لك الأداة الاستفادة من أحدث الأساليب لضبط هوامش ربح متجر ${nicheName} على ${platformName}.`,
    imagePath: "/images/tools/tool-1.png",
    actionUrl: `https://engazia-app.vercel.app/hub/sa/${actionPath}`,
    features: [
      `أداء سريع ودقيق لمتاجر ${nicheName}`,
      `متوافقة تماماً مع ${platformName}`,
      `تحليلات وتقارير فورية للبيانات والأداء المالي`
    ],
    articleTitle: `الدليل الشامل: كيف تضاعف أرباح متجر ${nicheName} على ${platformName}؟`,
    articleText1: `يشهد قطاع ${nicheName} في المملكة العربية السعودية نمواً غير مسبوق. ولكن، بناء متجر متخصص في ${nicheName} على ${platformName} يرافقه العديد من التحديات المالية. الكثير من التجار يحققون مبيعات عالية، لكنهم يتفاجؤون بأن الأرباح الصافية تتبخر بسبب رسوم بوابات الدفع، وتكاليف الشحن العكسي، وضريبة القيمة المضافة 15%. استخدام ${toolName} يعتبر خطوة حاسمة لفهم الأرقام الحقيقية وضمان تحقيق ربح صافي من كل طلب.`,
    articleText2: `لتسعير ${nicheName} بشكل صحيح على ${platformName}، لا يمكنك فقط حساب سعر التكلفة مخصوماً من سعر البيع. يجب أن تأخذ في الاعتبار مصاريف التغليف الخاص بـ ${nicheName}، ونسبة المنصة، والعمولات المستقطعة من تابي وتمارا. هذه الأداة تقوم بأتمتة العملية الحسابية المعقدة، لتقدم لك تقريراً دقيقاً للحد الأدنى للسعر الذي يجب أن تبيع به منتجاتك لتغطية كافة تكاليفك وضمان الاستدامة.`,
    faqs: [
      {
        question: `كيف تتوافق الأداة مع ${platformName}؟`,
        answer: `تم تصميم الخوارزميات لتطابق هياكل الرسوم والاشتراكات الخاصة بـ ${platformName} بشكل دقيق.`
      },
      {
        question: `هل الأداة مناسبة للمبتدئين في بيع ${nicheName}؟`,
        answer: `بكل تأكيد. الواجهة مصممة لتكون بسيطة ومباشرة، لتعطيك الأرقام النهائية دون تعقيدات محاسبية.`
      }
    ]
  };
}
