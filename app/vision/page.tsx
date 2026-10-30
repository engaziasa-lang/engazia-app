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

  // 🌟 حالات الابتكارات الجديدة
  const [isTuned, setIsTuned] = useState(false);
  const [tuneValue, setTuneValue] = useState(0);
  const [isSessionCompleted, setIsSessionCompleted] = useState(false);

  useEffect(() => {
    // التحقق من تاريخ آخر جلسة مكتملة
    const lastDate = localStorage.getItem("lastCompletedDate");
    const today = new Date().toDateString();
    if (lastDate === today) {
      setIsSessionCompleted(true);
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
      const randomWord = subliminalWords[Math.floor(Math.random() * subliminalWords.length)];
      setSubliminalWord(randomWord);
      setShowSubliminal(true);
      setTimeout(() => setShowSubliminal(false), 40);
    }, 15000);

    const blurInterval = setInterval(() => {
      setTypingSpeed((prev) => Math.max(0, prev - 1));
    }, 500);

    return () => {
      clearInterval(subliminalInterval);
      clearInterval(blurInterval);
    };
  }, []);

  const playWealthChime = (highFreq = false) => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
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

  // 🌟 موالف النية
  const handleTune = (e: any) => {
    const val = parseInt(e.target.value);
    setTuneValue(val);
    if (val === 888 && !isTuned) {
      setIsTuned(true);
      setGoldenGlow(true);
      playWealthChime(true);
      setTimeout(() => setGoldenGlow(false), 1500);
    }
  };

  // 🌟 ختم الجلسة
  const sealSession = () => {
    const today = new Date().toDateString();
    localStorage.setItem("lastCompletedDate", today);
    
    const newStreak = streak + 1;
    setStreak(newStreak);
    localStorage.setItem("streakCount", newStreak.toString());

    const newWealth = accumulatedWealth + sessionWealth;
    setAccumulatedWealth(newWealth);
    localStorage.setItem("totalWealth", newWealth.toString());

    localStorage.setItem("dailyScript", ""); // تفريغ النص للغد
    
    playWealthChime(true);
    setIsSessionCompleted(true);
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

  if (isSessionCompleted) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center p-6">
        <div className="text-6xl mb-6">💎</div>
        <h1 className="text-3xl text-yellow-500 font-bold mb-2 tracking-widest">تم الختم بنجاح</h1>
        <p className="text-slate-400 text-lg mb-8">أهدافك تترسخ في العقل الباطن وتتجلى في الواقع. استمتع بيومك.</p>
        <div className="flex gap-6">
          <div className="text-center">
            <p className="text-slate-500 text-sm mb-1">أيام الالتزام</p>
            <p className="text-2xl font-bold text-slate-200">🔥 {streak}</p>
          </div>
          <div className="text-center">
            <p className="text-slate-500 text-sm mb-1">ثروتك التراكمية المبرمجة</p>
            <p className="text-2xl font-bold text-emerald-400">SAR {accumulatedWealth}</p>
          </div>
        </div>
      </div>
    );
  }

  const blurAmount = Math.max(0, 15 - typingSpeed);

  return (
    <div className={`min-h-screen bg-black text-slate-300 font-sans flex flex-col p-6 md:p-10 transition-all duration-700 relative overflow-hidden ${goldenGlow ? 'shadow-[inset_0_0_150px_rgba(234,179,8,0.15)]' : ''}`}>
      
      {/* 🌟 شرارة التدفق (تظهر فقط عند الكتابة السريعة) */}
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

      <audio src="/focus-audio.mp3" autoPlay loop muted={false} className="hidden" />

      <div className={`flex justify-between items-center mb-8 border-b border-slate-900 pb-4 relative z-10 transition-opacity duration-1000 ${isTyping ? 'opacity-0' : 'opacity-100'}`}>
        <h1 className="text-2xl font-bold text-slate-100 tracking-wider">
          برمجة الوفرة <span className="text-blue-500">|</span> Wealth Vision
        </h1>
        <div className="flex items-center gap-3">
          <span className="text-sm bg-slate-900 px-4 py-2 rounded-full border border-slate-800 shadow-inner">
            🔥 التزام: {streak}
          </span>
          <button onClick={generateFromLibrary} disabled={!isTuned} className="bg-purple-600 disabled:opacity-30 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-[0_0_15px_rgba(147,51,234,0.3)]">
            توكيد مالي 💸
          </button>
          <button onClick={speakScript} disabled={!isTuned} className={`px-5 py-2 rounded-lg text-sm font-medium transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)] ${isSpeaking ? 'bg-emerald-600' : 'bg-blue-600'} disabled:opacity-30`}>
            {isSpeaking ? '🔊 جاري النطق...' : 'تشغيل الصوت 🔊'}
          </button>
        </div>
      </div>

      <div className="flex-grow flex flex-col md:flex-row gap-10 h-full relative z-10">
        
        <div className="w-full md:w-2/3 flex flex-col relative h-full">
          
          {/* 🌟 موالف النية (يختفي بعد الضبط) */}
          {!isTuned ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm z-20 rounded-2xl border border-slate-800">
              <h3 className="text-xl text-yellow-500 mb-6 tracking-widest font-bold">اضبط تردد النية للبدء</h3>
              <div className="text-5xl font-black text-slate-700 mb-8">{tuneValue}</div>
              <input 
                type="range" min="0" max="1000" value={tuneValue} onChange={handleTune}
                className="w-2/3 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-yellow-500"
              />
              <p className="text-slate-500 text-sm mt-6">ابحث عن التردد 888 لفتح الجلسة</p>
            </div>
          ) : (
            <>
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

                {/* 🌟 زر ختم الجلسة */}
                <button onClick={sealSession} className={`bg-gradient-to-r from-yellow-600 to-yellow-800 text-white font-bold px-8 rounded-2xl shadow-[0_0_20px_rgba(202,138,4,0.3)] transition-all duration-1000 ${isTyping ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:scale-105'}`}>
                  ختم الجلسة 🔐
                </button>
              </div>
            </>
          )}
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
