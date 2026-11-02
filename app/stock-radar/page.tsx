'use client'

import { useState } from 'react';
import { getStockData } from './actions';

export default function StockRadarPage() {
  const [ticker, setTicker] = useState('');
  const [stocks, setStocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticker) return;
    
    setLoading(true);
    const result = await getStockData(ticker.toUpperCase());
    
    if (result.success && result.data) {
      const newData = result.data;
      setStocks(prev => [newData, ...prev.filter(s => s.symbol !== newData.symbol)]);
      setTicker('');
    } else {
      alert(result.error || 'لم يتم العثور على بيانات السهم، تأكد من الرمز.');
    }
    setLoading(false);
  };

  return (
    <main className="p-8 bg-gray-900 min-h-screen text-right font-sans text-white" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-blue-400">رادار الأسهم الخاصة 🎯</h1>
        
        {/* شريط البحث */}
        <form onSubmit={handleSearch} className="mb-8 flex gap-4 max-w-md">
          <input 
            type="text" 
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            placeholder="أدخل رمز السهم (مثال: AAPL)" 
            className="flex-1 p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-blue-500 uppercase"
            dir="ltr"
          />
          <button 
            type="submit" 
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-bold transition-colors disabled:opacity-50"
          >
            {loading ? 'جاري التحليل...' : 'اصطياد'}
          </button>
        </form>

        {/* شبكة الأسهم والتحليلات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stocks.map((stock) => (
            <div key={stock.symbol} className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition-colors flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-100">{stock.symbol}</h2>
                  <span className="bg-blue-900 text-blue-300 px-3 py-1 rounded-full text-sm font-semibold">${stock.price}</span>
                </div>
                
                <div className="space-y-3 text-sm text-gray-400 mb-6 border-b border-gray-700 pb-4">
                  <div className="flex justify-between">
                    <span>مكرر الربحية (PE):</span>
                    <span className="font-bold text-white">{stock.peRatio}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>مكرر النمو (PEG):</span>
                    <span className="font-bold text-white">{stock.pegRatio}</span>
                  </div>
                </div>

                {/* قسم تحليل الذكاء الاصطناعي */}
                <div className="bg-gray-900/60 p-4 rounded-lg border border-blue-500/30">
                  <h3 className="text-xs font-bold text-blue-400 mb-2 flex items-center gap-1">
                    ✨ تحليل الذكاء الاصطناعي (Gemini):
                  </h3>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {stock.analysis}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
