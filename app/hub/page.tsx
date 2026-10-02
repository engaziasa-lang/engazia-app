'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const supportedLangs = ['ar', 'en', 'fr', 'es', 'tr', 'zh', 'de', 'id'];

const getInitialConfig = () => {
  if (typeof window === 'undefined') {
    return { lang: 'en', currency: 'USD', licenseKey: '', isActivated: false };
  }
  
  let storedLang = localStorage.getItem('engazia_global_lang');
  let storedCurrency = localStorage.getItem('engazia_global_currency');

  if (!storedLang) {
    const browserLang = navigator.language ? navigator.language.slice(0, 2).toLowerCase() : 'en';
    if (supportedLangs.includes(browserLang)) {
      storedLang = browserLang;
    } else {
      storedLang = 'en';
    }
    localStorage.setItem('engazia_global_lang', storedLang);
  }

  if (!storedCurrency) {
    if (storedLang === 'ar') {
      storedCurrency = 'SAR';
    } else if (storedLang === 'fr' || storedLang === 'de') {
      storedCurrency = 'EUR';
    } else if (storedLang === 'tr') {
      storedCurrency = 'TRY';
    } else {
      storedCurrency = 'USD';
    }
    localStorage.setItem('engazia_global_currency', storedCurrency);
  }

  const licenseKey = localStorage.getItem('merchant_license_key') || '';
  const isActivated = !!licenseKey;

  return { lang: storedLang, currency: storedCurrency, licenseKey, isActivated };
};

const setGlobalConfig = (lang: string, currency: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('engazia_global_lang', lang);
    localStorage.setItem('engazia_global_currency', currency);
  }
};

interface ToolInfo {
  id: string;
  title: string;
  desc: string;
  icon: string;
  link: string;
}

interface Translations {
  [key: string]: {
    brandName: string;
    live: string;
    activate: string;
    deactivate: string;
    keyPlaceholder: string;
    upgradeBtn: string;
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
    promoTitle: string;
    promoDesc: string;
    promoOld: string;
    promoPer: string;
    upgradeNowBtn: string;
    tools: ToolInfo[];
  };
}

