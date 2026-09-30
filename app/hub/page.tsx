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
        
        .hub-container { background-color: #f8fafc; min-height: 100vh; font-family: 'Tajawal', sans-serif; direction: rtl; padding: 30px 20px 70px; }
        .navbar { max-width: 1250px; margin: 0 auto 35px; padding: 20px 30px; background: #ffffff; border-radius: 16px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); border: 2px solid #e2e8f0; }
        .brand { font-size: 22px; font-weight: 900; color: #0f172a; }
        .brand span { color: #4f46e5; }
        .badge-live { background: #dcfce7; color: #166534; padding: 8px 16px; border-radius: 30px; font-size: 13px; font-weight: 800; display: flex; align-items: center; gap: 8px; }
        .badge-live::before { content: ''; width: 8px; height: 8px; background-color: #16a34a; border-radius: 50%; }
        
        .hero { text-align: center; max-width: 800px; margin: 0 auto 50px; }
        .hero h1 { font-size: 36px; font-weight: 900; color: #0f172a; margin-bottom: 15px; letter-spacing: -0.5px; }
        .hero h1 span { color: #4f46e5; }
        .hero p { color: #475569; font-size: 16px; line-height: 1.7; font-weight: 500; }

        .cards-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; max-width: 1250px; margin: 0 auto; }
        
        /* التحديث هنا: إضافة حدود واضحة وظل للبطاقات */
        .card { 
          background: #ffffff; 
          border-radius: 20px; 
          padding: 26px; 
          border: 2px solid #e2e8f0; /* تحديد بحدود بلون رمادي فاتح */
          box-shadow: 0 4px 6px rgba(0,0,0,0.05); /* ظل خفيف للعمق */
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
          display: flex; flex-direction: column; justify-content: space-between; position: relative; overflow: hidden;
        }
        
        /* تأثير عند تمرير الماوس: يتغير لون الحدود والظل */
        .card:hover { 
          transform: translateY(-8px); 
          border-color: #4f46e5; /* يتغير لون الحدود إلى النيلي */
          box-shadow: 0 20px 40px -10px rgba(79, 70, 229, 0.15); 
        }

        .card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
        .card-icon { font-size: 28px; background: #f8fafc; width: 55px; height: 55px; display: flex; align-items: center; justify-content: center; border-radius: 14px; border: 2px solid #e2e8f0; }
        .card-badge { background: #f1f5f9; color: #334155; font-size: 14px; font-weight: 900; padding: 6px 14px; border-radius: 30px; border: 2px solid #e2e8f0; }

        .card h3 { font-size: 18px; font-weight: 900; color: #0f172a; margin-bottom: 10px; line-height: 1.4; }
        .card p { color: #64748b; font-size: 14px; line-height: 1.6; font-weight: 500; margin-bottom: 24px; min-height: 48px; }
        
        .card-btn { 
          background: #e0e7ff; 
          color: #4f46e5; 
          text-align: center; padding: 14px; border-radius: 12px; font-weight: 800; font-size: 14px; 
          transition: all 0.3s ease; border: none; display: flex; align-items: center; justify-content: center; gap: 8px; 
        }
        
        .card:hover .card-btn { 
          background: #4f46e5; 
          color: #ffffff; 
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25); 
        }

        @media(max-width: 1024px) { .cards-grid { grid-template-columns: repeat(2, 1fr); } }
        @media(max-width: 640px) { .cards-grid { grid-template-columns: 1fr; } .hero h1 { font-size: 28px; } }
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
    </div>
  );
}
