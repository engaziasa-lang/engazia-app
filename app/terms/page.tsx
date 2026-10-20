// app/terms/page.tsx
import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'الشروط والأحكام - منصة كليك قدرات',
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center border-b pb-4">الشروط والأحكام</h1>
      
      <div className="space-y-6 text-gray-700 leading-relaxed bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <section>
          <h2 className="text-xl font-bold text-green-600 mb-3">1. حقوق الاستخدام والملكية</h2>
          <p>جميع المحتويات، الاختبارات، والأسئلة الموجودة في "منصة كليك قدرات" هي ملكية فكرية حصرية للمنصة. يُمنع منعاً باتاً نسخ، توزيع، أو إعادة نشر أي جزء من المحتوى بأي شكل من الأشكال.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-green-600 mb-3">2. كود التفعيل (ترخيص الاستخدام)</h2>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>كود التفعيل المُشترى يمنح حق الوصول لمستخدم واحد وعلى <strong>جهاز واحد فقط</strong>.</li>
            <li>يقوم النظام بربط كود التفعيل بالجهاز الأول الذي تم استخدامه عليه تلقائياً لمنع التكرار.</li>
            <li><strong>يُمنع مشاركة كود التفعيل</strong> مع أي شخص آخر. محاولة استخدام الكود على جهاز آخر ستؤدي إلى حظر الكود ورفض النظام لعملية الدخول.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-green-600 mb-3">3. سياسة الاسترجاع</h2>
          <p>نظراً لطبيعة المنتجات الرقمية، فإن المبالغ المدفوعة لشراء أكواد التفعيل غير قابلة للاسترداد بمجرد إصدار الكود واستلامه من قبل الطالب، إلا في حال وجود خلل تقني من طرف المنصة يمنع التفعيل منذ المحاولة الأولى.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-green-600 mb-3">4. إخلاء المسؤولية</h2>
          <p>المنصة هي أداة تدريبية وتأهيلية لاختبارات القدرات. نحن لا نضمن تحقيق درجة معينة في الاختبارات الرسمية، بل تعتمد النتائج على جهد الطالب ومدى استيعابه للتدريبات والشروحات المقدمة.</p>
        </section>
      </div>
    </div>
  );
}
