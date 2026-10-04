'use client';

import React from 'react';
import Link from 'next/link';

export default function ContactSupportPage() {
  return (
    <div style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#0f172a', margin: '0 0 10px 0' }}>الدعم الفني والمساعدة 🎧</h1>
            <p style={{ color: '#64748b', fontSize: '15px', margin: 0 }}>نحن هنا لمساعدتك في أي استفسار أو مشكلة تواجهك في استخدام المنصة</p>
          </div>
          <Link href="/hub/sa" style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#334155', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '14px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>← عودة للمنصة</Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          
          {/* نموذج المراسلة المباشر (Native FormSubmit) */}
          <div style={{ background: '#fff', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 10px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginBottom: '20px' }}>أرسل رسالة للدعم</h2>
            
            {/* تم تحويل النموذج للعمل المباشر بدون تعقيدات برمجية لضمان وصول الإيميل */}
            <form action="https://formsubmit.co/engazia.sa@gmail.com" method="POST" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              
              {/* إعدادات مخفية لخدمة FormSubmit */}
              <input type="hidden" name="_subject" value="🔥 تذكرة دعم فني جديدة - منصة إنجازيا" />
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_next" value="https://engazia-app.vercel.app/support/contact" />
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

          {/* قنوات التواصل المباشر */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: '#fff', padding: '30px', borderRadius: '16px', border: '1px solid #e2e8f0', flex: 1 }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '15px' }}>قنوات التواصل السريعة</h2>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 700, marginBottom: '5px' }}>البريد الإلكتروني المباشر:</div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#0369a1' }}>engazia.sa@gmail.com</div>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 700, marginBottom: '5px' }}>مواعيد العمل:</div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#334155' }}>من الأحد إلى الخميس<br/>(9:00 صباحاً - 5:00 مساءً)</div>
              </div>
              <a href="https://wa.me/966541313564" target="_blank" rel="noopener noreferrer" style={{ display: 'block', background: '#22c55e', color: '#fff', textAlign: 'center', padding: '12px', borderRadius: '8px', textDecoration: 'none', fontWeight: 900, fontSize: '15px' }}>
                تواصل عبر واتساب 💬
              </a>
            </div>
            
            <div style={{ background: '#fef3c7', padding: '20px', borderRadius: '16px', border: '1px solid #fde68a', color: '#92400e' }}>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: 700, lineHeight: '1.6' }}>
                💡 <b>تلميحة:</b> تأكد من تصفح <Link href="/support/faq" style={{ color: '#047857', textDecoration: 'underline' }}>صفحة الأسئلة الشائعة</Link> أولاً، فقد تجد إجابة فورية لسؤالك هناك!
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
