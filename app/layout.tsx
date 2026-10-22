// app/layout.tsx
import React from "react";
import "../globals.css"; 

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <title>منصة كليك قدرات - التدريب الأذكى لاختبار القدرات</title>
        <meta name="description" content="منصة كليك قدرات - منصة تدريبية متقدمة لاختبارات القدرات العامة" />
      </head>
      <body className="bg-gray-50 text-gray-900 antialiased min-h-screen flex flex-col font-sans">
        
        {/* محتوى الصفحات */}
        <main className="flex-grow">
          {children}
        </main>

        {/* الفوتر (تذييل الصفحة) */}
        <footer className="bg-white border-t border-gray-200 mt-auto">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-500 text-sm text-center md:text-right font-medium">
              © {new Date().getFullYear()} منصة كليك قدرات. جميع الحقوق محفوظة.
            </div>
            <div className="flex gap-6 text-sm text-gray-500 justify-center md:justify-start">
              <a href="/terms" className="hover:text-green-600 transition-colors">الشروط والأحكام</a>
              <a href="/privacy" className="hover:text-green-600 transition-colors">سياسة الخصوصية</a>
              <a href="https://wa.me/966541313564" target="_blank" rel="noopener noreferrer" className="hover:text-green-600 transition-colors">الدعم الفني</a>
            </div>
          </div>
        </footer>

      </body>
    </html>
  );
}
