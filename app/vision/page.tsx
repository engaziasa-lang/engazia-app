"use client";
import { useState, useEffect, useRef } from 'react';

const scriptsLibrary = [
  "أنا الآن أستقبل تدفقاً نقدياً مستمراً من اشتراكات منصة إنجازيا. إيراداتي الشهرية تتجاوز 100 ألف ريال وتنمو باستمرار وبكل سهولة.",
  "صافي ثروتي يتضاعف كل عام. أنا أدير أعمالي الرقمية ومكتبي بذكاء، وأحقق عائداً سنوياً يفوق المليون ريال وأستمتع بالحرية المالية المطلقة.",
  "عقلي الباطن مبرمج على الوفرة واستقطاب المال. كل أداة أطلقها تتحول إلى مصدر دخل سلبي مستدام يرفع من إجمالي ثروتي وتدفقاتي النقدية."
];

const subliminalWords = ["وفرة", "SAR 10,000,000", "نجاح", "تدفق نقدي", "إنجازيا"];
const powerKeywords = ["مليون", "ثروة", "وفرة", "إنجازيا", "نجاح", "أرباح", "100 ألف"];
// 🌟 الكلمات الممنوعة التي تدل على الشك والتمني المستقبل
const doubtKeywords = ["أتمنى", "سوف", "أحاول", "لعل", "ربما", "عسى", "ممكن", "يارب"];

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
  
  // 🌟 حالات فلتر اليقين اللغوي
  const [glitchGlow, setGlitchGlow] = useState(false);
  const [linguisticWarning, setLinguisticWarning] = useState("");
  
  const [typingSpeed, setTypingSpeed] = useState(0);
  const [negativeBelief, setNegativeBelief] = useState("");
  const [isBurning, setIsBurning] = useState(false);

  // void -> tune -> work -> sign -> warp -> complete
  const [sessionPhase, setSessionPhase] = useState("void");
  const [tuneValue, setTuneValue] = useState(0);
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
      setTimeCapsuleMessage(`قبل ${daysAgo} أيام، أنت أمرت بهذا: "${savedCapsule}"`); }  const lastDate = localStorage.getItem("lastCompletedDate"); const today = new Date().toDateString(); if (lastDate === today) { setSessionPhase("complete"); }  const currentHour = new Date().getHours(); if (currentHour >= 3 && currentHour < 9) { setIsLocked(false); } else { setIsLocked(true); const now = new Date(); let target = new Date(); if (currentHour >= 9) target.setDate(target.getDate() + 1); target.setHours(3, 0, 0, 0); const diff = Math.floor((target.getTime() - now.getTime()) / (1000 * 60 * 60)); setTimeRemaining(`يفتح بعد ${diff} ساعة`);
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

  const finishVoid = () => {
    startBrainwaves();
    setSessionPhase("tune");
  };

  const handleTune = (e: any) => {
    const val = parseInt(e.target.value);
    setTuneValue(val);
    if (val === 888) {
      setGoldenGlow(true);
      playWealthChime();
      setTimeout(() => {
        setGoldenGlow(false);
        setSessionPhase("work");
      }, 1500);
    }
  };

  const handlePointerDown = () => {
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

  // 🌟 تنفيذ الختم والقفزة المرئية
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
    localStorage.setItem("dailyScript", ""); 
    
    if (audioCtxRef.current) audioCtxRef.current.close(); 
    
    // إطلاق القفزة المرئية
    setSessionPhase("warp");
    playWealthChime('warp');
    
    setTimeout(() => {
      setSessionPhase("complete");
    }, 3500);
  };

  const handleScriptChange = (text: string) => {
    setScript(text);
    localStorage.setItem("dailyScript", text);
    const words = text.split(/\s+/);
    const lastWord = words[words.length - 1] || "";

    // 🌟 1. فلتر اليقين اللغوي
    const hasDoubt = doubtKeywords.some(keyword => lastWord.includes(keyword));
    if (hasDoubt) {
      setGlitchGlow(true);
      setLinguisticWarning("العقل الباطن يعيش في الحاضر فقط.. استبدل التمني والمستقبل بصيغة اليقين (أنا أملك الآن).");
      setSessionWealth(prev => Math.max(0, prev - 50)); // ضريبة الشك
      playWealthChime('error');
      setTimeout(() => {
        setGlitchGlow(false);
        setLinguisticWarning("");
      }, 3000);
    } else {
      setSessionWealth(prev => prev + Math.floor(Math.random() * 41) + 10); 
      setTypingSpeed((prev) => Math.min(25, prev + 2)); 
      playWealthChime();
      
      if (powerKeywords.some(keyword => lastWord.includes(keyword))) {
        setGoldenGlow(true);
        setTimeout(() => setGoldenGlow(false), 800);
      }
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

  // 🌟 2. صدى التنويم العميق (مزدوج)
  const speakScript = () => {
    if (!script.trim()) return;
    window.speechSynthesis.cancel();
    
    // الصوت الرئيسي (الواعي)
    const utteranceMain = new SpeechSynthesisUtterance(script);
    utteranceMain.lang = 'ar-SA'; 
    utteranceMain.rate = 0.85; 
    utteranceMain.pitch = 1;
    utteranceMain.volume = 1;

    // الصوت اللاشعوري (الصدى العميق المتأخر)
    const utteranceEcho = new SpeechSynthesisUtterance(script);
    utteranceEcho.lang = 'ar-SA'; 
    utteranceEcho.rate = 0.80; 
    utteranceEcho.pitch = 0.5; // أعمق
    utteranceEcho.volume = 0.15; // خافت جداً
    
    utteranceMain.onstart = () => setIsSpeaking(true);
    utteranceMain.onend = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utteranceMain);
    setTimeout(() => window.speechSynthesis.speak(utteranceEcho), 500);
  };

  const resetSessionForTesting = () => {
    localStorage.removeItem("lastCompletedDate");
    setSessionWealth(0);
    setSignature("");
    setHoldProgress(0);
    setTuneValue(0);
    setSessionPhase("void");
    setPunishmentApplied(false);
  };

  // ==================== الشاشات ====================

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
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center p-6 cursor-pointer relative" onClick={finishVoid}>
        {punishmentApplied && (
          <div className="absolute top-10 w-full text-center animate-[pulse_2s_ease-in-out_infinite]">
            <p className="text-red-500 font-bold tracking-widest bg-red-900/20 inline-block px-6 py-2 rounded-full border border-red-900/50">
              ⚠️ تم خصم 5% من ثروتك التراكمية وتصفير العداد بسبب الغياب المستمر
            </p>
          </div>
        )}
        {timeCapsuleMessage && (
          <div className="absolute top-32 w-full max-w-2xl px-6 text-center opacity-70">
            <p className="text-blue-400 font-light italic leading-relaxed text-lg border-l-2 border-blue-900 pl-4 py-2">
              {timeCapsuleMessage}
            </p>
          </div>
        )}
        <div className="w-32 h-32 rounded-full border-2 border-slate-800 flex items-center justify-center animate-[pulse_4s_ease-in-out_infinite] mt-20">
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

  // 🌟 3. قفزة التجلي المرئية (Warp Phase)
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
          style={{ backgroundColor: `rgba(1
