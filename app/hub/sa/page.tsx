'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const getInitialConfig = () => {
  if (typeof window === 'undefined') {
    return { lang: 'ar', currency: 'SAR', licenseKey: '', isActivated: false };
  }
  
  // فرض اللغة العربية والريال السعودي حصرياً لهذا المسار مع تحديث الهوية
  localStorage.setItem('seerk_global_lang', 'ar');
  localStorage.setItem('seerk_global_currency', 'SAR');

  const licenseKey = localStorage.getItem('merchant_license_key') || '';
  const isActivated = !!licenseKey;

  return { lang: 'ar', currency: 'SAR', licenseKey, isActivated };
};

interface ToolInfo {
  id: string;
  title: string;
  desc: string;
  icon: string;
  link: string;
}

// تم فرز وتحديد 24 أداة بدقة متناهية بناءً على احتياجات التاجر السعودي
// من الأهم والأكثر تأثيراً (رقم 1) إلى الأقل (رقم 24)
const saTools: ToolInfo[] = [
  { id: 'profit', title: 'حاسبة أرباح ونقاط التعادل (15% ضريبة)', desc: 'احسب صافي أرباحك بدقة بعد خصم التكاليف، رسوم الشحن، وضريبة القيمة المضافة.', icon: '📊', link: '/hub/profit' },
  { id: 'fees', title: 'حاسبة رسوم بوابات الدفع (تابي، تمارا، مدى)', desc: 'احسب نسب بوابات الدفع المحلية وتأثيرها الفعلي على هوامش أرباح متجرك.', icon: '💳', link: '/hub/fees' },
  { id: 'invoices', title: 'مولد الفواتير الإلكترونية (زاتكا)', desc: 'أنشئ فواتير مبيعات نظامية مبسطة (QR Code) متوافقة مع متطلبات هيئة الزكاة والضريبة.', icon: '🧾', link: '/hub/invoices' },
  { id: 'roas', title: 'محلل عائد الإعلانات (سناب وتيك توك)', desc: 'قس بدقة أداء إعلاناتك وهل تحقق عوائد مجزية في السوق السعودي أم تستنزف ميزانيتك.', icon: '📈', link: '/hub/roas' },
  { id: 'whatsapp', title: 'إدارة عملاء واتساب (Seerk Pro Max)', desc: 'إدارة السلال المتروكة، إرسال روابط الدفع السريعة، وتصنيف عملاء المتجر الفاعلين.', icon: '💬', link: '/hub/whatsapp' },
  { id: 'returns', title: 'محلل خسائر المرتجعات والشحن العكسي', desc: 'قس تأثير الاسترجاع والاستبدال على صافي أرباحك الشهرية وتدفقك النقدي.', icon: '🔄', link: '/hub/returns' },
  { id: 'vat_report', title: 'مجهز بيانات الإقرار الضريبي', desc: 'اجمع ورتب بيانات مبيعاتك ومشترياتك لتسهيل رفع الإقرار الضريبي لزاتكا بدون أخطاء.', icon: '📑', link: '/hub/vat-report' },
  { id: 'platforms', title: 'حاسبة رسوم المنصات (سلة، زد)', desc: 'احسب التكاليف الخفية واشتراكات المنصات المحلية لضمان تسعير منتجاتك بشكل صحيح.', icon: '🛒', link: '/hub/platforms' },
  { id: 'influencer', title: 'حاسبة جدوى إعلانات المشاهير', desc: 'حلل العائد المتوقع (ROI) من إعلانات المؤثرين قبل دفع مبالغ الحملة التسويقية.', icon: '🤳', link: '/hub/influencer' },
  { id: 'cod_risk', title: 'محلل تكاليف الدفع عند الاستلام', desc: 'احسب نسبة المخاطرة والرسوم الإضافية لطلبات الدفع عند الاستلام وتأثيرها على الربح.', icon: '🚚', link: '/hub/cod-risk' },
  { id: 'shipping', title: 'مدير تتبع الشحنات المحلية', desc: 'تابع حالات الشحنات (سمسا، أرامكس، ريدبوكس) وحل استفسارات تأخر التوصيل.', icon: '📦', link: '/hub/shipping' },
  { id: 'inventory', title: 'مخطط المخزون للمواسم السعودية', desc: 'توقع الكميات المطلوبة لمواسم (رمضان، العيد، اليوم الوطني) لتجنب نفاذ الكمية.', icon: '📅', link: '/hub/inventory' },
  { id: 'expenses', title: 'مدير النفقات والمصاريف التشغيلية', desc: 'تتبع مصاريف المتجر الثابتة والمتغيرة بالريال السعودي لضبط التدفق النقدي.', icon: '💸', link: '/hub/expenses' },
  { id: 'legal', title: 'مولد السياسات (وزارة التجارة)', desc: 'أنشئ صفحات الاستبدال والاسترجاع وسياسة الخصوصية المتوافقة مع القوانين المحلية.', icon: '⚖', link: '/hub/legal' },
  { id: 'jasmal', title: 'جاسمال (Jasmal) لاستخراج البيانات', desc: 'اسحب بيانات المنتجات والأسعار من المتاجر المنافسة ورتبها فوراً في ملفات إكسل.', icon: '🕷️', link: '/hub/jasmal' },
  { id: 'reviews', title: 'نظام طلب التقييمات الآلي', desc: 'أرسل رسائل تلقائية للعملاء عبر الواتساب بعد الاستلام لجمع التقييمات وبناء الموثوقية.', icon: '⭐', link: '/hub/reviews' },
  { id: 'dropshipping', title: 'حاسبة أرباح الدروبشيبينغ', desc: 'احسب هوامش الربح للمنتجات المستوردة مع أخذ رسوم الجمارك والشحن الدولي في الحسبان.', icon: '🌍', link: '/hub/dropshipping' },
  { id: 'copy', title: 'مولد نصوص الإكسبلور (باللهجة السعودية)', desc: 'اصنع سكربتات تيك توك وإعلانات جذابة باللهجة المحلية لزيادة معدل التحويل.', icon: '✍', link: '/hub/copy' },
  { id: 'support', title: 'قوالب خدمة العملاء السريعة', desc: 'انسخ ردود احترافية جاهزة للرد على استفسارات العملاء المكررة عبر واتساب.', icon: '🎧', link: '/hub/support' },
  { id: 'promos', title: 'حاسبة جدوى أكواد الخصم والعروض', desc: 'تأكد من أن عروضك الترويجية (مثل 1+1 أو الشحن المجاني) لا تسبب لك خسائر مخفية.', icon: '🎟️', link: '/hub/promos' },
  { id: 'ltv', title: 'حاسبة القيمة الدائمة للعميل (LTV)', desc: 'اعرف تكلفة الاستحواذ على العميل (CAC) وقيمته الفعلية لمتجرك على المدى الطويل.', icon: '🎯', link: '/hub/ltv' },
  { id: 'ab_test', title: 'حاسبة اختبارات الإعلانات (A/B)', desc: 'قارن بين حملتين إعلانيتين لتعرف أيهما يحقق أفضل عائد بأقل تكلفة للطلب.', icon: '⚖️', link: '/hub/ab-test' },
  { id: 'links', title: 'صانع روابط واتساب السريعة', desc: 'أنشئ روابط مخصصة برسائل جاهزة لبيو تيك توك أو تمريرها في حملات الانستقرام.', icon: '🔗', link: '/hub/links' },
  { id: 'tips', title: 'أسرار نمو المتاجر السعودية', desc: 'مكتبة استراتيجيات حصرية لزيادة التحويل ورفع ولاء العملاء في السوق المحلي.', icon: '💡', link: '/hub/tips' }
];

