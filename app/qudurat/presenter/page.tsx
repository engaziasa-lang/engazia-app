'use client';

import React, { useState, useMemo } from 'react';
import questionsData from '../data/training-questions.json';

export default function PresenterPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // حالة حفظ "عدد النقرات" للشرح (الذاكرة)
  const [questionClicks, setQuestionClicks] = useState<Record<number, number>>({});
  
  // حالة حفظ "إظهار الإجابة" بشكل مستقل لكل سؤال (الذاكرة)
  const [revealedAnswers, setRevealedAnswers] = useState<Record<number, boolean>>({});

  const currentQuestion = questionsData[currentQuestionIndex];

  // حساب بيانات الأسبوع والحصة (أس 1 ح 1)
  const currentWeek = currentQuestion?.week || 1;
  const currentSession = currentQuestion?.session || 1;

  // جلب أسئلة الحصة الحالية فقط لمعرفة العدد الإجمالي وترتيب السؤال الحالي داخل الحصة
  const sessionQuestions = useMemo(() => {
    return questionsData.filter(q => q.week === currentWeek && q.session === currentSession);
  }, [currentWeek, currentSession]);

  const indexInSession = sessionQuestions.findIndex(q => q.id === currentQuestion?.id) + 1;
  const totalInSession = sessionQuestions.length;

  // استرجاع الحالات المحفوظة للسؤال الحالي
  const clicks = questionClicks[currentQuestionIndex] || 0;
  const isAnswerRevealed = revealedAnswers[currentQuestionIndex] || false;

  // تقسيم الشرح إلى أجزاء
  const explanationParts = useMemo(() => {
    if (!currentQuestion || !currentQuestion.explanation) return [];
    return currentQuestion.explanation
      .split(/(?<=[.؟!])\s+/)
      .filter(part => part.trim() !== '');
  }, [currentQuestion]);

  const visiblePartsCount = clicks;

  // دالة التعامل مع النقرات على لوحة الشرح (للشرح فقط)
  const handleBoardClick = () => {
    setQuestionClicks(prev => ({
      ...prev,
      [currentQuestionIndex]: (prev[currentQuestionIndex] || 0) + 1
    }));
  };

  // دالة إظهار الإجابة يدوياً عند النقر على الخيارات
  const handleRevealAnswer = () => {
    if (!isAnswerRevealed) {
      setRevealedAnswers(prev => ({
        ...prev,
        [currentQuestionIndex]: true
      }));
    }
  };

  // دالة مسح اللوحة (تصفر الشرح وتخفي الإجابة)
  const handleClearBoard = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuestionClicks(prev => ({
      ...prev,
      [currentQuestionIndex]: 0
    }));
    setRevealedAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: false
    }));
  };

  // دوال التنقل بين الأسئلة
  const handleNext = () => {
    if (currentQuestionIndex < questionsData.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  if (!questionsData || questionsData.length === 0) {
    return (
      <div className="h-[100dvh] flex items-center justify-center bg-slate-100" dir="rtl">
        <h2 className="text-2xl font-bold text-gray-500">جاري التحميل...</h2>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] bg-slate-100 flex flex-col overflow-hidden font-sans" dir="rtl">
      
      {/* الشريط العلوي للمنصة */}
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

        {/* عداد الحصص والأسابيع الذكي */}
        <div className="bg-slate-800 px-3 md:px-4 py-1.5 rounded-lg border border-slate-700 flex items-center gap-2 md:gap-3 shadow-inner">
          <span className="font-extrabold text-xs md:text-sm text-amber-400 tracking-wide">
            أس {currentWeek} ح {currentSession}
          </span>
          <span className="w-px h-4 bg-slate-600"></span>
          <span className="font-bold text-xs md:text-sm text-gray-200">
            س {indexInSession} من {totalInSession}
          </span>
        </div>
      </header>

      {/* مساحة العمل */}
      <main className="flex-grow flex flex-col md:flex-row gap-4 p-4 overflow-hidden min-h-0">
        
        {/* القسم الأيمن: عرض السؤال والخيارات */}
        <section className="w-full md:w-[40%] bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-center p-4 md:p-6 overflow-hidden relative">
          <div className="w-full">
            <div className="mb-2 md:mb-3">
              <span className="inline-block bg-blue-50 text-blue-700 text-[10px] md:text-xs font-bold px-3 py-1 rounded-full">
                {currentQuestion.category}
              </span>
            </div>
            
            <h2 className="text-lg md:text-xl lg:text-2xl font-extrabold text-gray-900 leading-snug mb-4 md:mb-5">
              {currentQuestion.text}
            </h2>

            {/* الخيارات - أصبحت قابلة للنقر لإظهار الإجابة يدوياً */}
            <div 
              className="space-y-2 md:space-y-3 cursor-pointer group"
              onClick={handleRevealAnswer}
              title={!isAnswerRevealed ? "انقر هنا لإظهار الإجابة الصحيحة" : ""}
            >
              {currentQuestion.options.map((option, idx) => {
                const isCorrect = option === currentQuestion.correctAnswer;
                let optionStyle = "border-gray-200 bg-white text-gray-700 hover:bg-gray-50";
                
                if (isAnswerRevealed) {
                  if (isCorrect) {
                    optionStyle = "border-green-500 bg-green-50 text-green-900 font-extrabold shadow-sm transform scale-[1.01]";
                  } else {
                    optionStyle = "border-gray-100 bg-gray-50 text-gray-400 opacity-50 cursor-default";
                  }
                }

                return (
                  <div key={idx} className={`p-3 md:p-3.5 rounded-xl border-2 text-sm md:text-base lg:text-lg transition-all duration-300 flex justify-between items-center ${optionStyle}`}>
                    <span>{option}</span>
                    {isAnswerRevealed && isCorrect && <span className="text-lg md:text-xl drop-shadow-sm animate-bounce">✅</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* القسم الأيسر: لوحة الشرح التفاعلية */}
        <section 
          className="w-full md:w-[60%] bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col overflow-hidden relative cursor-pointer select-none"
          onClick={handleBoardClick}
        >
          {/* زر المسح */}
          {(clicks > 0 || isAnswerRevealed) && (
            <button 
              onClick={handleClearBoard}
              className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-sm border border-red-200 text-red-500 hover:bg-red-50 hover:text-red-700 font-bold px-4 py-2 rounded-xl text-xs md:text-sm transition-all flex items-center gap-2 shadow-md"
            >
              <span>مسح</span> 🗑️
            </button>
          )}

          {/* مساحة عرض الشرح التدريجي */}
          <div className="flex-grow w-full h-full p-6 md:p-10 overflow-y-auto">
            {clicks === 0 ? (
              <div className="w-full h-full"></div>
            ) : (
              <div className="w-full space-y-6 md:space-y-8 mt-8 md:mt-2">
                {explanationParts.slice(0, visiblePartsCount).map((part, index) => (
                  <p 
                    key={index} 
                    className="text-xl md:text-2xl lg:text-3xl text-gray-800 font-bold leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-300"
                  >
                    {part}
                  </p>
                ))}
                
                {/* مؤشر إذا كان هناك بقية للشرح */}
                {clicks < explanationParts.length && (
                  <div className="flex justify-center pt-8 opacity-30">
                    <span className="animate-pulse text-2xl">👇</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

      </main>

      {/* الشريط السفلي: أزرار التنقل */}
      <footer className="flex-shrink-0 bg-white border-t border-gray-200 p-3 md:p-4 flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
        <button 
          onClick={handlePrev} 
          disabled={currentQuestionIndex === 0}
          className={`px-6 md:px-10 py-2.5 md:py-3 rounded-xl font-bold text-sm md:text-lg transition-all ${currentQuestionIndex === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-800 hover:bg-gray-300 shadow-sm'}`}
        >
          السؤال السابق
        </button>

        <button 
          onClick={handleNext} 
          disabled={currentQuestionIndex === questionsData.length - 1}
          className={`px-8 md:px-12 py-2.5 md:py-3 rounded-xl font-bold text-sm md:text-lg text-white shadow-md transition-all ${currentQuestionIndex === questionsData.length - 1 ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {currentQuestionIndex === questionsData.length - 1 ? 'نهاية الأسئلة' : 'السؤال التالي'}
        </button>
      </footer>

    </div>
  );
}
