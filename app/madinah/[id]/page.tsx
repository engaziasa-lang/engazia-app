import React from 'react';
import Link from 'next/link';
import placesData from '../../../madinah_places.json';

export default function PlaceDetails({ params }: { params: { id: string } }) {
  const place = placesData.find((p: any) => p.id === params.id);
  if (!place) return (<div className="min-h-screen flex items-center justify-center"><Link href="/madinah" className="text-[#0b6643] font-bold underline">العودة للدليل</Link></div>);
  
  const icon = place.category ? place.category.split(' ').pop() : '📍';
  const catName = place.category ? place.category.split(' ').slice(0, -1).join(' ') : 'نشاط تجاري';
  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(place.name + ' المدينة المنورة')}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-10" dir="rtl">
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/madinah" className="flex items-center gap-2 text-gray-600 hover:text-[#0b6643] font-bold transition">
            <span className="text-xl">➔</span> <span>العودة للدليل</span>
          </Link>
          <h2 className="font-bold text-[#0b6643]">إنجازيا للحلول الرقمية</h2>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-8">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between shadow-sm">
          <div className="text-right mb-4 md:mb-0">
            <h3 className="font-bold text-blue-900 text-lg flex items-center gap-2">
              <span>💼</span> هل أنت مالك ({place.name})؟
            </h3>
            <p className="text-blue-700 text-sm mt-1">طالب بملكية هذا النشاط لإنشاء حسابك وتحديث بيانات المحل وإدارة الإعلانات.</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all whitespace-nowrap">
            أنا صاحب النشاط ➔
          </button>
        </div>

        <div className="bg-white rounded-[2rem] shadow-lg border border-gray-100 overflow-hidden relative mb-8">
          <div className="h-48 bg-gradient-to-r from-[#0b6643] to-[#128258] flex items-center justify-center relative">
             <span className="text-7xl drop-shadow-xl z-10">{icon}</span>
             <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold border border-white/30">غير موثق</div>
          </div>
          <div className="px-6 md:px-12 pt-8 pb-10 text-center -mt-6 relative z-20">
            <div className="inline-block bg-white px-6 py-1.5 rounded-full shadow-sm text-sm font-bold text-[#0b6643] border border-gray-100 mb-4">{catName}</div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">{place.name}</h1>
            
            <div className="text-right mb-4 border-t pt-8">
               <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2 mb-4"><span>📍</span> موقع النشاط:</h3>
               <div className="rounded-2xl overflow-hidden border-2 border-gray-100 shadow-inner h-72 w-full bg-gray-100">
                  <iframe src={mapEmbedUrl} width="100%" height="100%" style={{ border: 0 }} loading="lazy"></iframe>
               </div>
            </div>
            
            <div className="flex justify-center mt-6">
              <a href={place.url} target="_blank" rel="noopener noreferrer" className="bg-[#111827] hover:bg-gray-800 text-white font-bold py-3 px-8 rounded-2xl shadow-md transition-all flex items-center gap-3">
                <span>🧭</span> فتح في تطبيق خرائط قوقل
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
