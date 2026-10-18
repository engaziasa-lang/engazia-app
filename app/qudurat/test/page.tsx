// app/qudurat/test/page.tsx
'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import questionsData from '../data/questions.json';
import { EXAMS_DATA } from '../lib/examsConfig';

function ExamContent() {
  const searchParams = useSearchParams();
  const initialExamId = Number(searchParams.get('examId')) || 1;

  const [activeExamId, setActiveExamId] = useState(initialExamId);
  const [isUserSubscribed, setIsUserSubscribed] = useState(false);

  const currentExam = EXAMS_DATA.find((e) => e.id === activeExamId) || EXAMS_DATA[0];
  const isLocked = !currentExam.isFree && !isUserSubscribed;

  const examQuestions = questionsData.slice(currentExam.startIndex, currentExam.endIndex);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [isFinished, setIsFinished] = useState(false);

  // مؤقت زمني تنازلي حقيقي لاختبار القدرات (مثلاً ساعتان = 7200 ثانية)
  const [timeLeft, setTimeLeft] = useState(7200);

  useEffect(() => {
    if (isFinished || isLocked) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isFinished, isLocked]);

  // تنسيق الوقت (ساعات:دقائق:ثواني)
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs > 0 ? `${hrs}:${mins < 10 ? '0' : ''}` : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const currentQuestion = examQuestions[currentIndex];

  const handleSelectOption = (option: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion.id]: option,
    });
  };

  const handleNext = () => {
    if (currentIndex < examQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSwitchExam = (targetId: number) => {
    const targetExam = EXAMS_DATA.find((e) => e.id === targetId);
    if (targetExam && !targetExam.isFree && !isUserSubscribed) {
      alert(`🔒 ${targetExam.title} يتطلب اشتراكاً مميزاً. يرجى الترقية لفتحه!`);
      return;
    }
    setActiveExamId(targetId);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setIsFinished(false);
    setTimeLeft(7200);
  };

  // شاشة قفل الاختبارات المدفوعة
  if (isLocked) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white" dir="rtl">
        <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl max-w-lg w-full text-center border border-slate-700">
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold mb-2">{currentExam.title} مغلق</h1>
          <p className="text-slate-300 mb-6 text-sm">هذا الاختبار مخصص للمشتركين فقط. استمتع بالوصول الكامل لجميع الاختبارات الـ 10 وكسر رهبة الاختبار الحقيقي!</p>
          
          <div className="space-y-3">
            <button
              onClick={() => {
                setIsUserSubscribed(true);
                alert("🎉 تم تفعيل الاشتراك بنجاح تجريبياً!");
              }}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-500 transition-all cursor-pointer shadow-lg"
            >
              اشترك الآن لفتح جميع الاختبارات
            </button>
            <a 
              href="/qudurat/exams" 
              className="block w-full bg-slate-700 text-slate-200 font-bold py-3 rounded-xl hover:bg-slate-600 transition-all text-center text-sm"
            >
              العودة لقائمة الاختبارات
            </a>
          </div>
        </div>
      </div>
    );
  }

  // شاشة نهاية الاختبار
  if (isFinished) {
    const nextExamId = activeExamId + 1;
    const hasNextExam = nextExamId <= 10;
    const nextExam = hasNextExam ? EXAMS_DATA.find(e => e.id === nextExamId) : null;
    const isNextLocked = nextExam && !nextExam.isFree && !isUserSubscribed;

    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6" dir="rtl">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full text-center border border-slate-200">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">🎉 انتهى وقت الاختبار</h1>
          <p className="text-gray-600 mb-6 text-sm">أكملت بنجاح {Object.keys(selectedAnswers).length} إجابة من أصل {examQuestions.length} سؤالاً.</p>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-right">
            <p className="text-sm font-bold text-blue-900 mb-1">💡 ملاحظة هامة:</p>
            <p className="text-xs text-blue-700 leading-relaxed">
              لقد أتممت الاختبار التجريبي الأول (المجاني). منصة كليك قدرات تحتوي على <strong>9 اختبارات إضافية شاملة</strong> مصممة خصيصاً لضمان تفوقك وكسر رهبة الاختبار الحقيقي. اشترك الآن وافتح كافة الباقات!
            </p>
          </div>
          
          <div className="space-y-3">
            {hasNextExam && nextExam && (
              <div className={`p-4 rounded-xl border-2 transition-all flex justify-between items-center ${isNextLocked ? 'border-amber-300 bg-amber-50/50' : 'border-blue-200 bg-blue-50'}`}>
                <div className="text-right">
                  <h3 className="font-bold text-gray-800 text-sm">{nextExam.title} {isNextLocked ? '🔒' : ''}</h3>
                  <p className="text-xs text-gray-500">{nextExam.description}</p>
                </div>
                <button
                  onClick={() => handleSwitchExam(nextExam.id)}
                  className={`px-4 py-2 rounded-lg font-bold text-xs text-white transition-all cursor-pointer ${
                    isNextLocked ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isNextLocked ? 'اشترك لفتحه' : 'ابدأ الآن'}
                </button>
              </div>
            )}

            {isNextLocked && (
              <button
                onClick={() => {
                  setIsUserSubscribed(true);
                  alert("🎉 تم تفعيل الاشتراك بنجاح تجريبياً!");
                }}
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all shadow-md cursor-pointer text-sm"
              >
                ترقية الحساب وفتح جميع الاختبارات الـ 9 🚀
              </button>
            )}

            <a 
              href="/qudurat/exams" 
              className="block w-full bg-gray-200 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-300 transition-all text-center text-sm"
            >
              العودة للوحة الرئيسية
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between select-none" dir="rtl">
      
      {/* 1. الشريط العلوي المطابق لشاشة مركز قياس الفعلي */}
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex flex-col md:flex-row justify-between items-center shadow-md gap-3">
        <div className="flex items-center gap-4">
          <span className="bg-blue-600 text-white font-bold text-xs px-3 py-1 rounded">محاكي قياس</span>
          <h1 className="font-bold text-base md:text-lg text-white">{currentExam.title}</h1>
        </div>

        {/* المؤقت الزمني التنازلي الحقيقي */}
        <div className="flex items-center gap-6">
          <div className="bg-slate-900 border border-slate-700 px-4 py-1.5 rounded-lg flex items-center gap-2">
            <span className="text-xs text-slate-400">الوقت المتبقي:</span>
            <span className="font-mono font-bold text-amber-400 text-sm tracking-wider">{formatTime(timeLeft)}</span>
          </div>

          <span className="text-xs text-slate-300 font-medium bg-slate-700 px-3 py-1.5 rounded-lg">
            السؤال {currentIndex + 1} من {examQuestions.length}
          </span>
        </div>
      </header>

      {/* تنبيه ترويجي علوي يوضح أن الاختبار مجاني والبقية مقفلة */}
      <div className="bg-blue-900/40 border-b border-blue-800/50 text-blue-200 px-6 py-2 text-center text-xs">
        ✨ أنت الآن في الاختبار التجريبي الأول (المجاني بالكامل) — منصة كليك قدرات توفر 9 اختبارات إضافية متقدمة للمشتركين 🔒
      </div>

      {/* 2. منطقة عرض السؤال والخيارات (تصميم قياس الرسمي) */}
      <main className="flex-grow max-w-5xl mx-auto w-full p-4 md:p-8 flex flex-col justify-between">
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 md:p-10 shadow-xl">
          <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
            <span className="bg-slate-700 text-blue-300 text-xs px-3 py-1 rounded-md font-semibold">
              {currentQuestion.category}
            </span>
            <span className="text-xs text-slate-400 font-mono">رقم السؤال: {currentQuestion.id}</span>
          </div>

          <h2 className="text-lg md:text-2xl font-bold text-white mb-8 leading-relaxed">
            {currentQuestion.text}
          </h2>

          <div className="space-y-4 mb-8">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedAnswers[currentQuestion.id] === option;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(option)}
                  className={`w-full text-right p-4 rounded-xl border-2 font-medium transition-all cursor-pointer flex items-center gap-4 ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-600/20 text-white shadow-md' 
                      : 'border-slate-700 bg-slate-900/50 hover:border-slate-600 text-slate-200'
                  }`}
                >
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                    isSelected ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {idx + 1}
                  </span>
                  <span className="flex-grow">{option}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. شريط التنقل السفلي */}
        <div className="flex justify-between items-center mt-6 bg-slate-800 border border-slate-700 p-4 rounded-2xl">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
              currentIndex === 0 
                ? 'bg-slate-700/50 text-slate-500 cursor-not-allowed' 
                : 'bg-slate-700 text-slate-200 hover:bg-slate-600 cursor-pointer'
            }`}
          >
            السابق
          </button>

          <button
            onClick={handleNext}
            className="px-8 py-2.5 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-500 text-white shadow-md transition-all cursor-pointer"
          >
            {currentIndex === examQuestions.length - 1 ? 'إنهاء الاختبار' : 'التالي'}
          </button>
        </div>
      </main>

    </div>
  );
}

export default function ExamTestPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900 flex items-center justify-center font-bold text-blue-400">جاري تحميل شاشة الاختبار...</div>}>
      <ExamContent />
    </Suspense>
  );
}
