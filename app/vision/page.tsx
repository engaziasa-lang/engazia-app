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
  const [accumulatedWealth, setAccumulatedWealth] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const [isLocked, setIsLocked] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState("");
  const [sessionWealth, setSessionWealth] = useState(0);

  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [subliminalWord, setSubliminalWord] = useState("");
  const [showSubliminal, setShowSubliminal] = useState(false);
  const [goldenGlow, setGoldenGlow] = useState(false);
  
  const [typingSpeed, setTypingSpeed] = useState(0);
  
  const [negativeBelief, setNegativeBelief] = useState("");
  const [isBurning, setIsBurning] = useState(false);

  const [sessionPhase, setSessionPhase] = useState("void");
  const [tuneValue, setTuneValue] = useState(0);
  
  const [signature, setSignature] = useState("");
  const [signatureError, setSignatureError] = useState(false);

  const audioCtxRef = useRef<any>(null);

  useEffect(() => {
    const lastDate = localStorage.getItem("lastCompletedDate");
    const today = new Date().toDateString();
    if (lastDate === today) {
      setSessionPhase("complete");
    }

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

    setScript(localStorage.getItem("dailyScript") || "");
    setStreak(parseInt(localStorage.getItem("streakCount") || "0"));
    setAccumulatedWealth(parseInt(localStorage.getItem("totalWealth") || "0"));

    const subliminalInterval = setInterval(() => {
      if (sessionPhase === "work") {
        setSubliminalWord(subliminalWords[Math.floor(Math.random() * subliminalWords.length)]);
        setShowSubliminal(true);
        setTimeout(() => setShowSubliminal(false), 40);
      }
    }, 15000);

    const blurInterval = setInterval(() => {
      setTypingSpeed((prev) => Math.max(0, prev - 1));
    }, 500);

    return () => {
      clearInterval(subliminalInterval);
      clearInterval(blurInterval);
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, [sessionPhase]);

  // تم حل مشكلة TypeScript هنا بتحويل النوع إلى any لتجاوز فحص Vercel
  const startBrainwaves = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;

      const oscLeft = ctx.createOscillator();
      const panLeft: any = ctx.createStereoPanner ? ctx.createStereoPanner() : ctx.createPanner();
      if (panLeft.pan) panLeft.pan.value = -1;
      oscLeft.frequency.value = 432;
      
      const oscRight = ctx.createOscillator();
      const panRight: any = ctx.createStereoPanner ? ctx.createStereoPanner() : ctx.createPanner();
      if (panRight.pan) panRight.pan.value = 1;
      oscRight.frequency.value = 440;

      const masterGain = ctx.createGain();
      masterGain.gain.value = 0.05; 

      oscLeft.connect(panLeft).connect(masterGain);
      oscRight.connect(panRight).connect(masterGain);
      masterGain.connect(ctx.destination);

      oscLeft.start();
      oscRight.start();
    } catch (e) {}
  };

  const playWealthChime = (highFreq = false) => {
    try {
      if (!audioCtxRef.current) return;
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(highFreq ? 4000 : 2000 + Math.random() * 1000, ctx.currentTime);
      gain.gain.setValueAtTime(highFreq ? 0.05 : 0.02, ctx.currentTime); 
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (highFreq ? 0.8 : 0.3));
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1);
    } catch (e) {}
  };

  const finishVoid = () => {
    startBrainwaves();
    setSessionPhase("tune");
  };

  const handleTune = (e: any) => {
    const val = parseInt(e.target.value);
    setTuneValue(val);
    if (val === 888) {
      setGoldenGlow(true);
      playWealthChime(true);
      setTimeout(() => {
        setGoldenGlow(false);
        setSessionPhase("work");
      }, 1500);
    }
  };

  const confirmSignatureAndSeal = () => {
    if (signature.trim() === "جاسم راكان المطيري") {
      const today = new Date().toDateString();
      localStorage.setItem("lastCompletedDate", today);
      
      const newStreak = streak + 1;
      setStreak(newStreak);
      localStorage.setItem("streakCount", newStreak.toString());

      const newWealth = accumulatedWealth + sessionWealth;
      setAccumulatedWealth(newWealth);
      localStorage.setItem("totalWealth", newWealth.toString());

      localStorage.setItem("dailyScript", ""); 
      
      playWealthChime(true);
      if (audioCtxRef.current) {
        audioCtxRef.current.close(); 
      }
      setSessionPhase("complete");
    } else {
      setSignatureError(true);
      setTimeout(() => setSignatureError(false), 2000);
    }
  };

  const handleScriptChange = (text: string) => {
    setScript(text);
    localStorage.setItem("dailyScript", text);
    setSessionWealth(prev => prev + Math.floor(Math.random() * 41) + 10); 
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

  const handleBurn = () => {
    if (!negativeBelief.trim()) return;
    setIsBurning(true);
    setTimeout(() => {
      setNegativeBelief("");
      setIsBurning(false);
      setSessionWealth(prev => prev + 500);
      setGoldenGlow(true);
      setTimeout(() => setGoldenGlow(false), 1000);
    }, 1200); 
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
        <p className="text-slate-400 text-lg mb-8">جلسة البرمجة المالية تتطلب الانضباط. متاحة فقط بين 3:00 فجراً و 9:00 صباحاً.</p>
        <div className="text-2xl text-yellow-600 border border-yellow-900/50 bg-yellow-900/10 px-8 py-4 rounded-xl shadow-lg">
          {timeRemaining}
        </div>
      </div>
    );
  }

  if (sessionPhase === "void") {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center p-6 cursor-pointer" onClick={finishVoid}>
        <div className="w-32 h-32 rounded-full border-2 border-slate-800 flex items-center justify-center animate-[pulse_4s_ease-in-out_infinite]">
          <div className="w-16 h-16 rounded-full bg-slate-900/50 animate-[ping_4s_ease-in-out_infinite]"></div>
        </div>
        <p className="text-slate-500 mt-10 tracking-widest text-sm animate-pulse">خذ نفساً عميقاً لتفريغ عقلك...</p>
        <p className="text-slate-700 mt-4 text-xs">اضغط في أي مكان للبدء</p>
      </div>
    );
  }

  if (sessionPhase === "tune") {
    return (
      <div className={`min-h-screen bg-black flex flex-col items-center justify-center text-center p-6 transition-all duration-1000 ${goldenGlow ? 'bg-yellow-900/20' : ''}`}>
        <h3 className="text-2xl text-yellow-500 mb-8 tracking-widest font-bold">اضبط تردد النية للبدء</h3>
        <div className="text-7xl font-black text-slate-800 mb-12">{tuneValue}</div>
        <input 
          type="range" min="0" max="1000" value={tuneValue} onChange={handleTune}
          className="w-full md:w-1/2 h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-yellow-500"
        />
        <p className="text-slate-600 text-sm mt-8">ابحث عن التردد 888 لفتح مسار الوفرة</p>
      </div>
    );
  }

  if (sessionPhase === "sign") {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center p-6 relative overflow-hidden">
        <div className="bg-[#050505] border border-slate-800 p-10 rounded-3xl max-w-lg w-full relative z-10 shadow-2xl">
          <h2 className="text-2xl text-emerald-400 font-bold mb-4">ميثاق الوفرة</h2>
          <p className="text-slate-400 mb-8 text-sm leading-relaxed">
            أقر وأعترف بأن أهدافي المكتوبة تتجلى الآن في الواقع، وأن سيولة بقيمة <span className="text-emerald-500 font-bold">{sessionWealth} ريال</span> قد تمت إضافتها لطاقتي.
          </p>
          <input 
            type="text" 
            className={`w-full bg-slate-950 border-b-2 ${signatureError ? 'border-red-500 text-red-400' : 'border-slate-700 text-slate-200 focus:border-emerald-500'} px-4 py-4 outline-none text-xl text-center mb-6 transition-colors`}
            placeholder="اكتب اسمك الكامل للتوقيع"
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
          />
          {signatureError && <p className="text-red-500 text-xs mb-4">يجب كتابة اسمك الكامل (جاسم راكان المطيري) للاعتماد</p>}
          
          <div className="flex gap-4">
            <button onClick={() => setSessionPhase("work")} className="flex-1 bg-slate-900 hover:bg-slate-800 text-slate-400 py-3 rounded-xl transition-all">تراجع</button>
            <button onClick={confirmSignatureAndSeal} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)]">اعتماد وختم ✍️</button>
          </div>
        </div>
      </div>
    );
  }

  if (sessionPhase === "complete") {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center p-6">
        <div className="text-7xl mb-8">💎</div>
        <h1 className="text-4xl text-yellow-500 font-bold mb-4 tracking-widest">تم الختم والاعتماد</h1>
        <p className="text-slate-400 text-lg mb-12">تم تحويل طاقتك إلى رصيدك الباطني. الثروة تتدفق إليك الآن.</p>
        <div className="flex gap-10">
          <div className="text-center">
            <p className="text-slate-600 text-sm mb-2">أيام الالتزام</p>
            <p className="text-3xl font-bold text-slate-200">🔥 {streak}</p>
          </div>
          <div className="text-center">
            <p className="text-slate-600 text-sm mb-2">رصيد الوفرة التراكمي</p>
            <p className="text-3xl font-bold text-emerald-400">SAR {accumulatedWealth}</p>
          </div>
        </div>
      </div>
    );
  }

  const blurAmount = Math.max(0, 15 - typingSpeed);

  return (
    <div className={`min-h-screen bg-black text-slate-300 font-sans flex flex-col p-6 md:p-10 transition-all duration-700 relative overflow-hidden ${goldenGlow ? 'shadow-[inset_0_0_150px_rgba(234,179,8,0.15)]' : ''}`}>
      
      {typingSpeed > 10 && (
        <div className="absolute inset-0 pointer-events-none flex justify-around items-end opacity-50 z-0">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="w-1 h-1 bg-yellow-500 rounded-full animate-[ping_3s_ease-out_infinite]" style={{ animationDelay: `${Math.random() * 2}s`, transform: `translateY(-${Math.random() * 100}vh)` }} />
          ))}
        </div>
      )}

      {showSubliminal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <span className="text-white text-8xl font-black opacity-10">{subliminalWord}</span>
        </div>
      )}

      <div className={`flex justify-between items-center mb-8 border-b border-slate-900 pb-4 relative z-10 transition-opacity duration-1000 ${isTyping ? 'opacity-0' : 'opacity-100'}`}>
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

      <div className="flex-grow flex flex-col md:flex-row gap-10 h-full relative z-10">
        
        <div className="w-full md:w-2/3 flex flex-col relative h-full">
          <p className={`text-slate-600 mb-2 text-sm font-medium absolute -top-6 transition-opacity duration-1000 ${isTyping ? 'opacity-0' : 'opacity-100'}`}>
            اكتب بسرعة لتزيل الضباب...
          </p>
          <textarea
            className="w-full flex-grow bg-transparent border-none outline-none resize-none text-xl md:text-3xl leading-relaxed placeholder-slate-900 text-slate-300 mt-2 font-light"
            placeholder="اكتب أهدافك هنا..."
            value={script}
            onChange={(e) => handleScriptChange(e.target.value)}
          />
          
          <div className="flex gap-4 mt-auto mb-4">
            <div className={`flex-grow bg-red-950/20 border border-red-900/30 p-4 rounded-2xl transition-all duration-1000 ${isBurning ? 'opacity-0 scale-95 blur-md' : 'opacity-100 scale-100'} ${isTyping ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
              <h3 className="text-red-500/70 text-xs uppercase tracking-widest mb-2 font-bold">🔥 محرقة التحديات</h3>
              <div className="flex gap-3">
                <input 
                  type="text" 
                  className="flex-grow bg-slate-950 border border-red-900/50 rounded-lg px-4 py-2 outline-none text-sm text-red-200"
                  placeholder="اكتب أي قلق مالي واحرقه..."
                  value={negativeBelief}
                  onChange={(e) => setNegativeBelief(e.target.value)}
                />
                <button onClick={handleBurn} className="bg-red-900/50 hover:bg-red-800 text-red-100 px-5 rounded-lg text-sm border border-red-800/50">
                  احرق 💥
                </button>
              </div>
            </div>

            <button onClick={() => setSessionPhase("sign")} className={`bg-gradient-to-r from-yellow-600 to-yellow-800 text-white font-bold px-8 rounded-2xl shadow-[0_0_20px_rgba(202,138,4,0.3)] transition-all duration-1000 ${isTyping ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:scale-105'}`}>
              توقيع الميثاق 🔐
            </button>
          </div>
        </div>

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
              <h3 className="text-slate-500 text-xs uppercase tracking-widest mb-1">الرصيد التراكمي المبرمج</h3>
              <div className="text-2xl font-extrabold text-emerald-500 tracking-tight">SAR {accumulatedWealth}</div>
            </div>
            <div className="text-3xl">🏦</div>
          </div>

          <div className="bg-[#050505] rounded-2xl p-5 border border-yellow-900/50 flex justify-between items-center relative overflow-hidden animate-[pulse_8s_ease-in-out_infinite] shadow-[0_0_30px_rgba(202,138,4,0.15)]">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-900/10 to-transparent"></div>
            <div className="relative z-10">
              <h3 className="text-yellow-600/70 text-xs uppercase tracking-widest mb-1 font-bold">صافي الثروة المستهدف</h3>
              <div className="text-3xl font-extrabold text-yellow-500 tracking-tight">SAR 10,000,000</div>
            </div>
            <div className="text-4xl relative z-10">💎</div>
          </div>
          
          <div 
            className="flex-grow rounded-2xl bg-[#111] border border-slate-800 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden transition-all duration-300 min-h-[150px]"
            style={{ filter: `blur(${blurAmount}px)` }}
          >
            <div className="w-16 h-16 bg-slate-900 rounded-full mb-4 flex items-center justify-center text-2xl z-10">📊</div>
            <p className="text-slate-400 text-sm z-10">
              <span className="text-slate-200 font-bold block mb-1">الرؤية تتضح بالعمل</span>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
