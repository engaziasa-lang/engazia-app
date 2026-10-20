// app/privacy/page.tsx
import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'سياسة الخصوصية - منصة كليك قدرات',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center border-b pb-4">سياسة الخصوصية</h1>
      
      <div className="space-y-6 text-gray-700 leading-relaxed bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <section>
          <h2 className="text-xl font-bold text-green-600 mb-3">1. البيانات التي نجمعها</h2>
          <p>نحن نحرص بشدة على خصوصيتك. عند استخدامك للمنصة، نقوم بجمع بيانات محدودة جداً لضمان تقديم الخدمة بشكل سليم وآمن، وتتضمن:</p>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>البريد الإلكتروني (الذي يتم إدخاله أثناء عملية الدفع).</li>
            <li>بصمة الجهاز (Device ID) لغرض ربط كود التفعيل بجهازك الشخصي وحماية حقوق المنصة.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-green-600 mb-3">2. كيف نستخدم معلوماتك؟</h2>
          <p>يقتصر استخدامنا للبيانات على التحقق من صلاحية كود التفعيل الخاص بك، ومنع الاستخدام غير المصرح به على أجهزة متعددة. <strong>نحن لا نقوم ببيع أو مشاركة أو تأجير بياناتك لأي طرف ثالث تحت أي ظرف.</strong></p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-green-600 mb-3">3. تخزين بيانات الاختبارات</h2>
          <p>يتم تخزين جميع إجاباتك، ونتائج اختباراتك، ومستوى تقدمك في المنصة بشكل محلي على متصفح جهازك الخاص (Local Storage) لضمان أقصى درجات الخصوصية وسرعة الأداء. يرجى العلم أن مسح بيانات المتصفح سيؤدي إلى مسح هذه الإحصائيات.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-green-600 mb-3">4. المدفوعات الآمنة</h2>
          <p>تتم جميع عمليات الدفع عبر بوابة الدفع الآمنة والمعتمدة عالمياً (Lemon Squeezy). نحن لا نقوم بتخزين أو معالجة أي بيانات مالية أو أرقام خاصة بالبطاقات الائتمانية على خوادمنا نهائياً.</p>
        </section>
      </div>
    </div>
  );
}
