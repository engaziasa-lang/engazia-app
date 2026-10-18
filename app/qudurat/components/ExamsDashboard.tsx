'use client';
import { useState } from 'react';
import { EXAMS_DATA } from '../lib/examsConfig'; 
import questions from '../data/questions.json'; 

export default function ExamsDashboard() {
  const [isUserSubscribed, setIsUserSubscribed] = useState(false);

  const handleStartExam = (exam: typeof EXAMS_DATA[0]) => {
    if (!exam.isFree && !isUserSubscribed) {
      alert("هذا الاختبار يتطلب اشتراكاً مميزاً. يرجى الترقية الآن!");
      return;
    }

    const currentExamQuestions = questions.slice(exam.startIndex, exam.endIndex);
    console.log(`بدء ${exam.title} بعدد أسئلة: ${currentExamQuestions.length}`);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen" dir="rtl">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-800">
        باقات اختبارات القدرات - إنجازيا
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {EXAMS_DATA.map((exam) => (
          <div 
            key={exam.id} 
            className={`rounded-xl p-6 shadow-md border-2 transition-all ${
              exam.isFree ? 'border-green-500 bg-white' : 'border-gray-200 bg-white'
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">{exam.title}</h2>
              {exam.isFree ? (
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                  مجاني
                </span>
              ) : (
                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">
                  للمشتركين 🔒
                </span>
              )}
            </div>
            
            <p className="text-gray-600 mb-6">{exam.description}</p>
            
            <button
              onClick={() => handleStartExam(exam)}
              className={`w-full py-3 rounded-lg font-bold text-white transition-colors ${
                exam.isFree || isUserSubscribed 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-gray-400 hover:bg-gray-500'
              }`}
            >
              {exam.isFree || isUserSubscribed ? 'ابدأ الاختبار الآن' : 'اشترك لفتح الاختبار'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
