'use client';

import React from 'react';
import Link from 'next/link';

export default function EngaziaHomeHub() {
  return (
    <div className="hub-container">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');

        .hub-container {
          background-color: #f1f5f9;
          color: #0f172a;
          min-height: 100vh;
          font-family: 'Tajawal', sans-serif;
          direction: rtl;
          padding: 30px 20px 60px;
        }

        .navbar {
          max-width: 1100px;
          margin: 0 auto 40px;
          padding: 20px 30px;
          background: #ffffff;
          border-radius: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
          border: 1px solid #e2e8f0;
        }

        .brand {
          font-size: 20px;
          font-weight: 900;
          color: #2563eb;
        }

        .badge-live {
          background: #dcfce7;
          color: #15803d;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 700;
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
        }

        .hero {
          text-align: center;
          max-width: 750px;
          margin: 0 auto 40px;
        }

        .hero h1 {
          font-size: 34px;
          font-weight: 900;
          color: #0f172a;
          margin-bottom: 12px;
        }

        .hero h1 span {
          color: #2563eb;
        }

        .hero p {
          color: #475569;
          font-size: 16px;
          line-height: 1.6;
        }

        /* شبكة المربعات بحجم مثالي ومرتب */
        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
          max-width: 1100px;
          margin: 0 auto;
        }

        .card {
          background: #ffffff;
          border-radius: 16px;
          padding: 28px 24px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.04);
          transition: all 0.25s ease;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          text-decoration: none;
          text-align: right;
        }

        .card:hover {
          transform: translateY(-5px);
          border-color: #3b82f6;
          box-shadow: 0 20px 25px -5px rgba(37, 99, 235, 0.1);
        }

        .card-icon {
          font-size: 30px;
          background: #eff6ff;
          width: 55px;
          height: 55px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          margin-bottom: 18px;
          border: 1px solid #bfdbfe;
        }

        .card h3 {
          font-size: 19px;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 10px;
        }

        .card p {
          color: #64748b;
          font-size: 14px;
          line-height: 1.6;
          margin-bottom: 24px;
          min-height: 45px;
        }

        .card-btn {
          background: #2563eb;
          color: #fff;
          text-align: center;
          padding: 12px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 14px;
          transition: background 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
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

      {/* المربعات الثلاثة المرتبة بدقة */}
      <div className="cards-grid">
        
        {/* 1. أداة الواتساب */}
        <Link href="/hub/whatsapp" className="card">
          <div>
            <div className="card-icon">💬</div>
            <h3>قوالب وربط واتساب</h3>
            <p>أنشئ قوالب رسائل الرد السريع، تأكيد الطلبات، وإدارة العملاء لتجار المتاجر باحترافية تامة.</p>
          </div>
          <div className="card-btn">
            <span>تشغيل الأداة مباشرة</span>
            <span>←</span>
          </div>
        </Link>

        {/* 2. حاسبة الأرباح */}
        <Link href="/hub/profit" className="card">
          <div>
            <div className="card-icon">📊</div>
            <h3>حاسبة أرباح المتاجر</h3>
            <p>احسب صافي أرباح المنتجات بدقة بعد خصم التكاليف والإعلانات للوصول لنقطة التعادل.</p>
          </div>
          <div className="card-btn">
            <span>تشغيل الأداة مباشرة</span>
            <span>←</span>
          </div>
        </Link>

        {/* 3. استخراج البيانات */}
        <Link href="/hub/scraper" className="card">
          <div>
            <div className="card-icon">⚡</div>
            <h3>تنسيق واستخراج البيانات</h3>
            <p>نظف الجداول والنصوص العشوائية وحولها فوراً لصيغة مرتبة ومتاحة للتحميل كملفات إكسل.</p>
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
