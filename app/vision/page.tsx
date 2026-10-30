"use client";
import { useState, useEffect } from 'react';

export default function VisionBoard() {
  const [script, setScript] = useState("");
  const [streak, setStreak] = useState(0);

  // استرجاع البيانات المحفوظة محلياً (مجاني وبدون قاعدة بيانات سحابية)
  useEffect(() => {
    const savedScript = localStorage.getItem("dailyScript") || "";
    const savedStreak = localStorage.getItem("streakCount") || "0";
    setScript(savedScript);
    setStreak(parseInt(savedStreak));
  }, []);

  // الحفظ التلقائي أثناء الكتابة السريعة
  const handleScriptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setScript(text);
    localStorage.setItem("dailyScript", text);
  };

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-slate-300 font-sans flex flex-col p-6 md:p-10">
      
      {/* الشريط العلوي - العدادات والتحكم */}
      <div className="flex justify-between items-center mb-10 border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-slate-100 tracking-wider">
          برمجة العقل المالي <span className="text-blue-500">|</span> Vision
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-sm bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700 shadow-inner">
            🔥 أيام الالتزام: {streak}
          </span>
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg text-sm font-medium transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)]">
            تشغيل التوجيه الصوتي 🔊
          </button>
        </div>
      </div>

      {/* مساحة العمل الرئيسية */}
      <div className="flex-grow flex flex-col md:flex-row gap-10">
        
        {/* محرر الكتابة الحرة (البرمجة النصية) */}
        <div className="w-full md:w-2/3 flex flex-col">
          <p className="text-slate-500 mb-4 text-sm font-medium">
            اكتب أهدافك المالية الكبرى كأنها تتحقق الآن (يتم الحفظ تلقائياً وبسرية تامة على جهازك)...
          </p>
          <textarea
            className="w-full flex-grow bg-transparent border-none outline-none resize-none text-xl md:text-2xl leading-relaxed placeholder-slate-800 text-slate-300"
            placeholder="أنا الآن أمتلك أراضي استثمارية في طريق المطار وحي وعيرة، ومنصة إنجازيا تحقق اشتراكات شهرية متزايدة..."
            value={script}
            onChange={handleScriptChange}
            autoFocus
          />
        </div>

        {/* جدار الرؤية والمؤشرات (Vision & Stats) */}
        <div className="w-full md:w-1/3 flex flex-col gap-6">
          
          {/* محاكي القفزة المالية */}
          <div className="bg-[#111827] rounded-2xl p-6 shadow-2xl border border-slate-800/60">
            <h3 className="text-slate-500 text-xs uppercase tracking-widest mb-2">الإيرادات الشهرية المستهدفة</h3>
            <div className="text-4xl font-extrabold text-emerald-400 tracking-tight">
              SAR 100,000<span className="text-lg text-slate-600 font-normal">/mo</span>
            </div>
          </div>
          
          {/* جدار الصور (العقارات والأهداف) */}
          <div className="flex-grow rounded-2xl bg-[#111827] border border-slate-800/60 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden group">
            {/* يمكنك لاحقاً استبدال هذا القسم بوسم <img src="/madinah-lands.jpg" /> */}
            <div className="w-16 h-16 bg-slate-800 rounded-full mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
              🖼️
            </div>
            <p className="text-slate-400 text-sm">
              مساحة مخصصة لعرض صور المخططات السكنية والأراضي (طريق المطار، حي وعيرة).<br/>
              <span className="text-slate-600 text-xs mt-2 block">أضف الصور في مجلد public واستدعها هنا</span>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
