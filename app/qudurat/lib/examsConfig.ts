// app/qudurat/lib/examsConfig.ts

export interface Exam {
  id: number;
  title: string;
  description: string;
  isFree: boolean;
  startIndex: number;
  endIndex: number;
}

export const EXAMS_DATA: Exam[] = Array.from({ length: 30 }, (_, index) => {
  const examNumber = index + 1;
  return {
    id: examNumber,
    title: `الاختبار المحاكي الشامل ${examNumber}`,
    description: "125 سؤال - قسم كمي ولفظي مدمج",
    isFree: examNumber === 1, // الاختبار الأول فقط مجاني والبقية للمشتركين
    startIndex: index * 125,  // نقطة البداية لقص الأسئلة (لكل اختبار 125 سؤالاً فريداً)
    endIndex: (index + 1) * 125, // نقطة النهاية (تغطي 3750 سؤالاً كاملاً لـ 30 اختباراً)
  };
});
