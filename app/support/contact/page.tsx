import React from 'react';

export default function SupportContact() {
  return (
    <div style={{ backgroundColor: '#f8fafc', padding: '40px 16px', direction: 'rtl', fontFamily: 'system-ui, -apple-system, sans-serif', minHeight: '100vh' }}>
      
      {/* الحاوية الرئيسية لصفحة الدعم */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '16px', padding: '40px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        
        {/* زر العودة */}
        <div style={{ marginBottom: '24px' }}>
          <button style={{ backgroundColor: '#f1f5f9', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', color: '#334155' }}>
            ← عودة للمنصة
          </button>
        </div>

        {/* رأس الصفحة */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#0f172a', marginBottom: '12px' }}>
            الدعم الفني والمساعدة
          </h1>
          <p style={{ color: '#64748b', fontSize: '16px' }}>
            نحن هنا لمساعدتك في أي استفسار أو مشكلة تواجهك في استخدام المنصة
          </p>
        </div>

        {/* شبكة المحتوى (قسم قنوات التواصل وقسم إرسال الرسالة) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
          
          {/* قسم قنوات التواصل السريعة (بدون واتساب) */}
          <div style={{ backgroundColor: '#f8fafc', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e293b', marginBottom: '20px' }}>
              قنوات التواصل السريعة
            </h3>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '8px' }}>
              البريد الإلكتروني المباشر:
            </p>
            <a href="mailto:engazia.sa@gmail.com" style={{ display: 'block', fontSize: '18px', fontWeight: 'bold', color: '#059669', marginBottom: '24px', textDecoration: 'none' }}>
              engazia.sa@gmail.com
            </a>

            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '8px' }}>
              مواعيد العمل:
            </p>
            <p style={{ fontSize: '16px', fontWeight: '700', color: '#334155', lineHeight: '1.6' }}>
              من الأحد إلى الخميس<br />
              (9:00 صباحاً - 5:00 مساءً)
            </p>
          </div>

          {/* قسم إرسال رسالة للدعم */}
          <div style={{ backgroundColor: '#f8fafc', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e293b', marginBottom: '20px' }}>
              أرسل رسالة للدعم
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#334155', marginBottom: '6px' }}>
                  الاسم الكريم
                </label>
                <input type="text" placeholder="اكتب اسمك هنا..." style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: '#ffffff' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#334155', marginBottom: '6px' }}>
                  البريد الإلكتروني
                </label>
                <input type="email" placeholder="example@domain.com" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: '#ffffff' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#334155', marginBottom: '6px' }}>
                  تفاصيل الاستفسار أو المشكلة
                </label>
                <textarea rows={4} placeholder="كيف يمكننا مساعدتك؟" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: '#ffffff', resize: 'vertical' }}></textarea>
              </div>

              <button style={{ backgroundColor: '#059669', color: '#ffffff', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', marginTop: '8px' }}>
                إرسال الرسالة
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
