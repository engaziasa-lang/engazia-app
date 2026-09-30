import type { Metadata } from 'next';

type Props = {
  params: Promise<{ platform: string }>;
};

// 1. قاموس المحتوى الديناميكي: هنا يكمن سر التميز (SEO)
const platformsContent: Record<string, any> = {
  "سلة": {
    metaTitle: "إضافة إنجازيا لرفع مبيعات تجار سلة عبر واتساب",
    metaDesc: "حل متكامل لربط متجرك في سلة مع واتساب، استرجاع السلال المتروكة، وتنظيم رسائل العملاء باحترافية تامة.",
    badge: "أداة مخصصة لمتاجر سلة",
    heroTitle: "ضاعف أرباح متجرك على سلة بفضل الإدارة الذكية للواتساب",
    heroSubtitle: "لا تفوت أي طلب بعد اليوم. رتب محادثات عملائك، أرسل روابط الدفع، وتابع الطلبات المعلقة في سلة من شاشة واحدة.",
    f1Title: "فلترة عملاء سلة بدقة",
    f1Desc: "نظام علامات مرئي يوضح لك حالة كل متسوق (تم الدفع، بانتظار التحويل، سلة متروكة) لسرعة الوصول.",
    f2Title: "قوالب بيع جاهزة",
    f2Desc: "نصوص محفوظة لترحيب الزوار وإرسال تفاصيل المنتجات لتسريع إتمام الطلب دون كتابة يدوية.",
    f3Title: "استخراج تقارير إكسل",
    f3Desc: "حمل بيانات المهتمين بمنتجاتك في شيت Excel لتسهيل حملات إعادة الاستهداف التسويقية."
  },
  "زد": {
    metaTitle: "نظام إنجازيا الاحترافي لإدارة عملاء زد على الواتساب",
    metaDesc: "حسّن تجربة الشراء لعملائك في زد، قم بإدارة الردود، وصنف المحادثات بطريقة تضاعف معدلات التحويل.",
    badge: "متوافق كلياً مع منصة زد",
    heroTitle: "ارتقِ بخدمة عملاء متجرك في زد إلى مستوى جديد عبر واتساب ويب",
    heroSubtitle: "تحكم كامل في رسائل المتسوقين، أتمتة الردود السريعة، وتنظيم حالات الشحن لضمان تجربة مستخدم استثنائية تزيد ولاءهم.",
    f1Title: "تصنيفات ذكية للمتسوقين",
    f1Desc: "فرز المحادثات بناءً على سلوك الشراء داخل متجر زد لتسهيل المتابعة اليومية لفريق العمل.",
    f2Title: "مكتبة الردود السريعة",
    f2Desc: "وفر وقتك بإنشاء رسائل جاهزة للإجابة عن أسئلة التوصيل وطرق الدفع المعتمدة في متجرك.",
    f3Title: "تصدير قواعد البيانات",
    f3Desc: "احفظ أرقام المتواصلين معك بنقرة واحدة لتستفيد منها لاحقاً في إطلاق حملات ترويجية للمواسم."
  },
  "default": {
    metaTitle: "مساعد إنجازيا Pro Max لإدارة عملاء التجارة الإلكترونية",
    metaDesc: "صنّف المحادثات، تابِع السلال المتروكة، وأرسل ردوداً سريعة لمتجرك بضغطة زر.",
    badge: "نظام برمجي معتمد لزيادة المبيعات",
    heroTitle: "حوّل واتساب ويب إلى نظام إدارة عملاء (CRM) متكامل لمتجرك",
    heroSubtitle: "صنّف المحادثات، تابِع السلال المتروكة، وأرسل ردوداً سريعة بضغطة زر لرفع مبيعاتك اليومية بسهولة.",
    f1Title: "تصنيف وتقسيم العملاء",
    f1Desc: "قسم محادثات متجرك بأسماء واضحة للوصول المباشر والفوري لكل شريحة.",
    f2Title: "ردود سريعة وقوالب",
    f2Desc: "احفظ قوالب الترحيب وروابط الدفع المباشرة وكشوفات المنتجات وأرسلها فوراً لعملائك.",
    f3Title: "تصدير البيانات المتقدم",
    f3Desc: "إمكانية تصدير قائمة العملاء والتصنيفات في ملف Excel بضغطة واحدة لمتابعة الأداء."
  }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const platformName = decodeURIComponent(resolvedParams.platform);
  
  // استدعاء البيانات المخصصة، أو استخدام الافتراضية إذا كانت المنصة غير مسجلة
  const content = platformsContent[platformName] || platformsContent["default"];
  
  return {
    title: content.metaTitle,
    description: content.metaDesc,
  };
}

