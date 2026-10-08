'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PrivacyPolicy() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');

  useEffect(() => {
    const savedLang = (localStorage.getItem('seerk_global_lang') as 'ar' | 'en') || 'ar';
    setLang(savedLang);
    if (typeof window !== 'undefined') {
      document.title = savedLang === 'ar' ? 'إنجازيا | سياسة الخصوصية (السوق السعودي)' : 'Enjazya | Privacy Policy (Saudi Market)';
    }
  }, []);

  const t = {
    ar: {
      back: '← عودة للمنصة',
      title: 'سياسة الخصوصية 🛡️',
      intro: 'نحن في "إنجازيا برو ماكس للحلول الرقمية" نضع خصوصية بيانات متجرك وعملائك في أعلى درجات الأولوية، ونتوافق مع نظام حماية البيانات الشخصية في المملكة العربية السعودية.',
      sections: [
        {
          title: '1. تخزين البيانات محلياً (Local Storage)',
          content: 'لضمان أقصى درجات الأمان والسرية لتجارنا، تم هندسة منصة إنجازيا برو ماكس بحيث تُحفظ جميع البيانات المدخلة (مثل أسعار التكلفة، هوامش الربح، أرقام هواتف العملاء في أداة الواتساب، وبيانات الإقرار الضريبي) محلياً داخل متصفحك فقط. نحن لا نقوم برفع أو تخزين بياناتك الحساسة على خوادمنا السحابية.'
        },
        {
          title: '2. البيانات التي نجمعها',
          content: 'البيانات الوحيدة التي نقوم بجمعها على خوادمنا تقتصر على:',
          points: [
            'بيانات الحساب الأساسية (البريد الإلكتروني) عند تفعيل مفتاح الترخيص.',
            'بيانات الدفع (تتم معالجتها عبر بوابات دفع طرف ثالث آمنة وموثوقة، ولا نحتفظ بأرقام بطاقات الائتمان).'
          ]
        },
        {
          title: '3. حماية بيانات العملاء (CRM & WhatsApp)',
          content: 'عند استخدام أدوات مثل "نظام طلب التقييمات" أو "إدارة عملاء واتساب"، فإن أرقام هواتف عملائك تُعالج داخل جهازك فقط لإنشاء الروابط المباشرة ولا يتم مشاركتها أو بيعها لأي جهة إعلانية أو طرف ثالث إطلاقاً.'
        },
        {
          title: '4. النسخ الاحتياطي',
          content: 'بما أن بياناتك تحفظ محلياً، تقع مسؤولية عمل "تصدير للبيانات" واسترجاعها على عاتق المستخدم. توفر المنصة أداة تصدير شاملة بصيغة JSON لتمكينك من الاحتفاظ بنسخ آمنة في جهازك.'
        }
      ]
    },
    en: {
      back: '→ Back to Hub',
      title: 'Privacy Policy 🛡️',
      intro: 'At "Enjazya Pro Max Digital Solutions", we place the privacy of your store and customer data at the highest priority, and we comply with the Personal Data Protection Law in the Kingdom of Saudi Arabia.',
      sections: [
        {
          title: '1. Local Data Storage (Local Storage)',
          content: 'To ensure maximum security and confidentiality for our merchants, the Enjazya Pro Max platform is engineered so that all entered data (such as cost prices, profit margins, customer phone numbers in the WhatsApp tool, and VAT return data) is saved locally inside your browser only. We do not upload or store your sensitive data on our cloud servers.'
        },
        {
          title: '2. Data We Collect',
          content: 'The only data we collect on our servers is limited to:',
          points: [
            'Basic account data (email) when activating the license key.',
            'Payment data (processed through secure and trusted third-party payment gateways, and we do not store credit card numbers).'
          ]
        },
        {
          title: '3. Customer Data Protection (CRM & WhatsApp)',
          content: 'When using tools like "Review Request System" or "WhatsApp CRM", your customers phone numbers are processed on your device only to generate direct links and are never shared or sold to any advertising agency or third party.'
        },
        {
          title: '4. Backup',
          content: 'Since your data is stored locally, the responsibility of exporting and restoring data lies with the user. The platform provides a comprehensive JSON export tool to enable you to keep secure backups on your device.'
        }
      ]
    }
  };

  const text = t[lang];

  return (
    <div style={{ direction: lang === 'ar' ? 'rtl' : 'ltr', fontFamily: lang === 'ar' ? "'Tajawal', sans-serif" : "'Inter', sans-serif", backgroundColor: '#f8fafc', minHeight: '100vh', padding: '40px 20px', textAlign: lang === 'ar' ? 'right' : 'left' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', background: '#fff', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #f1f5f9', paddingBottom: '20px', marginBottom: '30px', flexWrap: 'wrap', gap: '15px', flexDirection: lang === 'ar' ? 'row' : 'row-reverse' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#0f172a', margin: 0 }}>{text.title}</h1>
          <Link href="/hub/sa" style={{ background: '#f1f5f9', color: '#334155', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '14px' }}>{text.back}</Link>
        </div>

        <div style={{ color: '#475569', lineHeight: '1.8', fontSize: '15px' }}>
          <p style={{ fontWeight: 700, marginBottom: '20px' }}>{text.intro}</p>
          
          {text.sections.map((section, idx) => (
            <div key={idx}>
              <h2 style={{ color: '#0284c7', fontSize: '20px', fontWeight: 800, marginTop: '30px' }}>{section.title}</h2>
              {section.content && <p>{section.content}</p>}
              {section.points && (
                <ul style={{ [lang === 'ar' ? 'paddingRight' : 'paddingLeft']: '20px' }}>
                  {section.points.map((pt, i) => (
                    <li key={i} style={{ marginBottom: '8px' }}>{pt}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
