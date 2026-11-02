'use client';

import React, { useState, useEffect } from 'react';

// تعريف واجهة البيانات للحصة
interface WeeklyClass {
  id: string;
  dayName: string;
  sessionTitle: string;
  gregorianDateStr: string;
  hijriDateStr: string;
  targetISO: string;       // بداية العد التنازلي (5:00 عصراً)
  endOfDayISO: string;     // نهاية اليوم (لكي تختفي الحصة بعد انتهائه)
  zoomLink: string;
}

// دالة لتوليد حصص الأسبوع تلقائياً بناءً على تاريخ اليوم
function getDynamicClasses(): WeeklyClass[] {
  const now = new Date();
  const currentDayOfWeek = now.getDay(); // 0: الأحد, 1: الاثنين, ..., 6: السبت
  
  // تحديد يوم الأحد للأسبوع الحالي
  let baseSunday = new Date(now);
  baseSunday.setHours(0, 0, 0, 0);
  baseSunday.setDate(now.getDate() - currentDayOfWeek);

  // تحديد نهاية الأسبوع التدريبي (نهاية يوم الأربعاء الساعة 23:59)
  let endOfWednesday = new Date(baseSunday);
  endOfWednesday.setDate(baseSunday.getDate() + 3);
  endOfWednesday.setHours(23, 59, 59, 999);

  // إذا تجاوزنا يوم الأربعاء (أي نحن الآن في الخميس، الجمعة، أو السبت)
  // قم بتحديث الجدول ليعرض حصص الأسبوع القادم تلقائياً
  if (now.getTime() > endOfWednesday.getTime()) {
    baseSunday.setDate(baseSunday.getDate() + 7);
  }

  // الأيام المطلوبة (الأحد 0، الاثنين 1، الثلاثاء 2، الأربعاء 3)
  const daysOffset = [0, 1, 2, 3];
  const zoomLink = "https://us05web.zoom.us/j/86930969173?pwd=s7u9oTvQSbd6OIeO5LJHG1nvlIzvCS.1";
  const titles = ['الحصة التدريبية الأولى', 'الحصة التدريبية الثانية', 'الحصة التدريبية الثالثة', 'الحصة التدريبية الرابعة'];

  // أدوات تهيئة التواريخ باللغة العربية
  const gregFormatter = new Intl.DateTimeFormat('ar-SA', { numberingSystem: 'latn', weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const hijriFormatter = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', { numberingSystem: 'latn', day: 'numeric', month: 'long', year: 'numeric' });
  const dayNameFormatter = new Intl.DateTimeFormat('ar-SA', { weekday: 'long' });

  return daysOffset.map((offset) => {
    const classDate = new Date(baseSunday);
    classDate.setDate(baseSunday.getDate() + offset);

    // توقيت بدء الحصة (الساعة 17:00 أي 5:00 عصراً)
    const target = new Date(classDate);
    target.setHours(17, 0, 0, 0);

    // توقيت نهاية الحصة واختفائها (الساعة 23:59:59 من نفس اليوم)
    const endOfDay = new Date(classDate);
    endOfDay.setHours(23, 59, 59, 999);

    return {
      id: `cls-${offset}`,
      dayName: dayNameFormatter.format(classDate),
      sessionTitle: titles[offset],
      gregorianDateStr: gregFormatter.format(classDate).replace('،', ' -'),
      hijriDateStr: `${hijriFormatter.format(classDate)} هـ`,
      targetISO: target.toISOString(),
      endOfDayISO: endOfDay.toISOString(),
      zoomLink: zoomLink
    };
  });
}

export default function StudentHubPage() {
  const [classes, setClasses] = useState<WeeklyClass[]>([]);
  const [timeLefts, setTimeLefts] = useState<Record<string, { days: number; hours: number; minutes: number; seconds: number; isExpired: boolean }>>({});
  const [nowTime, setNowTime] = useState<number>(0);
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true); // لضمان التوافق مع SSR في Next.js وتجنب أخطاء Hydration

    const updateTimers = () => {
      const currentTimestamp = new Date().getTime();
      setNowTime(currentTimestamp);

      // توليد الحصص أسبوعياً بشكل ديناميكي
      const currentClasses = getDynamicClasses();
      setClasses(currentClasses);

      const newTimeLefts: Record<string, any> = {};
      
      currentClasses.forEach((cls) => {
        const targetTime = new Date(cls.targetISO).getTime();
        const difference = targetTime - currentTimestamp;

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

  // عدم عرض المحتوى قبل تحميل العميل لتجنب وميض التواريخ
  if (!isClient) {
    return (
      <div className="min-h-[100dvh] bg-slate-100 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  // تصفية الحصص بحيث تختفي تلقائياً فور انتهاء يومها المحدد
  const activeClasses = classes.filter(cls => {
    const endTime = new Date(cls.endOfDayISO).getTime();
    return nowTime < endTime;
  });

  return (
    <div className="min-h-[100dvh] bg-slate-100 flex flex-col font-sans" dir="rtl">
      
      {/* الشريط العلوي */}
      <header className="bg-slate-900 text-white px-4 md:px-8 py-3.5 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl overflow-hidden bg-white flex items-center justify-center flex-shrink-0 shadow-inner">
            <span className="text-blue-600 font-extrabold text-xl">ك</span>
          </div>
          <div>
            <h1 className="font-bold text-base md:text-lg leading-tight">منصة كليك قدرات</h1>
            <span className="text-blue-300 text-xs">جدول الحصص الأسبوعية المباشرة</span>
          </div>
        </div>
        <span className="bg-blue-600/30 text-blue-300 px-3 py-1.5 rounded-xl text-xs font-bold border border-blue-500/30">
          الأسبوع الحالي
        </span>
      </header>

      {/* المحتوى الرئيسي */}
      <main className="flex-grow max-w-6xl w-full mx-auto p-4 md:p-8 space-y-6">
        
        {/* بطاقة الترحيب */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-xl md:text-2xl font-black text-slate-900">جدول الحصص الأسبوعية</h2>
          <p className="text-slate-600 text-sm">
            تُعقد الحصص من الأحد إلى الأربعاء في تمام الساعة 5:00 عصراً. انضم مباشرة عبر زوم! تختفي الحصة تلقائياً بعد انتهاء يومها.
          </p>
        </div>

        {/* شبكة الحصص (متجاوبة: عمودي للجوال وشبكي أفقياً للكمبيوتر) */}
        {activeClasses.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center text-slate-400 font-bold border border-gray-200">
            لا توجد حصص نشطة حالياً لهذا الأسبوع. ترقبوا الجدول الجديد قريباً! 🚀
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {activeClasses.map((cls) => {
              const time = timeLefts[cls.id] || { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false };

              return (
                <div 
                  key={cls.id} 
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between gap-5 transition hover:shadow-md"
                >
                  {/* رأس البطاقة */}
                  <div className="flex justify-between items-center">
                    <span className="bg-blue-50 text-blue-700 text-sm font-extrabold px-3.5 py-1 rounded-xl">
                      {cls.dayName}
                    </span>
                    <span className="text-xs md:text-sm text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-lg">
                      ⏰ الساعة 5:00 عصراً
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-lg md:text-xl font-extrabold text-slate-900">{cls.sessionTitle}</h3>
                    <div className="text-xs md:text-sm text-slate-500 space-y-1">
                      <div>📅 {cls.gregorianDateStr}</div>
                      <div>🌙 الموافق: {cls.hijriDateStr}</div>
                    </div>
                  </div>

                  {/* العد التنازلي */}
                  <div className="bg-slate-900 text-white p-4 rounded-xl flex flex-col items-center justify-center shadow-inner">
                    <span className="text-xs text-blue-300 mb-2 font-medium">الوقت المتبقي لبدء الحصة</span>
                    
                    {time.isExpired ? (
                      <div className="text-emerald-400 font-bold text-sm py-2 animate-pulse">الحصة متاحة الآن للانضمام عبر زوم 🟢</div>
                    ) : (
                      <div className="grid grid-cols-4 gap-2 text-center font-mono w-full">
                        <div className="bg-slate-800 p-2 rounded-xl">
                          <div className="text-base md:text-lg font-black text-amber-400">{time.days}</div>
                          <div className="text-[10px] text-slate-400">يوم</div>
                        </div>
                        <div className="bg-slate-800 p-2 rounded-xl">
                          <div className="text-base md:text-lg font-black text-amber-400">{time.hours}</div>
                          <div className="text-[10px] text-slate-400">ساعة</div>
                        </div>
                        <div className="bg-slate-800 p-2 rounded-xl">
                          <div className="text-base md:text-lg font-black text-amber-400">{time.minutes}</div>
                          <div className="text-[10px] text-slate-400">دقيقة</div>
                        </div>
                        <div className="bg-slate-800 p-2 rounded-xl">
                          <div className="text-base md:text-lg font-black text-blue-400">{time.seconds}</div>
                          <div className="text-[10px] text-slate-400">ثانية</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* زر ادخل الحصة عبر زوم */}
                  <a
                    href={cls.zoomLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-sm md:text-base transition shadow-sm flex items-center justify-center gap-2"
                  >
                    <span>ادخل الحصة عبر زوم</span>
                    <span>🎥</span>
                  </a>

                </div>
              );
            })}
          </div>
        )}

      </main>
    </div>
  );
}
