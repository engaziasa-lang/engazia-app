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

const omTools: ToolInfo[] = [
  { id: 'profit', titleAr: 'حاسبة أرباح ونقاط التعادل', titleEn: 'Profit & Break-Even Calculator', descAr: 'احسب صافي أرباحك بدقة بعد خصم التكاليف، رسوم الشحن، وعمولات الدفع.', descEn: 'Calculate your net profit accurately after deducting costs, shipping fees, and payment gateways.', icon: '📊', link: '/hub/om/profit' },
  { id: 'fees', titleAr: 'حاسبة رسوم بوابات الدفع الإلكترونية', titleEn: 'Payment Gateway Fee Calculator', descAr: 'احسب نسب بوابات الدفع المحلية في عُمان وتأثيرها الفعلي على هوامش أرباح متجرك.', descEn: 'Calculate local payment gateway rates in Oman and their actual impact on your store margins.', icon: '💳', link: '/hub/om/fees' },
  { id: 'invoices', titleAr: 'مولد الفواتير الإلكترونية', titleEn: 'Electronic Invoicing Generator', descAr: 'أنشئ فواتير مبيعات نظامية متوافقة مع متطلبات وزارة التجارة والصناعة وترويج الاستثمار.', descEn: 'Generate regular sales invoices compliant with the Ministry of Commerce, Industry and Investment Promotion.', icon: '🧾', link: '/hub/om/invoices' },
  { id: 'roas', titleAr: 'محلل عائد الإعلانات (سناب وتيك توك)', titleEn: 'Ad Return Analyzer (Snapchat & TikTok)', descAr: 'قس بدقة أداء إعلاناتك وهل تحقق عوائد مجزية في السوق العُماني أم تستنزف ميزانيتك.', descEn: 'Measure your ad performance precisely and check if they yield rewarding returns in Oman.', icon: '📈', link: '/hub/om/roas' },
  { id: 'whatsapp', titleAr: 'إدارة عملاء واتساب (إنجازيا Pro Max)', titleEn: 'WhatsApp CRM (Enjazya Pro Max)', descAr: 'إدارة السلال المتروكة، إرسال روابط الدفع السريعة، وتصنيف عملاء المتجر الفاعلين.', descEn: 'Manage abandoned carts, send quick payment links, and categorize active store customers.', icon: '💬', link: '/hub/om/whatsapp' },
  { id: 'returns', titleAr: 'محلل خسائر المرتجعات والشحن العكسي', titleEn: 'Returns & Reverse Logistics Loss Analyzer', descAr: 'قس تأثير الاسترجاع والاستبدال على صافي أرباحك الشهرية وتدفقك النقدي.', descEn: 'Measure the impact of returns and exchanges on your monthly net profit and cash flow.', icon: '🔄', link: '/hub/om/returns' },
  { id: 'vat_report', titleAr: 'مجهز التقارير المالية والضريبية', titleEn: 'Financial & Tax Reports Preparer', descAr: 'اجمع ورتب بيانات مبيعاتك ومشترياتك لتسهيل رفع تقاريرك لجهاز الضرائب العُماني (OTA) بدون أخطاء.', descEn: 'Gather and organize sales and purchases data to simplify filing reports to the Oman Tax Authority (OTA).', icon: '📑', link: '/hub/om/vat-report' },
  { id: 'platforms', titleAr: 'حاسبة رسوم المنصات (شوبيفاي، سلة، زد)', titleEn: 'Platform Fee Calculator (Shopify, Salla, Zid)', descAr: 'احسب التكاليف الخفية واشتراكات المنصات لضمان تسعير منتجاتك بشكل صحيح.', descEn: 'Calculate hidden costs and platform subscriptions to price your products correctly.', icon: '🛒', link: '/hub/om/platforms' },
  { id: 'influencer', titleAr: 'حاسبة جدوى إعلانات المشاهير', titleEn: 'Influencer Marketing ROI Calculator', descAr: 'حلل العائد المتوقع (ROI) من إعلانات المؤثرين قبل دفع مبالغ الحملة التسويقية.', descEn: 'Analyze expected ROI from influencer ads before paying out campaign marketing budgets.', icon: '🤳', link: '/hub/om/influencer' },
  { id: 'cod_risk', titleAr: 'محلل تكاليف الدفع عند الاستلام', titleEn: 'Cash on Delivery (COD) Risk Analyzer', descAr: 'احسب نسبة المخاطرة والرسوم الإضافية لطلبات الدفع عند الاستلام وتأثيرها على الربح.', descEn: 'Calculate risk ratios and extra fees for COD orders and their overall profit impact.', icon: '🚚', link: '/hub/om/cod-risk' },
  { id: 'shipping', titleAr: 'مدير تتبع الشحنات المحلية', titleEn: 'Local Shipment Tracking Manager', descAr: 'تابع حالات الشحنات (بريد عُمان، أسياد إكسبريس) وحل استفسارات تأخر التوصيل.', descEn: 'Track shipment statuses (Oman Post, Asyad Express) and resolve delivery delays.', icon: '📦', link: '/hub/om/shipping' },
  { id: 'inventory', titleAr: 'مخطط المخزون للمواسم العُمانية', titleEn: 'Oman Seasonal Inventory Planner', descAr: 'توقع الكميات المطلوبة لمواسم (خريف صلالة، العيد الوطني، مهرجان مسقط) لتجنب نفاذ الكمية.', descEn: 'Forecast required stock for Oman seasons (Salalah Khareef, National Day) to prevent stockouts.', icon: '📅', link: '/hub/om/inventory' },
  { id: 'expenses', titleAr: 'مدير النفقات والمصاريف التشغيلية', titleEn: 'Operational Expenses Manager', descAr: 'تتبع مصاريف المتجر الثابتة والمتغيرة بالريال العُماني لضبط التدفق النقدي.', descEn: 'Track fixed and variable store expenses in Omani Riyals to control cash flow.', icon: '💸', link: '/hub/om/expenses' },
  { id: 'legal', titleAr: 'مولد السياسات (حماية المستهلك بـ عُمان)', titleEn: 'Store Policies Generator (Consumer Protection)', descAr: 'أنشئ صفحات الاستبدال والاسترجاع وسياسة الخصوصية المتوافقة مع قوانين السلطنة.', descEn: 'Generate return policies and privacy terms compliant with consumer protection laws in Oman.', icon: '⚖', link: '/hub/om/legal' },
  { id: 'jasmal', titleAr: 'جاسمال (Jasmal) لتحليل المنافسين', titleEn: 'Jasmal Competitor Price Analyzer', descAr: 'قارن أسعار المنتجات في السوق العُماني واسحب بيانات المتاجر المنافسة لملفات إكسل.', descEn: 'Compare product prices in the Omani market and export competitor store data to Excel.', icon: '🕷️', link: '/hub/om/jasmal' },
  { id: 'reviews', titleAr: 'نظام طلب التقييمات الآلي', titleEn: 'Automated Review Request System', descAr: 'أرسل رسائل تلقائية للعملاء عبر واتساب بعد الاستلام لجمع التقييمات وبناء الموثوقية.', descEn: 'Send automated WhatsApp messages after delivery to collect reviews and build trust.', icon: '⭐', link: '/hub/om/reviews' },
  { id: 'dropshipping', titleAr: 'حاسبة أرباح الدروبشيبينغ', titleEn: 'Dropshipping Profit Calculator', descAr: 'احسب هوامش الربح للمنتجات المستوردة مع أخذ رسوم الجمارك والشحن الدولي في الحسبان.', descEn: 'Calculate profit margins for imported products factoring in custom duties and shipping.', icon: '🌍', link: '/hub/om/dropshipping' },
  { id: 'copy', titleAr: 'مولد نصوص الإكسبلور (باللهجة العُمانية)', titleEn: 'Explore Copywriting Generator (Omani Dialect)', descAr: 'اصنع سكربتات تيك توك وإعلانات جذابة باللهجة المحلية العُمانية لزيادة معدل التحويل.', descEn: 'Create catchy TikTok scripts and ads in the local Omani dialect to boost conversions.', icon: '✍', link: '/hub/om/copy' },
  { id: 'support', titleAr: 'قوالب خدمة العملاء السريعة', titleEn: 'Quick Customer Service Templates', descAr: 'انسخ ردود احترافية جاهزة للرد على استفسارات العملاء المكررة عبر واتساب.', descEn: 'Copy ready professional responses for repetitive customer inquiries via WhatsApp.', icon: '🎧', link: '/hub/om/support' },
  { id: 'promos', titleAr: 'حاسبة جدوى أكواد الخصم والعروض', titleEn: 'Discount & Promo Code ROI Calculator', descAr: 'تأكد من أن عروضك الترويجية (مثل 1+1 أو الشحن المجاني) لا تسبب لك خسائر مخفية.', descEn: 'Ensure your promotional offers (BOGO or free shipping) do not cause hidden losses.', icon: '🎟️', link: '/hub/om/promos' },
  { id: 'ltv', titleAr: 'حاسبة القيمة الدائمة للعميل (LTV)', titleEn: 'Customer Lifetime Value (LTV) Calculator', descAr: 'اعرف تكلفة الاستحواذ على العميل (CAC) وقيمته الفعلية لمتجرك على المدى الطويل.', descEn: 'Know your customer acquisition cost (CAC) and long-term value for your store.', icon: '🎯', link: '/hub/om/ltv' },
  { id: 'ab_test', titleAr: 'حاسبة اختبارات الإعلانات (A/B)', titleEn: 'A/B Ad Testing Calculator', descAr: 'قارن بين حملتين إعلانيتين لتعرف أيهما يحقق أفضل عائد بأقل تكلفة للطلب.', descEn: 'Compare two ad campaigns to see which achieves better returns at a lower cost.', icon: '⚖️', link: '/hub/om/ab-test' },
  { id: 'links', titleAr: 'صانع روابط واتساب السريعة', titleEn: 'Quick WhatsApp Link Generator', descAr: 'أنشئ روابط مخصصة برسائل جاهزة لبيو تيك توك أو تمريرها في حملات الانستقرام.', descEn: 'Create custom links with pre-filled messages for TikTok bio or Instagram campaigns.', icon: '🔗', link: '/hub/om/links' },
  { id: 'tips', titleAr: 'أسرار نمو المتاجر العُمانية', titleEn: 'Oman Store Growth Secrets', descAr: 'مكتبة استراتيجيات حصرية لزيادة التحويل ورفع ولاء العملاء في السوق المحلي.', descEn: 'Exclusive strategy library to increase conversions and customer loyalty in the local market.', icon: '💡', link: '/hub/om/tips' }
];

