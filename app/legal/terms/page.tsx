'use client';

import React from 'react';
import Link from 'next/link';

export default function TermsOfUse() {
  return (
    <div style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', background: '#fff', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #f1f5f9', paddingBottom: '20px', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#0f172a', margin: 0 }}>شروط الاستخدام ⚖️</h1>
          <Link href="/hub/sa" style={{ background: '#f1f5f9', color: '#334155', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '14px' }}>← عودة للمنصة</Link>
        </div>

        <div style={{ color: '#475569', lineHeight: '1.8', fontSize: '15px' }}>
          <p style={{ fontWeight: 700, marginBottom: '20px' }}>تاريخ آخر تحديث: {new Date().toLocaleDateString('ar-SA')}</p>
          
          <h2 style={{ color: '#047857', fontSize: '20px', fontWeight: 800, marginTop: '30px' }}>1. مقدمة</h2>
          <p>أهلاً بكم في منصة "إنجازيا للحلول الرقمية". باستخدامك لأدواتنا وحاسباتنا المخصصة لقطاع التجارة الإلكترونية، فإنك توافق على الالتزام بشروط الاستخدام الماثلة. تُعد هذه الشروط عقداً ملزماً بينك وبين إدارة المنصة.</p>

          <h2 style={{ color: '#047857', fontSize: '20px', fontWeight: 800, marginTop: '30px' }}>2. نطاق الخدمات</h2>
          <p>توفر إنجازيا مجموعة من الأدوات التحليلية والمالية والتسويقية المصممة لدعم المتاجر الإلكترونية (سلة، زد، وغيرها). جميع النتائج والأرقام المستخرجة من حاسباتنا (مثل حاسبة الأرباح، الإقرار الضريبي، رسوم بوابات الدفع) هي تقديرية ومبنية على المدخلات التي يوفرها المستخدم، ولا تُغني عن الاستشارة المالية والمحاسبية المعتمدة.</p>

          <h2 style={{ color: '#047857', fontSize: '20px', fontWeight: 800, marginTop: '30px' }}>3. التراخيص والاشتراكات</h2>
          <ul style={{ paddingRight: '20px' }}>
            <li style={{ marginBottom: '10px' }}>الاشتراكات في باقات (Pro) تمنحك ترخيصاً شخصياً أو تجارياً غير قابل للتحويل لاستخدام الأدوات.</li>
            <li style={{ marginBottom: '10px' }}>يُمنع منعاً باتاً مشاركة مفتاح الترخيص الخاص بك مع أطراف أخرى أو إعادة بيع الخدمات المستخرجة من المنصة بصورة تجارية منافسة.</li>
          </ul>

          <h2 style={{ color: '#047857', fontSize: '20px', fontWeight: 800, marginTop: '30px' }}>4. إخلاء المسؤولية</h2>
          <p>نبذل قصارى جهدنا لضمان دقة العمليات الحسابية وتوافقها مع أنظمة السوق المحلي وهيئة الزكاة والضريبة والجمارك (ZATCA)، إلا أن إنجازيا لا تتحمل أي مسؤولية قانونية عن أي خسائر مالية أو أضرار مباشرة أو غير مباشرة قد تنتج عن قرارات تجارية اتُخذت بناءً على مخرجات المنصة.</p>

          <h2 style={{ color: '#047857', fontSize: '20px', fontWeight: 800, marginTop: '30px' }}>5. القانون المطبق</h2>
          <p>تخضع هذه الشروط وتُفسر وفقاً للأنظمة والقوانين المعمول بها في المملكة العربية السعودية.</p>
        </div>
      </div>
    </div>
  );
}
