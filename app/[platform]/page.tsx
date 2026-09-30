import type { Metadata } from 'next';
import Link from 'next/link';

type Props = {
  params: Promise<{ platform: string }>;
};

const spinTemplates = {
  hookTitles: [
    "كيف تضاعف مبيعات {cat} على منصة {plat} في {loc} عبر واتساب؟",
    "الدليل الشامل لتجار {cat} في {loc} لاستخدام نظام {plat} وإدارة الواتساب",
    "الحل النهائي لأصحاب {cat} عبر {plat} بمدينة {loc}: أتمتة الردود واسترجاع السلال",
    "أقوى أداة مخصصة لتاجر {cat} في {loc} لربط متجرك على {plat} بنظام CRM",
    "وداعاً لضياع العملاء: إدارة محادثات {cat} على {plat} في {loc} بضغطة زر واحدة",
    "استراتيجية مضاعفة الأرباح لمتاجر {cat} عبر {plat} لمستسوقي {loc}"
  ],
  intros: [
    "إذا كنت تبحث عن طريقة احترافية لرفع كفاءة متجرك، فإن ربط محادثات العملاء بنظام ذكي يغير معادلة المبيعات بالكامل.",
    "تواجه متاجر {cat} في {loc} تحديات كبيرة في سرعة الرد ومتابعة السلال المتروكة، وهذا الحل صمم خصيصاً لحل هذه المشكلة الجذرية.",
    "من خلال استغلال قوة الواتساب وتكامله مع {plat}، تستطيع اليوم تحويل كل استفسار عادي إلى عملية شراء مؤكدة في سوق {loc}.",
    "التجارة الإلكترونية الناجحة تعتمد على سرعة الاستجابة وتتبع العملاء المهتمين، وهذا ما توفره لك أداتنا المخصصة لتجار {cat}."
  ],
  f1: [
    { title: "تصنيف متقدم لعملاء {cat}", desc: "نظام علامات ذكي يتيح لك فرز عملاء {plat} في {loc} حسب مرحلة الشراء (سلة متروكة، بانتظار الدفع، عميل مميز)." },
    { title: "فلترة ذكية لرسائل {loc}", desc: "تنظيم محادثات واتساب ويب الخاصة بمتجرك على {plat} لفصل طلبات الشحن عن الاستفسارات العامة." },
    { title: "إدارة مسارات الشراء", desc: "تابع عملاء نشاطك بدقة من لحظة الاستفسار وحتى استلام الطلب بنجاح داخل {loc}." }
  ],
  f2: [
    { title: "قوالب ردود جاهزة لـ {plat}", desc: "احفظ تفاصيل الحسابات البنكية، روابط الدفع السريع، ونصوص الشرح وأرسلها لعملاء {cat} بنقرة واحدة." },
    { title: "أتمتة الردود لمتجرك", desc: "وفر ساعات من الكتابة اليدوية وأجب على الأسئلة المتكررة لمتسوقي {loc} فوراً." },
    { title: "مكتبة الرسائل التسويقية", desc: "ارسل عروضاً حصرية مخصصة لعملاء نشاطك لرفع معدلات الولاء والشراء المتكرر." }
  ],
  f3: [
    { title: "تصدير بيانات عملاء {loc} لـ Excel", desc: "احفظ أرقام وقوائم المهتمين بمنتجاتك في شيت إكسل لتسهيل حملات إعادة الاستهداف الإعلانية." },
    { title: "بناء قاعدة بيانات آمنة", desc: "تأكد من عدم ضياع أي عميل محتمل لمتجرك عبر تصدير السجلات الاحتياطية ودراسة أداء المبيعات." },
    { title: "تحليل حركة المتسوقين", desc: "استخرج تقارير دقيقة عن السلال غير المكتملة وتابع نمو أرباحك الشهري بسهولة." }
  ]
};

