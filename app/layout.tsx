import Script from 'next/script';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta name="google-site-verification" content="ZVVequa-9RPcw5v1AIWUlm2fR1jUrfAxvRtWCTliW_4" />
      </head>
      <body>
        {children}
        
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-DDSJGHW0NV`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
        >
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-DDSJGHW0NV');
          `}
        </Script>
      </body>
    </html>
  );
}
