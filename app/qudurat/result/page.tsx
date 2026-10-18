import Link from 'next/link';

// البيانات المؤقتة للتجربة (نفس الأسئلة مع إضافة الإجابة الصحيحة والشرح)
const resultData = [
  {
    id: 1,
    text: "إذا كان محمد يقطع مسافة 60 كم في ساعتين، فكم يقطع في 5 ساعات؟",
    userAnswer: "120 كم", // افتراض أن المستخدم اختار إجابة خاطئة
    correctAnswer: "150 كم",
    isCorrect: false,
    explanation: "أولاً نحسب السرعة (المسافة ÷ الزمن) = 60 ÷ 2 = 30 كم/ساعة. ثانياً نحسب المسافة الجديدة (السرعة × الزمن) = 30 × 5 = 150 كم."
  },
  {
    id: 2,
    text: "خزان ماء يفرغ ربع سِعته في ساعتين، ففي كم ساعة يفرغ الخزان كاملاً؟",
    userAnswer: "8 ساعات", // افتراض أن المستخدم أجاب إجابة صحيحة
    correctAnswer: "8 ساعات",
    isCorrect: true,
    explanation: "الخزان الكامل يمثل (4 أرباع). إذا كان الربع يستغرق ساعتين، فإن الخزان كاملاً يستغرق: 4 × 2 = 8 ساعات."
  }
];

export default function QuduratResultPage() {
  const score = resultData.filter(q => q.isCorrect).length;
  const total = resultData.length;
  const percentage = Math.round((score / total) * 100);

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans" dir="rtl">
      <div className="max-w-4xl mx-auto">
        
        {/* ملخص النتيجة */}
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center mb-8 border border-slate-200">
          <h1 className="text-3xl font-black text-slate-800 mb-2">تقرير الأداء التفصيلي</h1>
          <p className="text-slate-500 mb-6">اختبار كليك قدرات المحاكي</p>
          
          <div className="flex justify-center items-center gap-8">
            <div className="text-center">
              <div className="text-5xl font-black text-blue-600 mb-2">{percentage}%</div>
              <div className="font-bold text-slate-600">النسبة المئوية</div>
            </div>
            <div className="w-px h-16 bg-slate-200"></div>
            <div className="text-center">
              <div className="text-4xl font-bold text-slate-800 mb-2">{score} / {total}</div>
              <div className="font-bold text-slate-600">الإجابات الصحيحة</div>
            </div>
          </div>
        </div>

        {/* مراجعة الأسئلة والشروحات */}
        <h2 className="text-2xl font-bold text-slate-800 mb-6">مراجعة الأخطاء والشرح:</h2>
        
        <div className="space-y-6">
          {resultData.map((item, idx) => (
            <div key={idx} className={`bg-white rounded-xl p-6 border-r-4 shadow-sm ${item.isCorrect ? 'border-green-500' : 'border-red-500'}`}>
              <div className="flex items-start gap-4 mb-4">
                <div className={`mt-1 font-bold ${item.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  {item.isCorrect ? '✅ صحيح' : '❌ خاطئ'}
                </div>
                <h3 className="text-lg font-bold text-slate-800 leading-relaxed">{item.text}</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm font-medium pr-16">
                <div className="bg-slate-50 p-3 rounded text-slate-600">
                  إجابتك: <span className={item.isCorrect ? "text-green-600" : "text-red-600"}>{item.userAnswer}</span>
                </div>
                <div className="bg-green-50 p-3 rounded text-green-700">
                  الإجابة الصحيحة: {item.correctAnswer}
                </div>
              </div>

              {/* الشرح التفصيلي (المنتج الحقيقي) */}
              <div className="pr-16 mt-4">
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
                  <span className="font-bold text-blue-800 block mb-2">💡 طريقة الحل:</span>
                  <p className="text-blue-900 leading-relaxed">{item.explanation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/qudurat" className="inline-block bg-slate-800 text-white font-bold px-8 py-3 rounded hover:bg-slate-700 transition-colors">
            العودة للصفحة الرئيسية
          </Link>
        </div>

      </div>
    </div>
  );
}
