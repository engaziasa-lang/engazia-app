'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface LanguageDictionary {
  [key: string]: {
    live: string;
    heroTitle: string;
    heroDesc: string;
    runTool: string;
    footerDesc: string;
    platform: string;
    allTools: string;
    updates: string;
    pricing: string;
    support: string;
    faq: string;
    terms: string;
    privacy: string;
    rights: string;
  };
}

const translations: LanguageDictionary = {
  ar: {
    live: 'النظام مفعل',
    heroTitle: 'منصة إنجازيا ULTRA MAX',
    heroDesc: 'الترسانة السحابية المتكاملة لرواد التجارة الإلكترونية، 16 أداة تغنيك عن كل الاشتراكات الأخرى.',
    runTool: 'تشغيل الأداة',
    footerDesc: 'المنصة السحابية الأولى لتمكين تجار التجارة الإلكترونية. أدوات ذكية، قرارات دقيقة، أرباح مضاعفة تغنيك عن جميع الاشتراكات الأخرى.',
    platform: 'المنصة',
    allTools: 'جميع الأدوات',
    updates: 'التحديثات الجديدة',
    pricing: 'أسعار الباقات',
    support: 'الدعم والمساعدة',
    faq: 'الأسئلة الشائعة',
    terms: 'شروط الاستخدام',
    privacy: 'سياسة الخصوصية',
    rights: 'جميع الحقوق محفوظة © 2026 منصة إنجازيا لتمكين التجارة الإلكترونية'
  },
  en: {
    live: 'System Active',
    heroTitle: 'ENGAZIA ULTRA MAX Platform',
    heroDesc: 'The ultimate cloud ecosystem for e-commerce entrepreneurs, 16 powerful tools replacing all other subscriptions.',
    runTool: 'Launch Tool',
    footerDesc: 'The premier cloud platform for e-commerce merchants. Smart tools, accurate decisions, and multiplied profits.',
    platform: 'Platform',
    allTools: 'All Tools',
    updates: 'New Updates',
    pricing: 'Pricing Plans',
    support: 'Support',
    faq: 'FAQ',
    terms: 'Terms of Use',
    privacy: 'Privacy Policy',
    rights: 'All rights reserved © 2026 Engazia Platform'
  },
  fr: {
    live: 'Système Actif',
    heroTitle: 'Plateforme ENGAZIA ULTRA MAX',
    heroDesc: 'L\'écosystème cloud ultime pour les e-commerçants, 16 outils puissants remplaçant tous les abonnements.',
    runTool: 'Lancer l\'outil',
    footerDesc: 'La première plateforme cloud pour dynamiser les marchands e-commerce.',
    platform: 'Plateforme',
    allTools: 'Tous les outils',
    updates: 'Mises à jour',
    pricing: 'Tarifs',
    support: 'Support',
    faq: 'FAQ',
    terms: 'Conditions d\'utilisation',
    privacy: 'Politique de confidentialité',
    rights: 'Tous droits réservés © 2026 Plateforme Engazia'
  }
};

