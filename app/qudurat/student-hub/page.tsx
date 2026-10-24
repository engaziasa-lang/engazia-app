'use client';

import React, { useState, useEffect } from 'react';

interface WeeklyClass {
  id: string;
  dayName: string;
  sessionTitle: string;
  gregorianDateStr: string;
  hijriDateStr: string;
  targetISO: string;
  zoomLink: string;
}

const weeklyClasses: WeeklyClass[] = [
  {
    id: 'cls-sun',
    dayName: 'الأحد',
    sessionTitle: 'الحصة التدريبية الأولى',
    gregorianDateStr: 'الأحد - 25 أكتوبر 2026',
    hijriDateStr: '14 جمادى الأولى 1448 هـ',
    targetISO: '2026-10-25T17:00:00',
    zoomLink: 'https://zoom.us/j/your-zoom-room-id'
  },
  {
    id: 'cls-mon',
    dayName: 'الاثنين',
    sessionTitle: 'الحصة التدريبية الثانية',
    gregorianDateStr: 'الاثنين - 26 أكتوبر 2026',
    hijriDateStr: '15 جمادى الأولى 1448 هـ',
    targetISO: '2026-10-26T17:00:00',
    zoomLink: 'https://zoom.us/j/your-zoom-room-id'
  },
  {
    id: 'cls-tue',
    dayName: 'الثلاثاء',
    sessionTitle: 'الحصة التدريبية الثالثة',
    gregorianDateStr: 'الثلاثاء - 27 أكتوبر 2026',
    hijriDateStr: '16 جمادى الأولى 1448 هـ',
    targetISO: '2026-10-27T17:00:00',
    zoomLink: 'https://zoom.us/j/your-zoom-room-id'
  },
  {
    id: 'cls-wed',
    dayName: 'الأربعاء',
    sessionTitle: 'الحصة التدريبية الرابعة',
    gregorianDateStr: 'الأربعاء - 28 أكتوبر 2026',
    hijriDateStr: '17 جمادى الأولى 1448 هـ',
    targetISO: '2026-10-28T17:00:00',
    zoomLink: 'https://zoom.us/j/your-zoom-room-id'
  }
];

export default function StudentHubPage() {
  const [timeLefts, setTimeLefts] = useState<Record<string, { days: number; hours: number; minutes: number; seconds: number; isExpired: boolean }>>({});

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
    <div className="min-h-[100dvh] bg-slate-100 flex flex-col font-sans" dir="rtl">
      
      {/* الشريط العلوي */}
      <header className="bg-slate-900 text-white px-4 py-3 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg overflow-hidden bg-white flex items-center justify-center flex-shrink-0">
            <span className="text-blue-600 font-extrabold text-lg">ك</span>
          </div>
          <div>
            <h1 className="font-bold text-sm md:text-base leading-tight">كليك قدرات</h1>
            <span className="text-blue-300 text-[10px]">جدول الحصص الأسبوعية</span>
          </div>
        </div>
        <span className="bg-blue-600/30 text-blue-300 px-2.5 py-1 rounded-lg text-[11px] font-bold border border-blue-500/30">
          الأسبوع الحالي
        </span>
      </header>

      {/* المحتوى الرئيسي */}
      <main className="flex-grow max-w-xl w-full mx-auto p-3 md:p-6 space-y-4">
        
        {/* بطاقة الترحيب */}
        <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-200 text-center space-y-1.5">
          <h2 className="text-lg md:text-xl font-black text-slate-900">جدول الحصص الأسبوعية</h2>
          <p className="text-slate-600 text-xs md:text-sm">
            الحصص من الأحد للأربعاء (الساعة 5:00 عصراً). انضم مباشرة عبر زوم!
          </p>
        </div>

        {/* قائمة الحصص */}
        <div className="space-y-3">
          {weeklyClasses.map((cls) => {
            const time = timeLefts[cls.id] || { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false };

            return (
              <div 
                key={cls.id} 
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 flex flex-col gap-3 transition hover:shadow-md"
              >
                {/* رأس البطاقة */}
                <div className="flex justify-between items-center">
                  <span className="bg-blue-50 text-blue-700 text-xs font-extrabold px-2.5 py-1 rounded-lg">
                    {cls.dayName}
                  </span>
                  <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                    ⏰ الساعة 5:00 عصراً
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-extrabold text-slate-900">{cls.sessionTitle}</h3>
                  <div className="text-[11px] md:text-xs text-slate-500 space-y-0.5">
                    <div>📅 {cls.gregorianDateStr}</div>
                    <div>🌙 الموافق: {cls.hijriDateStr}</div>
                  </div>
                </div>

                {/* العد التنازلي المصغر للجوال */}
                <div className="bg-slate-900 text-white p-2.5 rounded-xl flex flex-col items-center justify-center">
                  <span className="text-[10px] text-blue-300 mb-1">الوقت المتبقي لبدء الحصة</span>
                  
                  {time.isExpired ? (
                    <div className="text-emerald-400 font-bold text-xs py-1 animate-pulse">الحصة متاحة الآن للانضمام 🟢</div>
                  ) : (
                    <div className="grid grid-cols-4 gap-1.5 text-center font-mono w-full">
                      <div className="bg-slate-800 p-1 rounded-lg">
                        <div className="text-xs md:text-sm font-black text-amber-400">{time.days}</div>
                        <div className="text-[7px] text-slate-400">يوم</div>
                      </div>
                      <div className="bg-slate-800 p-1 rounded-lg">
                        <div className="text-xs md:text-sm font-black text-amber-400">{time.hours}</div>
                        <div className="text-[7px] text-slate-400">ساعة</div>
                      </div>
                      <div className="bg-slate-800 p-1 rounded-lg">
                        <div className="text-xs md:text-sm font-black text-amber-400">{time.minutes}</div>
                        <div className="text-[7px] text-slate-400">دقيقة</div>
                      </div>
                      <div className="bg-slate-800 p-1 rounded-lg">
                        <div className="text-xs md:text-sm font-black text-blue-400">{time.seconds}</div>
                        <div className="text-[7px] text-slate-400">ثانية</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* زر ادخل الحصة عبر زوم */}
                <a
                  href={cls.zoomLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs md:text-sm transition shadow-sm flex items-center justify-center gap-2"
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
