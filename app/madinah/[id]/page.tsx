import React from 'react';
import Link from 'next/link';
import placesData from '../../../madinah_places.json';

export default function PlaceDetails({ params }: { params: { id: string } }) {
  const place = placesData.find((p: any) => p.id === params.id);
  if (!place) return (<div className="min-h-screen flex items-center justify-center"><Link href="/madinah" className="text-[#0b6643] font-bold underline">العودة للدليل</Link></div>);
  const icon = place.category ? place.category.split(' ').pop() : '📍';
  const catName = place.category ? place.category.split(' ').slice(0, -1).join(' ') : 'نشاط تجاري';

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
        <div className="w-full bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-4 mb-8 text-center flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition">
          <span className="text-yellow-600 font-bold">مساحة إعلانية لصفحة النشاط</span>
          <span className="text-sm text-yellow-500">استثمر هذه الصفحة للإعلان عن عروض متجرك</span>
        </div>
        <div className="bg-white rounded-[2rem] shadow-lg border border-gray-100 overflow-hidden relative">
          <div className="h-48 bg-gradient-to-r from-[#0b6643] to-[#128258] flex items-center justify-center">
             <span className="text-7xl drop-shadow-xl z-10">{icon}</span>
          </div>
          <div className="px-8 pt-8 pb-10 text-center -mt-6 relative z-20">
            <div className="inline-block bg-white px-6 py-1.5 rounded-full shadow-sm text-sm font-bold text-[#0b6643] border border-gray-100 mb-4">{catName}</div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">{place.name}</h1>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <a href={place.url} target="_blank" rel="noopener noreferrer" className="flex-1 bg-[#111827] hover:bg-gray-800 text-white font-bold py-4 px-6 rounded-2xl shadow-md transition-all flex items-center justify-center gap-3 text-lg">
                <span>🧭</span> التوجه عبر الخرائط
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
