export default async function PlatformPage({ params }: { params: Promise<{ platform: string }> }) {
  // نطلب من النظام الانتظار حتى يقرأ الرابط بالكامل
  const resolvedParams = await params;
  const platformName = decodeURIComponent(resolvedParams.platform);
  
  return (
    <main style={{ padding: '50px', textAlign: 'center', fontFamily: 'Arial' }}>
      <h1>إضافة إنجازيا برو مكس لإدارة عملاء الواتساب لمتاجر {platformName}</h1>
      <p>نظم ردودك وأدر عملاءك باحترافية تامة عبر الواتساب مع أداة إنجازيا برو مكس.</p>
    </main>
  )
}
