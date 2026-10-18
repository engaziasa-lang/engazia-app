// app/qudurat/test/page.tsx
'use client';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import questionsData from '../data/questions.json';
import { EXAMS_DATA } from '../lib/examsConfig';

export default function ExamTestPage() {
  const searchParams = useSearchParams();
  const initialExamId = Number(searchParams.get('examId')) || 1;

  const [activeExamId, setActiveExamId] = useState(initialExamId);
  const [isUserSubscribed, setIsUserSubscribed] = useState(false); // حالة الاشتراك (تتغير لـ true عند الدفع)

  // معلومات الاختبار الحالي
  const currentExam = EXAMS_DATA.find((e) => e.id === activeExamId) || EXAMS_DATA[0];
  
  // التحقق من صلاحية الدخول للاختبار
  const isLocked = !currentExam.isFree && !isUserSubscribed;

  // جلب الـ 125 سؤالاً الخاصة بهذا الاختبار
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

  // تغيير الاختبار من القائمة العلوية
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

  // شاشة قفل الاختبارات المدفوعة
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
                // محاكاة عملية الاشتراك التجريبي
                setIsUserSubscribed(true);
                alert("🎉 تم تفعيل الاشتراك بنجاح تجريبياً! يمكنك الآن الدخول لجميع الاختبارات.");
              }}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all shadow-md"
            >
              اشترك الآن لفتح جميع الاختبارات
            </button>
            <a 
              href="/qudurat/exams" 
              className="block w-full bg-gray-200 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-300 transition-all"
            >
              العودة لقائمة الاختبارات
            </a>
          </div>
        </div>
      </div>
    );
  }

  // شاشة نهاية الاختبار مع خيار الانتقال للاختبار التالي
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
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all shadow-md"
              >
                الانتقال إلى {nextExam.title} {nextExam.isFree ? '' : '🔒'}
              </button>
            )}
            <a 
              href="/qudurat/exams" 
              className="block w-full bg-gray-200 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-300 transition-all"
            >
              العودة للوحة الرئيسية
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-between p-4 md:p-8" dir="rtl">
      {/* شريط التنقل العلوي بين الاختبارات */}
      <header className="bg-white shadow-sm rounded-xl p-4 mb-6 max-w-4xl mx-auto w-full flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="font-bold text-blue-900 text-lg">{currentExam.title}</h1>
          <span className="text-xs text-gray-500">السؤال {currentIndex + 1} من {examQuestions.length}</span>
        </div>

        {/* أزرار سريعة لتغيير الاختبار */}
        <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-2 md:pb-0">
          {EXAMS_DATA.map((exam) => {
            const isCurrent = exam.id === activeExamId;
            const lockedIndicator = !exam.isFree && !isUserSubscribed;
            return (
              <button
                key={exam.id}
                onClick={() => handleSwitchExam(exam.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  isCurrent 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : lockedIndicator 
                    ? 'bg-gray-100 text-gray-400 border border-gray-200' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                اختبار {exam.id} {lockedIndicator ? '🔒' : ''}
              </button>
            );
          })}
        </div>
      </header>

      {/* صندوق عرض الأسئلة والخيارات */}
      <main className="bg-white shadow-md rounded-2xl p-6 md:p-10 max-w-4xl mx-auto w-full flex-grow flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center mb-4">
            <span className="inline-block bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full font-semibold">
              {currentQuestion.category}
            </span>
            <span className="text-xs text-gray-400 font-mono">ID: {currentQuestion.id}</span>
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-8 leading-relaxed">
            {currentQuestion.text}
          </h2>

          <div className="space-y-4">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedAnswers[currentQuestion.id] === option;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(option)}
                  className={`w-full text-right p-4 rounded-xl border-2 font-medium transition-all ${
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
        </div>

        {/* أزرار التنقل بين الأسئلة */}
        <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-100">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              currentIndex === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            السابق
          </button>

          <button
            onClick={handleNext}
            className="px-8 py-3 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all"
          >
            {currentIndex === examQuestions.length - 1 ? 'إنهاء الاختبار' : 'السؤال التالي'}
          </button>
        </div>
      </main>
    </div>
  );
}
