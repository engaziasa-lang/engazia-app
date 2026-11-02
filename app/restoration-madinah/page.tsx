import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'شركة ترميم مباني ومنازل بالمدينة المنورة | معالجة التشققات',
  description: 'أفضل مقاول ترميم مباني في المدينة المنورة. معالجة التشققات والتصدعات، تجديد الواجهات، ترميم الحمامات والمطابخ، وإعادة التأهيل الإنشائي بضمان هندسي.',
};

export default function RestorationLandingPage() {
  const phoneNumber = "0541313564"; 
  const whatsappNumber = "966541313564"; 
  const whatsappMessage = "مرحباً، أرغب في طلب مهندس لمعاينة مبنى بهدف الترميم.";

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 font-sans pb-20">
      
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="text-xl font-bold text-gray-800">
            ترميم المدينة <span className="text-orange-500">.</span>
          </div>
          <a 
            href={`tel:${phoneNumber}`} 
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors flex items-center gap-2"
          >
            <span>اتصل الآن</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </a>
        </div>
      </header>

      <section className="bg-gradient-to-b from-orange-50 to-white pt-12 pb-16 px-4 border-b border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
            شركة ترميم مباني وصيانة عامة في المدينة المنورة
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            نعيد لمنزلك قوته ورونقه. متخصصون في معالجة التشققات الإنشائية، تجديد الواجهات، والترميم الشامل للفلل والمباني القديمة تحت إشراف هندسي متكامل.
          </p>
          <a 
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white text-lg font-bold py-4 px-8 rounded-xl shadow-lg transition-transform transform hover:scale-105 w-full md:w-auto"
          >
            <span>اطلب معاينة وتقرير هندسي للمبنى</span>
          </a>
        </div>
      </section>

      <section className="py-8 bg-white border-y border-gray-100">
        <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row justify-around gap-6 text-center">
          <div className="flex flex-col items-center">
            <div className="bg-orange-100 text-orange-600 p-3 rounded-full mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            </div>
            <h3 className="font-bold text-gray-800">حلول للتشققات الخطيرة</h3>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-orange-100 text-orange-600 p-3 rounded-full mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <h3 className="font-bold text-gray-800">إشراف هندسي معتمد</h3>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-orange-100 text-orange-600 p-3 rounded-full mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 className="font-bold text-gray-800">تسليم في الوقت المحدد</h3>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">خدمات الترميم وإعادة التأهيل الإنشائي</h2>
        <p className="text-gray-600 leading-relaxed mb-8">
          إهمال تشققات المباني وتساقط الدهانات قد يؤدي إلى أضرار إنشائية جسيمة بمرور الوقت. في المدينة المنورة، نوفر لك حلول ترميم متكاملة تعالج الجذور الإنشائية للمشكلة وتجدد المظهر العام لممتلكاتك لتصبح وكأنها جديدة.
        </p>
        
        <ul className="space-y-4">
          {[
            'معالجة التشققات الإنشائية والتصدعات في الجدران والأسقف بمواد حقن متخصصة.',
            'ترميم واجهات المباني القديمة وتجديدها بأحدث التصاميم (كسر رخام، بروفايل، حجر).',
            'الترميم الشامل للحمامات والمطابخ يشمل تغيير التمديدات ومعالجة الرطوبة والتبليط.',
            'إعادة تأهيل المنازل القديمة بالكامل (تجديد شبكات السباكة والكهرباء والدهانات).'
          ].map((item, index) => (
            <li key={index} className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm border border-gray-50">
              <svg className="w-6 h-6 text-orange-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
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
          className="flex-1 bg-orange-500 text-white text-center py-3 rounded-lg font-bold flex items-center justify-center gap-2"
        >
          <span>اتصال مباشر</span>
        </a>
      </div>
    </div>
  );
}
