"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import questionsData from '../data/questions.json';

export default function QuduratResultPage() {
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // قراءة إجابات الطالب التي تم حفظها في شاشة الاختبار
    const stored = sessionStorage.getItem('qudurat_answers');
    if (stored) {
      setUserAnswers(JSON.parse(stored));
    }
    setIsLoaded(true);
  }, []);

  if (!isLoaded) return <div className="p-10 text-center text-xl font-bold">جاري حساب النتيجة...</div>;

  // مطابقة الإجابات وحساب الدرجة
  let score = 0;
  const resultDetails = questionsData.map((q, index) => {
    const uAnswerIdx = userAnswers[index];
    const isCorrect = uAnswerIdx === q.correctOptionIndex;
    if (isCorrect) score++;
    
    return {
      ...q,
      userAnswerText: uAnswerIdx !== undefined ? q.options[uAnswerIdx] : "لم تتم الإجابة",
      isCorrect
    };
  });

  const percentage = Math.round((score / questionsData.length) * 100);

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans" dir="rtl">
      <div className="max-w-4xl mx-auto">
        
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center mb-8 border border-slate-200">
          <h1 className="text-3xl font-black text-slate-800 mb-2">تقرير الأداء التفصيلي</h1>
          <p className="text-slate-500 mb-6">اختبار كليك قدرات المحاكي</p>
          
          <div className="flex justify-center items-center gap-8">
            <div className="text-center">
              <div className={`text-5xl font-black mb-2 ${percentage >= 80 ? 'text-green-600' : percentage >= 50 ? 'text-orange-500' : 'text-red-600'}`}>
                {percentage}%
              </div>
              <div className="font-bold text-slate-600">النسبة المئوية</div>
            </div>
            <div className="w-px h-16 bg-slate-200"></div>
            <div className="text-center">
              <div className="text-4xl font-bold text-slate-800 mb-2">{score} / {questionsData.length}</div>
              <div className="font-bold text-slate-600">الإجابات الصحيحة</div>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-slate-800 mb-6">مراجعة الأخطاء والشرح:</h2>
        
        <div className="space-y-6">
          {resultDetails.map((item, idx) => (
            <div key={idx} className={`bg-white rounded-xl p-6 border-r-4 shadow-sm ${item.isCorrect ? 'border-green-500' : 'border-red-500'}`}>
              <div className="flex items-start gap-4 mb-4">
                <div className={`mt-1 font-bold whitespace-nowrap ${item.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  {item.isCorrect ? '✅ صحيح' : '❌ خاطئ'}
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded ml-2">{item.category}</span>
                  <h3 className="text-lg font-bold text-slate-800 leading-relaxed inline">{item.text}</h3>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm font-medium pr-16 md:pr-24">
                <div className="bg-slate-50 p-3 rounded text-slate-600">
                  إجابتك: <span className={item.isCorrect ? "text-green-600" : "text-red-600"}>{item.userAnswerText}</span>
                </div>
                <div className="bg-green-50 p-3 rounded text-green-700">
                  الإجابة الصحيحة: {item.correctAnswer}
                </div>
              </div>

              {!item.isCorrect && (
                <div className="pr-16 md:pr-24 mt-4">
                  <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
                    <span className="font-bold text-blue-800 block mb-2">💡 طريقة الحل:</span>
                    <p className="text-blue-900 leading-relaxed">{item.explanation}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/qudurat" className="inline-block bg-slate-800 text-white font-bold px-8 py-3 rounded hover:bg-slate-700 transition-colors">
            إعادة الاختبار
          </Link>
        </div>

      </div>
    </div>
  );
}
