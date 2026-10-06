'use client';

import React from 'react';
import Link from 'next/link';

export default function TermsPageAE() {
  return (
    <div style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh', padding: '40px 20px' }}>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap" rel="stylesheet" />
      
      <div style={{ maxWidth: '800px', margin: '0 auto', background: '#fff', padding: '40px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#0f172a', margin: 0 }}>شروط الاستخدام ⚖️</h1>
          <Link href="/hub/ae" style={{ background: '#f1f5f9', color: '#334155', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '13px' }}>← عودة للمنصة</Link>
        </div>

        <div style={{ color: '#475569', fontSize: '15px', lineHeight: '1.8', fontWeight: 500, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <p>أهلاً بك في منصة إنجازيا المخصصة للسوق الإماراتي. استخدامك للمنصة يعتبر موافقة صريحة على الالتزام بالشروط والأحكام التالية:</p>
          
          <h3 style={{ color: '#0f172a', fontSize: '18px', fontWeight: 800, margin: '10px 0 0 0' }}>1. الترخيص والاستخدام</h3>
          <p>تمنحك العضوية حقاً فردياً وغير حصري وغير قابل للتحويل لاستخدام الأدوات الـ 24 الخاصة بإدارة وتطوير المتاجر الإلكترونية وفقاً لمتطلبات دولة الإمارات العربية المتحدة.</p>

          <h3 style={{ color: '#0f172a', fontSize: '18px', fontWeight: 800, margin: '10px 0 0 0' }}>2. حماية وتخزين البيانات</h3>
          <p>جميع الحسابات والبيانات تُعالج محلياً داخل متصفحك لضمان أعلى معايير الخصوصية والسرية. المنصة لا تتحمل مسؤولية فقدان البيانات المحلية في حال عدم استخدام ميزة التصدير الدوري (JSON Backup).</p>

          <h3 style={{ color: '#0f172a', fontSize: '18px', fontWeight: 800, margin: '10px 0 0 0' }}>3. الاشتراكات والمدفوعات</h3>
          <p>تتم عمليات الدفع عبر بوابة Lemon Squeezy الآمنة بقيمة 49.99 د.إ شهرياً، ولا يتم تفعيل التراخيص إلا بعد التحقق الكامل من نجاح عملية الدفع وإرسال مفتاح الترخيص لبريدك.</p>
        </div>
      </div>
    </div>
  );
}
