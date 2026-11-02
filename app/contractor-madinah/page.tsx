import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'أفضل مقاول بناء ملاحق وتشطيب في المدينة المنورة | معاينة مجانية',
  description: 'تبحث عن مقاول بناء ملاحق وترميم في المدينة المنورة؟ نقدم خدمات بناء العظم والتشطيب وتسليم المفتاح بأعلى جودة وأفضل الأسعار. اتصل لمعاينة موقعك مجاناً.',
};

export default function ContractorLandingPage() {
  const phoneNumber = "0541313564"; 
  const whatsappNumber = "966541313564"; 
  const whatsappMessage = "مرحباً، أريد طلب معاينة مجانية لخدمات المقاولات.";

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 font-sans pb-20">
      
      {/* الشريط العلوي */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="text-xl font-bold text-gray-800">
            مقاولات المدينة <span className="text-blue-600">.</span>
          </div>
          <a 
            href={`tel:${phoneNumber}`} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors flex items-center gap-2"
          >
            <span>اتصل الآن</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </a>
        </div>
      </header>

      {/* القسم الرئيسي (Hero) */}
      <section className="bg-gradient-to-b from-blue-50 to-white pt-12 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
            مقاول بناء ملاحق وتشطيبات عامة في المدينة المنورة
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            دقة في التنفيذ، سرعة في الإنجاز، وضمان شامل على كافة الأعمال الإنشائية والترميم.
          </p>
          <a 
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white text-lg font-bold py-4 px-8 rounded-xl shadow-lg transition-transform transform hover:scale-105 w-full md:w-auto"
          >
            <span>اطلب معاينة موقعك مجاناً</span>
          </a>
        </div>
      </section>

      {/* إشارات الثقة (Trust Signals) */}
      <section className="py-8 bg-white border-y border-gray-100">
        <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row justify-around gap-6 text-center">
          <div className="flex flex-col items-center">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-full mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <h3 className="font-bold text-gray-800">ضمان 10 سنوات</h3>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-full mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <h3 className="font-bold text-gray-800">عمالة متخصصة</h3>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-full mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 className="font-bold text-gray-800">أسعار تنافسية</h3>
          </div>
        </div>
      </section>

      {/* محتوى الـ SEO والتفاصيل */}
      <section className="py-12 px-4 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">خدماتنا في مجال المقاولات والتشطيب</h2>
        <p className="text-gray-600 leading-relaxed mb-8">
          هل تخطط لتوسعة منزلك أو بناء ملحق جديد؟ نحن نوفر لك أفضل مقاول بناء ملاحق في المدينة المنورة بخبرة طويلة في تنفيذ كافة أعمال العظم والتشطيب. نلتزم بأعلى معايير الجودة الهندسية، ونوفر عمالة ماهرة لضمان تسليم مشروعك في الوقت المحدد وبأسعار تنافسية تناسب ميزانيتك.
        </p>
        
        <ul className="space-y-4">
          {[
            'بناء ملاحق أرضية وعلوية ومجالس خارجية.',
            'أعمال الترميم الشامل وتجديد الواجهات للمباني القديمة.',
            'تأسيس السباكة والكهرباء والتشطيب النهائي (تسليم مفتاح).',
            'تكسير وتوسعة الغرف بأمان هندسي تام وإشراف متخصص.'
          ].map((item, index) => (
            <li key={index} className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm border border-gray-50">
              <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
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
          className="flex-1 bg-blue-600 text-white text-center py-3 rounded-lg font-bold flex items-center justify-center gap-2"
        >
          <span>اتصال مباشر</span>
        </a>
      </div>
      
    </div>
  );
}
