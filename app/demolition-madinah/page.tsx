import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'مقاول هدم وحفر بالمدينة المنورة | إزالة مباني وترحيل مخلفات',
  description: 'أفضل مقاول هدم وحفر في المدينة المنورة. نقوم بإزالة المباني القديمة، حفر الأساسات، تسوية الأراضي وترحيل المخلفات بأسطول معدات حديث وسرعة إنجاز.',
};

export default function DemolitionLandingPage() {
  const phoneNumber = "0541313564"; 
  const whatsappNumber = "966541313564"; 
  const whatsappMessage = "مرحباً، أرغب في الاستفسار عن خدمات الهدم/الحفر وتجهيز الأراضي.";

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 font-sans pb-20">
      
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="text-xl font-bold text-gray-800">
            أعمال الحفر والهدم <span className="text-stone-600">.</span>
          </div>
          <a 
            href={`tel:${phoneNumber}`} 
            className="bg-stone-700 hover:bg-stone-800 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors flex items-center gap-2"
          >
            <span>اتصل الآن</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </a>
        </div>
      </header>

      <section className="bg-gradient-to-b from-stone-100 to-white pt-12 pb-16 px-4 border-b border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
            مقاول هدم مباني وحفر أساسات في المدينة المنورة
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            نجهز أرضك للبناء بأعلى معايير الأمان. خبراء في إزالة المباني القديمة، حفر الأساسات الصخرية والرملية، وترحيل المخلفات بأسطول متكامل من المعدات الثقيلة.
          </p>
          <a 
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white text-lg font-bold py-4 px-8 rounded-xl shadow-lg transition-transform transform hover:scale-105 w-full md:w-auto"
          >
            <span>اطلب تسعيرة أو معاينة للموقع</span>
          </a>
        </div>
      </section>

      <section className="py-8 bg-white border-y border-gray-100">
        <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row justify-around gap-6 text-center">
          <div className="flex flex-col items-center">
            <div className="bg-stone-200 text-stone-700 p-3 rounded-full mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h3 className="font-bold text-gray-800">أعلى معايير السلامة والأمان</h3>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-stone-200 text-stone-700 p-3 rounded-full mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h3 className="font-bold text-gray-800">إنجاز سريع بأسطول حديث</h3>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-stone-200 text-stone-700 p-3 rounded-full mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            </div>
            <h3 className="font-bold text-gray-800">ترحيل فوري للمخلفات (الأنقاض)</h3>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">خدماتنا في التجهيز الإنشائي</h2>
        <p className="text-gray-600 leading-relaxed mb-8">
          بداية أي مشروع ناجح تعتمد على تجهيز الأساسات الصلبة. نوفر في المدينة المنورة خدمات متكاملة لأعمال الهدم وإزالة العوائق وتسوية الأراضي استعداداً لمرحلة البناء.
        </p>
        
        <ul className="space-y-4">
          {[
            'هدم المباني القديمة والمنشآت الخرسانية باحترافية تامة ودون إلحاق ضرر بالمجاورين.',
            'حفر الأساسات للمباني السكنية والتجارية (تربة صخرية ورملية) بالمقاسات الهندسية الدقيقة.',
            'تسوية وتمهيد الأراضي والمخططات باستخدام أحدث الآليات والمعدات الثقيلة.',
            'ترحيل الأنقاض ومخلفات البناء ونواتج الحفر إلى المقالب المعتمدة بسرعة ونظافة.'
          ].map((item, index) => (
            <li key={index} className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm border border-gray-50">
              <svg className="w-6 h-6 text-stone-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              <span className="text-gray-700 font-medium">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="fixed bottom-0 left-0 right-0 p-3 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] md:hidden z-50 flex gap-3">
        <a 
          href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
          className="flex-1 bg-green-500 text-white text-center py-3 rounded-lg font-bold flex items-center justify-center gap-2"
        >
          <span>واتساب</span>
        </a>
        <a 
          href={`tel:${phoneNumber}`} 
          className="flex-1 bg-stone-700 text-white text-center py-3 rounded-lg font-bold flex items-center justify-center gap-2"
        >
          <span>اتصال مباشر</span>
        </a>
      </div>
    </div>
  );
}