const translations: Translations = {
  ar: {
    brandName: 'إنجازيا',
    live: 'النظام مفعل',
    activate: 'تفعيل',
    deactivate: 'إلغاء',
    keyPlaceholder: 'مفتاح الترخيص...',
    upgradeBtn: '⚡ ترقية اشتراك',
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
    rights: 'جميع الحقوق محفوظة © 2026 منصة إنجازيا لتمكين التجارة الإلكترونية',
    promoTitle: '🔥 عرض لفترة محدودة - احصل على النسخة الشاملة الآن!',
    promoDesc: 'اشترك اليوم مقابل',
    promoOld: 'بدلاً من',
    promoPer: 'شهرياً',
    upgradeNowBtn: '🚀 ترقية حسابك الآن بخصم 65%',
    tools: [
      { id: 'whatsapp', title: 'إدارة عملاء واتساب والمبيعات', desc: 'إدارة السلال المتروكة، إرسال روابط الدفع، وتصنيف عملاء الـ VIP.', icon: '💬', link: '/hub/whatsapp' },
      { id: 'profit', title: 'حاسبة أرباح ونقاط التعادل', desc: 'احسب صافي أرباح منتجك بدقة بعد خصم التكاليف والإعلانات.', icon: '📊', link: '/hub/profit' },
      { id: 'invoices', title: 'مولد الفواتير وسندات القبض', desc: 'أنشئ فواتير مبيعات نظامية واحترافية وجهزها للإرسال الفوري.', icon: '🧾', link: '/hub/invoices' },
      { id: 'returns', title: 'حاسبة وتحليل خسائر المرتجعات', desc: 'قس تأثير الاسترجاع والاستبدال على صافي أرباحك الشهرية.', icon: '🔄', link: '/hub/returns' },
      { id: 'expenses', title: 'مدير المصاريف والنفقات', desc: 'تتبع مصاريف المتجر الثابتة والمتغيرة لضبط التدفق النقدي.', icon: '💸', link: '/hub/expenses' },
      { id: 'legal', title: 'مولد السياسات القانونية للمتجر', desc: 'أنشئ صفحات الاستبدال، الاسترجاع، والخصوصية المتوافقة نظامياً.', icon: '⚖', link: '/hub/legal' },
      { id: 'roas', title: 'محلل عائد الإنفاق الإعلاني', desc: 'قس بدقة أداء إعلانات سناب وتيك توك وهل هي رابحة أم خاسرة.', icon: '📈', link: '/hub/roas' },
      { id: 'fees', title: 'حاسبة رسوم بوابات الدفع', desc: 'احسب نسبة بوابات الدفع (تاب، مدى، تابي) وتأثيرها على الأرباح.', icon: '💳', link: '/hub/fees' },
      { id: 'copy', title: 'مولد النصوص التسويقية والإعلانات', desc: 'اصنع سكربتات تيك توك وإعلانات جذابة لزيادة مبيعات منتجاتك.', icon: '✍️', link: '/hub/copy' },
      { id: 'promos', title: 'ممول وأكواد خصم المتاجر', desc: 'أدر وأنشئ أكواد الخصم السريعة لتحفيز العملاء المترددين.', icon: '🎟️', link: '/hub/promos' },
      { id: 'shipping', title: 'مدير تتبع الشحنات والتوصيل', desc: 'تابع حالات الشحنات وحل مشاكل استفسارات العملاء اليومية.', icon: '📦', link: '/hub/shipping' },
      { id: 'scraper', title: 'تنسيق وتنظيف بيانات الإكسل', desc: 'نظف قوائم المنتجات والأسعار العشوائية وحولها لملفات مرتبة.', icon: '⚡', link: '/hub/scraper' },
      { id: 'links', title: 'صانع روابط واتساب المباشرة', desc: 'أنشئ روابط مخصصة برسائل جاهزة للبايو في تيك توك وإعلاناتك.', icon: '🔗', link: '/hub/links' },
      { id: 'reviews', title: 'أداة طلب وتقييمات العملاء', desc: 'ارسل رسائل تلقائية للعملاء بعد الاستلام لجمع التقييمات وبناء الثقة.', icon: '⭐', link: '/hub/reviews' },
      { id: 'support', title: 'ردود خدمة العملاء السريعة', desc: 'انسخ ردود احترافية جاهزة للرد على استفسارات العملاء المكررة.', icon: '🎧', link: '/hub/support' },
      { id: 'tips', title: 'مكتبة أسرار وحيل نمو المتاجر', desc: 'استراتيجيات حصرية لزيادة التحويل ورفع ولاء العملاء.', icon: '💡', link: '/hub/tips' }
    ]
  },
  en: {
    brandName: 'Engazia',
    live: 'System Active',
    activate: 'Activate',
    deactivate: 'Reset',
    keyPlaceholder: 'License key...',
    upgradeBtn: '⚡ Upgrade Plan',
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
    rights: 'All rights reserved © 2026 Engazia Platform',
    promoTitle: '🔥 Limited Time Offer - Get Pro Access Now!',
    promoDesc: 'Subscribe today for',
    promoOld: 'instead of',
    promoPer: 'per month',
    upgradeNowBtn: '🚀 Upgrade Account with 65% Off',
    tools: [
      { id: 'whatsapp', title: 'WhatsApp CRM & Sales', desc: 'Manage abandoned carts, payment links, and VIP customers.', icon: '💬', link: '/hub/whatsapp' },
      { id: 'profit', title: 'Profit & Break-even Calculator', desc: 'Calculate exact net profits after ad and product costs.', icon: '📊', link: '/hub/profit' },
      { id: 'invoices', title: 'Invoice & Receipt Generator', desc: 'Generate professional sales invoices instantly.', icon: '🧾', link: '/hub/invoices' },
      { id: 'returns', title: 'Returns & Loss Analyzer', desc: 'Measure return impact on monthly net profits.', icon: '🔄', link: '/hub/returns' },
      { id: 'expenses', title: 'Expenses Manager', desc: 'Track fixed and variable store expenses.', icon: '💸', link: '/hub/expenses' },
      { id: 'legal', title: 'Store Legal Policies Generator', desc: 'Create compliant return and privacy policies.', icon: '⚖', link: '/hub/legal' },
      { id: 'roas', title: 'Ad Spend ROAS Analyzer', desc: 'Measure exact performance of your ad campaigns.', icon: '📈', link: '/hub/roas' },
      { id: 'fees', title: 'Payment Gateway Fees Calculator', desc: 'Calculate gateway fees impact on profit margins.', icon: '💳', link: '/hub/fees' },
      { id: 'copy', title: 'Marketing Copy & Ad Generator', desc: 'Create TikTok scripts and converting ad copy.', icon: '✍', link: '/hub/copy' },
      { id: 'promos', title: 'Discount Promos Manager', desc: 'Manage and create instant discount codes.', icon: '🎟️', link: '/hub/promos' },
      { id: 'shipping', title: 'Shipping & Delivery Tracker', desc: 'Track shipments and resolve customer inquiries.', icon: '📦', link: '/hub/shipping' },
      { id: 'scraper', title: 'Excel Data Cleaner & Formatter', desc: 'Clean product lists and pricing formats.', icon: '⚡', link: '/hub/scraper' },
      { id: 'links', title: 'WhatsApp Direct Link Maker', desc: 'Create custom WhatsApp bio links.', icon: '🔗', link: '/hub/links' },
      { id: 'reviews', title: 'Customer Reviews Collector', desc: 'Send automated post-delivery review requests.', icon: '⭐', link: '/hub/reviews' },
      { id: 'support', title: 'Quick Support Templates', desc: 'Copy professional ready-made support replies.', icon: '🎧', link: '/hub/support' },
      { id: 'tips', title: 'Store Growth Secrets Library', desc: 'Exclusive growth and conversion strategies.', icon: '💡', link: '/hub/tips' }
    ]
  }
};

