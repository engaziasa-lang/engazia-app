'use client';

import React from 'react';
import Link from 'next/link';

export default function EngaziaHomeHub() {
  return (
    <div className="hub-home">
      <style jsx>{`
        .hub-home { background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); min-height: 100vh; font-family: 'Tajawal', sans-serif; direction: rtl; padding: 40px 20px; }
        .hero { text-align: center; max-width: 800px; margin: 0 auto 50px; }
        .hero h1 { font-size: 32px; font-weight: 900; color: #0f172a; margin-bottom: 12px; }
        .hero p { color: #475569; font-size: 16px; line-height: 1.6; }
        .cards-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; max-width: 1000px; margin: 0 auto; }
        .card { background: #ffffff; border-radius: 16px; padding: 30px; border: 1px solid #cbd5e1; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05); transition: all 0.3s ease; display: flex; flex-direction: column; justify-content: space-between; text-decoration: none; }
        .card:hover { transform: translateY(-5px); box-shadow: 0 20px 25px -5px rgba(37,99,235,0.15); border-color: #2563eb; }
        .card-icon { font-size: 36px; margin-bottom: 15px; }
        .card h3 { font-size: 20px; font-weight: 800; color: #1e293b; margin-bottom: 10px; }
        .card p { color: #64748b; font-size: 14px; line-height: 1.5; margin-bottom: 20px; }
        .card-btn { background: #2563eb; color: #fff; text-align: center; padding: 12px; border-radius: 10px; font-weight: 700; font-size: 14px; transition: background 0.2s; }
        .card:hover .card-btn { background: #1d4ed8; }
      `}</style>

      <div className="hero">
        <h1>منصة إنجازيا للحلول المالية والتقنية</h1>
        <p>مجموعتك السحابية الاحترافية المتكاملة لإدارة وتطوير مبيعات المتاجر الإلكترونية بكل ذكاء وسرعة دون الحاجة لتثبيت أي إضافات.</p>
      </div>

      <div className="cards-grid">
        {/* بطاقة أداة الواتساب */}
        <Link href="/hub/whatsapp" className="card">
          <div>
            <div className="card-icon">💬</div>
            <h3>قوالب وربط واتساب</h3>
            <p>أنشئ قوالب رسائل الرد السريع، وتأكيد الطلبات، وإدارة العملاء لتجار المتاجر الإلكترونية بضغطة زر.</p>
          </div>
          <div className="card-btn">تشغيل الأداة مباشرة</div>
        </Link>

        {/* بطاقة حاسبة الأرباح */}
        <Link href="/hub/profit" className="card">
          <div>
            <div className="card-icon">📊</div>
            <h3>حاسبة أرباح المتاجر</h3>
            <p>احسب صافي أرباح المنتجات بدقة بعد خصم التكاليف التشغيلية ومصاريف الإعلانات للوصول لنقطة التعادل.</p>
          </div>
          <div className="card-btn">تشغيل الأداة مباشرة</div>
        </Link>

        {/* بطاقة أداة البيانات */}
        <Link href="/hub/scraper" className="card">
          <div>
            <div className="card-icon">⚡</div>
            <h3>تنسيق واستخراج البيانات</h3>
            <p>نظف الجداول والنصوص العشوائية وحولها فوراً إلى صيغ جاهزة ومتوافقة مع ملفات الإكسل.</p>
          </div>
          <div className="card-btn">تشغيل الأداة مباشرة</div>
        </Link>
      </div>
    </div>
  );
}
