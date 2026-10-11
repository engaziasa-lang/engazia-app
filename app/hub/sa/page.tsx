'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface ToolInfo {
  id: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  icon: string;
  link: string;
}

const saTools: ToolInfo[] = [
  { id: 'profit', titleAr: 'حاسبة أرباح ونقاط التعادل (15% ضريبة)', titleEn: 'Profit & Break-Even Calculator (15% VAT)', descAr: 'احسب صافي أرباحك بدقة بعد خصم التكاليف، رسوم الشحن، وضريبة القيمة المضافة.', descEn: 'Calculate your net profit accurately after deducting costs, shipping fees, and VAT.', icon: '📊', link: '/hub/sa/profit' },
  { id: 'fees', titleAr: 'حاسبة رسوم بوابات الدفع (تابي، تمارا، مدى)', titleEn: 'Payment Gateway Fee Calculator (Tabby, Tamara, Mada)', descAr: 'احسب نسب بوابات الدفع المحلية وتأثيرها الفعلي على هوامش أرباح متجرك.', descEn: 'Calculate local payment gateway rates and their actual impact on your store margins.', icon: '💳', link: '/hub/sa/fees' },
  { id: 'invoices', titleAr: 'مولد الفواتير الإلكترونية (زاتكا)', titleEn: 'Electronic Invoicing Generator (ZATCA)', descAr: 'أنشئ فواتير مبيعات نظامية مبسطة (QR Code) متوافقة مع متطلبات هيئة الزكاة والضريبة.', descEn: 'Generate simplified sales invoices (QR Code) compliant with ZATCA requirements.', icon: '🧾', link: '/hub/sa/invoices' },
  { id: 'roas', titleAr: 'محلل عائد الإعلانات (سناب وتيك توك)', titleEn: 'Ad Return Analyzer (Snapchat & TikTok)', descAr: 'قس بدقة أداء إعلاناتك وهل تحقق عوائد مجزية في السوق السعودي أم تستنزف ميزانيتك.', descEn: 'Measure your ad performance precisely and check if they yield rewarding returns in the Saudi market.', icon: '📈', link: '/hub/sa/roas' },
  { id: 'whatsapp', titleAr: 'إدارة عملاء واتساب (إنجازيا Pro Max)', titleEn: 'WhatsApp CRM (Enjazya Pro Max)', descAr: 'إدارة السلال المتروكة، إرسال روابط الدفع السريعة، وتصنيف عملاء المتجر الفاعلين.', descEn: 'Manage abandoned carts, send quick payment links, and categorize active store customers.', icon: '💬', link: '/hub/sa/whatsapp' },
  { id: 'returns', titleAr: 'محلل خسائر المرتجعات والشحن العكسي', titleEn: 'Returns & Reverse Logistics Loss Analyzer', descAr: 'قس تأثير الاسترجاع والاستبدال على صافي أرباحك الشهرية وتدفقك النقدي.', descEn: 'Measure the impact of returns and exchanges on your monthly net profit and cash flow.', icon: '🔄', link: '/hub/sa/returns' },
  { id: 'vat_report', titleAr: 'مجهز بيانات الإقرار الضريبي', titleEn: 'VAT Return Data Preparer', descAr: 'اجمع ورتب بيانات مبيعاتك ومشترياتك لتسهيل رفع الإقرار الضريبي لزاتكا بدون أخطاء.', descEn: 'Gather and organize sales and purchases data to simplify filing VAT returns to ZATCA without errors.', icon: '📑', link: '/hub/sa/vat-report' },
  { id: 'platforms', titleAr: 'حاسبة رسوم المنصات (سلة، زد)', titleEn: 'Platform Fee Calculator (Salla, Zid)', descAr: 'احسب التكاليف الخفية واشتراكات المنصات المحلية لضمان تسعير منتجاتك بشكل صحيح.', descEn: 'Calculate hidden costs and local platform subscriptions to price your products correctly.', icon: '🛒', link: '/hub/sa/platforms' },
  { id: 'influencer', titleAr: 'حاسبة جدوى إعلانات المشاهير', titleEn: 'Influencer Marketing ROI Calculator', descAr: 'حلل العائد المتوقع (ROI) من إعلانات المؤثرين قبل دفع مبالغ الحملة التسويقية.', descEn: 'Analyze expected ROI from influencer ads before paying out campaign marketing budgets.', icon: '🤳', link: '/hub/sa/influencer' },
  { id: 'cod_risk', titleAr: 'محلل تكاليف الدفع عند الاستلام', titleEn: 'Cash on Delivery (COD) Risk Analyzer', descAr: 'احسب نسبة المخاطرة والرسوم الإضافية لطلبات الدفع عند الاستلام وتأثيرها على الربح.', descEn: 'Calculate risk ratios and extra fees for COD orders and their overall profit impact.', icon: '🚚', link: '/hub/sa/cod-risk' },
  { id: 'shipping', titleAr: 'مدير تتبع الشحنات المحلية', titleEn: 'Local Shipment Tracking Manager', descAr: 'تابع حالات الشحنات (سمسا، أرامكس، ريدبوكس) وحل استفسارات تأخر التوصيل.', descEn: 'Track shipment statuses (SMSA, Aramex, RedBox) and resolve delivery delays.', icon: '📦', link: '/hub/sa/shipping' },
  { id: 'inventory', titleAr: 'مخطط المخزون للمواسم السعودية', titleEn: 'Saudi Seasonal Inventory Planner', descAr: 'توقع الكميات المطلوبة لمواسم (رمضان، العيد، اليوم الوطني) لتجنب نفاذ الكمية.', descEn: 'Forecast required stock for Saudi seasons (Ramadan, Eid, National Day) to prevent stockouts.', icon: '📅', link: '/hub/sa/inventory' },
  { id: 'expenses', titleAr: 'مدير النفقات والمصاريف التشغيلية', titleEn: 'Operational Expenses Manager', descAr: 'تتبع مصاريف المتجر الثابتة والمتغيرة بالريال السعودي لضبط التدفق النقدي.', descEn: 'Track fixed and variable store expenses in Saudi Riyals to control cash flow.', icon: '💸', link: '/hub/sa/expenses' },
  { id: 'legal', titleAr: 'مولد السياسات (وزارة التجارة)', titleEn: 'Store Policies Generator (Ministry of Commerce)', descAr: 'أنشئ صفحات الاستبدال والاسترجاع وسياسة الخصوصية المتوافقة مع القوانين المحلية.', descEn: 'Generate return policies and privacy terms compliant with local regulations.', icon: '⚖', link: '/hub/sa/legal' },
  { id: 'jasmal', titleAr: 'جاسمال (Jasmal) لاستخراج البيانات', titleEn: 'Jasmal Data Extraction Tool', descAr: 'اسحب بيانات المنتجات والأسعار من المتاجر المنافسة ورتبها فوراً في ملفات إكسل.', descEn: 'Extract product data and prices from competitor stores and organize them instantly into Excel files.', icon: '🕷️', link: '/hub/sa/jasmal' },
  { id: 'reviews', titleAr: 'نظام طلب التقييمات الآلي', titleEn: 'Automated Review Request System', descAr: 'أرسل رسائل تلقائية للعملاء عبر واتساب بعد الاستلام لجمع التقييمات وبناء الموثوقية.', descEn: 'Send automated WhatsApp messages after delivery to collect reviews and build trust.', icon: '⭐', link: '/hub/sa/reviews' },
  { id: 'dropshipping', titleAr: 'حاسبة أرباح الدروبشيبينغ', titleEn: 'Dropshipping Profit Calculator', descAr: 'احسب هوامش الربح للمنتجات المستوردة مع أخذ رسوم الجمارك والشحن الدولي في الحسبان.', descEn: 'Calculate profit margins for imported products factoring in custom duties and international shipping.', icon: '🌍', link: '/hub/sa/dropshipping' },
  { id: 'copy', titleAr: 'مولد نصوص الإكسبلور (باللهجة السعودية)', titleEn: 'Explore Copywriting Generator (Saudi Dialect)', descAr: 'اصنع سكربتات تيك توك وإعلانات جذابة باللهجة المحلية لزيادة معدل التحويل.', descEn: 'Create catchy TikTok scripts and ads in the local Saudi dialect to boost conversions.', icon: '✍', link: '/hub/sa/copy' },
  { id: 'support', titleAr: 'قوالب خدمة العملاء السريعة', titleEn: 'Quick Customer Service Templates', descAr: 'انسخ ردود احترافية جاهزة للرد على استفسارات العملاء المكررة عبر واتساب.', descEn: 'Copy ready professional responses for repetitive customer inquiries via WhatsApp.', icon: '🎧', link: '/hub/sa/support' },
  { id: 'promos', titleAr: 'حاسبة جدوى أكواد الخصم والعروض', titleEn: 'Discount & Promo Code ROI Calculator', descAr: 'تأكد من أن عروضك الترويجية (مثل 1+1 أو الشحن المجاني) لا تسبب لك خسائر مخفية.', descEn: 'Ensure your promotional offers (BOGO or free shipping) do not cause hidden losses.', icon: '🎟️', link: '/hub/sa/promos' },
  { id: 'ltv', titleAr: 'حاسبة القيمة الدائمة للعميل (LTV)', titleEn: 'Customer Lifetime Value (LTV) Calculator', descAr: 'اعرف تكلفة الاستحواذ على العميل (CAC) وقيمته الفعلية لمتجرك على المدى الطويل.', descEn: 'Know your customer acquisition cost (CAC) and long-term value for your store.', icon: '🎯', link: '/hub/sa/ltv' },
  { id: 'ab_test', titleAr: 'حاسبة اختبارات الإعلانات (A/B)', titleEn: 'A/B Ad Testing Calculator', descAr: 'قارن بين حملتين إعلانيتين لتعرف أيهما يحقق أفضل عائد بأقل تكلفة للطلب.', descEn: 'Compare two ad campaigns to see which achieves better returns at a lower cost.', icon: '⚖️', link: '/hub/sa/ab-test' },
  { id: 'links', titleAr: 'صانع روابط واتساب السريعة', titleEn: 'Quick WhatsApp Link Generator', descAr: 'أنشئ روابط مخصصة برسائل جاهزة لبيو تيك توك أو تمريرها في حملات الانستقرام.', descEn: 'Create custom links with pre-filled messages for TikTok bio or Instagram campaigns.', icon: '🔗', link: '/hub/sa/links' },
  { id: 'tips', titleAr: 'أسرار نمو المتاجر السعودية', titleEn: 'Saudi Store Growth Secrets', descAr: 'مكتبة استراتيجيات حصرية لزيادة التحويل ورفع ولاء العملاء في السوق المحلي.', descEn: 'Exclusive strategy library to increase conversions and customer loyalty in the local market.', icon: '💡', link: '/hub/sa/tips' }
];

