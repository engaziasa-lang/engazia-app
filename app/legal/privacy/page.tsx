'use client';

import React from 'react';
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div style={{ direction: 'rtl', fontFamily: 'Tajawal, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', background: '#fff', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #f1f5f9', paddingBottom: '20px', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#0f172a', margin: 0 }}>سياسة الخصوصية 🛡️</h1>
          <Link href="/hub/sa" style={{ background: '#f1f5f9', color: '#334155', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '14px' }}>← عودة للمنصة</Link>
        </div>

        <div style={{ color: '#475569', lineHeight: '1.8', fontSize: '15px' }}>
          <p style={{ fontWeight: 700, marginBottom: '20px' }}>نحن في "إنجازيا للحلول الرقمية" نضع خصوصية بيانات متجرك وعملائك في أعلى درجات الأولوية، ونتوافق مع نظام حماية البيانات الشخصية في المملكة العربية السعودية.</p>
          
          <h2 style={{ color: '#0284c7', fontSize: '20px', fontWeight: 800, marginTop: '30px' }}>1. تخزين البيانات محلياً (Local Storage)</h2>
          <p>لضمان أقصى درجات الأمان والسرية لتجارنا، تم هندسة منصة إنجازيا بحيث تُحفظ <strong>جميع البيانات المدخلة</strong> (مثل أسعار التكلفة، هوامش الربح، أرقام هواتف العملاء في أداة الواتساب، وبيانات الإقرار الضريبي) <strong>محلياً داخل متصفحك فقط</strong>. نحن لا نقوم برفع أو تخزين بياناتك الحساسة على خوادمنا السحابية.</p>

          <h2 style={{ color: '#0284c7', fontSize: '20px', fontWeight: 800, marginTop: '30px' }}>2. البيانات التي نجمعها</h2>
          <p>البيانات الوحيدة التي نقوم بجمعها على خوادمنا تقتصر على:</p>
          <ul style={{ paddingRight: '20px' }}>
            <li>بيانات الحساب الأساسية (البريد الإلكتروني) عند تفعيل مفتاح الترخيص.</li>
            <li>بيانات الدفع (تتم معالجتها عبر بوابات دفع طرف ثالث آمنة وموثوقة، ولا نحتفظ بأرقام بطاقات الائتمان).</li>
            <li>إحصائيات استخدام مجهولة الهوية لتحسين أداء المنصة.</li>
          </ul>

          <h2 style={{ color: '#0284c7', fontSize: '20px', fontWeight: 800, marginTop: '30px' }}>3. حماية بيانات العملاء (CRM & WhatsApp)</h2>
          <p>عند استخدام أدوات مثل "نظام طلب التقييمات" أو "إدارة عملاء واتساب"، فإن أرقام هواتف عملائك تُعالج داخل جهازك فقط لإنشاء الروابط المباشرة ولا يتم مشاركتها أو بيعها لأي جهة إعلانية أو طرف ثالث إطلاقاً.</p>

          <h2 style={{ color: '#0284c7', fontSize: '20px', fontWeight: 800, marginTop: '30px' }}>4. النسخ الاحتياطي</h2>
          <p>بما أن بياناتك تحفظ محلياً، تقع مسؤولية عمل "تصدير للبيانات" واسترجاعها على عاتق المستخدم. توفر المنصة أداة تصدير شاملة بصيغة JSON لتمكينك من الاحتفاظ بنسخ آمنة في جهازك.</p>
        </div>
      </div>
    </div>
  );
}
