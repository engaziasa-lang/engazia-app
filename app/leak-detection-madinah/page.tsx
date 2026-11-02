import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'شركة كشف تسربات المياه بالمدينة المنورة | تقارير معتمدة',
  description: 'كشف تسربات المياه إلكترونياً بدون تكسير في المدينة المنورة. استخراج تقارير معتمدة لشركة المياه لحل مشكلة ارتفاع الفاتورة. استجابة سريعة ومعالجة فورية.',
};

export default function LeakDetectionLandingPage() {
  const phoneNumber = "0541313564"; 
  const whatsappNumber = "966541313564"; 
  const whatsappMessage = "مرحباً، أعاني من مشكلة تسرب مياه/ارتفاع في الفاتورة وأحتاج لفحص الموقع.";

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 font-sans pb-20">
      
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="text-xl font-bold text-gray-800">
            كشف التسربات <span className="text-blue-600">.</span>
          </div>
          <a 
            href={`tel:${phoneNumber}`} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors flex items-center gap-2"
          >
            <span>اتصل للتدخل الفوري</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </a>
        </div>
      </header>

      <section className="bg-gradient-to-b from-blue-50 to-white pt-12 pb-16 px-4 border-b border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-red-100 text-red-600 font-bold px-3 py-1 rounded-full text-sm mb-4">
            تخلص من ارتفاع فاتورة المياه
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
            كشف تسربات المياه بدون تكسير في المدينة المنورة
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            أحدث الأجهزة الإلكترونية لتحديد موقع التسرب بدقة متناهية خلف الجدران وتحت البلاط. نقدم تقارير معتمدة لشركة المياه الوطنية.
          </p>
          <a 
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white text-lg font-bold py-4 px-8 rounded-xl shadow-lg transition-transform transform hover:scale-105 w-full md:w-auto"
          >
            <span>اطلب الفحص الإلكتروني الآن</span>
          </a>
        </div>
      </section>

      <section className="py-8 bg-white border-y border-gray-100">
        <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row justify-around gap-6 text-center">
          <div className="flex flex-col items-center">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-full mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            </div>
            <h3 className="font-bold text-gray-800">كشف دقيق بدون تكسير</h3>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-full mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <h3 className="font-bold text-gray-800">تقارير معتمدة للشركة</h3>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-full mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 className="font-bold text-gray-800">استجابة طوارئ سريعة</h3>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">الحل النهائي لمشاكل تسرب المياه</h2>
        <p className="text-gray-600 leading-relaxed mb-8">
          تسربات المياه لا تسبب فقط ارتفاعاً مفاجئاً في فواتير الاستهلاك، بل تهدد البنية الإنشائية للمبنى وتسبب تشوهات الجدران. نحن ننهي معاناتك باستخدام تقنيات الموجات الصوتية والكاميرات الحرارية لتحديد العطل وإصلاحه بأقل تكلفة وجهد.
        </p>
        
        <ul className="space-y-4">
          {[
            'كشف تسربات شبكات المياه الأرضية المخفية داخل الجدران وتحت الأرضيات.',
            'فحص تسربات الخزانات والمسابح وتحديد أماكن التهريب بدقة إلكترونية.',
            'استخراج تقارير هندسية معتمدة لتقديمها لشركة المياه الوطنية وتخفيض الفاتورة.',
            'إصلاح فوري لمكان التسرب بأيدي فنيين محترفين مع تقديم ضمان على الإصلاح.'
          ].map((item, index) => (
            <li key={index} className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm border border-gray-50">
              <svg className="w-6 h-6 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
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
          className="flex-1 bg-blue-600 text-white text-center py-3 rounded-lg font-bold flex items-center justify-center gap-2"
        >
          <span>اتصال طوارئ</span>
        </a>
      </div>
    </div>
  );
}
