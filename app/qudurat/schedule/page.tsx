'use client';

import React, { useState, useEffect, useMemo } from 'react';
import questionsData from '../data/training-questions.json';

export default function SchedulePage() {
  const [timeLefts, setTimeLefts] = useState<Record<string, { days: number; hours: number; minutes: number; seconds: number; isExpired: boolean }>>({});

  // استخراج الحصص تلقائياً من ملف training-questions.json وتحديد تواريخ افتراضية تجريبية أو مجدولة
  const sessionsList = useMemo(() => {
    const map: Record<string, { week: number; session: number; count: number; category: string }> = {};
    
    questionsData.forEach(q => {
      if (q.week && q.session) {
        const key = `W${q.week}-S${q.session}`;
        if (!map[key]) {
          map[key] = {
            week: q.week,
            session: q.session,
            count: 0,
            category: q.category || 'تدريب عام'
          };
        }
        map[key].count++;
      }
    });

    // تحويل الكائن إلى مصفوفة وترتيبها
    return Object.entries(map).map(([id, data]) => ({
      id,
      title: `حصة تدريبية (أسبوع ${data.week} - حصة ${data.session})`,
      week: data.week,
      session: data.session,
      questionsCount: data.count,
      category: data.category,
      // تاريخ تجريبي يبدأ تدريجياً (يمكنك ربطه بقاعدة بيانات لاحقاً)
      gregorianDate: '2026-11-01T18:00:00',
      hijriDate: '1448-05-20 هـ'
    })).sort((a, b) => a.week - b.week || a.session - b.session);
  }, []);

  // حساب العد التنازلي لكل حصة بدقة
  useEffect(() => {
    const updateTimers = () => {
      const newTimeLefts: Record<string, any> = {};
      
      sessionsList.forEach((cls) => {
        // لتوضيح المثال، نجعل كل حصة بوقت مختلف قليلاً أو نفس الوقت المستهدف
        const targetTime = new Date('2026-11-01T18:00:00').getTime();
        const now = new Date().getTime();
        const difference = targetTime - now;

        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((difference % (1000 * 60)) / 1000);

          newTimeLefts[cls.id] = { days, hours, minutes, seconds, isExpired: false };
        } else {
          newTimeLefts[cls.id] = { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
        }
      });

      setTimeLefts(newTimeLefts);
    };

    updateTimers();
    const interval = setInterval(updateTimers, 1000);
    return () => clearInterval(interval);
  }, [sessionsList]);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans" dir="rtl">
      
      {/* الشريط العلوي */}
      <header className="bg-slate-900 text-white px-4 md:px-8 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-inner bg-white flex items-center justify-center">
            <span className="text-blue-600 font-extrabold text-xl">ك</span>
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">منصة كليك قدرات</h1>
            <span className="text-blue-300 text-xs">جدول الحصص والمواعيد القادمة</span>
          </div>
        </div>
        <a 
          href="/qudurat/presenter" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-sm transition shadow"
        >
          العودة لوضع العرض 🚀
        </a>
      </header>

      {/* محتوى الجدول */}
      <main className="flex-grow max-w-5xl w-full mx-auto p-4 md:p-8 space-y-6">
        
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900">جدول الحصص التدريبية (مستخرج تلقائياً)</h2>
          <p className="text-slate-600 text-sm md:text-base">تظهر هنا كافة الحصص الموجودة في النظام مع عداد تنازلي مباشر لبدء كل جلسة.</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {sessionsList.map((cls) => {
            const time = timeLefts[cls.id] || { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false };

            return (
              <div 
                key={cls.id} 
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition hover:shadow-md"
              >
                {/* تفاصيل الحصة */}
                <div className="space-y-2 flex-grow">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                      الأسبوع {cls.week} - الحصة {cls.session}
                    </span>
                    <span className="bg-gray-100 text-gray-700 text-xs font-bold px-3 py-1 rounded-full">
                      {cls.questionsCount} سؤالاً تدريبياً
                    </span>
                  </div>

                  <h3 className="text-lg md:text-xl font-extrabold text-slate-900">{cls.title}</h3>
                  <p className="text-slate-600 text-sm">التصنيف الأساسي: {cls.category}</p>

                  {/* التواريخ (ميلادي وهجري) */}
                  <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-slate-500 pt-1">
                    <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                      <span>📅 ميلادي:</span>
                      <span className="font-bold text-slate-700">{cls.gregorianDate.replace('T', ' - الساعة ')}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                      <span>🌙 هجري:</span>
                      <span className="font-bold text-slate-700">{cls.hijriDate}</span>
                    </div>
                  </div>
                </div>

                {/* عداد الوقت التنازلي */}
                <div className="w-full md:w-auto bg-slate-900 text-white p-4 rounded-2xl shadow-inner flex flex-col items-center justify-center min-w-[260px]">
                  <span className="text-[11px] text-blue-300 font-semibold mb-2">الوقت المتبقي لبدء الحصة</span>
                  
                  <div className="grid grid-cols-4 gap-2 text-center font-mono">
                    <div className="bg-slate-800 p-2 rounded-xl">
                      <div className="text-lg md:text-xl font-black text-amber-400">{time.days}</div>
                      <div className="text-[10px] text-slate-400">أيام</div>
                    </div>
                    <div className="bg-slate-800 p-2 rounded-xl">
                      <div className="text-lg md:text-xl font-black text-amber-400">{time.hours}</div>
                      <div className="text-[10px] text-slate-400">ساعات</div>
                    </div>
                    <div className="bg-slate-800 p-2 rounded-xl">
                      <div className="text-lg md:text-xl font-black text-amber-400">{time.minutes}</div>
                      <div className="text-[10px] text-slate-400">دقائق</div>
                    </div>
                    <div className="bg-slate-800 p-2 rounded-xl">
                      <div className="text-lg md:text-xl font-black text-blue-400">{time.seconds}</div>
                      <div className="text-[10px] text-slate-400">ثواني</div>
                    </div>
                  </div>

                  <a
                    href="/qudurat/presenter"
                    className="mt-3 w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 rounded-lg text-xs transition"
                  >
                    دخول القاعة الذكية
                  </a>
                </div>

              </div>
            );
          })}
        </div>

      </main>

    </div>
  );
}
