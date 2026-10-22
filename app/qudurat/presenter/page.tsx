'use client';

import React, { useState, useEffect, useRef } from 'react';
import questionsData from '../data/questions.json';

export default function PresenterPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  
  // إعدادات السبورة وأدواتها
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor, setPenColor] = useState('#2563eb');
  const [penSize, setPenSize] = useState(4);
  const [activeTool, setActiveTool] = useState<'pen' | 'eraser' | 'text'>('pen');
  
  // حالة أداة النص
  const [textInput, setTextInput] = useState({ visible: false, x: 0, y: 0, text: '' });
  const inputRef = useRef<HTMLInputElement>(null);

  const currentQuestion = questionsData[currentQuestionIndex];

  // تهيئة السبورة
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
    
    const context = canvas.getContext('2d');
    if (context) {
      // إعدادات تنعيم الخط (Anti-aliasing & Smoothing)
      context.lineCap = 'round';
      context.lineJoin = 'round';
      contextRef.current = context;
    }
  }, []);

  // تركيز التركيز التلقائي على مربع النص عند ظهوره
  useEffect(() => {
    if (textInput.visible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [textInput.visible]);

  // تحديث خصائص القلم أو الممسحة
  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.globalCompositeOperation = activeTool === 'eraser' ? 'destination-out' : 'source-over';
      contextRef.current.strokeStyle = penColor;
      contextRef.current.lineWidth = activeTool === 'eraser' ? penSize * 6 : penSize;
    }
  }, [penColor, penSize, activeTool]);

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

  const handleCanvasPointerDown = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = getCoordinates(e);

    // إذا كانت أداة النص مفعلة، نفتح مربع الكتابة ونخرج
    if (activeTool === 'text') {
      if (textInput.visible) {
        // إذا كان هناك مربع مفتوح مسبقاً، نثبت النص الأول قبل فتح جديد
        handleTextSubmit();
      }
      setTextInput({ visible: true, x: offsetX, y: offsetY, text: '' });
      return;
    }

    // بدء الرسم للقلم أو الممسحة
    if (contextRef.current) {
      contextRef.current.beginPath();
      contextRef.current.moveTo(offsetX, offsetY);
      setIsDrawing(true);
    }
  };

  const finishDrawing = () => {
    if (activeTool === 'text') return;
    if (contextRef.current) {
      contextRef.current.closePath();
      setIsDrawing(false);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !contextRef.current || activeTool === 'text') return;
    const { offsetX, offsetY } = getCoordinates(e);
    
    // استخدام منحنيات بسيطة لتقليل التعرج العنيف للماوس
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  // تثبيت النص المكتوب على السبورة
  const handleTextSubmit = () => {
    if (textInput.text.trim() !== '' && contextRef.current) {
      const ctx = contextRef.current;
      ctx.globalCompositeOperation = 'source-over';
      const fontSize = penSize === 2 ? 18 : penSize === 4 ? 24 : 36;
      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.fillStyle = penColor;
      ctx.fillText(textInput.text, textInput.x, textInput.y + fontSize / 2);
    }
    setTextInput({ ...textInput, visible: false, text: '' });
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (canvas && context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
    setTextInput({ ...textInput, visible: false, text: '' });
  };

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
      
      {/* الشريط العلوي */}
      <header className="flex-shrink-0 bg-slate-900 text-white px-6 py-3 flex justify-between items-center shadow-md z-10">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-xl shadow-inner">ك</div>
          <div>
            <h1 className="font-bold text-lg leading-tight">منصة كليك قدرات</h1>
            <span className="text-blue-300 text-xs">وضع المدرب (Presenter Mode)</span>
          </div>
        </div>
        <div className="bg-slate-800 px-4 py-1.5 rounded-lg border border-slate-700">
          <span className="font-bold text-sm">السؤال {currentQuestionIndex + 1} من {questionsData.length}</span>
        </div>
      </header>

      {/* مساحة العمل */}
      <main className="flex-grow flex gap-4 p-4 overflow-hidden min-h-0">
        
        {/* القسم الأيمن: السؤال */}
        <section className="w-[35%] bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-center p-5 md:p-6 overflow-hidden relative">
          <div className="w-full">
            <div className="mb-4">
              <span className="inline-block bg-blue-50 text-blue-700 text-[11px] font-bold px-3 py-1 rounded-full">
                {currentQuestion.category}
              </span>
            </div>
            
            <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 leading-snug mb-6">
              {currentQuestion.text}
            </h2>

            <div className="space-y-3">
              {currentQuestion.options.map((option, idx) => {
                const isCorrect = option === currentQuestion.correctAnswer;
                let optionStyle = "border-gray-200 bg-white text-gray-700";
                if (showAnswer) {
                  optionStyle = isCorrect ? "border-green-500 bg-green-50 text-green-900 font-extrabold shadow-md transform scale-[1.02]" : "border-gray-100 bg-gray-50 text-gray-400 opacity-60";
                }
                return (
                  <div key={idx} className={`p-3.5 rounded-xl border-2 text-base md:text-lg transition-all duration-300 flex justify-between items-center ${optionStyle}`}>
                    <span>{option}</span>
                    {showAnswer && isCorrect && <span className="text-xl drop-shadow-sm">✅</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* القسم الأيسر: السبورة */}
        <section className="w-[65%] bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col overflow-hidden relative">
          
          {/* أدوات السبورة العلوية */}
          <div className="bg-slate-50 border-b border-gray-200 p-2.5 flex justify-between items-center flex-shrink-0 z-10">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-gray-600 ml-2">أدوات الشرح:</span>
              
              {/* اختيار الأداة */}
              <div className="flex items-center gap-1.5 bg-gray-200 p-1 rounded-lg">
                <button onClick={() => setActiveTool('pen')} className={`px-3 py-1.5 rounded-md text-sm font-bold transition-all ${activeTool === 'pen' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-800'}`}>
                  قلم 🖊️
                </button>
                <button onClick={() => setActiveTool('text')} className={`px-3 py-1.5 rounded-md text-sm font-bold transition-all ${activeTool === 'text' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-800'}`}>
                  نص T
                </button>
                <button onClick={() => setActiveTool('eraser')} className={`px-3 py-1.5 rounded-md text-sm font-bold transition-all ${activeTool === 'eraser' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-800'}`}>
                  ممسحة 🧽
                </button>
              </div>

              <div className="w-px h-6 bg-gray-300 mx-1"></div>

              {/* ألوان القلم */}
              <div className="flex gap-2">
                {['#2563eb', '#dc2626', '#16a34a', '#1e293b'].map((color) => (
                  <button
                    key={color}
                    onClick={() => { setPenColor(color); if(activeTool === 'eraser') setActiveTool('pen'); }}
                    className={`w-8 h-8 rounded-full shadow-sm border-2 transition-all ${activeTool !== 'eraser' && penColor === color ? 'border-gray-900 scale-110' : 'border-transparent hover:scale-105'}`}
                    style={{ backgroundColor: color }}
                    title="تغيير اللون"
                  />
                ))}
              </div>

              <div className="w-px h-6 bg-gray-300 mx-1"></div>

              {/* حجم الأداة */}
              <div className="flex items-center gap-1.5">
                {[2, 4, 8].map((size) => (
                  <button key={size} onClick={() => setPenSize(size)} className={`w-8 h-8 flex items-center justify-center rounded-lg ${penSize === size ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}>
                    <div className="bg-current rounded-full" style={{ width: size + 2, height: size + 2 }}></div>
                  </button>
                ))}
              </div>
            </div>

            <button onClick={clearCanvas} className="bg-white border border-red-200 text-red-600 hover:bg-red-50 font-bold px-4 py-1.5 rounded-lg text-sm transition-all flex items-center gap-2 shadow-sm">
              <span>🗑️</span> مسح الكل
            </button>
          </div>

          {/* لوحة الرسم */}
          <div className="flex-grow w-full h-full relative cursor-crosshair overflow-hidden">
            <canvas
              ref={canvasRef}
              onMouseDown={handleCanvasPointerDown}
              onMouseUp={finishDrawing}
              onMouseOut={finishDrawing}
              onMouseMove={draw}
              onTouchStart={handleCanvasPointerDown}
              onTouchEnd={finishDrawing}
              onTouchMove={draw}
              className="absolute top-0 left-0 w-full h-full z-10"
            />

            {/* مربع إدخال النص العائم (يظهر عند استخدام أداة النص والنقر على السبورة) */}
            {textInput.visible && (
              <input
                ref={inputRef}
                type="text"
                value={textInput.text}
                onChange={(e) => setTextInput({ ...textInput, text: e.target.value })}
                onKeyDown={(e) => { if (e.key === 'Enter') handleTextSubmit(); }}
                onBlur={handleTextSubmit}
                className="absolute z-20 bg-transparent border-b-2 border-dashed border-blue-400 outline-none p-0 m-0"
                style={{
                  left: `${textInput.x}px`,
                  top: `${textInput.y - (penSize === 2 ? 10 : penSize === 4 ? 14 : 20)}px`,
                  color: penColor,
                  fontSize: `${penSize === 2 ? 18 : penSize === 4 ? 24 : 36}px`,
                  fontWeight: 'bold',
                  fontFamily: 'sans-serif'
                }}
                placeholder="اكتب هنا..."
              />
            )}
            
            {!isDrawing && !showAnswer && !textInput.visible && (
              <div className="absolute top-6 left-6 pointer-events-none opacity-20 flex items-center gap-2 z-0">
                <span className="text-5xl">✍️</span>
                <span className="font-extrabold text-xl text-gray-500">منطقة الشرح التفاعلي</span>
              </div>
            )}

            {showAnswer && currentQuestion.explanation && (
              <div className="absolute bottom-4 left-4 right-4 bg-amber-50/95 backdrop-blur-sm border-2 border-amber-300 rounded-2xl p-5 shadow-2xl z-20 animate-in fade-in slide-in-from-bottom-4">
                <h4 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
                  <span className="text-xl">💡</span> شرح الحل:
                </h4>
                <p className="text-amber-900 leading-relaxed text-sm md:text-base font-medium">
                  {currentQuestion.explanation}
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* الشريط السفلي */}
      <footer className="flex-shrink-0 bg-white border-t border-gray-200 p-4 flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
        <button onClick={handlePrev} disabled={currentQuestionIndex === 0} className={`px-8 py-3 rounded-xl font-bold text-lg transition-all ${currentQuestionIndex === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-800 hover:bg-gray-300 shadow-sm'}`}>
          السؤال السابق
        </button>
        <button onClick={toggleAnswer} className={`px-12 py-3.5 rounded-2xl font-extrabold text-xl shadow-lg transition-all transform hover:scale-105 ${showAnswer ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}>
          {showAnswer ? 'إخفاء الحل والشرح' : '💡 إظهار الحل والشرح'}
        </button>
        <button onClick={handleNext} disabled={currentQuestionIndex === questionsData.length - 1} className={`px-10 py-3 rounded-xl font-bold text-lg text-white shadow-md transition-all ${currentQuestionIndex === questionsData.length - 1 ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
          {currentQuestionIndex === questionsData.length - 1 ? 'نهاية الأسئلة' : 'السؤال التالي'}
        </button>
      </footer>

    </div>
  );
}
