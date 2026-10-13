'use client';

import { useState } from 'react';

export default function SallaCalculatorPage() {
  const [costPrice, setCostPrice] = useState<number | ''>('');
  const [sellingPrice, setSellingPrice] = useState<number | ''>('');
  const [gatewayFeePercent, setGatewayFeePercent] = useState<number | string>('2.2');
  const [fixedFee, setFixedFee] = useState<number | string>('1');

  // حساب الأرباح والرسوم بدقة بالهللة
  const numCost = Number(costPrice) || 0;
  const numSelling = Number(sellingPrice) || 0;
  const numGatewayPercent = Number(gatewayFeePercent) || 0;
  const numFixed = Number(fixedFee) || 0;

  const gatewayTotalFee = (numSelling * (numGatewayPercent / 100)) + numFixed;
  const netProfit = numSelling - numCost - gatewayTotalFee;
  const profitMargin = numSelling > 0 ? (netProfit / numSelling) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center justify-center font-sans" dir="rtl">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        
        {/* هيدر التطبيق */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">حاسبة رسوم وأرباح سلة</h1>
          <p className="text-sm text-gray-500 mt-2">
            احسب صافي ربحك بدقة بالهللة واكتشف تأثير بوابات الدفع على تسعير منتجاتك.
          </p>
        </div>

        {/* حقول الإدخال اليدوية الآمنة */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">سعر تكلفة المنتج (ريال)</label>
            <input
              type="number"
              value={costPrice}
              onChange={(e) => setCostPrice(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="مثال: 50"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">سعر بيع المنتج للعميل (ريال)</label>
            <input
              type="number"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="مثال: 120"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">نسبة بوابة الدفع (%)</label>
              <input
                type="number"
                value={gatewayFeePercent}
                onChange={(e) => setGatewayFeePercent(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">رسوم ثابتة لكل طلب (ريال)</label>
              <input
                type="number"
                value={fixedFee}
                onChange={(e) => setFixedFee(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* صندوق النتائج الحية */}
        <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">إجمالي رسوم بوابة الدفع:</span>
            <span className="font-semibold text-red-600">{gatewayTotalFee.toFixed(2)} ر.س</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">صافي الربح الفعلي:</span>
            <span className={`font-bold ${netProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {netProfit.toFixed(2)} ر.س
            </span>
          </div>
          <div className="flex justify-between text-sm border-t pt-2">
            <span className="text-gray-600">هامش الربح:</span>
            <span className="font-bold text-gray-800">{profitMargin.toFixed(1)}%</span>
          </div>
        </div>

        {/* مصيدة الاشتراكات: الجسر الذكي للتوجه لموقعك الأساسي وأنت نائم */}
        <div className="mt-8 p-5 bg-emerald-50 rounded-xl border border-emerald-200 text-center space-y-3">
          <h3 className="font-bold text-emerald-900 text-base">هل لديك مئات المنتجات وتخشى تكرار الحسابات؟</h3>
          <p className="text-xs text-emerald-700 leading-relaxed">
            أنشئ حسابك الشامل على منصة إنجازيا لربط متجرك، جرد المخزون، وأتمتة تسعير كافة منتجاتك بضغطة زر واحدة.
          </p>
          <a
            href="https://engazia.sa/pricing" 
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-xl transition shadow-md text-sm"
          >
            انتقل إلى إنجازيا وفعّل الباقة الكاملة (12.99$) 🚀
          </a>
        </div>

      </div>
    </div>
  );
}
