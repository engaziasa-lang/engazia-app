'use client';

import React, { useState, useEffect } from 'react';

// تعريف هيكل الحصة الأسبوعية الثابتة (4 حصص: الأحد، الاثنين، الثلاثاء، الأربعاء الساعة 5 عصراً)
interface WeeklyClass {
  id: string;
  dayName: string;
  sessionTitle: string;
  gregorianDateStr: string; // مثال نصي للعرض
  hijriDateStr: string;     // التاريخ الهجري
  targetISO: string;        // التاريخ الفعلي للعد التنازلي (الساعة 5:00 عصراً = 17:00)
  zoomLink: string;         // رابط زوم الخاص بك
}

const weeklyClasses: WeeklyClass[] = [
  {
    id: 'cls-sun',
    dayName: 'الأحد',
    sessionTitle: 'الحصة التدريبية الأولى',
    gregorianDateStr: 'الأحد - 25 أكتوبر 2026 (5:00 م)',
    hijriDateStr: '14 بطي 1448 هـ',
    targetISO: '2026-10-25T17:00:00',
    zoomLink: 'https://zoom.us/j/your-zoom-room-id' // ضع رابط زوم الفعلي هنا
  },
  {
    id: 'cls-mon',
    dayName: 'الاثنين',
    sessionTitle: 'الحصة التدريبية الثانية',
    gregorianDateStr: 'الاثنين - 26 أكتوبر 2026 (5:00 م)',
    hijriDateStr: '15 بطي 1448 هـ',
    targetISO: '2026-10-26T17:00:00',
    zoomLink: 'https://zoom.us/j/your-zoom-room-id'
  },
  {
    id: 'cls-tue',
    dayName: 'الثلاثاء',
    sessionTitle: 'الحصة التدريبية الثالثة',
    gregorianDateStr: 'الثلاثاء - 27 أكتوبر 2026 (5:00 م)',
    hijriDateStr: '16 بطي 1448 هـ',
    targetISO: '2026-10-27T17:00:00',
    zoomLink: 'https://zoom.us/j/your-zoom-room-id'
  },
  {
    id: 'cls-wed',
    dayName: 'الأربعاء',
    sessionTitle: 'الحصة التدريبية الرابعة',
    gregorianDateStr: 'الأربعاء - 28 أكتوبر 2026 (5:00 م)',
    hijriDateStr: '17 بطي 1448 هـ',
    targetISO: '2026-10-28T17:00:00',
    zoomLink: 'https://zoom.us/j/your-zoom-room-id'
  }
];

export default function StudentHubPage() {
  const [timeLefts, setTimeLefts] = useState<Record<string, { days: number; hours: number; minutes: number; seconds: number; isExpired: boolean }>>({});

  // تحديث العد التنازلي كل ثانية لكل الحصص
  useEffect(() => {
    const updateTimers = () => {
      const newTimeLefts: Record<string, any> = {};
      
      weeklyClasses.forEach((cls) => {
        const targetTime = new Date(cls.targetISO).getTime();
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
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans" dir="rtl">
      
      {/* شريط منصة الطالب العلوي */}
      <header className="bg-slate-900 text-white px-4 md:px-8 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-inner bg-white flex items-center justify-center">
            <span className="text-blue-600 font-extrabold text-xl">ك</span>
          </div>
          <div>
            <h1 className="font-bold text-base md:text-lg leading-tight">منصة كليك قدرات - جدول الحصص</h1>
            <span className="text-blue-300 text-xs">مواعيد الحصص الأسبوعية المباشرة</span>
          </div>
        </div>
        <div className="bg-blue-600/20 text-blue-300 px-3 py-1 rounded-xl text-xs font-bold border border-blue-500/30">
          حصص الأسبوع الحالي
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <main className="flex-grow max-w-4xl w-full mx-auto p-4 md:p-8 space-y-6">
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 text-center space-y-2">
          <h2 className="text-xl md:text-2xl font-black text-slate-900">جدول الحصص التدريبية الأسبوعية</h2>
          <p className="text-slate-600 text-sm">
            تُعقد الحصص من الأحد إلى الأربعاء في تمام الساعة 5:00 عصراً. تابع العد التنازلي وانضم عبر زوم في الموعد المحدد!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {weeklyClasses.map((cls) => {
            const time = timeLefts[cls.id] || { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false };

            return (
              <div 
                key={cls.id} 
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 flex flex-col justify-between gap-4 transition hover:shadow-md"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                      يوم {cls.dayName}
                    </span>
                    <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-md">
                      الساعة 5:00 عصراً
                    </span>
                  </div>

                  <h3 className="text-lg font-extrabold text-slate-900">{cls.sessionTitle}</h3>
                  
                  {/* التواريخ ميلادي وهجري */}
                  <div className="space-y-1 text-xs text-slate-500 pt-1">
                    <div>📅 {cls.gregorianDateStr}</div>
                    <div>🌙 الموافق: {cls.hijriDateStr}</div>
                  </div>
                </div>

                {/* العد التنازلي */}
                <div className="bg-slate-900 text-white p-3 rounded-xl flex flex-col items-center justify-center">
                  <span className="text-[10px] text-blue-300 mb-1">الوقت المتبقي لبدء الحصة</span>
                  
                  {time.isExpired ? (
                    <div className="text-emerald-400 font-bold text-xs py-1">الحصة متاحة الآن للانضمام 🟢</div>
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

                {/* زر ادخل الحصة عبر زوم */}
                <a
                  href={cls.zoomLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-sm transition shadow-sm flex items-center justify-center gap-2"
                >
                  <span>ادخل الحصة عبر زوم</span>
                  <span>🎥</span>
                </a>

              </div>
            );
          })}
        </div>

      </main>

    </div>
  );
}
