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
      </body>
    </html>
  )
}