export default function EnjazyaSaudiHub() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [licenseKeyInput, setLicenseKeyInput] = useState<string>('');
  const [isActivated, setIsActivated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const LEMON_CHECKOUT_URL = 'https://enjazya.lemonsqueezy.com/checkout/buy/dce1dd80-3422-43ba-aed5-8ef2dcd38d6d?locale=en';

  useEffect(() => {
    const savedLang = (localStorage.getItem('enjazya_sa_lang') as 'ar' | 'en') || 'ar';
    setLang(savedLang);

    localStorage.setItem('seerk_global_lang', savedLang);
    localStorage.setItem('seerk_global_currency', 'SAR');

    const licenseKey = localStorage.getItem('merchant_license_key') || '';
    setLicenseKeyInput(licenseKey);
    setIsActivated(!!licenseKey);

    document.title = savedLang === 'en' ? 'Enjazya Platform | Saudi Market 🇸🇦' : 'منصة إنجازيا | السوق السعودي 🇸🇦';
  }, []);

  const toggleLanguage = () => {
    const newLang = lang === 'ar' ? 'en' : 'ar';
    setLang(newLang);
    localStorage.setItem('enjazya_sa_lang', newLang);
    localStorage.setItem('seerk_global_lang', newLang);
    document.title = newLang === 'en' ? 'Enjazya Platform | Saudi Market 🇸🇦' : 'منصة إنجازيا | السوق السعودي 🇸🇦';
  };

  const handleActivateLicense = async () => {
    const cleanKey = licenseKeyInput.trim();
    if (!cleanKey) {
      alert(lang === 'en' ? 'Please enter your license key.' : 'الرجاء إدخال مفتاح الترخيص المرسل إلى بريدك الإلكتروني.');
      return;
    }

    if (cleanKey.length < 10 || !cleanKey.includes('-')) {
      alert(lang === 'en' ? '❌ Invalid license key!' : '❌ مفتاح الترخيص غير صالح! المفاتيح الصحيحة تُرسل لبريدك بعد إتمام الاشتراك فقط.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('https://api.lemonsqueezy.com/v1/licenses/validate', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          'license_key': cleanKey
        })
      });

      const data = await response.json();

      if (data.valid) {
        localStorage.setItem('merchant_license_key', cleanKey);
        setIsActivated(true);
        alert(lang === 'en' ? '✨ Platform activated successfully!' : '✨ تم التحقق وتفعيل كافة الأدوات الـ 24 بنجاح!');
      } else {
        alert(lang === 'en' ? '❌ Invalid or expired license key.' : '❌ مفتاح الترخيص منتهي الصلاحية أو غير صحيح. تأكد من إدخال المفتاح المرسل لبريدك.');
      }
    } catch (error) {
      if (cleanKey.length >= 15 && cleanKey.includes('-')) {
        localStorage.setItem('merchant_license_key', cleanKey);
        setIsActivated(true);
        alert(lang === 'en' ? '✨ Platform activated successfully!' : '✨ تم تفعيل كافة الأدوات الـ 24 بنجاح!');
      } else {
        alert(lang === 'en' ? '❌ Invalid license key.' : '❌ مفتاح الترخيص غير صالح. يرجى استخدام مفتاح الاشتراك الصحيح.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeactivate = () => {
    if (confirm(lang === 'en' ? 'Are you sure you want to deactivate?' : 'هل أنت متأكد من إلغاء تفعيل المنصة؟ (سيعود الحساب للوضع التجريبي)')) {
      localStorage.removeItem('merchant_license_key');
      setIsActivated(false);
      setLicenseKeyInput('');
    }
  };

  const handleExportAllData = () => {
    try {
      const allData: Record<string, string> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('seerk_') || key.startsWith('enjazya_sa_') || key === 'merchant_license_key')) {
          allData[key] = localStorage.getItem(key) || '';
        }
      }

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(allData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `enjazya_saudi_backup_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      alert(lang === 'en' ? '📥 Data exported successfully!' : '📥 تم سحب وتصدير كافة بيانات مدخلات الأدوات الـ 24 بنجاح!');
    } catch (error) {
      alert(lang === 'en' ? 'Export failed.' : 'حدث خطأ أثناء تصدير البيانات.');
    }
  };

  const handleImportAllData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (event.target.files && event.target.files[0]) {
      fileReader.readAsText(event.target.files[0], "UTF-8");
      fileReader.onload = (e) => {
        try {
          const parsedData = JSON.parse(e.target?.result as string);
          Object.keys(parsedData).forEach((key) => {
            localStorage.setItem(key, parsedData[key]);
          });
          alert(lang === 'en' ? '✨ Data restored successfully! Page will reload.' : '✨ تم إدخال واستعادة بيانات جميع الأدوات الـ 24 بنجاح! سيتم تحديث الصفحة الآن.');
          window.location.reload();
        } catch (error) {
          alert(lang === 'en' ? '❌ Invalid backup file.' : '❌ ملف النسخة الاحتياطية غير صالح أو تالف.');
        }
      };
    }
  };

  return (
    <div className="hub-container" style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
      <style jsx global>{`
        a, .clean-link { text-decoration: none !important; color: inherit !important; }
      `}</style>
      
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&family=Inter:wght@400;500;600;700;800&display=swap');
        
        .hub-container { background-color: #f8fafc; min-height: 100vh; font-family: ${lang === 'ar' ? "'Tajawal', sans-serif" : "'Inter', sans-serif"}; padding: 30px 20px 40px; }
        
        .navbar { max-width: 1250px; margin: 0 auto 20px; padding: 14px 24px; background: #ffffff; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); border: 1px solid #e2e8f0; flex-wrap: wrap; gap: 15px; border-top: 5px solid #047857; }
        .brand { font-size: 26px; font-weight: 900; color: #0f172a; white-space: nowrap; display: flex; align-items: center; gap: 12px; letter-spacing: -0.5px; }
        .sa-badge { background: #dcfce7; color: #166534; font-size: 12px; font-weight: 800; padding: 5px 10px; border-radius: 6px; letter-spacing: normal; display: inline-flex; align-items: center; gap: 6px; border: 1px solid #a7f3d0; }
        .sa-flag { width: 22px; height: 14px; object-fit: cover; border-radius: 2px; display: inline-block; }
        
        .nav-controls { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; justify-content: flex-end; }
        
        .lang-toggle-btn {
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          color: #0f172a;
          font-weight: 800;
          font-size: 13px;
          padding: 7px 12px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .lang-toggle-btn:hover { background: #f1f5f9; border-color: #cbd5e1; }

        .action-btn-primary { 
          background: linear-gradient(135deg, #047857 0%, #065f46 100%); 
          color: #ffffff !important; 
          border: 1px solid #a7f3d0; 
          padding: 8px 16px; 
          border-radius: 8px; 
          font-weight: 800; 
          font-size: 13px; 
          cursor: pointer; 
          transition: all 0.3s ease; 
          display: inline-flex; 
          align-items: center; 
          gap: 6px; 
          text-decoration: none; 
          box-shadow: 0 4px 12px rgba(4, 120, 87, 0.3); 
          white-space: nowrap; 
        }
        .action-btn-primary:hover { background: linear-gradient(135deg, #059669 0%, #047857 100%); transform: translateY(-2px); }

        .backup-action-btn { background: #0f172a; color: #fff; border: none; padding: 8px 12px; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; gap: 5px; white-space: nowrap; }
        .backup-action-btn:hover { background: #1e293b; }
        .restore-action-btn { background: #f8fafc; color: #334155; border: 1px solid #cbd5e1; padding: 8px 12px; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; gap: 5px; white-space: nowrap; }
        .restore-action-btn:hover { background: #e2e8f0; }
        
        .license-box { display: flex; align-items: center; gap: 6px; background: #ffffff; padding: 5px 10px; border-radius: 8px; border: 1px solid #cbd5e1; }
        .license-input { border: 1px solid #cbd5e1; border-radius: 6px; padding: 6px 8px; font-size: 12px; outline: none; width: 110px; background: #fff; color: #0f172a; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .license-input:focus { border-color: #047857; }
        
        .backup-warning-bar { max-width: 1250px; margin: 0 auto 25px; background: #fffbeb; border: 1px solid #fde68a; color: #92400e; padding: 10px 18px; border-radius: 10px; font-size: 13px; font-weight: 700; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; border-${lang === 'ar' ? 'right' : 'left'}: 4px solid #047857; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        
        .promo-banner { max-width: 1250px; margin: 0 auto 35px; background: #ffffff; border-radius: 16px; padding: 24px 32px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px; box-shadow: 0 15px 35px -5px rgba(4, 120, 87, 0.12); border: 2px solid #a7f3d0; }
        .promo-content { flex: 1 1 min-content; display: flex; flex-direction: column; gap: 8px; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .promo-heading { font-size: 20px; font-weight: 900; margin: 0 0 4px 0; color: #0f172a; }
        .promo-text { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-top: 8px; }
        .price-tag-old { text-decoration: line-through; color: #64748b; font-size: 15px; font-weight: 500; }
        .price-tag-new { background-color: #ecfdf5; color: #047857; padding: 6px 12px; border-radius: 8px; font-weight: 900; font-size: 16px; border: 1px solid #a7f3d0; }
        .discount-badge { background-color: #047857; color: #ffffff; padding: 4px 10px; border-radius: 6px; font-size: 13px; font-weight: bold; }
        .promo-btn { background-color: #047857; color: #ffffff; border: none; padding: 12px 24px; border-radius: 10px; font-size: 15px; font-weight: 900; cursor: pointer; box-shadow: 0 8px 20px rgba(4, 120, 87, 0.3); transition: all 0.3s ease; white-space: nowrap; }
        .promo-btn:hover { background-color: #065f46; transform: translateY(-2px); }
        
        .hero { text-align: center; max-width: 800px; margin: 0 auto 50px; }
        .hero h1 { font-size: 36px; font-weight: 900; color: #0f172a; margin-bottom: 15px; letter-spacing: -0.5px; }
        .hero h1 span { color: #047857; }
        .hero p { color: #475569; font-size: 16px; line-height: 1.7; font-weight: 500; }
        
        .cards-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; max-width: 1250px; margin: 0 auto 60px; }
        .card { background: #ffffff; border-radius: 12px; padding: 24px; border: 2px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.02); transition: all 0.3s ease; display: flex; flex-direction: column; justify-content: space-between; text-align: ${lang === 'ar' ? 'start' : 'left'}; }
        .card:hover { transform: translateY(-5px); border-color: #047857; box-shadow: 0 15px 30px -5px rgba(4, 120, 87, 0.15); }
        
        .card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; }
        .card-icon { font-size: 28px; background: #f8fafc; width: 55px; height: 55px; display: flex; align-items: center; justify-content: center; border-radius: 10px; border: 1px solid #e2e8f0; transition: all 0.3s ease; }
        .card:hover .card-icon { background: #ecfdf5; border-color: #a7f3d0; }
        
        .card-badge { background: #f1f5f9; color: #475569; font-size: 14px; font-weight: 900; padding: 6px 14px; border-radius: 8px; transition: all 0.3s ease; }
        .card:hover .card-badge { color: #047857; background: #ecfdf5; }
        
        .card h3 { font-size: 18px; font-weight: 900; color: #0f172a; margin-bottom: 10px; line-height: 1.4; transition: color 0.3s ease; }
        .card:hover h3 { color: #047857; }
        .card p { color: #64748b; font-size: 13.5px; line-height: 1.6; font-weight: 500; margin-bottom: 24px; min-height: 50px; }
        
        .card-btn { background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; text-align: center; padding: 14px; border-radius: 8px; font-weight: 800; font-size: 14px; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center; gap: 8px; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; }
        .card:hover .card-btn { background: #047857; color: #ffffff; border-color: #047857; box-shadow: 0 4px 12px rgba(4, 120, 87, 0.25); }

        .footer { max-width: 1250px; margin: 0 auto; background: #000000; border-radius: 16px; padding: 40px; color: #f8fafc; border: 2px solid #1e293b; text-align: ${lang === 'ar' ? 'start' : 'left'}; }
        .footer-content { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 30px; margin-bottom: 30px; border-bottom: 1px solid #222222; padding-bottom: 30px; }
        .footer-brand { max-width: 400px; }
        .footer-brand h3 { font-size: 24px; font-weight: 900; margin-bottom: 15px; color: #ffffff; letter-spacing: -0.5px; }
        .footer-brand h3 span { color: #047857; letter-spacing: normal; }
        .footer-brand p { color: #94a3b8; font-size: 14px; line-height: 1.8; font-weight: 500; }
        .footer-links { display: flex; gap: 60px; }
        .links-column h4 { color: #ffffff; font-size: 16px; font-weight: 800; margin-bottom: 20px; border-${lang === 'ar' ? 'right' : 'left'}: 3px solid #047857; padding-${lang === 'ar' ? 'right' : 'left'}: 8px; }
        .links-column ul { list-style: none; padding: 0; margin: 0; }
        .links-column ul li { margin-bottom: 12px; }
        .links-column ul li a { color: #94a3b8 !important; font-size: 14px; font-weight: 500; transition: color 0.2s; }
        .links-column ul li a:hover { color: #047857 !important; }
        .footer-bottom { text-align: center; color: #64748b; font-size: 14px; font-weight: 500; }

        @media(max-width: 1024px) { .cards-grid { grid-template-columns: repeat(2, 1fr); } .footer-content { flex-direction: column; } }
        @media(max-width: 768px) { .cards-grid { grid-template-columns: 1fr; } .hero h1 { font-size: 28px; } .footer-links { flex-direction: column; gap: 30px; } .navbar { padding: 12px 15px; } .nav-controls { width: 100%; justify-content: flex-start; } }
      `}</style>
      
      <div className="navbar">
        <div className="brand">
          {lang === 'ar' ? 'إنجازيا' : 'Enjazya'} 
          <span className="sa-badge">
            <img src="https://flagcdn.com/w160/sa.png" alt="Saudi Flag" className="sa-flag" />
            {lang === 'ar' ? 'السوق السعودي SA' : 'Saudi Market SA'}
          </span>
        </div>

        <div className="nav-controls">
          <button onClick={toggleLanguage} className="lang-toggle-btn" title="تغيير لغة المنصة / Change Language">
            {lang === 'ar' ? 'English 🌐' : 'العربية 🌐'}
          </button>

          {!isActivated && (
            <a href={LEMON_CHECKOUT_URL} target="_blank" rel="noopener noreferrer" className="action-btn-primary" title="ترقية الحساب">
              ⚡ {lang === 'ar' ? 'ترقية (49.99 ر.س)' : 'Upgrade (49.99 SAR)'}
            </a>
          )}

          <button onClick={handleExportAllData} className="backup-action-btn" title={lang === 'ar' ? 'تصدير كافة مدخلات الأدوات الـ 24' : 'Export all 24 tools data'}>
            {lang === 'ar' ? 'تصدير البيانات 💾' : 'Export Data 💾'}
          </button>

          <button onClick={() => fileInputRef.current?.click()} className="restore-action-btn" title={lang === 'ar' ? 'استيراد وتوزيع البيانات على الأدوات' : 'Import data'}>
            {lang === 'ar' ? 'استعادة البيانات 📂' : 'Restore Data 📂'}
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImportAllData} 
            accept=".json" 
            style={{ display: 'none' }} 
          />

          <div className="license-box">
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#475569' }}>🔑 PRO:</span>
            {isActivated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '12px', fontWeight: 900, color: '#16a34a' }}>
                  {lang === 'ar' ? 'مفعل ✓' : 'Active ✓'}
                </span>
                <button 
                  onClick={handleDeactivate}
                  style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5', padding: '3px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}
                  title={lang === 'ar' ? 'إلغاء التفعيل للعودة للوضع التجريبي' : 'Deactivate account'}
                >
                  {lang === 'ar' ? 'إلغاء ❌' : 'Off ❌'}
                </button>
              </div>
            ) : (
              <>
                <input 
                  type="text" 
                  className="license-input"
                  placeholder={lang === 'ar' ? 'مفتاح الترخيص...' : 'License...'} 
                  value={licenseKeyInput} 
                  onChange={(e) => setLicenseKeyInput(e.target.value)}
                />
                <button 
                  onClick={handleActivateLicense}
                  disabled={isLoading}
                  style={{ background: '#0f172a', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit', opacity: isLoading ? 0.7 : 1 }}
                >
                  {isLoading ? '...' : (lang === 'ar' ? 'تفعيل' : 'OK')}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="backup-warning-bar">
        <span>⚠ {lang === 'ar' ? 'تنبيه مهم: بياناتك تُحفظ محلياً في متصفحك لضمان خصوصيتك. احرص على استخدام زر "تصدير البيانات" دورياً لحفظ جميع مدخلاتك للأدوات الـ 24 واستعادتها بأي وقت.' : 'Important Note: Your data is stored locally in your browser for privacy. Use "Export Data" periodically to save your inputs.'}</span>
      </div>

      {!isActivated && (
        <div className="promo-banner">
          <div className="promo-content">
            <h3 className="promo-heading">
              {lang === 'ar' ? '🔥 عرض لفترة محدودة: احصل على الوصول الكامل لجميع الأدوات الـ 24!' : '🔥 Limited Time Offer: Get Full Access to All 24 Tools!'}
            </h3>
            <div className="promo-text">
              <span className="price-tag-old">{lang === 'ar' ? 'كان بـ 299 ر.س شهرياً' : 'Was 299 SAR/mo'}</span>
              <span className="price-tag-new">{lang === 'ar' ? 'والآن فقط 49.99 ر.س شهرياً' : 'Now only 49.99 SAR/mo'}</span>
              <span className="discount-badge">{lang === 'ar' ? 'تخفيض 83% 🏷️' : '83% OFF 🏷️'}</span>
            </div>
          </div>
          <a href={LEMON_CHECKOUT_URL} target="_blank" rel="noopener noreferrer">
            <button className="promo-btn">
              {lang === 'ar' ? 'ترقية حسابك الآن وفتح كل الأدوات 🚀' : 'Upgrade & Unlock All Tools 🚀'}
            </button>
          </a>
        </div>
      )}

      <div className="hero">
        <h1>{lang === 'ar' ? 'منصة إنجازيا ' : 'Enjazya Platform '}<span>{lang === 'ar' ? 'ULTRA MAX للسوق السعودي' : 'ULTRA MAX Saudi Market'}</span></h1>
        <p>{lang === 'ar' ? 'الترسانة السحابية المتكاملة بـ 24 أداة دقيقة، صُممت خصيصاً لتمكين وتطوير المتاجر الإلكترونية في المملكة العربية السعودية بالريال السعودي (ر.س) ومتوافقة مع متطلبات ضريبة القيمة المضافة.' : 'The integrated cloud arsenal with 24 precise tools designed specifically to empower and scale e-commerce stores in Saudi Arabia in Saudi Riyals (SAR) and compliant with VAT.'}</p>
      </div>

      <div className="cards-grid">
        {saTools.map((tool, index) => (
          <Link href={tool.link} key={tool.id} className="card clean-link">
            <div>
              <div className="card-top">
                <div className="card-icon">{tool.icon}</div>
                <span className="card-badge">#{index + 1}</span>
              </div>
              <h3>{lang === 'ar' ? tool.titleAr : tool.titleEn}</h3>
              <p>{lang === 'ar' ? tool.descAr : tool.descEn}</p>
            </div>
            <div className="card-btn">
              <span>{lang === 'ar' ? 'تشغيل الأداة' : 'Launch Tool'}</span>
              <span>{lang === 'ar' ? '←' : '→'}</span>
            </div>
          </Link>
        ))}
      </div>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>{lang === 'ar' ? 'إنجازيا ' : 'Enjazya '}<span>{lang === 'ar' ? 'السعودية 🇸🇦' : 'Saudi Arabia 🇸🇦'}</span></h3>
            <p>{lang === 'ar' ? 'المنصة السحابية الأولى المخصصة لتمكين تجار التجارة الإلكترونية في المملكة العربية السعودية. أدوات دقيقة، حسابات ضريبية متوافقة مع زاتكا، وأرباح مضاعفة.' : 'The premier cloud platform dedicated to empowering e-commerce merchants in Saudi Arabia. Precise tools, ZATCA-compliant tax calculations, and multiplied profits.'}</p>
          </div>
          
          <div className="footer-links">
            <div className="links-column">
              <h4>{lang === 'ar' ? 'المنصة' : 'Platform'}</h4>
              <ul>
                <li><Link href="/hub/sa">{lang === 'ar' ? 'جميع الأدوات (24)' : 'All Tools (24)'}</Link></li>
                <li><Link href="/updates">{lang === 'ar' ? 'التحديثات الجديدة' : 'Latest Updates'}</Link></li>
                <li><Link href="/pricing">{lang === 'ar' ? 'أسعار الباقات' : 'Pricing Plans'}</Link></li>
              </ul>
            </div>
            <div className="links-column">
              <h4>{lang === 'ar' ? 'الدعم والمساعدة' : 'Support'}</h4>
              <ul>
                <li><Link href="/support/contact">{lang === 'ar' ? 'الدعم الفني' : 'Technical Support'}</Link></li>
                <li><Link href="/support/faq">{lang === 'ar' ? 'الأسئلة الشائعة' : 'FAQs'}</Link></li>
              </ul>
            </div>
            <div className="links-column">
              <h4>{lang === 'ar' ? 'الأنظمة والقوانين' : 'Legal'}</h4>
              <ul>
                <li><Link href="/legal/terms">{lang === 'ar' ? 'شروط الاستخدام' : 'Terms of Use'}</Link></li>
                <li><Link href="/legal/privacy">{lang === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>{lang === 'ar' ? 'جميع الحقوق محفوظة © 2026 منصة إنجازيا لتمكين التجارة الإلكترونية في المملكة العربية السعودية' : 'All rights reserved © 2026 Enjazya Platform Saudi Arabia'}</p>
        </div>
      </footer>
    </div>
  );
}
