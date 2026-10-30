"use client";
import { useState, useEffect, useRef } from 'react';

const scriptsLibrary = [
  "أنا الآن أستقبل تدفقاً نقدياً مستمراً من اشتراكات منصة إنجازيا. إيراداتي الشهرية تتجاوز 100 ألف ريال وتنمو باستمرار وبكل سهولة.",
  "صافي ثروتي يتضاعف كل عام. أنا أدير أعمالي الرقمية ومكتبي بذكاء، وأحقق عائداً سنوياً يفوق المليون ريال وأستمتع بالحرية المالية المطلقة.",
  "عقلي الباطن مبرمج على الوفرة واستقطاب المال. كل أداة أطلقها تتحول إلى مصدر دخل سلبي مستدام يرفع من إجمالي ثروتي وتدفقاتي النقدية."
];

// 🌟 عبارات جاهزة بنقرة واحدة خصيصاً لسرعة الجوال
const quickPhrases = [
  "أنا مغناطيس للسيولة والثروة",
  "إنجازيا تتوسع وتحقق أرباحاً ضخمة",
  "أموالي تتضاعف كل يوم بكل سهولة",
  "كل أداة أطلقها تجلب لي دخلاً متسارعاً"
];

const subliminalWords = ["وفرة", "SAR 10,000,000", "نجاح", "تدفق نقدي", "إنجازيا"];
const powerKeywords = ["مليون", "ثروة", "وفرة", "إنجازيا", "نجاح", "أرباح", "100 ألف"];
const doubtKeywords = ["أتمنى", "سوف", "أحاول", "لعل", "ربما", "عسى", "ممكن", "يارب"];

