// app/qudurat/test/page.tsx
'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import questionsData from '../data/questions.json';
import { EXAMS_DATA } from '../lib/examsConfig';

const TOTAL_SECTIONS = 5;
const QUESTIONS_PER_SECTION = 25;

// مكون نافذة التفعيل المستقل
function ActivationModalComponent({
  isOpen,
  onClose,
  code,
  setCode,
  error,
  onActivate,
  isActivating
}: {
  isOpen: boolean;
  onClose: () => void;
  code: string;
  setCode: (val: string) => void;
  error: string;
  onActivate: () => void;
  isActivating: boolean;
}) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4" dir="rtl">
      <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-md w-full border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">🔑 تفعيل الاشتراك</h2>
          <button onClick={onClose} disabled={isActivating} className="text-gray-400 hover:text-gray-600 font-bold text-2xl cursor-pointer leading-none">&times;</button>
        </div>
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          أدخل كود التفعيل الذي وصلك عبر البريد الإلكتروني أو رسالة الجوال لفتح جميع الاختبارات. <br/>
          <span className="text-xs text-red-500 font-medium mt-1 inline-block">ملاحظة: سيتم ربط الكود بهذا الجهاز فقط.</span>
        </p>
        
        <input
          type="text"
          placeholder="مثال: QUD-XXXX"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          disabled={isActivating}
          className="w-full border-2 border-gray-200 rounded-xl p-3 text-center text-lg font-bold tracking-widest text-gray-800 uppercase focus:border-blue-500 focus:outline-none transition-all mb-2 disabled:bg-gray-50 disabled:text-gray-400"
          dir="ltr"
          autoFocus
        />
        {error && <p className="text-red-500 text-xs font-bold mb-4">{error}</p>}
        
        <div className="mt-6 flex gap-3">
          <button 
            onClick={onActivate} 
            disabled={isActivating}
            className={`flex-1 text-white font-bold py-3 rounded-xl transition-all shadow-md ${isActivating ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'}`}
          >
            {isActivating ? 'جاري التحقق...' : 'تفعيل الآن'}
          </button>
          <button 
            onClick={onClose} 
            disabled={isActivating}
            className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition-all cursor-pointer disabled:opacity-50"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}

