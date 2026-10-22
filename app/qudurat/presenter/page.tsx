'use client';

import React, { useState, useEffect } from 'react';
import questionsData from '../data/questions.json';

export default function PresenterPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // حالة الشرح التفاعلي
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [explanationParts, setExplanationParts] = useState<string[]>([]);
  const [visiblePartsCount, setVisiblePartsCount] = useState<number>(0);

  const currentQuestion = questionsData[currentQuestionIndex];

  // دالة التعامل مع النقرات على لوحة الشرح
  const handleBoardClick = () => {
    if (!isAnswerRevealed) {
      // النقرة الأولى: تظهر الإجابة الصحيحة وتجهز خطوات الشرح
      setIsAnswerRevealed(true);
      if (currentQuestion.explanation) {
        const parts = currentQuestion.explanation
          .split(/(?<=[.؟!])\s+/)
          .filter(part => part.trim() !== '');
        setExplanationParts(parts);
        setVisiblePartsCount(1); // إظهار الخطوة الأولى فوراً
      }
    } else if (visiblePartsCount < explanationParts.length) {
      // النقرات التالية: إظهار الخطوات المتبقية تباعاً
      setVisiblePartsCount(prev => prev + 1);
    }
  };

  // دالة مسح اللوحة وإعادة ضبط السؤال الحالي
  const handleClearBoard = (e: React.MouseEvent) => {
    e.stopPropagation(); // منع تداخل النقرة مع دالة اللوحة
    setIsAnswerRevealed(false);
    setExplanationParts([]);
    setVisiblePartsCount(0);
  };

  // دوال التنقل بين الأسئلة (مع تصفير اللوحة تلقائياً)
  const handleNext = () => {
    if (currentQuestionIndex < questionsData.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setIsAnswerRevealed(false);
      setExplanationParts([]);
      setVisiblePartsCount(0);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setIsAnswerRevealed(false);
      setExplanationParts([]);
      setVisiblePartsCount(0);
    }
  };

  return (
    <div className="h-[100dvh] bg-slate-100 flex flex-col overflow-hidden font-sans" dir="rtl">
      
      {/* الشريط العلوي */}
      <header className="flex-shrink-0 bg-slate-900 text-white px-4 md:px-6 py-3 flex justify-between items-center shadow-md z-10">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center font-extrabold text-lg md:text-xl shadow-inner">
            ك
          </div>
          <div>
            <h1 className="font-bold text-base md:text-lg leading-tight">منصة كليك قدرات</h1>
            <span className="text-blue-300 text-[10px] md:text-xs">وضع العرض الذكي</span>
          </div>
        </div>

        <div className="bg-slate-800 px-3 md:px-4 py-1.5 rounded-lg border border-slate-700">
          <span className="font-bold text-xs md:text-sm">السؤال {currentQuestionIndex + 1} من {questionsData.length}</span>
        </div>
      </header>

      {/* مساحة العمل (متجاوبة: عمودية في الجوال، أفقية في الكمبيوتر) */}
      <main className="flex-grow flex flex-col md:flex-row gap-4 p-4 overflow-hidden min-h-0">
        
        {/* القسم الأيمن: عرض السؤال (بدون انزلاق) */}
        <section className="w-full md:w-[40%] bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-center p-5 md:p-8 overflow-hidden relative">
          <div className="w-full">
            <div className="mb-3 md:mb-4">
              <span className="inline-block bg-blue-50 text-blue-700 text-[10px] md:text-xs font-bold px-3 py-1.5 rounded-full">
                {currentQuestion.category}
              </span>
            </div>
            
            <h2 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-gray-900 leading-normal mb-6 md:mb-8">
              {currentQuestion.text}
            </h2>

            <div className="space-y-3 md:space-y-4">
              {currentQuestion.options.map((option, idx) => {
                const isCorrect = option === currentQuestion.correctAnswer;
                let optionStyle = "border-gray-200 bg-white text-gray-700";
                
                if (isAnswerRevealed) {
                  if (isCorrect) {
                    optionStyle = "border-green-500 bg-green-50 text-green-900 font-extrabold shadow-md transform scale-[1.02]";
                  } else {
                    optionStyle = "border-gray-100 bg-gray-50 text-gray-400 opacity-50";
                  }
                }

                return (
                  <div key={idx} className={`p-3 md:p-4 rounded-xl border-2 text-base md:text-lg lg:text-xl transition-all duration-500 flex justify-between items-center ${optionStyle}`}>
                    <span>{option}</span>
                    {isAnswerRevealed && isCorrect && <span className="text-xl md:text-2xl drop-shadow-sm animate-bounce">✅</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* القسم الأيسر: لوحة الشرح التفاعلية بالنقرات */}
        <section 
          className="w-full md:w-[60%] bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col overflow-hidden relative cursor-pointer select-none group"
          onClick={handleBoardClick}
        >
          {/* شريط عنوان اللوحة مع زر المسح */}
          <div className="bg-slate-50 border-b border-gray-200 p-3 md:p-4 flex justify-between items-center flex-shrink-0 z-10">
            <h3 className="font-bold text-gray-700 flex items-center gap-2 text-base md:text-lg">
              <span className="text-xl md:text-2xl">💡</span> لوحة الشرح والتفصيل
            </h3>
            
            {/* زر المسح يظهر فقط إذا تم البدء في عرض الحل */}
            {isAnswerRevealed && (
              <button 
                onClick={handleClearBoard}
                className="bg-white border border-red-200 text-red-500 hover:bg-red-50 hover:text-red-700 font-bold px-3 py-1.5 rounded-lg text-xs md:text-sm transition-all flex items-center gap-1 shadow-sm"
              >
                <span>مسح</span> 🗑️
              </button>
            )}
          </div>

          {/* مساحة عرض النص */}
          <div className="flex-grow w-full h-full p-6 md:p-10 overflow-y-auto bg-[#fafafa]">
            {!isAnswerRevealed ? (
              <div className="w-full h-full flex flex-col items-center justify-center text-center opacity-40">
                <span className="text-5xl md:text-7xl mb-4 pointer-events-none">👆</span>
                <h3 className="text-xl md:text-2xl font-extrabold text-gray-500">انقر هنا لإظهار الحل والشرح</h3>
              </div>
            ) : (
              <div className="w-full space-y-6 md:space-y-8">
                {/* عرض الخطوات تدريجياً بناءً على عدد النقرات */}
                {explanationParts.slice(0, visiblePartsCount).map((part, index) => (
                  <p 
                    key={index} 
                    className="text-xl md:text-2xl lg:text-3xl text-gray-800 font-bold leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-300"
                  >
                    {part}
                  </p>
                ))}
                
                {/* مؤشر بصري ناعم يخبر المدرب بوجود بقية للشرح */}
                {visiblePartsCount < explanationParts.length && (
                  <div className="flex justify-center pt-8 opacity-50">
                    <span className="animate-pulse text-2xl">👇</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

      </main>

      {/* الشريط السفلي: أزرار التنقل فقط */}
      <footer className="flex-shrink-0 bg-white border-t border-gray-200 p-4 flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
        <button 
          onClick={handlePrev} 
          disabled={currentQuestionIndex === 0}
          className={`px-6 md:px-10 py-3 rounded-xl font-bold text-sm md:text-lg transition-all ${currentQuestionIndex === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-800 hover:bg-gray-300 shadow-sm'}`}
        >
          السؤال السابق
        </button>

        <button 
          onClick={handleNext} 
          disabled={currentQuestionIndex === questionsData.length - 1}
          className={`px-8 md:px-12 py-3 rounded-xl font-bold text-sm md:text-lg text-white shadow-md transition-all ${currentQuestionIndex === questionsData.length - 1 ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {currentQuestionIndex === questionsData.length - 1 ? 'نهاية الأسئلة' : 'السؤال التالي'}
        </button>
      </footer>

    </div>
  );
}
