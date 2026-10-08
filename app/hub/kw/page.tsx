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

const kwTools: ToolInfo[] = [
  { id: 'profit', titleAr: 'حاسبة أرباح ونقاط التعادل (بدون ضريبة)', titleEn: 'Profit & Break-Even Calculator (Tax-Free)', descAr: 'احسب صافي أرباحك بدقة بعد خصم التكاليف ورسوم الشحن بالدينار الكويتي.', descEn: 'Calculate your net profit accurately after deducting costs and shipping fees in KWD.', icon: '📊', link: '/hub/kw/profit' },
  { id: 'fees', titleAr: 'حاسبة بوابات الدفع (كي نت، تاب، ماي فاتورة)', titleEn: 'Gateway Fee Calculator (K-Net, Tap, MyFatoorah)', descAr: 'احسب نسب بوابات الدفع المحلية في الكويت وتأثيرها الفعلي على هوامش أرباح متجرك.', descEn: 'Calculate local Kuwaiti payment gateway rates and their actual impact on your margins.', icon: '💳', link: '/hub/kw/fees' },
  { id: 'invoices', titleAr: 'مولد الفواتير التجارية المعتمدة', titleEn: 'Commercial Invoice Generator', descAr: 'أنشئ فواتير مبيعات نظامية متوافقة مع متطلبات وزارة التجارة والصناعة الكويتية.', descEn: 'Generate formal sales invoices compliant with the Kuwaiti Ministry of Commerce & Industry.', icon: '🧾', link: '/hub/kw/invoices' },
  { id: 'roas', titleAr: 'محلل عائد الإعلانات (سناب وتيك توك)', titleEn: 'Ad Return Analyzer (Snapchat & TikTok)', descAr: 'قس بدقة أداء إعلاناتك وهل تحقق عوائد مجزية في السوق الكويتي أم تستنزف ميزانيتك.', descEn: 'Measure your ad performance precisely and check if they yield rewarding returns in Kuwait.', icon: '📈', link: '/hub/kw/roas' },
  { id: 'whatsapp', titleAr: 'إدارة عملاء واتساب (إنجازيا)', titleEn: 'WhatsApp CRM (Enjazya)', descAr: 'إدارة السلال المتروكة، إرسال روابط الدفع السريعة، وتصنيف عملاء المتجر الفاعلين.', descEn: 'Manage abandoned carts, send quick payment links, and categorize active store customers.', icon: '💬', link: '/hub/kw/whatsapp' },
  { id: 'returns', titleAr: 'محلل خسائر المرتجعات والشحن العكسي', titleEn: 'Returns & Reverse Logistics Loss Analyzer', descAr: 'قس تأثير الاسترجاع والاستبدال على صافي أرباحك الشهرية وتدفقك النقدي.', descEn: 'Measure the impact of returns and exchanges on your monthly net profit and cash flow.', icon: '🔄', link: '/hub/kw/returns' },
  { id: 'financial_report', titleAr: 'مجهز التقارير المالية والمبيعات', titleEn: 'Financial & Sales Report Preparer', descAr: 'اجمع ورتب بيانات مبيعاتك ومشترياتك لتسهيل المراجعة المالية لمتجرك الكويتي بدون أخطاء.', descEn: 'Organize your sales and purchases data for error-free financial bookkeeping.', icon: '📑', link: '/hub/kw/financial-report' },
  { id: 'platforms', titleAr: 'حاسبة رسوم المنصات (سلة، زد، شوبيفاي)', titleEn: 'Platform Fee Calculator (Salla, Zid, Shopify)', descAr: 'احسب التكاليف الخفية واشتراكات المنصات لضمان تسعير منتجاتك بشكل صحيح.', descEn: 'Calculate hidden costs and platform subscriptions to price your products correctly.', icon: '🛒', link: '/hub/kw/platforms' },
  { id: 'influencer', titleAr: 'حاسبة جدوى إعلانات المشاهير (الكويت)', titleEn: 'Influencer Marketing ROI Calculator', descAr: 'حلل العائد المتوقع (ROI) من إعلانات المؤثرين قبل دفع مبالغ الحملة التسويقية.', descEn: 'Analyze expected ROI from influencer ads before paying out campaign marketing budgets.', icon: '🤳', link: '/hub/kw/influencer' },
  { id: 'cod_risk', titleAr: 'محلل تكاليف الدفع عند الاستلام', titleEn: 'Cash on Delivery (COD) Risk Analyzer', descAr: 'احسب نسبة المخاطرة والرسوم الإضافية لطلبات الدفع عند الاستلام وتأثيرها على الربح.', descEn: 'Calculate risk ratios and extra fees for COD orders and their overall profit impact.', icon: '🚚', link: '/hub/kw/cod-risk' },
  { id: 'shipping', titleAr: 'مدير تتبع الشحنات المحلية', titleEn: 'Local Shipment Tracking Manager', descAr: 'تابع حالات الشحنات (بوستا بلس، أرامكس، مبادر) وحل استفسارات تأخر التوصيل.', descEn: 'Track shipment statuses (Posta Plus, Aramex, Mubaader) and resolve delivery delays.', icon: '📦', link: '/hub/kw/shipping' },
  { id: 'inventory', titleAr: 'مخطط المخزون للمواسم الكويتية', titleEn: 'Kuwaiti Seasonal Inventory Planner', descAr: 'توقع الكميات المطلوبة لمواسم (هلا فبراير، رمضان، العيد) لتجنب نفاذ الكمية.', descEn: 'Forecast required stock for Kuwaiti seasons (Hala February, Ramadan, Eid) to prevent stockouts.', icon: '📅', link: '/hub/kw/inventory' },
  { id: 'expenses', titleAr: 'مدير النفقات والمصاريف التشغيلية', titleEn: 'Operational Expenses Manager', descAr: 'تتبع مصاريف المتجر الثابتة والمتغيرة بالدينار الكويتي لضبط التدفق النقدي.', descEn: 'Track fixed and variable store expenses in Kuwaiti Dinars (KWD) to control cash flow.', icon: '💸', link: '/hub/kw/expenses' },
  { id: 'legal', titleAr: 'مولد السياسات (حماية المستهلك)', titleEn: 'Store Policies Generator (Consumer Protection)', descAr: 'أنشئ صفحات الاستبدال والاسترجاع وسياسة الخصوصية المتوافقة مع القوانين الكويتية.', descEn: 'Generate return policies and privacy terms compliant with local Kuwaiti regulations.', icon: '⚖', link: '/hub/kw/legal' },
  { id: 'jasmal', titleAr: 'جاسمال (Jasmal) لاستخراج البيانات', titleEn: 'Jasmal Data Extraction Tool', descAr: 'اسحب بيانات المنتجات والأسعار من المتاجر المنافسة ورتبها فوراً في ملفات إكسل.', descEn: 'Extract product data and prices from competitor stores and organize them instantly into Excel files.', icon: '🕷️', link: '/hub/kw/jasmal' },
  { id: 'reviews', titleAr: 'نظام طلب التقييمات الآلي', titleEn: 'Automated Review Request System', descAr: 'أرسل رسائل تلقائية للعملاء عبر واتساب بعد الاستلام لجمع التقييمات وبناء الموثوقية.', descEn: 'Send automated WhatsApp messages after delivery to collect reviews and build trust.', icon: '⭐', link: '/hub/kw/reviews' },
  { id: 'dropshipping', titleAr: 'حاسبة أرباح الدروبشيبينغ', titleEn: 'Dropshipping Profit Calculator', descAr: 'احسب هوامش الربح للمنتجات المستوردة مع أخذ رسوم الجمارك والشحن الدولي في الحسبان.', descEn: 'Calculate profit margins for imported products factoring in custom duties and international shipping.', icon: '🌍', link: '/hub/kw/dropshipping' },
  { id: 'copy', titleAr: 'مولد نصوص الإكسبلور (باللهجة الكويتية)', titleEn: 'Explore Copywriting Generator (Kuwaiti Dialect)', descAr: 'اصنع سكربتات تيك توك وإعلانات جذابة باللهجة المحلية لزيادة معدل التحويل.', descEn: 'Create catchy TikTok scripts and ads in the local Kuwaiti dialect to boost conversions.', icon: '✍', link: '/hub/kw/copy' },
  { id: 'support', titleAr: 'قوالب خدمة العملاء السريعة', titleEn: 'Quick Customer Service Templates', descAr: 'انسخ ردود احترافية جاهزة للرد على استفسارات العملاء المكررة عبر واتساب.', descEn: 'Copy ready professional responses for repetitive customer inquiries via WhatsApp.', icon: '🎧', link: '/hub/kw/support' },
  { id: 'promos', titleAr: 'حاسبة جدوى أكواد الخصم والعروض', titleEn: 'Discount & Promo Code ROI Calculator', descAr: 'تأكد من أن عروضك الترويجية (مثل 1+1 أو الشحن المجاني) لا تسبب لك خسائر مخفية.', descEn: 'Ensure your promotional offers (BOGO or free shipping) do not cause hidden losses.', icon: '🎟️', link: '/hub/kw/promos' },
  { id: 'ltv', titleAr: 'حاسبة القيمة الدائمة للعميل (LTV)', titleEn: 'Customer Lifetime Value (LTV) Calculator', descAr: 'اعرف تكلفة الاستحواذ على العميل (CAC) وقيمته الفعلية لمتجرك على المدى الطويل.', descEn: 'Know your customer acquisition cost (CAC) and long-term value for your store.', icon: '🎯', link: '/hub/kw/ltv' },
  { id: 'ab_test', titleAr: 'حاسبة اختبارات الإعلانات (A/B)', titleEn: 'A/B Ad Testing Calculator', descAr: 'قارن بين حملتين إعلانيتين لتعرف أيهما يحقق أفضل عائد بأقل تكلفة للطلب.', descEn: 'Compare two ad campaigns to see which achieves better returns at a lower cost.', icon: '⚖️', link: '/hub/kw/ab-test' },
  { id: 'links', titleAr: 'صانع روابط واتساب السريعة', titleEn: 'Quick WhatsApp Link Generator', descAr: 'أنشئ روابط مخصصة برسائل جاهزة لبيو تيك توك أو تمريرها في حملات الانستقرام.', descEn: 'Create custom links with pre-filled messages for TikTok bio or Instagram campaigns.', icon: '🔗', link: '/hub/kw/links' },
  { id: 'tips', titleAr: 'أسرار نمو المتاجر الكويتية', titleEn: 'Kuwaiti Store Growth Secrets', descAr: 'مكتبة استراتيجيات حصرية لزيادة التحويل ورفع ولاء العملاء في السوق الكويتي.', descEn: 'Exclusive strategy library to increase conversions and customer loyalty in the local market.', icon: '💡', link: '/hub/kw/tips' }
];

