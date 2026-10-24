'use client';

import React, { useState, useEffect, useMemo } from 'react';
import questionsData from '../data/training-questions.json';

export default function StudentHubPage() {
  const [timeLefts, setTimeLefts] = useState<Record<string, { days: number; hours: number; minutes: number; seconds: number; isExpired: boolean }>>({});

  // 1. تحديد الأسبوع الحالي تلقائياً (يمكنك تثبيته على الأسبوع المطلوب مثل الأسبوع 20)
  const currentActiveWeek = 20;

  // 2. استخراج حصص الأسبوع الحالي فقط ليرها الطلاب
  const weekSessions = useMemo(() => {
    const map: Record<number, { session: number; count: number; category: string }> = {};
    
    questionsData.forEach(q => {
      if (q.week === currentActiveWeek && q.session) {
        if (!map[q.session]) {
          map[q.session] = {
            session: q.session,
            count: 0,
            category: q.category || 'قدرات عامة'
          };
        }
        map[q.session].count++;
      }
    });

    return Object.entries(map).map(([sessionNum, data]) => ({
      id: `W${currentActiveWeek}-S${sessionNum}`,
      week: currentActiveWeek,
      session: Number(sessionNum),
      questionsCount: data.count,
      category: data.category,
      title: `الحصة التدريبية رقم ${sessionNum}`,
      // وقت تجريبي لبدء الحصة (يمكنك تحديثه حسب جدولك الفعلي)
      targetTime: '2026-11-01T18:00:00', 
      hijriDate: '1448 هـ'
    })).sort((a, b) => a.session - b.session);
  }, []);

  // 3. تحديث العد التنازلي لكل حصة أسبوعية
  useEffect(() => {
    const updateTimers = () => {
      const newTimeLefts: Record<string, any> = {};
      
      weekSessions.forEach((cls) => {
        const targetTime = new Date(cls.targetTime).getTime();
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
  }, [weekSessions]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans" dir="rtl">
      
      {/* شريط منصة الطالب العلوي */}
      <header className="bg-slate-900 text-white px-4 md:px-8 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-inner bg-white flex items-center justify-center">
            <span className="text-blue-600 font-extrabold text-xl">ك</span>
          </div>
          <div>
            <h1 className="font-bold text-base md:text-lg leading-tight">منصة كليك قدرات - بوابة الطالب</h1>
            <span className="text-blue-300 text-xs">جدول الحصص الأسبوعية المباشرة</span>
          </div>
        </div>
        <div className="bg-blue-600/20 text-blue-300 px-3 py-1 rounded-xl text-xs font-bold border border-blue-500/30">
          الأسبوع الحالي: الـ {currentActiveWeek}
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <main className="flex-grow max-w-4xl w-full mx-auto p-4 md:p-8 space-y-6">
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 text-center space-y-2">
          <h2 className="text-xl md:text-2xl font-black text-slate-900">حصص الأسبوع ({currentActiveWeek})</h2>
          <p className="text-slate-600 text-sm">
            إليك الحصص المجدولة لهذا الأسبوع. تابع العد التنازلي واضغط على (ادخل الحصة) فور بدء الموعد للانضمام للقاعة الذكية!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {weekSessions.map((cls) => {
            const time = timeLefts[cls.id] || { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false };

            return (
              <div 
                key={cls.id} 
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 flex flex-col justify-between gap-4 transition hover:shadow-md"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                      الحصة رقم {cls.session}
                    </span>
                    <span className="text-xs text-gray-500 font-bold">
                      {cls.questionsCount} سؤالاً
                    </span>
                  </div>

                  <h3 className="text-lg font-extrabold text-slate-900">{cls.title}</h3>
                  <p className="text-xs text-slate-500">التصنيف: {cls.category}</p>
                </div>

                {/* العد التنازلي المصغر */}
                <div className="bg-slate-900 text-white p-3 rounded-xl flex flex-col items-center justify-center">
                  <span className="text-[10px] text-blue-300 mb-1">الوقت المتبقي لبدء الحصة</span>
                  
                  {time.isExpired ? (
                    <div className="text-emerald-400 font-bold text-xs py-1">الحصة متاحة الآن 🟢</div>
                  ) : (
                    <div className="grid grid-cols-4 gap-1.5 text-center font-mono w-full">
                      <div className="bg-slate-800 p-1.5 rounded-lg">
                        <div className="text-sm font-black text-amber-400">{time.days}</div>
                        <div className="text-[8px] text-slate-400">يوم</div>
                      </div>
                      <div className="bg-slate-800 p-1.5 rounded-lg">
                        <div className="text-sm font-black text-amber-400">{time.hours}</div>
                        <div className="text-[8px] text-slate-400">ساعة</div>
                      </div>
                      <div className="bg-slate-800 p-1.5 rounded-lg">
                        <div className="text-sm font-black text-amber-400">{time.minutes}</div>
                        <div className="text-[8px] text-slate-400">دقيقة</div>
                      </div>
                      <div className="bg-slate-800 p-1.5 rounded-lg">
                        <div className="text-sm font-black text-blue-400">{time.seconds}</div>
                        <div className="text-[8px] text-slate-400">ثانية</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* زر ادخل الحصة */}
                <a
                  href="/qudurat/presenter"
                  className="w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-sm transition shadow-sm flex items-center justify-center gap-2"
                >
                  <span>ادخل الحصة</span>
                  <span>🚀</span>
                </a>

              </div>
            );
          })}
        </div>

      </main>

    </div>
  );
}
