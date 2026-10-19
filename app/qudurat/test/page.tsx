// app/qudurat/test/page.tsx
'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import questionsData from '../data/questions.json';
import { EXAMS_DATA } from '../lib/examsConfig';

const TOTAL_SECTIONS = 5;
const QUESTIONS_PER_SECTION = 25;

// 💡 1. تم فصل مكون نافذة التفعيل خارج المكون الرئيسي لمنع إعادة بنائه عند الكتابة (حل مشكلة عدم القدرة على الكتابة)
function ActivationModalComponent({
  isOpen,
  onClose,
  code,
  setCode,
  error,
  onActivate
}: {
  isOpen: boolean;
  onClose: () => void;
  code: string;
  setCode: (val: string) => void;
  error: string;
  onActivate: () => void;
}) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4" dir="rtl">
      <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-md w-full border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">🔑 تفعيل الاشتراك</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 font-bold text-2xl cursor-pointer leading-none">&times;</button>
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
          className="w-full border-2 border-gray-200 rounded-xl p-3 text-center text-lg font-bold tracking-widest text-gray-800 uppercase focus:border-blue-500 focus:outline-none transition-all mb-2"
          dir="ltr"
          autoFocus // 💡 التركيز التلقائي داخل المربع
        />
        {error && <p className="text-red-500 text-xs font-bold mb-4">{error}</p>}
        
        <div className="mt-6 flex gap-3">
          <button onClick={onActivate} className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all shadow-md cursor-pointer">
            تفعيل الآن
          </button>
          <button onClick={onClose} className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition-all cursor-pointer">
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

  // حالات نافذة تفعيل الكود المنبثقة
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activationCode, setActivationCode] = useState('');
  const [activationError, setActivationError] = useState('');

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

  const handleActivateCode = () => {
    setActivationError('');
    if (activationCode.trim().toUpperCase() === 'QUD-1234') {
      setIsUserSubscribed(true);
      setIsModalOpen(false);
      setActivationCode('');
      alert('🎉 تم التفعيل بنجاح! تم
