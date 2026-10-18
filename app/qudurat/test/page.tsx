"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import allQuestionsData from '../data/questions.json';

export default function QuduratTestSimulator() {
  const router = useRouter();
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isLoaded, setIsLoaded] = useState(false);

  // خوارزمية الخلط والسحب العشوائي عند بدء الاختبار
  useEffect(() => {
    // 1. نسخ كل الأسئلة وخلطها عشوائياً
    const shuffled = [...allQuestionsData].sort(() => 0.5 - Math.random());
    // 2. سحب 5 أسئلة فقط لمحاكاة هذا القسم (يمكننا رفعها لـ 25 لاحقاً)
    const selected = shuffled.slice(0, 5);
    
    setQuestions(selected);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    if (timeLeft <= 0) {
      finishTest();
      return;
    }
    const timerId = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timerId);
  }, [timeLeft, isLoaded]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleOptionSelect = (optionIndex: number) => {
    setAnswers({ ...answers, [currentQIndex]: optionIndex });
  };

  const finishTest = () => {
    // حفظ الأسئلة العشوائية التي ظهرت للطالب مع إجاباته ليتم تصحيحها
    sessionStorage.setItem('qudurat_questions', JSON.stringify(questions));
    sessionStorage.setItem('qudurat_answers', JSON.stringify(answers));
    router.push('/qudurat/result');
  };

  if (!isLoaded || questions.length === 0) {
    return <div className="min-h-screen flex items-center justify-center text-2xl font-bold text-blue-800">جاري تجهيز نموذج الاختبار العشوائي...</div>;
  }

  const currentQ = questions[currentQIndex];
  const isLastQ = currentQIndex === questions.length - 1;
  const isFirstQ = currentQIndex === 0;

  return (
    <div className="min-h-screen bg-[#f3f4f6] font-sans selection:bg-blue-200" dir="rtl">
      <header className="bg-white border-b-4 border-blue-800 shadow-sm px-6 py-4 flex justify-between items-center text-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center font-bold text-sm">صورة</div>
          <div>
            <div className="font-bold">اسم الطالب المتدرب</div>
            <div className="text-sm text-slate-500">رقم الهوية: 10****2345</div>
          </div>
        </div>
        <div className="text-center font-bold text-lg">
          <div>القسم 1 (تطبيقي)</div>
          <div className="text-blue-700">السؤال {currentQIndex + 1} من {questions.length}</div>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-bold">الوقت المتبقي:</span>
          <div className={`text-2xl font-black px-4 py-1 rounded ${timeLeft < 300 ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-slate-100 text-slate-800'}`}>
            {formatTime(timeLeft)}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto mt-10 bg-white shadow-md rounded-sm border border-slate-200 min-h-[400px] flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 p-8 border-l border-slate-100 flex flex-col justify-center">
          <span className="text-sm font-bold text-blue-600 mb-4 bg-blue-50 w-fit px-3 py-1 rounded-full">{currentQ.category}</span>
          <h2 className="text-2xl font-bold text-slate-800 leading-loose">
            {currentQ.text}
          </h2>
        </div>
        <div className="w-full md:w-1/2 p-8 bg-slate-50 flex flex-col justify-center space-y-4">
          {currentQ.options.map((option: string, idx: number) => (
            <label key={idx} className={`flex items-center gap-4 p-4 border-2 rounded cursor-pointer transition-colors ${answers[currentQIndex] === idx ? 'border-blue-600 bg-blue-50' : 'border-slate-300 hover:border-blue-400 bg-white'}`}>
              <input type="radio" name={`question-${currentQIndex}`} checked={answers[currentQIndex] === idx} onChange={() => handleOptionSelect(idx)} className="w-5 h-5 text-blue-600 focus:ring-blue-500 cursor-pointer" />
              <span className="text-xl font-medium text-slate-700">{option}</span>
            </label>
          ))}
        </div>
      </main>

      <footer className="max-w-5xl mx-auto mt-6 flex justify-between">
        <button onClick={() => !isFirstQ && setCurrentQIndex(prev => prev - 1)} disabled={isFirstQ} className={`px-8 py-3 rounded font-bold text-lg ${isFirstQ ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-white border-2 border-slate-300 text-slate-700 hover:bg-slate-50'}`}>
          السابق
        </button>
        <button onClick={() => isLastQ ? finishTest() : setCurrentQIndex(prev => prev + 1)} className={`px-12 py-3 rounded font-bold text-lg text-white shadow-md transition-all ${isLastQ ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-700 hover:bg-blue-800'}`}>
          {isLastQ ? 'إنهاء القسم' : 'التالي'}
        </button>
      </footer>
    </div>
  );
}
