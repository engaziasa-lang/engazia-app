'use client'

import { useState, useEffect, useRef, useCallback } from 'react';
import { getStockData } from './actions';

const ALL_MARKET_TICKERS = [
  'AAPL', 'MSFT', 'NVDA', 'GOOGL', 'AMZN', 'META', 'TSLA', 'V', 'JPM', 'UNH',
  'WMT', 'MA', 'JNJ', 'PG', 'HD', 'AVGO', 'CVX', 'MRK', 'KO', 'PEP',
  'COST', 'ABBV', 'BAC', 'ADBE', 'MCD', 'CRM', 'CSCO', 'ACN', 'TMO', 'NFLX'
];

export default function StockRadarPage() {
  const [stocks, setStocks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const observer = useRef<IntersectionObserver | null>(null);
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

    const results: any[] = [];
    for (const ticker of nextBatch) {
      if (!stocks.some(s => s.symbol === ticker)) {
        const result = await getStockData(ticker);
        if (result.success && result.data) results.push(result.data);
      }
    }

    setStocks(prev => [...prev, ...results]);
    setCurrentIndex(prev => prev + BATCH_SIZE);
    if (currentIndex + BATCH_SIZE >= ALL_MARKET_TICKERS.length) setHasMore(false);
    setIsLoading(false);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || isSearching) return;
    
    setIsSearching(true);
    const result = await getStockData(searchQuery);
    
    if (result.success && result.data) {
      setStocks(prev => [result.data, ...prev.filter(s => s.symbol !== result.data.symbol)]);
      setSearchQuery('');
    } else {
      alert("لم يتم العثور على السهم، تأكد من الرمز.");
    }
    setIsSearching(false);
  };

  const lastStockElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) loadMoreStocks();
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore]);

  useEffect(() => {
    if (stocks.length === 0) loadMoreStocks();
  }, []);

  return (
    <main className="p-8 bg-gray-950 min-h-screen text-right font-sans text-white" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 border-b border-gray-800 pb-6 sticky top-0 bg-gray-950/90 backdrop-blur z-10 p-4 rounded-xl shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-blue-500 mb-2">شاشة السوق الشاملة 📈</h1>
              <p className="text-sm text-gray-400">تحليل لحظي وتاريخي مع تحديد أفضل فرص وأسعار الدخول.</p>
            </div>
            
            <form onSubmit={handleSearch} className="flex w-full md:w-auto gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value.toUpperCase())}
                placeholder="ابحث عن رمز سهم (مثال AAPL)..."
                className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500 w-full md:w-64 text-left"
                dir="ltr"
              />
              <button 
                type="submit" 
                disabled={isSearching || !searchQuery.trim()}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-50 min-w-[80px]"
              >
                {isSearching ? 'يبحث...' : 'اصطياد'}
              </button>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {stocks.map((stock, index) => {
            const isLast = index === stocks.length - 1;
            return (
              <div 
                key={stock.symbol + index} 
                ref={isLast ? lastStockElementRef : null}
                className="bg-gray-900 p-5 rounded-2xl border border-gray-800 shadow-xl flex flex-col justify-between hover:border-blue-500/50 transition-all h-full"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-black text-white">{stock.symbol}</h2>
                    <p className="text-[10px] text-gray-500 mt-1">PE: {stock.peRatio} | PEG: {stock.pegRatio}</p>
                  </div>
                  <span className="bg-blue-950/50 text-blue-400 px-3 py-1.5 rounded-lg text-lg font-bold border border-blue-900/50">
                    ${stock.price}
                  </span>
                </div>

                <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-3 rounded-lg mb-4 border border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[11px] font-bold text-gray-400">السعر المحدد للدخول:</span>
                    <span className="text-sm font-black text-green-400">${stock.suggestedEntryPrice}</span>
                  </div>
                  <p className="text-xs font-bold mb-2">{stock.entrySignal}</p>
                  <p className="text-[10px] text-gray-300 leading-relaxed border-t border-gray-700 pt-2 mt-2">
                    <span className="text-blue-400 font-bold">💡 تحليل Gemini: </span>{stock.analysis}
                  </p>
                </div>

                <div className="bg-gray-950/50 border border-gray-800 rounded-lg p-2 mb-3">
                  <h3 className="text-[10px] font-bold text-gray-400 mb-2 px-1">سجل التداول (آخر 30 يوم):</h3>
                  <div className="space-y-1 max-h-32 overflow-y-auto pl-1 custom-scrollbar">
                    {stock.history30Days?.map((dayRecord: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center text-[10px] p-1.5 border-b border-gray-800/50 last:border-0">
                        <span className="text-gray-400">{dayRecord.day}</span>
                        <span className={`font-bold flex items-center gap-1 ${dayRecord.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                          {dayRecord.status} ${dayRecord.amount} {dayRecord.isPositive ? '▲' : '▼'}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-800 flex justify-between items-center px-1">
                    <span className="text-xs font-bold text-gray-300">صافي آخر 30 يوم:</span>
                    <span className={`text-sm font-black flex items-center gap-1 ${stock.isTotalPositive ? 'text-green-500' : 'text-red-500'}`}>
                      ${stock.total30Days} {stock.isTotalPositive ? 'ربح ▲' : 'خسارة ▼'}
                    </span>
                  </div>
                </div>

                <div className="mt-auto">
                  <h3 className="text-[10px] font-bold text-gray-500 mb-2 text-center">العائد التاريخي للسهم</h3>
                  <div className="grid grid-cols-5 gap-1 text-center">
                    {[
                      { label: '3 أشهر', data: stock.stats?.m3 },
                      { label: '6 أشهر', data: stock.stats?.m6 },
                      { label: 'سنة', data: stock.stats?.y1 },
                      { label: 'سنتين', data: stock.stats?.y2 },
                      { label: '3 سنوات', data: stock.stats?.y3 }
                    ].map((stat, i) => (
                      <div key={i} className="bg-gray-950 p-1 rounded-md border border-gray-800 flex flex-col justify-center items-center h-[52px]">
                        <span className="text-[9px] text-gray-500 leading-tight">{stat.label}</span>
                        
                        {/* النسبة المئوية */}
                        <span className={`text-[10px] font-bold ${stat.data?.value === '-' ? 'text-gray-500' : (stat.data?.isPositive ? 'text-green-500' : 'text-red-500')}`}>
                          {stat.data?.value !== '-' ? (stat.data?.isPositive ? '+' : '-') : ''}{stat.data?.value}
                        </span>
                        
                        {/* المبلغ المالي المضاف حديثاً أسفل النسبة */}
                        {stat.data?.value !== '-' && (
                          <span className={`text-[8px] font-semibold mt-0.5 opacity-80 ${stat.data?.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                            ${stat.data?.amount}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {isLoading && (
          <div className="text-center py-10 text-blue-400 font-bold text-lg animate-pulse">
            جاري جلب الدفعة التالية من الأسهم والتحليل...
          </div>
        )}
      </div>
    </main>
  );
}
