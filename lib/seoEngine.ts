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

// محرك توليد الـ 30 ألف صفحة
export function generateSeoContent(slug: string): SeoPageData {
  const urlPath = (slug || "profit-salla-perfumes").toLowerCase();
  
  // المتغيرات الافتراضية
  let toolName = "حاسبة الأرباح والتكاليف";
  let platform = "التجارة الإلكترونية";
  let niche = "المنتجات";
  let actionSlug = "profit";

  // فك تشفير المنصة
  if (urlPath.includes('salla')) platform = "منصة سلة";
  else if (urlPath.includes('zid')) platform = "منصة زد";
  else if (urlPath.includes('shopify')) platform = "شوبيفاي";

  // فك تشفير المجال (Niche)
  if (urlPath.includes('perfume')) niche = "العطور";
  else if (urlPath.includes('abaya')) niche = "العبايات";
  else if (urlPath.includes('dates')) niche = "التمور";
  else if (urlPath.includes('coffee')) niche = "القهوة المختصة";
  else if (urlPath.includes('electronics')) niche = "الإلكترونيات";
  else if (urlPath.includes('fashion')) niche = "الأزياء والملابس";

  // فك تشفير الأداة
  if (urlPath.includes('fees')) {
    toolName = "حاسبة رسوم بوابات الدفع (تابي، تمارا، مدى)";
    actionSlug = "fees";
  } else if (urlPath.includes('whatsapp')) {
    toolName = "أداة استرجاع السلال وإدارة العملاء";
    actionSlug = "whatsapp";
  } else if (urlPath.includes('roas')) {
    toolName = "محلل عائد الإعلانات (ROAS)";
    actionSlug = "roas";
  }

  // بناء المحتوى الضخم المستهدف للسيو
  return {
    slug: urlPath,
    title: `${toolName} لزيادة أرباح متاجر ${niche} على ${platform}`,
    subtitle: `الدليل الشامل 2026: استراتيجيات خفض التكاليف، حساب ضريبة 15%، ومضاعفة المبيعات لقطاع ${niche}.`,
    badge: `أداة حصرية: متاجر ${niche}`,
    actionUrl: `https://engazia-app.vercel.app/hub/sa/${actionSlug}`,
    imagePath: "/images/tools/tool-1.png", // تأكد من وجود هذه الصورة أو غير مسارها
    article: {
      h1: `الدليل الاستراتيجي: كيف تكتسح سوق ${niche} عبر ${platform}؟`,
      intro: `يشهد قطاع التجارة الإلكترونية في السعودية، وتحديداً سوق ${niche}، طفرة تاريخية. ومع التسهيلات التي تقدمها ${platform}، تهافت رواد الأعمال لتأسيس متاجرهم. لكن، التحدي الأكبر يكمن في "الإدارة المالية الدقيقة". الكثير من المتاجر تحقق مبيعات خيالية، ليتفاجأ التاجر بنهاية الشهر أن السيولة النقدية شبه معدومة!`,
      h2_1: `التسعير الذكي لمنتجات ${niche} على ${platform}`,
      p_1: `عملية تسعير ${niche} لا تعتمد على التخمين. "حرق الأسعار" للاستحواذ على السوق هو انتحار تجاري. من خلال استخدام ${toolName}، ستتمكن من إدخال سعر التكلفة الأصلي، إضافة تكاليف التشغيل الثابتة والمتغيرة، لتقوم الخوارزمية بحساب "نقطة التعادل". وهي اللحظة التي يغطي فيها متجرك كافة مصاريفه ويبدأ في جني الأرباح الحقيقية بالريال السعودي.`,
      h2_2: `التعامل مع رسوم الدفع وتأثيرها على ${niche}`,
      p_2: `تفعيل تابي وتمارا في متجرك على ${platform} يرفع معدل التحويل بأكثر من 30% لمنتجات ${niche}. لكن، هذه الخدمات تقتطع نسبة مئوية ورسوماً ثابتة. إذا كان هامش ربحك ضعيفاً، فإن ربحك الصافي ينهار. هذه الأداة تحلل هيكل الرسوم بدقة وتخبرك بالرقم الصافي الذي سيودع في حسابك بعد التسوية.`,
      h2_3: `أهمية الأتمتة لنجاح متاجر ${niche} السعودية`,
      p_3: `الاعتماد على الجداول اليدوية يؤدي إلى أخطاء قاتلة. نظامنا يوفر لك بنية تقنية قوية تحاكي الأنظمة المحاسبية الكبرى. تتولى الأداة ضبط العمليات الرقمية خلف الكواليس، وتعمل على حساب الضريبة (15%) بشكل آلي، لتتفرغ أنت لتسويق متجرك المتخصص في ${niche} وتقديم خدمة عملاء استثنائية.`
    },
    faqs: [
      { q: `كيف تتوافق الأداة مع ${platform}؟`, a: `الخوارزميات مصممة لتطابق رسوم واشتراكات ${platform} بدقة.` },
      { q: `هل تناسب المبتدئين في ${niche}؟`, a: `نعم، الواجهة بسيطة جداً وتعطيك الأرقام النهائية دون تعقيد محاسبي.` }
    ]
  };
}
