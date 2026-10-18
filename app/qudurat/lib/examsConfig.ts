export const EXAMS_DATA = Array.from({ length: 10 }, (_, index) => {
  const examNumber = index + 1;
  return {
    id: examNumber,
    title: `الاختبار المحاكي الشامل ${examNumber}`,
    description: "125 سؤال - قسم كمي ولفظي مدمج",
    isFree: examNumber === 1,
    startIndex: index * 125,
    endIndex: (index + 1) * 125,
  };
});
