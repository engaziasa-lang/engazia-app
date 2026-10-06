'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';

const getInitialConfig = () => {
  if (typeof window === 'undefined') {
    return { lang: 'ar', currency: 'AED' };
  }
  
  localStorage.setItem('seerk_global_lang', 'ar');
  localStorage.setItem('seerk_global_currency', 'AED');

  return { lang: 'ar', currency: 'AED' };
};

interface ToolInfo {
  id: string;
  title: string;
  desc: string;
  icon: string;
  link: string;
}

// قائمة بجميع أدوات إنجازيا الـ 24 المخصصة للسوق الإماراتي
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getInitialConfig();
    if (typeof window !== 'undefined') {
      document.title = 'منصة إنجازيا | السوق الإماراتي 🇦🇪';
    }
  }, []);

  const handleExportAllData = () => {
    try {
      const allData: Record<string, string> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('seerk_ae_') || key.startsWith('enjazya_ae_'))) {
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
        
        .navbar { max-width: 1250px; margin: 0 auto 20px; padding: 12px 24px; background: #ffffff; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); border: 1px solid #cbd5e1; flex-wrap: wrap; gap: 15px; }
        .brand { font-size: 26px; font-weight: 900; color: #0f172a; white-space: nowrap; display: flex; align-items: center; gap: 12px; font-family: system-ui, -apple-system, sans-serif; letter-spacing: -0.5px; }
        .ae-badge { background: #dcfce7; color: #166534; font-size: 12px; font-weight: 800; padding: 5px 10px; border-radius: 6px; font-family: 'Tajawal', sans-serif; letter-spacing: normal; display: inline-flex; align-items: center; }
        
        .nav-controls { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; flex-direction: row-reverse; }
        
        .backup-action-btn { background: #0f172a; color: #fff; border: none; padding: 8px 14px; border-radius: 8px; font-weight: 800; font-size: 13px; cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; gap: 6px; font-family: 'Tajawal', sans-serif; }
        .backup-action-btn:hover { background: #1e293b; }

        .restore-action-btn { background: #f8fafc; color: #334155; border: 1px solid #cbd5e1; padding: 8px 14px; border-radius: 8px; font-weight: 800; font-size: 13px; cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; gap: 6px; font-family: 'Tajawal', sans-serif; }
        .restore-action-btn:hover { background: #e2e8f0; }

        .backup-warning-bar { max-width: 1250px; margin: 0 auto 25px; background: #fffbeb; border: 1px solid #fde68a; color: #92400e; padding: 10px 18px; border-radius: 10px; font-size: 13px; font-weight: 700; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; }

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
        .links-column ul li a { color: #94a3b8 !important; font-size: 14px; font-weight: 500; transition: color 0.2s; }
        .links-column ul li a:hover { color: #34d399 !important; }
        .footer-bottom { text-align: center; color: #64748b; font-size: 14px; font-weight: 500; }

        @media(max-width: 1024px) { .cards-grid { grid-template-columns: repeat(2, 1fr); } .footer-content { flex-direction: column; } }
        @media(max-width: 640px) { .cards-grid { grid-template-columns: 1fr; } .hero h1 { font-size: 28px; } .footer-links { flex-direction: column; gap: 30px; } .nav-controls { flex-direction: row; } }
      `}</style>
      
      <div className="navbar">
        <div className="brand">
          إنجازيا <span className="ae-badge">السوق الإماراتي AE</span>
        </div>

        <div className="nav-controls">
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
        </div>
      </div>

      <div className="backup-warning-bar">
        <span>⚠ تنبيه مهم: بياناتك تُحفظ محلياً في متصفحك لضمان خصوصيتك. احرص على استخدام زر <b>"تصدير البيانات"</b> دورياً لحفظ جميع مدخلاتك للأدوات الـ 24 واستعادتها بأي وقت.</span>
      </div>

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
            <h3>إنجازيا <span>الإمارات</span></h3>
            <p>المنصة السحابية الأولى المخصصة لتمكين تجار التجارة الإلكترونية في الإمارات العربية المتحدة. أدوات دقيقة، حسابات ضريبية متوافقة مع الهيئة الاتحادية للضرائب، وأرباح مضاعفة.</p>
          </div>
          
          <div className="footer-links">
            <div className="links-column">
              <h4>المنصة</h4>
              <ul>
                <li><Link href="/hub/ae">جميع الأدوات (24)</Link></li>
                <li><Link href="/updates">التحديثات الجديدة</Link></li>
                <li><Link href="/pricing">أسعار الباقات</Link></li>
              </ul>
            </div>
            <div className="links-column">
              <h4>الدعم والمساعدة</h4>
              <ul>
                <li><Link href="/support/contact">الدعم الفني</Link></li>
                <li><Link href="/support/faq">الأسئلة الشائعة</Link></li>
              </ul>
            </div>
            <div className="links-column">
              <h4>الأنظمة والقوانين</h4>
              <ul>
                <li><Link href="/legal/terms">شروط الاستخدام</Link></li>
                <li><Link href="/legal/privacy">سياسة الخصوصية</Link></li>
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
