const fs = require('fs');

const places = JSON.parse(fs.readFileSync('madinah_places.json', 'utf-8'));

const categorize = (name) => {
  if (!name) return 'أنشطة متنوعة';
  const lowerName = name.toLowerCase();
  if (lowerName.includes('مطعم') || lowerName.includes('مشويات') || lowerName.includes('بخاري') || lowerName.includes('بروست') || lowerName.includes('مطبخ') || lowerName.includes('شاورما')) return 'المطاعم 🍔';
  if (lowerName.includes('مقهى') || lowerName.includes('كافيه') || lowerName.includes('قهوة') || lowerName.includes('cafe') || lowerName.includes('روستري')) return 'المقاهي والكافيهات ☕';
  if (lowerName.includes('فندق') || lowerName.includes('شقق') || lowerName.includes('أجنحة') || lowerName.includes('هوتيل') || lowerName.includes('hotel')) return 'الفنادق والشقق المخدومة 🏨';
  if (lowerName.includes('صيدلية') || lowerName.includes('مستشفى') || lowerName.includes('مستوصف') || lowerName.includes('عيادة') || lowerName.includes('طبية')) return 'الصحة والخدمات الطبية 💊';
  if (lowerName.includes('سوبر') || lowerName.includes('ماركت') || lowerName.includes('تموينات') || lowerName.includes('سوق') || lowerName.includes('مول') || lowerName.includes('هايبر')) return 'الأسواق والتموينات 🛒';
  if (lowerName.includes('عقار') || lowerName.includes('أملاك')) return 'مكاتب العقار 🏢';
  return 'أنشطة وخدمات أخرى 📌';
};

const updatedPlaces = places.map(p => ({
  ...p,
  category: p.category || categorize(p.name)
}));

fs.writeFileSync('madinah_places.json', JSON.stringify(updatedPlaces, null, 2), 'utf-8');
console.log('✅ تم بنجاح تصنيف جميع الأنشطة الـ ' + updatedPlaces.length + ' وإضافة الأقسام.');
