'use client';

import React from 'react';
import { useParams } from 'next/navigation';

export default function ExamPage() {
  const params = useParams();
  const examId = params?.id; // سيجلب رقم الاختبار تلقائياً (من 1 إلى 30) من الرابط

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4" dir="rtl">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          الاختبار الشامل رقم {examId}
        </h1>
        <p className="text-gray-600 mb-6">
          يتكون هذا الاختبار من 5 أقسام (بإجمالي 125 سؤالاً فريداً).
        </p>

        {/* عرض الـ 5 أقسام الخاصة بهذا الاختبار */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          {[1, 2, 3, 4, 5].map((sectionNum) => (
            <div key={sectionNum} className="border border-blue-100 bg-blue-50/50 rounded-xl p-4 text-center">
              <span className="block text-sm text-gray-500 mb-1">القسم</span>
              <span className="text-lg font-bold text-blue-600">{sectionNum}</span>
              <span className="block text-xs text-gray-400 mt-1">25 سؤالاً</span>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl transition duration-200 shadow-md">
            ابدأ القسم الأول الآن
          </button>
        </div>
      </div>
    </div>
  );
}