export default function EngaziaHomeHub() {
  const [currentLang, setCurrentLang] = useState<string>('en');
  const [currentCurrency, setCurrentCurrency] = useState<string>('USD');
  const [licenseKeyInput, setLicenseKeyInput] = useState<string>('');
  const [isActivated, setIsActivated] = useState<boolean>(false);

  const LEMON_CHECKOUT_URL = 'https://enjazya.lemonsqueezy.com/checkout/buy/80ff492a-01eb-4455-b1a8-96e12ab72562';

  // تحويل العملات التلقائي
  const getConvertedPrice = (usdAmount: number) => {
    let rate = 3.75; // SAR
    let symbol = 'ر.س';
    
    if (currentCurrency === 'USD') { rate = 1; symbol = '$'; }
    else if (currentCurrency === 'AED') { rate = 3.67; symbol = 'د.إ'; }
    else if (currentCurrency === 'EUR') { rate = 0.92; symbol = '€'; }
    else if (currentCurrency === 'GBP') { rate = 0.79; symbol = '£'; }
    else if (currentCurrency === 'TRY') { rate = 32.5; symbol = '₺'; }
    else if (currentCurrency === 'KWD') { rate = 0.31; symbol = 'د.ك'; }
    else if (currentCurrency === 'QAR') { rate = 3.64; symbol = 'ر.ق'; }
    
    const converted = (usdAmount * rate).toFixed(2);
    return `${converted} ${symbol}`;
  };

  useEffect(() => {
    const config = getInitialConfig();
    setCurrentLang(config.lang);
    setCurrentCurrency(config.currency);
    setLicenseKeyInput(config.licenseKey);
    setIsActivated(config.isActivated);
  }, []);

  const handleLanguageChange = (lang: string) => {
    setCurrentLang(lang);
    setGlobalConfig(lang, currentCurrency);
  };

  const handleCurrencyChange = (curr: string) => {
    setCurrentCurrency(curr);
    setGlobalConfig(currentLang, curr);
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

  const handleDeactivateLicense = () => {
    localStorage.removeItem('merchant_license_key');
    setLicenseKeyInput('');
    setIsActivated(false);
    alert('⚠️ تم إلغاء تفعيل الاشتراك.');
  };

  const t = translations[currentLang] || translations.en;
  const isRtl = currentLang === 'ar';

  return (
    <div className="hub-container" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
      <style jsx global>{`
        a, .clean-link { text-decoration: none !important; color: inherit !important; }
      `}</style>
      
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        
        .hub-container { background-color: #f8fafc; min-height: 100vh; font-family: 'Tajawal', sans-serif; padding: 30px 20px 40px; }
        .navbar { max-width: 1250px; margin: 0 auto 25px; padding: 15px 30px; background: #ffffff; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); border: 1px solid #cbd5e1; flex-wrap: wrap; gap: 15px; }
        .brand { font-size: 22px; font-weight: 900; color: #0f172a; }
        .brand span { color: #4f46e5; }
        
        .nav-controls { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .select-control { padding: 6px 12px; border-radius: 8px; border: 1px solid #cbd5e1; background: #f8fafc; font-family: 'Tajawal', sans-serif; font-weight: 700; font-size: 13px; color: #1e293b; outline: none; cursor: pointer; }
        
        .license-box { display: flex; align-items: center; gap: 8px; background: #f8fafc; padding: 4px 10px; border-radius: 8px; border: 1px solid #cbd5e1; }
        .upgrade-btn { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: #fff !important; padding: 6px 12px; border-radius: 8px; font-weight: 800; font-size: 12px; text-decoration: none; display: inline-flex; align-items: center; gap: 5px; box-shadow: 0 4px 10px rgba(79,70,229,0.2); }
        
        /* إعلان الترقية الجذاب والمغري */
        .promo-banner { max-width: 1250px; margin: 0 auto 35px; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: #fff; border-radius: 16px; padding: 20px 30px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px; box-shadow: 0 10px 25px rgba(79,70,229,0.25); border: 1px solid rgba(255,255,255,0.2); position: relative; overflow: hidden; }
        .promo-banner::before { content: ''; position: absolute; top: -50px; right: -50px; width: 150px; height: 150px; background: rgba(255,255,255,0.1); border-radius: 50%; pointer-events: none; }
        .promo-content { display: flex; flex-direction: column; gap: 6px; }
        .promo-heading { font-size: 17px; font-weight: 900; display: flex; align-items: center; gap: 8px; }
        .promo-text { font-size: 13.5px; font-weight: 700; opacity: 0.95; display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
        .price-tag-new { background: #10b981; color: #fff; padding: 2px 8px; border-radius: 6px; font-weight: 900; font-size: 14px; }
        .price-tag-old { text-decoration: line-through; opacity: 0.8; font-size: 12px; font-weight: 800; }
        .promo-btn { background: #fff; color: #4f46e5; border: none; padding: 10px 22px; border-radius: 10px; font-weight: 900; font-size: 13.5px; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .promo-btn:hover { background: #f8fafc; transform: translateY(-2px); }

        .hero { text-align: center; max-width: 800px; margin: 0 auto 50px; }
        .hero h1 { font-size: 36px; font-weight: 900; color: #0f172a; margin-bottom: 15px; letter-spacing: -0.5px; }
        .hero h1 span { color: #4f46e5; }
        .hero p { color: #475569; font-size: 16px; line-height: 1.7; font-weight: 500; }

        .cards-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; max-width: 1250px; margin: 0 auto 60px; }
        
        .card { background: #ffffff; border-radius: 12px; padding: 24px; border: 2px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.02); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); display: flex; flex-direction: column; justify-content: space-between; position: relative; overflow: hidden; text-align: start; }
        
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

        .footer { max-width: 1250px; margin: 0 auto; background: #0f172a; border-radius: 16px; padding: 40px; color: #f8fafc; border: 1px solid #1e293b; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); text-align: start; }
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

      {/* شريط التحكم العلوي */}
      <div className="navbar">
        <div className="brand">{t.brandName}</div>

        <div className="nav-controls">
          <select className="select-control" value={currentLang} onChange={(e) => handleLanguageChange(e.target.value)}>
            <option value="ar">العربية 🇸🇦</option>
            <option value="en">English 🇬🇧</option>
            <option value="fr">Français 🇫🇷</option>
            <option value="es">Español 🇪🇸</option>
            <option value="tr">Türkçe 🇹🇷</option>
            <option value="zh">中文 🇨🇳</option>
            <option value="de">Deutsch 🇩🇪</option>
            <option value="id">Bahasa 🇮🇩</option>
          </select>

          <select className="select-control" value={currentCurrency} onChange={(e) => handleCurrencyChange(e.target.value)}>
            <option value="SAR">SAR (ر.س)</option>
            <option value="AED">AED (د.إ)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="TRY">TRY (₺)</option>
            <option value="KWD">KWD (د.ك)</option>
            <option value="QAR">QAR (ر.ق)</option>
          </select>

          <div className="license-box">
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#475569' }}>🔑 PRO:</span>
            {isActivated ? (
              <>
                <span style={{ fontSize: '11px', fontWeight: 900, color: '#10b981' }}>{t.live} ✓</span>
                <button 
                  onClick={handleDeactivateLicense}
                  style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '3px 6px', borderRadius: '4px', fontSize: '9px', fontWeight: 800, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif' }}
                  title="إلغاء التفعيل للاختبار"
                >
                  {t.deactivate}
                </button>
              </>
            ) : (
              <>
                <input 
                  type="text" 
                  placeholder={t.keyPlaceholder} 
                  value={licenseKeyInput} 
                  onChange={(e) => setLicenseKeyInput(e.target.value)}
                  style={{ border: '1px solid #cbd5e1', borderRadius: '4px', padding: '3px 6px', fontSize: '10px', outline: 'none', width: '80px', fontFamily: 'Tajawal, sans-serif' }}
                />
                <button 
                  onClick={handleActivateLicense}
                  style={{ background: '#4f46e5', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 800, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif' }}
                >
                  {t.activate}
                </button>
              </>
            )}
          </div>

          {!isActivated && (
            <a href={LEMON_CHECKOUT_URL} target="_blank" rel="noopener noreferrer" className="upgrade-btn">
              {t.upgradeBtn}
            </a>
          )}
        </div>
      </div>

      {/* إعلان الترقية المغري الظاهر أسفل الشريط العلوي مباشرة */}
      <div className="promo-banner">
        <div className="promo-content">
          <div className="promo-heading">{t.promoTitle}</div>
          <div className="promo-text">
            <span>{t.promoDesc}</span>
            <span className="price-tag-new">{getConvertedPrice(9.99)}</span>
            <span>{t.promoPer}</span>
            <span className="price-tag-old">({t.promoOld} {getConvertedPrice(29)})</span>
          </div>
        </div>
        <a href={LEMON_CHECKOUT_URL} target="_blank" rel="noopener noreferrer">
          <button className="promo-btn">
            {t.upgradeNowBtn}
          </button>
        </a>
      </div>

      <div className="hero">
        <h1>{t.heroTitle}</h1>
        <p>{t.heroDesc}</p>
      </div>

      <div className="cards-grid">
        {t.tools.map((tool, index) => (
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
              <span>{isRtl ? '←' : '→'}</span>
            </div>
          </Link>
        ))}
      </div>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>{t.brandName}</h3>
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
