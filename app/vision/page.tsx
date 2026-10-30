"use client";
import { useState, useEffect, useRef } from 'react';

const scriptsLibrary = [
  "أنا الآن أستقبل تدفقاً نقدياً مستمراً من اشتراكات منصة إنجازيا. إيراداتي الشهرية تتجاوز 100 ألف ريال وتنمو باستمرار وبكل سهولة.",
  "صافي ثروتي يتضاعف كل عام. أنا أدير أعمالي الرقمية ومكتبي بذكاء، وأحقق عائداً سنوياً يفوق المليون ريال وأستمتع بالحرية المالية المطلقة.",
  "عقلي الباطن مبرمج على الوفرة واستقطاب المال. كل أداة أطلقها تتحول إلى مصدر دخل سلبي مستدام يرفع من إجمالي ثروتي وتدفقاتي النقدية."
];

// الكلمات التي تلتقطها العين اللاشعورية
const subliminalWords = ["وفرة", "SAR 10,000,000", "نجاح", "تدفق نقدي", "إنجازيا"];
// الكلمات المفتاحية التي تفعل التوهج الذهبي عند طباعتها
const powerKeywords = ["مليون", "ثروة", "وفرة", "إنجازيا", "نجاح", "أرباح", "100 ألف"];

export default function PremiumVisionBoard() {
  const [script, setScript] = useState("");
  const [streak, setStreak] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const [isLocked, setIsLocked] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState("");
  const [sessionWealth, setSessionWealth] = useState(0);

  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 🌟 حالات الابتكارات الجديدة
  const [subliminalWord, setSubliminalWord] = useState("");
  const [showSubliminal, setShowSubliminal] = useState(false);
  const [goldenGlow, setGoldenGlow] = useState(false);

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

    // 🌟 ميزة الومضات اللاشعورية (Subliminal Flasher)
    const subliminalInterval = setInterval(() => {
      const randomWord = subliminalWords[Math.floor(Math.random() * subliminalWords.length)];
      setSubliminalWord(randomWord);
      setShowSubliminal(true);
      
      // إخفاء الكلمة بعد 40 جزء من الثانية فقط (لا تدركها العين الواعية)
      setTimeout(() => {
        setShowSubliminal(false);
      }, 40);
    }, 15000); // تظهر كل 15 ثانية

    return () => clearInterval(subliminalInterval);
  }, []);

  const handleScriptChange = (text: string) => {
    setScript(text);
    localStorage.setItem("dailyScript", text);
    setSessionWealth(prev => prev + Math.floor(Math.random() * 41) + 10); 

    // 🌟 ميزة التوهج الذهبي للكلمات المفتاحية
    const lastWord = text.split(/\s+/).pop() || "";
    if (powerKeywords.some(keyword => lastWord.includes(keyword))) {
      setGoldenGlow(true);
      setTimeout(() => setGoldenGlow(false), 800);
    }

    setIsTyping(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 3000);
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

  return (
    <div className={`min-h-screen bg-black text-slate-300 font-sans flex flex-col p-6 md:p-10 transition-all duration-700 relative ${goldenGlow ? 'shadow-[inset_0_0_150px_rgba(234,179,8,0.15)]' : ''}`}>
      
      {/* 🌟 شاشة الومضة اللاشعورية المخفية */}
      {showSubliminal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <span className="text-white text-8xl font-black opacity-10">{subliminalWord}</span>
        </div>
      )}

      <audio src="/focus-audio.mp3" autoPlay loop muted={false} className="hidden" />

      <div className={`flex justify-between items-center mb-10 border-b border-slate-900 pb-4 transition-opacity duration-1000 ${isTyping ? 'opacity-0' : 'opacity-100'}`}>
        <h1 className="text-2xl font-bold text-slate-100 tracking-wider">
          برمجة الوفرة <span className="text-blue-500">|</span> Wealth Vision
        </h1>
        <div className="flex items-center gap-3">
          <span className="text-sm bg-slate-900 px-4 py-2 rounded-full border border-slate-800 shadow-inner">
            🔥 التزام: {streak}
          </span>
          <button 
            onClick={generateFromLibrary}
            className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-[0_0_15px_rgba(147,51,234,0.3)]"
          >
            توكيد مالي 💸
          </button>
          <button 
            onClick={speakScript}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)] ${isSpeaking ? 'bg-emerald-600' : 'bg-blue-600'}`}
          >
            {isSpeaking ? '🔊 جاري النطق...' : 'تشغيل الصوت 🔊'}
          </button>
        </div>
      </div>

      <div className="flex-grow flex flex-col md:flex-row gap-10">
        <div className="w-full md:w-2/3 flex flex-col relative h-full">
          <p className={`text-slate-600 mb-4 text-sm font-medium absolute -top-6 transition-opacity duration-1000 ${isTyping ? 'opacity-0' : 'opacity-100'}`}>
            استمع للتوكيدات.. واكتب بثقة لترتفع سيولة الجلسة...
          </p>
          <textarea
            className="w-full flex-grow bg-transparent border-none outline-none resize-none text-xl md:text-3xl leading-relaxed placeholder-slate-900 text-slate-300 mt-2 font-light"
            placeholder="اكتب أهدافك هنا..."
            value={script}
            onChange={(e) => handleScriptChange(e.target.value)}
          />
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
              <h3 className="text-slate-500 text-xs uppercase tracking-widest mb-1">الإيرادات السنوية</h3>
              <div className="text-2xl font-extrabold text-blue-400 tracking-tight">SAR 1,200,000</div>
            </div>
            <div className="text-3xl">🚀</div>
          </div>

          {/* 🌟 ميزة نبض التنفس البصري (موجات ثيتا) */}
          {/* ستلاحظ أن ظل هذا الصندوق يتمدد وينكمش ببطء شديد كل 8 ثوانٍ */}
          <div className="bg-[#050505] rounded-2xl p-5 border border-yellow-900/50 flex justify-between items-center relative overflow-hidden animate-[pulse_8s_ease-in-out_infinite] shadow-[0_0_30px_rgba(202,138,4,0.15)]">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-900/10 to-transparent"></div>
            <div className="relative z-10">
              <h3 className="text-yellow-600/70 text-xs uppercase tracking-widest mb-1 font-bold">صافي الثروة المستهدف</h3>
              <div className="text-3xl font-extrabold text-yellow-500 tracking-tight">SAR 10,000,000</div>
            </div>
            <div className="text-4xl relative z-10">💎</div>
          </div>
          
          <div className="flex-grow rounded-2xl bg-[#050505] border border-slate-900 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden group min-h-[150px]">
            <div className="w-16 h-16 bg-slate-900 rounded-full mb-4 flex items-center justify-center text-2xl">📊</div>
            <p className="text-slate-400 text-sm">
              <span className="text-slate-300 font-bold block mb-1">لوحة الرؤية</span>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
