// lib/seoEngine.ts

export interface SeoPageData {
  slug: string;
  toolName: string;
  platformName: string;
  nicheName: string;
  title: string;
  subtitle: string;
  badge: string;
  actionUrl: string;
  sections: { heading: string; text: string }[];
  faqs: { question: string; answer: string }[];
}

export function generateSeoPage(slug: string): SeoPageData {
  const safeSlug = slug || "profit-calculator-salla";
  const slugParts = safeSlug.split('-');

  // 1. استخراج المتغيرات من الرابط (الأداة، المنصة، المجال)
  let toolName = "حاسبة الأرباح ونقطة التعادل";
  let platformName = "المتاجر الإلكترونية";
  let nicheName = "المنتجات";
  let actionPath = "profit";

  // تحليل المنصة
  if (safeSlug.includes('salla') || safeSlug.includes('سلة')) platformName = "منصة سلة";
  else if (safeSlug.includes('zid') || safeSlug.includes('زد')) platformName = "منصة زد";
  else if (safeSlug.includes('shopify')) platformName = "شوبيفاي";

  // تحليل المجال (Niche)
  if (safeSlug.includes('perfume')) nicheName = "العطور";
  else if (safeSlug.includes('abaya')) nicheName = "العبايات";
  else if (safeSlug.includes('dates')) nicheName = "التمور";
  else if (safeSlug.includes('coffee')) nicheName = "القهوة المختصة";
  else if (safeSlug.includes('fashion')) nicheName = "الأزياء والملابس";

  // تحليل الأداة
  if (safeSlug.includes('fees') || safeSlug.includes('gateway')) {
    toolName = "حاسبة رسوم بوابات الدفع (تابي وتمارا)";
    actionPath = "fees";
  } else if (safeSlug.includes('whatsapp')) {
    toolName = "أداة استرجاع السلال المتروكة عبر واتساب";
    actionPath = "whatsapp";
  } else if (safeSlug.includes('roas') || safeSlug.includes('ads')) {
    toolName = "محلل عائد الإعلانات (ROAS)";
    actionPath = "roas";
  }

  // 2. توليد المحتوى الديناميكي (Spintax Framework)
  return {
    slug: safeSlug,
    toolName,
    platformName,
    nicheName,
    title: `${toolName} لمتاجر ${nicheName} على ${platformName} في السعودية`,
    subtitle: `الدليل الشامل والعملي لزيادة مبيعات ${nicheName} وتقليل التكاليف التشغيلية على ${platformName}.`,
    badge: `أداة مخصصة لمتاجر ${nicheName} السعودية`,
    actionUrl: `https://engazia-app.vercel.app/hub/sa/${actionPath}`,
    sections: [
      {
        heading: `1. التحديات الخفية لبيع ${nicheName} على ${platformName}`,
        text: `يشهد قطاع ${nicheName} في المملكة العربية السعودية نمواً غير مسبوق. ولكن، بناء متجر متخصص في ${nicheName} على ${platformName} يرافقه العديد من التحديات المالية. الكثير من التجار يحققون مبيعات عالية، لكنهم يتفاجؤون بأن الأرباح الصافية تتبخر بسبب رسوم بوابات الدفع، وتكاليف الشحن العكسي، وضريبة القيمة المضافة 15%. استخدام ${toolName} يعتبر خطوة حاسمة لفهم الأرقام الحقيقية وضمان تحقيق ربح صافي من كل طلب.`
      },
      {
        heading: `2. كيف تضاعف أرباح متجرك المتخصص في ${nicheName}؟`,
        text: `لتسعير ${nicheName} بشكل صحيح على ${platformName}، لا يمكنك فقط حساب سعر التكلفة مخصوماً من سعر البيع. يجب أن تأخذ في الاعتبار مصاريف التغليف الخاص بـ ${nicheName}، ونسبة المنصة، والعمولات المستقطعة من تابي وتمارا. هذه الأداة تقوم بأتمتة هذه العملية الحسابية المعقدة، وتقدم لك تقريراً دقيقاً للحد الأدنى للسعر الذي يجب أن تبيع به منتجاتك لتغطية كافة تكاليفك التشغيلية والتسويقية.`
      },
      {
        heading: `3. أهمية الأتمتة المالية لنجاح المتاجر السعودية`,
        text: `في سوق تنافسي مثل السوق السعودي، السرعة والدقة هما مفتاح النجاح. الاعتماد على الجداول اليدوية لإدارة متجر ${nicheName} على ${platformName} يؤدي إلى أخطاء قاتلة. نظامنا يوفر لك بنية تقنية قوية تحاكي الأنظمة المحاسبية الكبرى، لتتفرغ أنت للإبداع في تسويق منتجاتك وتحسين تجربة عملائك، بينما تتولى الأداة ضبط العمليات الرقمية خلف الكواليس.`
      }
    ],
    faqs: [
      {
        question: `كيف تتوافق هذه الأداة مع ${platformName}؟`,
        answer: `تم تصميم الخوارزميات الداخلية لتطابق هياكل الرسوم والاشتراكات الخاصة بـ ${platformName} بشكل دقيق.`
      },
      {
        question: `هل الأداة مناسبة للمبتدئين في بيع ${nicheName}؟`,
        answer: `بكل تأكيد. الواجهة مصممة لتكون بسيطة ومباشرة، لتعطيك الأرقام النهائية دون تعقيدات محاسبية.`
      }
    ]
  };
}
