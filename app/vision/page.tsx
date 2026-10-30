"use client";
import { useState, useEffect, useRef } from 'react';

const scriptsLibrary = [
  "أنا الآن أستقبل تدفقاً نقدياً مستمراً من اشتراكات منصة إنجازيا. إيراداتي الشهرية تتجاوز 100 ألف ريال وتنمو باستمرار وبكل سهولة.",
  "صافي ثروتي يتضاعف كل عام. أنا أدير أعمالي الرقمية ومكتبي بذكاء، وأحقق عائداً سنوياً يفوق المليون ريال وأستمتع بالحرية المالية المطلقة.",
  "عقلي الباطن مبرمج على الوفرة واستقطاب المال. كل أداة أطلقها تتحول إلى مصدر دخل سلبي مستدام يرفع من إجمالي ثروتي وتدفقاتي النقدية."
];

const subliminalWords = ["وفرة", "SAR 10,000,000", "نجاح", "تدفق نقدي", "إنجازيا"];
const powerKeywords = ["مليون", "ثروة", "وفرة", "إنجازيا", "نجاح", "أرباح", "100 ألف"];

export default function UltimateVisionBoard() {
  const [script, setScript] = useState("");
  const [streak, setStreak] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const [isLocked, setIsLocked] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState("");
  const [sessionWealth, setSessionWealth] = useState(0);

  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // حالات الابتكارات
  const [subliminalWord, setSubliminalWord] = useState("");
  const [showSubliminal, setShowSubliminal] = useState(false);
  const [goldenGlow, setGoldenGlow] = useState(false);
  
  // 🌟 1. حالة الوضوح المرتبط بالطباعة (Clarity Engine)
  const [typingSpeed, setTypingSpeed] = useState(0);
  
  // 🌟 2. محرقة المعتقدات
  const [negativeBelief, setNegativeBelief] = useState("");
  const [isBurning, setIsBurning] = useState(false);

  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour >= 3 && currentHour < 9) {
      setIsLocked(false);
    } else {
      setIsLocked(true);
      const now = new Date();
      let target = new Date();
      if (currentHour >= 9) target.setDate(target.getDate() + 1);
      target.setHours(3, 0, 0, 0);
      const diff = Math.floor((target.getTime() - now.getTime()) / (1000 * 60 * 60));
      setTimeRemaining(`يفتح بعد ${diff} ساعة`);
    }

    const savedScript = localStorage.getItem("dailyScript") || "";
    const savedStreak = localStorage.getItem("streakCount") || "0";
    setScript(savedScript);
    setStreak(parseInt(savedStreak));

    const subliminalInterval = setInterval(() => {
      const randomWord = subliminalWords[Math.floor(Math.random() * subliminalWords.length)];
      setSubliminalWord(randomWord);
      setShowSubliminal(true);
      setTimeout(() => setShowSubliminal(false), 40);
    }, 15000);

    // محرك التلاشي البطيء لسرعة الطباعة (يعيد الضباب إذا توقفت)
    const blurInterval = setInterval(() => {
      setTypingSpeed((prev) => Math.max(0, prev - 1));
    }, 500);

    return () => {
      clearInterval(subliminalInterval);
      clearInterval(blurInterval);
    };
  }, []);

  // 🌟 3. مولد الرنين الصوتي المجاني (ASMR Chimes)
  const playWealthChime = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      // ترددات مرتفعة متغيرة عشوائياً لمحاكاة رنين العملات (بين 2000Hz و 3000Hz)
      osc.frequency.setValueAtTime(2000 + Math.random() * 1000, ctx.currentTime);
      
      gain.gain.setValueAtTime(0.02, ctx.currentTime); // صوت خافت جداً ولا يزعج
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      // تجاهل الخطأ في حال لم يدعم المتصفح
    }
  };

  const handleScriptChange = (text: string) => {
    setScript(text);
    localStorage.setItem("dailyScript", text);
    setSessionWealth(prev => prev + Math.floor(Math.random() * 41) + 10); 
    
    // زيادة مؤشر السرعة لإزالة الضباب وتشغيل الرنين
    setTypingSpeed((prev) => Math.min(25, prev + 2)); 
    playWealthChime();

    const lastWord = text.split(/\s+/).pop() || "";
    if (powerKeywords.some(keyword => lastWord.includes(keyword))) {
      setGoldenGlow(true);
      setTimeout(() => setGoldenGlow(false), 800);
    }

    setIsTyping(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 3000);
  };

  // 🌟 دالة حرق المعتقدات
  const handleBurn = () => {
    if (!negativeBelief.trim()) return;
    setIsBurning(true);
    
    setTimeout(() => {
      setNegativeBelief("");
      setIsBurning(false);
      // تحويل الطاقة السلبية إلى 500 ريال فوراً في الرصيد الوهمي
      setSessionWealth(prev => prev + 500);
      setGoldenGlow(true);
      setTimeout(() => setGoldenGlow(false), 1000);
    }, 1200); // وقت الأنيميشن
  };

  const generateFromLibrary = () => {
    const randomIndex = Math.floor(Math.random() * scriptsLibrary.length);
    handleScriptChange(scriptsLibrary[randomIndex]);
  };

  const speakScript = () => {
    if (!script.trim()) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(script);
    utterance.lang = 'ar-SA'; 
    utterance.rate = 0.85; 
    utterance.pitch = 1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  if (isLocked) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center p-6">
        <h1 className="text-4xl text-slate-500 font-bold mb-4 tracking-widest">مغلق</h1>
        <p className="text-slate-400 text-lg mb-8">جلسة البرمجة المالية العميقة تتطلب الانضباط. هذه المنصة متاحة فقط بين 3:00 فجراً و 9:00 صباحاً.</p>
        <div className="text-2xl text-yellow-600 border border-yellow-900/50 bg-yellow-900/10 px-8 py-4 rounded-xl shadow-lg">
          {timeRemaining}
        </div>
      </div>
    );
  }

  // حساب درجة الضبابية بناءً على سرعة الطباعة (Max 20px blur, Min 0px)
  const blurAmount = Math.max(0, 15 - typingSpeed);

  return (
    <div className={`min-h-screen bg-black text-slate-300 font-sans flex flex-col p-6 md:p-10 transition-all duration-700 relative ${goldenGlow ? 'shadow-[inset_0_0_150px_rgba(234,179,8,0.15)]' : ''}`}>
      
      {showSubliminal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <span className="text-white text-8xl font-black opacity-10">{subliminalWord}</span>
        </div>
      )}

      <audio src="/focus-audio.mp3" autoPlay loop muted={false} className="hidden" />

      <div className={`flex justify-between items-center mb-8 border-b border-slate-900 pb-4 transition-opacity duration-1000 ${isTyping ? 'opacity-0' : 'opacity-100'}`}>
        <h1 className="text-2xl font-bold text-slate-100 tracking-wider">
          برمجة الوفرة <span className="text-blue-500">|</span> Wealth Vision
        </h1>
        <div className="flex items-center gap-3">
          <span className="text-sm bg-slate-900 px-4 py-2 rounded-full border border-slate-800 shadow-inner">
            🔥 التزام: {streak}
          </span>
          <button onClick={generateFromLibrary} className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-[0_0_15px_rgba(147,51,234,0.3)]">
            توكيد مالي 💸
          </button>
          <button onClick={speakScript} className={`px-5 py-2 rounded-lg text-sm font-medium transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)] ${isSpeaking ? 'bg-emerald-600' : 'bg-blue-600'}`}>
            {isSpeaking ? '🔊 جاري النطق...' : 'تشغيل الصوت 🔊'}
          </button>
        </div>
      </div>

      <div className="flex-grow flex flex-col md:flex-row gap-10 h-full">
        
        {/* مساحة العمل (الكتابة + المحرقة) */}
        <div className="w-full md:w-2/3 flex flex-col relative h-full">
          <p className={`text-slate-600 mb-2 text-sm font-medium absolute -top-6 transition-opacity duration-1000 ${isTyping ? 'opacity-0' : 'opacity-100'}`}>
            اكتب بسرعة لتزيل الضباب عن أهدافك...
          </p>
          <textarea
            className="w-full flex-grow bg-transparent border-none outline-none resize-none text-xl md:text-3xl leading-relaxed placeholder-slate-900 text-slate-300 mt-2 font-light"
            placeholder="اكتب أهدافك هنا..."
            value={script}
            onChange={(e) => handleScriptChange(e.target.value)}
          />

          {/* 🌟 محرقة المعتقدات */}
          <div className={`mt-auto mb-4 bg-red-950/20 border border-red-900/30 p-4 rounded-2xl transition-all duration-1000 ${isBurning ? 'opacity-0 scale-95 blur-md' : 'opacity-100 scale-100'} ${isTyping ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <h3 className="text-red-500/70 text-xs uppercase tracking-widest mb-2 font-bold">🔥 محرقة التحديات والشكوك</h3>
            <div className="flex gap-3">
              <input 
                type="text" 
                className="flex-grow bg-slate-950 border border-red-900/50 rounded-lg px-4 py-2 outline-none text-sm text-red-200 focus:border-red-500 transition-colors"
                placeholder="اكتب أي قلق مالي واحرقه فوراً..."
                value={negativeBelief}
                onChange={(e) => setNegativeBelief(e.target.value)}
              />
              <button 
                onClick={handleBurn}
                className="bg-red-900/50 hover:bg-red-800 text-red-100 px-5 rounded-lg text-sm transition-all border border-red-800/50 flex items-center justify-center"
              >
                احرق 💥
              </button>
            </div>
          </div>
        </div>

        {/* لوحة المؤشرات والرؤية */}
        <div className={`w-full md:w-1/3 flex flex-col gap-4 transition-opacity duration-1000 ${isTyping ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          
          <div className="bg-[#050505] rounded-2xl p-5 shadow-lg border border-emerald-900/30 flex justify-between items-center relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/10 to-transparent"></div>
            <div className="relative z-10">
              <h3 className="text-emerald-600/70 text-xs uppercase tracking-widest mb-1 font-bold">سيولة الجلسة الحالية</h3>
              <div className="text-3xl font-extrabold text-emerald-400 tracking-tight transition-all duration-300 ease-out">
                +{sessionWealth} <span className="text-sm font-normal text-emerald-700">SAR</span>
              </div>
            </div>
            <div className="text-4xl relative z-10">⌨️</div>
          </div>

          <div className="bg-[#050505] rounded-2xl p-5 shadow-lg border border-slate-900 flex justify-between items-center">
            <div>
              <h3 className="text-slate-500 text-xs uppercase tracking-widest mb-1">الإيرادات السنوية</h3>
              <div className="text-2xl font-extrabold text-blue-400 tracking-tight">SAR 1,200,000</div>
            </div>
            <div className="text-3xl">🚀</div>
          </div>

          <div className="bg-[#050505] rounded-2xl p-5 border border-yellow-900/50 flex justify-between items-center relative overflow-hidden animate-[pulse_8s_ease-in-out_infinite] shadow-[0_0_30px_rgba(202,138,4,0.15)]">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-900/10 to-transparent"></div>
            <div className="relative z-10">
              <h3 className="text-yellow-600/70 text-xs uppercase tracking-widest mb-1 font-bold">صافي الثروة المستهدف</h3>
              <div className="text-3xl font-extrabold text-yellow-500 tracking-tight">SAR 10,000,000</div>
            </div>
            <div className="text-4xl relative z-10">💎</div>
          </div>
          
          {/* 🌟 لوحة الرؤية الضبابية (تتضح فقط مع الطباعة السريعة) */}
          <div 
            className="flex-grow rounded-2xl bg-[#111] border border-slate-800 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden transition-all duration-300 min-h-[150px]"
            style={{ filter: `blur(${blurAmount}px)` }}
          >
            <div className="w-16 h-16 bg-slate-900 rounded-full mb-4 flex items-center justify-center text-2xl z-10">📊</div>
            <p className="text-slate-400 text-sm z-10">
              <span className="text-slate-200 font-bold block mb-1">الرؤية تتضح بالعمل</span>
            </p>
            {/* ضع صورتك هنا وستكون ضبابية وتتضح مع الكتابة */}
            {/* <img src="/wealth-chart.jpg" className="absolute inset-0 w-full h-full object-cover opacity-60" /> */}
          </div>

        </div>
      </div>
    </div>
  );
}
