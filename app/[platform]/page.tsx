import type { Metadata } from 'next';

type Props = {
  params: Promise<{ platform: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const platformName = decodeURIComponent(resolvedParams.platform);
  
  return {
    title: `مساعد إنجازيا Pro Max لمتاجر ${platformName} | إدارة عملاء واتساب ويب`,
    description: `صنّف المحادثات، تابِع السلال المتروكة، وأرسل ردوداً سريعة لمتجرك على ${platformName} بضغطة زر.`,
  };
}

export default async function PlatformLandingPage({ params }: Props) {
  const resolvedParams = await params;
  const platformName = decodeURIComponent(resolvedParams.platform);

  return (
    <div className="landing-wrapper">
      <style>{`
        .landing-wrapper { background-color: #f8fafc; color: #1e293b; min-height: 100vh; font-family: 'Tajawal', sans-serif; line-height: 1.6; }
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
        <span className="badge">نظام برمجي معتمد لمتاجر {platformName}</span>
        <h1>حوّل واتساب ويب إلى نظام إدارة عملاء (CRM) متكامل لمتاجر {platformName}</h1>
        <p className="subtitle">صنّف المحادثات، تابِع السلال المتروكة، وأرسل ردوداً سريعة بضغطة زر لرفع مبيعات متجرك على {platformName}.</p>
        
        <div className="cta-container">
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
          <h3>تصنيف وتقسيم عملاء {platformName}</h3>
          <p>قسم محادثات متجرك على {platformName} بأسماء واضحة (عميل جديد، سلة متروكة، بانتظار الدفع، تم الشحن) للوصول المباشر.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h3>ردود سريعة وقوالب جاهزة</h3>
          <p>احفظ قوالب الترحيب وروابط الدفع المباشرة وكشوفات المنتجات وأرسلها فوراً لعملائك بضغطة زر.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <h3>تصدير البيانات إلى Excel</h3>
          <p>إمكانية تصدير قائمة العملاء والتصنيفات لمتجرك في ملف Excel بضغطة واحدة لمتابعة المبيعات بدقة.</p>
        </div>
      </section>

      <footer className="footer">
        <span>© 2026 إنجازيا للحلول المالية والتقنية - جميع الحقوق محفوظة.</span>
        <a href="#privacy">سياسة الخصوصية</a>
      </footer>
    </div>
  );
}
