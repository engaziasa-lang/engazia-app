'use client';
import React, { useState } from 'react';
import placesData from '../../madinah_places.json';

export default function MadinahDirectory() {
  const totalPlaces = placesData.length;
  const categories = Array.from(new Set(placesData.map((p: any) => p.category || 'أنشطة أخرى')));
  
  // تفعيل حالة لتتبع القسم الذي يضغط عليه المستخدم (الافتراضي هو أول قسم)
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  // جلب المحلات التي تتبع القسم النشط فقط
  const categoryPlaces = placesData.filter((p: any) => (p.category || 'أنشطة أخرى') === activeCategory);

  // دالة لفصل الإيموجي ليكون أيقونة للزر
  const getIcon = (catName: string) => {
    const parts = catName.split(' ');
    return parts.length > 1 ? parts[parts.length - 1] : '📍';
  };
  
  // دالة لفصل النص عن الإيموجي
  const getText = (catName: string) => {
    const parts = catName.split(' ');
    if (parts.length > 1) {
        parts.pop();
        return parts.join(' ');
    }
    return catName;
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20" dir="rtl">
      
      {/* رأس الصفحة */}
      <div className="bg-[#0b6643] text-white py-12 px-4 text-center rounded-b-[2rem] shadow-sm">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">دليل المدينة المنورة</h1>
        <p className="text-md opacity-90 mb-2">اكتشف ({totalPlaces}) نشاط تجاري بسهولة</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-6 relative z-10">
        
        {/* مساحة إعلانية رئيسية (علوية) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-3 mb-8 flex justify-center items-center h-28 text-gray-400 hover:bg-gray-50 transition cursor-pointer">
            <div className="border-2 border-dashed border-gray-300 w-full h-full rounded-xl flex flex-col items-center justify-center bg-gray-50">
                <span className="font-bold text-gray-500 text-lg">مساحة إعلانية مميزة</span>
                <span className="text-xs text-gray-400">احجز هذا المساحة لمتجرك</span>
            </div>
        </div>

        {/* شريط الأيقونات (الأقسام) */}
        <div className="mb-10">
           <h2 className="text-lg font-bold mb-4 text-gray-800 px-1">تصفح حسب القسم:</h2>
           <div className="flex overflow-x-auto gap-3 pb-4 snap-x hide-scroll-bar">
             {categories.map((cat: any) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`snap-center flex-shrink-0 flex flex-col items-center justify-center w-24 h-24 rounded-2xl transition-all ${
                    activeCategory === cat
                      ? 'border-2 border-[#0b6643] bg-[#0b6643] text-white shadow-lg scale-105'
                      : 'border border-gray-200 bg-white text-gray-600 shadow-sm hover:border-[#0b6643] hover:text-[#0b6643]'
                  }`}
                >
                  <span className="text-3xl mb-2">{getIcon(cat)}</span>
                  <span className="text-[10px] font-bold text-center leading-tight px-1">{getText(cat)}</span>
                </button>
             ))}
           </div>
        </div>

        {/* مساحة إعلانية فرعية (وسطى) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 mb-8 flex justify-center items-center h-20 text-gray-400 hover:bg-gray-50 transition">
            <span className="text-sm font-semibold">إعلان لراعي قسم {getText(activeCategory)}</span>
        </div>

        {/* عنوان القسم النشط */}
        <div className="mb-6 flex justify-between items-center border-b border-gray-200 pb-3 px-2">
           <h2 className="text-xl font-bold text-gray-800">{getText(activeCategory)}</h2>
           <span className="bg-[#e7f5f0] text-[#0b6643] px-3 py-1 rounded-full text-xs font-bold">{categoryPlaces.length} محل</span>
        </div>

        {/* شبكة المحلات التابعة للقسم المختار فقط */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
           {categoryPlaces.map((place: any, index: number) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-all">
                 <div className="bg-[#f8f9fa] h-20 flex items-center justify-center border-b border-gray-50">
                    <span className="text-3xl">{getIcon(activeCategory)}</span>
                 </div>
                 <div className="p-3 flex flex-col items-center text-center flex-grow">
                    <h4 className="font-bold text-gray-800 text-sm mb-1 line-clamp-2 leading-tight">{place.name}</h4>
                    <p className="text-gray-400 text-[10px] mb-3">المدينة المنورة</p>
                    <a 
                      href={place.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="mt-auto w-full bg-gray-100 text-gray-700 hover:bg-[#0b6643] hover:text-white py-2 rounded-lg transition text-xs font-bold"
                    >
                       عرض الموقع
                    </a>
                 </div>
              </div>
           ))}
        </div>

      </div>
    </div>
  );
}