export default function SeerkSaudiHub() {
  const [licenseKeyInput, setLicenseKeyInput] = useState<string>('');
  const [isActivated, setIsActivated] = useState<boolean>(false);

  const LEMON_CHECKOUT_URL = 'https://seerk.lemonsqueezy.com/checkout/buy/80ff492a-01eb-4455-b1a8-96e12ab72562';

  useEffect(() => {
    const config = getInitialConfig();
    setLicenseKeyInput(config.licenseKey);
    setIsActivated(config.isActivated);
    if (typeof window !== 'undefined') {
      document.title = 'منصة Seerk | السوق السعودي 🇸🇦';
    }
  }, []);

  const handleActivateLicense = () => {
    if (!licenseKeyInput.trim()) {
      alert('الرجاء إدخال مفتاح الاشتراك الصحيح.');
      return;
    }
    const cleanKey = licenseKeyInput.trim();
    localStorage.setItem('merchant_license_key', cleanKey);
    setIsActivated(true);
    alert('✨ تم تفعيل النظام والمزامنة السحابية بنجاح عبر كل أدوات منصة Seerk!');
  };

  const handleDeactivateLicense = () => {
    localStorage.removeItem('merchant_license_key');
    setLicenseKeyInput('');
    setIsActivated(false);
    alert('⚠️ تم إلغاء تفعيل الاشتراك.');
  };

  return (
    <div className="hub-container" style={{ direction: 'rtl' }}>
      <style jsx global>{`
        a, .clean-link { text-decoration: none !important; color: inherit !important; }
      `}</style>
      
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        
        .hub-container { background-color: #f8fafc; min-height: 100vh; font-family: 'Tajawal', sans-serif; padding: 30px 20px 40px; }
        
        .navbar { max-width: 1250px; margin: 0 auto 25px; padding: 12px 24px; background: #ffffff; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); border: 1px solid #cbd5e1; flex-wrap: nowrap; gap: 10px; }
        .brand { font-size: 26px; font-weight: 900; color: #0f172a; white-space: nowrap; display: flex; align-items: center; gap: 8px; font-family: system-ui, -apple-system, sans-serif; letter-spacing: -0.5px; }
        .brand span { color: #4f46e5; }
        .sa-badge { background: #dcfce7; color: #166534; font-size: 12px; font-weight: 800; padding: 3px 8px; border-radius: 6px; font-family: 'Tajawal', sans-serif; letter-spacing: normal; }
        
        .nav-controls { display: flex; align-items: center; gap: 12px; flex-wrap: nowrap; }
        
        .license-box { display: flex; align-items: center; gap: 6px; background: #f8fafc; padding: 4px 8px; border-radius: 8px; border: 1px solid #cbd5e1; }
        .license-input { border: 1px solid #cbd5e1; border-radius: 6px; padding: 4px 10px; font-size: 12px; outline: none; width: 170px; font-family: 'Tajawal', sans-serif; background: #fff; color: #0f172a; }
        .license-input:focus { border-color: #4f46e5; box-shadow: 0 0 0 2px rgba(79,70,229,0.1); }
        
        .upgrade-btn { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: #fff !important; padding: 7px 14px; border-radius: 8px; font-weight: 800; font-size: 12px; text-decoration: none; display: inline-flex; align-items: center; gap: 5px; box-shadow: 0 4px 10px rgba(79,70,229,0.2); white-space: nowrap; }
        
        .promo-banner { max-width: 1250px; margin: 0 auto 35px; background: linear-gradient(135deg, #047857 0%, #065f46 100%); color: #fff; border-radius: 16px; padding: 22px 32px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px; box-shadow: 0 12px 30px rgba(4,120,87,0.3); border: 1px solid rgba(255,255,255,0.25); position: relative; overflow: hidden; }
        .promo-banner::before { content: ''; position: absolute; top: -60px; right: -60px; width: 180px; height: 180px; background: rgba(255,255,255,0.12); border-radius: 50%; pointer-events: none; }
        .promo-content { display: flex; flex-direction: column; gap: 8px; z-index: 1; }
        .promo-heading { font-size: 18px; font-weight: 900; display: flex; align-items: center; gap: 8px; }
        .promo-text { font-size: 14px; font-weight: 700; opacity: 0.98; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .price-tag-new { background: #f59e0b; color: #fff; padding: 3px 10px; border-radius: 8px; font-weight: 900; font-size: 15px; }
        .price-tag-old { text-decoration: line-through; opacity: 0.75; font-size: 12.5px; font-weight: 800; }
        .promo-btn { background: #fff; color: #065f46; border: none; padding: 12px 26px; border-radius: 12px; font-weight: 900; font-size: 14px; cursor: pointer; transition: all 0.25s ease; box-shadow: 0 6px 15px rgba(0,0,0,0.15); z-index: 1; }
        .promo-btn:hover { background: #f8fafc; transform: translateY(-3px); }

        .hero { text-align: center; max-width: 800px; margin: 0 auto 50px; }
        .hero h1 { font-size: 36px; font-weight: 900; color: #0f172a; margin-bottom: 15px; letter-spacing: -0.5px; }
        .hero h1 span { color: #047857; }
        .hero p { color: #475569; font-size: 16px; line-height: 1.7; font-weight: 500; }

        .cards-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; max-width: 1250px; margin: 0 auto 60px; }
        
        .card { background: #ffffff; border-radius: 12px; padding: 24px; border: 2px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.02); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); display: flex; flex-direction: column; justify-content: space-between; text-align: start; }
        .card:hover { transform: translateY(-5px); border-color: #047857; box-shadow: 0 15px 30px -5px rgba(4,120,87,0.15); }

        .card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
        .card-icon { font-size: 28px; background: #f1f5f9; width: 55px; height: 55px; display: flex; align-items: center; justify-content: center; border-radius: 10px; }
        .card:hover .card-icon { background: #ecfdf5; }
        
        .card-badge { background: #f1f5f9; color: #475569; font-size: 14px; font-weight: 900; padding: 6px 14px; border-radius: 8px; }
        .card:hover .card-badge { color: #047857; background: #ecfdf5; }

        .card h3 { font-size: 18px; font-weight: 900; color: #0f172a; margin-bottom: 10px; line-height: 1.4; transition: color 0.3s ease; }
        .card:hover h3 { color: #047857; }
        
        .card p { color: #64748b; font-size: 13.5px; line-height: 1.6; font-weight: 500; margin-bottom: 24px; min-height: 50px; }
        
        .card-btn { background: #ecfdf5; color: #047857; text-align: center; padding: 14px; border-radius: 8px; font-weight: 800; font-size: 14px; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .card:hover .card-btn { background: #047857; color: #ffffff; box-shadow: 0 4px 12px rgba(4,120,87,0.25); }

        .footer { max-width: 1250px; margin: 0 auto; background: #0f172a; border-radius: 16px; padding: 40px; color: #f8fafc; border: 1px solid #1e293b; text-align: start; }
        .footer-content { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 30px; margin-bottom: 30px; border-bottom: 1px solid #334155; padding-bottom: 30px; }
        .footer-brand { max-width: 400px; }
        .footer-brand h3 { font-size: 24px; font-weight: 900; margin-bottom: 15px; color: #ffffff; font-family: system-ui, -apple-system, sans-serif; letter-spacing: -0.5px; }
        .footer-brand h3 span { color: #34d399; font-family: 'Tajawal', sans-serif; letter-spacing: normal; }
        .footer-brand p { color: #94a3b8; font-size: 14px; line-height: 1.8; font-weight: 500; }
        .footer-links { display: flex; gap: 60px; }
        .links-column h4 { color: #ffffff; font-size: 16px; font-weight: 800; margin-bottom: 20px; }
        .links-column ul { list-style: none; padding: 0; margin: 0; }
        .links-column ul li { margin-bottom: 12px; }
        .links-column ul li a { color: #94a3b8 !important; font-size: 14px; font-weight: 500; }
        .links-column ul li a:hover { color: #34d399 !important; }
        .footer-bottom { text-align: center; color: #64748b; font-size: 14px; font-weight: 500; }

        @media(max-width: 1024px) { .cards-grid { grid-template-columns: repeat(2, 1fr); } .footer-content { flex-direction: column; } }
        @media(max-width: 640px) { .cards-grid { grid-template-columns: 1fr; } .hero h1 { font-size: 28px; } .footer-links { flex-direction: column; gap: 30px; } }
      `}</style>

      {/* شريط التحكم العلوي */}
      <div className="navbar">
        <div className="brand">
          Seerk <span className="sa-badge">السوق السعودي 🇸🇦</span>
        </div>

        <div className="nav-controls">
          <div className="license-box">
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#475569' }}>🔑 ترخيص PRO:</span>
            {isActivated ? (
              <>
                <span style={{ fontSize: '11px', fontWeight: 900, color: '#10b981' }}>النظام مفعل ✓</span>
                <button 
                  onClick={handleDeactivateLicense}
                  style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '3px 6px', borderRadius: '4px', fontSize: '9px', fontWeight: 800, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif' }}
                >
                  إلغاء
                </button>
              </>
            ) : (
              <>
                <input 
                  type="text" 
                  className="license-input"
                  placeholder="أدخل مفتاح الترخيص..." 
                  value={licenseKeyInput} 
                  onChange={(e) => setLicenseKeyInput(e.target.value)}
                />
                <button 
                  onClick={handleActivateLicense}
                  style={{ background: '#047857', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif' }}
                >
                  تفعيل
                </button>
              </>
            )}
          </div>

          {!isActivated && (
            <a href={LEMON_CHECKOUT_URL} target="_blank" rel="noopener noreferrer" className="upgrade-btn">
              ⚡ ترقية اشتراك (37.46 ر.س)
            </a>
          )}
        </div>
      </div>

      {/* إعلان الترقية الخاص بالسوق السعودي */}
      {!isActivated && (
        <div className="promo-banner">
          <div className="promo-content">
            <div className="promo-heading">🔥 عرض خاص لتجار المملكة - احصل على النسخة الشاملة بالريال السعودي!</div>
            <div className="promo-text">
              <span>اشترك اليوم مقابل</span>
              <span className="price-tag-new">37.46 ر.س</span>
              <span>شهرياً</span>
              <span className="price-tag-old">(بدلاً من 108.75 ر.س)</span>
            </div>
          </div>
          <a href={LEMON_CHECKOUT_URL} target="_blank" rel="noopener noreferrer">
            <button className="promo-btn">
              🚀 ترقية حسابك الآن بخصم 65%
            </button>
          </a>
        </div>
      )}

      <div className="hero">
        <h1>منصة Seerk <span>ULTRA MAX للسوق السعودي</span></h1>
        <p>الترسانة السحابية المتكاملة بـ 24 أداة دقيقة، صُممت خصيصاً لتمكين وتطوير المتاجر الإلكترونية في المملكة العربية السعودية بالريال السعودي (ر.س) ومتوافقة مع متطلبات ضريبة القيمة المضافة.</p>
      </div>

      <div className="cards-grid">
        {saTools.map((tool, index) => (
          <Link href={tool.link} key={tool.id} className="card clean-link">
            <div>
              <div className="card-top">
                <div className="card-icon">{tool.icon}</div>
                <span className="card-badge">#{index + 1}</span>
              </div>
              <h3>{tool.title}</h3>
              <p>{tool.desc}</p>
            </div>
            <div className="card-btn">
              <span>تشغيل الأداة</span>
              <span>←</span>
            </div>
          </Link>
        ))}
      </div>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>Seerk <span>السعودية</span></h3>
            <p>المنصة السحابية الأولى المخصصة لتمكين تجار التجارة الإلكترونية في المملكة العربية السعودية. أدوات دقيقة، حسابات ضريبية متوافقة مع زاتكا، وأرباح مضاعفة.</p>
          </div>
          <div className="footer-links">
            <div className="links-column">
              <h4>المنصة</h4>
              <ul>
                <li><a href="#">جميع الأدوات (24)</a></li>
                <li><a href="#">التحديثات الجديدة</a></li>
                <li><a href="#">أسعار الباقات</a></li>
              </ul>
            </div>
            <div className="links-column">
              <h4>الدعم والمساعدة</h4>
              <ul>
                <li><a href="#">الدعم الفني</a></li>
                <li><a href="#">الأسئلة الشائعة</a></li>
              </ul>
            </div>
            <div className="links-column">
              <h4>الأنظمة والقوانين</h4>
              <ul>
                <li><a href="#">شروط الاستخدام</a></li>
                <li><a href="#">سياسة الخصوصية</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>جميع الحقوق محفوظة © 2026 منصة Seerk لتمكين التجارة الإلكترونية في المملكة العربية السعودية</p>
        </div>
      </footer>
    </div>
  );
}
