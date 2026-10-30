"use client";
import { useState, useEffect, useRef } from 'react';

export default function VisionBoard() {
  const [script, setScript] = useState("");
  const [streak, setStreak] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
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

  // محرك التوليد الآلي عبر Gemini API (مجاني)
  const generateAutoScript = async () => {
    setIsGenerating(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      
      if (!apiKey) {
        alert("الرجاء إضافة مفتاح Gemini API في ملف .env.local");
        setIsGenerating(false);
        return;
      }

      // الأمر البرمجي المخصص لأهدافك (الـ Prompt)
      const prompt = "اكتب لي توكيداً مالياً يومياً جديداً وقوياً يبرمج عقلي الباطن على الثراء والنمو. ركز على: مضاعفة الاشتراكات الشهرية في منصة إنجازيا للحلول المالية والرقمية، وامتلاك أراضي استثمارية في طريق المطار وحي وعيرة بالمدينة المنورة، وتحقيق إيرادات تتجاوز 100 ألف ريال. اجعله في فقرة واحدة قصيرة ومحفزة جداً بصيغة المتكلم (أنا الآن...). لا تستخدم مقدمات أو خاتمات.";

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      const data = await response.json();
      const generatedText = data.candidates[0].content.parts[0].text;

      handleScriptChange(generatedText);
    } catch (error) {
      console.error("خطأ في توليد النص:", error);
      alert("حدث خطأ أثناء التوليد، تأكد من اتصالك بالإنترنت وصلاحية المفتاح.");
    }
    setIsGenerating(false);
  };

  const speakScript = () => {
    if (!script.trim()) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(script);
    utterance.lang = 'ar-SA'; 
    utterance.rate = 0.9; 
    utterance.pitch = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-black text-slate-300 font-sans flex flex-col p-6 md:p-10 transition-colors duration-700">
      
      <div className={`flex justify-between items-center mb-10 border-b border-slate-900 pb-4 transition-opacity duration-1000 ${isTyping ? 'opacity-0' : 'opacity-100'}`}>
        <h1 className="text-2xl font-bold text-slate-100 tracking-wider">
          برمجة العقل المالي <span className="text-blue-500">|</span> Vision
        </h1>
        <div className="flex items-center gap-3">
          <span className="text-sm bg-slate-900 px-4 py-2 rounded-full border border-slate-800 shadow-inner">
            🔥 أيام الالتزام: {streak}
          </span>
          
          {/* زر التوليد الآلي الجديد */}
          <button 
            onClick={generateAutoScript}
            disabled={isGenerating}
            className="bg-purple-600 hover:bg-purple-500 disabled:bg-purple-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-[0_0_15px_rgba(147,51,234,0.3)]"
          >
            {isGenerating ? '⏳ جاري التفكير...' : 'توليد التوجيه اليومي 🤖'}
          </button>

          <button 
            onClick={speakScript}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)] ${
              isSpeaking ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'
            }`}
          >
            {isSpeaking ? '🔊 جاري النطق...' : 'تشغيل الصوت 🔊'}
          </button>
        </div>
      </div>

      <div className="flex-grow flex flex-col md:flex-row gap-10">
        <div className="w-full md:w-2/3 flex flex-col relative">
          <p className={`text-slate-600 mb-4 text-sm font-medium absolute -top-6 transition-opacity duration-1000 ${isTyping ? 'opacity-0' : 'opacity-100'}`}>
            اضغط على "توليد التوجيه اليومي" ليقوم الذكاء الاصطناعي بكتابة أهدافك فوراً.
          </p>
          <textarea
            className="w-full flex-grow bg-transparent border-none outline-none resize-none text-xl md:text-2xl leading-relaxed placeholder-slate-900 text-slate-300 mt-2"
            placeholder="سيتم كتابة التوجيه المالي هنا آلياً..."
            value={script}
            onChange={(e) => handleScriptChange(e.target.value)}
          />
        </div>

        <div className={`w-full md:w-1/3 flex flex-col gap-6 transition-opacity duration-1000 ${isTyping ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div className="bg-[#050505] rounded-2xl p-6 shadow-2xl border border-slate-900">
            <h3 className="text-slate-500 text-xs uppercase tracking-widest mb-2">الإيرادات الشهرية المستهدفة</h3>
            <div className="text-4xl font-extrabold text-emerald-400 tracking-tight">
              SAR 100,000<span className="text-lg text-slate-700 font-normal">/mo</span>
            </div>
          </div>
          
          <div className="flex-grow rounded-2xl bg-[#050505] border border-slate-900 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden group">
            <div className="w-16 h-16 bg-slate-900 rounded-full mb-4 flex items-center justify-center group-hover:scale-110 transition-transform text-2xl">
              🏢
            </div>
            <p className="text-slate-400 text-sm">
              <span className="text-slate-300 font-bold block mb-1">مخططات طريق المطار وحي وعيرة</span>
              مساحة مخصصة لعرض صور الأراضي الاستثمارية.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
