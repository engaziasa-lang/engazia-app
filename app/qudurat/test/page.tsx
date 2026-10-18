// app/qudurat/test/page.tsx
'use client';
export const dynamic = 'force-dynamic';

import { useState, Suspense } from 'react';
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
  };

  // شاشة قفل الاختبارات المدفوعة المباشرة
  if (isLocked) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6" dir="rtl">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full text-center border-2 border-yellow-200">
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{currentExam.title} مغلق</h1>
          <p className="text-gray-600 mb-6">هذا الاختبار مخصص للمشتركين فقط. استمتع بالوصول الكامل لجميع الاختبارات الـ 10 وكسر رهبة الاختبار الحقيقي!</p>
          
          <div className="space-y-3">
            <button
              onClick={() => {
                setIsUserSubscribed(true);
                alert("🎉 تم تفعيل الاشتراك بنجاح تجريبياً! يمكنك الآن الدخول لجميع الاختبارات.");
              }}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all shadow-md cursor-pointer"
            >
              اشترك الآن لفتح جميع الاختبارات
            </button>
            <a 
              href="/qudurat/exams" 
              className="block w-full bg-gray-200 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-300 transition-all text-center"
            >
              العودة لقائمة الاختبارات
            </a>
          </div>
        </div>
      </div>
    );
  }

  // شاشة نهاية الاختبار مع إبراز الاختبار الثاني المقفل وعرض ملاحظة الترقية
  if (isFinished) {
    const nextExamId = activeExamId + 1;
    const hasNextExam = nextExamId <= 10;
    const nextExam = hasNextExam ? EXAMS_DATA.find(e => e.id === nextExamId) : null;
    const isNextLocked = nextExam && !nextExam.isFree && !isUserSubscribed;

    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6" dir="rtl">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full text-center">
          <h1 className="text-3xl font-bold text-green-600 mb-2">🎉 أحسنت! أنهيت {currentExam.title}</h1>
          <p className="text-gray-600 mb-6">لقد أكملت بنجاح {examQuestions.length} سؤالاً.</p>

          {/* ملاحظة ترويجية تسويقية */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-right">
            <p className="text-sm font-bold text-blue-900 mb-1">💡 ملاحظة هامة:</p>
            <p className="text-xs text-blue-700 leading-relaxed">
              لقد أتممت الاختبار التجريبي الأول (المجاني). منصة كليك قدرات تحتوي على <strong>9 اختبارات إضافية شاملة</strong> مصممة خصيصاً لضمان تفوقك وكسر رهبة الاختبار الحقيقي. اشترك الآن وافتح كافة الباقات!
            </p>
          </div>
          
          <div className="space-y-3">
            {hasNextExam && nextExam && (
              <div className={`p-4 rounded-xl border-2 transition-all flex justify-between items-center ${isNextLocked ? 'border-yellow-300 bg-yellow-50/50' : 'border-blue-200 bg-blue-50'}`}>
                <div className="text-right">
                  <h3 className="font-bold text-gray-800 text-sm">{nextExam.title} {isNextLocked ? '🔒' : ''}</h3>
                  <p className="text-xs text-gray-500">{nextExam.description}</p>
                </div>
                <button
                  onClick={() => handleSwitchExam(nextExam.id)}
                  className={`px-4 py-2 rounded-lg font-bold text-xs text-white transition-all cursor-pointer ${
                    isNextLocked ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-blue-600 hover:bg-blue-700'
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
    <div className="min-h-screen bg-gray-100 p-4 md:p-8" dir="rtl">
      {/* شريط ملاحظة ترويجية في أعلى الصفحة يوضح أن هذا مجاني وأن هناك 9 اختبارات تحتاج اشتراك */}
      <div className="max-w-4xl mx-auto mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-xl shadow-sm flex flex-col sm:flex-row justify-between items-center text-xs md:text-sm font-medium gap-2">
        <span>✨ أنت الآن تختبر في <strong>{currentExam.title} (مجاني بالكامل)</strong></span>
        <span className="bg-white/20 px-3 py-1 rounded-lg">لديك 9 اختبارات أخرى متقدمة بانتظار اشتراكك 🔒</span>
      </div>

      {/* الشريط العلوي الكلاسيكي النظيف */}
      <header className="bg-white shadow-sm rounded-2xl p-4 mb-6 max-w-4xl mx-auto w-full flex justify-between items-center border border-gray-100">
        <div>
          <h1 className="font-bold text-blue-900 text-base md:text-lg">{currentExam.title}</h1>
          <span className="text-xs text-gray-500">السؤال {currentIndex + 1} من {examQuestions.length}</span>
        </div>

        <div className="text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg">
          اختبار {activeExamId} من 10
        </div>
      </header>

      {/* صندوق عرض الأسئلة والخيارات */}
      <main className="bg-white shadow-md rounded-2xl p-6 md:p-10 max-w-4xl mx-auto w-full border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <span className="inline-block bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full font-semibold">
            {currentQuestion.category}
          </span>
          <span className="text-xs text-gray-400 font-mono">ID: {currentQuestion.id}</span>
        </div>

        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-8 leading-relaxed">
          {currentQuestion.text}
        </h2>

        <div className="space-y-4 mb-10">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedAnswers[currentQuestion.id] === option;
            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(option)}
                className={`w-full text-right p-4 rounded-xl border-2 font-medium transition-all cursor-pointer ${
                  isSelected 
                    ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-sm' 
                    : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                }`}
              >
                <span className="inline-block w-8 font-bold text-gray-400">({idx + 1})</span>
                {option}
              </button>
            );
          })}
        </div>

        <div className="flex justify-between items-center pt-6 border-t border-gray-100">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              currentIndex === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer'
            }`}
          >
            السابق
          </button>

          <button
            onClick={handleNext}
            className="px-8 py-3 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all cursor-pointer"
          >
            {currentIndex === examQuestions.length - 1 ? 'إنهاء الاختبار' : 'السؤال التالي'}
          </button>
        </div>
      </main>
    </div>
  );
}

export default function ExamTestPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-bold text-blue-600">جاري تحميل الاختبار...</div>}>
      <ExamContent />
    </Suspense>
  );
}
