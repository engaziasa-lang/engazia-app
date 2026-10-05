// lib/toolsData.ts

export interface SeoSection {
  heading: string;
  text1: string;
  text2: string;
}

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
  sections: SeoSection[];
  faqs: { question: string; answer: string }[];
}

// 1. نحتفظ بهذا الكائن الأساسي لكي لا ينهار مشروعك إذا كانت الصفحة الرئيسية أو الـ Navbar تستدعيه
export const toolsData: Record<string, any> = {
  "breakeven-calculator": {
    slug: "breakeven-calculator",
    title: "حاسبة أرباح ونقطة التعادل للمتاجر الإلكترونية",
    imagePath: "/images/tools/tool-1.png",
  },
  "payment-gateway-fees": {
    slug: "payment-gateway-fees",
    title: "حاسبة رسوم بوابات الدفع (تابي، تمارا، مدى)",
    imagePath: "/images/tools/tool-2.png",
  }
};

// 2. المحرك الديناميكي الجبار لتوليد 30 ألف صفحة (Programmatic SEO)
export function getToolBySlug(slug: string): ToolData {
  const safeSlug = (slug || "profit-salla-perfumes").toLowerCase();
  
  // استخراج المتغيرات من الرابط
  let toolName = "المنظومة المالية وحاسبة الأرباح";
  let platformName = "التجارة الإلكترونية";
  let nicheName = "المنتجات";
  let actionPath = "profit";

  // استخراج المنصة
  if (safeSlug.includes('salla')) platformName = "منصة سلة";
  else if (safeSlug.includes('zid')) platformName = "منصة زد";
  else if (safeSlug.includes('shopify')) platformName = "شوبيفاي";

  // استخراج النيتش (المجال)
  if (safeSlug.includes('perfume')) nicheName = "العطور";
  else if (safeSlug.includes('abaya')) nicheName = "العبايات";
  else if (safeSlug.includes('dates')) nicheName = "التمور";
  else if (safeSlug.includes('coffee')) nicheName = "القهوة المختصة";
  else if (safeSlug.includes('electronics')) nicheName = "الإلكترونيات";
  else if (safeSlug.includes('fashion')) nicheName = "الأزياء والملابس";

  // استخراج نوع الأداة
  if (safeSlug.includes('fees') || safeSlug.includes('payment')) {
    toolName = "حاسبة رسوم بوابات الدفع (تابي وتمارا)";
    actionPath = "fees";
  } else if (safeSlug.includes('whatsapp') || safeSlug.includes('crm')) {
    toolName = "أداة استرجاع السلال وإدارة العملاء عبر واتساب";
    actionPath = "whatsapp";
  } else if (safeSlug.includes('roas') || safeSlug.includes('ads')) {
    toolName = "محلل العائد على الإنفاق الإعلاني (ROAS)";
    actionPath = "roas";
  }

  // توليد محتوى ضخم جداً (هيكل الـ 2500 كلمة للسيو)
  return {
    slug: safeSlug,
    title: `${toolName} لزيادة أرباح متاجر ${nicheName} على ${platformName} في السعودية`,
    subtitle: `الدليل الشامل التفصيلي (2026) لخفض التكاليف التشغيلية، حساب ضريبة القيمة المضافة، ومضاعفة مبيعات ${nicheName} عبر ${platformName}.`,
    badge: `أداة حصرية لمتاجر ${nicheName} السعودية`,
    description: `إذا كنت تدير متجراً متخصصاً في بيع ${nicheName} عبر ${platformName}، فإن هذه الأداة تعتبر العمود الفقري لنجاحك المالي والتسويقي، حيث تحميك من الخسائر الخفية وتبني لك استراتيجية تسعير لا تقهر.`,
    imagePath: "/images/tools/tool-1.png",
    actionUrl: `https://engazia-app.vercel.app/hub/sa/${actionPath}`,
    features: [
      `تحليل مالي فوري مخصص لهامش ربح قطاع ${nicheName}`,
      `توافق تام مع هياكل الرسوم والاشتراكات في ${platformName}`,
      `حساب آلي لضريبة القيمة المضافة 15% ورسوم الدفع الإلكتروني`,
      `تقارير توجيهية لرفع معدل التحويل وتقليل الشحن العكسي`
    ],
    articleTitle: `الدليل الاستراتيجي الشامل: كيف تكتسح سوق ${nicheName} في السعودية عبر ${platformName}؟`,
    articleText1: `يشهد قطاع التجارة الإلكترونية في المملكة العربية السعودية، وتحديداً في مجال بيع ${nicheName}، طفرة تاريخية غير مسبوقة تماشياً مع أهداف رؤية المملكة 2030 لتعزيز الاقتصاد الرقمي. ومع التسهيلات الكبيرة التي تقدمها ${platformName}، تهافت آلاف رواد الأعمال لتأسيس متاجرهم. لكن، خلف هذه الواجهة اللامعة، يقبع تحدي "الإدارة المالية الدقيقة". الكثير من المتاجر التي تبيع ${nicheName} تحقق أرقام مبيعات خيالية على الشاشة، ليتفاجأ التاجر بنهاية الشهر أن السيولة النقدية (Cash Flow) شبه معدومة!`,
    articleText2: `أين تذهب الأموال؟ تتبخر الأرباح في تفاصيل لا يلقي لها التاجر المبتدئ بالاً: عمولات بوابات الدفع (مثل شبكة مدى، بطاقات الائتمان)، الرسوم المقتطعة من خدمات "اشتر الآن وادفع لاحقاً" (تابي وتمارا)، تكلفة التغليف الخاص بـ ${nicheName}، مصاريف الشحن العكسي للطلبات المرفوضة، وتكلفة الاستحواذ على العميل (CAC) عبر إعلانات تيك توك وسناب شات. وهنا يبرز دور ${toolName} كدرع واقٍ يحمي رأس مالك، ويقدم لك خريطة طريق واضحة تسعر من خلالها منتجاتك بذكاء يضمن لك الربح الصافي بعد استقطاع ضريبة الـ 15% وكافة المصاريف التشغيلية.`,
    sections: [
      {
        heading: `التسعير الذكي: سر الاستدامة لمتاجر ${nicheName} على ${platformName}`,
        text1: `عملية تسعير ${nicheName} لا تعتمد أبداً على التخمين أو تقليد المنافسين. إن اتباع سياسة "حرق الأسعار" في ${platformName} بهدف الاستحواذ على حصة سوقية هو انتحار تجاري بطيء. المستهلك السعودي يبحث عن القيمة، الجودة، وسرعة التوصيل، وهو مستعد للدفع مقابل خدمة استثنائية. من خلال استخدام ${toolName}، ستتمكن من إدخال سعر التكلفة الأصلي، وإضافة تكاليف التشغيل الثابتة والمتغيرة، لتقوم الخوارزمية بحساب "نقطة التعادل" (Break-even Point).`,
        text2: `نقطة التعادل هي اللحظة التي يغطي فيها متجرك كافة مصاريفه ويبدأ في جني الأرباح الحقيقية بالريال السعودي. تخيل أنك تطلق حملة تسويقية ضخمة لمنتجات ${nicheName}؛ بدون هذه الأداة، قد تبيع آلاف القطع وأنت في الواقع تخسر 5 ريالات في كل طلب دون أن تشعر! المنظومة الرقمية التي نقدمها لك تصحح هذا المسار فوراً وتمنحك الثقة الكاملة في كل قرار تسويقي تتخذه.`
      },
      {
        heading: `كيف تتعامل مع رسوم الدفع وخدمات التقسيط في ${platformName}؟`,
        text1: `لنتحدث بلغة الأرقام. تفعيل خيارات الدفع مثل تابي وتمارا في متجرك على ${platformName} هو قرار حتمي لا مفر منه، حيث تشير الإحصائيات في السوق السعودي إلى أن هذه الخدمات ترفع معدل التحويل (Conversion Rate) بنسبة تزيد عن 30% وتضاعف متوسط قيمة الطلب (AOV) لمنتجات ${nicheName}. لكن، هذه الخدمات تقتطع نسبة مئوية ورسوماً ثابتة + ضريبة قيمة مضافة على هذه الرسوم من كل عملية بيع!`,
        text2: `إذا قمت بتسعير منتجات ${nicheName} بهامش ربح ضعيف (مثلاً 10%)، وقامت بوابة الدفع باقتطاع 7%، فإن ربحك الصافي ينهار. هذه الأداة تحلل هيكل الرسوم الخاص بـ ${platformName} بدقة، وتخبرك تماماً بالرقم الصافي الذي سيتم إيداعه في حسابك البنكي بعد كل عملية تسوية، لتتمكن من رفع أسعارك بهامش مدروس يستوعب هذه العمولات ويضمن لك ربحاً مجزياً.`
      }
    ],
    faqs: [
      {
        question: `كيف تختلف هذه الأداة عن الحسابات اليدوية (الإكسل)؟`,
        answer: `الجداول اليدوية عرضة للخطأ البشري وتحتاج لتحديث مستمر للنسب الضريبية ورسوم ${platformName}. أداتنا مؤتمتة بالكامل، ومحدثة بآخر سياسات التجارة الإلكترونية في السعودية لعام 2026، وتوفر لك الوقت والجهد لتحليل بيانات ${nicheName} بضغطة زر.`
      },
      {
        question: `هل يمكنني استخدام هذه الخوارزميات إذا كنت في مرحلة التأسيس؟`,
        answer: `بالتأكيد! بل هو الوقت الأنسب. التخطيط المالي المسبق لمتجر ${nicheName} يجنبك مفاجآت التدفق النقدي السلبي. الأداة ترسم لك سيناريوهات المبيعات المطلوبة للنجاح على ${platformName} قبل أن تنفق ريالاً واحداً في المخزون أو الإعلانات.`
      }
    ]
  };
}

export function getRelatedTools(currentSlug: string) {
  return []; // إفراغها مؤقتاً لضمان عدم حدوث أخطاء من روابط غير موجودة
}
