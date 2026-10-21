const fs = require('fs');
const path = require('path');

// مسار ملف الأسئلة الصحيح من الجذر الرئيسي للمشروع
const filePath = path.join(__dirname, 'app', 'qudurat', 'data', 'questions.json');

try {
    console.log('جاري قراءة ملف الأسئلة وفحصه...');
    const data = fs.readFileSync(filePath, 'utf8');
    const questions = JSON.parse(data);

    console.log(`إجمالي عدد الأسئلة في الملف: ${questions.length}`);

    const ids = new Set();
    const texts = new Set();
    let duplicateIds = 0;
    let duplicateTexts = 0;

    questions.forEach((q, index) => {
        // فحص تكرار الـ ID
        if (ids.has(q.id)) {
            console.log(`[تكرار ID]: الـ ID رقم (${q.id}) تكرر في الموقع (السجل رقم ${index})`);
            duplicateIds++;
        } else {
            ids.add(q.id);
        }

        // تنظيف النص لمقارنة التشابه الدقيق
        const cleanText = q.text ? q.text.trim().replace(/\s+/g, ' ') : '';
        if (texts.has(cleanText)) {
            console.log(`[تشابه نص]: السؤال نصاً تكرر: "${q.text}" (ID: ${q.id})`);
            duplicateTexts++;
        } else {
            texts.add(cleanText);
        }
    });

    console.log('\n--- نتائج فحص التكرار ---');
    console.log(`إجمالي التكرارات في المعرّفات (IDs): ${duplicateIds}`);
    console.log(`إجمالي التكرارات في نصوص الأسئلة: ${duplicateTexts}`);
    
    if (duplicateIds === 0 && duplicateTexts === 0) {
        console.log(' مميز جداً! قاعدة البيانات نظيفة 100% ولا يوجد أي سؤال مكرر أو متشابه.');
    } else {
        console.log(' تنبيه: يوجد بعض التكرارات المذكورة أعلاه يرجى مراجعتها.');
    }

} catch (error) {
    console.error('حدث خطأ أثناء قراءة الملف أو تحليل JSON:', error.message);
}
