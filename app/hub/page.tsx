'use client';

import React from 'react';
import Link from 'next/link';

export default function EngaziaHomeHub() {
  return (
    <div className="hub-container">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');

        .hub-container {
          background-color: #030712;
          color: #f8fafc;
          min-height: 100vh;
          font-family: 'Tajawal', sans-serif;
          direction: rtl;
          position: relative;
          overflow-x: hidden;
          padding: 0 20px 60px;
        }

        /* تأثيرات الخلفية المضيئة المذهلة */
        .hub-container::before {
          content: '';
          position: absolute;
          top: -100px;
          right: 50%;
          transform: translateX(50%);
          width: 600px;
          height: 350px;
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.25), rgba(147, 51, 234, 0.25));
          filter: blur(120px);
          z-index: 0;
          pointer-events: none;
        }

        .navbar {
          max-width: 1200px;
          margin: 0 auto;
          padding: 24px 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          z-index: 10;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .brand {
          font-size: 20px;
          font-weight: 900;
          background: linear-gradient(to left, #60a5fa, #c084fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .badge-live {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 700;
          border: 1px solid rgba(52, 211, 153, 0.3);
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .badge-live::before {
          content: '';
          width: 8px;
          height: 8px;
          background-color: #34d399;
          border-radius: 50%;
          box-shadow: 0 0 8px #34d399;
        }

        .hero {
          text-align: center;
          max-width: 850px;
          margin: 60px auto 40px;
          position: relative;
          z-index: 10;
        }

        .hero h1 {
          font-size: 42px;
          font-weight: 900;
          color: #ffffff;
          margin-bottom: 16px;
          line-height: 1.3;
        }

        .hero h1 span {
          background: linear-gradient(to left, #3b82f6, #a855f7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero p {
          color: #94a3b8;
          font-size: 18px;
          line-height: 1.7;
          max-width: 700px;
          margin: 0 auto;
        }

        /* شبكة البطاقات الفاخرة */
        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 24px;
          max-width: 1100px;
          margin: 40px auto 0;
          position: relative;
          z-index: 10;
        }

        .card {
          background: rgba(17, 24, 39, 0.7);
          border-radius: 20px;
          padding: 35px 30px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(12px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          text-decoration: none;
          position: relative;
          overflow: hidden;
        }

        .card::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.08), transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .card:hover {
          transform: translateY(-8px);
          border-color: rgba(59, 130, 246, 0.5);
          box-shadow: 0 25px 35px -5px rgba(37, 99, 235, 0.2);
        }

        .card:hover::after {
          opacity: 1;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .card-icon {
          font-size: 40px;
          background: rgba(59, 130, 246, 0.1);
          width: 70px;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
          border: 1px solid rgba(59, 130, 246, 0.2);
        }

        .card h3 {
          font-size: 22px;
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 12px;
        }

        .card p {
          color: #94a3b8;
          font-size: 15px;
          line-height: 1.6;
          margin-bottom: 25px;
        }

        .card-btn {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: #fff;
          text-align: center;
          padding: 14px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 15px;
          transition: all 0.2s;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .card:hover .card-btn {
          background: linear-gradient(135deg, #1d4ed8, #1e40af);
          box-shadow: 0 6px 16px rgba(37, 99, 235, 0.5);
        }

        @media (max-width: 768px) {
          .hero h1 { font-size: 30px; }
          .hero p { font-size: 16px; }
        }
      `}</style>

      {/* الشريط العلوي */}
      <div className="navbar">
        <div className="brand">إنجازيا | ENGAZIA</div>
        <div className="badge-live">النظام يعمل بكفاءة سحابية</div>
      </div>

      {/* القسم الرئيسي الترحيبي */}
      <div className="hero">
        <h1>منصة التجار الذكية <span>بلا قيود</span></h1>
        <p>مجموعتك السحابية الاحترافية المتكاملة لإدارة مبيعات المتاجر الإلكترونية، تحليل الأرباح، وأتمتة التواصل الفوري بضغطة زر واحدة.</p>
      </div>

      {/* شبكة البطاقات (ترتيب من اليمين لليسار: واتساب -> الأرباح -> البيانات) */}
      <div className="cards-grid">
        
        {/* 1. أداة الواتساب */}
        <Link href="/hub/whatsapp" className="card">
          <div>
            <div className="card-header">
              <div className="card-icon">💬</div>
            </div>
            <h3>قوالب وربط واتساب</h3>
            <p>أنشئ قوالب رسائل الرد السريع، وتأكيد الطلبات، وإدارة العملاء لتجار المتاجر الإلكترونية باحترافية تامة.</p>
          </div>
          <div className="card-btn">
            <span>تشغيل الأداة مباشرة</span>
            <span>←</span>
          </div>
        </Link>

        {/* 2. حاسبة الأرباح */}
        <Link href="/hub/profit" className="card">
          <div>
            <div className="card-header">
              <div className="card-icon">📊</div>
            </div>
            <h3>حاسبة أرباح المتاجر</h3>
            <p>احسب صافي أرباح المنتجات بدقة بعد خصم التكاليف التشغيلية ومصاريف الإعلانات للوصول المباشر لنقطة التعادل.</p>
          </div>
          <div className="card-btn">
            <span>تشغيل الأداة مباشرة</span>
            <span>←</span>
          </div>
        </Link>

        {/* 3. استخراج البيانات */}
        <Link href="/hub/scraper" className="card">
          <div>
            <div className="card-header">
              <div className="card-icon">⚡</div>
            </div>
            <h3>تنسيق واستخراج البيانات</h3>
            <p>نظف الجداول والنصوص العشوائية وحولها فوراً إلى صيغة مرتبطة ومتوافقة كلياً مع ملفات الإكسل.</p>
          </div>
          <div className="card-btn">
            <span>تشغيل الأداة مباشرة</span>
            <span>←</span>
          </div>
        </Link>

      </div>
    </div>
  );
}
