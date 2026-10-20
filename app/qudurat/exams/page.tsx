import React from 'react';
import Link from 'next/link';

export default function ExamsDashboard() {
  // توليد مصفوفة تحتوي على 30 اختباراً برمجياً
  const examsList = Array.from({ length: 30 }, (_, index) => {
    const examNum = index + 1;
    return {
      id: examNum,
      title: `الاختبار الشامل رقم ${examNum}`,
      description: '125 سؤال - قسم كمي ولفظي مدمج',
      link: `/qudurat/test?examId=${examNum}`
    };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-10" dir="rtl">
      
      {/* الهيدر بعد استبدال الاسم بمنصة كليك قدرات */}
      <header className="flex flex-col items-center justify-center mb-12 text-center">
        <div className="flex items-center gap-3 mb-3">
          <div className="relative w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-md">
            <span>ك</span>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">منصة كليك قدرات</h2>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">الاحتراف في التدريب المحاكي</span>
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mt-2">
          لوحة الاختبارات الشاملة
        </h1>
        <p className="text-gray-500 text-sm mt-2 max-w-md">
          اختر الاختبار لبدء التدريب المحاكي المكون من 5 أقسام لضمان أعلى درجات الجاهزية.
        </p>
      </header>
      
      {/* شبكة عرض البطاقات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {examsList.map((exam) => (
          <div 
            key={exam.id} 
            className="bg-white rounded-2xl border border-gray-200 hover:border-blue-500 p-8 text-center shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              {/* تم إزالة شارة اختبار رقم وتحديث عنوان البطاقة ليعرض "الاختبار الشامل رقم X" */}
              <h2 className="text-xl font-bold text-gray-900 mb-2 mt-2">
                {exam.title}
              </h2>
              <p className="text-sm text-gray-500 mb-8">
                {exam.description}
              </p>
            </div>
            
            <Link 
              href={exam.link}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-sm block text-center"
            >
              ابدأ الاختبار الآن
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
