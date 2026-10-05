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
    <div className="w-full bg-slate-100 py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* قسم الهيدر الرئيسي بمعمارية مرنة ومستقلة */}
        <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-6 sm:p-10 flex flex-col lg:flex-row items-center gap-8">
          
          {/* النصوص والوصف */}
          <div className="w-full lg:w-7/12 space-y-5 text-right">
            <span className="inline-block bg-emerald-50 text-emerald-800 text-xs font-bold px-3.5 py-1.5 rounded-full border border-emerald-200">
              أداة معتمدة للمتاجر الإلكترونية في السعودية
            </span>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-snug">
              {tool.title}
            </h1>
            
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              {tool.description}
            </p>
            
            <ul className="space-y-2.5 pt-1">
              {tool.features && tool.features.map((feature, index) => (
                <li key={index} className="flex items-center text-slate-700 font-medium text-sm sm:text-base">
                  <span className="w-5 h-5 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center ml-3 flex-shrink-0 text-xs font-bold">
                    ✓
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4">
              <button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg shadow-emerald-600/20 transition text-center text-base">
                تشغيل الأداة واستخدامها فوراً ←
              </button>
            </div>
          </div>

          {/* صورة الأداة */}
          <div className="w-full lg:w-5/12 bg-slate-900 rounded-2xl p-3 shadow-inner border border-slate-800 flex items-center justify-center">
            <img 
              src={tool.imagePath} 
              alt={tool.title} 
              className="w-full h-auto max-h-[300px] object-contain rounded-xl"
            />
          </div>

        </div>

        {/* شبكة الربط الداخلي */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">استكشف المزيد من أدوات منصة إنجازيا السعودية</h2>
            <p className="text-slate-400 text-sm mt-1">منظومة متكاملة من الآلات الحاسبة وأدوات الأتمتة لمضاعفة أرباح متجرك.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            {relatedTools.map((rt, idx) => (
              <Link 
                key={idx} 
                href={`/landing/${rt.slug}`}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-emerald-500 p-4 rounded-xl transition flex flex-col justify-between group"
              >
                <span className="text-sm font-bold text-slate-200 group-hover:text-emerald-400 line-clamp-2">
                  {rt.title}
                </span>
                <span className="text-xs text-emerald-400 mt-3 flex items-center">
                  استخدم الأداة <span className="mr-1">←</span>
                </span>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