export default function EnjazyaKuwaitHub() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [licenseKeyInput, setLicenseKeyInput] = useState<string>('');
  const [isActivated, setIsActivated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const LEMON_CHECKOUT_URL = 'https://enjazya.lemonsqueezy.com/checkout/buy/dce1dd80-3422-43ba-aed5-8ef2dcd38d6d?locale=en';

  useEffect(() => {
    const savedLang = (localStorage.getItem('enjazya_kw_lang') as 'ar' | 'en') || 'ar';
    setLang(savedLang);

    localStorage.setItem('seerk_global_lang', savedLang);
    localStorage.setItem('seerk_global_currency', 'KWD');

    const licenseKey = localStorage.getItem('merchant_license_key') || '';
    setLicenseKeyInput(licenseKey);
    setIsActivated(!!licenseKey);

    document.title = savedLang === 'en' ? 'Enjazya Platform | Kuwait Market' : 'منصة إنجازيا | السوق الكويتي';
  }, []);

  const toggleLanguage = () => {
    const newLang = lang === 'ar' ? 'en' : 'ar';
    setLang(newLang);
    localStorage.setItem('enjazya_kw_lang', newLang);
    localStorage.setItem('seerk_global_lang', newLang);
    document.title = newLang === 'en' ? 'Enjazya Platform | Kuwait Market' : 'منصة إنجازيا | السوق الكويتي';
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
        if (key && (key.startsWith('seerk_') || key.startsWith('enjazya_kw_') || key === 'merchant_license_key')) {
          allData[key] = localStorage.getItem(key) || '';
        }
      }

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(allData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `enjazya_kuwait_backup_${new Date().toISOString().slice(0, 10)}.json`);
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
        
        .hub-container { background-color: #f1f5f9; min-height: 100vh; font-family: ${lang === 'ar' ? "'Tajawal', sans-serif" : "'Inter', sans-serif"}; padding: 30px 20px 40px; }
        
        .navbar { max-width: 1250px; margin: 0 auto 25px; padding: 14px 24px; background: #ffffff; border-radius: 20px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 10px rgba(0,0,0,0.03); border: 1px solid #e2e8f0; flex-wrap: wrap; gap: 15px; border-top: 5px solid #0284c7; position: relative; }
        .brand { font-size: 26px; font-weight: 900; color: #0f172a; white-space: nowrap; display: flex; align-items: center; gap: 12px; letter-spacing: -0.5px; }
        .kw-badge { background: #e0f2fe; color: #0369a1; font-size: 12px; font-weight: 800; padding: 5px 12px; border-radius: 8px; letter-spacing: normal; display: inline-flex; align-items: center; border: 1px solid #bae6fd; }
        
        .nav-controls { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; flex-direction: ${lang === 'ar' ? 'row-reverse' : 'row'}; }
        
        .lang-toggle-btn {
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          color: #0f172a;
          font-weight: 800;
          font-size: 14px;
          padding: 8px 16px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .lang-toggle-btn:hover {
          background: #e2e8f0;
          border-color: #cbd5e1;
        }

        .action-btn-primary { 
          background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); 
          color: #ffffff !important; 
          border: 1px solid #bae6fd; 
          padding: 10px 24px; 
          border-radius: 12px; 
          font-weight: 900; 
          font-size: 15px; 
          cursor: pointer; 
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
          display: inline-flex; 
          align-items: center; 
          gap: 8px; 
          box-shadow: 0 4px 15px rgba(2, 132, 199, 0.3); 
          white-space: nowrap; 
          animation: pulse-blue 2s infinite; 
        }
        .action-btn-primary:hover { 
          background: linear-gradient(135deg, #0369a1 0%, #075985 100%); 
          transform: translateY(-3px) scale(1.02); 
          box-shadow: 0 8px 25px rgba(2, 132, 199, 0.4); 
        }
        @keyframes pulse-blue {
          0% { box-shadow: 0 0 0 0 rgba(2, 132, 199, 0.6); }
          70% { box-shadow: 0 0 0 12px rgba(2, 132, 199, 0); }
          100% { box-shadow: 0 0 0 0 rgba(2, 132, 199, 0); }
        }

        .backup-action-btn { background: #0f172a; color: #fff; border: none; padding: 10px 16px; border-radius: 10px; font-weight: 800; font-size: 13px; cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; }
        .backup-action-btn:hover { background: #1e293b; }
        .restore-action-btn { background: #ffffff; color: #334155; border: 1px solid #cbd5e1; padding: 9px 15px; border-radius: 10px; font-weight: 800; font-size: 13px; cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; }
        .restore-action-btn:hover { background: #f1f5f9; }
        
        .license-box { display: flex; align-items: center; gap: 8px; background: #ffffff; padding: 6px 12px; border-radius: 10px; border: 1px solid #cbd5e1; }
        .license-input { border: 1px solid #cbd5e1; border-radius: 8px; padding: 8px 12px; font-size: 12px; outline: none; width: 140px; background: #f8fafc; color: #0f172a; transition: all 0.2s; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .license-input:focus { border-color: #0284c7; box-shadow: 0 0 0 2px rgba(2, 132, 199, 0.15); background: #ffffff; }
        
        .backup-warning-bar { max-width: 1250px; margin: 0 auto 25px; background: #f0f9ff; border: 1px solid #bae6fd; color: #075985; padding: 12px 20px; border-radius: 12px; font-size: 13.5px; font-weight: 700; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; border-${lang === 'ar' ? 'right' : 'left'}: 5px solid #0284c7; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        
        .promo-banner { max-width: 1250px; margin: 0 auto 40px; background: #ffffff; border-radius: 20px; padding: 28px 36px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px; box-shadow: 0 15px 35px -5px rgba(2, 132, 199, 0.12); border: 2px solid #bae6fd; flex-direction: ${lang === 'ar' ? 'row' : 'row'}; }
        .promo-content { flex: 1 1 min-content; display: flex; flex-direction: column; gap: 10px; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .promo-heading { font-size: 22px; font-weight: 900; margin: 0 0 4px 0; display: flex; align-items: center; gap: 8px; color: #0f172a; }
        .promo-text { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-top: 8px; }
        .price-tag-old { text-decoration: line-through; color: #64748b; font-size: 15px; font-weight: 600; }
        .price-tag-new { background-color: #e0f2fe; color: #0284c7; padding: 6px 14px; border-radius: 10px; font-weight: 900; font-size: 17px; border: 1px solid #bae6fd; }
        .discount-badge { background-color: #0284c7; color: #ffffff; padding: 4px 12px; border-radius: 8px; font-size: 13.5px; font-weight: bold; }
        .promo-btn { background-color: #0284c7; color: #ffffff; border: none; padding: 15px 30px; border-radius: 12px; font-size: 16px; font-weight: 900; cursor: pointer; box-shadow: 0 8px 20px rgba(2, 132, 199, 0.25); transition: all 0.3s ease; display: flex; align-items: center; gap: 10px; white-space: nowrap; }
        .promo-btn:hover { background-color: #0369a1; transform: translateY(-3px); box-shadow: 0 12px 25px rgba(2, 132, 199, 0.35); }
        
        .hero { text-align: center; max-width: 850px; margin: 0 auto 50px; padding: 20px 0; }
        .hero h1 { font-size: 38px; font-weight: 900; color: #0f172a; margin-bottom: 18px; letter-spacing: -0.5px; }
        .hero h1 span { color: #0284c7; }
        .hero p { color: #475569; font-size: 16.5px; line-height: 1.8; font-weight: 500; }
        
        .cards-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; max-width: 1250px; margin: 0 auto 60px; }
        .card { background: #ffffff; border-radius: 20px; padding: 26px; border: 1px solid #e2e8f0; box-shadow: 0 4px 10px rgba(0,0,0,0.02); transition: all 0.3s ease; display: flex; flex-direction: column; justify-content: space-between; text-align: ${lang === 'ar' ? 'start' : 'left'}; }
        .card:hover { transform: translateY(-6px); border-color: #0284c7; box-shadow: 0 20px 30px -10px rgba(2, 132, 199, 0.15); }
        
        .card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 22px; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; }
        .card-icon { font-size: 30px; background: #f8fafc; width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; border-radius: 14px; border: 1px solid #e2e8f0; transition: all 0.3s ease; }
        .card:hover .card-icon { background: #f0f9ff; border-color: #bae6fd; }
        
        .card-badge { background: #f1f5f9; color: #475569; font-size: 14px; font-weight: 900; padding: 6px 14px; border-radius: 10px; transition: all 0.3s ease; }
        .card:hover .card-badge { color: #0284c7; background: #f0f9ff; }
        
        .card h3 { font-size: 19px; font-weight: 900; color: #0f172a; margin-bottom: 12px; line-height: 1.4; transition: color 0.3s ease; }
        .card:hover h3 { color: #0284c7; }
        .card p { color: #64748b; font-size: 14px; line-height: 1.7; font-weight: 500; margin-bottom: 26px; min-height: 50px; }
        
        .card-btn { background: #f0f9ff; color: #0284c7; border: 1px solid #bae6fd; text-align: center; padding: 14px; border-radius: 12px; font-weight: 800; font-size: 14px; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center; gap: 8px; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; }
        .card:hover .card-btn { background: #0284c7; color: #ffffff; border-color: #0284c7; box-shadow: 0 6px 15px rgba(2, 132, 199, 0.25); }

        .footer { max-width: 1250px; margin: 0 auto; background: #0f172a; border-radius: 24px; padding: 45px; color: #f8fafc; text-align: ${lang === 'ar' ? 'start' : 'left'}; }
        .footer-content { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 30px; margin-bottom: 35px; border-bottom: 1px solid #1e293b; padding-bottom: 35px; flex-direction: ${lang === 'ar' ? 'row' : 'row'}; }
        .footer-brand { max-width: 400px; }
        .footer-brand h3 { font-size: 26px; font-weight: 900; margin-bottom: 18px; color: #ffffff; letter-spacing: -0.5px; }
        .footer-brand h3 span { color: #38bdf8; letter-spacing: normal; }
        .footer-brand p { color: #94a3b8; font-size: 14.5px; line-height: 1.8; font-weight: 500; }
        .footer-links { display: flex; gap: 65px; }
        .links-column h4 { color: #ffffff; font-size: 17px; font-weight: 800; margin-bottom: 22px; border-${lang === 'ar' ? 'right' : 'left'}: 3px solid #38bdf8; padding-${lang === 'ar' ? 'right' : 'left'}: 10px; }
        .links-column ul { list-style: none; padding: 0; margin: 0; }
        .links-column ul li { margin-bottom: 14px; }
        .links-column ul li a { color: #94a3b8 !important; font-size: 14.5px; font-weight: 500; transition: color 0.2s; }
        .links-column ul li a:hover { color: #38bdf8 !important; }
        .footer-bottom { text-align: center; color: #64748b; font-size: 14.5px; font-weight: 500; }

        @media(max-width: 1024px) { .cards-grid { grid-template-columns: repeat(2, 1fr); } .footer-content { flex-direction: column; } }
        @media(max-width: 640px) { .cards-grid { grid-template-columns: 1fr; } .hero h1 { font-size: 30px; } .footer-links { flex-direction: column; gap: 35px; } .nav-controls { flex-direction: row; } }
      `}</style>
      
      <div className="navbar">
        <div className="brand">
          {lang === 'ar' ? 'إنجازيا' : 'Enjazya'} <span className="kw-badge">{lang === 'ar' ? 'السوق الكويتي KW 🇰🇼' : 'Kuwait Market 🇰🇼'}</span>
        </div>

        <div className="nav-controls">
          <button onClick={toggleLanguage} className="lang-toggle-btn" title="تغيير لغة المنصة / Change Language">
            {lang === 'ar' ? 'English 🌐' : 'العربية 🌐'}
          </button>

          {!isActivated && (
            <a href={LEMON_CHECKOUT_URL} target="_blank" rel="noopener noreferrer" className="action-btn-primary" title="ترقية الحساب">
              ⚡ {lang === 'ar' ? 'ترقية (3.99 د.ك)' : 'Upgrade (3.99 KWD)'}
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
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#475569' }}>🔑 PRO:</span>
            {isActivated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 900, color: '#0284c7', padding: '4px 8px' }}>
                  {lang === 'ar' ? 'المنصة مفعلة ✓' : 'Activated ✓'}
                </span>
                <button 
                  onClick={handleDeactivate}
                  style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5', padding: '4px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}
                  title={lang === 'ar' ? 'إلغاء التفعيل للعودة للوضع التجريبي' : 'Deactivate account'}
                >
                  {lang === 'ar' ? 'إلغاء التفعيل ❌' : 'Deactivate ❌'}
                </button>
              </div>
            ) : (
              <>
                <input 
                  type="text" 
                  className="license-input"
                  placeholder={lang === 'ar' ? 'مفتاح الاشتراك الرسمي...' : 'License Key...'} 
                  value={licenseKeyInput} 
                  onChange={(e) => setLicenseKeyInput(e.target.value)}
                />
                <button 
                  onClick={handleActivateLicense}
                  disabled={isLoading}
                  style={{ background: '#0f172a', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit', opacity: isLoading ? 0.7 : 1 }}
                >
                  {isLoading ? '...' : (lang === 'ar' ? 'تفعيل' : 'Activate')}
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
              <span className="price-tag-old">{lang === 'ar' ? 'كان بـ 24.99 د.ك شهرياً' : 'Was 24.99 KWD/mo'}</span>
              <span className="price-tag-new">{lang === 'ar' ? 'والآن فقط 3.99 د.ك شهرياً' : 'Now only 3.99 KWD/mo'}</span>
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
        <h1>{lang === 'ar' ? 'منصة إنجازيا ' : 'Enjazya Platform '}<span>{lang === 'ar' ? 'للسوق الكويتي' : 'Kuwait Market'}</span></h1>
        <p>{lang === 'ar' ? 'الترسانة السحابية المتكاملة بـ 24 أداة دقيقة، صُممت خصيصاً لتمكين وتطوير المتاجر الإلكترونية في دولة الكويت بالدينار الكويتي (د.ك) ومتوافقة تماماً مع السوق المحلي.' : 'The integrated cloud arsenal with 24 precise tools designed specifically to empower and scale e-commerce stores in Kuwait in Kuwaiti Dinars (KWD).'}</p>
      </div>

      <div className="cards-grid">
        {kwTools.map((tool, index) => (
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
            <h3>{lang === 'ar' ? 'إنجازيا ' : 'Enjazya '}<span>{lang === 'ar' ? 'الكويت 🇰🇼' : 'Kuwait 🇰🇼'}</span></h3>
            <p>{lang === 'ar' ? 'المنصة السحابية الأولى المخصصة لتمكين تجار التجارة الإلكترونية في دولة الكويت. أدوات دقيقة، تقارير مالية محلية، وأرباح مضاعفة.' : 'The premier cloud platform dedicated to empowering e-commerce merchants in Kuwait. Precise tools, local financial reports, and multiplied profits.'}</p>
          </div>
          
          <div className="footer-links">
            <div className="links-column">
              <h4>{lang === 'ar' ? 'المنصة' : 'Platform'}</h4>
              <ul>
                <li><Link href="/kw">{lang === 'ar' ? 'جميع الأدوات (24)' : 'All Tools (24)'}</Link></li>
                <li><Link href="/kw/updates">{lang === 'ar' ? 'التحديثات الجديدة' : 'Latest Updates'}</Link></li>
                <li><Link href="/kw/pricing">{lang === 'ar' ? 'أسعار الباقات' : 'Pricing Plans'}</Link></li>
              </ul>
            </div>
            <div className="links-column">
              <h4>{lang === 'ar' ? 'الدعم والمساعدة' : 'Support'}</h4>
              <ul>
                <li><Link href="/kw/support/contact">{lang === 'ar' ? 'الدعم الفني' : 'Technical Support'}</Link></li>
                <li><Link href="/kw/support/faq">{lang === 'ar' ? 'الأسئلة الشائعة' : 'FAQs'}</Link></li>
              </ul>
            </div>
            <div className="links-column">
              <h4>{lang === 'ar' ? 'الأنظمة والقوانين' : 'Legal'}</h4>
              <ul>
                <li><Link href="/kw/legal/terms">{lang === 'ar' ? 'شروط الاستخدام' : 'Terms of Use'}</Link></li>
                <li><Link href="/kw/legal/privacy">{lang === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>{lang === 'ar' ? 'جميع الحقوق محفوظة © 2026 منصة إنجازيا لتمكين التجارة الإلكترونية في دولة الكويت' : 'All rights reserved © 2026 Enjazya Platform Kuwait'}</p>
        </div>
      </footer>
    </div>
  );
}
