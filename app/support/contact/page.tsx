'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SupportContact() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userMessage, setUserMessage] = useState('');

  useEffect(() => {
    const savedLang = (localStorage.getItem('seerk_global_lang') as 'ar' | 'en') || 'ar';
    setLang(savedLang);
  }, []);

  const t = {
    ar: {
      back: '← عودة للمنصة',
      title: 'الدعم الفني والمساعدة',
      desc: 'نحن هنا لمساعدتك في أي استفسار أو مشكلة تواجهك في استخدام منصة إنجازيا برو ماكس',
      sendMsgTitle: 'أرسل رسالة للدعم',
      nameLabel: 'الاسم الكريم',
      namePH: 'اكتب اسمك هنا...',
      emailLabel: 'البريد الإلكتروني',
      msgLabel: 'تفاصيل الاستفسار أو المشكلة',
      msgPH: 'كيف يمكننا مساعدتك؟',
      sendBtn: 'إرسال الرسالة',
      successAlert: '✅ تم إرسال رسالتك بنجاح! سنقوم بالرد عليك عبر البريد الإلكتروني في أقرب وقت.'
    },
    en: {
      back: '→ Back to Hub',
      title: 'Technical Support & Help',
      desc: 'We are here to help you with any inquiry or issue you face while using Enjazya Pro Max',
      sendMsgTitle: 'Send a Support Message',
      nameLabel: 'Your Name',
      namePH: 'Type your name here...',
      emailLabel: 'Email Address',
      msgLabel: 'Inquiry or Issue Details',
      msgPH: 'How can we help you?',
      sendBtn: 'Send Message',
      successAlert: '✅ Your message has been sent successfully! We will reply to your email shortly.'
    }
  };

  const text = t[lang];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userEmail.trim() || !userMessage.trim()) {
      alert(lang === 'ar' ? 'الرجاء تعبئة كافة الحقول المطلوبة.' : 'Please fill in all required fields.');
      return;
    }
    alert(text.successAlert);
    setUserName('');
    setUserEmail('');
    setUserMessage('');
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', padding: '40px 16px', direction: lang === 'ar' ? 'rtl' : 'ltr', fontFamily: lang === 'ar' ? "'Tajawal', sans-serif" : "'Inter', sans-serif", minHeight: '100vh', textAlign: lang === 'ar' ? 'right' : 'left' }}>
      
      {/* الحاوية الرئيسية لصفحة الدعم */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '16px', padding: '40px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        
        {/* زر العودة */}
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: lang === 'ar' ? 'flex-start' : 'flex-end' }}>
          <Link href="/hub/sa">
            <button style={{ backgroundColor: '#f1f5f9', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', color: '#334155', fontFamily: 'inherit' }}>
              {text.back}
            </button>
          </Link>
        </div>

        {/* رأس الصفحة */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#0f172a', marginBottom: '12px' }}>
            {text.title}
          </h1>
          <p style={{ color: '#64748b', fontSize: '16px' }}>
            {text.desc}
          </p>
        </div>

        {/* حاوية نموذج إرسال الرسالة (متوسطة في الصفحة) */}
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ backgroundColor: '#f8fafc', padding: '32px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e293b', marginBottom: '24px', textAlign: 'center' }}>
              {text.sendMsgTitle}
            </h3>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#334155', marginBottom: '8px' }}>
                  {text.nameLabel}
                </label>
                <input 
                  type="text" 
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder={text.namePH} 
                  style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: '#ffffff', fontFamily: 'inherit', boxSizing: 'border-box' }} 
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#334155', marginBottom: '8px' }}>
                  {text.emailLabel}
                </label>
                <input 
                  type="email" 
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="example@domain.com" 
                  style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: '#ffffff', fontFamily: 'inherit', boxSizing: 'border-box', direction: 'ltr', textAlign: lang === 'ar' ? 'right' : 'left' }} 
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#334155', marginBottom: '8px' }}>
                  {text.msgLabel}
                </label>
                <textarea 
                  rows={5} 
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  placeholder={text.msgPH} 
                  style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: '#ffffff', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }}
                  required
                ></textarea>
              </div>

              <button type="submit" style={{ backgroundColor: '#059669', color: '#ffffff', border: 'none', padding: '16px', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', marginTop: '8px', fontFamily: 'inherit', transition: '0.3s' }}>
                {text.sendBtn}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
