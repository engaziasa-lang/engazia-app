import React from 'react';
import Link from 'next/link';
import Image from 'next/image'; // لاستخدام صور Next.js بشكل احترافي

export default function ExamsDashboard() {
  // توليد مصفوفة تحتوي على 30 اختباراً برمجياً
  const examsList = Array.from({ length: 30 }, (_, index) => ({
    id: index + 1,
    title: `الاختبار المحاكي الشامل ${index + 1}`,
    description: '125 سؤال - قسم كمي ولفظي مدمج',
    link: `/qudurat/test?examId=${index + 1}`
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-10" dir="rtl">
      
      {/* 🌟 الهيدر الجديد: اللوجو واسم المنصة بشكل احترافي */}
      <header className="flex flex-col items-center justify-center mb-12 text-center">
        <div className="flex items-center gap-3 mb-3">
          {/* ضع صورة الشعار في مجلد public باسم logo.png أو غير المسار حسب رغبتك */}
          <div className="relative w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-md">
            <span>إ</span>
            {/* إذا أردت استبداله بصورة شعار حقيقية، فك تفعيل السطر التالي: */}
            {/* <Image src="/logo.png" alt="شعار إنجازيا" fill className="object-contain" /> */}
          </div>
          <div className="text-right">
            <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">إنجازيا للحلول الرقمية</h2>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">منصة كليك قدرات</span>
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mt-2">
          لوحة الاختبارات الشاملة
        </h1>
        <p className="text-gray-500 text-sm mt-2 max-w-md">
          اختر الاختبار البدء بالتدريب المحاكي المكون من 5 أقسام لضمان أعلى درجات الجاهزية.
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
              <div className="inline-block bg-blue-50 text-blue-700 font-bold text-xs px-3 py-1 rounded-full mb-4">
                اختبار رقم {exam.id}
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
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
