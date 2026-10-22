'use client';

import React, { useState, useEffect } from 'react';
import questionsData from '../data/questions.json';

export default function PresenterPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  
  // حالة النص التدريجي
  const [displayedExplanation, setDisplayedExplanation] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const currentQuestion = questionsData[currentQuestionIndex];

  // تأثير ظهور النص تدريجياً (تأثير الآلة الكاتبة)
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (showAnswer && currentQuestion.explanation) {
      setIsTyping(true);
      setDisplayedExplanation('');
      let currentIndex = 0;
      const fullText = currentQuestion.explanation;

      const typeChar = () => {
        if (currentIndex < fullText.length) {
          setDisplayedExplanation(fullText.substring(0, currentIndex + 1));
          currentIndex++;
          // سرعة ظهور الحروف (بالمللي ثانية) - يمكنك تعديل الرقم 30 لتسريع أو إبطاء الكتابة
          timeout = setTimeout(typeChar, 30);
        } else {
          setIsTyping(false);
        }
      };
      
      typeChar();
    } else {
      setDisplayedExplanation('');
      setIsTyping(false);
    }

    return () => clearTimeout(timeout);
  }, [showAnswer, currentQuestion.explanation]);

  // دوال التحكم بالأسئلة
  const handleNext = () => {
    if (currentQuestionIndex < questionsData.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowAnswer(false);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setShowAnswer(false);
    }
  };

  const toggleAnswer = () => {
    setShowAnswer(!showAnswer);
  };

  // تسريع ظهور النص كاملاً إذا أراد المدرب تخطي التأثير التدريجي بالنقر على اللوحة
  const skipTypingEffect = () => {
    if (isTyping && currentQuestion.explanation) {
      setDisplayedExplanation(currentQuestion.explanation);
      setIsTyping(false);
    }
  };

  return (
    <div className="h-[100dvh] bg-slate-100 flex flex-col overflow-hidden font-sans" dir="rtl">
      
      {/* الشريط العلوي */}
      <header className="flex-shrink-0 bg-slate-900 text-white px-6 py-3 flex justify-between items-center shadow-md z-10">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-xl shadow-inner">
            ك
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">منصة كليك قدرات</h1>
            <span className="text-blue-300 text-xs">وضع العرض الذكي (Presenter Mode)</span>
          </div>
        </div>

        <div className="bg-slate-800 px-4 py-1.5 rounded-lg border border-slate-700">
          <span className="font-bold text-sm">السؤال {currentQuestionIndex + 1} من {questionsData.length}</span>
        </div>
      </header>

      {/* مساحة العمل */}
      <main className="flex-grow flex gap-4 p-4 overflow-hidden min-h-0">
        
        {/* القسم الأيمن: عرض السؤال */}
        <section className="w-[40%] bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-center p-6 md:p-8 overflow-hidden relative">
          <div className="w-full">
            <div className="mb-4">
              <span className="inline-block bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full">
                {currentQuestion.category}
              </span>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-normal mb-8">
              {currentQuestion.text}
            </h2>

            <div className="space-y-4">
              {currentQuestion.options.map((option, idx) => {
                const isCorrect = option === currentQuestion.correctAnswer;
                let optionStyle = "border-gray-200 bg-white text-gray-700";
                
                if (showAnswer) {
                  if (isCorrect) {
                    optionStyle = "border-green-500 bg-green-50 text-green-900 font-extrabold shadow-md transform scale-[1.02]";
                  } else {
                    optionStyle = "border-gray-100 bg-gray-50 text-gray-400 opacity-50";
                  }
                }

                return (
                  <div key={idx} className={`p-4 rounded-xl border-2 text-lg md:text-xl transition-all duration-500 flex justify-between items-center ${optionStyle}`}>
                    <span>{option}</span>
                    {showAnswer && isCorrect && <span className="text-2xl drop-shadow-sm animate-bounce">✅</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* القسم الأيسر: لوحة الشرح الذكية (تظهر تدريجياً) */}
        <section 
          className="w-[60%] bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col overflow-hidden relative cursor-pointer"
          onClick={skipTypingEffect}
          title={isTyping ? "انقر لإظهار النص كاملاً" : ""}
        >
          {/* شريط عنوان اللوحة */}
          <div className="bg-slate-50 border-b border-gray-200 p-4 flex justify-between items-center flex-shrink-0 z-10">
            <h3 className="font-bold text-gray-700 flex items-center gap-2 text-lg">
              <span className="text-2xl">💡</span> لوحة الشرح والتفصيل
            </h3>
            {isTyping && (
              <span className="text-xs font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full animate-pulse">
                جاري الكتابة...
              </span>
            )}
          </div>

          {/* مساحة عرض النص */}
          <div className="flex-grow w-full h-full p-8 md:p-10 overflow-y-auto bg-[#fafafa]">
            {!showAnswer ? (
              <div className="w-full h-full flex flex-col items-center justify-center text-center opacity-30">
                <span className="text-7xl mb-4">🪄</span>
                <h3 className="text-2xl font-extrabold text-gray-500">الشرح سيظهر هنا</h3>
                <p className="text-gray-400 mt-2">اضغط على زر إظهار الحل ليبدأ الشرح التلقائي</p>
              </div>
            ) : (
              <div className="w-full">
                <p className="text-2xl md:text-3xl text-gray-800 font-bold leading-relaxed whitespace-pre-wrap">
                  {displayedExplanation}
                  {/* المؤشر الوامض (Cursor) الذي يظهر أثناء الكتابة */}
                  {isTyping && <span className="inline-block w-2 h-8 bg-blue-600 ml-1 align-middle animate-pulse"></span>}
                </p>
              </div>
            )}
          </div>
        </section>

      </main>

      {/* الشريط السفلي: أزرار التحكم */}
      <footer className="flex-shrink-0 bg-white border-t border-gray-200 p-4 flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
        <button 
          onClick={handlePrev} 
          disabled={currentQuestionIndex === 0}
          className={`px-8 py-3 rounded-xl font-bold text-lg transition-all ${currentQuestionIndex === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-800 hover:bg-gray-300 shadow-sm'}`}
        >
          السؤال السابق
        </button>

        <button 
          onClick={toggleAnswer}
          className={`px-12 py-3.5 rounded-2xl font-extrabold text-xl shadow-lg transition-all transform hover:scale-105 ${showAnswer ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
        >
          {showAnswer ? 'إخفاء الحل' : '💡 إظهار الحل والشرح'}
        </button>

        <button 
          onClick={handleNext} 
          disabled={currentQuestionIndex === questionsData.length - 1}
          className={`px-10 py-3 rounded-xl font-bold text-lg text-white shadow-md transition-all ${currentQuestionIndex === questionsData.length - 1 ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {currentQuestionIndex === questionsData.length - 1 ? 'نهاية الأسئلة' : 'السؤال التالي'}
        </button>
      </footer>

    </div>
  );
}