const getHashIndex = (str: string, max: number, salt: number) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i) * salt) % max;
  }
  return Math.abs(hash);
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const rawSlug = decodeURIComponent(resolvedParams.platform);
  const parts = rawSlug.split('-');
  const platform = parts[0] || 'المتجر';
  const category = parts.slice(1, -1).join(' ').replace(/-/g, ' ') || 'التجارة الإلكترونية';
  const location = parts[parts.length - 1] || 'المملكة';

  const tIdx = getHashIndex(rawSlug, spinTemplates.hookTitles.length, 1);
  const title = spinTemplates.hookTitles[tIdx]
    .replace('{plat}', platform)
    .replace('{cat}', category)
    .replace('{loc}', location);

  return {
    title: `${title} | مساعد إنجازيا Pro Max`,
    description: `اكتشف كيف تزيد مبيعات ${category} في ${location} عبر ربط ${platform} بواتساب وتتبع السلال المتروكة.`,
  };
}

export default async function ProgrammaticPage({ params }: Props) {
  const resolvedParams = await params;
  const rawSlug = decodeURIComponent(resolvedParams.platform);
  const parts = rawSlug.split('-');
  const platform = parts[0] || 'سلة';
  const category = parts.slice(1, -1).join('-') || 'متاجر-العطور';
  const location = parts[parts.length - 1] || 'الرياض';

  const categoryName = category.replace(/-/g, ' ');
  const locationName = location.replace(/-/g, ' ');

  const tIdx = getHashIndex(rawSlug, spinTemplates.hookTitles.length, 1);
  const introIdx = getHashIndex(rawSlug, spinTemplates.intros.length, 2);
  const f1Idx = getHashIndex(rawSlug, spinTemplates.f1.length, 3);
  const f2Idx = getHashIndex(rawSlug, spinTemplates.f2.length, 4);
  const f3Idx = getHashIndex(rawSlug, spinTemplates.f3.length, 5);

  const heroTitle = spinTemplates.hookTitles[tIdx].replace('{plat}', platform).replace('{cat}', categoryName).replace('{loc}', locationName);
  const introText = spinTemplates.intros[introIdx].replace('{plat}', platform).replace('{cat}', categoryName).replace('{loc}', locationName);
  
  const feature1 = {
    title: spinTemplates.f1[f1Idx].title.replace('{plat}', platform).replace('{cat}', categoryName).replace('{loc}', locationName),
    desc: spinTemplates.f1[f1Idx].desc.replace('{plat}', platform).replace('{cat}', categoryName).replace('{loc}', locationName)
  };
  const feature2 = {
    title: spinTemplates.f2[f2Idx].title.replace('{plat}', platform).replace('{cat}', categoryName).replace('{loc}', locationName),
    desc: spinTemplates.f2[f2Idx].desc.replace('{plat}', platform).replace('{cat}', categoryName).replace('{loc}', locationName)
  };
  const feature3 = {
    title: spinTemplates.f3[f3Idx].title.replace('{plat}', platform).replace('{cat}', categoryName).replace('{loc}', locationName),
    desc: spinTemplates.f3[f3Idx].desc.replace('{plat}', platform).replace('{cat}', categoryName).replace('{loc}', locationName)
  };

  // توليد روابط مرتبطة ذكية (Internal Links) لتوجيه جوجل لصفحات أخرى فوراً
  const samplePlatforms = ['سلة', 'زد', 'شوبيفاي', 'ووكومرس'];
  const sampleLocations = ['الرياض', 'جدة', 'الدمام', 'مكة-المكرمة', 'التبوك'];
  
  const relatedLinks = samplePlatforms.map((p) => ({
    name: `${p} - ${categoryName} في ${sampleLocations[Math.floor(rawSlug.length + p.length) % sampleLocations.length]}`,
    slug: `${p}-${category}-${sampleLocations[Math.floor(rawSlug.length + p.length) % sampleLocations.length]}`
  }));

  return (
    <div className="landing-wrapper">
      <style>{`
        .landing-wrapper { background-color: #f8fafc; color: #1e293b; min-height: 100vh; font-family: 'Tajawal', sans-serif; line-height: 1.7; direction: rtl; }
        .landing-wrapper * { box-sizing: border-box; margin: 0; padding: 0; }
        .header { background: #ffffff; padding: 16px 0; border-bottom: 1px solid #e2e8f0; text-align: center; }
        .logo-container { display: flex; align-items: center; justify-content: center; gap: 12px; }
        .app-icon { width: 44px; height: 44px; border-radius: 10px; }
        .logo-text { font-size: 22px; font-weight: 800; color: #0f172a; }
        .hero { max-width: 900px; margin: 40px auto 25px auto; padding: 0 20px; text-align: center; }
        .badge { display: inline-block; background-color: #e0f2fe; color: #0369a1; padding: 6px 18px; border-radius: 20px; font-size: 14px; font-weight: 700; margin-bottom: 15px; }
        .landing-wrapper h1 { font-size: 30px; font-weight: 800; color: #0f172a; margin-bottom: 15px; }
        .landing-wrapper p.subtitle { font-size: 17px; color: #64748b; margin-bottom: 25px; }
        
        .cta-container { margin-bottom: 25px; }
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
        
        /* شبكة الروابط الداخلية للأرشفة السريعة */
        .internal-links { max-width: 850px; margin: 50px auto 20px auto; padding: 25px; background: #ffffff; border-radius: 14px; border: 1px solid #e2e8f0; text-align: right; }
        .internal-links h4 { font-size: 16px; color: #0f172a; margin-bottom: 15px; font-weight: 700; }
        .links-grid { display: flex; flex-wrap: wrap; gap: 10px; }
        .internal-link-item { background: #f1f5f9; color: #0369a1; padding: 6px 12px; border-radius: 8px; font-size: 13px; text-decoration: none; transition: background 0.2s; }
        .internal-link-item:hover { background: #e0f2fe; color: #0284c7; }

        .footer { text-align: center; padding: 25px; font-size: 13px; color: #94a3b8; border-top: 1px solid #e2e8f0; margin-top: 30px; }
      `}</style>

      <header className="header">
        <div className="logo-container">
          <img src="https://i.ibb.co/Vpj89NPc/icon128.png" alt="شعار إنجازيا Pro Max" className="app-icon" />
          <div className="logo-text">مساعد إنجازيا Pro Max</div>
        </div>
      </header>

      <section className="hero">
        <span className="badge">حل تقني مخصص لقطاع {categoryName} في {locationName} ({platform})</span>
        <h1>{heroTitle}</h1>
        <p className="subtitle">{introText}</p>
        
        <div className="cta-container">
          <a href="https://chromewebstore.google.com/detail/dpocelchhijafgbmjgnfaafcmhmgbjej" className="cta-btn" target="_blank" rel="noopener noreferrer">ابدأ التجربة المجانية الآن ⚡</a>
          <div className="cta-note">✨ 7 أيام تجربة مجانية بالكامل • ثم 9.99$ شهرياً • تدعم حتى 3 أجهزة • إلغاء في أي وقت</div>
        </div>
      </section>

      <section className="preview-section">
        <div className="preview-card">
          <img src="https://i.ibb.co/pvWnMm0n/2.png" alt={`تشغيل نظام إنجازيا لتاجر ${categoryName}`} className="preview-img" />
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <span className="feature-icon">🏷️</span>
          <h3>{feature1.title}</h3>
          <p>{feature1.desc}</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">⚡</span>
          <h3>{feature2.title}</h3>
          <p>{feature2.desc}</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">📊</span>
          <h3>{feature3.title}</h3>
          <p>{feature3.desc}</p>
        </div>
      </section>

      {/* قسم شبكة الروابط الداخلية (لتأمين أرشفة جوجل الفورية) */}
      <section className="internal-links">
        <h4>🔗 تصفح صفحات إنجازيا المجاورة حسب المنصة والقطاع:</h4>
        <div className="links-grid">
          {relatedLinks.map((item, idx) => (
            <Link key={idx} href={`/${item.slug}`} className="internal-link-item">
              {item.name}
            </Link>
          ))}
        </div>
      </section>

      <footer className="footer">
        <p>© 2026 إنجازيا للحلول المالية والتقنية - جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
}
