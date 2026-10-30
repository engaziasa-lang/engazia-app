"use client";
import { useState, useEffect } from 'react';

export default function VisionBoard() {
  const [script, setScript] = useState("");
  const [streak, setStreak] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const savedScript = localStorage.getItem("dailyScript") || "";
    const savedStreak = localStorage.getItem("streakCount") || "0";
    setScript(savedScript);
    setStreak(parseInt(savedStreak));
  }, []);

  const handleScriptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setScript(text);
    localStorage.setItem("dailyScript", text);
  };

  // دالة تشغيل التوجيه الصوتي الآلي
  const speakScript = () => {
    if (!script.trim()) return;
    
    // إيقاف أي صوت سابق
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(script);
    utterance.lang = 'ar-SA'; // نطق باللكنة السعودية إن توفرت في النظام
    utterance.rate = 0.9; // سرعة هادئة ومريحة للبرمجة العقلية
    utterance.pitch = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-slate-300 font-sans flex flex-col p-6 md:p-10">
      
      <div className="flex justify-between items-center mb-10 border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-slate-100 tracking-wider">
          برمجة العقل المالي <span className="text-blue-500">|</span> Vision
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-sm bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700 shadow-inner">
            🔥 أيام الالتزام: {streak}
          </span>
          <button 
            onClick={speakScript}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)] ${
              isSpeaking ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'
            }`}
          >
            {isSpeaking ? '🔊 جاري البرمجة الصوتية...' : 'تشغيل التوجيه الصوتي 🔊'}
          </button>
        </div>
      </div>

      <div className="flex-grow flex flex-col md:flex-row gap-10">
        
        <div className="w-full md:w-2/3 flex flex-col">
          <p className="text-slate-500 mb-4 text-sm font-medium">
            اكتب أهدافك المالية الكبرى كأنها تتحقق الآن (يتم الحفظ تلقائياً)...
          </p>
          <textarea
            className="w-full flex-grow bg-transparent border-none outline-none resize-none text-xl md:text-2xl leading-relaxed placeholder-slate-800 text-slate-300"
            placeholder="أنا الآن أمتلك أراضي استثمارية استراتيجية، ومكتبي يحقق نمواً متصاعداً..."
            value={script}
            onChange={handleScriptChange}
            autoFocus
          />
        </div>

        <div className="w-full md:w-1/3 flex flex-col gap-6">
          <div className="bg-[#111827] rounded-2xl p-6 shadow-2xl border border-slate-800/60">
            <h3 className="text-slate-500 text-xs uppercase tracking-widest mb-2">الإيرادات الشهرية المستهدفة</h3>
            <div className="text-4xl font-extrabold text-emerald-400 tracking-tight">
              SAR 100,000<span className="text-lg text-slate-600 font-normal">/mo</span>
            </div>
          </div>
          
          <div className="flex-grow rounded-2xl bg-[#111827] border border-slate-800/60 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden group">
            <div className="w-16 h-16 bg-slate-800 rounded-full mb-4 flex items-center justify-center group-hover:scale-110 transition-transform text-2xl">
              🏢
            </div>
            <p className="text-slate-400 text-sm">
              مساحة مخصصة لعرض صور المخططات السكنية والأراضي.<br/>
              <span className="text-slate-600 text-xs mt-2 block">أضف الصور في مجلد public واستدعها هنا</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
