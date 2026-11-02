'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { EXAMS_DATA } from '@/app/qudurat/lib/examsConfig';

export default function ExamsDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-10" dir="rtl">
      
      {/* الهيدر العلوي */}
      <header className="bg-white shadow-sm rounded-3xl p-6 md:p-8 max-w-4xl mx-auto w-full mb-10 border border-gray-200 text-center flex flex-col items-center">
        
        {/* اللوجو واسم المنصة */}
        <div className="flex items-center justify-center gap-3 mb-3">
          <Image
            src="/logo.png"
            alt="شعار منصة كليك قدرات"
            width={56}
            height={56}
            className="rounded-2xl shadow-sm flex-shrink-0"
            priority
          />
          <div className="text-right">
            <h2 className="text-lg md:text-xl font-extrabold text-gray-900 tracking-tight">منصة كليك قدرات</h2>
            <span className="text-xs font-semibold text-blue-600 block">الاحتراف في التدريب المحاكي</span>
          </div>
        </div>

        {/* عنوان لوحة الاختبارات */}
        <div className="w-full pt-4 border-t border-gray-100 mt-4">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800">
            لوحة الاختبارات الشاملة
          </h1>
          <p className="text-gray-500 text-xs md:text-sm mt-1">
            اختر الاختبار لبدء التدريب المحاكي المكون من 5 أقسام (جميع الاختبارات متاحة مجاناً 🎁).
          </p>
        </div>
      </header>
      
      {/* شبكة عرض البطاقات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {EXAMS_DATA.map((exam) => (
          <div 
            key={exam.id} 
            className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 text-center shadow-sm transition-all duration-200 flex flex-col justify-between hover:border-blue-500 hover:shadow-md"
          >
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-gray-400">اختبار رقم {exam.id}</span>
                <span className="bg-green-100 text-green-700 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full">
                  متاح مجاناً
                </span>
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {exam.title}
              </h2>
              <p className="text-sm text-gray-500 mb-8">
                {exam.description}
              </p>
            </div>
            
            <Link 
              href={`/qudurat/test?examId=${exam.id}`}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-sm block text-center text-sm"
            >
              ابدأ الاختبار الآن
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