export default async function PlatformLandingPage({ params }: Props) {
  const resolvedParams = await params;
  const platformName = decodeURIComponent(resolvedParams.platform);
  
  const content = platformsContent[platformName] || platformsContent["default"];

  return (
    <div className="landing-wrapper">
      <style>{`
        .landing-wrapper { background-color: #f8fafc; color: #1e293b; min-height: 100vh; font-family: 'Tajawal', sans-serif; line-height: 1.6; direction: rtl; }
        .landing-wrapper * { box-sizing: border-box; margin: 0; padding: 0; }
        .header { background: #ffffff; padding: 16px 0; border-bottom: 1px solid #e2e8f0; text-align: center; }
        .logo-container { display: flex; align-items: center; justify-content: center; gap: 12px; }
        .app-icon { width: 44px; height: 44px; border-radius: 10px; }
        .logo-text { font-size: 22px; font-weight: 800; color: #0f172a; }
        .hero { max-width: 900px; margin: 25px auto 20px auto; padding: 0 20px; text-align: center; }
        .badge { display: inline-block; background-color: #e0f2fe; color: #0369a1; padding: 6px 18px; border-radius: 20px; font-size: 14px; font-weight: 700; margin-bottom: 15px; }
        .landing-wrapper h1 { font-size: 30px; font-weight: 800; color: #0f172a; margin-bottom: 12px; }
        .landing-wrapper p.subtitle { font-size: 16px; color: #64748b; margin-bottom: 20px; }
        
        .cta-container { margin-bottom: 8px; }
        .cta-btn { display: inline-flex; align-items: center; justify-content: center; background-color: #25d366; color: #ffffff; font-size: 18px; font-weight: 700; padding: 14px 32px; border-radius: 12px; text-decoration: none; box-shadow: 0 10px 20px -5px rgba(37, 211, 102, 0.4); transition: all 0.3s ease; }
        .cta-btn:hover { background-color: #20bd5a; }
        .cta-note { font-size: 13px; color: #64748b; margin-top: 8px; font-weight: 500; }

        .preview-section { max-width: 750px; margin: 25px auto; padding: 0 20px; text-align: center; }
        .preview-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.04); }
        .preview-img { width: 100%; height: auto; border-radius: 10px; display: block; object-fit: contain; }
        
        .features { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; max-width: 850px; margin: 30px auto; padding: 0 20px; }
        .feature-card { background: #ffffff; padding: 20px; border-radius: 14px; border: 1px solid #e2e8f0; text-align: right; box-shadow: 0 2px 8px rgba(0,0,0,0.02); }
        .feature-icon { font-size: 26px; margin-bottom: 8px; }
        .feature-card h3 { font-size: 17px; color: #0f172a; margin-bottom: 6px; font-weight: 700; }
        .feature-card p { font-size: 14px; color: #64748b; }
        
        .footer { text-align: center; padding: 20px; font-size: 13px; color: #94a3b8; border-top: 1px solid #e2e8f0; margin-top: 40px; display: flex; justify-content: center; gap: 20px; align-items: center; }
        .footer a { color: #64748b; text-decoration: none; }
        .footer a:hover { color: #0f172a; }
      `}</style>

      <header className="header">
        <div className="logo-container">
          <img src="https://i.ibb.co/Vpj89NPc/icon128.png" alt="شعار إنجازيا Pro Max" className="app-icon" />
          <div className="logo-text">مساعد إنجازيا Pro Max</div>
        </div>
      </header>

      <section className="hero">
        <span className="badge">{content.badge}</span>
        <h1>{content.heroTitle}</h1>
        <p className="subtitle">{content.heroSubtitle}</p>
        
        <div className="cta-container">
          {/* الرابط الثابت الخاص بإضافة المتجر محفوظ ولم يتغير */}
          <a href="https://chromewebstore.google.com/detail/dpocelchhijafgbmjgnfaafcmhmgbjej" className="cta-btn" target="_blank" rel="noopener noreferrer">ابدأ التجربة المجانية الآن ⚡</a>
          <div className="cta-note">✨ 7 أيام تجربة مجانية بالكامل • ثم 9.99$ شهرياً • تدعم حتى 3 أجهزة • إلغاء في أي وقت</div>
        </div>
      </section>

      <section className="preview-section">
        <div className="preview-card">
          <img src="https://i.ibb.co/pvWnMm0n/2.png" alt="طريقة عمل النظام داخل واتساب ويب" className="preview-img" />
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <div className="feature-icon">🏷️</div>
          <h3>{content.f1Title}</h3>
          <p>{content.f1Desc}</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h3>{content.f2Title}</h3>
          <p>{content.f2Desc}</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <h3>{content.f3Title}</h3>
          <p>{content.f3Desc}</p>
        </div>
      </section>

      <footer className="footer">
        <span>© 2026 إنجازيا للحلول المالية والتقنية - جميع الحقوق محفوظة.</span>
        <a href="#privacy">سياسة الخصوصية</a>
      </footer>
    </div>
  );
}