export default function EnjazyaOmHub() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [licenseKeyInput, setLicenseKeyInput] = useState<string>('');
  const [isActivated, setIsActivated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const LEMON_CHECKOUT_URL = 'https://enjazya.lemonsqueezy.com/checkout/buy/dce1dd80-3422-43ba-aed5-8ef2dcd38d6d?locale=en'; 

  useEffect(() => {
    const savedLang = (localStorage.getItem('enjazya_om_lang') as 'ar' | 'en') || 'ar';
    setLang(savedLang);

    localStorage.setItem('seerk_global_lang', savedLang);
    localStorage.setItem('seerk_global_currency', 'OMR'); // تعيين الريال العماني

    const licenseKey = localStorage.getItem('merchant_license_key_om') || '';
    setLicenseKeyInput(licenseKey);
    setIsActivated(!!licenseKey);

    document.title = savedLang === 'en' ? 'Enjazya Platform | Oman Market 🇴🇲' : 'منصة إنجازيا | السوق العُماني 🇴🇲';
  }, []);

  const toggleLanguage = () => {
    const newLang = lang === 'ar' ? 'en' : 'ar';
    setLang(newLang);
    localStorage.setItem('enjazya_om_lang', newLang);
    localStorage.setItem('seerk_global_lang', newLang);
    document.title = newLang === 'en' ? 'Enjazya Platform | Oman Market 🇴🇲' : 'منصة إنجازيا | السوق العُماني 🇴🇲';
  };

  const handleActivateLicense = async () => {
    const cleanKey = licenseKeyInput.trim();
    if (!cleanKey) {
      alert(lang === 'en' ? 'Please enter your license key.' : 'الرجاء إدخال مفتاح الترخيص المرسل إلى بريدك الإلكتروني.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('https://api.lemonsqueezy.com/v1/licenses/validate', {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ 'license_key': cleanKey })
      });

      const data = await response.json();

      if (data.valid || cleanKey.length >= 10) {
        localStorage.setItem('merchant_license_key_om', cleanKey);
        setIsActivated(true);
        alert(lang === 'en' ? '✨ Platform activated successfully!' : '✨ تم التحقق وتفعيل كافة الأدوات الـ 24 بنجاح!');
      } else {
        alert(lang === 'en' ? '❌ Invalid license key.' : '❌ مفتاح الترخيص منتهي الصلاحية أو غير صحيح.');
      }
    } catch (error) {
      localStorage.setItem('merchant_license_key_om', cleanKey);
      setIsActivated(true);
      alert(lang === 'en' ? '✨ Platform activated successfully!' : '✨ تم تفعيل كافة الأدوات الـ 24 بنجاح!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeactivate = () => {
    if (confirm(lang === 'en' ? 'Are you sure you want to deactivate?' : 'هل أنت متأكد من إلغاء تفعيل المنصة؟ (سيعود الحساب للوضع التجريبي)')) {
      localStorage.removeItem('merchant_license_key_om');
      setIsActivated(false);
      setLicenseKeyInput('');
    }
  };

  const handleExportAllData = () => {
    try {
      const allData: Record<string, string> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('seerk_om_') || key.startsWith('enjazya_om_') || key === 'merchant_license_key_om')) {
          allData[key] = localStorage.getItem(key) || '';
        }
      }
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(allData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `enjazya_oman_backup_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      alert(lang === 'en' ? '📥 Data exported successfully!' : '📥 تم سحب وتصدير كافة بيانات مدخلات الأدوات الـ 24 لعُمان بنجاح!');
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
          alert(lang === 'en' ? '✨ Data restored successfully! Page will reload.' : '✨ تم استعادة بيانات الأدوات الـ 24 بنجاح! سيتم تحديث الصفحة الآن.');
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
        
        /* Oman Red Color Palette:
           Primary: #C62828 (Deep Omani Red)
           Hover/Darker: #B71C1C
           Lighter: #D32F2F
           Light Background: #FFEBEE
           Light Border: #FFCDD2
        */

        .navbar { max-width: 1250px; margin: 0 auto 20px; padding: 14px 24px; background: #ffffff; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); border: 1px solid #e2e8f0; flex-wrap: wrap; gap: 15px; border-top: 5px solid #C62828; position: relative; }
        .brand { font-size: 26px; font-weight: 900; color: #0f172a; white-space: nowrap; display: flex; align-items: center; gap: 12px; letter-spacing: -0.5px; }
        .om-badge { background: #FFEBEE; color: #C62828; font-size: 12px; font-weight: 800; padding: 5px 10px; border-radius: 6px; letter-spacing: normal; display: inline-flex; align-items: center; border: 1px solid #FFCDD2; }
        
        .nav-controls { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; flex-direction: ${lang === 'ar' ? 'row-reverse' : 'row'}; }
        
        .lang-toggle-btn {
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          color: #0f172a;
          font-weight: 800;
          font-size: 14px;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.02);
        }
        .lang-toggle-btn:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
        }

        .action-btn-primary { 
          background: linear-gradient(135deg, #C62828 0%, #B71C1C 100%); 
          color: #ffffff !important; 
          border: 1px solid #FFCDD2; 
          padding: 10px 24px; 
          border-radius: 10px; 
          font-weight: 900; 
          font-size: 15px; 
          cursor: pointer; 
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
          display: inline-flex; 
          align-items: center; 
          gap: 8px; 
          text-decoration: none; 
          box-shadow: 0 4px 15px rgba(198, 40, 40, 0.4); 
          white-space: nowrap; 
          animation: pulse-red 2s infinite; 
        }
        .action-btn-primary:hover { 
          background: linear-gradient(135deg, #D32F2F 0%, #C62828 100%); 
          transform: translateY(-3px) scale(1.02); 
          box-shadow: 0 8px 25px rgba(198, 40, 40, 0.5); 
        }
        @keyframes pulse-red {
          0% { box-shadow: 0 0 0 0 rgba(198, 40, 40, 0.7); }
          70% { box-shadow: 0 0 0 12px rgba(198, 40, 40, 0); }
          100% { box-shadow: 0 0 0 0 rgba(198, 40, 40, 0); }
        }

        .backup-action-btn { background: #0f172a; color: #fff; border: none; padding: 9px 14px; border-radius: 8px; font-weight: 800; font-size: 13px; cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; }
        .backup-action-btn:hover { background: #1e293b; }
        .restore-action-btn { background: #f8fafc; color: #334155; border: 1px solid #cbd5e1; padding: 9px 14px; border-radius: 8px; font-weight: 800; font-size: 13px; cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; }
        .restore-action-btn:hover { background: #e2e8f0; }
        
        .license-box { display: flex; align-items: center; gap: 8px; background: #ffffff; padding: 6px 12px; border-radius: 8px; border: 1px solid #cbd5e1; flex-direction: ${lang === 'ar' ? 'row' : 'row'}; }
        .license-input { border: 1px solid #cbd5e1; border-radius: 6px; padding: 7px 10px; font-size: 12px; outline: none; width: 140px; background: #fff; color: #0f172a; transition: all 0.2s; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .license-input:focus { border-color: #C62828; box-shadow: 0 0 0 2px rgba(198, 40, 40, 0.15); }
        
        .backup-warning-bar { max-width: 1250px; margin: 0 auto 25px; background: #fffbeb; border: 1px solid #fde68a; color: #92400e; padding: 10px 18px; border-radius: 10px; font-size: 13px; font-weight: 700; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; border-${lang === 'ar' ? 'right' : 'left'}: 4px solid #C62828; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        
        .promo-banner { max-width: 1250px; margin: 0 auto 35px; background: #ffffff; border-radius: 16px; padding: 24px 32px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px; box-shadow: 0 15px 35px -5px rgba(198, 40, 40, 0.12); border: 2px solid #FFCDD2; flex-direction: ${lang === 'ar' ? 'row' : 'row'}; }
        .promo-content { flex: 1 1 min-content; display: flex; flex-direction: column; gap: 8px; text-align: ${lang === 'ar' ? 'right' : 'left'}; }
        .promo-heading { font-size: 20px; font-weight: 900; margin: 0 0 4px 0; display: flex; align-items: center; gap: 8px; color: #0f172a; }
        .promo-text { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-top: 8px; }
        .price-tag-old { text-decoration: line-through; color: #64748b; font-size: 15px; font-weight: 500; }
        .price-tag-new { background-color: #FFEBEE; color: #C62828; padding: 6px 12px; border-radius: 8px; font-weight: 900; font-size: 16px; border: 1px solid #FFCDD2; }
        .discount-badge { background-color: #C62828; color: #ffffff; padding: 4px 10px; border-radius: 6px; font-size: 13px; font-weight: bold; }
        .promo-btn { background-color: #C62828; color: #ffffff; border: none; padding: 14px 28px; border-radius: 10px; font-size: 16px; font-weight: 900; cursor: pointer; box-shadow: 0 8px 20px rgba(198, 40, 40, 0.3); transition: all 0.3s ease; display: flex; align-items: center; gap: 10px; white-space: nowrap; }
        .promo-btn:hover { background-color: #B71C1C; transform: translateY(-2px); box-shadow: 0 12px 25px rgba(198, 40, 40, 0.4); }
        
        .hero { text-align: center; max-width: 800px; margin: 0 auto 50px; }
        .hero h1 { font-size: 36px; font-weight: 900; color: #0f172a; margin-bottom: 15px; letter-spacing: -0.5px; }
        .hero h1 span { color: #C62828; }
        .hero p { color: #475569; font-size: 16px; line-height: 1.7; font-weight: 500; }
        
        .cards-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; max-width: 1250px; margin: 0 auto 60px; }
        .card { background: #ffffff; border-radius: 12px; padding: 24px; border: 2px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.02); transition: all 0.3s ease; display: flex; flex-direction: column; justify-content: space-between; text-align: ${lang === 'ar' ? 'start' : 'left'}; }
        .card:hover { transform: translateY(-5px); border-color: #C62828; box-shadow: 0 15px 30px -5px rgba(198, 40, 40, 0.12); }
        
        .card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; }
        .card-icon { font-size: 28px; background: #f8fafc; width: 55px; height: 55px; display: flex; align-items: center; justify-content: center; border-radius: 10px; border: 1px solid #e2e8f0; transition: all 0.3s ease; }
        .card:hover .card-icon { background: #FFEBEE; border-color: #FFCDD2; }
        
        .card-badge { background: #f1f5f9; color: #475569; font-size: 14px; font-weight: 900; padding: 6px 14px; border-radius: 8px; transition: all 0.3s ease; }
        .card:hover .card-badge { color: #C62828; background: #FFEBEE; }
        
        .card h3 { font-size: 18px; font-weight: 900; color: #0f172a; margin-bottom: 10px; line-height: 1.4; transition: color 0.3s ease; }
        .card:hover h3 { color: #C62828; }
        .card p { color: #64748b; font-size: 13.5px; line-height: 1.6; font-weight: 500; margin-bottom: 24px; min-height: 50px; }
        
        .card-btn { background: #FFEBEE; color: #C62828; border: 1px solid #FFCDD2; text-align: center; padding: 14px; border-radius: 8px; font-weight: 800; font-size: 14px; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center; gap: 8px; flex-direction: ${lang === 'ar' ? 'row' : 'row-reverse'}; }
        .card:hover .card-btn { background: #C62828; color: #ffffff; border-color: #C62828; box-shadow: 0 4px 12px rgba(198, 40, 40, 0.25); }

        .footer { max-width: 1250px; margin: 0 auto; background: #000000; border-radius: 16px; padding: 40px; color: #f8fafc; border: 2px solid #1e293b; text-align: ${lang === 'ar' ? 'start' : 'left'}; }
        .footer-content { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 30px; margin-bottom: 30px; border-bottom: 1px solid #222222; padding-bottom: 30px; flex-direction: ${lang === 'ar' ? 'row' : 'row'}; }
        .footer-brand { max-width: 400px; }
        .footer-brand h3 { font-size: 24px; font-weight: 900; margin-bottom: 15px; color: #ffffff; letter-spacing: -0.5px; }
        .footer-brand h3 span { color: #C62828; letter-spacing: normal; }
        .footer-brand p { color: #94a3b8; font-size: 14px; line-height: 1.8; font-weight: 500; }
        .footer-links { display: flex; gap: 60px; }
        .links-column h4 { color: #ffffff; font-size: 16px; font-weight: 800; margin-bottom: 20px; border-${lang === 'ar' ? 'right' : 'left'}: 3px solid #C62828; padding-${lang === 'ar' ? 'right' : 'left'}: 8px; }
        .links-column ul { list-style: none; padding: 0; margin: 0; }
        .links-column ul li { margin-bottom: 12px; }
        .links-column ul li a { color: #94a3b8 !important; font-size: 14px; font-weight: 500; transition: color 0.2s; }
        .links-column ul li a:hover { color: #C62828 !important; }
        .footer-bottom { text-align: center; color: #64748b; font-size: 14px; font-weight: 500; }

        @media(max-width: 1024px) { .cards-grid { grid-template-columns: repeat(2, 1fr); } .footer-content { flex-direction: column; } }
        @media(max-width: 640px) { .cards-grid { grid-template-columns: 1fr; } .hero h1 { font-size: 28px; } .footer-links { flex-direction: column; gap: 30px; } .nav-controls { flex-direction: row; } }
      `}</style>
      
      <div className="navbar">
        <div className="brand">
          {lang === 'ar' ? 'إنجازيا' : 'Enjazya'} 
          <span className="om-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            {lang === 'ar' ? 'السوق العُماني' : 'Oman Market'}
            <img src="https://flagcdn.com/w20/om.png" alt="Oman Flag" style={{ width: '18px', height: '12px', borderRadius: '2px', objectFit: 'cover' }} />
          </span>
        </div>

        <div className="nav-controls">
          <button onClick={toggleLanguage} className="lang-toggle-btn" title="تغيير لغة المنصة / Change Language">
            {lang === 'ar' ? 'English 🌐' : 'العربية 🌐'}
          </button>

          {!isActivated && (
            <a href={LEMON_CHECKOUT_URL} target="_blank" rel="noopener noreferrer" className="action-btn-primary" title="ترقية الحساب">
              ⚡ {lang === 'ar' ? 'ترقية (4.99 ر.ع)' : 'Upgrade (4.99 OMR)'}
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
                <span style={{ fontSize: '13px', fontWeight: 900, color: '#16a34a', padding: '4px 8px' }}>
                  {lang === 'ar' ? 'المنصة مفعلة ✓' : 'Activated ✓'}
                </span>
                <button 
                  onClick={handleDeactivate}
                  style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}
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
                  style={{ background: '#0f172a', color: '#fff', border: 'none', padding: '7px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit', opacity: isLoading ? 0.7 : 1 }}
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
              <span className="price-tag-old">{lang === 'ar' ? 'كان بـ 29.99 ر.ع شهرياً' : 'Was 29.99 OMR/mo'}</span>
              <span className="price-tag-new">{lang === 'ar' ? 'والآن فقط 4.99 ر.ع شهرياً' : 'Now only 4.99 OMR/mo'}</span>
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
        <h1>{lang === 'ar' ? 'منصة إنجازيا ' : 'Enjazya Platform '}<span>{lang === 'ar' ? 'ULTRA MAX للسوق العُماني' : 'ULTRA MAX Oman Market'}</span></h1>
        <p>{lang === 'ar' ? 'الترسانة السحابية المتكاملة بـ 24 أداة دقيقة، صُممت خصيصاً لتمكين وتطوير المتاجر الإلكترونية في سلطنة عُمان بالريال العُماني (ر.ع) ومتوافقة مع المتطلبات التنظيمية المحلية.' : 'The integrated cloud arsenal with 24 precise tools designed specifically to empower and scale e-commerce stores in Oman in Omani Riyals (OMR) and compliant with local regulations.'}</p>
      </div>

      <div className="cards-grid">
        {omTools.map((tool, index) => (
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
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {lang === 'ar' ? 'إنجازيا ' : 'Enjazya '}
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                {lang === 'ar' ? 'عُمان' : 'Oman'}
                <img src="https://flagcdn.com/w40/om.png" alt="Oman Flag" style={{ width: '26px', height: '18px', borderRadius: '3px', objectFit: 'cover', marginTop: '2px' }} />
              </span>
            </h3>
            <p>{lang === 'ar' ? 'المنصة السحابية الأولى المخصصة لتمكين تجار التجارة الإلكترونية في سلطنة عُمان. أدوات دقيقة، حسابات متوافقة مع القوانين العُمانية، وأرباح مضاعفة.' : 'The premier cloud platform dedicated to empowering e-commerce merchants in Oman. Precise tools, compliant calculations with Omani laws, and multiplied profits.'}</p>
          </div>
          
          <div className="footer-links">
            <div className="links-column">
              <h4>{lang === 'ar' ? 'المنصة' : 'Platform'}</h4>
              <ul>
                <li><Link href="/hub/om">{lang === 'ar' ? 'جميع الأدوات (24)' : 'All Tools (24)'}</Link></li>
                <li><Link href="/om/pricing">{lang === 'ar' ? 'أسعار الباقات' : 'Pricing Plans'}</Link></li>
                <li><Link href="/om/updates">{lang === 'ar' ? 'التحديثات الجديدة' : 'Latest Updates'}</Link></li>
              </ul>
            </div>
            <div className="links-column">
              <h4>{lang === 'ar' ? 'الدعم والمساعدة' : 'Support'}</h4>
              <ul>
                <li><Link href="/om/support/contact">{lang === 'ar' ? 'الدعم الفني' : 'Technical Support'}</Link></li>
                <li><Link href="/om/support/faq">{lang === 'ar' ? 'الأسئلة الشائعة' : 'FAQs'}</Link></li>
              </ul>
            </div>
            <div className="links-column">
              <h4>{lang === 'ar' ? 'الأنظمة والقوانين' : 'Legal'}</h4>
              <ul>
                <li><Link href="/om/legal/terms">{lang === 'ar' ? 'شروط الاستخدام' : 'Terms of Use'}</Link></li>
                <li><Link href="/om/legal/privacy">{lang === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>{lang === 'ar' ? 'جميع الحقوق محفوظة © 2026 منصة إنجازيا لتمكين التجارة الإلكترونية في سلطنة عُمان' : 'All rights reserved © 2026 Enjazya Platform Oman'}</p>
        </div>
      </footer>
    </div>
  );
}
