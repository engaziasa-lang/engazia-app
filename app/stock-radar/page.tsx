'use client'

import { useState, useEffect, useRef } from 'react';
import { getStockData } from './actions';

// قائمة ضخمة لأهم أسهم السوق سيتم تحميلها تلقائياً بالتدريج
const HUGE_MARKET_LIST = [
  'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'META', 'NFLX', 'AMD', 'INTC',
  'JPM', 'BAC', 'V', 'MA', 'JNJ', 'UNH', 'XOM', 'CVX', 'WMT', 'PG', 'BA', 'DIS',
  'CSCO', 'ORCL', 'CRM', 'ADBE', 'PYPL', 'SQ', 'UBER', 'KO', 'PEP', 'MCD', 'NKE'
];

export default function StockRadarPage() {
  const [stocks, setStocks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const loadedTickers = useRef(new Set());

  // دالة التحميل المتتالي (تحميل الأسهم واحداً تلو الآخر لتجنب الضغط وتعليق الموقع)
  useEffect(() => {
    let isMounted = true;
    
    const loadAllStocks = async () => {
      setIsLoading(true);
      for (const ticker of HUGE_MARKET_LIST) {
        if (!isMounted) break;
        if (loadedTickers.current.has(ticker)) continue;

        const result = await getStockData(ticker);
        if (result.success && result.data && isMounted) {
          setStocks(prev => [...prev, result.data]);
          loadedTickers.current.add(ticker);
        }
      }
      if (isMounted) setIsLoading(false);
    };

    loadAllStocks();
    return () => { isMounted = false; };
  }, []);

  return (
    <main className="p-8 bg-gray-950 min-h-screen text-right font-sans text-white" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 border-b border-gray-800 pb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-blue-500 mb-2">شاشة التداول الشاملة 📈</h1>
            <p className="text-sm text-gray-400">مراقبة حية لجميع الأسهم مع تقويم الأرباح والخسائر اليومية.</p>
          </div>
          <div className="text-sm font-bold bg-gray-900 px-4 py-2 rounded-lg text-blue-400">
            {isLoading ? '⏳ جاري جلب باقي السوق...' : '✅ تم تحديث جميع الأسهم'}
          </div>
        </div>

        {/* شبكة الأسهم والتقويم */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {stocks.map((stock) => (
            <div key={stock.symbol} className="bg-gray-900 p-5 rounded-2xl border border-gray-800 shadow-xl flex flex-col justify-between hover:border-blue-500/50 transition-all">
              
              {/* الرأس: السعر والرمز */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-black text-white">{stock.symbol}</h2>
                  <p className="text-xs text-gray-500 mt-1">PE: {stock.peRatio} | PEG: {stock.pegRatio}</p>
                </div>
                <span className="bg-blue-950/50 text-blue-400 px-3 py-1.5 rounded-lg text-lg font-bold border border-blue-900/50">
                  ${stock.price}
                </span>
              </div>

              {/* رأي الذكاء الاصطناعي */}
              <div className="bg-gray-800/50 p-3 rounded-lg mb-4 border border-gray-700/50">
                <p className="text-xs text-gray-300 leading-relaxed">
                  <span className="text-blue-400 font-bold">💡 رأي Gemini: </span>
                  {stock.analysis}
                </p>
              </div>

              {/* التقويم الصغير (الأرباح والخسائر اليومية) */}
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
          ))}
        </div>
      </div>
    </main>
  );
}
