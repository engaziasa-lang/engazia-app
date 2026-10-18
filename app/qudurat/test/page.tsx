"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import allQuestionsData from '../data/questions.json';

export default function QuduratTestSimulator() {
  const router = useRouter();
  const [sections, setSections] = useState<any[][]>([]);
  const [currentSection, setCurrentSection] = useState(0); 
  const [currentQIndex, setCurrentQIndex] = useState(0); 
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(25 * 60); 
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!allQuestionsData || allQuestionsData.length === 0) return;

    // 1. استرجاع معرفات الأسئلة التي تم حلها سابقاً من ذاكرة المتصفح الدائمة
    const solvedIds = JSON.parse(localStorage.getItem('qudurat_solved_history') || '[]');

    // 2. فلترة بنك الأسئلة (حذف أي سؤال شاهده الطالب في اختبارات سابقة)
    const freshQuestions = allQuestionsData.filter(q => !solvedIds.includes(q.id));

    // 3. إذا أنهى الطالب كل الأسئلة الموجودة في بنك المنصة
    if (freshQuestions.length === 0) {
      alert("مبروك! لقد أتممت جميع الأسئلة المتاحة في المنصة حالياً. سيتم تصفير سجلك لتبدأ التدرب من جديد.");
      localStorage.removeItem('qudurat_solved_history');
      window.location.reload();
      return;
    }

    // 4. خلط الأسئلة الجديدة المتبقية عشوائياً
    const shuffledBank = [...freshQuestions].sort(() => 0.5 - Math.random());
    
    // 5. أخذ 125 سؤال كحد أقصى للاختبار الواحد (بدون أي تكرار إطلاقاً)
    const finalQuestions = shuffledBank.slice(0, 125);
    
    // 6. توزيع الأسئلة على 5 أقسام (كل قسم يأخذ 25 سؤال بحد أقصى)
    const distributedSections: any[][] = [];
    for (let i = 0; i < 5; i++) {
      distributedSections.push(finalQuestions.slice(i * 25, (i + 1) * 25));
    }
    
    setSections(distributedSections);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded || sections.length === 0) return;
    
    if (timeLeft <= 0) {
      handleSectionEnd();
      return;
    }
    
    const timerId = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timerId);
  }, [timeLeft, isLoaded, currentSection]);

  const handleSectionEnd = () => {
    if (currentSection < 4) {
      setCurrentSection(prev => prev + 1);
      setCurrentQIndex(0);
      setTimeLeft(25 * 60);
      window.scrollTo(0, 0);
    } else {
      finishTest();
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const getGlobalIndex = () => {
    let globalIdx = 0;
    for (let i = 0; i < currentSection; i++) {
      globalIdx += sections[i].length;
    }
    return globalIdx + currentQIndex;
  };

  const handleOptionSelect = (optionIndex: number) => {
    const globalIdx = getGlobalIndex();
    setAnswers({ ...answers, [globalIdx]: optionIndex });
  };

  const finishTest = () => {
    const flatQuestions = sections.flat();
    
    // حفظ أرقام الأسئلة التي رآها الطالب الآن في السجل الدائم حتى لا تتكرر له مستقبلاً
    const solvedIds = JSON.parse(localStorage.getItem('qudurat_solved_history') || '[]');
    const newIds = flatQuestions.map(q => q.id);
    const updatedHistory = Array.from(new Set([...solvedIds, ...newIds])); // منع تكرار الأرقام
    localStorage.setItem('qudurat_solved_history', JSON.stringify(updatedHistory));

    // إرسال البيانات لشاشة النتيجة
    sessionStorage.setItem('qudurat_questions', JSON.stringify(flatQuestions));
    sessionStorage.setItem('qudurat_answers', JSON.stringify(answers));
    router.push('/qudurat/result');
  };

  if (!isLoaded || sections.length === 0) {
    return <div className="min-h-screen flex items-center justify-center text-2xl font-bold text-blue-800">جاري إعداد الاختبار...</div>;
  }

  const currentSectionData = sections[currentSection];
  
  if (!currentSectionData || currentSectionData.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <h2 className="text-2xl font-bold mb-4 text-slate-700">هذا القسم فارغ مؤقتاً (بانتظار إضافة المزيد من الأسئلة للمنصة)</h2>
        <button onClick={handleSectionEnd} className="bg-blue-600 text-white px-8 py-3 rounded font-bold hover:bg-blue-700">تخطي إلى القسم التالي</button>
      </div>
    );
  }

  const currentQ = currentSectionData[currentQIndex];
  const isLastQ = currentQIndex === currentSectionData.length - 1;
  const isFirstQ = currentQIndex === 0;
  const globalIdx = getGlobalIndex();

  return (
    <div className="min-h-screen bg-[#f3f4f6] font-sans selection:bg-blue-200" dir="rtl">
      <header className="bg-white border-b-4 border-blue-800 shadow-sm px-4 md:px-6 py-4 flex flex-col md:flex-row justify-between items-center text-slate-800 gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center font-bold text-sm shrink-0">صورة</div>
          <div>
            <div className="font-bold">اسم الطالب المتدرب</div>
            <div className="text-sm text-slate-500">رقم الهوية: 10****2345</div>
          </div>
        </div>

        <div className="text-center font-bold text-lg w-full md:w-auto border-y md:border-y-0 py-2 md:py-0 border-slate-100">
          <div>القسم {currentSection + 1} من 5</div>
          <div className="text-blue-700">السؤال {currentQIndex + 1} من {currentSectionData.length}</div>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
          <span className="font-bold hidden md:inline">الوقت المتبقي:</span>
          <div className={`text-2xl font-black px-4 py-1 rounded w-full md:w-auto text-center ${timeLeft < 300 ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-slate-100 text-slate-800'}`}>
            {formatTime(timeLeft)}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto mt-6 md:mt-10 bg-white shadow-md rounded-sm border border-slate-200 min-h-[400px] flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 p-6 md:p-8 border-b md:border-b-0 md:border-l border-slate-100 flex flex-col justify-center">
          <span className="text-sm font-bold text-blue-600 mb-4 bg-blue-50 w-fit px-3 py-1 rounded-full">
            {currentQ.category || 'عام'}
          </span>
          <h2 className="text-2xl font-bold text-slate-800 leading-loose">
            {currentQ.text}
          </h2>
        </div>

        <div className="w-full md:w-1/2 p-6 md:p-8 bg-slate-50 flex flex-col justify-center space-y-4">
          {currentQ.options.map((option: string, idx: number) => (
            <label key={idx} className={`flex items-center gap-4 p-4 border-2 rounded cursor-pointer transition-colors ${answers[globalIdx] === idx ? 'border-blue-600 bg-blue-50' : 'border-slate-300 hover:border-blue-400 bg-white'}`}>
              <input type="radio" name={`question-${globalIdx}`} checked={answers[globalIdx] === idx} onChange={() => handleOptionSelect(idx)} className="w-5 h-5 text-blue-600 focus:ring-blue-500 cursor-pointer" />
              <span className="text-xl font-medium text-slate-700">{option}</span>
            </label>
          ))}
        </div>
      </main>

      <footer className="max-w-5xl mx-auto mt-6 flex justify-between p-4 md:p-0 pb-10">
        <button 
          onClick={() => !isFirstQ && setCurrentQIndex(prev => prev - 1)} 
          disabled={isFirstQ} 
          className={`px-6 md:px-8 py-3 rounded font-bold text-base md:text-lg ${isFirstQ ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-white border-2 border-slate-300 text-slate-700 hover:bg-slate-50'}`}
        >
          السابق
        </button>

        <button 
          onClick={() => isLastQ ? handleSectionEnd() : setCurrentQIndex(prev => prev + 1)} 
          className={`px-8 md:px-12 py-3 rounded font-bold text-base md:text-lg text-white shadow-md transition-all ${isLastQ ? 'bg-orange-600 hover:bg-orange-700' : 'bg-blue-700 hover:bg-blue-800'}`}
        >
          {isLastQ ? (currentSection === 4 ? 'إنهاء الاختبار' : 'إنهاء القسم') : 'التالي'}
        </button>
      </footer>
    </div>
  );
}
