import React from 'react';
import Link from 'next/link';

export default function ExamsDashboard() {
  // توليد مصفوفة تحتوي على 30 اختباراً برمجياً
  const examsList = Array.from({ length: 30 }, (_, index) => ({
    id: index + 1,
    title: `الاختبار المحاكي الشامل ${index + 1}`,
    description: '125 سؤال - قسم كمي ولفظي مدمج',
    // تم تصحيح المسار ليوجه إلى صفحة الاختبار الفعلية مع تمرير رقم الاختبار
    link: `/qudurat/test?examId=${index + 1}` 
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-12" dir="rtl">
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-10">
        لوحة الاختبارات الشاملة
      </h1>
      
      {/* شبكة عرض البطاقات: عمود واحد للجوال، عمودين للتابلت، 3 أعمدة للشاشات الكبيرة */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {examsList.map((exam) => (
          <div 
            key={exam.id} 
            className="bg-white rounded-xl border border-green-500 p-8 text-center shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {exam.title}
              </h2>
              <p className="text-sm text-gray-500 mb-8">
                {exam.description}
              </p>
            </div>
            
            <Link 
              href={exam.link}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors block text-center"
            >
              ابدأ الاختبار الآن
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
