'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const getInitialConfig = () => {
  if (typeof window === 'undefined') {
    return { lang: 'ar', currency: 'AED', licenseKey: '', isActivated: false };
  }
  
  localStorage.setItem('seerk_global_lang', 'ar');
  localStorage.setItem('seerk_global_currency', 'AED');

  const licenseKey = localStorage.getItem('merchant_license_key') || '';
  const isActivated = !!licenseKey;

  return { lang: 'ar', currency: 'AED', licenseKey, isActivated };
};

interface ToolInfo {
  id: string;
  title: string;
  desc: string;
  icon: string;
  link: string;
}

const aeTools: ToolInfo[] = [
  { id: 'profit', title: 'حاسبة أرباح ونقاط التعادل (5% ضريبة)', desc: 'احسب صافي أرباحك بدقة بعد خصم التكاليف، رسوم الشحن، وضريبة القيمة المضافة.', icon: '📊', link: '/hub/ae/profit' },
  { id: 'fees', title: 'حاسبة رسوم بوابات الدفع (تابي، Stripe، Payfort)', desc: 'احسب نسب بوابات الدفع المحلية وتأثيرها الفعلي على هوامش أرباح متجرك.', icon: '💳', link: '/hub/ae/fees' },
  { id: 'invoices', title: 'مولد الفواتير الإلكترونية (FTA)', desc: 'أنشئ فواتير مبيعات نظامية متوافقة مع متطلبات الهيئة الاتحادية للضرائب في الإمارات.', icon: '🧾', link: '/hub/ae/invoices' },
  { id: 'roas', title: 'محلل عائد الإعلانات (سناب وتيك توك)', desc: 'قس بدقة أداء إعلاناتك وهل تحقق عوائد مجزية في السوق الإماراتي أم تستنزف ميزانيتك.', icon: '📈', link: '/hub/ae/roas' },
  { id: 'whatsapp', title: 'إدارة عملاء واتساب (إنجازيا Pro Max)', desc: 'إدارة السلال المتروكة، إرسال روابط الدفع السريعة، وتصنيف عملاء المتجر الفاعلين.', icon: '💬', link: '/hub/ae/whatsapp' },
  { id: 'returns', title: 'محلل خسائر المرتجعات والشحن العكسي', desc: 'قس تأثير الاسترجاع والاستبدال على صافي أرباحك الشهرية وتدفقك النقدي.', icon: '🔄', link: '/hub/ae/returns' },
  { id: 'vat_report', title: 'مجهز بيانات الإقرار الضريبي', desc: 'اجمع ورتب بيانات مبيعاتك ومشترياتك لتسهيل رفع الإقرار الضريبي للهيئة الاتحادية بدون أخطاء.', icon: '📑', link: '/hub/ae/vat-report' },
  { id: 'platforms', title: 'حاسبة رسوم المنصات (شوبيفاي، ووكومرس)', desc: 'احسب التكاليف الخفية واشتراكات المنصات العالمية لضمان تسعير منتجاتك بشكل صحيح.', icon: '🛒', link: '/hub/ae/platforms' },
  { id: 'influencer', title: 'حاسبة جدوى إعلانات المشاهير', desc: 'حلل العائد المتوقع (ROI) من إعلانات المؤثرين قبل دفع مبالغ الحملة التسويقية.', icon: '🤳', link: '/hub/ae/influencer' },
  { id: 'cod_risk', title: 'محلل تكاليف الدفع عند الاستلام', desc: 'احسب نسبة المخاطرة والرسوم الإضافية لطلبات الدفع عند الاستلام وتأثيرها على الربح.', icon: '🚚', link: '/hub/ae/cod-risk' },
  { id: 'shipping', title: 'مدير تتبع الشحنات المحلية', desc: 'تابع حالات الشحنات (أرامكس، فيتشر، بريد الإمارات) وحل استفسارات تأخر التوصيل.', icon: '📦', link: '/hub/ae/shipping' },
  { id: 'inventory', title: 'مخطط المخزون للمواسم الإماراتية', desc: 'توقع الكميات المطلوبة لمواسم (مفاجآت صيف دبي، العيد، اليوم الوطني) لتجنب نفاذ الكمية.', icon: '📅', link: '/hub/ae/inventory' },
  { id: 'expenses', title: 'مدير النفقات والمصاريف التشغيلية', desc: 'تتبع مصاريف المتجر الثابتة والمتغيرة بالدرهم الإماراتي لضبط التدفق النقدي.', icon: '💸', link: '/hub/ae/expenses' },
  { id: 'legal', title: 'مولد السياسات (اقتصادية دبي)', desc: 'أنشئ صفحات الاستبدال والاسترجاع وسياسة الخصوصية المتوافقة مع قوانين حماية المستهلك الإماراتي.', icon: '⚖', link: '/hub/ae/legal' },
  { id: 'jasmal', title: 'جاسمال (Jasmal) لتحليل المنافسين', desc: 'قارن أسعار المنتجات في السوق الإماراتي واسحب بيانات المتاجر المنافسة لملفات إكسل.', icon: '🕷️', link: '/hub/ae/jasmal' },
  { id: 'reviews', title: 'نظام طلب التقييمات الآلي', desc: 'أرسل رسائل تلقائية للعملاء عبر واتساب بعد الاستلام لجمع التقييمات وبناء الموثوقية.', icon: '⭐', link: '/hub/ae/reviews' },
  { id: 'dropshipping', title: 'حاسبة أرباح الدروبشيبينغ', desc: 'احسب هوامش الربح للمنتجات المستوردة مع أخذ رسوم الجمارك والشحن الدولي في الحسبان.', icon: '🌍', link: '/hub/ae/dropshipping' },
  { id: 'copy', title: 'مولد نصوص الإكسبلور (باللهجة الإماراتية)', desc: 'اصنع سكربتات تيك توك وإعلانات جذابة باللهجة المحلية لزيادة معدل التحويل.', icon: '✍', link: '/hub/ae/copy' },
  { id: 'support', title: 'قوالب خدمة العملاء السريعة', desc: 'انسخ ردود احترافية جاهزة للرد على استفسارات العملاء المكررة عبر واتساب.', icon: '🎧', link: '/hub/ae/support' },
  { id: 'promos', title: 'حاسبة جدوى أكواد الخصم والعروض', desc: 'تأكد من أن عروضك الترويجية (مثل 1+1 أو الشحن المجاني) لا تسبب لك خسائر مخفية.', icon: '🎟️', link: '/hub/ae/promos' },
  { id: 'ltv', title: 'حاسبة القيمة الدائمة للعميل (LTV)', desc: 'اعرف تكلفة الاستحواذ على العميل (CAC) وقيمته الفعلية لمتجرك على المدى الطويل.', icon: '🎯', link: '/hub/ae/ltv' },
  { id: 'ab_test', title: 'حاسبة اختبارات الإعلانات (A/B)', desc: 'قارن بين حملتين إعلانيتين لتعرف أيهما يحقق أفضل عائد بأقل تكلفة للطلب.', icon: '⚖️', link: '/hub/ae/ab-test' },
  { id: 'links', title: 'صانع روابط واتساب السريعة', desc: 'أنشئ روابط مخصصة برسائل جاهزة لبيو تيك توك أو تمريرها في حملات الانستقرام.', icon: '🔗', link: '/hub/ae/links' },
  { id: 'tips', title: 'أسرار نمو المتاجر الإماراتية', desc: 'مكتبة استراتيجيات حصرية لزيادة التحويل ورفع ولاء العملاء في السوق المحلي.', icon: '💡', link: '/hub/ae/tips' }
];

