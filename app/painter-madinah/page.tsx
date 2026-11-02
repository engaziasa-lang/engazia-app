import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'معلم دهانات وديكورات بالمدينة المنورة | بديل رخام وخشب',
  description: 'أفضل معلم دهانات في المدينة المنورة. تنفيذ كافة أعمال البويات الداخلية والخارجية، تركيب بديل الرخام، بديل الخشب، والفوم بأحدث التصاميم وأفضل الأسعار.',
};

export default function PainterLandingPage() {
  const phoneNumber = "0541313564"; 
  const whatsappNumber = "966541313564"; 
  const whatsappMessage = "مرحباً، أريد الاستفسار عن أسعار الدهانات وأعمال الديكور (بديل رخام/خشب).";

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 font-sans pb-20">
      
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="text-xl font-bold text-gray-800">
            ديكورات المدينة <span className="text-violet-600">.</span>
          </div>
          <a 
            href={`tel:${phoneNumber}`} 
            className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors flex items-center gap-2"
          >
            <span>اتصل الآن</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </a>
        </div>
      </header>

      <section className="bg-gradient-to-b from-violet-50 to-white pt-12 pb-16 px-4 border-b border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
            معلم دهانات وديكورات حديثة في المدينة المنورة
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            لمسة إبداعية تجدد منزلك. متخصصون في تنفيذ أرقى الدهانات، تركيب بديل الرخام وبديل الخشب، والفوم الجداري بأسعار تنافسية وجودة لا تضاهى.
          </p>
          <a 
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white text-lg font-bold py-4 px-8 rounded-xl shadow-lg transition-transform transform hover:scale-105 w-full md:w-auto"
          >
            <span>اطلب تسعيرة أو كتالوج الأعمال</span>
          </a>
        </div>
      </section>

      <section className="py-8 bg-white border-y border-gray-100">
        <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row justify-around gap-6 text-center">
          <div className="flex flex-col items-center">
            <div className="bg-violet-100 text-violet-600 p-3 rounded-full mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
            </div>
            <h3 className="font-bold text-gray-800">إتقان ونظافة في العمل</h3>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-violet-100 text-violet-600 p-3 rounded-full mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>
            </div>
            <h3 className="font-bold text-gray-800">أحدث كتالوجات الديكور</h3>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-violet-100 text-violet-600 p-3 rounded-full mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 className="font-bold text-gray-800">مواد أصلية بأسعار الجملة</h3>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">خدمات الدهانات والديكور الداخلي</h2>
        <p className="text-gray-600 leading-relaxed mb-8">
          سواء كنت تؤسس منزلاً جديداً أو ترغب في تجديد الغرف والمجالس، نحن نقدم لك فريقاً من أمهر الفنيين في المدينة المنورة لتحويل أفكارك إلى واقع بأدق التفاصيل والتشطيبات الفاخرة.
        </p>
        
        <ul className="space-y-4">
          {[
            'تنفيذ الدهانات الداخلية والخارجية (سادة، ديكوري، روشن، ربع لمعة) بماركات معتمدة.',
            'تركيب بديل الرخام وبديل الخشب وخلفيات شاشات البلازما بتصاميم مودرن.',
            'تركيب الفوم الجداري (نعلات، إطارات، بانوهات) كبديل عصري للجبس.',
            'تركيب ورق الجدران ثلاثي الأبعاد والباركيه للأرضيات بدقة متناهية.'
          ].map((item, index) => (
            <li key={index} className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm border border-gray-50">
              <svg className="w-6 h-6 text-violet-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
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
          className="flex-1 bg-violet-600 text-white text-center py-3 rounded-lg font-bold flex items-center justify-center gap-2"
        >
          <span>اتصال مباشر</span>
        </a>
      </div>
    </div>
  );
}
