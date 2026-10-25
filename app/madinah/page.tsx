'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function MadinahHub() {
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 1, name: 'مطاعم ومقاهي', icon: '🍽️', count: 124 },
    { id: 2, name: 'عقارات ومقاولات', icon: '🏢', count: 85 },
    { id: 3, name: 'متاجر وتجزئة', icon: '🛍️', count: 210 },
    { id: 4, name: 'سيارات وصيانة', icon: '🚗', count: 64 },
    { id: 5, name: 'صحة وجمال', icon: '⚕️', count: 42 },
    { id: 6, name: 'فنادق وسياحة', icon: '🏨', count: 56 },
    { id: 7, name: 'خدمات عامة وتعقيب', icon: '📝', count: 38 },
    { id: 8, name: 'تقنية وحلول مالية', icon: '💻', count: 15 },
  ];

  const featuredShops = [
    { id: 'al-faham-grills', name: 'مطاعم الفحم المشوي', category: 'مطاعم ومقاهي', location: 'طريق سلطانة', image: '🍔', isPremium: true },
    { id: 'rakan-services', name: 'مكتب راكان للخدمات العامة', category: 'خدمات عامة وتعقيب', location: 'خلف شركة الكهرباء', image: '🏛️', isPremium: true },
    { id: 'engazia-tech', name: 'إنجازيا للحلول المالية', category: 'تقنية وحلول مالية', location: 'أونلاين - المدينة', image: '⚡', isPremium: true },
    { id: 'madinah-realestate', name: 'قمة طيبة للعقارات', category: 'عقارات ومقاولات', location: 'الدائري الثاني', image: '🏗️', isPremium: false },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <header className="bg-emerald-700 text-white py-20 px-6 text-center shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">دليل المدينة المنورة الشامل</h1>
          <p className="text-lg md:text-xl text-emerald-100 mb-8">
            اكتشف أفضل المحلات، الماركات، والخدمات في طيبة الطيبة. كل ما تحتاجه في منصة واحدة.
          </p>
          <div className="flex flex-col md:flex-row gap-3 justify-center max-w-2xl mx-auto">
            <input 
              type="text" 
              placeholder="ابحث عن محل، خدمة، أو نشاط..." 
              className="w-full px-6 py-4 rounded-xl text-gray-800 text-lg focus:outline-none focus:ring-4 focus:ring-emerald-400 shadow-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors shadow-md whitespace-nowrap">
              بحث
            </button>
          </div>
        </div>
      </header>

      <div className="bg-amber-100 border-b-4 border-amber-500 py-4 px-6 text-center">
        <p className="text-amber-900 font-semibold text-sm md:text-base">
          🚀 هل أنت صاحب عمل في المدينة المنورة؟ <a href="#add-business" className="text-emerald-700 underline font-bold mx-1">أضف محلك الآن</a> واحصل على صفحة هبوط مجانية وحلول مالية متقدمة من إنجازيا.
        </p>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <section className="mb-16">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 border-r-4 border-emerald-500 pr-4">
              جميع الأنشطة
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <div key={cat.id} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col items-center justify-center text-center cursor-pointer group">
                <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">{cat.icon}</span>
                <h3 className="font-bold text-gray-800">{cat.name}</h3>
                <span className="text-sm text-emerald-600 mt-1">{cat.count} نشاط</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 border-r-4 border-emerald-500 pr-4 mb-8">
            محلات وخدمات نوصي بها
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredShops.map((shop) => (
              <div key={shop.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100 relative flex flex-col">
                {shop.isPremium && (
                  <span className="absolute top-3 left-3 bg-amber-400 text-amber-900 text-xs font-bold px-2 py-1 rounded-full z-10">
                    مميز ⭐
                  </span>
                )}
                <div className="h-32 bg-emerald-50 flex items-center justify-center text-5xl">
                  {shop.image}
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <span className="text-xs text-emerald-600 font-bold mb-1">{shop.category}</span>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{shop.name}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mb-4">
                    📍 {shop.location}
                  </p>
                  <div className="mt-auto">
                    <Link href={`/madinah/${shop.id}`} className="block w-full text-center bg-gray-900 hover:bg-emerald-600 text-white py-2 rounded-lg text-sm font-semibold transition-colors">
                      زيارة صفحة المحل
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="add-business" className="bg-emerald-900 rounded-3xl p-8 md:p-12 text-white text-center shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">اجعل محلك المرجع الأول في المدينة</h2>
            <p className="text-emerald-100 mb-8">
              انضم لمئات الأنشطة التجارية واحصل على: صفحة هبوط احترافية، باركود (QR) مخصص لمحلك، وحلول إدارية ومالية متقدمة لرفع مبيعاتك.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3 px-8 rounded-xl transition-colors">
                تسجيل المحل (مجاناً)
              </button>
              <button className="bg-white text-emerald-900 hover:bg-gray-100 font-bold py-3 px-8 rounded-xl transition-colors">
                تواصل مع فريق إنجازيا
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
