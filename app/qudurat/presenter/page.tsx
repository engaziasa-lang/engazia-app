'use client';

import React, { useState, useEffect, useRef } from 'react';
import questionsData from '../data/questions.json';

export default function PresenterPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  
  // إعدادات السبورة (Whiteboard)
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor, setPenColor] = useState('#2563eb'); // أزرق افتراضياً
  const [penSize, setPenSize] = useState(4);

  const currentQuestion = questionsData[currentQuestionIndex];

  // تهيئة السبورة عند تحميل الصفحة أو تغيير حجم الشاشة
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    // ضبط حجم السبورة ليتناسب مع الحاوية
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
    
    // لضمان دقة الرسم على الشاشات عالية الدقة (Retina)
    const context = canvas.getContext('2d');
    if (context) {
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.strokeStyle = penColor;
      context.lineWidth = penSize;
      contextRef.current = context;
    }
  }, []);

  // تحديث لون وحجم القلم عند تغييرهما
  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = penColor;
      contextRef.current.lineWidth = penSize;
    }
  }, [penColor, penSize]);

  // دوال الرسم
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = getCoordinates(e);
    if (contextRef.current) {
      contextRef.current.beginPath();
      contextRef.current.moveTo(offsetX, offsetY);
      setIsDrawing(true);
    }
  };

  const finishDrawing = () => {
    if (contextRef.current) {
      contextRef.current.closePath();
      setIsDrawing(false);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !contextRef.current) return;
    const { offsetX, offsetY } = getCoordinates(e);
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { offsetX: 0, offsetY: 0 };
    
    if ('touches' in e) {
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      return {
        offsetX: touch.clientX - rect.left,
        offsetY: touch.clientY - rect.top
      };
    } else {
      return {
        offsetX: e.nativeEvent.offsetX,
        offsetY: e.nativeEvent.offsetY
      };
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (canvas && context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  // دوال التحكم بالأسئلة
  const handleNext = () => {
    if (currentQuestionIndex < questionsData.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowAnswer(false);
      clearCanvas();
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setShowAnswer(false);
      clearCanvas();
    }
  };

  const toggleAnswer = () => {
    setShowAnswer(!showAnswer);
  };

  return (
    <div className="h-[100dvh] bg-slate-100 flex flex-col overflow-hidden font-sans" dir="rtl">
      
      {/* الشريط العلوي للمدرب */}
      <header className="flex-shrink-0 bg-slate-900 text-white px-6 py-3 flex justify-between items-center shadow-md z-10">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-xl shadow-inner">
            ك
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">منصة كليك قدرات</h1>
            <span className="text-blue-300 text-xs">وضع المدرب (Presenter Mode)</span>
          </div>
        </div>

        <div className="bg-slate-800 px-4 py-1.5 rounded-lg border border-slate-700">
          <span className="font-bold text-sm">السؤال {currentQuestionIndex + 1} من {questionsData.length}</span>
        </div>
      </header>

      {/* مساحة العمل (مقسمة بين السؤال والسبورة) */}
      <main className="flex-grow flex gap-4 p-4 overflow-hidden">
        
        {/* القسم الأيمن: عرض السؤال (35% من الشاشة) */}
        <section className="w-[35%] bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
          <div className="p-6 flex-grow overflow-y-auto">
            <span className="inline-block bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full mb-4">
              {currentQuestion.category}
            </span>
            
            <h2 className="text-2xl font-extrabold text-gray-900 leading-relaxed mb-6">
              {currentQuestion.text}
            </h2>

            <div className="space-y-3 mb-6">
              {currentQuestion.options.map((option, idx) => {
                const isCorrect = option === currentQuestion.correctAnswer;
                let optionStyle = "border-gray-200 bg-white text-gray-700";
                
                if (showAnswer) {
                  if (isCorrect) {
                    optionStyle = "border-green-500 bg-green-50 text-green-900 font-extrabold shadow-sm";
                  } else {
                    optionStyle = "border-gray-100 bg-gray-50 text-gray-400 opacity-60";
                  }
                }

                return (
                  <div key={idx} className={`p-4 rounded-xl border-2 text-lg transition-all ${optionStyle}`}>
                    <div className="flex justify-between items-center">
                      <span>{option}</span>
                      {showAnswer && isCorrect && <span className="text-xl">✅</span>}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* صندوق الشرح ينبثق عند إظهار الحل */}
            {showAnswer && currentQuestion.explanation && (
              <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-5 animate-in fade-in slide-in-from-bottom-4">
                <h4 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
                  <span>💡</span> شرح الحل:
                </h4>
                <p className="text-amber-900 leading-relaxed text-sm font-medium">
                  {currentQuestion.explanation}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* القسم الأيسر: السبورة التفاعلية للشرح (65% من الشاشة) */}
        <section className="w-[65%] bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col overflow-hidden relative">
          
          {/* أدوات السبورة العلوية */}
          <div className="bg-slate-50 border-b border-gray-200 p-3 flex justify-between items-center flex-shrink-0 z-10">
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-gray-600">أدوات الشرح:</span>
              
              {/* ألوان القلم */}
              <div className="flex gap-2">
                {['#2563eb', '#dc2626', '#16a34a', '#1e293b'].map((color) => (
                  <button
                    key={color}
                    onClick={() => setPenColor(color)}
                    className={`w-8 h-8 rounded-full shadow-sm border-2 transition-all ${penColor === color ? 'border-gray-900 scale-110' : 'border-transparent hover:scale-105'}`}
                    style={{ backgroundColor: color }}
                    title="تغيير اللون"
                  />
                ))}
              </div>

              <div className="w-px h-6 bg-gray-300 mx-2"></div>

              {/* حجم القلم */}
              <div className="flex items-center gap-2">
                <button onClick={() => setPenSize(2)} className={`w-8 h-8 flex items-center justify-center rounded-lg ${penSize === 2 ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}>
                  <div className="w-1.5 h-1.5 bg-current rounded-full"></div>
                </button>
                <button onClick={() => setPenSize(4)} className={`w-8 h-8 flex items-center justify-center rounded-lg ${penSize === 4 ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}>
                  <div className="w-3 h-3 bg-current rounded-full"></div>
                </button>
                <button onClick={() => setPenSize(8)} className={`w-8 h-8 flex items-center justify-center rounded-lg ${penSize === 8 ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}>
                  <div className="w-5 h-5 bg-current rounded-full"></div>
                </button>
              </div>
            </div>

            <button 
              onClick={clearCanvas}
              className="bg-white border border-red-200 text-red-600 hover:bg-red-50 font-bold px-4 py-1.5 rounded-lg text-sm transition-all flex items-center gap-2 shadow-sm"
            >
              <span>🗑️</span> مسح السبورة
            </button>
          </div>

          {/* لوحة الرسم (Canvas) */}
          <div className="flex-grow w-full h-full relative cursor-crosshair">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseUp={finishDrawing}
              onMouseOut={finishDrawing}
              onMouseMove={draw}
              onTouchStart={startDrawing}
              onTouchEnd={finishDrawing}
              onTouchMove={draw}
              className="absolute top-0 left-0 w-full h-full"
            />
            {!isDrawing && (
              <div className="absolute top-4 left-4 pointer-events-none opacity-20 flex items-center gap-2">
                <span className="text-6xl">✍️</span>
                <span className="font-extrabold text-2xl text-gray-500">منطقة الشرح التفاعلي</span>
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
          {showAnswer ? 'إخفاء الحل والشرح' : '💡 إظهار الحل والشرح'}
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
