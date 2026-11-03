'use server'

export async function getStockData(symbol: string) {
  try {
    const formattedSymbol = symbol.trim().toUpperCase();
    if (!formattedSymbol) {
      return { success: false, error: 'الرجاء إدخال رمز السهم' };
    }

    // سعر عشوائي بين 50 و 500
    const currentPrice = (Math.random() * (500 - 50) + 50).toFixed(2);
    const priceNum = parseFloat(currentPrice);
    
    // السعر بالريال
    const priceSAR = (priceNum * 3.75).toFixed(2);
    
    // نسبة الدخول المقترح
    const discount = priceNum * (Math.random() * (0.05 - 0.01) + 0.01);
    const suggestedEntryPrice = (priceNum - discount).toFixed(2);

    // المؤشرات المالية
    const peRatio = (Math.random() * (50 - 10) + 10).toFixed(1);
    const pegRatio = (Math.random() * (3 - 0.5) + 0.5).toFixed(2);

    const signals = [
      '✅ ممتاز للدخول تدريجياً',
      '⏳ يفضل انتظار تصحيح السعر',
      '🚀 شراء قوي - زخم صاعد',
      '⚠️ تشبع شرائي - جني أرباح محتمل'
    ];
    const entrySignal = signals[Math.floor(Math.random() * signals.length)];

    const analyses = [
      'السهم يظهر قوة في الأرباح الربعية مع توقعات بنمو القطاع بنسبة 15% هذا العام.',
      'تجاوز السهم متوسط 50 يوماً، مما يعزز النظرة الإيجابية على المدى المتوسط.',
      'هناك ضغوط بيع طفيفة بسبب تقارير التضخم، لكن الأساسيات تظل قوية.',
      'السهم يتداول في قناة صاعدة، اختراق المقاومة القادمة قد يفتح المجال لأهداف أعلى.'
    ];
    const analysis = analyses[Math.floor(Math.random() * analyses.length)];

    // توليد سجل تداول لآخر 30 يوم تداول (مع استثناء العطل الأسبوعية)
    const generateHistory = () => {
      const history = [];
      let totalAmount = 0;
      const daysOfWeek = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
      const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
      
      let currentDate = new Date();
      let addedDays = 0;
      let daysOffset = 0;

      // نستمر في الحلقة حتى نجمع 30 يوم عمل
      while (addedDays < 30) {
        let d = new Date();
        d.setDate(currentDate.getDate() - daysOffset);
        
        let dayOfWeek = d.getDay();
        
        // تخطي أيام الإجازات لأسواق الأسهم (السبت = 6، الأحد = 0)
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          const isPositive = Math.random() > 0.4;
          const amount = parseFloat((Math.random() * (5 - 0.1) + 0.1).toFixed(2));
          
          history.push({
            day: `${daysOfWeek[dayOfWeek]}، ${d.getDate()} ${months[d.getMonth()]}`,
            status: isPositive ? 'ربح' : 'خسر',
            amount: amount.toFixed(2),
            isPositive: isPositive
          });
          
          if(isPositive) totalAmount += amount;
          else totalAmount -= amount;
          
          addedDays++;
        }
        daysOffset++; // المضي يوماً للوراء
      }
      
      return {
        history30Days: history,
        total30Days: Math.abs(totalAmount).toFixed(2),
        isTotalPositive: totalAmount >= 0,
        total30DaysSAR: (Math.abs(totalAmount) * 3.75).toFixed(2)
      };
    };

    const historyData = generateHistory();

    const generateStats = (periodBase: number, volatility: number) => {
       const isPositive = Math.random() > 0.3; 
       const percentage = parseFloat((Math.random() * volatility).toFixed(1));
       const amount = parseFloat(((percentage / 100) * priceNum).toFixed(2));
       const pastPrice = isPositive ? (priceNum - amount).toFixed(2) : (priceNum + amount).toFixed(2);

       return {
         value: `${percentage}%`,
         amount: amount.toFixed(2),
         pastPrice: pastPrice,
         isPositive: isPositive
       };
    };

    const stats = {
      m3: generateStats(3, 15),
      m6: generateStats(6, 25),
      y1: generateStats(12, 40),
      y2: generateStats(24, 60),
      y3: generateStats(36, 90),
      y5: generateStats(60, 150)
    };

    const stockData = {
      symbol: formattedSymbol,
      price: currentPrice,
      priceSAR: priceSAR,
      suggestedEntryPrice: suggestedEntryPrice,
      peRatio: peRatio,
      pegRatio: pegRatio,
      entrySignal: entrySignal,
      analysis: analysis,
      ...historyData,
      stats: stats
    };

    return {
      success: true,
      data: stockData
    };

  } catch (error) {
    console.error('Error fetching stock data:', error);
    return {
      success: false,
      error: 'حدث خطأ أثناء استرجاع بيانات السهم.'
    };
  }
}