function ExamContent() {
  const searchParams = useSearchParams();
  const urlExamId = Number(searchParams.get('examId')) || 1;

  const [deviceId, setDeviceId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      let id = localStorage.getItem('qudurat_device_id');
      if (!id) {
        id = 'dev_' + Math.random().toString(36).substring(2, 15);
        localStorage.setItem('qudurat_device_id', id);
      }
      return id;
    }
    return '';
  });

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

  const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(() => {
    if (typeof window !== 'undefined') return Number(localStorage.getItem('qudurat_section')) || 0;
    return 0;
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(() => {
    if (typeof window !== 'undefined') return Number(localStorage.getItem('qudurat_question')) || 0;
    return 0;
  });

  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('qudurat_answers');
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });

  const [isFinished, setIsFinished] = useState<boolean>(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('qudurat_finished') === 'true';
    return false;
  });

  const [timeLeft, setTimeLeft] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('qudurat_time_left');
      return saved ? Number(saved) : 1500;
    }
    return 1500;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activationCode, setActivationCode] = useState('');
  const [activationError, setActivationError] = useState('');
  const [isActivating, setIsActivating] = useState(false);

  useEffect(() => localStorage.setItem('qudurat_active_exam', activeExamId.toString()), [activeExamId]);
  useEffect(() => localStorage.setItem('qudurat_subscribed', isUserSubscribed.toString()), [isUserSubscribed]);
  useEffect(() => localStorage.setItem('qudurat_section', currentSectionIndex.toString()), [currentSectionIndex]);
  useEffect(() => localStorage.setItem('qudurat_question', currentQuestionIndex.toString()), [currentQuestionIndex]);
  useEffect(() => localStorage.setItem('qudurat_answers', JSON.stringify(selectedAnswers)), [selectedAnswers]);
  useEffect(() => localStorage.setItem('qudurat_finished', isFinished.toString()), [isFinished]);

  const currentExam = EXAMS_DATA.find((e) => e.id === activeExamId) || EXAMS_DATA[0];
  const isLocked = !currentExam.isFree && !isUserSubscribed;
  const examQuestions = questionsData.slice(currentExam.startIndex, currentExam.endIndex);
  
  useEffect(() => {
    if (isFinished || isLocked) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) return 0;
        const newTime = prev - 1;
        localStorage.setItem('qudurat_time_left', newTime.toString());
        return newTime;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isFinished, isLocked]);

  useEffect(() => {
    if (timeLeft === 0 && !isFinished) {
      if (currentSectionIndex < TOTAL_SECTIONS - 1) {
        setCurrentSectionIndex((prev) => prev + 1);
        setCurrentQuestionIndex(0);
        setTimeLeft(1500);
        localStorage.setItem('qudurat_time_left', '1500');
        alert(`🎉 انتهى وقت القسم ${currentSectionIndex + 1}! جاري الانتقال للقسم ${currentSectionIndex + 2}`);
      } else {
        setIsFinished(true);
      }
    }
  }, [timeLeft, currentSectionIndex, isFinished]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const currentSectionQuestions = examQuestions.slice(
    currentSectionIndex * QUESTIONS_PER_SECTION,
    (currentSectionIndex + 1) * QUESTIONS_PER_SECTION
  );

  const currentQuestion = currentSectionQuestions[currentQuestionIndex] || currentSectionQuestions[0];

  const handleSelectOption = (option: string) => {
    setSelectedAnswers({ ...selectedAnswers, [currentQuestion.id]: option });
  };

  const handleNext = () => {
    if (currentQuestionIndex < currentSectionQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      if (currentSectionIndex < TOTAL_SECTIONS - 1) {
        setCurrentSectionIndex(currentSectionIndex + 1);
        setCurrentQuestionIndex(0);
        setTimeLeft(1500);
        localStorage.setItem('qudurat_time_left', '1500');
        alert(`🎉 أنهيت أسئلة القسم ${currentSectionIndex + 1}! جاري الانتقال للقسم ${currentSectionIndex + 2}`);
      } else {
        setIsFinished(true);
      }
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) setCurrentQuestionIndex(currentQuestionIndex - 1);
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
    localStorage.setItem('qudurat_section', '0');
    localStorage.setItem('qudurat_question', '0');
    localStorage.setItem('qudurat_answers', JSON.stringify({}));
    localStorage.setItem('qudurat_finished', 'false');
    localStorage.setItem('qudurat_time_left', '1500');
  };

  // الدالة للاتصال بقاعدة البيانات والتحقق من الكود
  const handleActivateCode = async () => {
    setActivationError('');
    if (!activationCode.trim()) {
      setActivationError('الرجاء إدخال كود التفعيل.');
      return;
    }

    setIsActivating(true);
    try {
      const response = await fetch('/api/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: activationCode, deviceId: deviceId }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsUserSubscribed(true);
        setIsModalOpen(false);
        setActivationCode('');
        alert(data.message); 
      } else {
        setActivationError(data.message || 'الكود غير صحيح أو تم استخدامه مسبقاً.');
      }
    } catch (error) {
      setActivationError('حدث خطأ في الاتصال بالخادم. تأكد من اتصالك بالإنترنت وحاول مرة أخرى.');
    } finally {
      setIsActivating(false);
    }
  };

  if (isLocked) {
    return (
      <div className="h-[100dvh] bg-gray-100 flex flex-col items-center justify-center p-6" dir="rtl">
        <ActivationModalComponent 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          code={activationCode}
          setCode={setActivationCode}
          error={activationError}
          onActivate={handleActivateCode}
          isActivating={isActivating}
        />
        
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full text-center border-2 border-yellow-200">
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{currentExam.title} مغلق</h1>
          <p className="text-gray-600 mb-6 text-sm">هذا الاختبار مخصص للمشتركين فقط. استمتع بالوصول الكامل لجميع الاختبارات الـ 10!</p>
          <div className="space-y-3">
            <a href="https://enjazya.lemonsqueezy.com/checkout/buy/13f3f36f-c53b-4227-91c6-b556ae13aee2" target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all shadow-md text-sm cursor-pointer">
              شراء باقة الاختبارات (الدفع الإلكتروني)
            </a>
            <button onClick={() => setIsModalOpen(true)} className="w-full bg-slate-800 text-white font-bold py-3 rounded-xl hover:bg-slate-900 transition-all shadow-md text-sm cursor-pointer">
              🔑 لدي كود تفعيل مسبق
            </button>
            <a href="/qudurat/exams" className="block w-full bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition-all text-center text-sm cursor-pointer">
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
    const isNextLocked = nextExam && !nextExam.isFree && !isUserSubscribed;
    const correctAnswersCount = Object.keys(selectedAnswers).length;

    return (
      <div className="h-[100dvh] overflow-y-auto bg-gray-100 flex items-center justify-center p-6" dir="rtl">
        <ActivationModalComponent 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          code={activationCode}
          setCode={setActivationCode}
          error={activationError}
          onActivate={handleActivateCode}
          isActivating={isActivating}
        />

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
                <button onClick={() => handleSwitchExam(nextExam.id)} className={`px-4 py-2 rounded-lg font-bold text-xs text-white transition-all cursor-pointer ${isNextLocked ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
                  {isNextLocked ? 'اشترك لفتحه' : 'ابدأ الآن'}
                </button>
              </div>
            )}
            {isNextLocked && (
              <button onClick={() => setIsModalOpen(true)} className="w-full bg-slate-800 text-white font-bold py-3 rounded-xl hover:bg-slate-900 transition-all shadow-md text-sm cursor-pointer">
                🔑 لدي كود تفعيل مسبق
              </button>
            )}
            <a href="/qudurat/exams" className="block w-full bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition-all text-center text-sm cursor-pointer">العودة للوحة الرئيسية</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] bg-gray-100 flex flex-col p-2 md:p-4 overflow-hidden" dir="rtl">
      
      <ActivationModalComponent 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        code={activationCode}
        setCode={setActivationCode}
        error={activationError}
        onActivate={handleActivateCode}
        isActivating={isActivating}
      />

      {/* الشريط العلوي تم تحديثه ليشمل زر جميع الاختبارات للنسخة المجانية والمدفوعة */}
      {!isUserSubscribed ? (
        <div className="flex-shrink-0 max-w-5xl mx-auto w-full mb-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 md:px-4 flex flex-col sm:flex-row justify-between items-center gap-2 md:gap-3 text-xs md:text-sm shadow-sm transition-all hover:border-slate-300">
          <div className="text-slate-600 font-medium flex items-center gap-2 text-center sm:text-right">
            <span className="text-blue-500 text-lg text-blink">✨</span>
            <span>
              أنت في <span className="font-bold text-slate-800">{currentExam.title}</span> (مجاني). 
              <span className="hidden md:inline text-blue-700 font-bold mr-2 bg-blue-100 px-2 py-0.5 rounded-md">
                افتح 9 اختبارات إضافية الآن! 🚀
              </span>
            </span>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-end flex-wrap sm:flex-nowrap">
            <a href="/qudurat/exams" className="flex items-center gap-1.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold px-3 py-1.5 rounded-lg transition-all shadow-sm cursor-pointer text-xs">
              <span>🗂️</span><span>الاختبارات</span>
            </a>
            <a href="https://enjazya.lemonsqueezy.com/checkout/buy/13f3f36f-c53b-4227-91c6-b556ae13aee2" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 bg-blue-600 text-white hover:bg-blue-700 font-bold px-4 py-1.5 rounded-lg transition-all shadow-sm cursor-pointer text-xs">
              <span>🛒</span><span>اشترِ الباقة</span>
            </a>
            <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-1.5 bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 font-bold px-3 py-1.5 rounded-lg transition-all shadow-sm cursor-pointer text-xs">
              <span>🔑</span><span className="hidden sm:inline">التفعيل</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-shrink-0 max-w-5xl mx-auto w-full mb-2 bg-green-50/50 border border-green-200 rounded-xl px-4 py-2 flex justify-between items-center shadow-sm transition-all">
          <div className="text-green-700 font-bold text-xs md:text-sm flex items-center gap-2">
            <span>🌟</span><span>أنت تختبر الآن بحساب VIP (صلاحية كاملة)</span>
          </div>
          <a href="/qudurat/exams" className="flex items-center gap-1.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold px-3 py-1.5 rounded-lg transition-all shadow-sm cursor-pointer text-xs">
            <span>🗂️</span><span>جميع الاختبارات</span>
          </a>
        </div>
      )}

      <header className="flex-shrink-0 bg-white shadow-sm rounded-2xl p-3 md:p-4 max-w-5xl mx-auto w-full mb-2 border border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-11 md:h-11 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold text-[10px] md:text-xs flex-shrink-0 shadow-inner">صورة</div>
            <div className="text-right">
              <h3 className="font-bold text-gray-800 text-xs md:text-sm">اسم الطالب المتدرب</h3>
              <span className="text-[10px] md:text-xs text-gray-500 font-mono tracking-wider">رقم الهوية: 10****2345</span>
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 md:px-5 py-1.5 md:py-2 shadow-sm text-center">
            <span className="font-mono font-bold text-xl md:text-2xl text-blue-900 tracking-widest">{formatTime(timeLeft)}</span>
          </div>
          <div className="text-center md:text-left">
            <div className="bg-blue-50/70 border border-blue-100 px-3 md:px-4 py-1.5 md:py-2 rounded-xl">
              <span className="font-bold text-blue-900 text-xs md:text-sm block">{currentExam.title}</span>
              <span className="text-[10px] md:text-[11px] font-medium text-blue-700">القسم {currentSectionIndex + 1} من {TOTAL_SECTIONS} &nbsp;|&nbsp; السؤال {currentQuestionIndex + 1} من {QUESTIONS_PER_SECTION}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow bg-white shadow-sm rounded-2xl max-w-5xl mx-auto w-full border border-gray-200 flex flex-col min-h-0 overflow-hidden">
        {currentQuestion ? (
          <div className="flex-grow overflow-y-auto p-4 md:p-6 lg:p-8 custom-scrollbar">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
              <div className="lg:col-span-5 border-l-0 lg:border-l lg:border-gray-100 lg:pl-8">
                <div className="mb-4">
                  <span className="inline-block bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full font-semibold">{currentQuestion.category}</span>
                </div>
                <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 leading-relaxed">{currentQuestion.text}</h2>
              </div>
              <div className="lg:col-span-7 space-y-3 md:space-y-4">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = selectedAnswers[currentQuestion.id] === option;
                  return (
                    <button key={idx} onClick={() => handleSelectOption(option)} className={`w-full text-right p-3 md:p-4 rounded-xl border-2 font-medium transition-all cursor-pointer flex justify-between items-center ${isSelected ? 'border-blue-600 bg-blue-50/50 text-blue-950 shadow-sm' : 'border-gray-200 hover:border-gray-300 bg-white text-gray-800'}`}>
                      <span className="text-sm md:text-base lg:text-lg font-bold">{option}</span>
                      <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-300'}`}>
                        {isSelected && <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-white rounded-full" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-grow flex items-center justify-center font-bold text-gray-400">جاري تحميل السؤال...</div>
        )}

        <div className="flex-shrink-0 flex justify-between items-center px-4 py-3 md:px-8 md:py-4 border-t border-gray-100 bg-gray-50/30">
          <button onClick={handlePrev} disabled={currentQuestionIndex === 0 && currentSectionIndex === 0} className={`px-5 py-2 md:px-6 md:py-2.5 rounded-xl font-bold text-sm md:text-base transition-all ${currentQuestionIndex === 0 && currentSectionIndex === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer'}`}>
            السابق
          </button>
          <button onClick={handleNext} className="px-6 py-2 md:px-8 md:py-2.5 rounded-xl font-bold text-sm md:text-base bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all cursor-pointer">
            {currentSectionIndex === TOTAL_SECTIONS - 1 && currentQuestionIndex === currentSectionQuestions.length - 1 ? 'إنهاء الاختبار' : 'التالي'}
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
