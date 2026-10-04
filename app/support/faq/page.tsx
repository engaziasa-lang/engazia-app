'use client';

import React from 'react';
import Link from 'next/link';

export default function FAQPage() {
  const faqs = [
    {
      q: "هل منصة إنجازيا متوافقة مع تجار منصة سلة وزد؟",
      a: "نعم وبكل تأكيد! صُممت جميع أدوات المنصة (24 أداة) لتلبي الاحتياجات اليومية المعقدة لتجار التجارة الإلكترونية في السعودية، وخاصة مستخدمي سلة وزد، بدءاً من حساب رسوم بوابات الدفع (تابي وتمارا) وحتى تجهيز الإقرارات الضريبية بدقة."
    },
    {
      q: "أين يتم حفظ بيانات أرباحي وعملائي؟ هل هي آمنة؟",
      a: "بياناتك في أمان تام بنسبة 100%. نحن نستخدم تقنية (Local Storage) حيث تُحفظ جميع مدخلاتك الحساسة داخل متصفحك الشخصي محلياً، ولا يتم رفعها إلى خوادمنا نهائياً لضمان خصوصيتك. يمكنك استخدام ميزة 'تصدير البيانات' لأخذ نسخة احتياطية على جهازك وقتما تشاء."
    },
    {
      q: "هل حسابات الضريبة متوافقة مع هيئة الزكاة والضريبة والجمارك (ZATCA)؟",
      a: "نعم، خوارزمياتنا مبرمجة لاحتساب ضريبة القيمة المضافة (15%) بشكل دقيق آلياً، وتفصل بين ضريبة المبيعات المحصلة والمشتريات المدفوعة لتستخرج لك الرقم الصافي الواجب سداده لتسهيل رفع الإقرار الضريبي."
    },
    {
      q: "ماذا يحدث إذا قمت بمسح بيانات المتصفح (Clear Cache)؟",
      a: "بما أن المنصة تعتمد على تخزين متصفحك (التخزين المحلي)، فإن مسح الكاش سيؤدي لمسح البيانات. لذلك ننصحك دائماً بالضغط على زر 'تصدير البيانات' الموجود في شريط التنقل العلوي أسبوعياً لحفظ نسخة احتياطية آمنة على جهازك واستعادتها بضغطة زر."
    },
    {
      q: "كيف يمكنني تفعيل الاشتراك الكامل (باقة PRO)؟",
      a: "يمكنك الترقية عبر الضغط على زر الترقية في أعلى المنصة. بعد إتمام الدفع (37.46 ر.س/شهرياً)، سيصلك 'مفتاح ترخيص PRO' فوراً. قم بنسخه ولصقه في خانة التفعيل لتفتح كافة الحدود التجريبية بلا قيود وتتمتع بكافة الأدوات."
    }
  ];

  return (
    <div style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* الهيدر وزر العودة */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#0f172a', margin: '0 0 10px 0' }}>الأسئلة الشائعة 💡</h1>
            <p style={{ color: '#64748b', fontSize: '15px', margin: 0 }}>كل ما تحتاج معرفته عن منصة إنجازيا للحلول الرقمية</p>
          </div>
          <Link href="/hub/sa" style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#334155', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '14px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>← عودة للمنصة</Link>
        </div>

        {/* قائمة الأسئلة والأجوبة */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {faqs.map((faq, index) => (
            <div key={index} style={{ background: '#fff', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 10px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#047857', margin: '0 0 12px 0', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span style={{ background: '#ecfdf5', color: '#047857', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', fontSize: '14px', flexShrink: 0 }}>؟</span>
                {faq.q}
              </h3>
              <p style={{ color: '#475569', fontSize: '15px', lineHeight: '1.8', margin: 0, paddingRight: '38px' }}>
                {faq.a}
              </p>
            </div>
          ))}
        </div>

        {/* قسم التواصل مع الدعم الفني */}
        <div style={{ marginTop: '40px', textAlign: 'center', background: '#0f172a', padding: '40px', borderRadius: '16px', color: '#fff', border: '1px solid #1e293b' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 900, marginBottom: '15px' }}>لم تجد إجابة لسؤالك؟</h3>
          <p style={{ color: '#94a3b8', marginBottom: '25px', fontSize: '15px' }}>فريق الدعم الفني في إنجازيا متواجد دائماً لمساعدتك في أي استفسار تقني أو تجاري.</p>
          <Link href="/support/contact" style={{ display: 'inline-block', background: '#047857', color: '#fff', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 800, transition: 'background 0.3s' }}>
            تواصل مع الدعم الفني 🎧
          </Link>
        </div>

      </div>
    </div>
  );
}
