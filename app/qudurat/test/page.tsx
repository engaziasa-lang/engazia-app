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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // حالة فتح قائمة الجوال

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
    setIsMobileMenuOpen(false); // إغلاق القائمة في الجوال عند الاختيار
  };

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

  if (isFinished) {
    const nextExamId = activeExamId + 1;
    const hasNextExam = nextExamId <= 10;
    const nextExam = hasNextExam ? EXAMS_DATA.find(e => e.id === nextExamId) : null;

    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6" dir="rtl">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <h1 className="text-3xl font-bold text-green-600 mb-2">🎉 أحسنت! أنهيت الاختبار</h1>
          <p className="text-gray-600 mb-6">أكملت بنجاح {examQuestions.length} سؤالاً في {currentExam.title}.</p>
          
          <div className="space-y-3">
            {hasNextExam && nextExam && (
              <button
                onClick={() => handleSwitchExam(nextExam.id)}
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all shadow-md cursor-pointer"
              >
                الانتقال إلى {nextExam.title} {nextExam.isFree ? '' : '🔒'}
              </button>
            )}
            <a 
              href="/qudurat/exams" 
              className="block w-full bg-gray-200 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-300 transition-all text-center"
            >
              العودة للوحة الرئيسية
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 relative" dir="rtl">
      {/* شريط علوي متجاوب */}
      <header className="bg-white shadow-sm rounded-2xl p-4 mb-6 max-w-4xl mx-auto w-full flex justify-between items-center border border-gray-100">
        <div>
          <h1 className="font-bold text-blue-900 text-base md:text-lg">{currentExam.title}</h1>
          <span className="text-xs text-gray-500">السؤال {currentIndex + 1} من {examQuestions.length}</span>
        </div>

        {/* 1. للشاشات الكبيرة (Desktop): عرض الأزرار أفقياً */}
        <div className="hidden lg:flex items-center gap-1.5">
          {EXAMS_DATA.map((exam) => {
            const isCurrent = exam.id === activeExamId;
            const lockedIndicator = !exam.isFree && !isUserSubscribed;
            return (
              <button
                key={exam.id}
                onClick={() => handleSwitchExam(exam.id)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isCurrent 
                    ? 'bg-blue-600 text-white shadow-md scale-105' 
                    : lockedIndicator 
                    ? 'bg-gray-100 text-gray-400 hover:bg-gray-200 border border-gray-200' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                اختبار {exam.id} {lockedIndicator ? '🔒' : ''}
              </button>
            );
          })}
        </div>

        {/* 2. للجوال والتابليت (Mobile & Tablet): زر منسق يفتح القائمة */}
        <div className="lg:hidden relative">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-xs font-bold border border-blue-200 flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <span>قائمة الاختبارات ({activeExamId}/10)</span>
            <span>▼</span>
          </button>

          {/* قائمة منسدلة للجوال */}
          {isMobileMenuOpen && (
            <div className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 p-2 z-50 space-y-1">
              {EXAMS_DATA.map((exam) => {
                const isCurrent = exam.id === activeExamId;
                const lockedIndicator = !exam.isFree && !isUserSubscribed;
                return (
                  <button
                    key={exam.id}
                    onClick={() => handleSwitchExam(exam.id)}
                    className={`w-full text-right px-3 py-2 rounded-lg text-xs font-bold transition-all flex justify-between items-center cursor-pointer ${
                      isCurrent 
                        ? 'bg-blue-600 text-white' 
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <span>{exam.title}</span>
                    <span>{lockedIndicator ? '🔒' : ''}</span>
                  </button>
                );
              })}
            </div>
          )}
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