export default function EnjazyaUaeHub() {
  const [licenseKeyInput, setLicenseKeyInput] = useState<string>('');
  const [isActivated, setIsActivated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const LEMON_CHECKOUT_URL = 'https://enjazya.lemonsqueezy.com/checkout/buy/dce1dd80-3422-43ba-aed5-8ef2dcd38d6d?locale=en';

  useEffect(() => {
    const config = getInitialConfig();
    setLicenseKeyInput(config.licenseKey);
    setIsActivated(config.isActivated);
    if (typeof window !== 'undefined') {
      document.title = 'منصة إنجازيا | السوق الإماراتي 🇦🇪';
    }
  }, []);

  const handleActivateLicense = async () => {
    const cleanKey = licenseKeyInput.trim();
    if (!cleanKey) {
      alert('الرجاء إدخال مفتاح الترخيص المرسل إلى بريدك الإلكتروني.');
      return;
    }

    if (cleanKey.length < 10 || !cleanKey.includes('-')) {
      alert('❌ مفتاح الترخيص غير صالح! المفاتيح الصحيحة تُرسل لبريدك بعد إتمام الاشتراك فقط.');
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

      if (data.valid) {
        localStorage.setItem('merchant_license_key', cleanKey);
        setIsActivated(true);
        alert('✨ تم التحقق وتفعيل كافة الأدوات الـ 24 بنجاح!');
      } else {
        alert('❌ مفتاح الترخيص منتهي الصلاحية أو غير صحيح. تأكد من إدخال المفتاح المرسل لبريدك.');
      }
    } catch (error) {
      if (cleanKey.length >= 15 && cleanKey.includes('-')) {
        localStorage.setItem('merchant_license_key', cleanKey);
        setIsActivated(true);
        alert('✨ تم تفعيل كافة الأدوات الـ 24 بنجاح!');
      } else {
        alert('❌ مفتاح الترخيص غير صالح. يرجى استخدام مفتاح الاشتراك الصحيح.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeactivate = () => {
    if (confirm('هل أنت متأكد من إلغاء تفعيل المنصة؟ (سيعود الحساب للوضع التجريبي وستفقد الصلاحيات الكاملة)')) {
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
        if (key && (key.startsWith('seerk_ae_') || key.startsWith('enjazya_ae_') || key === 'merchant_license_key')) {
          allData[key] = localStorage.getItem(key) || '';
        }
      }
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(allData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `enjazya_uae_all_tools_backup_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      alert('📥 تم سحب وتصدير كافة بيانات مدخلات الأدوات الـ 24 للإمارات بنجاح!');
    } catch (error) {
      alert('حدث خطأ أثناء تصدير البيانات.');
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
          alert('✨ تم إدخال واستعادة بيانات جميع الأدوات الـ 24 بنجاح! سيتم تحديث الصفحة الآن.');
          window.location.reload();
        } catch (error) {
          alert('❌ ملف النسخة الاحتياطية غير صالح أو تالف.');
        }
      };
    }
  };

  return (
    <div className="hub-container" style={{ direction: 'rtl' }}>
      <style jsx global>{`
        a, .clean-link { text-decoration: none !important; color: inherit !important; }
      `}</style>
      
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        .hub-container { background-color: #f8fafc; min-height: 100vh; font-family: 'Tajawal', sans-serif; padding: 30px 20px 40px; }
        .navbar { max-width: 1250px; margin: 0 auto 20px; padding: 14px 24px; background: #ffffff; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); border: 1px solid #e2e8f0; flex-wrap: wrap; gap: 15px; position: relative; }
        .brand { font-size: 26px; font-weight: 900; color: #0f172a; white-space: nowrap; display: flex; align-items: center; gap: 12px; letter-spacing: -0.5px; }
        .ae-badge { background: #fef3c7; color: #92400e; font-size: 12px; font-weight: 800; padding: 5px 10px; border-radius: 6px; letter-spacing: normal; display: inline-flex; align-items: center; border: 1px solid #fde68a; }
        .nav-controls { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; flex-direction: row-reverse; }
        .action-btn-primary { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #0f172a; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 900; font-size: 14px; cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; gap: 6px; text-decoration: none; box-shadow: 0 4px 12px rgba(245,158,11,0.3); white-space: nowrap; }
        .action-btn-primary:hover { background: linear-gradient(135deg, #d97706 0%, #b45309 100%); color: #fff; transform: translateY(-1px); }
        .backup-action-btn { background: #0f172a; color: #fff; border: none; padding: 9px 14px; border-radius: 8px; font-weight: 800; font-size: 13px; cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; }
        .backup-action-btn:hover { background: #1e293b; }
        .restore-action-btn { background: #f8fafc; color: #334155; border: 1px solid #cbd5e1; padding: 9px 14px; border-radius: 8px; font-weight: 800; font-size: 13px; cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; }
        .restore-action-btn:hover { background: #e2e8f0; }
        .license-box { display: flex; align-items: center; gap: 8px; background: #ffffff; padding: 6px 12px; border-radius: 8px; border: 1px solid #cbd5e1; }
        .license-input { border: 1px solid #cbd5e1; border-radius: 6px; padding: 7px 10px; font-size: 12px; outline: none; width: 140px; background: #fff; color: #0f172a; }
        .license-input:focus { border-color: #f59e0b; box-shadow: 0 0 0 2px rgba(245,158,11,0.15); }
        .backup-warning-bar { max-width: 1250px; margin: 0 auto 25px; background: #fffbeb; border: 1px solid #fde68a; color: #92400e; padding: 10px 18px; border-radius: 10px; font-size: 13px; font-weight: 700; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; }
        .promo-banner { max-width: 1250px; margin: 0 auto 35px; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #fff; border-radius: 16px; padding: 22px 32px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px; box-shadow: 0 12px 30px rgba(15,23,42,0.2); border: 2px solid #f59e0b; position: relative; overflow: hidden; }
        .promo-content { display: flex; flex-direction: column; gap: 8px; z-index: 1; }
        .promo-heading { font-size: 17px; font-weight: 900; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; color: #ffffff; }
        .promo-text { font-size: 14px; font-weight: 700; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .price-tag-new { background: #f59e0b; color: #0f172a; padding: 3px 10px; border-radius: 8px; font-weight: 900; font-size: 15px; }
        .price-tag-old { text-decoration: line-through; opacity: 0.75; font-size: 13px; font-weight: 800; }
        .discount-badge { background: #ef4444; color: #fff; padding: 2px 8px; border-radius: 6px; font-size: 12px; font-weight: 900; }
        .promo-btn { background: #f59e0b; color: #0f172a; border: none; padding: 12px 26px; border-radius: 12px; font-weight: 900; font-size: 14px; cursor: pointer; transition: all 0.25s ease; box-shadow: 0 6px 15px rgba(245,158,11,0.3); z-index: 1; white-space: nowrap; }
        .promo-btn:hover { background: #d97706; color: #fff; transform: translateY(-3px); }
        .hero { text-align: center; max-width: 800px; margin: 0 auto 50px; }
        .hero h1 { font-size: 36px; font-weight: 900; color: #0f172a; margin-bottom: 15px; letter-spacing: -0.5px; }
        .hero h1 span { color: #d97706; }
        .hero p { color: #475569; font-size: 16px; line-height: 1.7; font-weight: 500; }
        .cards-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; max-width: 1250px; margin: 0 auto 60px; }
        .card { background: #ffffff; border-radius: 12px; padding: 24px; border: 2px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.02); transition: all 0.3s ease; display: flex; flex-direction: column; justify-content: space-between; text-align: start; }
        .card:hover { transform: translateY(-5px); border-color: #f59e0b; box-shadow: 0 15px 30px -5px rgba(245,158,11,0.15); }
        .card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
        .card-icon { font-size: 28px; background: #f8fafc; width: 55px; height: 55px; display: flex; align-items: center; justify-content: center; border-radius: 10px; border: 1px solid #e2e8f0; }
        .card:hover .card-icon { background: #fef3c7; border-color: #fde68a; }
        .card-badge { background: #f1f5f9; color: #475569; font-size: 14px; font-weight: 900; padding: 6px 14px; border-radius: 8px; }
        .card:hover .card-badge { color: #d97706; background: #fef3c7; }
        .card h3 { font-size: 18px; font-weight: 900; color: #0f172a; margin-bottom: 10px; line-height: 1.4; transition: color 0.3s ease; }
        .card:hover h3 { color: #d97706; }
        .card p { color: #64748b; font-size: 13.5px; line-height: 1.6; font-weight: 500; margin-bottom: 24px; min-height: 50px; }
        .card-btn { background: #fef3c7; color: #92400e; text-align: center; padding: 14px; border-radius: 8px; font-weight: 800; font-size: 14px; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .card:hover .card-btn { background: #f59e0b; color: #0f172a; box-shadow: 0 4px 12px rgba(245,158,11,0.25); }
        .footer { max-width: 1250px; margin: 0 auto; background: #0f172a; border-radius: 16px; padding: 40px; color: #f8fafc; border: 2px solid #334155; text-align: start; }
        .footer-content { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 30px; margin-bottom: 30px; border-bottom: 1px solid #334155; padding-bottom: 30px; }
        .footer-brand { max-width: 400px; }
        .footer-brand h3 { font-size: 24px; font-weight: 900; margin-bottom: 15px; color: #ffffff; letter-spacing: -0.5px; }
        .footer-brand h3 span { color: #f59e0b; letter-spacing: normal; }
        .footer-brand p { color: #94a3b8; font-size: 14px; line-height: 1.8; font-weight: 500; }
        .footer-links { display: flex; gap: 60px; }
        .links-column h4 { color: #ffffff; font-size: 16px; font-weight: 800; margin-bottom: 20px; border-right: 3px solid #f59e0b; padding-right: 8px; }
        .links-column ul { list-style: none; padding: 0; margin: 0; }
        .links-column ul li { margin-bottom: 12px; }
        .links-column ul li a { color: #94a3b8 !important; font-size: 14px; font-weight: 500; transition: color 0.2s; }
        .links-column ul li a:hover { color: #f59e0b !important; }
        .footer-bottom { text-align: center; color: #64748b; font-size: 14px; font-weight: 500; }

        @media(max-width: 1024px) { .cards-grid { grid-template-columns: repeat(2, 1fr); } .footer-content { flex-direction: column; } }
        @media(max-width: 640px) { .cards-grid { grid-template-columns: 1fr; } .hero h1 { font-size: 28px; } .footer-links { flex-direction: column; gap: 30px; } .nav-controls { flex-direction: row; } }
      `}</style>
      
      <div className="navbar">
        <div className="brand">
          إنجازيا <span className="ae-badge">السوق الإماراتي AE 🇦🇪</span>
        </div>

        <div className="nav-controls">
          <a href={LEMON_CHECKOUT_URL} target="_blank" rel="noopener noreferrer" className="action-btn-primary" title="ترقية الحساب">
            ⚡ ترقية (49.99 د.إ)
          </a>

          <button onClick={handleExportAllData} className="backup-action-btn" title="تصدير كافة مدخلات الأدوات الـ 24">
            تصدير البيانات 💾
          </button>

          <button onClick={() => fileInputRef.current?.click()} className="restore-action-btn" title="استيراد وتوزيع البيانات على الأدوات">
            استعادة البيانات 📂
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImportAllData} 
            accept=".json" 
            style={{ display: 'none' }} 
          />

          <div className="license-box">
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#475569' }}>🔑 ترخيص PRO:</span>
            {isActivated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 900, color: '#d97706', padding: '4px 8px' }}>المنصة مفعلة ✓</span>
                <button 
                  onClick={handleDeactivate}
                  style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif' }}
                  title="إلغاء التفعيل للعودة للوضع التجريبي"
                >
                  إلغاء التفعيل ❌
                </button>
              </div>
            ) : (
              <>
                <input 
                  type="text" 
                  className="license-input"
                  placeholder="مفتاح الاشتراك الرسمي..." 
                  value={licenseKeyInput} 
                  onChange={(e) => setLicenseKeyInput(e.target.value)}
                />
                <button 
                  onClick={handleActivateLicense}
                  disabled={isLoading}
                  style={{ background: '#f59e0b', color: '#0f172a', border: 'none', padding: '7px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 900, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif', opacity: isLoading ? 0.7 : 1 }}
                >
                  {isLoading ? 'جاري التحقق...' : 'تفعيل'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="backup-warning-bar">
        <span>⚠ تنبيه مهم: بياناتك تُحفظ محلياً في متصفحك لضمان خصوصيتك. احرص على استخدام زر <b>"تصدير البيانات"</b> دورياً لحفظ جميع مدخلاتك للأدوات الـ 24 واستعادتها بأي وقت.</span>
      </div>

      {!isActivated && (
        <div className="promo-banner">
          <div className="promo-content">
            <div className="promo-heading">
              🔥 عرض لفترة محدودة: احصل على الوصول الكامل لجميع الأدوات الـ 24!
            </div>
            <div className="promo-text">
              <span>كان بـ <span className="price-tag-old">299 د.إ</span> شهرياً، والآن فقط</span>
              <span className="price-tag-new">49.99 د.إ</span>
              <span>شهرياً!</span>
              <span className="discount-badge">تخفيض 83% 🏷</span>
            </div>
          </div>
          <a href={LEMON_CHECKOUT_URL} target="_blank" rel="noopener noreferrer">
            <button className="promo-btn">
              🚀 ترقية حسابك الآن وفتح كل الأدوات
            </button>
          </a>
        </div>
      )}

      <div className="hero">
        <h1>منصة إنجازيا <span>ULTRA MAX للسوق الإماراتي</span></h1>
        <p>الترسانة السحابية المتكاملة بـ 24 أداة دقيقة، صُممت خصيصاً لتمكين وتطوير المتاجر الإلكترونية في الإمارات العربية المتحدة بالدرهم الإماراتي (د.إ) ومتوافقة مع متطلبات ضريبة القيمة المضافة.</p>
      </div>

      <div className="cards-grid">
        {aeTools.map((tool, index) => (
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
            <h3>إنجازيا <span>الإمارات 🇦🇪</span></h3>
            <p>المنصة السحابية الأولى المخصصة لتمكين تجار التجارة الإلكترونية في الإمارات العربية المتحدة. أدوات دقيقة، حسابات ضريبية متوافقة مع الهيئة الاتحادية للضرائب، وأرباح مضاعفة.</p>
          </div>
          
          <div className="footer-links">
            <div className="links-column">
              <h4>المنصة</h4>
              <ul>
                <li><Link href="/hub/ae">جميع الأدوات (24)</Link></li>
                <li><Link href="/ae/pricing">أسعار الباقات</Link></li>
                <li><Link href="/ae/updates">التحديثات الجديدة</Link></li>
              </ul>
            </div>
            <div className="links-column">
              <h4>الدعم والمساعدة</h4>
              <ul>
                <li><Link href="/ae/support/contact">الدعم الفني</Link></li>
                <li><Link href="/ae/support/faq">الأسئلة الشائعة</Link></li>
              </ul>
            </div>
            <div className="links-column">
              <h4>الأنظمة والقوانين</h4>
              <ul>
                <li><Link href="/ae/legal/terms">شروط الاستخدام</Link></li>
                <li><Link href="/ae/legal/privacy">سياسة الخصوصية</Link></li>
              </ul>
            </div>
          </div>
          
        </div>
        <div className="footer-bottom">
          <p>جميع الحقوق محفوظة © 2026 منصة إنجازيا لتمكين التجارة الإلكترونية في الإمارات العربية المتحدة</p>
        </div>
      </footer>
    </div>
  );
}
