import Link from 'next/link';
import Image from 'next/image';

export default function QuduratLandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6" dir="rtl">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-10 text-center border border-slate-100">
        
        <Image
          src="/logo.png"
          alt="شعار منصة كليك قدرات"
          width={80}
          height={80}
          className="mx-auto mb-6 rounded-2xl shadow-sm"
          priority
        />

        <h1 className="text-5xl font-black text-slate-800 mb-4 tracking-tight">كليك <span className="text-blue-600">قدرات</span></h1>
        <p className="text-xl text-slate-600 mb-8 leading-relaxed">
          أقوى منصة لمحاكاة اختبار القدرات المحوسب. تدرب الآن واكسر رهبة الشاشة في بيئة مطابقة 100% للاختبار الحقيقي.
        </p>
        
        <div className="bg-blue-50/50 rounded-xl p-6 mb-10 text-right border border-blue-100">
          <h2 className="font-bold text-blue-900 mb-4 text-lg">ماذا ستحصل في هذا المحاكي؟</h2>
          <ul className="text-blue-800 space-y-3 font-medium">
            <li className="flex items-center gap-2">✅ واجهة مطابقة لشاشة مركز قياس الفعلي</li>
            <li className="flex items-center gap-2">⏳ مؤقت زمني صارم لتدريبك على إدارة الوقت</li>
            <li className="flex items-center gap-2">📊 أسئلة كمية ولفظية من أحدث التجميعات</li>
            <li className="flex items-center gap-2">💡 شرح تفصيلي لطريقة الحل بعد الانتهاء</li>
          </ul>
        </div>

        <Link 
          href="/qudurat/test" 
          className="inline-block bg-blue-600 text-white font-bold text-xl px-12 py-4 rounded-xl hover:bg-blue-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 w-full md:w-auto"
        >
          ابدأ الاختبار المحاكي الآن
        </Link>
      </div>
    </div>
  );
}
