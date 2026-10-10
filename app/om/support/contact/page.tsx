'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ContactSupportPageOM() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('seerk_global_lang') as 'ar' | 'en';
      if (savedLang) {
        setLang(savedLang);
      }
      document.title = savedLang === 'en' ? 'Enjazya | Support & Help (Oman)' : 'إنجازيا | الدعم الفني والمساعدة (عُمان)';
    }
  }, []);

  const t = {
    ar: {
      title: 'الدعم الفني والمساعدة 🎧',
      desc: 'نحن هنا لمساعدتك في أي استفسار أو مشكلة تواجهك في استخدام منصة إنجازيا (عُمان)',
      back: '← عودة للمنصة',
      formTitle: 'أرسل رسالة للدعم',
      subject: '🇴🇲 تذكرة دعم فني جديدة - منصة إنجازيا (عُمان)',
      nameLabel: 'الاسم الكريم',
      namePH: 'اكتب اسمك هنا...',
      emailLabel: 'البريد الإلكتروني',
      emailPH: 'example@domain.com',
      msgLabel: 'تفاصيل الاستفسار أو المشكلة',
      msgPH: 'كيف يمكننا مساعدتك؟',
      submitBtn: 'إرسال التذكرة 📤',
      directTitle: 'التواصل المباشر',
      emailTitle: 'البريد الإلكتروني:',
      hoursTitle: 'مواعيد العمل:',
      hoursVal: 'من الأحد إلى الخميس\n(9:00 صباحاً - 5:00 مساءً)',
      tipTitle: 'تلميحة:',
      tipText: 'تأكد من تصفح',
      faqLink: 'صفحة الأسئلة الشائعة',
      tipEnd: 'أولاً، فقد تجد إجابة فورية لسؤالك هناك!'
    },
    en: {
      title: 'Support & Help 🎧',
      desc: 'We are here to help you with any inquiry or issue you face while using the Enjazya platform (Oman)',
      back: '→ Back to Hub',
      formTitle: 'Send a Support Message',
      subject: '🇴🇲 New Support Ticket - Enjazya Platform (Oman)',
      nameLabel: 'Full Name',
      namePH: 'Type your name here...',
      emailLabel: 'Email Address',
      emailPH: 'example@domain.com',
      msgLabel: 'Inquiry or Issue Details',
      msgPH: 'How can we help you?',
      submitBtn: 'Submit Ticket 📤',
      directTitle: 'Direct Contact',
      emailTitle: 'Email:',
      hoursTitle: 'Working Hours:',
      hoursVal: 'Sunday to Thursday\n(9:00 AM - 5:00 PM)',
      tipTitle: 'Tip:',
      tipText: 'Be sure to check the',
      faqLink: 'FAQ page',
      tipEnd: 'first, you might find an instant answer to your question there!'
    }
  };

  const text = t[lang];

  return (
    <div style={{ direction: lang === 'ar' ? 'rtl' : 'ltr', fontFamily: lang === 'ar' ? "'Tajawal', sans-serif" : "'Inter', sans-serif", backgroundColor: '#f8fafc', minHeight: '100vh', padding: '40px 20px' }}>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap" rel="stylesheet" />
      
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '15px', flexDirection: lang === 'ar' ? 'row' : 'row-reverse' }}>
          <div style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#0f172a', margin: '0 0 10px 0' }}>{text.title}</h1>
            <p style={{ color: '#64748b', fontSize: '15px', margin: 0 }}>{text.desc}</p>
          </div>
          <Link href="/hub/om" style={{ background: '#FFEBEE', border: '1px solid #FFCDD2', color: '#C62828', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '14px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            {text.back}
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          <div style={{ background: '#fff', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 10px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0', textAlign: lang === 'ar' ? 'right' : 'left' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginBottom: '20px' }}>{text.formTitle}</h2>
            
            <form action="https://formsubmit.co/engazia.sa@gmail.com" method="POST" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input type="hidden" name="_subject" value={text.subject} />
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_next" value="https://engazia-app.vercel.app/om/support/contact" />
              <input type="hidden" name="_template" value="table" />

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>{text.nameLabel}</label>
                <input type="text" name="الاسم" required placeholder={text.namePH} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', textAlign: lang === 'ar' ? 'right' : 'left' }} />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>{text.emailLabel}</label>
                <input type="email" name="email" required placeholder={text.emailPH} dir="ltr" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontFamily: 'inherit', textAlign: 'left', boxSizing: 'border-box' }} />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>{text.msgLabel}</label>
                <textarea name="الرسالة" required rows={5} placeholder={text.msgPH} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box', textAlign: lang === 'ar' ? 'right' : 'left' }}></textarea>
              </div>
              
              <button type="submit" style={{ background: '#C62828', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 900, cursor: 'pointer', fontSize: '15px', fontFamily: 'inherit', transition: 'background 0.3s' }}>
                {text.submitBtn}
              </button>
            </form>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: '#fff', padding: '30px', borderRadius: '16px', border: '1px solid #e2e8f0', flex: 1, textAlign: lang === 'ar' ? 'right' : 'left' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '15px' }}>{text.directTitle}</h2>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 700, marginBottom: '5px' }}>{text.emailTitle}</div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#C62828', direction: 'ltr', display: 'inline-block' }}>engazia.sa@gmail.com</div>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 700, marginBottom: '5px' }}>{text.hoursTitle}</div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#334155', whiteSpace: 'pre-line' }}>{text.hoursVal}</div>
              </div>
            </div>
            
            <div style={{ background: '#FFEBEE', padding: '20px', borderRadius: '16px', border: '1px solid #FFCDD2', color: '#B71C1C', textAlign: lang === 'ar' ? 'right' : 'left' }}>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: 700, lineHeight: '1.6' }}>
                💡 <b>{text.tipTitle}</b> {text.tipText} <Link href="/om/support/faq" style={{ color: '#C62828', textDecoration: 'underline' }}>{text.faqLink}</Link> {text.tipEnd}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