export default function UltimateVisionBoard() {
  const [script, setScript] = useState("");
  const [streak, setStreak] = useState(0);
  const [accumulatedWealth, setAccumulatedWealth] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const [isLocked, setIsLocked] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState("");
  const [sessionWealth, setSessionWealth] = useState(0);

  const [subliminalWord, setSubliminalWord] = useState("");
  const [showSubliminal, setShowSubliminal] = useState(false);
  const [goldenGlow, setGoldenGlow] = useState(false);
  
  const [glitchGlow, setGlitchGlow] = useState(false);
  const [linguisticWarning, setLinguisticWarning] = useState("");
  
  const [typingSpeed, setTypingSpeed] = useState(0);
  const [negativeBelief, setNegativeBelief] = useState("");
  const [isBurning, setIsBurning] = useState(false);

  const [sessionPhase, setSessionPhase] = useState("work");
  
  // 🌟 تبويبات الجوال (تتبدل بين لوحة المؤشرات ولوحة التجلي لمنع التمرير الطويل)
  const [activeMobileTab, setActiveMobileTab] = useState("workspace");

  const [signature, setSignature] = useState("");
  const [signatureError, setSignatureError] = useState(false);

  const [holdProgress, setHoldProgress] = useState(0);
  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [timeCapsuleMessage, setTimeCapsuleMessage] = useState("");
  const [punishmentApplied, setPunishmentApplied] = useState(false);

  const audioCtxRef = useRef<any>(null);

  useEffect(() => {
    const lastDateMs = parseInt(localStorage.getItem("lastCompletedMs") || "0");
    const currentMs = Date.now();
    
    if (lastDateMs > 0 && currentMs - lastDateMs > 172800000) {
      const currentWealth = parseInt(localStorage.getItem("totalWealth") || "0");
      if (currentWealth > 0) {
        const penalty = Math.floor(currentWealth * 0.05);
        localStorage.setItem("totalWealth", (currentWealth - penalty).toString());
        localStorage.setItem("streakCount", "0"); 
        setPunishmentApplied(true);
      }
    }

    const savedCapsule = localStorage.getItem("timeCapsuleText");
    const capsuleTime = parseInt(localStorage.getItem("timeCapsuleMs") || "0");
    if (savedCapsule && currentMs - capsuleTime > 172800000) {
      const daysAgo = Math.floor((currentMs - capsuleTime) / 86400000);
      setTimeCapsuleMessage(`قبل ${daysAgo} أيام، أنت أمرت بهذا: "${savedCapsule}"`);
    }

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
    setSessionWealth(parseInt(localStorage.getItem("currentSessionWealth") || "0"));

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

  const initAudioIfNeeded = () => {
    if (!audioCtxRef.current) {
      startBrainwaves();
    }
  };

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

  const playWealthChime = (type: 'wealth' | 'warp' | 'error' = 'wealth') => {
    try {
      if (!audioCtxRef.current) return;
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      if (type === 'error') {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      } else if (type === 'warp') {
        osc.type = "square";
        osc.frequency.setValueAtTime(50, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 3);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3.5);
      } else {
        osc.type = "sine";
        osc.frequency.setValueAtTime(2000 + Math.random() * 1000, ctx.currentTime);
        gain.gain.setValueAtTime(0.02, ctx.currentTime); 
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      }
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + (type === 'warp' ? 3.5 : 1));
    } catch (e) {}
  };

  const enterVoid = () => {
    initAudioIfNeeded();
    setSessionPhase("void");
  };

  const handlePointerDown = () => {
    initAudioIfNeeded();
    if (signature.trim() !== "جاسم راكان المطيري") {
      setSignatureError(true);
      setTimeout(() => setSignatureError(false), 2000);
      return;
    }
    setHoldProgress(1); 
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    holdIntervalRef.current = setInterval(() => {
      setHoldProgress((prev) => {
        if (prev >= 100) {
          clearInterval(holdIntervalRef.current!);
          executeFinalSeal();
          return 100;
        }
        return prev + 2.5; 
      });
    }, 100);
  };

  const handlePointerUp = () => {
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    if (holdProgress < 100) setHoldProgress(0); 
  };

  const executeFinalSeal = () => {
    const today = new Date().toDateString();
    const currentMs = Date.now();
    localStorage.setItem("lastCompletedDate", today);
    localStorage.setItem("lastCompletedMs", currentMs.toString());
    
    const sentences = script.split(/[.،]/);
    const longestSentence = sentences.reduce((a, b) => a.length > b.length ? a : b, "");
    if (longestSentence.trim().length > 10) {
      localStorage.setItem("timeCapsuleText", longestSentence.trim());
      localStorage.setItem("timeCapsuleMs", currentMs.toString());
    }

    const newStreak = streak + 1;
    setStreak(newStreak);
    localStorage.setItem("streakCount", newStreak.toString());

    const newWealth = accumulatedWealth + sessionWealth;
    setAccumulatedWealth(newWealth);
    localStorage.setItem("totalWealth", newWealth.toString());
    
    localStorage.setItem("currentSessionWealth", "0"); 
    setSessionWealth(0);
    localStorage.setItem("dailyScript", ""); 
    
    if (audioCtxRef.current) audioCtxRef.current.close(); 
    
    setSessionPhase("warp");
    playWealthChime('warp');
    
    setTimeout(() => {
      setSessionPhase("complete");
    }, 3500);
  };

  const handleScriptChange = (text: string) => {
    initAudioIfNeeded();
    setScript(text);
    localStorage.setItem("dailyScript", text);
    const words = text.split(/\s+/);
    const lastWord = words[words.length - 1] || "";

    const hasDoubt = doubtKeywords.some(keyword => lastWord.includes(keyword));
    if (hasDoubt) {
      setGlitchGlow(true);
      setLinguisticWarning("العقل الباطن يعيش في الحاضر فقط.. استبدل التمني والمستقبل بصيغة اليقين (أنا أملك الآن).");
      setSessionWealth(prev => {
        const newVal = Math.max(0, prev - 50);
        localStorage.setItem("currentSessionWealth", newVal.toString());
        return newVal;
      }); 
      playWealthChime('error');
      setTimeout(() => {
        setGlitchGlow(false);
        setLinguisticWarning("");
      }, 3000);
    } else {
      setSessionWealth(prev => {
        const newVal = prev + Math.floor(Math.random() * 41) + 10;
        localStorage.setItem("currentSessionWealth", newVal.toString());
        return newVal;
      }); 
      setTypingSpeed((prev) => Math.min(25, prev + 2)); 
      playWealthChime();
      
      if (powerKeywords.some(keyword => lastWord.includes(keyword))) {
        setGoldenGlow(true);
        setTimeout(() => setGoldenGlow(false), 800);
      }
    }
  };

  // 🌟 إدراج العبارة السريعة بنقرة واحدة (مثالية للجوال)
  const insertQuickPhrase = (phrase: string) => {
    initAudioIfNeeded();
    const updated = script ? `${script} ${phrase}` : phrase;
    handleScriptChange(updated);
  };

  const handleBurn = () => {
    initAudioIfNeeded();
    if (!negativeBelief.trim()) return;
    setIsBurning(true);
    setTimeout(() => {
      setNegativeBelief("");
      setIsBurning(false);
      setSessionWealth(prev => {
        const newVal = prev + 500;
        localStorage.setItem("currentSessionWealth", newVal.toString());
        return newVal;
      });
      setGoldenGlow(true);
      setTimeout(() => setGoldenGlow(false), 1000);
    }, 1200); 
  };

  const generateFromLibrary = () => {
    initAudioIfNeeded();
    const randomIndex = Math.floor(Math.random() * scriptsLibrary.length);
    handleScriptChange(scriptsLibrary[randomIndex]);
  };

  const speakScript = () => {
    initAudioIfNeeded();
    if (!script.trim()) return;
    window.speechSynthesis.cancel();
    
    const utteranceMain = new SpeechSynthesisUtterance(script);
    utteranceMain.lang = 'ar-SA'; 
    utteranceMain.rate = 0.85; 
    utteranceMain.pitch = 1;
    utteranceMain.volume = 1;

    const utteranceEcho = new SpeechSynthesisUtterance(script);
    utteranceEcho.lang = 'ar-SA'; 
    utteranceEcho.rate = 0.80; 
    utteranceEcho.pitch = 0.5; 
    utteranceEcho.volume = 0.15; 
    
    utteranceMain.onstart = () => setIsSpeaking(true);
    utteranceMain.onend = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utteranceMain);
    setTimeout(() => window.speechSynthesis.speak(utteranceEcho), 500);
  };

  const resetSessionForTesting = () => {
    localStorage.removeItem("lastCompletedDate");
    localStorage.removeItem("currentSessionWealth");
    setSessionWealth(0);
    setSignature("");
    setHoldProgress(0);
    setSessionPhase("work"); 
    setPunishmentApplied(false);
    setScript("");
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
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center p-6 cursor-pointer relative" onClick={() => setSessionPhase("work")}>
        <div className="w-32 h-32 rounded-full border-2 border-slate-800 flex items-center justify-center animate-[pulse_4s_ease-in-out_infinite] mt-20">
          <div className="w-16 h-16 rounded-full bg-slate-900/50 animate-[ping_4s_ease-in-out_infinite]"></div>
        </div>
        <p className="text-slate-500 mt-10 tracking-widest text-sm animate-pulse">خذ نفساً عميقاً لتفريغ عقلك...</p>
        <p className="text-slate-700 mt-4 text-xs">اضغط في أي مكان للعودة للعمل</p>
      </div>
    );
  }

  if (sessionPhase === "warp") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center overflow-hidden">
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes warpDrive {
            0% { transform: scale(1); opacity: 0; filter: blur(20px); }
            20% { opacity: 1; filter: blur(0px); }
            80% { transform: scale(15); opacity: 1; filter: blur(2px); }
            100% { transform: scale(50); opacity: 0; filter: blur(10px); }
          }
        `}} />
        <div className="text-emerald-500 font-black whitespace-nowrap text-5xl md:text-9xl tracking-tighter" style={{ animation: 'warpDrive 3.5s cubic-bezier(0.4, 0, 0.2, 1) forwards' }}>
          SAR 10,000,000
        </div>
      </div>
    );
  }

  if (sessionPhase === "sign") {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center p-6 relative overflow-hidden">
        <div 
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{ backgroundColor: `rgba(16, 185, 129, ${holdProgress / 400})`, opacity: holdProgress > 0 ? 1 : 0 }} 
        />
        <div className="bg-[#050505] border border-slate-800 p-10 rounded-3xl max-w-lg w-full relative z-10 shadow-2xl">
          <h2 className="text-2xl text-emerald-400 font-bold mb-4">ميثاق الوفرة</h2>
          <p className="text-slate-400 mb-8 text-sm leading-relaxed">
            أقر وأعترف بأن أهدافي المكتوبة تتجلى الآن في الواقع، وأن سيولة بقيمة <span className="text-emerald-500 font-bold">{sessionWealth} ريال</span> قد تمت إضافتها لطاقتي.
          </p>
          <input 
            type="text" 
            className={`w-full bg-slate-950 border-b-2 ${signatureError ? 'border-red-500 text-red-400' : 'border-slate-700 text-slate-200 focus:border-emerald-500'} px-4 py-4 outline-none text-xl text-center mb-10 transition-colors`}
            placeholder="اكتب اسمك الكامل للتوقيع"
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
          />
          {signatureError && <p className="text-red-500 text-xs mb-4 -mt-6">يجب كتابة اسمك الكامل (جاسم راكان المطيري) أولاً</p>}
          <div className="flex flex-col gap-4">
            <div className="relative h-16 w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-800 select-none">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-800 to-emerald-500 transition-all duration-100"
                style={{ width: `${holdProgress}%` }}
              />
              <button 
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                className="absolute inset-0 w-full h-full text-white font-bold tracking-widest z-10 flex items-center justify-center outline-none cursor-pointer"
              >
                {holdProgress > 0 ? (holdProgress >= 100 ? "تم الشحن..." : "استمر بالضغط لنقل طاقتك...") : "اضغط باستمرار للاعتماد 👆"}
              </button>
            </div>
            <button onClick={() => setSessionPhase("work")} className="w-full bg-transparent text-slate-500 hover:text-slate-300 py-3 text-sm transition-all">
              تراجع للوحة العمل
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (sessionPhase === "complete") {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center p-6 relative">
        <div className="text-7xl mb-8 animate-[bounce_2s_ease-in-out]">💎</div>
        <h1 className="text-4xl text-yellow-500 font-bold mb-4 tracking-widest">تم الختم والتجلي</h1>
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
        
        <button onClick={resetSessionForTesting} className="absolute bottom-10 text-slate-800 hover:text-slate-500 text-xs tracking-widest transition-colors border-b border-transparent hover:border-slate-500 pb-1 z-50">
          [ إعادة ضبط الجلسة للتجربة ]
        </button>
      </div>
    );
  }

  const blurAmount = Math.max(0, 15 - typingSpeed);

  return (
    <div className={`min-h-screen bg-black text-slate-300 font-sans flex flex-col p-4 md:p-10 transition-all duration-700 relative overflow-hidden ${goldenGlow ? 'shadow-[inset_0_0_150px_rgba(234,179,8,0.15)]' : ''} ${glitchGlow ? 'shadow-[inset_0_0_150px_rgba(220,38,38,0.3)] animate-pulse' : ''}`}>
      
      <button 
        onClick={resetSessionForTesting} 
        className="fixed bottom-3 left-3 z-50 bg-slate-900/50 hover:bg-slate-800 text-slate-500 hover:text-slate-300 text-[10px] px-2.5 py-1 rounded-full border border-slate-800 transition-all"
      >
        [ إعادة ضبط للتجربة ]
      </button>

      <div className="absolute top-2 left-0 w-full flex flex-col items-center gap-2 z-40 pointer-events-none px-4">
        {punishmentApplied && (
          <div className="animate-[pulse_2s_ease-in-out_infinite]">
            <p className="text-red-500 font-bold tracking-widest bg-red-900/20 px-4 py-1 rounded-full border border-red-900/50 text-[11px] text-center">
              ⚠️ تم خصم 5% من ثروتك التراكمية بسبب الغياب
            </p>
          </div>
        )}
        {timeCapsuleMessage && (
          <div className="opacity-70 max-w-lg">
            <p className="text-blue-400 font-light italic text-xs border-l-2 border-blue-900 pl-3 py-1 bg-black/60 rounded-r-lg text-center">
              {timeCapsuleMessage}
            </p>
          </div>
        )}
      </div>

      {showSubliminal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <span className="text-white text-6xl md:text-8xl font-black opacity-10">{subliminalWord}</span>
        </div>
      )}

      {linguisticWarning && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-red-900/90 text-red-100 px-4 py-2 rounded-xl border border-red-500 text-xs text-center shadow-[0_0_30px_rgba(220,38,38,0.5)] max-w-sm">
          ⚠️ {linguisticWarning}
        </div>
      )}

      {/* الشريط العلوي */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-6 mb-6 border-b border-slate-900 pb-4 gap-4 relative z-10">
        <h1 className="text-xl md:text-2xl font-bold text-slate-100 tracking-wider">
          برمجة الوفرة <span className="text-blue-500">|</span> Wealth Vision
        </h1>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800 shadow-inner">
            🔥 التزام: {streak}
          </span>
          
          <button onClick={enterVoid} className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border border-slate-700">
            🧘‍♂️ تفريغ العقل
          </button>
          
          <button onClick={generateFromLibrary} className="bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all shadow-[0_0_15px_rgba(147,51,234,0.3)]">
            توكيد مالي 💸
          </button>
          <button onClick={speakScript} className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)] ${isSpeaking ? 'bg-emerald-600' : 'bg-blue-600'}`}>
            {isSpeaking ? '🔊 جاري...' : 'التنويم 🔊'}
          </button>
        </div>
      </div>

      {/* 🌟 تبويبات مخصصة للشاشات الصغيرة (الجوال) لمنع التمرير الطويل */}
      <div className="flex md:hidden bg-slate-900/80 p-1 rounded-xl mb-4 border border-slate-800">
        <button 
          onClick={() => setActiveMobileTab("workspace")} 
          className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${activeMobileTab === 'workspace' ? 'bg-slate-800 text-yellow-500 shadow' : 'text-slate-400'}`}
        >
          ✍️ مساحة الكتابة
        </button>
        <button 
          onClick={() => setActiveMobileTab("dashboard")} 
          className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${activeMobileTab === 'dashboard' ? 'bg-slate-800 text-yellow-500 shadow' : 'text-slate-400'}`}
        >
          📊 المؤشرات والرؤية
        </button>
      </div>

      <div className="flex-grow flex flex-col md:flex-row gap-6 h-full relative z-10">
        
        {/* مساحة العمل (تظهر دائماً على الكمبيوتر، وتظهر على الجوال حسب التبويب) */}
        <div className={`w-full md:w-2/3 flex-col relative h-full ${activeMobileTab === 'workspace' ? 'flex' : 'hidden md:flex'}`}>
          <p className="text-slate-600 mb-2 text-xs md:text-sm font-medium">
            اكتب بلسان اليقين والمضارع لتزيل الضباب...
          </p>

          {/* 🌟 شريط الاختصارات السريعة للتوكيدات (مثالي للجوال لضغطات سريعة) */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-2 scrollbar-none">
            {quickPhrases.map((phrase, idx) => (
              <button
                key={idx}
                onClick={() => insertQuickPhrase(phrase)}
                className="whitespace-nowrap bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs px-3 py-1.5 rounded-full border border-slate-800 transition-all shadow-sm"
              >
                + {phrase}
              </button>
            ))}
          </div>

          <textarea
            className={`w-full flex-grow bg-[#080808] border border-slate-900 p-4 rounded-2xl outline-none resize-none text-lg md:text-3xl leading-relaxed placeholder-slate-700 text-slate-200 font-light transition-all duration-300 min-h-[220px] md:min-h-0 ${glitchGlow ? 'text-red-300 border-red-900' : ''}`}
            placeholder="أنا الآن أملك..."
            value={script}
            onChange={(e) => handleScriptChange(e.target.value)}
          />
          
          <div className="flex flex-col md:flex-row gap-4 mt-4 mb-2">
            <div className="flex-grow bg-red-950/20 border border-red-900/30 p-3 md:p-4 rounded-2xl">
              <h3 className="text-red-500/70 text-[11px] md:text-xs uppercase tracking-widest mb-2 font-bold">🔥 محرقة التحديات</h3>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  className="flex-grow bg-slate-950 border border-red-900/50 rounded-lg px-3 py-2 outline-none text-xs md:text-sm text-red-200"
                  placeholder="اكتب قلقاً واحرقه..."
                  value={negativeBelief}
                  onChange={(e) => setNegativeBelief(e.target.value)}
                />
                <button onClick={handleBurn} className="bg-red-900/50 hover:bg-red-800 text-red-100 px-4 py-2 rounded-lg text-xs border border-red-800/50">
                  احرق 💥
                </button>
              </div>
            </div>
            <button onClick={() => setSessionPhase("sign")} className="bg-gradient-to-r from-yellow-600 to-yellow-800 text-white font-bold px-6 py-3 rounded-2xl shadow-[0_0_20px_rgba(202,138,4,0.3)] transition-all hover:scale-105 text-sm md:text-base">
              ميثاق الختم 🔐
            </button>
          </div>
        </div>

        {/* المؤشرات ولوحة الرؤية (تظهر دائماً على الكمبيوتر، وتظهر على الجوال حسب التبويب) */}
        <div className={`w-full md:w-1/3 flex-col gap-4 ${activeMobileTab === 'dashboard' ? 'flex' : 'hidden md:flex'}`}>
          <div className={`bg-[#050505] rounded-2xl p-4 md:p-5 shadow-lg border border-emerald-900/30 flex justify-between items-center relative overflow-hidden transition-all duration-300 ${glitchGlow ? 'border-red-900' : ''}`}>
             <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/10 to-transparent"></div>
            <div className="relative z-10">
              <h3 className="text-emerald-600/70 text-[11px] md:text-xs uppercase tracking-widest mb-1 font-bold">سيولة الجلسة الحالية</h3>
              <div className={`text-2xl md:text-3xl font-extrabold tracking-tight transition-all duration-300 ease-out ${glitchGlow ? 'text-red-500' : 'text-emerald-400'}`}>
                +{sessionWealth} <span className="text-xs md:text-sm font-normal text-emerald-700">SAR</span>
              </div>
            </div>
            <div className="text-3xl md:text-4xl relative z-10">⌨️</div>
          </div>
          
          <div className="bg-[#050505] rounded-2xl p-4 md:p-5 shadow-lg border border-slate-900 flex justify-between items-center">
            <div>
              <h3 className="text-slate-500 text-[11px] md:text-xs uppercase tracking-widest mb-1">الرصيد التراكمي المبرمج</h3>
              <div className="text-xl md:text-2xl font-extrabold text-emerald-500 tracking-tight">SAR {accumulatedWealth}</div>
            </div>
            <div className="text-3xl">🏦</div>
          </div>

          <div className="bg-[#050505] rounded-2xl p-4 md:p-5 border border-yellow-900/50 flex justify-between items-center relative overflow-hidden shadow-[0_0_30px_rgba(202,138,4,0.15)]">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-900/10 to-transparent"></div>
            <div className="relative z-10">
              <h3 className="text-yellow-600/70 text-[11px] md:text-xs uppercase tracking-widest mb-1 font-bold">صافي الثروة المستهدف</h3>
              <div className="text-2xl md:text-3xl font-extrabold text-yellow-500 tracking-tight">SAR 10,000,000</div>
            </div>
            <div className="text-3xl md:text-4xl relative z-10">💎</div>
          </div>

          <div 
            className="flex-grow rounded-2xl bg-[#111] border border-slate-800 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden transition-all duration-300 min-h-[140px]"
            style={{ filter: `blur(${blurAmount}px)` }}
          >
            <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-900 rounded-full mb-3 flex items-center justify-center text-xl md:text-2xl z-10">📊</div>
            <p className="text-slate-400 text-xs md:text-sm z-10">
              <span className="text-slate-200 font-bold block mb-1">الرؤية تتضح بالعمل</span>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
