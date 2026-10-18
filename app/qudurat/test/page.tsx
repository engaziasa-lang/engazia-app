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

  // مؤقت زمني تنازلي 25 دقيقة (1500 ثانية)
  const [timeLeft, setTimeLeft] = useState(1500);

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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
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
    setTimeLeft(1500);
  };

  // شاشة قفل الاختبارات المدفوعة
  if (isLocked) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6" dir="rtl">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full text-center border-2 border-yellow-200">
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{currentExam.title} مغلق</h1>
          <p className="text-gray-600 mb-6 text-sm">هذا الاختبار مخصص للمشتركين فقط. استمتع بالوصول الكامل لجميع الاختبارات الـ 10!</p>
          
          <div className="space-y-3">
            <button
              onClick={() => {
                setIsUserSubscribed(true);
                alert("🎉 تم تفعيل الاشتراك بنجاح تجريبياً!");
              }}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all shadow-md cursor-pointer text-sm"
            >
              اشترك الآن لفتح جميع الاختبارات
            </button>
            <a 
              href="/qudurat/exams" 
              className="block w-full bg-gray-200 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-300 transition-all text-center text-sm"
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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6" dir="rtl">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full text-center">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">🎉 انقضى وقت القسم!</h1>
          <p className="text-gray-600 mb-6 text-sm">أكملت بنجاح {Object.keys(selectedAnswers).length} إجابة من أصل {examQuestions.length} سؤالاً.</p>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-right">
            <p className="text-sm font-bold text-blue-900 mb-1">💡 ملاحظة هامة:</p>
            <p className="text-xs text-blue-700 leading-relaxed">
              لقد أتممت الاختبار التجريبي الأول (المجاني). منصة كليك قدرات تحتوي على <strong>9 اختبارات إضافية شاملة</strong> مصممة خصيصاً لضمان تفوقك. اشترك الآن وافتح كافة الباقات!
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
    <div className="min-h-screen bg-gray-100 flex flex-col justify-between p-4 md:p-6" dir="rtl">
      
      {/* البطاقة العلوية المعدلة (صورة الطالب فوق بياناته، والمؤقت بجانبها لتقليل العرض) */}
      <header className="bg-white shadow-sm rounded-2xl p-4 md:p-5 max-w-5xl mx-auto w-full mb-6 border border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          
          {/* الجانب الأيمن: اسم الاختبار ورقم السؤال */}
          <div className="text-center sm:text-right">
            <h2 className="font-bold text-gray-800 text-base">
              {currentExam.title} — السؤال {currentIndex + 1} من {examQuestions.length}
            </h2>
          </div>

          {/* الجانب الأيسر: المؤقت + بيانات الطالب وتحسها أيقونة الصورة */}
          <div className="flex items-center gap-4">
            {/* المؤقت الزمني المدمج */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 shadow-sm text-center">
              <span className="font-mono font-bold text-xl text-blue-900 tracking-widest">{formatTime(timeLeft)}</span>
            </div>

            {/* بيانات الطالب وتحسها أيقونة الصورة */}
            <div className="flex items-center gap-3 border-r border-gray-200 pr-4">
              <div className="text-right">
                <h3 className="font-bold text-gray-800 text-xs">اسم الطالب المتدرب</h3>
                <span className="text-[11px] text-gray-500 font-mono">رقم الهوية: 2345****10</span>
              </div>
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold text-xs flex-shrink-0">
                صورة
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* منطقة السؤال والخيارات بنظام العمودين */}
      <main className="bg-white shadow-sm rounded-2xl p-6 md:p-10 max-w-5xl mx-auto w-full border border-gray-200 flex-grow flex flex-col justify-between">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
          
          {/* الجانب الأيمن: نص السؤال والتصنيف (5 أعمدة) */}
          <div className="lg:col-span-5 border-l-0 lg:border-l lg:border-gray-100 lg:pl-8">
            <div className="mb-4">
              <span className="inline-block bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full font-semibold">
                {currentQuestion.category}
              </span>
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-relaxed">
              {currentQuestion.text}
            </h2>
          </div>

          {/* الجانب الأيسر: الاختيارات الأربعة (7 أعمدة) */}
          <div className="lg:col-span-7 space-y-4">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedAnswers[currentQuestion.id] === option;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(option)}
                  className={`w-full text-right p-4 rounded-xl border-2 font-medium transition-all cursor-pointer flex justify-between items-center ${
                    isSelected 
                      ? 'border-blue-600 bg-blue-50/50 text-blue-950 shadow-sm' 
                      : 'border-gray-200 hover:border-gray-300 bg-white text-gray-800'
                  }`}
                >
                  <span className="text-base md:text-lg font-bold">{option}</span>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                  }`}>
                    {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                  </div>
                </button>
              );
            })}
          </div>

        </div>

        {/* أزرار التنقل السفلية */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-100">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`px-6 py-2.5 rounded-xl font-bold transition-all ${
              currentIndex === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer'
            }`}
          >
            السابق
          </button>

          <button
            onClick={handleNext}
            className="px-8 py-2.5 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all cursor-pointer"
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
    <Suspense fallback={<div className="min-h-screen bg-gray-100 flex items-center justify-center font-bold text-blue-600">جاري تحميل شاشة الاختبار...</div>}>
      <ExamContent />
    </Suspense>
  );
}
