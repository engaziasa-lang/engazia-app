import type { Metadata } from 'next';

type Props = {
  params: Promise<{ platform: string }>;
};

// خلاط النصوص الضخم (Spinner) لضمان تفرد 100% لكل صفحة
const templates = {
  heroTitles: [
    "ضاعف مبيعات {X} عبر الإدارة الذكية لمحادثات الواتساب",
    "نظام احترافي مخصص لـ {X} لتحويل رسائل الواتساب إلى أرباح",
    "ارتقِ بخدمة عملاء {X} وتتبع السلال المتروكة بضغطة زر",
    "الحل الأذكى لأصحاب {X} لزيادة معدلات التحويل اليومية",
    "حوّل واتساب ويب إلى CRM متكامل يخدم {X} باحترافية",
    "تخلص من فوضى الرسائل في {X} مع نظام إنجازيا المطور",
    "السر وراء نجاح {X}: تواصل أسرع، تنظيم أدق، ومبيعات أكثر",
    "دليلك الشامل لإدارة طلبات {X} عبر واتساب بكل سهولة",
    "أتمتة الردود ومتابعة عملاء {X} لم تكن بهذه السهولة من قبل",
    "أداة الواتساب الأقوى المصممة خصيصاً لدعم {X}"
  ],
  heroSubtitles: [
    "لا تفوت أي طلب بعد اليوم. تواصل مع عملائك باحترافية وسرعة فائقة.",
    "أدوات متقدمة لتصنيف الزوار، إرسال روابط الدفع، ومضاعفة ولاء العملاء.",
    "وفر ساعات من العمل اليدوي مع قوالب الرد الجاهزة واستخراج التقارير.",
    "نظم رسائلك، استهدف السلال المتروكة، وشاهد أرباحك ترتفع بسلاسة.",
    "اربط جهودك التسويقية بنتائج فعلية عبر تنظيم محادثات الشراء خطوة بخطوة.",
    "تجنب خسارة العملاء بسبب التأخر في الرد، وقم بأتمتة تواصلك التجاري.",
    "حل متكامل يتيح لك تقسيم العملاء وإعادة استهدافهم بعروض حصرية.",
    "من الاستفسار الأول حتى استلام الطلب، أدر عملياتك من شاشة واحدة.",
    "وداعاً لضياع أرقام العملاء، مرحباً بقاعدة بيانات منظمة وجاهزة للتصدير.",
    "صُمم خصيصاً للتجار الذين يبحثون عن رفع كفاءة المبيعات وتقليل الجهد."
  ],
  feature1: [
    { title: "تصنيف دقيق لعملاء {X}", desc: "نظام علامات (Tags) يوضح لك حالة كل متسوق لسرعة الوصول وإتمام البيع." },
    { title: "فلترة متقدمة للطلبات", desc: "افصل محادثات تأكيد الدفع عن الاستفسارات العادية لتنظيم وقت فريق الدعم." },
    { title: "تقسيم ذكي للمحادثات", desc: "إدارة سلسة تفصل السلال المتروكة عن العملاء الجدد في ثوانٍ معدودة." },
    { title: "إدارة مسارات البيع", desc: "تابع العميل منذ سؤاله الأول وحتى استلام شحنته بكل دقة واحترافية." },
    { title: "تنظيم جهات الاتصال", desc: "ضع علامات مخصصة لعملاء الـ VIP لتقديم خدمة استثنائية لهم دائماً." }
  ],
  feature2: [
    { title: "قوالب ردود جاهزة", desc: "احفظ نصوص الترحيب وروابط الدفع لتجنب الكتابة المتكررة وتوفير وقتك." },
    { title: "إرسال الفواتير بضغطة", desc: "جهز تفاصيل الحسابات البنكية أو روابط الدفع السريع وأرسلها فوراً." },
    { title: "أتمتة الرسائل المتكررة", desc: "أجب على الأسئلة الشائعة حول مواعيد العمل والشحن بنقرة واحدة." },
    { title: "نصوص بيعية مخصصة", desc: "أنشئ رسائل إقناع جاهزة لتحفيز المترددين على إكمال عملية الشراء." },
    { title: "ردود سريعة متعددة", desc: "خصص قوالب تناسب كل مرحلة من مراحل الشراء لتجربة عميل ممتازة." }
  ],
  feature3: [
    { title: "تصدير البيانات لـ Excel", desc: "حمل بيانات المهتمين في شيت إكسل لتسهيل حملات إعادة الاستهداف لاحقاً." },
    { title: "بناء قاعدة بيانات", desc: "اجمع أرقام عملائك وصنفهم في ملفات جاهزة لرفعها لمنصات الإعلانات." },
    { title: "تقارير أداء العملاء", desc: "استخرج قوائم بالسلال المتروكة للتواصل معهم عبر حملات مخصصة." },
    { title: "حفظ النسخ الاحتياطية", desc: "لا تخسر جهات اتصالك أبداً، قم بتصدير أرقام عملائك بشكل دوري وآمن." },
    { title: "تحليل بيانات المتسوقين", desc: "انقل بيانات الشراء لجداول خارجية لتتبع أداء مبيعاتك ونموك الشهري." }
  ]
};

