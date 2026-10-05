// lib/seoEngine.ts

// 1. تعريف دقيق جداً للهياكل (Interfaces) لمنع أي خطأ من Vercel
export interface SeoBlock {
  type: 'h2' | 'h3' | 'p' | 'list';
  text?: string;
  items?: string[];
}

export interface SeoFaq {
  q: string;
  a: string;
}

export interface SeoPageData {
  slug: string;
  title: string;
  subtitle: string;
  badge: string;
  actionUrl: string;
  imagePath: string;
  content: SeoBlock[];
  faqs: SeoFaq[];
}

// 2. محرك التوليد الآلي
export function generateSeoContent(slug: string): SeoPageData {
  const urlPath = (slug || "breakeven-salla-perfumes-riyadh").toLowerCase();
  
  // المتغيرات الافتراضية
  let tool = { name: "أداة إنجازيا المتقدمة", role: "رفع الكفاءة التشغيلية", path: "hub" };
  let platform = { name: "المتاجر الإلكترونية", fee: "رسوم متغيرة" };
  let niche = { name: "المنتجات", audience: "المتسوقين", problem: "تحديات التسعير" };
  let city = { name: "السعودية", region: "الأسواق المحلية" };

  // --- تعريف الـ 24 أداة ---
  if (urlPath.includes('breakeven')) tool = { name: "حاسبة أرباح ونقطة التعادل", role: "حماية المتجر من الخسائر الخفية", path: "profit" };
  else if (urlPath.includes('fees') || urlPath.includes('payment')) tool = { name: "حاسبة رسوم بوابات الدفع (تابي، تمارا، مدى)", role: "تحديد المبالغ الصافية بعد الرسوم", path: "fees" };
  else if (urlPath.includes('zatca') || urlPath.includes('invoice')) tool = { name: "مولد الفواتير الإلكترونية (زاتكا)", role: "إصدار فواتير ضريبية نظامية", path: "invoices" };
  else if (urlPath.includes('whatsapp') || urlPath.includes('crm')) tool = { name: "أداة إدارة العملاء واسترجاع السلال عبر واتساب", role: "مضاعفة معدل إتمام الطلبات", path: "whatsapp" };
  else if (urlPath.includes('roas') || urlPath.includes('ads')) tool = { name: "محلل عائد الإعلانات", role: "قياس كفاءة الحملات الإعلانية", path: "roas" };

  // --- تعريف المنصات ---
  if (urlPath.includes('salla')) platform = { name: "منصة سلة", fee: "اشتراك سلة بلس/برو" };
  else if (urlPath.includes('zid')) platform = { name: "منصة زد", fee: "عمولات زد" };
  else if (urlPath.includes('shopify')) platform = { name: "شوبيفاي", fee: "رسوم بوابات شوبيفاي" };

  // --- تعريف المجالات (Niches) ---
  if (urlPath.includes('perfume')) niche = { name: "العطور", audience: "عشاق الروائح والتميز", problem: "تكلفة التغليف الزجاجي المرتفعة" };
  else if (urlPath.includes('abaya')) niche = { name: "العبايات", audience: "الباحثات عن الأناقة", problem: "مقاسات المرتجعات وتكاليف القماش" };
  else if (urlPath.includes('coffee')) niche = { name: "القهوة المختصة", audience: "الذواقة", problem: "صلاحية البن وتكاليف الشحن" };

  // --- تعريف المدن ---
  if (urlPath.includes('riyadh')) city = { name: "الرياض", region: "المنطقة الوسطى" };
  else if (urlPath.includes('jeddah')) city = { name: "جدة", region: "المنطقة الغربية" };

  // 3. بناء مصفوفة المحتوى (Dynamic Spintax) المتوافقة تماماً مع TypeScript
  const articleContent: SeoBlock[] = [
    { type: "h2", text: `مقدمة استراتيجية: واقع سوق ${niche.name} في ${city.name} وتحديات ${platform.name}` },
    { type: "p", text: `يعتبر سوق ${niche.name} في ${city.name} وعموم ${city.region} من أكثر الأسواق نمواً وتنافسية في عام 2026. المستهلك هنا، وتحديداً ${niche.audience}، أصبح يتمتع بوعي شرائي عالٍ جداً. عند اختيارك بناء متجرك على ${platform.name}، فإنك تستفيد من بنية تحتية قوية، ولكن هذا لا يعفيك من مسؤولية الإدارة المالية الدقيقة.` },
    { type: "p", text: `الكثير من رواد الأعمال في قطاع ${niche.name} يغترون بحجم المبيعات الإجمالي، ليكتشفوا لاحقاً أن ${niche.problem} وتكاليف ${platform.fee} قد التهمت هوامش الربح بالكامل. هنا تبرز الحاجة الملحة لاستخدام ${tool.name} كأداة لا غنى عنها لضمان استدامة مشروعك وتحقيق ${tool.role}.` },
    
    { type: "h2", text: `التشريح المالي: كيف تدير تكاليف متجر ${niche.name} بذكاء؟` },
    { type: "p", text: `لنتعمق في التفاصيل التشغيلية. عند بيع ${niche.name}، هناك أنواع من التكاليف التي إذا لم تقم بضبطها باستخدام ${tool.name}، فإن متجرك سيتجه نحو الإفلاس. أولاً: تكلفة المنتج وتكاليف التغليف (والتي تعتبر حاسمة بسبب ${niche.problem}). ثانياً: الرسوم الخاصة بـ ${platform.name}. ثالثاً: تكاليف بوابات الدفع (تابي، تمارا، مدى) التي تقتطع نسباً من كل طلب.` },
    { type: "p", text: `علاوة على ذلك، لا ننسى "ضريبة القيمة المضافة 15%". الخوارزمية الخاصة بأداة ${tool.name} تقوم بدمج كل هذه المتغيرات في معادلة واحدة، وتقدم لك النتيجة النهائية في واجهة بسيطة لتسعر منتجاتك بشكل يضمن لك ربحاً صافياً.` },
    
    { type: "h2", text: `دراسة حالة: متجر في ${city.name} يحقق التحول الكامل` },
    { type: "p", text: `لنفترض أن هناك متجراً لبيع ${niche.name} يقع مقره في ${city.name} ويعتمد على ${platform.name}. المتجر كان يحقق 1000 طلب شهرياً بقيمة 200,000 ريال. ظاهرياً الأرقام ممتازة، ولكن عند استخدام ${tool.name}، اكتشف التاجر كارثة: بسبب ${niche.problem} ورسوم بوابات الدفع غير المحسوبة، كان الربح الصافي لا يتجاوز 3% فقط!` },
    { type: "p", text: `بعد تفعيل توصيات الأداة وتطبيق استراتيجيات ${tool.role}، انخفضت الطلبات قليلاً لكن الربح الصافي قفز إلى 22%، مما وفر تدفقاً نقدياً هائلاً للتاجر.` },
    
    { type: "h2", text: `الخطوات العملية لتفعيل أداة ${tool.name} لمتجرك` },
    { type: "list", items: [
        `الخطوة 1: الدخول إلى منصة إنجازيا واختيار الأداة المخصصة لـ ${platform.name}.`,
        `الخطوة 2: إدخال متوسط تكلفة منتجات ${niche.name} بدقة.`,
        `الخطوة 3: تحديد بوابات الدفع وتكلفة الشحن لمدينة ${city.name} وغيرها.`,
        `الخطوة 4: الضغط على "تحليل الأداء" للحصول على تقرير مفصل حول ${tool.role}.`
      ]
    },
    
    { type: "h2", text: `مستقبل بيع ${niche.name} في السعودية` },
    { type: "p", text: `لم يعد التاجر في ${city.name} يعتمد على الحدس. أدواتنا في منصة إنجازيا تم برمجتها بأحدث الخوارزميات. إذا كنت تريد الاستمرار في صدارة سوق ${niche.name}، فإن التكامل مع أداة ${tool.name} ليس خياراً بل ضرورة.` }
  ];

  const faqs: SeoFaq[] = [
    { q: `كيف تساعد أداة ${tool.name} المتاجر المبتدئة في ${city.name}؟`, a: `توفر حماية كاملة لرأس المال وتمنع التسعير الخاطئ لمنتجات ${niche.name} منذ اليوم الأول لافتتاح متجرك على ${platform.name}.` },
    { q: `هل التحديثات لرسوم ${platform.name} والضرائب تتم تلقائياً؟`, a: `نعم، نقوم بتحديث الخوارزميات فور صدور أي لوائح جديدة لضمان دقة الحسابات.` }
  ];

  return {
    slug: urlPath,
    title: `${tool.name} لزيادة أرباح متاجر ${niche.name} على ${platform.name} في ${city.name}`,
    subtitle: `الدليل الشامل 2026: استراتيجيات ${tool.role}، خفض التكاليف، ومضاعفة المبيعات لقطاع ${niche.name}.`,
    badge: `أداة حصرية للمتاجر في ${city.name}`,
    actionUrl: `https://engazia-app.vercel.app/hub/sa/${tool.path}`,
    imagePath: "/images/tools/tool-1.png",
    content: articleContent,
    faqs: faqs
  };
}
