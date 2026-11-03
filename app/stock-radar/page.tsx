'use client'

import { useState, useEffect, useRef, useCallback } from 'react';
import { getStockData } from './actions';

// القائمة الشاملة للأسهم (يمكنك إضافة آلاف الرموز هنا)
const ALL_MARKET_TICKERS = [
  'AAPL', 'MSFT', 'NVDA', 'GOOGL', 'AMZN', 'META', 'TSLA', 'V', 'JPM', 'UNH',
  'WMT', 'MA', 'JNJ', 'PG', 'HD', 'AVGO', 'CVX', 'MRK', 'KO', 'PEP',
  'COST', 'ABBV', 'BAC', 'ADBE', 'MCD', 'CRM', 'CSCO', 'ACN', 'TMO', 'NFLX',
  'ABT', 'LIN', 'ORCL', 'DHR', 'AMD', 'CMCSA', 'WFC', 'DIS', 'INTC', 'TXN',
  'PFE', 'PM', 'COP', 'UNP', 'CAT', 'BA', 'HON', 'AMGN', 'IBM', 'GE',
  'NOW', 'QCOM', 'SPGI', 'GS', 'INTU', 'RTX', 'ISRG', 'BKNG', 'SYK', 'MDLZ',
  'TJX', 'BLK', 'C', 'GILD', 'LMT', 'AXP', 'ZTS', 'MDT', 'ADI', 'SBUX',
  'CB', 'MMC', 'CI', 'MO', 'VRTX', 'BMY', 'DUK', 'SO', 'PLD', 'CVS',
  'SLB', 'EOG', 'BDX', 'T', 'GPN', 'PGR', 'KLAC', 'PANW', 'SNPS', 'CDNS',
  'WM', 'FCX', 'AON', 'ITW', 'APH', 'NKE', 'UBER', 'SQ', 'PYPL', 'SHOP',
  'SNOW', 'PLTR', 'HOOD', 'COIN', 'ROKU', 'ZM', 'PINS', 'DOCU', 'DDOG', 'TEAM',
  'MDB', 'CRWD', 'OKTA', 'ZS', 'NET', 'FSLY', 'TWLO', 'U', 'RBLX', 'DKNG',
  'PTON', 'CHWY', 'ETSY', 'W', 'CVNA', 'LCID', 'RIVN', 'NIO', 'XPEV', 'LI',
  'F', 'GM', 'STLA', 'TM', 'HMC', 'BABA', 'JD', 'PDD', 'BIDU', 'NTES',
  'TCEHY', 'TSM', 'ASML', 'LRCX', 'AMAT', 'MU', 'NXPI', 'MRVL', 'MCHP', 'ON'
];

export default function StockRadarPage() {
  const [stocks, setStocks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef<IntersectionObserver | null>(null);
  
  // عدد الأسهم التي يتم جلبها في كل سحبة شاشة (12 سهماً لتكون سريعة جداً)
  const BATCH_SIZE = 12; 

  const loadMoreStocks = async () => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    const nextBatch = ALL_MARKET_TICKERS.slice(currentIndex, currentIndex + BATCH_SIZE);
    
    if (nextBatch.length === 0) {
      setHasMore(false);
      setIsLoading(false);
      return;
    }

    const results = [];
    for (const ticker of nextBatch) {
      const result = await getStockData(ticker);
      if (result.success && result.data) {
        results.push(result.data);
      }
    }

    setStocks(prev => [...prev, ...results]);
    setCurrentIndex(prev => prev + BATCH_SIZE);
    
    if (currentIndex + BATCH_SIZE >= ALL_MARKET_TICKERS.length) {
      setHasMore(false);
    }
    
    setIsLoading(false);
  };

  // مراقب التمرير اللانهائي (يكتشف وصولك لآخر سهم في الشاشة)
  const lastStockElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMoreStocks();
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore]);

  // تحميل الدفعة الأولى عند بداية فتح الصفحة
  useEffect(() => {
    if (stocks.length === 0) {
      loadMoreStocks();
    }
  }, []);

  return (
    <main className="p-8 bg-gray-950 min-h-screen text-right font-sans text-white" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 border-b border-gray-800 pb-6 flex justify-between items-center sticky top-0 bg-gray-950/90 backdrop-blur z-10 p-4 rounded-xl">
          <div>
            <h1 className="text-3xl font-bold text-blue-500 mb-2">شاشة السوق الشاملة 📈</h1>
            <p className="text-sm text-gray-400">مرر للأسفل وسيستمر الموقع بجلب أسهم جديدة بلا توقف.</p>
          </div>
          <div className="text-sm font-bold bg-gray-900 px-4 py-2 rounded-lg text-blue-400 border border-gray-800">
            الأسهم المعروضة حالياً: {stocks.length}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {stocks.map((stock, index) => {
            const isLast = index === stocks.length - 1;
            return (
              <div 
                key={stock.symbol + index} 
                ref={isLast ? lastStockElementRef : null}
                className="bg-gray-900 p-5 rounded-2xl border border-gray-800 shadow-xl flex flex-col justify-between hover:border-blue-500/50 transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-black text-white">{stock.symbol}</h2>
                    <p className="text-xs text-gray-500 mt-1">PE: {stock.peRatio} | PEG: {stock.pegRatio}</p>
                  </div>
                  <span className="bg-blue-950/50 text-blue-400 px-3 py-1.5 rounded-lg text-lg font-bold border border-blue-900/50">
                    ${stock.price}
                  </span>
                </div>

                <div className="bg-gray-800/50 p-3 rounded-lg mb-4 border border-gray-700/50">
                  <p className="text-xs text-gray-300 leading-relaxed">
                    <span className="text-blue-400 font-bold">💡 رأي Gemini: </span>
                    {stock.analysis}
                  </p>
                </div>

                <div className="mt-auto">
                  <h3 className="text-[10px] font-bold text-gray-500 mb-2">أداء الأيام السابقة:</h3>
                  <div className="space-y-1.5">
                    {stock.history?.map((dayRecord: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center bg-gray-950 p-2 rounded text-xs border border-gray-800">
                        <span className="text-gray-400">{dayRecord.day}</span>
                        <span className={`font-bold flex items-center gap-1 ${dayRecord.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                          {dayRecord.status} ${dayRecord.amount}
                          {dayRecord.isPositive ? '▲' : '▼'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* مؤشر التحميل عند التمرير للأسفل */}
        {isLoading && (
          <div className="text-center py-10 text-blue-400 font-bold text-lg animate-pulse flex justify-center items-center gap-2">
            <svg className="animate-spin h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            جاري جلب الدفعة التالية من الأسهم والتحليل...
          </div>
        )}

        {!hasMore && stocks.length > 0 && (
          <div className="text-center py-10 text-gray-500 font-bold">
            ✅ تم استعراض جميع الأسهم بنجاح.
          </div>
        )}
      </div>
    </main>
  );
}
