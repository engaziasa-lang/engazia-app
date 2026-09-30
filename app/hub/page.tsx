'use client';

import React from 'react';
import Link from 'next/link';

export default function EngaziaHomeHub() {
  const tools = [
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
  ];

  return (
    <div className="hub-container">
      <style jsx global>{`
        a, .clean-link { text-decoration: none !important; color: inherit !important; }
      `}</style>
      
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        
        .hub-container { background-color: #f8fafc; min-height: 100vh; font-family: 'Tajawal', sans-serif; direction: rtl; padding: 30px 20px 40px; }
        .navbar { max-width: 1250px; margin: 0 auto 35px; padding: 20px 30px; background: #ffffff; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); border: 2px solid #cbd5e1; }
        .brand { font-size: 22px; font-weight: 900; color: #0f172a; }
        .brand span { color: #4f46e5; }
        .badge-live { background: #dcfce7; color: #166534; padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 800; display: flex; align-items: center; gap: 8px; border: 1px solid #bbf7d0; }
        .badge-live::before { content: ''; width: 8px; height: 8px; background-color: #16a34a; border-radius: 50%; }
        
        .hero { text-align: center; max-width: 800px; margin: 0 auto 50px; }
        .hero h1 { font-size: 36px; font-weight: 900; color: #0f172a; margin-bottom: 15px; letter-spacing: -0.5px; }
        .hero h1 span { color: #4f46e5; }
        .hero p { color: #475569; font-size: 16px; line-height: 1.7; font-weight: 500; }

        .cards-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; max-width: 1250px; margin: 0 auto 60px; }
        
        .card { 
          background: #ffffff; border-radius: 12px; padding: 24px; border: 2px solid #cbd5e1; box-shadow: 0 2px 4px rgba(0,0,0,0.02); 
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); display: flex; flex-direction: column; justify-content: space-between; position: relative; overflow: hidden;
        }
        
        .card:hover { 
          transform: scale(1.03) translateY(-5px); border-color: #4f46e5; 
          box-shadow: 0 25px 30px -5px rgba(79, 70, 229, 0.2), 0 10px 10px -5px rgba(79, 70, 229, 0.1); z-index: 10;
        }

        .card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
        .card-icon { font-size: 28px; background: #f8fafc; width: 55px; height: 55px; display: flex; align-items: center; justify-content: center; border-radius: 10px; border: 2px solid #cbd5e1; transition: all 0.3s ease; }
        .card:hover .card-icon { border-color: #c7d2fe; background: #e0e7ff; }
        
        .card-badge { background: #f1f5f9; color: #334155; font-size: 14px; font-weight: 900; padding: 6px 14px; border-radius: 8px; border: 2px solid #cbd5e1; }
        .card:hover .card-badge { border-color: #c7d2fe; color: #4f46e5; }

        .card h3 { font-size: 18px; font-weight: 900; color: #0f172a; margin-bottom: 10px; line-height: 1.4; transition: color 0.3s ease; }
        .card:hover h3 { color: #4f46e5; }
        
        .card p { color: #64748b; font-size: 14px; line-height: 1.6; font-weight: 500; margin-bottom: 24px; min-height: 48px; }
        
        .card-btn { 
          background: #e0e7ff; color: #4f46e5; text-align: center; padding: 14px; border-radius: 8px; font-weight: 800; font-size: 14px; 
          transition: all 0.3s ease; border: 2px solid transparent; display: flex; align-items: center; justify-content: center; gap: 8px; 
        }
        
        .card:hover .card-btn { background: #4f46e5; color: #ffffff; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25); }

        /* تنسيقات الفوتر الاحترافي */
        .footer {
          max-width: 1250px;
          margin: 0 auto;
          background: #0f172a;
          border-radius: 16px;
          padding: 40px;
          color: #f8fafc;
          border: 1px solid #1e293b;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        .footer-content {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 30px;
          margin-bottom: 30px;
          border-bottom: 1px solid #334155;
          padding-bottom: 30px;
        }

        .footer-brand {
          max-width: 400px;
        }

        .footer-brand h3 {
          font-size: 24px;
          font-weight: 900;
          margin-bottom: 15px;
          color: #ffffff;
        }
        
        .footer-brand h3 span {
          color: #818cf8;
        }

        .footer-brand p {
          color: #94a3b8;
          font-size: 14px;
          line-height: 1.8;
          font-weight: 500;
        }

        .footer-links {
          display: flex;
          gap: 60px;
        }

        .links-column h4 {
          color: #ffffff;
          font-size: 16px;
          font-weight: 800;
          margin-bottom: 20px;
        }

        .links-column ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .links-column ul li {
          margin-bottom: 12px;
        }

        .links-column ul li a {
          color: #94a3b8 !important;
          font-size: 14px;
          font-weight: 500;
          transition: color 0.2s ease;
        }

        .links-column ul li a:hover {
          color: #818cf8 !important;
        }

        .footer-bottom {
          text-align: center;
          color: #64748b;
          font-size: 14px;
          font-weight: 500;
        }

        @media(max-width: 1024px) { 
          .cards-grid { grid-template-columns: repeat(2, 1fr); } 
          .footer-content { flex-direction: column; }
        }
        @media(max-width: 640px) { 
          .cards-grid { grid-template-columns: 1fr; } 
          .hero h1 { font-size: 28px; } 
          .footer-links { flex-direction: column; gap: 30px; }
        }
      `}</style>

      <div className="navbar">
        <div className="brand">إنجازيا <span>ENGAZIA</span></div>
        <div className="badge-live">النظام مفعل</div>
      </div>

      <div className="hero">
        <h1>منصة إنجازيا <span>ULTRA MAX</span></h1>
        <p>الترسانة السحابية المتكاملة لرواد التجارة الإلكترونية، 16 أداة تغنيك عن كل الاشتراكات الأخرى.</p>
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
              <span>تشغيل الأداة</span>
              <span>←</span>
            </div>
          </Link>
        ))}
      </div>

      {/* الفوتر الاحترافي */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>إنجازيا <span>ENGAZIA</span></h3>
            <p>المنصة السحابية الأولى لتمكين تجار التجارة الإلكترونية. أدوات ذكية، قرارات دقيقة، أرباح مضاعفة تغنيك عن جميع الاشتراكات الأخرى.</p>
          </div>
          <div className="footer-links">
            <div className="links-column">
              <h4>المنصة</h4>
              <ul>
                <li><a href="#">جميع الأدوات</a></li>
                <li><a href="#">التحديثات الجديدة</a></li>
                <li><a href="#">أسعار الباقات</a></li>
              </ul>
            </div>
            <div className="links-column">
              <h4>الدعم والمساعدة</h4>
              <ul>
                <li><a href="#">تواصل معنا</a></li>
                <li><a href="#">شروحات الاستخدام</a></li>
                <li><a href="#">الأسئلة الشائعة</a></li>
              </ul>
            </div>
            <div className="links-column">
              <h4>قانوني</h4>
              <ul>
                <li><a href="#">شروط الاستخدام</a></li>
                <li><a href="#">سياسة الخصوصية</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>جميع الحقوق محفوظة © 2026 منصة إنجازيا لتمكين التجارة الإلكترونية</p>
        </div>
      </footer>
    </div>
  );
}
