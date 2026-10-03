'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function LegalPolicyGeneratorSA() {
  const [storeName, setStoreName] = useState<string>('متجر إنجازيا');
  const [storeEmail, setStoreEmail] = useState<string>('support@store.com');
  const [returnDays, setReturnDays] = useState<number>(7); // مدة الاسترجاع النظامية
  const [policyType, setPolicyType] = useState<'return' | 'privacy' | 'terms'>('return');

  // توليد النصوص القانونية باللهجة والنظام السعودي
  const getPolicyContent = () => {
    switch (policyType) {
      case 'return':
        return `سياسة الاستبدال والاسترجاع لـ (${storeName}):\n\n1. يحق للعميل استرجاع المنتجات خلال (${returnDays}) أيام من تاريخ الاستلام، بشرط أن يكون المنتج بحالته الأصلية وغير مسخدم.\n2. يتحمل العميل تكاليف شحن الاسترجاع إلا في حال كان المنتج تالفاً أو غير مطابق للمواصفات.\n3. يتم إرجاع المبلغ المالي للعميل خلال 5-14 روز عمل بعد وصول المنتج للمستودع وفحصه.\n4. لا يمكن استبدال أو استرجاع المنتجات المصنوعة خصيصاً بناءً على طلب العميل أو المنتجات العطرية والتجميلية في حال فتح غلافها حفاظاً على الصحة العامة.\n\nللتواصل وطلب الاسترجاع يرجى مراسلتنا عبر البريد: ${storeEmail}`;
      case 'privacy':
        return `سياسة الخصوصية وحماية البيانات لـ (${storeName}):\n\n1. نلتزم في (${storeName}) بحماية خصوصية بياناتك الشخصية (الاسم، الجوال، العنوان) وعدم مشاركتها مع أي جهة خارجية إلا لغرض إتمام الشحن والتوصيل.\n2. نستخدم وسائل تشفير متقدمة لضمان أمان عمليات الدفع الإلكتروني.\n3. يحق للعميل طلب حذف بياناته الشخصية في أي وقت من خلال التواصل معنا عبر: ${storeEmail}`;
      case 'terms':
        return `شروط وأحكام الاستخدام لـ (${storeName}):\n\n1. استخدامك لمتجراً وعملكيات الشراء تعني موافقتك التامة على كافة الشروط والأحكام.\n2. الأسعار معروضة بالريال السعودي (ر.س) وتشمل ضريبة القيمة المضافة (15%).\n3. يحق للمتجر تعديل الأسعار أو الشروط في أي وقت دون إشعار مسبق، وتطبق الشروط السارية وقت إتمام الطلب.\n\nللاستفسارات الشكاوى: ${storeEmail}`;
      default:
        return '';
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(getPolicyContent());
    alert('✨ تم نسخ النص القانوني بنجاح!');
  };

  return (
    <div className="tool-container">
      <style jsx global>{`
        body { background-color: #f8fafc; margin: 0; font-family: 'Tajawal', sans-serif; }
        a { text-decoration: none; }
      `}</style>
      <style jsx>{`
        .tool-container { direction: rtl; max-width: 1000px; margin: 40px auto; padding: 20px; }
        
        .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 30px; }
        .back-btn { background: #ffffff; border: 1px solid #cbd5e1; padding: 8px 16px; border-radius: 8px; color: #475569; font-weight: 700; font-size: 14px; transition: all 0.2s; display: flex; align-items: center; gap: 8px; }
        .back-btn:hover { background: #f1f5f9; color: #0f172a; }
        
        .title-box h1 { font-size: 24px; font-weight: 900; color: #0f172a; margin: 0 0 5px 0; }
        .title-box p { color: #64748b; margin: 0; font-size: 14px; }
        
        .grid-layout { display: grid; grid-template-columns: 1fr 1.2fr; gap: 30px; }
        @media(max-width: 768px) { .grid-layout { grid-template-columns: 1fr; } }
        
        .card { background: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); }
        .card-title { font-size: 18px; font-weight: 800; color: #1e293b; margin-bottom: 20px; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px; }
        
        .input-group { margin-bottom: 15px; }
        .input-group label { display: block; font-size: 13px; font-weight: 700; color: #475569; margin-bottom: 6px; }
        .input-wrapper input { width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; font-family: 'Tajawal', sans-serif; outline: none; transition: border 0.2s; background: #f8fafc; color: #0f172a; font-weight: 600; }
        .input-wrapper input:focus { border-color: #047857; background: #ffffff; }
        
        .types-grid { display: grid; grid-template-columns: 1fr; gap: 10px; margin-bottom: 20px; }
        .type-btn { padding: 12px; border: 1px solid #cbd5e1; background: #f8fafc; border-radius: 8px; cursor: pointer; font-family: 'Tajawal', sans-serif; font-weight: 700; font-size: 13px; color: #475569; transition: all 0.2s; text-align: center; }
        .type-btn.active { background: #ecfdf5; border-color: #047857; color: #047857; box-shadow: 0 2px 4px rgba(4,120,87,0.1); }
        
        .preview-box { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 12px; padding: 18px; margin-bottom: 20px; white-space: pre-wrap; font-size: 14px; color: #0f172a; line-height: 1.8; font-weight: 500; min-height: 250px; }
        
        .copy-btn { background: #047857; color: #fff; border: none; width: 100%; padding: 12px; border-radius: 8px; font-weight: 900; font-size: 15px; cursor: pointer; transition: all 0.2s; font-family: 'Tajawal', sans-serif; }
        .copy-btn:hover { background: #065f46; }
      `}</style>

      <div className="header">
        <div className="title-box">
          <h1>مولد السياسات القانونية لمتجرك ⚖</h1>
          <p>أنشئ صفحات الاستبدال، الاسترجاع، والخصوصية المتوافقة مع أنظمة وزارة التجارة في السعودية</p>
        </div>
        <Link href="/hub/sa" className="back-btn">
          <span>←</span> عودة للمنصة
        </Link>
      </div>

      <div className="grid-layout">
        {/* قسم المدخلات */}
        <div className="card">
          <h2 className="card-title">إعدادات المتجر</h2>
          
          <div className="input-group">
            <label>اسم المتجر</label>
            <div className="input-wrapper">
              <input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} />
            </div>
          </div>

          <div className="input-group">
            <label>البريد الإلكتروني للدعم</label>
            <div className="input-wrapper">
              <input type="text" value={storeEmail} onChange={(e) => setStoreEmail(e.target.value)} />
            </div>
          </div>

          <div className="input-group">
            <label>مدة الاسترجاع (بالأيام - النظامية 7 أيام)</label>
            <div className="input-wrapper">
              <input type="number" min="1" max="30" value={returnDays} onChange={(e) => setReturnDays(Number(e.target.value))} />
            </div>
          </div>
        </div>

        {/* قسم معاينة ونَسخ النص القانوني */}
        <div className="card">
          <h2 className="card-title">نوع السياسة المطلوبة</h2>

          <div className="types-grid">
            <button className={`type-btn ${policyType === 'return' ? 'active' : ''}`} onClick={() => setPolicyType('return')}>
              🔄 سياسة الاستبدال والاسترجاع
            </button>
            <button className={`type-btn ${policyType === 'privacy' ? 'active' : ''}`} onClick={() => setPolicyType('privacy')}>
              🔒 سياسة الخصوصية وحماية البيانات
            </button>
            <button className={`type-btn ${policyType === 'terms' ? 'active' : ''}`} onClick={() => setPolicyType('terms')}>
              📜 شروط وأحكام الاستخدام
            </button>
          </div>

          <div className="preview-box">
            {getPolicyContent()}
          </div>

          <button className="copy-btn" onClick={handleCopyText}>
            📋 نسخ النص القانوني
          </button>
        </div>
      </div>
    </div>
  );
}
