import type { Metadata } from 'next';

type Props = {
  params: Promise<{ platform: string }>;
};

// 1. قوائم الكلمات والصيغ (أضف المزيد هنا لتوليد آلاف الاحتمالات)
const templates = {
  heroTitles: [
    "ضاعف مبيعات متجرك على {X} عبر إدارة ذكية للواتساب",
    "نظام احترافي لمتاجر {X} لتحويل محادثات الواتساب إلى أرباح",
    "ارتقِ بخدمة عملاء {X} وتتبع السلال المتروكة بضغطة زر",
    "الحل الأذكى لتجار {X} لزيادة معدلات التحويل اليومية",
    "حوّل واتساب ويب إلى CRM متكامل مخصص لمنصة {X}"
  ],
  heroSubtitles: [
    "لا تفوت أي طلب بعد اليوم. تواصل مع عملائك باحترافية وسرعة.",
    "أدوات متقدمة لتصنيف الزوار، إرسال روابط الدفع، ومضاعفة ولاء العملاء.",
    "وفر ساعات من العمل اليدوي مع قوالب الرد الجاهزة واستخراج التقارير.",
    "نظم رسائلك، استهدف السلال المتروكة، وشاهد أرباحك ترتفع بسلاسة.",
    "السر وراء نجاح كبار التجار: تواصل أسرع، تنظيم أدق، ومبيعات أكثر."
  ],
  feature1: [
    { title: "تصنيف عملاء {X} بدقة", desc: "نظام علامات يوضح لك حالة كل متسوق لسرعة الوصول وإتمام البيع." },
    { title: "فلترة متقدمة للطلبات", desc: "افصل محادثات الدفع عن الاستفسارات العادية لتنظيم وقت فريقك." },
    { title: "تقسيم ذكي للمحادثات", desc: "إدارة سلسة تفصل السلال المتروكة عن العملاء الجدد في ثوانٍ." }
  ]
};

// دالة لتوليد رقم ثابت بناءً على اسم المنصة (لكي لا تتغير النصوص على جوجل)
const getIndex = (word: string, max: number) => {
  let sum = 0;
  for (let i = 0; i < word.length; i++) {
    sum += word.charCodeAt(i);
  }
  return sum % max;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const platformName = decodeURIComponent(resolvedParams.platform).replace(/-/g, ' ');
  
  const titleIndex = getIndex(platformName, templates.heroTitles.length);
  const metaTitle = templates.heroTitles[titleIndex].replace('{X}', platformName);
  
  return {
    title: metaTitle,
    description: `أفضل أداة لمتاجر ${platformName} لإدارة الواتساب وزيادة المبيعات.`,
  };
}

export default async function ProgrammaticLandingPage({ params }: Props) {
  const resolvedParams = await params;
  // استخراج اسم المنصة أو المدينة من الرابط وتحويل الشرطات إلى مسافات
  const platformName = decodeURIComponent(resolvedParams.platform).replace(/-/g, ' ');

  // اختيار النصوص بناءً على اسم المنصة
  const tIndex = getIndex(platformName, templates.heroTitles.length);
  const sIndex = getIndex(platformName + "sub", templates.heroSubtitles.length);
  const f1Index = getIndex(platformName + "f1", templates.feature1.length);

  const heroTitle = templates.heroTitles[tIndex].replace('{X}', platformName);
  const heroSubtitle = templates.heroSubtitles[sIndex];
  const feature1Title = templates.feature1[f1Index].title.replace('{X}', platformName);
  const feature1Desc = templates.feature1[f1Index].desc;

  return (
    <div className="landing-wrapper">
      <style>{`
        .landing-wrapper { background-color: #f8fafc; color: #1e293b; min-height: 100vh; font-family: 'Tajawal', sans-serif; line-height: 1.6; direction: rtl; }
        .hero { max-width: 900px; margin: 40px auto; padding: 0 20px; text-align: center; }
        .badge { display: inline-block; background-color: #e0f2fe; color: #0369a1; padding: 6px 18px; border-radius: 20px; font-weight: 700; margin-bottom: 15px; }
        h1 { font-size: 32px; font-weight: 800; color: #0f172a; margin-bottom: 16px; }
        p.subtitle { font-size: 18px; color: #64748b; margin-bottom: 30px; }
        .cta-btn { background-color: #25d366; color: #fff; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 18px; }
        .features { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; max-width: 900px; margin: 40px auto; padding: 0 20px; text-align: right; }
        .feature-card { background: #fff; padding: 20px; border-radius: 14px; border: 1px solid #e2e8f0; }
        .feature-card h3 { color: #0f172a; margin-bottom: 10px; }
      `}</style>

      <section className="hero">
        <span className="badge">متوافق بالكامل مع {platformName}</span>
        <h1>{heroTitle}</h1>
        <p className="subtitle">{heroSubtitle}</p>
        <a href="https://chromewebstore.google.com/detail/dpocelchhijafgbmjgnfaafcmhmgbjej" className="cta-btn" target="_blank">ابدأ التجربة المجانية الآن ⚡</a>
      </section>

      <section className="features">
        <div className="feature-card">
          <h3>🏷️ {feature1Title}</h3>
          <p>{feature1Desc}</p>
        </div>
        {/* يمكنك إضافة الميزات الأخرى بنفس الطريقة */}
      </section>
    </div>
  );
}
