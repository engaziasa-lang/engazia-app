const fs = require('fs');

// قراءة ملف الأسئلة الأصلي
const rawData = fs.readFileSync('questions.json', 'utf8');
const questions = JSON.parse(rawData);

const uniqueQuestions = [];
const seenTexts = new Set();

questions.forEach(q => {
    // توحيد النص لإزالة المسافات الزائدة لضمان دقة المقارنة
    const cleanText = q.text.trim().replace(/\s+/g, ' ');
    
    if (!seenTexts.has(cleanText)) {
        seenTexts.add(cleanText);
        uniqueQuestions.push(q);
    }
});

// حفظ الأسئلة غير المكررة في ملف جديد
fs.writeFileSync('unique_questions.json', JSON.stringify(uniqueQuestions, null, 2), 'utf8');

console.log(`تم التنظيف بنجاح!`);
console.log(`العدد الأصلي: ${questions.length}`);
console.log(`العدد الصافي بدون تكرار: ${uniqueQuestions.length}`);
