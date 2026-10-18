import Script from 'next/script';

export default function QuduratLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* هذا السطر سيقوم بتحميل تنسيقات Tailwind فوراً لمسار القدرات */}
      <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />
      <div className="font-sans">
        {children}
      </div>
    </>
  );
}
