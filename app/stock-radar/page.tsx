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
    // استدعاء دالة السيرفر المشفرة
    const result = await getStockData(ticker.toUpperCase());
    
    if (result.success && result.data) {
      const newData = result.data;
      // إضافة السهم الجديد للقائمة ومنع التكرار
      setStocks(prev => [newData, ...prev.filter(s => s.symbol !== newData.symbol)]);
      setTicker('');
    } else {
      alert('لم يتم العثور على بيانات السهم، تأكد من الرمز.');
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
            {loading ? 'جاري البحث...' : 'اصطياد'}
          </button>
        </form>

        {/* شبكة الأسهم */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stocks.map((stock) => (
            <div key={stock.symbol} className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition-colors">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-100">{stock.symbol}</h2>
                <span className="bg-blue-900 text-blue-300 px-2 py-1 rounded text-sm">${stock.price}</span>
              </div>
              <div className="space-y-3 text-sm text-gray-400">
                <div className="flex justify-between">
                  <span>مكرر الربحية (PE):</span>
                  <span className="font-bold text-white">{stock.peRatio}</span>
                </div>
                <div className="flex justify-between">
                  <span>مكرر النمو (PEG):</span>
                  <span className="font-bold text-white">{stock.pegRatio}</span>
                </div>
                <div className="flex justify-between">
                  <span>نمو الإيرادات:</span>
                  <span className="font-bold text-green-400">{stock.revenueGrowth}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
