'use client';

import React from 'react';
import Link from 'next/link';

export default function ContactSupportPageAE() {
  return (
    <div style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh', padding: '40px 20px' }}>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap" rel="stylesheet" />
      
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#0f172a', margin: '0 0 10px 0' }}>الدعم الفني والمساعدة 🎧</h1>
            <p style={{ color: '#64748b', fontSize: '15px', margin: 0 }}>نحن هنا لمساعدتك في أي استفسار أو مشكلة تواجهك في استخدام منصة إنجازيا (الإمارات)</p>
          </div>
          <Link href="/hub/ae" style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#334155', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '14px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>← عودة للمنصة</Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          <div style={{ background: '#fff', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 10px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginBottom: '20px' }}>أرسل رسالة للدعم</h2>
            
            <form action="https://formsubmit.co/engazia.sa@gmail.com" method="POST" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input type="hidden" name="_subject" value="🇦🇪 تذكرة دعم فني جديدة - منصة إنجازيا (الإمارات)" />
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_next" value="https://engazia-app.vercel.app/ae/support/contact" />
              <input type="hidden" name="_template" value="table" />

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>الاسم الكريم</label>
                <input type="text" name="الاسم" required placeholder="اكتب اسمك هنا..." style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontFamily: 'Tajawal', boxSizing: 'border-box' }} />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>البريد الإلكتروني</label>
                <input type="email" name="email" required placeholder="example@domain.com" dir="ltr" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontFamily: 'Tajawal', textAlign: 'right', boxSizing: 'border-box' }} />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>تفاصيل الاستفسار أو المشكلة</label>
                <textarea name="الرسالة" required rows={5} placeholder="كيف يمكننا مساعدتك؟" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontFamily: 'Tajawal', resize: 'vertical', boxSizing: 'border-box' }}></textarea>
              </div>
              
              <button type="submit" style={{ background: '#047857', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 900, cursor: 'pointer', fontSize: '15px', fontFamily: 'Tajawal', transition: 'background 0.3s' }}>
                إرسال التذكرة 📤
              </button>
            </form>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: '#fff', padding: '30px', borderRadius: '16px', border: '1px solid #e2e8f0', flex: 1 }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '15px' }}>التواصل المباشر</h2>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 700, marginBottom: '5px' }}>البريد الإلكتروني:</div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#0369a1' }}>engazia.sa@gmail.com</div>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 700, marginBottom: '5px' }}>مواعيد العمل:</div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#334155' }}>من الأحد إلى الخميس<br/>(9:00 صباحاً - 5:00 مساءً)</div>
              </div>
            </div>
            
            <div style={{ background: '#fef3c7', padding: '20px', borderRadius: '16px', border: '1px solid #fde68a', color: '#92400e' }}>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: 700, lineHeight: '1.6' }}>
                💡 <b>تلميحة:</b> تأكد من تصفح <Link href="/ae/support/faq" style={{ color: '#047857', textDecoration: 'underline' }}>صفحة الأسئلة الشائعة</Link> أولاً، فقد تجد إجابة فورية لسؤالك هناك!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
