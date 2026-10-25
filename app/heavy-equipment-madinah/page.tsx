import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'تأجير معدات ثقيلة ورافعات في المدينة المنورة | يومي وشهري',
  description: 'أفضل شركة تأجير معدات ثقيلة في المدينة المنورة. نوفر بوكلينات، شيولات، ورافعات (كرينات) للإيجار اليومي والشهري بعقود مرنة وأسعار تنافسية للمقاولين.',
};

export default function HeavyEquipmentLandingPage() {
  const phoneNumber = "0541313564"; 
  const whatsappNumber = "966541313564"; 
  const whatsappMessage = "مرحباً، أرغب في الاستفسار عن أسعار تأجير المعدات الثقيلة والرافعات.";

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 font-sans pb-20">
      
      {/* الشريط العلوي */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="text-xl font-bold text-gray-800">
            معدات المدينة <span className="text-yellow-500">.</span>
          </div>
          <a 
            href={`tel:${phoneNumber}`} 
            className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-lg font-bold text-sm transition-colors flex items-center gap-2"
          >
            <span>اتصل الآن</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </a>
        </div>
      </header>

      {/* القسم الرئيسي (Hero) */}
      <section className="bg-gradient-to-b from-gray-100 to-white pt-12 pb-16 px-4 border-b border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
            تأجير معدات ثقيلة ورافعات وشيولات في المدينة المنورة
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            أسطول متكامل من المعدات الثقيلة الجاهزة لدعم مشاريعك الإنشائية. عقود تأجير يومية وشهرية مرنة تلبي احتياجات المقاولين والشركات.
          </p>
          <a 
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white text-lg font-bold py-4 px-8 rounded-xl shadow-lg transition-transform transform hover:scale-105 w-full md:w-auto"
          >
            <span>اطلب تسعيرة التأجير الآن</span>
          </a>
        </div>
      </section>

      {/* إشارات الثقة (Trust Signals) */}
      <section className="py-8 bg-white border-y border-gray-100">
        <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row justify-around gap-6 text-center">
          <div className="flex flex-col items-center">
            <div className="bg-yellow-100 text-yellow-600 p-3 rounded-full mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h3 className="font-bold text-gray-800">معدات حديثة وجاهزة</h3>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-yellow-100 text-yellow-600 p-3 rounded-full mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <h3 className="font-bold text-gray-800">عقود مرنة (يومي/شهري)</h3>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-yellow-100 text-yellow-600 p-3 rounded-full mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 className="font-bold text-gray-800">سرعة في التوريد</h3>
          </div>
        </div>
      </section>

      {/* محتوى الـ SEO والتفاصيل */}
      <section className="py-12 px-4 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">خدماتنا في تأجير المعدات الثقيلة</h2>
        <p className="text-gray-600 leading-relaxed mb-8">
          نحن نتفهم أهمية الوقت في المشاريع الإنشائية، لذلك نوفر لك في المدينة المنورة أسطولاً متكاملاً من المعدات الثقيلة المجهزة بأعلى معايير الصيانة، مع خيارات مرنة للتأجير تناسب حجم مشروعك وميزانيتك.
        </p>
        
        <ul className="space-y-4">
          {[
            'تأجير بوكلين وشيول بمقاسات مختلفة لأعمال الحفر والردم وتهيئة المواقع.',
            'رافعات شوكية وكرينات (Cranes) بحمولات متعددة لرفع وتنزيل المواد بأمان.',
            'تأجير رصاصات ومعدات سفلتة وتسوية للطرق والمخططات.',
            'توفير مشغلين (سائقين) ذوي خبرة عالية وكفاءة مهنية عند الطلب.'
          ].map((item, index) => (
            <li key={index} className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm border border-gray-50">
              <svg className="w-6 h-6 text-yellow-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
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
          className="flex-1 bg-yellow-500 text-gray-900 text-center py-3 rounded-lg font-bold flex items-center justify-center gap-2"
        >
          <span>اتصال مباشر</span>
        </a>
      </div>
      
    </div>
  );
}
