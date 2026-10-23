'use client';

import React, { useState, useEffect, useMemo } from 'react';
import questionsData from '../data/training-questions.json';

export default function PresenterPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionClicks, setQuestionClicks] = useState<Record<number, number>>({});
  const [revealedAnswers, setRevealedAnswers] = useState<Record<number, boolean>>({});
  
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // حالات العداد التنازلي
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  useEffect(() => {
    const savedIndex = localStorage.getItem('qudurat_saved_index');
    if (savedIndex !== null) {
      setCurrentQuestionIndex(parseInt(savedIndex, 10));
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('qudurat_saved_index', currentQuestionIndex.toString());
    }
  }, [currentQuestionIndex, isLoaded]);

  // منطق العداد التنازلي
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const resetTimer = (newTime = 60) => {
    setTimeLeft(newTime);
    setIsRunning(false);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const isUrgent = timeLeft <= 10 && timeLeft > 0;

  const currentQuestion = questionsData[currentQuestionIndex];
  const currentWeek = currentQuestion?.week || 1;
  const currentSession = currentQuestion?.session || 1;

  const sessionQuestions = useMemo(() => {
    return questionsData.filter(q => q.week === currentWeek && q.session === currentSession);
  }, [currentWeek, currentSession]);

  const indexInSession = sessionQuestions.findIndex(q => q.id === currentQuestion?.id) + 1;
  const totalInSession = sessionQuestions.length;

  const clicks = questionClicks[currentQuestionIndex] || 0;
  const isAnswerRevealed = revealedAnswers[currentQuestionIndex] || false;

  const explanationParts = useMemo(() => {
    if (!currentQuestion || !currentQuestion.explanation) return [];
    return currentQuestion.explanation
      .split(/(?<=[.؟!])\s+/)
      .filter(part => part.trim() !== '');
  }, [currentQuestion]);

  const visiblePartsCount = clicks;

  const navigationMap = useMemo(() => {
    const map: Record<number, number[]> = {};
    questionsData.forEach(q => {
      if (q.week && q.session) {
        if (!map[q.week]) map[q.week] = [];
        if (!map[q.week].includes(q.session)) map[q.week].push(q.session);
      }
    });
    Object.keys(map).forEach(week => {
      map[Number(week)].sort((a, b) => a - b);
    });
    return map;
  }, []);

  const jumpToSession = (week: number, session: number) => {
    const index = questionsData.findIndex(q => q.week === week && q.session === session);
    if (index !== -1) {
      setCurrentQuestionIndex(index);
      setIsNavOpen(false); 
    }
  };

  const handleBoardClick = () => {
    setQuestionClicks(prev => ({
      ...prev,
      [currentQuestionIndex]: (prev[currentQuestionIndex] || 0) + 1
    }));
  };

  const handleRevealAnswer = () => {
    if (!isAnswerRevealed) {
      setRevealedAnswers(prev => ({
        ...prev,
        [currentQuestionIndex]: true
      }));
    }
  };

  const handleClearBoard = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuestionClicks(prev => ({ ...prev, [currentQuestionIndex]: 0 }));
    setRevealedAnswers(prev => ({ ...prev, [currentQuestionIndex]: false }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questionsData.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      resetTimer(60);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      resetTimer(60);
    }
  };

  if (!isLoaded || !questionsData || questionsData.length === 0) {
    return (
      <div className="h-[100dvh] flex items-center justify-center bg-slate-100" dir="rtl">
        <h2 className="text-xl font-bold text-slate-400 animate-pulse">جاري تجهيز المنصة...</h2>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] bg-slate-100 flex flex-col overflow-hidden font-sans relative" dir="rtl">
      
      {/* الشريط العلوي */}
      <header className="flex-shrink-0 bg-slate-900 text-white px-3 md:px-6 py-2.5 flex justify-between items-center shadow-md z-30 relative">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-7 h-7 md:w-10 md:h-10 rounded-xl overflow-hidden shadow-inner flex-shrink-0 bg-white flex items-center justify-center">
            <img 
              src="/logo.png" 
              alt="شعار كليك قدرات" 
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = '<span class="text-blue-600 font-extrabold text-lg md:text-xl">ك</span>';
              }}
            />
          </div>
          <div>
            <h1 className="font-bold text-sm md:text-lg leading-tight">كليك قدرات</h1>
            <span className="text-blue-300 text-[9px] md:text-xs hidden sm:inline">وضع العرض الذكي</span>
          </div>
        </div>

        {/* عداد الوقت للشاشات الكبيرة (الكمبيوتر) */}
        <div className="hidden md:flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 shadow-inner">
          <div className={`text-xl font-black font-mono tracking-wider px-2.5 py-0.5 rounded-lg ${
            isUrgent ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-900 text-blue-400'
          }`}>
            {formattedTime}
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`px-2 py-1 rounded-lg text-xs font-bold text-white transition ${
                isRunning ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              {isRunning ? '⏸ إيقاف' : '▶ بدء'}
            </button>
            <button
              onClick={() => resetTimer(60)}
              className="p-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition"
              title="إعادة ضبط"
            >
              🔄
            </button>
            <button
              onClick={() => setTimeLeft((prev) => Math.max(0, prev - 15))}
              className="px-1.5 py-0.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded text-xs font-bold"
            >
              -15s
            </button>
            <button
              onClick={() => setTimeLeft((prev) => prev + 15)}
              className="px-1.5 py-0.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded text-xs font-bold"
            >
              +15s
            </button>
          </div>
        </div>

        {/* زر التنقل بين الحصص */}
        <div className="relative">
          <button 
            onClick={() => setIsNavOpen(!isNavOpen)}
            className="bg-slate-800 hover:bg-slate-700 transition-colors px-2.5 md:px-4 py-1.5 rounded-lg border border-slate-600 flex items-center gap-1.5 md:gap-3 shadow-inner cursor-pointer"
          >
            <span className="font-extrabold text-[11px] md:text-sm text-amber-400 tracking-wide">
              أس {currentWeek} ح {currentSession}
            </span>
            <span className="w-px h-4 bg-slate-500"></span>
            <span className="font-bold text-[11px] md:text-sm text-gray-200">
              س {indexInSession}/{totalInSession}
            </span>
            <span className="text-[10px] text-gray-400">▼</span>
          </button>

          {isNavOpen && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50">
              <div className="bg-slate-100 px-4 py-2 border-b border-gray-200">
                <span className="font-bold text-slate-700 text-sm">الانتقال السريع للحصص</span>
              </div>
              <div className="max-h-[60vh] overflow-y-auto p-2 space-y-3">
                {Object.keys(navigationMap).map(weekStr => {
                  const weekNum = Number(weekStr);
                  return (
                    <div key={weekNum} className="space-y-1">
                      <h4 className="text-xs font-extrabold text-slate-400 px-2 uppercase">الأسبوع {weekNum}</h4>
                      <div className="grid grid-cols-2 gap-1">
                        {navigationMap[weekNum].map(sessionNum => {
                          const isActive = weekNum === currentWeek && sessionNum === currentSession;
                          return (
                            <button
                              key={sessionNum}
                              onClick={() => jumpToSession(weekNum, sessionNum)}
                              className={`px-3 py-2 rounded-lg text-sm font-bold transition-all text-right ${isActive ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                            >
                              الحصة {sessionNum}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </header>

      {isNavOpen && (
        <div className="fixed inset-0 z-20" onClick={() => setIsNavOpen(false)} />
      )}

      {/* مساحة العمل */}
      <main className="flex-grow flex flex-col md:flex-row gap-3 p-3 md:p-4 overflow-y-auto md:overflow-hidden min-h-0 relative z-10">
        
        <section className="w-full md:w-[40%] flex-shrink-0 md:flex-shrink bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-center p-4 md:p-6 overflow-y-auto md:overflow-hidden relative">
          <div className="w-full">
            <div className="mb-2">
              <span className="inline-block bg-blue-50 text-blue-700 text-[10px] md:text-xs font-bold px-3 py-1 rounded-full">
                {currentQuestion.category}
              </span>
            </div>
            
            <h2 className="text-base md:text-xl lg:text-2xl font-extrabold text-gray-900 leading-snug mb-3 md:mb-5">
              {currentQuestion.text}
            </h2>

            <div 
              className="space-y-2 cursor-pointer group"
              onClick={handleRevealAnswer}
              title={!isAnswerRevealed ? "انقر لإظهار الإجابة الصحيحة" : ""}
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
                  <div key={idx} className={`p-2.5 md:p-3.5 rounded-xl border-2 text-xs md:text-base lg:text-lg transition-all duration-300 flex justify-between items-center ${optionStyle}`}>
                    <span>{option}</span>
                    {isAnswerRevealed && isCorrect && <span className="text-base md:text-xl animate-bounce">✅</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section 
          className="w-full md:w-[60%] min-h-[40vh] md:min-h-0 flex-shrink-0 md:flex-shrink bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col overflow-hidden relative cursor-pointer select-none"
          onClick={handleBoardClick}
        >
          {(clicks > 0 || isAnswerRevealed) && (
            <button 
              onClick={handleClearBoard}
              className="absolute top-3 left-3 z-20 bg-white/90 backdrop-blur-sm border border-red-200 text-red-500 hover:bg-red-50 font-bold px-3 py-1.5 rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-md"
            >
              <span>مسح</span> 🗑️
            </button>
          )}

          <div className="flex-grow w-full h-full p-4 md:p-10 overflow-y-auto">
            {clicks === 0 ? (
              <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm md:text-base select-none">
                (انقر هنا لإظهار الشرح تدريجياً خطوة بخطوة)
              </div>
            ) : (
              <div className="w-full space-y-4 md:space-y-8 mt-4 md:mt-2">
                {explanationParts.slice(0, visiblePartsCount).map((part, index) => (
                  <p 
                    key={index} 
                    className="text-lg md:text-2xl lg:text-3xl text-gray-800 font-bold leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-300"
                  >
                    {part}
                  </p>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* شريط التحكم المخصص للجوال (يظهر أسفل الشاشة على الموبايل فقط ويختفي على الكمبيوتر) */}
      <div className="md:hidden flex items-center justify-between bg-slate-900 text-white px-3 py-2 border-t border-slate-800">
        <div className={`text-base font-black font-mono tracking-wider px-2 py-0.5 rounded ${
          isUrgent ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-800 text-blue-400'
        }`}>
          {formattedTime}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-2.5 py-1 rounded text-xs font-bold text-white ${
              isRunning ? 'bg-amber-600' : 'bg-emerald-600'
            }`}
          >
            {isRunning ? '⏸ إيقاف' : '▶ بدء'}
          </button>
          <button
            onClick={() => resetTimer(60)}
            className="p-1 bg-slate-800 text-slate-300 rounded text-xs"
          >
            🔄
          </button>
          <button
            onClick={() => setTimeLeft((prev) => Math.max(0, prev - 15))}
            className="px-1.5 py-1 bg-slate-800 text-slate-300 rounded text-[11px] font-bold"
          >
            -15s
          </button>
          <button
            onClick={() => setTimeLeft((prev) => prev + 15)}
            className="px-1.5 py-1 bg-slate-800 text-slate-300 rounded text-[11px] font-bold"
          >
            +15s
          </button>
        </div>
      </div>

      {/* شريط التنقل السفلي */}
      <footer className="flex-shrink-0 bg-white border-t border-gray-200 p-2.5 md:p-4 flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
        <button 
          onClick={handlePrev} 
          disabled={currentQuestionIndex === 0}
          className={`px-5 md:px-10 py-2 md:py-3 rounded-xl font-bold text-xs md:text-lg transition-all ${currentQuestionIndex === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-800 hover:bg-gray-300 shadow-sm'}`}
        >
          السؤال السابق
        </button>

        <span className="text-xs text-gray-500 font-bold md:hidden">
          {currentQuestionIndex + 1} / {questionsData.length}
        </span>

        <button 
          onClick={handleNext} 
          disabled={currentQuestionIndex === questionsData.length - 1}
          className={`px-6 md:px-12 py-2 md:py-3 rounded-xl font-bold text-xs md:text-lg text-white shadow-md transition-all ${currentQuestionIndex === questionsData.length - 1 ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {currentQuestionIndex === questionsData.length - 1 ? 'نهاية الأسئلة' : 'السؤال التالي'}
        </button>
      </footer>

    </div>
  );
}
