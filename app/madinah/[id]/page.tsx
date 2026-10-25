import React from 'react';
import Link from 'next/link';
import placesData from '../../../madinah_places.json';

export default function PlaceDetails({ params }: { params: { id: string } }) {
  const place = placesData.find((p: any) => p.id === params.id);
  if (!place) return (<div className="min-h-screen flex items-center justify-center"><Link href="/madinah" className="text-[#0b6643] font-bold underline">العودة للدليل</Link></div>);
  
  const icon = place.category ? place.category.split(' ').pop() : '📍';
  const catName = place.category ? place.category.split(' ').slice(0, -1).join(' ') : 'نشاط تجاري';

  // رابط تضمين الخريطة الذكي بناءً على اسم النشاط
  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(place.name + ' المدينة المنورة')}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-10" dir="rtl">
      {/* الشريط العلوي */}
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/madinah" className="flex items-center gap-2 text-gray-600 hover:text-[#0b6643] font-bold transition">
            <span className="text-xl">➔</span> <span>العودة للدليل</span>
          </Link>
          <h2 className="font-bold text-[#0b6643]">إنجازيا للحلول الرقمية</h2>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-8">
        {/* مساحة إعلانية */}
        <div className="w-full bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-4 mb-8 text-center flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition">
          <span className="text-yellow-600 font-bold">مساحة إعلانية لصفحة النشاط</span>
          <span className="text-sm text-yellow-500">استثمر هذه الصفحة للإعلان عن عروض متجرك</span>
        </div>

        {/* البطاقة الرئيسية وتفاصيل المحل */}
        <div className="bg-white rounded-[2rem] shadow-lg border border-gray-100 overflow-hidden relative">
          <div className="h-48 bg-gradient-to-r from-[#0b6643] to-[#128258] flex items-center justify-center">
             <span className="text-7xl drop-shadow-xl z-10">{icon}</span>
          </div>
          
          <div className="px-6 md:px-12 pt-8 pb-10 text-center -mt-6 relative z-20">
            <div className="inline-block bg-white px-6 py-1.5 rounded-full shadow-sm text-sm font-bold text-[#0b6643] border border-gray-100 mb-4">{catName}</div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">{place.name}</h1>
            
            {/* أزرار الإجراءات */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <a href={place.url} target="_blank" rel="noopener noreferrer" className="flex-1 bg-[#111827] hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-2xl shadow-md transition-all flex items-center justify-center gap-3 text-lg">
                <span>🧭</span> فتح في تطبيق الخرائط
              </a>
            </div>

            {/* الخريطة المضمنة (Iframe) */}
            <div className="text-right mb-4">
               <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                 <span>📍</span> موقع النشاط على الخريطة:
               </h3>
            </div>
            <div className="rounded-2xl overflow-hidden border-2 border-gray-100 shadow-inner h-72 md:h-96 w-full bg-gray-100">
               <iframe 
                  src={mapEmbedUrl}
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={false} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
               ></iframe>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
