'use client';

import React from 'react';
import Link from 'next/link';

export default function EngaziaHomeHub() {
  return (
    <div className="hub-container">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');

        .hub-container {
          background-color: #f8fafc;
          color: #0f172a;
          min-height: 100vh;
          font-family: 'Tajawal', sans-serif;
          direction: rtl;
          padding: 0 20px 60px;
        }

        .navbar {
          max-width: 1200px;
          margin: 0 auto;
          padding: 24px 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #e2e8f0;
        }

        .brand {
          font-size: 22px;
          font-weight: 900;
          color: #2563eb;
        }

        .badge-live {
          background: #dcfce7;
          color: #15803d;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 700;
          border: 1px solid #bbf7d0;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .badge-live::before {
          content: '';
          width: 8px;
          height: 8px;
          background-color: #22c55e;
          border-radius: 50%;
          box-shadow: 0 0 6px #22c55e;
        }

        .hero {
          text-align: center;
          max-width: 800px;
          margin: 50px auto 40px;
        }

        .hero h1 {
          font-size: 38px;
          font-weight: 900;
          color: #0f172a;
          margin-bottom: 15px;
          line-height: 1.3;
        }

        .hero h1 span {
          color: #2563eb;
        }

        .hero p {
          color: #475569;
          font-size: 17px;
          line-height: 1.6;
          max-width: 650px;
          margin: 0 auto;
        }

        /* شبكة البطاقات الفاتحة والواضحة */
        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 24px;
          max-width: 1100px;
          margin: 40px auto 0;
        }

        .card {
          background: #ffffff;
          border-radius: 20px;
          padding: 35px 30px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          text-decoration: none;
        }

        .card:hover {
          transform: translateY(-6px);
          border-color: #2563eb;
          box-shadow: 0 20px 30px -10px rgba(37, 99, 235, 0.15);
        }

        .card-icon {
          font-size: 36px;
          background: #eff6ff;
          width: 65px;
          height: 65px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
          margin-bottom: 20px;
          border: 1px solid #bfdbfe;
        }

        .card h3 {
          font-size: 21px;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 12px;
        }

        .card p {
          color: #64748b;
          font-size: 15px;
          line-height: 1.6;
          margin-bottom: 25px;
        }

        .card-btn {
          background: #2563eb;
          color: #fff;
          text-align: center;
          padding: 14px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 15px;
          transition: background 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
        }

        .card:hover .card-btn {
          background: #1d4ed8;
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
        <p>أدوات سحابية احترافية متكاملة لإدارة مبيعات متجرك، تحليل الأرباح، وأتمتة التواصل بضغطة زر واحدة.</p>
      </div>

      {/* شبكة البطاقات (مرتبة من اليمين لليسار: واتساب -> الأرباح -> البيانات) */}
      <div className="cards-grid">
        
        {/* 1. أداة الواتساب (يمين) */}
        <Link href="/hub/whatsapp" className="card">
          <div>
            <div className="card-icon">💬</div>
            <h3>قوالب وربط واتساب</h3>
            <p>أنشئ قوالب رسائل الرد السريع، تأكيد الطلبات، وإدارة العملاء لتجار المتاجر الإلكترونية باحترافية تامة.</p>
          </div>
          <div className="card-btn">
            <span>تشغيل الأداة مباشرة</span>
            <span>←</span>
          </div>
        </Link>

        {/* 2. حاسبة الأرباح (منتصف) */}
        <Link href="/hub/profit" className="card">
          <div>
            <div className="card-icon">📊</div>
            <h3>حاسبة أرباح المتاجر</h3>
            <p>احسب صافي أرباح المنتجات بدقة بعد خصم التكاليف التشغيلية ومصاريف الإعلانات للوصول لنقطة التعادل.</p>
          </div>
          <div className="card-btn">
            <span>تشغيل الأداة مباشرة</span>
            <span>←</span>
          </div>
        </Link>

        {/* 3. استخراج البيانات (يسار) */}
        <Link href="/hub/scraper" className="card">
          <div>
            <div className="card-icon">⚡</div>
            <h3>تنسيق واستخراج البيانات</h3>
            <p>نظف الجداول والنصوص العشوائية وحولها فوراً إلى صيغة مرتبة ومتاحة كلياً للتحميل كملفات إكسل.</p>
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
