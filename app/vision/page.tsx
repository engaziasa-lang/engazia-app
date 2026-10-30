"use client";
import { useState, useEffect, useRef } from 'react';

// ==========================================
// 📚 مكتبة التوكيدات المالية الباطنية (بدون عقارات)
// ==========================================
const scriptsLibrary = [
  "أنا الآن أستقبل تدفقاً نقدياً مستمراً من اشتراكات منصة إنجازيا. إيراداتي الشهرية تتجاوز 100 ألف ريال وتنمو باستمرار وبكل سهولة.",
  "صافي ثروتي يتضاعف كل عام. أنا أدير أعمالي الرقمية ومكتبي بذكاء، وأحقق عائداً سنوياً يفوق المليون ريال وأستمتع بالحرية المالية المطلقة.",
  "عقلي الباطن مبرمج على الوفرة واستقطاب المال. كل أداة أطلقها تتحول إلى مصدر دخل سلبي مستدام يرفع من إجمالي ثروتي وتدفقاتي النقدية.",
  "أنا مغناطيس للمال والفرص المربحة. دخلي الشهري في ازدياد مستمر، وحساباتي البنكية تعكس نجاحي المالي وثروتي المتراكمة يومياً.",
  "أحقق أهدافي المالية السنوية قبل موعدها بكل يسر. أرباحي تتزايد، وصافي ثروتي ينمو بشكل آلي ومستمر، والمال يأتيني من مصادر متعددة."
];

export default function VisionBoard() {
  const [script, setScript] = useState("");
  const [streak, setStreak] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const savedScript = localStorage.getItem("dailyScript") || "";
    const savedStreak = localStorage.getItem("streakCount") || "0";
    setScript(savedScript);
    setStreak(parseInt(savedStreak));
  }, []);

  const handleScriptChange = (text: string) => {
    setScript(text);
    localStorage.setItem("dailyScript", text);

    setIsTyping(true);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 3000);
  };

  const generateFromLibrary = () => {
    const randomIndex = Math.floor(Math.random() * scriptsLibrary.length);
    const selectedScript = scriptsLibrary[randomIndex];
    handleScriptChange(selectedScript);
  };

  const speakScript = () => {
    if (!script.trim()) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(script);
    utterance.lang = 'ar-SA'; 
    utterance.rate = 0.85; // تم إبطاء السرعة قليلاً لتعزيز البرمجة العقلية
    utterance.pitch = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-black text-slate-300 font-sans flex flex-col p-6 md:p-10 transition-colors duration-700 relative">
      
      {/* مشغل الصوت المحيطي المخفي (يعمل تلقائياً كخلفية لبرمجة العقل) */}
      {/* أضف ملف صوتي باسم focus-audio.mp3 في مجلد public ليعمل باستمرار */}
      <audio src="/focus-audio.mp3" autoPlay loop muted={false} className="hidden" />

      <div className={`flex justify-between items-center mb-10 border-b border-slate-900 pb-4 transition-opacity duration-1000 ${isTyping ? 'opacity-0' : 'opacity-100'}`}>
        <h1 className="text-2xl font-bold text-slate-100 tracking-wider">
          برمجة الوفرة المالية <span className="text-blue-500">|</span> Wealth Vision
        </h1>
        <div className="flex items-center gap-3">
          <span className="text-sm bg-slate-900 px-4 py-2 rounded-full border border-slate-800 shadow-inner">
            🔥 أيام الالتزام: {streak}
          </span>
          
          <button 
            onClick={generateFromLibrary}
            className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-[0_0_15px_rgba(147,51,234,0.3)]"
          >
            توليد توكيد مالي 💸
          </button>

          <button 
            onClick={speakScript}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)] ${
              isSpeaking ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'
            }`}
          >
            {isSpeaking ? '🔊 جاري البرمجة الصوتية...' : 'تشغيل الصوت 🔊'}
          </button>
        </div>
      </div>

      <div className="flex-grow flex flex-col md:flex-row gap-10">
        
        {/* مساحة التوكيدات */}
        <div className="w-full md:w-2/3 flex flex-col relative">
          <p className={`text-slate-600 mb-4 text-sm font-medium absolute -top-6 transition-opacity duration-1000 ${isTyping ? 'opacity-0' : 'opacity-100'}`}>
            استمع للتوكيدات وتخيل الأرقام تتحقق الآن...
          </p>
          <textarea
            className="w-full flex-grow bg-transparent border-none outline-none resize-none text-xl md:text-3xl leading-relaxed placeholder-slate-900 text-slate-300 mt-2 font-light"
            placeholder="سيتم كتابة التوكيد المالي هنا آلياً..."
            value={script}
            onChange={(e) => handleScriptChange(e.target.value)}
          />
        </div>

        {/* لوحة المؤشرات المالية وصافي الثروة */}
        <div className={`w-full md:w-1/3 flex flex-col gap-4 transition-opacity duration-1000 ${isTyping ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          
          {/* الدخل الشهري */}
          <div className="bg-[#050505] rounded-2xl p-5 shadow-lg border border-slate-900 flex justify-between items-center">
            <div>
              <h3 className="text-slate-500 text-xs uppercase tracking-widest mb-1">الدخل الشهري المتكرر</h3>
              <div className="text-2xl font-extrabold text-emerald-400 tracking-tight">SAR 100,000</div>
            </div>
            <div className="text-3xl">📈</div>
          </div>

          {/* الدخل السنوي */}
          <div className="bg-[#050505] rounded-2xl p-5 shadow-lg border border-slate-900 flex justify-between items-center">
            <div>
              <h3 className="text-slate-500 text-xs uppercase tracking-widest mb-1">الإيرادات السنوية</h3>
              <div className="text-2xl font-extrabold text-blue-400 tracking-tight">SAR 1,200,000</div>
            </div>
            <div className="text-3xl">🚀</div>
          </div>

          {/* صافي الثروة */}
          <div className="bg-[#050505] rounded-2xl p-5 shadow-lg border border-yellow-900/30 flex justify-between items-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-900/10 to-transparent"></div>
            <div className="relative z-10">
              <h3 className="text-yellow-600/70 text-xs uppercase tracking-widest mb-1 font-bold">صافي الثروة المستهدف</h3>
              <div className="text-3xl font-extrabold text-yellow-500 tracking-tight">SAR 10,000,000</div>
            </div>
            <div className="text-4xl relative z-10">💎</div>
          </div>
          
          {/* مساحة الصور المالية البصرية */}
          <div className="flex-grow rounded-2xl bg-[#050505] border border-slate-900 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden group min-h-[200px]">
            {/* يمكنك استبدال هذا الديف بصورة فعلية <img src="/wealth-chart.jpg" className="absolute inset-0 w-full h-full object-cover opacity-50" /> */}
            <div className="w-16 h-16 bg-slate-900 rounded-full mb-4 flex items-center justify-center group-hover:scale-110 transition-transform text-2xl">
              📊
            </div>
            <p className="text-slate-400 text-sm">
              <span className="text-slate-300 font-bold block mb-1">لوحة الرؤية المالية</span>
              أضف هنا صوراً لرسوم بيانية صاعدة، أرصدة بنكية، أو رموز للسيولة المالية.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
