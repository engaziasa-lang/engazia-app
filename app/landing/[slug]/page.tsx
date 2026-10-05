import { getToolBySlug, toolsData } from '@/lib/toolsData';
import Image from 'next/image';
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
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* قسم الهيدر الرئيسي مع صورة الأداة */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-slate-100">
          
          <div className="space-y-6">
            <span className="inline-block bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-3.5 py-1.5 rounded-full font-bold">
              أداة معتمدة للمتاجر الإلكترونية في السعودية
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              {tool.title}
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              {tool.description}
            </p>
            
            <ul className="space-y-3.5 pt-2">
              {tool.features.map((feature, index) => (
                <li key={index} className="flex items-start text-slate-700 font-medium">
                  <svg className="h-6 w-6 text-emerald-600 ml-2.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <div className="pt-6">
              <button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-4 px-10 rounded-2xl shadow-lg shadow-emerald-600/20 transition duration-200 text-center">
                تشغيل الأداة واستخدامها فوراً ←
              </button>
            </div>
          </div>

          <div className="relative rounded-2xl shadow-xl overflow-hidden border border-slate-200 bg-slate-900 p-2">
            <Image 
              src={tool.imagePath} 
              alt={tool.title} 
              width={800} 
              height={600}
              className="w-full h-auto rounded-xl object-cover"
              priority
            />
          </div>

        </div>

        {/* شبكة الربط الداخلي الآمنة */}
        <div className="bg-slate-900 text-white p-8 sm:p-12 rounded-3xl space-y-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-black tracking-tight">استكشف المزيد من أدوات منصة إنجازيا السعودية</h2>
            <p className="text-slate-400 mt-2">منظومة متكاملة من الآلات الحاسبة وأدوات الأتمتة لمضاعفة أرباح متجرك.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            {relatedTools.map((rt, idx) => (
              <Link 
                key={idx} 
                href={`/landing/${rt.slug}`}
                className="bg-slate-800 hover:bg-emerald-600/20 border border-slate-700 hover:border-emerald-500 p-5 rounded-2xl transition duration-200 flex flex-col justify-between group"
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

      </div>
    </main>
  );
}
