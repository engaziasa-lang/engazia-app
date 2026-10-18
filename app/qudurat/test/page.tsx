// app/qudurat/test/page.tsx
'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import questionsData from '../data/questions.json';
import { EXAMS_DATA } from '../lib/examsConfig';

function ExamContent() {
  const searchParams = useSearchParams();
  const urlExamId = Number(searchParams.get('examId')) || 1;

  // الحفاظ على رقم الاختبار وحالة الاشتراك في الذاكرة المحلية (localStorage)
  const [activeExamId, setActiveExamId] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const savedExamId = localStorage.getItem('qudurat_active_exam');
      return savedExamId ? Number(savedExamId) : urlExamId;
    }
    return urlExamId;
  });

  const [isUserSubscribed, setIsUserSubscribed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('qudurat_subscribed') === 'true';
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem('qudurat_active_exam', activeExamId.toString());
  }, [activeExamId]);

  useEffect(() => {
    localStorage.setItem('qudurat_subscribed', isUserSubscribed.toString());
  }, [isUserSubscribed]);

  const currentExam = EXAMS_DATA.find((e) => e.id === activeExamId) || EXAMS_DATA[0];
  const isLocked = !currentExam.isFree && !isUserSubscribed;

  // جلب الـ 125 سؤالاً الخاصة بالاختبار الحالي
  const examQuestions = questionsData.slice(currentExam.startIndex, currentExam.endIndex);

  // تقسيم الـ 125 سؤالاً إلى 5 أقسام (كل قسم 25 سؤالاً)
  const TOTAL_SECTIONS = 5;
  const QUESTIONS_PER_SECTION = 25;
  
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0); 
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); 
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [isFinished, setIsFinished] = useState(false);

  // مؤقت زمني لكل قسم 25 دقيقة (1500 ثانية)
  const [timeLeft, setTimeLeft] = useState(1500);

  useEffect(() => {
    if (isFinished || isLocked) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleNextSectionOrFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentSectionIndex, isFinished, isLocked]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // استخراج أسئلة القسم الحالي فقط (25 سؤالاً)
  const currentSectionQuestions = examQuestions.slice(
    currentSectionIndex * QUESTIONS_PER_SECTION,
    (currentSectionIndex + 1) * QUESTIONS_PER_SECTION
  );

  const currentQuestion = currentSectionQuestions[currentQuestionIndex];

  const handleSelectOption = (option: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion.id]: option,
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < currentSectionQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleNextSectionOrFinish();
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNextSectionOrFinish = () => {
    if (currentSectionIndex < TOTAL_SECTIONS - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
      setCurrentQuestionIndex(0);
      setTimeLeft(1500);
      alert(`🎉 انتهى وقت القسم ${currentSectionIndex + 1}! جاري الانتقال للقسم ${currentSectionIndex + 2}`);
    } else {
      setIsFinished(true);
    }
  };

  const handleSwitchExam = (targetId: number) => {
    const targetExam = EXAMS_DATA.find((e) => e.id === targetId);
    if (targetExam && !targetExam.isFree && !isUserSubscribed) {
      alert(`🔒 ${targetExam.title} يتطلب اشتراكاً مميزاً. يرجى الترقية لفتحه!`);
      return;
    }
    setActiveExamId(targetId);
    setCurrentSectionIndex(0);
    setCurrentQuestionIndex(0);
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
                alert("🎉 تم تفعيل الاشتراك بنجاح!");
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

    const correctAnswersCount = Object.keys(selectedAnswers).length;

    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6" dir="rtl">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full text-center border border-gray-200">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">🎉 أنهيت أقسام الاختبار بنجاح!</h1>
          <p className="text-gray-600 mb-6 text-sm">أكملت {correctAnswersCount} إجابة من أصل 125 سؤالاً.</p>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-right">
            <p className="text-sm font-bold text-blue-900 mb-1">💡 ملاحظة هامة:</p>
            <p className="text-xs text-blue-700 leading-relaxed">
              لقد أتممت الاختبار التجريبي (المجاني). منصة كليك قدرات توفر <strong>9 اختبارات إضافية شاملة</strong> مصممة بعناية لمساعدتك على تطوير قدراتك وتحسين مهاراتك ورفع جاهزيتك للاختبار الحقيقي. اشترك الآن وافتح كافة الباقات!
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
                  alert("🎉 تم تفعيل الاشتراك بنجاح!");
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
      
      {/* شريط الملاحظة العلوي الهادئ */}
      <div className="max-w-5xl mx-auto w-full mb-3 text-center text-xs text-gray-500 font-normal tracking-wide">
        أنت تختبر الآن في <span className="font-semibold text-gray-700">{currentExam.title} (نسخة تجريبية مجانية)</span> — تتوفر 9 اختبارات إضافية متقدمة للمشتركين لرفع جاهزيتك.
      </div>

      {/* البطاقة العلوية المنسقة بدقة (الصورة واسم الطالب يمين، المؤقت وسط، اسم الاختبار والقسم يسار) */}
      <header className="bg-white shadow-sm rounded-2xl p-4 md:p-5 max-w-5xl mx-auto w-full mb-6 border border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* الجانب الأيمن: صورة الطالب، اسمه، ورقم الهوية */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold text-xs flex-shrink-0 shadow-inner">
              صورة
            </div>
            <div className="text-right">
              <h3 className="font-bold text-gray-800 text-sm">اسم الطالب المتدرب</h3>
              <span className="text-xs text-gray-500 font-mono tracking-wider">رقم الهوية: 10****2345</span>
            </div>
          </div>

          {/* المنتصف: المؤقت التنازلي الحقيقي */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl px-5 py-2 shadow-sm text-center">
            <span className="font-mono font-bold text-2xl text-blue-900 tracking-widest">{formatTime(timeLeft)}</span>
          </div>

          {/* الجانب الأيسر: اسم الاختبار، رقم القسم، ورقم السؤال بتنسيق أنيق جداً */}
          <div className="text-center md:text-left">
            <div className="bg-blue-50/70 border border-blue-100 px-4 py-2 rounded-xl">
              <span className="font-bold text-blue-900 text-xs md:text-sm block">
                {currentExam.title}
              </span>
              <span className="text-[11px] font-medium text-blue-700">
                القسم {currentSectionIndex + 1} من {TOTAL_SECTIONS} &nbsp;|&nbsp; السؤال {currentQuestionIndex + 1} من {QUESTIONS_PER_SECTION}
              </span>
            </div>
          </div>

        </div>
      </header>

      {/* منطقة السؤال والخيارات بنظام العمودين */}
      <main className="bg-white shadow-sm rounded-2xl p-6 md:p-10 max-w-5xl mx-auto w-full border border-gray-200 flex-grow flex flex-col justify-between">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
          
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

        <div className="flex justify-between items-center pt-6 border-t border-gray-100">
          <button
            onClick={handlePrev}
            disabled={currentQuestionIndex === 0 && currentSectionIndex === 0}
            className={`px-6 py-2.5 rounded-xl font-bold transition-all ${
              currentQuestionIndex === 0 && currentSectionIndex === 0 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer'
            }`}
          >
            السابق
          </button>

          <button
            onClick={handleNext}
            className="px-8 py-2.5 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all cursor-pointer"
          >
            {currentSectionIndex === TOTAL_SECTIONS - 1 && currentQuestionIndex === currentSectionQuestions.length - 1 
              ? 'إنهاء الاختبار' 
              : 'التالي'}
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
