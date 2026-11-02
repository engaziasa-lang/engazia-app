import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'تركيب مظلات وسواتر في المدينة المنورة | برجولات وتغطية مسابح',
  description: 'متخصصون في تركيب المظلات والسواتر والبرجولات في المدينة المنورة. تصاميم عصرية، خامات مقاومة للشمس والأمطار، وأسعار مناسبة. اتصل لرفع المقاسات مجاناً.',
};

export default function AwningsLandingPage() {
  const phoneNumber = "0541313564"; 
  const whatsappNumber = "966541313564"; 
  const whatsappMessage = "مرحباً، أريد طلب معاينة ورفع مقاسات لتركيب مظلات/سواتر.";

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 font-sans pb-20">
      
      {/* الشريط العلوي */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="text-xl font-bold text-gray-800">
            مظلات المدينة <span className="text-indigo-600">.</span>
          </div>
          <a 
            href={`tel:${phoneNumber}`} 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors flex items-center gap-2"
          >
            <span>اتصل الآن</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </a>
        </div>
      </header>

      {/* القسم الرئيسي (Hero) */}
      <section className="bg-gradient-to-b from-indigo-50 to-white pt-12 pb-16 px-4 border-b border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
            تركيب مظلات وسواتر وبرجولات في المدينة المنورة
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            نقدم أحدث التصاميم العصرية للمظلات والسواتر بخامات متينة تقاوم حرارة الشمس والأمطار. حماية كاملة ولمسة جمالية لمنزلك.
          </p>
          <a 
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white text-lg font-bold py-4 px-8 rounded-xl shadow-lg transition-transform transform hover:scale-105 w-full md:w-auto"
          >
            <span>اطلب رفع المقاسات مجاناً</span>
          </a>
        </div>
      </section>

      {/* إشارات الثقة (Trust Signals) */}
      <section className="py-8 bg-white border-y border-gray-100">
        <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row justify-around gap-6 text-center">
          <div className="flex flex-col items-center">
            <div className="bg-indigo-100 text-indigo-600 p-3 rounded-full mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            </div>
            <h3 className="font-bold text-gray-800">عزل حراري ومقاومة للماء</h3>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-indigo-100 text-indigo-600 p-3 rounded-full mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
            </div>
            <h3 className="font-bold text-gray-800">تصاميم عصرية متنوعة</h3>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-indigo-100 text-indigo-600 p-3 rounded-full mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
            </div>
            <h3 className="font-bold text-gray-800">ضمان على الأقمشة والحديد</h3>
          </div>
        </div>
      </section>

      {/* محتوى الـ SEO والتفاصيل */}
      <section className="py-12 px-4 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">خدماتنا في تركيب المظلات والسواتر</h2>
        <p className="text-gray-600 leading-relaxed mb-8">
          إذا كنت تبحث عن حماية سيارتك من أشعة الشمس، أو ترغب في إضافة خصوصية لمنزلك عبر تركيب سواتر جدارية، نحن نوفر لك أفضل الحلول في المدينة المنورة. نستخدم أجود أنواع الأقمشة (PVC، بولي إيثيلين) والهياكل الحديدية والخشبية المعالجة ضد الصدأ والتسوس.
        </p>
        
        <ul className="space-y-4">
          {[
            'تركيب مظلات سيارات (مخروطية، هرمية، كابولي) لحماية المركبات من الشمس.',
            'تفصيل وتركيب سواتر جدارية (حديد، ليزر، قماش، شرائح) لزيادة الخصوصية.',
            'تصميم وتركيب برجولات خشبية وحديدية للحدائق والجلسات الخارجية والأسطح.',
            'تغطية المسابح والخزانات بأفضل الخامات العازلة للحرارة والأتربة.'
          ].map((item, index) => (
            <li key={index} className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm border border-gray-50">
              <svg className="w-6 h-6 text-indigo-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              <span className="text-gray-700 font-medium">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* الزر العائم للموبايل (Sticky Bottom Bar) */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] md:hidden z-50 flex gap-3">
        <a 
          href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
          className="flex-1 bg-green-500 text-white text-center py-3 rounded-lg font-bold flex items-center justify-center gap-2"
        >
          <span>واتساب</span>
        </a>
        <a 
          href={`tel:${phoneNumber}`} 
          className="flex-1 bg-indigo-600 text-white text-center py-3 rounded-lg font-bold flex items-center justify-center gap-2"
        >
          <span>اتصال مباشر</span>
        </a>
      </div>
      
    </div>
  );
}
