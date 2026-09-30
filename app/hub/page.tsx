'use client';

import React from 'react';
import Link from 'next/link';

export default function EngaziaHomeHub() {
  const tools = [
    { id: 'whatsapp', title: 'إدارة عملاء واتساب والمبيعات', desc: 'إدارة السلال المتروكة، إرسال روابط الدفع، وتصنيف عملاء الـ VIP.', icon: '💬', link: '/hub/whatsapp', badge: 'الأهم' },
    { id: 'profit', title: 'حاسبة أرباح ونقاط التعادل', desc: 'احسب صافي أرباح منتجك بدقة بعد خصم التكاليف والإعلانات.', icon: '📊', link: '/hub/profit', badge: 'أساسي' },
    { id: 'invoices', title: 'مولد الفواتير وسندات القبض', desc: 'أنشئ فواتير مبيعات نظامية واحترافية وجهزها للإرسال الفوري.', icon: '🧾', link: '/hub/invoices', badge: 'مهم جداً' },
    { id: 'returns', title: 'حاسبة وتحليل خسائر المرتجعات', desc: 'قس تأثير الاسترجاع والاستبدال على صافي أرباحك الشهرية.', icon: '🔄', link: '/hub/returns', badge: 'حساس' },
    { id: 'expenses', title: 'مدير المصاريف والنفقات', desc: 'تتبع مصاريف المتجر الثابتة والمتغيرة لضبط التدفق النقدي.', icon: '💸', link: '/hub/expenses', badge: 'مالي' },
    { id: 'legal', title: 'مولد السياسات القانونية للمتجر', desc: 'أنشئ صفحات الاستبدال، الاسترجاع، والخصوصية المتوافقة نظامياً.', icon: '⚖️️', link: '/hub/legal', badge: 'قانوني' },
    { id: 'roas', title: 'محلل عائد الإنفاق الإعلاني', desc: 'قس بدقة أداء إعلانات سناب وتيك توك وهل هي رابحة أم خاسرة.', icon: '📈', link: '/hub/roas', badge: 'تسويق' },
    { id: 'fees', title: 'حاسبة رسوم بوابات الدفع', desc: 'احسب نسبة بوابات الدفع (تاب، مدى، تابي) وتأثيرها على الأرباح.', icon: '💳', link: '/hub/fees', badge: 'مالي' },
    { id: 'copy', title: 'مولد النصوص التسويقية والإعلانات', desc: 'اصنع سكربتات تيك توك وإعلانات جذابة لزيادة مبيعات منتجاتك.', icon: '✍️', link: '/hub/copy', badge: 'محتوى' },
    { id: 'promos', title: 'ممول وأكواد خصم المتاجر', desc: 'أدر وأنشئ أكواد الخصم السريعة لتحفيز العملاء المترددين.', icon: '🎟️', link: '/hub/promos', badge: 'مبيعات' },
    { id: 'shipping', title: 'مدير تتبع الشحنات والتوصيل', desc: 'تابع حالات الشحنات وحل مشاكل استفسارات العملاء اليومية.', icon: '📦', link: '/hub/shipping', badge: 'تشغيل' },
    { id: 'scraper', title: 'تنسيق وتنظيف بيانات الإكسل', desc: 'نظف قوائم المنتجات والأسعار العشوائية وحولها لملفات مرتبة.', icon: '⚡', link: '/hub/scraper', badge: 'أدوات' },
    { id: 'links', title: 'صانع روابط واتساب المباشرة', desc: 'أنشئ روابط مخصصة برسائل جاهزة للبايو في تيك توك وإعلاناتك.', icon: '🔗', link: '/hub/links', badge: 'تواصل' },
    { id: 'reviews', title: 'أداة طلب وتقييمات العملاء', desc: 'ارسل رسائل تلقائية للعملاء بعد الاستلام لجمع التقييمات وبناء الثقة.', icon: '⭐', link: '/hub/reviews', badge: 'ثقة' },
    { id: 'support', title: 'ردود خدمة العملاء السريعة', desc: 'انسخ ردود احترافية جاهزة للرد على استفسارات العملاء المكررة.', icon: '🎧', link: '/hub/support', badge: 'دعم' },
    { id: 'tips', title: 'مكتبة أسرار وحيل نمو المتاجر', desc: 'استراتيجيات حصرية لزيادة التحويل ورفع ولاء العملاء.', icon: '💡', link: '/hub/tips', badge: 'استشارات' }
  ];

  return (
    <div className="hub-container">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        
        .hub-container { 
          background-color: #f4f7fb; 
          min-height: 100vh; 
          font-family: 'Tajawal', sans-serif; 
          direction: rtl; 
          padding: 20px 15px 60px; 
        }

        /* منع التنسيق الافتراضي للروابط وإزالة الخطوط السفلية */
        a { text-decoration: none !important; color: inherit; }
        
        .navbar { 
          max-width: 1250px; 
          margin: 0 auto 30px; 
          padding: 18px 25px; 
          background: #ffffff; 
          border-radius: 14px; 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.03); 
          border: 1px solid #e2e8f0; 
        }
        
        .brand { font-size: 20px; font-weight: 900; color: #2563eb; }
        .badge-live { 
          background: #dcfce7; color: #15803d; padding: 6px 14px; border-radius: 20px; 
          font-size: 13px; font-weight: 700; display: flex; align-items: center; gap: 6px; 
        }
        .badge-live::before { content: ''; width: 8px; height: 8px; background-color: #22c55e; border-radius: 50%; }
        
        .hero { text-align: center; max-width: 800px; margin: 0 auto 40px; }
        .hero h1 { font-size: 32px; font-weight: 900; color: #0f172a; margin-bottom: 12px; }
        .hero h1 span { color: #2563eb; }
        .hero p { color: #64748b; font-size: 16px; line-height: 1.6; }

        /* الشبكة الذكية: 4 مربعات للكمبيوتر، 2 للتابلت، 1 للجوال */
        .cards-grid { 
          display: grid; 
          grid-template-columns: repeat(4, 1fr); 
          gap: 20px; 
          max-width: 1250px; 
          margin: 0 auto; 
        }
        
        .card { 
          background: #ffffff; 
          border-radius: 16px; 
          padding: 22px; 
          border: 1px solid #e2e8f0; 
          box-shadow: 0 4px 15px rgba(0,0,0,0.02); 
          transition: all 0.3s ease; 
          display: flex; 
          flex-direction: column; 
          justify-content: space-between; 
          position: relative; 
          overflow: hidden;
          text-align: right;
        }
        
        .card:hover { 
          transform: translateY(-6px); 
          border-color: #3b82f6; 
          box-shadow: 0 15px 30px -5px rgba(37, 99, 235, 0.12); 
        }

        .card-top { 
          display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; 
        }
        
        .card-icon { 
          font-size: 26px; background: #eff6ff; width: 48px; height: 48px; 
          display: flex; align-items: center; justify-content: center; 
          border-radius: 12px; border: 1px solid #bfdbfe; 
        }
        
        .card-badge { 
          background: #f1f5f9; color: #475569; font-size: 11px; font-weight: 700; 
          padding: 4px 10px; border-radius: 20px; 
        }

        .card h3 { 
          font-size: 17px; font-weight: 800; color: #1e293b; margin-bottom: 8px; line-height: 1.4;
        }
        
        .card p { 
          color: #64748b; font-size: 13px; line-height: 1.6; margin-bottom: 22px; 
          min-height: 42px; /* توحيد ارتفاع النصوص */
        }
        
        .card-btn { 
          background: #f1f5f9; color: #3b82f6; text-align: center; padding: 12px; 
          border-radius: 10px; font-weight: 800; font-size: 13px; 
          transition: all 0.3s ease; display: flex; align-items: center; 
          justify-content: center; gap: 6px; 
        }
        
        .card:hover .card-btn { 
          background: #2563eb; color: #ffffff; 
        }

        /* توافق الشاشات (Responsive) */
        @media(max-width: 1024px) { 
          .cards-grid { grid-template-columns: repeat(2, 1fr); } 
        }
        @media(max-width: 640px) { 
          .cards-grid { grid-template-columns: 1fr; } 
          .hero h1 { font-size: 26px; } 
        }
      `}</style>

      <div className="navbar">
        <div className="brand">إنجازيا | ENGAZIA</div>
        <div className="badge-live">نظام 16 أداة مُفعل</div>
      </div>

      <div className="hero">
        <h1>منصة إنجازيا <span>ULTRA MAX</span></h1>
        <p>الترسانة السحابية المتكاملة لرواد التجارة الإلكترونية، 16 أداة تغنيك عن كل الاشتراكات الأخرى.</p>
      </div>

      <div className="cards-grid">
        {tools.map((tool, index) => (
          <Link href={tool.link} key={tool.id} className="card">
            <div>
              <div className="card-top">
                <div className="card-icon">{tool.icon}</div>
                <span className="card-badge">#{index + 1} - {tool.badge}</span>
              </div>
              <h3>{tool.title}</h3>
              <p>{tool.desc}</p>
            </div>
            <div className="card-btn">
              <span>تشغيل الأداة مباشرة</span>
              <span>←</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
