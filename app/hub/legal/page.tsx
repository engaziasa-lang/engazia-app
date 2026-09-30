'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function LegalPagesGenerator() {
  const [storeName, setStoreName] = useState('متجرك الإلكتروني');
  const [supportEmail, setSupportEmail] = useState('support@store.com');
  const [daysLimit, setDaysLimit] = useState('7');
  const [activeTab, setActiveTab] = useState<'return' | 'privacy' | 'terms'>('return');

  const returnPolicyText = `سياسة الاستبدال والاسترجاع في ${storeName}

1. يحق للعميل استرجاع المنتجات خلال (${daysLimit}) أيام من تاريخ استلام الطلب.
2. يشترط أن يكون المنتج بحالته الأصلية، غير المستخدم، وبغلافه الأصلي مع وجود الفاتورة.
3. تتحمل إدارة ${storeName} تكاليف الشحن في حال وجود عيب مصنعي أو خطأ في الطلب، بينما يتحمل العميل تكلفتها في حال رغبته في التبديل لسبب شخصي.
4. لا يمكن استرجاع المنتجات المصنوعة خصيصاً بناءً على طلب العميل أو المنتجات الاستهلاكية التي يخشى تلفها.
5. يتم إرجاع الأموال للعميل بالطريقة التي دفع بها خلال مدة تتراوح بين 3 إلى 14 يوم عمل بعد استلامنا للمنتج وفحصه.

لتقديم طلب استرجاع، يرجى مراسلتنا عبر البريد الإلكتروني: ${supportEmail}`;

  const privacyPolicyText = `سياسة الخصوصية وحماية البيانات في ${storeName}

نحن في ${storeName} نلزم بحماية خصوصية بياناتك الشخصية:
1. البيانات التي نجمعها: اسم العميل، رقم الجوال، العنوان البريدي، ومعلومات الدفع الضرورية لتنفيذ الطلب.
2. كيف نستخدم البيانات: تُستخدم لغرض شحن وتوصيل الطلبات، التواصل مع العميل في حال وجود استفسار، وتحسين تجربة التسوق في المتجر.
3. حماية البيانات: نتخذ كافة التدابير التقنية والإدارية اللازمة لحماية معلوماتك من الوصول غير المصرح به أو التسريب.
4. لا نقوم إطلاقا ببيع أو مشاركة بياناتك الشخصية مع أي طرف ثالث سوى شركات الشحن المخولة بتوصيل طلبك.`;

  const termsText = `الشروط والأحكام الاستخدام - ${storeName}

1. باستخدامك لهذا المتجر أو إتمامك لعملية الشراء، فإنك توافق التزاماً تاماً بكافة الشروط والأحكام المذكورة هنا.
2. الأسعار المعروضة في المتجر قابلة للتغيير في أي وقت دون إشعار مسبق، ولكن يتم اعتماد السعر للطلب المؤكد فعلياً.
3. نبذل قصارى جهدنا لعرض صور ووصف المنتجات بأكبر قدر ممكن من الدقة، ولكن لا نضمن خلوها من الأخطاء البسيطة.
4. يحق لإدارة ${storeName} إلغاء أي طلب في حال نفاذ الكمية أو وجود خطأ فادح في تسعير المنتج، مع إرجاع كامل المبلغ للعميل فوراً.`;

  const getCurrentText = () => {
    if (activeTab === 'return') return returnPolicyText;
    if (activeTab === 'privacy') return privacyPolicyText;
    return termsText;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getCurrentText());
    alert('تم نسخ النص بنجاح!');
  };

  return (
    <div className="tool-container">
      <style jsx global>{`
        a { text-decoration: none !important; color: inherit !important; }
      `}</style>
      
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
        
        .tool-container { background-color: #f8fafc; min-height: 100vh; font-family: 'Tajawal', sans-serif; direction: rtl; padding: 30px 20px 70px; }
        
        .header { max-width: 1000px; margin: 0 auto 30px; display: flex; justify-content: space-between; align-items: center; }
        .back-btn { background: #ffffff; color: #475569; padding: 10px 20px; border-radius: 8px; font-weight: 700; font-size: 14px; border: 1px solid #cbd5e1; transition: all 0.2s; display: flex; align-items: center; gap: 8px; }
        .back-btn:hover { background: #f1f5f9; color: #0f172a; }
        
        .tool-title { text-align: center; margin-bottom: 40px; }
        .tool-title h1 { font-size: 32px; font-weight: 900; color: #0f172a; margin-bottom: 10px; }
        .tool-title span { color: #4f46e5; }
        .tool-title p { color: #64748b; font-size: 16px; }

        .main-grid { display: grid; grid-template-columns: 1fr 1.5fr; gap: 30px; max-width: 1100px; margin: 0 auto; }
        
        .panel { background: #ffffff; border-radius: 16px; padding: 30px; border: 1px solid #cbd5e1; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); }
        .panel h2 { font-size: 20px; font-weight: 800; color: #0f172a; margin-bottom: 25px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 15px; }

        .input-group { margin-bottom: 20px; }
        .input-group label { display: block; font-size: 14px; font-weight: 700; color: #334155; margin-bottom: 8px; }
        .input-wrapper input { width: 100%; padding: 12px 15px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 15px; font-family: inherit; background: #f8fafc; font-weight: 700; color: #0f172a; outline: none; }
        .input-wrapper input:focus { border-color: #4f46e5; background: #ffffff; }

        .tabs-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
        .tab-btn { background: #f1f5f9; border: 1px solid #cbd5e1; color: #334155; padding: 12px 15px; border-radius: 8px; font-weight: 700; font-size: 14px; text-align: right; cursor: pointer; transition: all 0.2s; }
        .tab-btn.active { background: #4f46e5; color: #ffffff; border-color: #4f46e5; }

        .preview-box { background: #0f172a; color: #f8fafc; border-radius: 12px; padding: 25px; font-size: 14px; line-height: 1.8; white-space: pre-wrap; font-family: inherit; max-height: 400px; overflow-y: auto; border: 1px solid #1e293b; margin-bottom: 20px; }

        .copy-btn { background: #10b981; color: #ffffff; width: 100%; padding: 12px; border-radius: 8px; font-weight: 800; border: none; cursor: pointer; transition: background 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .copy-btn:hover { background: #059669; }

        @media(max-width: 900px) { .main-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div className="header">
        <Link href="/hub" className="back-btn">
          <span>→</span> العودة للوحة التحكم
        </Link>
      </div>

      <div className="tool-title">
        <h1>مولد السياسات <span>القانونية للمتجر</span></h1>
        <p>أنشئ صفحات الاستبدال، الخصوصية، والشروط والأحكام متوافقة نظامياً وجاهزة للنسخ في متجرك.</p>
      </div>

      <div className="main-grid">
        {/* إعدادات المتجر واختيار الصفحة */}
        <div className="panel">
          <h2>⚙️ إعدادات المتجر</h2>
          
          <div className="input-group">
            <label>اسم المتجر</label>
            <div className="input-wrapper">
              <input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} />
            </div>
          </div>

          <div className="input-group">
            <label>بريد الدعم الفني</label>
            <div className="input-wrapper">
              <input type="text" value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} />
            </div>
          </div>

          <div className="input-group">
            <label>مدة الاسترجاع المسموحة (أيام)</label>
            <div className="input-wrapper">
              <input type="number" value={daysLimit} onChange={(e) => setDaysLimit(e.target.value)} />
            </div>
          </div>

          <h3 style={{ fontSize: '15px', fontWeight: '800', margin: '20px 0 10px', color: '#1e293b' }}>اختر الصفحة المطلوبة:</h3>
          <div className="tabs-list">
            <button className={`tab-btn ${activeTab === 'return' ? 'active' : ''}`} onClick={() => setActiveTab('return')}>
              🔄 سياسة الاستبدال والاسترجاع
            </button>
            <button className={`tab-btn ${activeTab === 'privacy' ? 'active' : ''}`} onClick={() => setActiveTab('privacy')}>
              🔒 سياسة الخصوصية وحماية البيانات
            </button>
            <button className={`tab-btn ${activeTab === 'terms' ? 'active' : ''}`} onClick={() => setActiveTab('terms')}>
              📜 الشروط والأحكام العامة
            </button>
          </div>
        </div>

        {/* لوحة المعاينة والنسخ */}
        <div className="panel">
          <h2>👁️ معاينة النص الجاهز</h2>
          
          <div className="preview-box">
            {getCurrentText()}
          </div>

          <button onClick={copyToClipboard} className="copy-btn">
            📋 نسخ النص إلى الحافظة
          </button>
        </div>
      </div>
    </div>
  );
}