export default function EngaziaHomeHub() {
  const [currentLang, setCurrentLang] = useState<string>('ar');
  const [currentCurrency, setCurrentCurrency] = useState<string>('SAR');
  const [licenseKeyInput, setLicenseKeyInput] = useState<string>('');
  const [isActivated, setIsActivated] = useState<boolean>(false);

  const LEMON_CHECKOUT_URL = 'https://enjazya.lemonsqueezy.com/checkout/buy/80ff492a-01eb-4455-b1a8-96e12ab72562';

  useEffect(() => {
    const savedLang = localStorage.getItem('engazia_global_lang');
    if (savedLang) setCurrentLang(savedLang);

    const savedCurr = localStorage.getItem('engazia_global_currency');
    if (savedCurr) setCurrentCurrency(savedCurr);

    const savedKey = localStorage.getItem('merchant_license_key');
    if (savedKey) {
      setLicenseKeyInput(savedKey);
      setIsActivated(true);
    }
  }, []);

  const handleLanguageChange = (lang: string) => {
    setCurrentLang(lang);
    localStorage.setItem('engazia_global_lang', lang);
  };

  const handleCurrencyChange = (curr: string) => {
    setCurrentCurrency(curr);
    localStorage.setItem('engazia_global_currency', curr);
  };

  const handleActivateLicense = () => {
    if (!licenseKeyInput.trim()) {
      alert('الرجاء إدخال مفتاح الاشتراك الصحيح.');
      return;
    }
    const cleanKey = licenseKeyInput.trim();
    localStorage.setItem('merchant_license_key', cleanKey);
    setIsActivated(true);
    alert('✨ تم تفعيل النظام والمزامنة السحابية بنجاح عبر كل الأدوات!');
  };

  const t = translations[currentLang] || translations.ar;

  const tools = [
    { id: 'whatsapp', title: currentLang === 'en' ? 'WhatsApp CRM & Sales' : 'إدارة عملاء واتساب والمبيعات', desc: currentLang === 'en' ? 'Manage abandoned carts, payment links, and VIP customers.' : 'إدارة السلال المتروكة، إرسال روابط الدفع، وتصنيف عملاء الـ VIP.', icon: '💬', link: '/hub/whatsapp' },
    { id: 'profit', title: currentLang === 'en' ? 'Profit & Break-even Calculator' : 'حاسبة أرباح ونقاط التعادل', desc: currentLang === 'en' ? 'Calculate exact net profits after ad and product costs.' : 'احسب صافي أرباح منتجك بدقة بعد خصم التكاليف والإعلانات.', icon: '📊', link: '/hub/profit' },
    { id: 'invoices', title: currentLang === 'en' ? 'Invoice & Receipt Generator' : 'مولد الفواتير وسندات القبض', desc: currentLang === 'en' ? 'Generate professional sales invoices instantly.' : 'أنشئ فواتير مبيعات نظامية واحترافية وجهزها للإرسال الفوري.', icon: '🧾', link: '/hub/invoices' },
    { id: 'returns', title: currentLang === 'en' ? 'Returns & Loss Analyzer' : 'حاسبة وتحليل خسائر المرتجعات', desc: currentLang === 'en' ? 'Measure return impact on monthly net profits.' : 'قس تأثير الاسترجاع والاستبدال على صافي أرباحك الشهرية.', icon: '🔄', link: '/hub/returns' },
    { id: 'expenses', title: currentLang === 'en' ? 'Expenses Manager' : 'مدير المصاريف والنفقات', desc: currentLang === 'en' ? 'Track fixed and variable store expenses.' : 'تتبع مصاريف المتجر الثابتة والمتغيرة لضبط التدفق النقدي.', icon: '💸', link: '/hub/expenses' },
    { id: 'legal', title: currentLang === 'en' ? 'Store Legal Policies Generator' : 'مولد السياسات القانونية للمتجر', desc: currentLang === 'en' ? 'Create compliant return and privacy policies.' : 'أنشئ صفحات الاستبدال، الاسترجاع، والخصوصية المتوافقة نظامياً.', icon: '⚖', link: '/hub/legal' },
    { id: 'roas', title: currentLang === 'en' ? 'Ad Spend ROAS Analyzer' : 'محلل عائد الإنفاق الإعلاني', desc: currentLang === 'en' ? 'Measure exact performance of your ad campaigns.' : 'قس بدقة أداء إعلانات سناب وتيك توك وهل هي رابحة أم خاسرة.', icon: '📈', link: '/hub/roas' },
    { id: 'fees', title: currentLang === 'en' ? 'Payment Gateway Fees Calculator' : 'حاسبة رسوم بوابات الدفع', desc: currentLang === 'en' ? 'Calculate gateway fees impact on profit margins.' : 'احسب نسبة بوابات الدفع (تاب، مدى، تابي) وتأثيرها على الأرباح.', icon: '💳', link: '/hub/fees' },
    { id: 'copy', title: currentLang === 'en' ? 'Marketing Copy & Ad Generator' : 'مولد النصوص التسويقية والإعلانات', desc: currentLang === 'en' ? 'Create TikTok scripts and converting ad copy.' : 'اصنع سكربتات تيك توك وإعلانات جذابة لزيادة مبيعات منتجاتك.', icon: '✍️', link: '/hub/copy' },
    { id: 'promos', title: currentLang === 'en' ? 'Discount Promos Manager' : 'ممول وأكواد خصم المتاجر', desc: currentLang === 'en' ? 'Manage and create instant discount codes.' : 'أدر وأنشئ أكواد الخصم السريعة لتحفيز العملاء المترددين.', icon: '🎟️', link: '/hub/promos' },
    { id: 'shipping', title: currentLang === 'en' ? 'Shipping & Delivery Tracker' : 'مدير تتبع الشحنات والتوصيل', desc: currentLang === 'en' ? 'Track shipments and resolve customer inquiries.' : 'تابع حالات الشحنات وحل مشاكل استفسارات العملاء اليومية.', icon: '📦', link: '/hub/shipping' },
    { id: 'scraper', title: currentLang === 'en' ? 'Excel Data Cleaner & Formatter' : 'تنسيق وتنظيف بيانات الإكسل', desc: currentLang === 'en' ? 'Clean product lists and pricing formats.' : 'نظف قوائم المنتجات والأسعار العشوائية وحولها لملفات مرتبة.', icon: '⚡', link: '/hub/scraper' },
    { id: 'links', title: currentLang === 'en' ? 'WhatsApp Direct Link Maker' : 'صانع روابط واتساب المباشرة', desc: currentLang === 'en' ? 'Create custom WhatsApp bio links.' : 'أنشئ روابط مخصصة برسائل جاهزة للبايو في تيك توك وإعلاناتك.', icon: '🔗', link: '/hub/links' },
    { id: 'reviews', title: currentLang === 'en' ? 'Customer Reviews Collector' : 'أداة طلب وتقييمات العملاء', desc: currentLang === 'en' ? 'Send automated post-delivery review requests.' : 'ارسل رسائل تلقائية للعملاء بعد الاستلام لجمع التقييمات وبناء الثقة.', icon: '⭐', link: '/hub/reviews' },
    { id: 'support', title: currentLang === 'en' ? 'Quick Support Templates' : 'ردود خدمة العملاء السريعة', desc: currentLang === 'en' ? 'Copy professional ready-made support replies.' : 'انسخ ردود احترافية جاهزة للرد على استفسارات العملاء المكررة.', icon: '🎧', link: '/hub/support' },
    { id: 'tips', title: currentLang === 'en' ? 'Store Growth Secrets Library' : 'مكتبة أسرار وحيل نمو المتاجر', desc: currentLang === 'en' ? 'Exclusive growth and conversion strategies.' : 'استراتيجيات حصرية لزيادة التحويل ورفع ولاء العملاء.', icon: '💡', link: '/hub/tips' }
  ];

  return (
    <div className="hub-container" style={{ direction: currentLang === 'ar' ? 'rtl' : 'ltr' }}>
      <style jsx global>{`
        a, .clean-link { text-decoration: none !important; color: inherit !important; }
      `}</style>
      
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        
        .hub-container { background-color: #f8fafc; min-height: 100vh; font-family: 'Tajawal', sans-serif; padding: 30px 20px 40px; }
        .navbar { max-width: 1250px; margin: 0 auto 35px; padding: 15px 30px; background: #ffffff; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); border: 1px solid #cbd5e1; flex-wrap: wrap; gap: 15px; }
        .brand { font-size: 22px; font-weight: 900; color: #0f172a; }
        .brand span { color: #4f46e5; }
        
        .nav-controls { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .select-control { padding: 6px 12px; border-radius: 8px; border: 1px solid #cbd5e1; background: #f8fafc; font-family: 'Tajawal', sans-serif; font-weight: 700; font-size: 13px; color: #1e293b; outline: none; cursor: pointer; }
        
        .license-box { display: flex; align-items: center; gap: 8px; background: #f8fafc; padding: 4px 10px; border-radius: 8px; border: 1px solid #cbd5e1; }
        .upgrade-btn { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: #fff !important; padding: 6px 12px; border-radius: 8px; font-weight: 800; font-size: 12px; text-decoration: none; display: inline-flex; align-items: center; gap: 5px; box-shadow: 0 4px 10px rgba(79,70,229,0.2); }
        
        .hero { text-align: center; max-width: 800px; margin: 0 auto 50px; }
        .hero h1 { font-size: 36px; font-weight: 900; color: #0f172a; margin-bottom: 15px; letter-spacing: -0.5px; }
        .hero h1 span { color: #4f46e5; }
        .hero p { color: #475569; font-size: 16px; line-height: 1.7; font-weight: 500; }

        .cards-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; max-width: 1250px; margin: 0 auto 60px; }
        
        .card { background: #ffffff; border-radius: 12px; padding: 24px; border: 2px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.02); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); display: flex; flex-direction: column; justify-content: space-between; position: relative; overflow: hidden; }
        
        .card:hover { transform: translateY(-5px); border-color: #4f46e5; box-shadow: 0 15px 30px -5px rgba(79, 70, 229, 0.15); z-index: 10; }

        .card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
        .card-icon { font-size: 28px; background: #f1f5f9; width: 55px; height: 55px; display: flex; align-items: center; justify-content: center; border-radius: 10px; transition: all 0.3s ease; }
        .card:hover .card-icon { background: #e0e7ff; }
        
        .card-badge { background: #f1f5f9; color: #475569; font-size: 14px; font-weight: 900; padding: 6px 14px; border-radius: 8px; }
        .card:hover .card-badge { color: #4f46e5; background: #e0e7ff; }

        .card h3 { font-size: 18px; font-weight: 900; color: #0f172a; margin-bottom: 10px; line-height: 1.4; transition: color 0.3s ease; }
        .card:hover h3 { color: #4f46e5; }
        
        .card p { color: #64748b; font-size: 14px; line-height: 1.6; font-weight: 500; margin-bottom: 24px; min-height: 48px; }
        
        .card-btn { background: #e0e7ff; color: #4f46e5; text-align: center; padding: 14px; border-radius: 8px; font-weight: 800; font-size: 14px; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .card:hover .card-btn { background: #4f46e5; color: #ffffff; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25); }

        .footer { max-width: 1250px; margin: 0 auto; background: #0f172a; border-radius: 16px; padding: 40px; color: #f8fafc; border: 1px solid #1e293b; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
        .footer-content { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 30px; margin-bottom: 30px; border-bottom: 1px solid #334155; padding-bottom: 30px; }
        .footer-brand { max-width: 400px; }
        .footer-brand h3 { font-size: 24px; font-weight: 900; margin-bottom: 15px; color: #ffffff; }
        .footer-brand h3 span { color: #818cf8; }
        .footer-brand p { color: #94a3b8; font-size: 14px; line-height: 1.8; font-weight: 500; }
        .footer-links { display: flex; gap: 60px; }
        .links-column h4 { color: #ffffff; font-size: 16px; font-weight: 800; margin-bottom: 20px; }
        .links-column ul { list-style: none; padding: 0; margin: 0; }
        .links-column ul li { margin-bottom: 12px; }
        .links-column ul li a { color: #94a3b8 !important; font-size: 14px; font-weight: 500; transition: color 0.2s ease; }
        .links-column ul li a:hover { color: #818cf8 !important; }
        .footer-bottom { text-align: center; color: #64748b; font-size: 14px; font-weight: 500; }

        @media(max-width: 1024px) { .cards-grid { grid-template-columns: repeat(2, 1fr); } .footer-content { flex-direction: column; } }
        @media(max-width: 640px) { .cards-grid { grid-template-columns: 1fr; } .hero h1 { font-size: 28px; } .footer-links { flex-direction: column; gap: 30px; } }
      `}</style>

      <div className="navbar">
        <div className="brand">إنجازيا <span>ENGAZIA</span></div>

        <div className="nav-controls">
          <select className="select-control" value={currentLang} onChange={(e) => handleLanguageChange(e.target.value)}>
            <option value="ar">العربية 🇸🇦</option>
            <option value="en">English 🇬🇧</option>
            <option value="fr">Français 🇫🇷</option>
          </select>

          <select className="select-control" value={currentCurrency} onChange={(e) => handleCurrencyChange(e.target.value)}>
            <option value="SAR">SAR (ر.س)</option>
            <option value="AED">AED (د.إ)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
          </select>

          <div className="license-box">
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#475569' }}>🔑 PRO:</span>
            {isActivated ? (
              <span style={{ fontSize: '11px', fontWeight: 900, color: '#10b981' }}>مفعل ✓</span>
            ) : (
              <>
                <input 
                  type="text" 
                  placeholder="مفتاح الترخيص..." 
                  value={licenseKeyInput} 
                  onChange={(e) => setLicenseKeyInput(e.target.value)}
                  style={{ border: '1px solid #cbd5e1', borderRadius: '4px', padding: '3px 6px', fontSize: '10px', outline: 'none', width: '90px', fontFamily: 'Tajawal, sans-serif' }}
                />
                <button 
                  onClick={handleActivateLicense}
                  style={{ background: '#4f46e5', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 800, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif' }}
                >
                  تفعيل
                </button>
              </>
            )}
          </div>

          <a href={LEMON_CHECKOUT_URL} target="_blank" rel="noopener noreferrer" className="upgrade-btn">
            ⚡ ترقية اشتراك
          </a>
        </div>
      </div>

      <div className="hero">
        <h1>{t.heroTitle}</h1>
        <p>{t.heroDesc}</p>
      </div>

      <div className="cards-grid">
        {tools.map((tool, index) => (
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
              <span>{t.runTool}</span>
              <span>{currentLang === 'ar' ? '←' : '→'}</span>
            </div>
          </Link>
        ))}
      </div>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>إنجازيا <span>ENGAZIA</span></h3>
            <p>{t.footerDesc}</p>
          </div>
          <div className="footer-links">
            <div className="links-column">
              <h4>{t.platform}</h4>
              <ul>
                <li><a href="#">{t.allTools}</a></li>
                <li><a href="#">{t.updates}</a></li>
                <li><a href="#">{t.pricing}</a></li>
              </ul>
            </div>
            <div className="links-column">
              <h4>{t.support}</h4>
              <ul>
                <li><a href="#">{t.support}</a></li>
                <li><a href="#">{t.faq}</a></li>
              </ul>
            </div>
            <div className="links-column">
              <h4>{t.terms}</h4>
              <ul>
                <li><a href="#">{t.terms}</a></li>
                <li><a href="#">{t.privacy}</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>{t.rights}</p>
        </div>
      </footer>
    </div>
  );
}
