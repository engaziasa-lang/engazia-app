// app/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "منصة إنجازيا للحلول المالية والرقمية - اختبارات القدرات",
  description: "منصة تدريبية متقدمة لاختبارات القدرات العامة",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-gray-50 text-gray-900 antialiased min-h-screen flex flex-col font-sans">
        
        {/* محتوى الصفحات */}
        <main className="flex-grow">
          {children}
        </main>

        {/* حاوية أيقونة الواتساب وزر الإغلاق */}
        {/* تم استخدام div لضمان عمل زر الإغلاق بشكل صحيح */}
        <WhatsAppWidget />
        
      </body>
    </html>
  );
}

// مكون منفصل للأيقونة وزر الإغلاق لحل مشكلة التركيز في التحديث
function WhatsAppWidget() {
  // حالة للتحكم في ظهور الأيقونة
  // بما أننا داخل الـ Client Component الآن بسبب الـ useState
  // سنضطر لتحويل الـ RootLayout لـ use client أو استخدام طريقة ذكية.
  // الطريقة الأسهل في layout.tsx بدون تحويله لـ client كامل هي استخدام script بسيط لإخفاء الـ div عند الطلب.
  
  return (
    <div 
      id="whatsapp-widget-container"
      className="fixed bottom-6 left-6 z-[9999] flex flex-col-reverse items-end gap-2 transition-all duration-500 ease-out opacity-0 scale-50 animate-fade-in"
      title="تواصل معنا عبر واتساب للدعم الفني أو التحويل البنكي"
    >
      <style>{`
        @keyframes fade-in {
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out 0.3s forwards;
        }
        #whatsapp-widget-container:hover .whatsapp-close-btn {
          opacity: 1;
        }
      `}</style>

      {/* زر الإغلاق (x) */}
      <button
        onClick={() => {
          // إخفاء الحاوية عند الضغط على x
          const container = document.getElementById('whatsapp-widget-container');
          if (container) {
            container.style.display = 'none';
          }
        }}
        className="whatsapp-close-btn absolute -top-2 -right-2 bg-white text-gray-500 hover:text-red-600 rounded-full w-5 h-5 flex items-center justify-center shadow-md border border-gray-100 opacity-0 transition-opacity duration-300 cursor-pointer focus:outline-none"
        aria-label="إغلاق أيقونة الواتساب"
        title="إغلاق الأيقونة مؤقتاً"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* أيقونة الواتساب العائمة */}
      <a
        href="https://wa.me/966541313564"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-500 hover:bg-green-600 text-white p-3.5 rounded-full shadow-2xl transition-transform transform hover:scale-110 flex items-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-300"
      >
        <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
        </a>
      </div>
    );
}