// دالة متقدمة لتوليد رقم ثابت لكل كلمة، لضمان استقرار أرشفة جوجل لنفس الصفحة دائماً
const getIndex = (word: string, max: number, salt: number = 0) => {
  let sum = 0;
  for (let i = 0; i < word.length; i++) {
    sum += word.charCodeAt(i) * (i + 1);
  }
  return (sum + salt) % max;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const rawTarget = decodeURIComponent(resolvedParams.platform);
  const platformName = rawTarget.replace(/-/g, ' ');
  
  const titleIndex = getIndex(rawTarget, templates.heroTitles.length, 1);
  const metaTitle = templates.heroTitles[titleIndex].replace('{X}', platformName);
  
  return {
    title: metaTitle,
    description: `استكشف أفضل طريقة لـ ${platformName} عبر تنظيم رسائل الواتساب، رفع المبيعات، وبناء قاعدة عملاء قوية بضغطة زر.`,
  };
}

export default async function ProgrammaticLandingPage({ params }: Props) {
  const resolvedParams = await params;
  const rawTarget = decodeURIComponent(resolvedParams.platform);
  const platformName = rawTarget.replace(/-/g, ' ');

  // توزيع عشوائي (لكنه ثابت لكل كلمة مفتاحية) للمحتوى
  const tIndex = getIndex(rawTarget, templates.heroTitles.length, 1);
  const sIndex = getIndex(rawTarget, templates.heroSubtitles.length, 2);
  const f1Index = getIndex(rawTarget, templates.feature1.length, 3);
  const f2Index = getIndex(rawTarget, templates.feature2.length, 4);
  const f3Index = getIndex(rawTarget, templates.feature3.length, 5);

  const heroTitle = templates.heroTitles[tIndex].replace('{X}', platformName);
  const heroSubtitle = templates.heroSubtitles[sIndex];
  const f1 = templates.feature1[f1Index];
  const f2 = templates.feature2[f2Index];
  const f3 = templates.feature3[f3Index];

  return (
    <div className="landing-wrapper">
      <style>{`
        .landing-wrapper { background-color: #f8fafc; color: #1e293b; min-height: 100vh; font-family: 'Tajawal', sans-serif; line-height: 1.6; direction: rtl; }
        .landing-wrapper * { box-sizing: border-box; margin: 0; padding: 0; }
        .header { background: #ffffff; padding: 16px 0; border-bottom: 1px solid #e2e8f0; text-align: center; }
        .logo-container { display: flex; align-items: center; justify-content: center; gap: 12px; }
        .app-icon { width: 44px; height: 44px; border-radius: 10px; }
        .logo-text { font-size: 22px; font-weight: 800; color: #0f172a; }
        .hero { max-width: 900px; margin: 35px auto 20px auto; padding: 0 20px; text-align: center; }
        .badge { display: inline-block; background-color: #e0f2fe; color: #0369a1; padding: 6px 18px; border-radius: 20px; font-size: 14px; font-weight: 700; margin-bottom: 15px; }
        .landing-wrapper h1 { font-size: 30px; font-weight: 800; color: #0f172a; margin-bottom: 15px; }
        .landing-wrapper p.subtitle { font-size: 17px; color: #64748b; margin-bottom: 25px; }
        
        .cta-container { margin-bottom: 20px; }
        .cta-btn { display: inline-flex; align-items: center; justify-content: center; background-color: #25d366; color: #ffffff; font-size: 18px; font-weight: 700; padding: 14px 32px; border-radius: 12px; text-decoration: none; box-shadow: 0 10px 20px -5px rgba(37, 211, 102, 0.4); transition: all 0.3s ease; }
        .cta-btn:hover { background-color: #20bd5a; }
        .cta-note { font-size: 13px; color: #64748b; margin-top: 10px; font-weight: 500; }

        .preview-section { max-width: 750px; margin: 25px auto; padding: 0 20px; text-align: center; }
        .preview-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.04); }
        .preview-img { width: 100%; height: auto; border-radius: 10px; display: block; object-fit: contain; }
        
        .features { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; max-width: 850px; margin: 40px auto; padding: 0 20px; }
        .feature-card { background: #ffffff; padding: 25px 20px; border-radius: 14px; border: 1px solid #e2e8f0; text-align: right; box-shadow: 0 2px 8px rgba(0,0,0,0.02); }
        .feature-icon { font-size: 28px; margin-bottom: 12px; display: block; }
        .feature-card h3 { font-size: 18px; color: #0f172a; margin-bottom: 8px; font-weight: 700; }
        .feature-card p { font-size: 14px; color: #64748b; }
        
        .footer { text-align: center; padding: 25px; font-size: 13px; color: #94a3b8; border-top: 1px solid #e2e8f0; margin-top: 50px; }
      `}</style>

      <header className="header">
        <div className="logo-container">
          <img src="https://i.ibb.co/Vpj89NPc/icon128.png" alt="شعار إنجازيا Pro Max" className="app-icon" />
          <div className="logo-text">مساعد إنجازيا Pro Max</div>
        </div>
      </header>

      <section className="hero">
        <span className="badge">متوافق ومُحسن لدعم {platformName}</span>
        <h1>{heroTitle}</h1>
        <p className="subtitle">{heroSubtitle}</p>
        
        <div className="cta-container">
          <a href="https://chromewebstore.google.com/detail/dpocelchhijafgbmjgnfaafcmhmgbjej" className="cta-btn" target="_blank" rel="noopener noreferrer">ابدأ التجربة المجانية الآن ⚡</a>
          <div className="cta-note">✨ 7 أيام تجربة مجانية بالكامل • ثم 9.99$ شهرياً • إلغاء في أي وقت</div>
        </div>
      </section>

      <section className="preview-section">
        <div className="preview-card">
          <img src="https://i.ibb.co/pvWnMm0n/2.png" alt={`طريقة عمل النظام لـ ${platformName}`} className="preview-img" />
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <span className="feature-icon">🏷️</span>
          <h3>{f1.title.replace('{X}', platformName)}</h3>
          <p>{f1.desc}</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">⚡</span>
          <h3>{f2.title.replace('{X}', platformName)}</h3>
          <p>{f2.desc}</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">📊</span>
          <h3>{f3.title.replace('{X}', platformName)}</h3>
          <p>{f3.desc}</p>
        </div>
      </section>

      <footer className="footer">
        <p>© 2026 إنجازيا للحلول المالية والتقنية - جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
}
