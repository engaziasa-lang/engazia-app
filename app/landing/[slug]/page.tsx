import { getToolBySlug, toolsData } from '@/lib/toolsData';
import Link from 'next/link';

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function LandingPage({ params }: PageProps) {
  const { slug } = params;
  const tool = getToolBySlug(slug);

  const relatedTools = Object.keys(toolsData)
    .filter((k) => k !== slug)
    .slice(0, 4)
    .map((k) => ({
      slug: k,
      title: toolsData[k].title
    }));

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <main className="max-w-7xl mx-auto space-y-12">
        
        {/* قسم الهيدر الرئيسي */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-6 sm:p-10 rounded-3xl shadow-sm border border-slate-100">
          
          {/* النصوص والوصف */}
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-block bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-3.5 py-1.5 rounded-full font-bold">
              أداة معتمدة للمتاجر الإلكترونية في السعودية
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-snug">
              {tool.title}
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              {tool.description}
            </p>
            
            <ul className="space-y-3 pt-2">
              {tool.features && tool.features.map((feature, index) => (
                <li key={index} className="flex items-start text-slate-700 font-medium text-base">
                  <span className="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center ml-3 mt-1 flex-shrink-0 text-xs font-bold">
                    ✓
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4">
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 px-8 rounded-xl shadow-lg shadow-emerald-600/20 transition duration-200 text-center">
                تشغيل الأداة واستخدامها فوراً ←
              </button>
            </div>
          </div>

          {/* صورة الأداة مقيدة بإطار وابعاد صحيحة 100% */}
          <div className="lg:col-span-5 w-full bg-slate-900 rounded-2xl p-3 shadow-md border border-slate-200 flex items-center justify-center">
            <img 
              src={tool.imagePath} 
              alt={tool.title} 
              className="w-full h-auto max-h-[360px] object-contain rounded-xl"
            />
          </div>

        </div>

        {/* شبكة الربط الداخلي */}
        <div className="bg-slate-900 text-white p-8 rounded-3xl space-y-6 shadow-xl">
          <div className="max-w-2xl">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">استكشف المزيد من أدوات منصة إنجازيا السعودية</h2>
            <p className="text-slate-400 text-sm mt-1">منظومة متكاملة من الآلات الحاسبة وأدوات الأتمتة لمضاعفة أرباح متجرك.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {relatedTools.map((rt, idx) => (
              <Link 
                key={idx} 
                href={`/landing/${rt.slug}`}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-emerald-500 p-4 rounded-xl transition duration-200 flex flex-col justify-between group"
              >
                <span className="text-sm font-bold text-slate-200 group-hover:text-emerald-400 line-clamp-2">
                  {rt.title}
                </span>
                <span className="text-xs text-slate-400 mt-4 flex items-center">
                  استخدم الأداة <span className="mr-1">←</span>
                </span>
              </Link>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
