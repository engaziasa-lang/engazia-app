'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import placesData from '../../madinah_places.json';

export default function MadinahDirectory() {
  const categories = Array.from(new Set(placesData.map((p: any) => p.category)));
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const categoryPlaces = placesData.filter((p: any) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#f3f4f6] font-sans pb-20" dir="rtl">
      <div className="bg-gradient-to-b from-[#0b6643] to-[#128258] text-white py-16 px-4 text-center rounded-b-[3rem] shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">دليل المدينة المنورة</h1>
          <p className="text-lg font-medium opacity-90 mb-2">اكتشف ({placesData.length}) نشاط تجاري مميز</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-1 mb-10 flex justify-center items-center h-28 hover:shadow-2xl transition cursor-pointer">
          <div className="border-2 border-dashed border-[#0b6643]/30 w-full h-full rounded-xl flex flex-col items-center justify-center bg-gradient-to-r from-green-50 to-emerald-50">
              <span className="font-bold text-[#0b6643] text-lg">مساحة إعلانية رئيسية</span>
              <span className="text-sm text-gray-500 mt-1">اضغط هنا لحجز المساحة وتصدر الدليل</span>
          </div>
        </div>

        <div className="mb-12">
           <div className="flex overflow-x-auto gap-4 pb-6 snap-x hide-scroll-bar px-2">
             {categories.map((cat: any) => {
                const icon = cat.split(' ').pop();
                const title = cat.split(' ').slice(0, -1).join(' ');
                const isActive = activeCategory === cat;
                return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`snap-center flex-shrink-0 flex flex-col items-center justify-center w-28 h-28 rounded-3xl transition-all duration-300 ${
                    isActive
                      ? 'bg-[#0b6643] text-white shadow-[0_10px_20px_rgba(11,102,67,0.3)] scale-110 -translate-y-2'
                      : 'bg-white text-gray-600 shadow-md hover:shadow-lg hover:-translate-y-1'
                  }`}
                >
                  <span className="text-4xl mb-3">{icon}</span>
                  <span className="text-xs font-bold text-center leading-tight px-2">{title}</span>
                </button>
             )})}
           </div>
        </div>

        <div className="mb-6 flex justify-between items-end border-b-2 border-gray-200 pb-4 px-2">
           <h2 className="text-2xl font-black text-gray-800 tracking-tight">{activeCategory.split(' ').slice(0, -1).join(' ')}</h2>
           <span className="bg-[#0b6643]/10 text-[#0b6643] px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">{categoryPlaces.length} منشأة</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
           {categoryPlaces.map((place: any) => {
              const icon = activeCategory.split(' ').pop();
              return (
              <Link href={`/madinah/${place.id}`} key={place.id} className="block group">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-2xl hover:border-green-200 transition-all duration-300 h-full transform group-hover:-translate-y-2">
                   <div className="bg-gradient-to-br from-gray-50 to-gray-100 h-32 flex items-center justify-center relative">
                      <span className="text-5xl drop-shadow-md transform group-hover:scale-110 transition-transform duration-300">{icon}</span>
                   </div>
                   <div className="p-5 flex flex-col items-start flex-grow">
                      <h4 className="font-extrabold text-gray-900 text-lg mb-2 line-clamp-2 leading-snug group-hover:text-[#0b6643] transition-colors">{place.name}</h4>
                      <div className="mt-auto w-full bg-gray-50 text-[#0b6643] group-hover:bg-[#0b6643] group-hover:text-white py-3 rounded-xl transition-colors duration-300 text-sm font-bold text-center border border-gray-100 group-hover:border-[#0b6643]">
                         عرض صفحة النشاط
                      </div>
                   </div>
                </div>
              </Link>
           )})}
        </div>
      </div>
    </div>
  );
}
