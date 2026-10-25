import React from 'react';
// تأكد من أن مسار ملف JSON صحيح حسب هيكل مشروعك (غالباً سيكون هكذا إذا كان في المجلد الرئيسي)
import placesData from '../../madinah_places.json'; 

export default function MadinahDirectory() {
  const totalPlaces = placesData.length;
  
  // استخراج الأقسام الفريدة من قاعدة البيانات
  const categories = Array.from(new Set(placesData.map((p: any) => p.category || 'أنشطة أخرى')));

  return (
    <div className="min-h-screen bg-gray-50 font-sans" dir="rtl">
      
      {/* القسم العلوي (Hero Section) */}
      <div className="bg-[#0b6643] text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">دليل المدينة المنورة الشامل</h1>
        <p className="text-lg opacity-90 mb-8">
          يحتوي الدليل الآن على ({totalPlaces}) نشاط تجاري في طيبة الطيبة.
        </p>
        <div className="max-w-2xl mx-auto relative">
          <input 
            type="text" 
            placeholder="ابحث عن محل، خدمة، أو نشاط..." 
            className="w-full py-4 px-6 rounded-full text-gray-800 focus:outline-none opacity-50 cursor-not-allowed" 
            disabled 
          />
        </div>
      </div>

      {/* محتوى الدليل مقسم */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-12 text-gray-800 border-r-4 border-[#0b6643] pr-4">
          الأنشطة التجارية في المدينة ({totalPlaces})
        </h2>

        {/* تكرار الأقسام */}
        {categories.map((category: any) => {
          // فلترة المحلات لتناسب القسم الحالي
          const categoryPlaces = placesData.filter((p: any) => (p.category || 'أنشطة أخرى') === category);

          return (
            <div key={category} className="mb-16">
              
              {/* عنوان القسم */}
              <div className="mb-6 flex items-center gap-3">
                <h3 className="text-2xl font-bold text-gray-800 bg-white px-6 py-2 rounded-full shadow-sm border border-gray-200 inline-block">
                  {category}
                </h3>
                <span className="text-[#0b6643] font-semibold bg-[#e7f5f0] px-3 py-1 rounded-full text-sm">
                  {categoryPlaces.length} نشاط
                </span>
              </div>

              {/* شبكة البطاقات لهذا القسم */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {categoryPlaces.map((place: any, index: number) => (
                  <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                    
                    {/* رأس البطاقة */}
                    <div className="bg-[#f2fbfa] h-32 flex items-center justify-center">
                      <span className="text-4xl">📍</span>
                    </div>
                    
                    {/* تفاصيل البطاقة */}
                    <div className="p-5 flex flex-col items-center text-center flex-grow">
                      <p className="text-[#0b6643] text-xs font-semibold mb-2">تمت إضافته آلياً</p>
                      <h4 className="font-bold text-gray-800 text-base mb-2 line-clamp-2">{place.name}</h4>
                      <p className="text-gray-500 text-xs mb-4">المدينة المنورة (من خرائط قوقل) 📍</p>
                      
                      {/* زر قوقل ماب */}
                      <a 
                        href={place.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="mt-auto w-full bg-[#111827] text-white py-2.5 rounded-xl hover:bg-gray-800 transition text-sm font-medium"
                      >
                        عرض في قوقل ماب
                      </a>
                    </div>

                  </div>
                ))}
              </div>
              
            </div>
          );
        })}
      </div>
    </div>
  );
}
