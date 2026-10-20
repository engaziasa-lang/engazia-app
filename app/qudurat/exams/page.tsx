'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { EXAMS_DATA } from '../lib/examsConfig';

export default function ExamsDashboard() {
  const [isUserSubscribed, setIsUserSubscribed] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [activationCode, setActivationCode] = useState<string>('');
  const [activationError, setActivationError] = useState<string>('');
  const [isActivating, setIsActivating] = useState<boolean>(false);
  const [deviceId, setDeviceId] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const subscribed = localStorage.getItem('qudurat_subscribed') === 'true';
      setIsUserSubscribed(subscribed);

      let id = localStorage.getItem('qudurat_device_id');
      if (!id) {
        id = 'dev_' + Math.random().toString(36).substring(2, 15);
        localStorage.setItem('qudurat_device_id', id);
      }
      setDeviceId(id);
    }
  }, []);

  const handleActivateCode = async () => {
    setActivationError('');
    if (!activationCode.trim()) {
      setActivationError('الرجاء إدخال كود التفعيل.');
      return;
    }

    setIsActivating(true);
    try {
      const response = await fetch('/api/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: activationCode, deviceId: deviceId }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsUserSubscribed(true);
        if (typeof window !== 'undefined') {
          localStorage.setItem('qudurat_subscribed', 'true');
        }
        setIsModalOpen(false);
        setActivationCode('');
        alert(data.message);
      } else {
        setActivationError(data.message || 'الكود غير صحيح أو تم استخدامه مسبقاً.');
      }
    } catch (error) {
      setActivationError('حدث خطأ في الاتصال بالخادم. حاول مرة أخرى.');
    } finally {
      setIsActivating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-10" dir="rtl">
      
      {/* نافذة إدخال كود التفعيل */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-md w-full border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">🔑 تفعيل الاشتراك</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold text-2xl">&times;</button>
            </div>
            <p className="text-gray-600 text-sm mb-4">أدخل كود التفعيل لفتح جميع الاختبارات.</p>
            <input
              type="text"
              placeholder="QUD-XXXX"
              value={activationCode}
              onChange={(e) => setActivationCode(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl p-3 text-center text-lg font-bold tracking-widest uppercase focus:border-blue-500 focus:outline-none mb-2"
              dir="ltr"
            />
            {activationError && <p className="text-red-500 text-xs font-bold mb-4">{activationError}</p>}
            <div className="mt-6 flex gap-3">
              <button onClick={handleActivateCode} disabled={isActivating} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-md">
                {isActivating ? 'جاري التحقق...' : 'تفعيل الآن'}
              </button>
              <button onClick={() => setIsModalOpen(false)} className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl">إلغاء</button>
            </div>
          </div>
        </div>
      )}

      {/* الهيدر العلوي المنسق باحترافية لتجنب أي تداخل في الجوال */}
      <header className="bg-white shadow-sm rounded-2xl p-4 md:p-6 max-w-5xl mx-auto w-full mb-8 border border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* اليمين: اللوجو واسم المنصة والوصف */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-start">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-md flex-shrink-0">
              <span>ك</span>
            </div>
            <div className="text-right">
              <h2 className="text-base md:text-lg font-extrabold text-gray-900 tracking-tight">منصة كليك قدرات</h2>
              <span className="text-xs font-semibold text-blue-600 block">الاحتراف في التدريب المحاكي</span>
            </div>
          </div>

          {/* المنتصف/اليسار: أزرار الشراء والتفعيل (تختفي عند الاشتراك) */}
          {!isUserSubscribed && (
            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <a href="https://enjazya.lemonsqueezy.com/checkout/buy/13f3f36f-c53b-4227-91c6-b556ae13aee2" target="_blank" rel="noopener noreferrer" className="flex-1 md:flex-initial bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs md:text-sm shadow-md transition-all text-center whitespace-nowrap">
                🛒 اشترِ الباقة
              </a>
              <button onClick={() => setIsModalOpen(true)} className="flex-1 md:flex-initial bg-slate-800 hover:bg-slate-900 text-white font-bold px-4 py-2.5 rounded-xl text-xs md:text-sm shadow-md transition-all text-center whitespace-nowrap">
                🔑 لدي كود
              </button>
            </div>
          )}

        </div>

        {/* عنوان لوحة الاختبارات */}
        <div className="text-center mt-6 pt-4 border-t border-gray-100">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800">
            لوحة الاختبارات الشاملة
          </h1>
          <p className="text-gray-500 text-xs md:text-sm mt-1">
            اختر الاختبار لبدء التدريب المحاكي المكون من 5 أقسام.
          </p>
        </div>
      </header>
      
      {/* شبكة عرض البطاقات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {EXAMS_DATA.map((exam) => {
          const isLocked = !exam.isFree && !isUserSubscribed;

          return (
            <div 
              key={exam.id} 
              className={`bg-white rounded-2xl border p-6 md:p-8 text-center shadow-sm transition-all duration-200 flex flex-col justify-between ${isLocked ? 'border-gray-200 bg-gray-50/50' : 'border-gray-200 hover:border-blue-500 hover:shadow-md'}`}
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold text-gray-400">اختبار رقم {exam.id}</span>
                  {!isUserSubscribed && exam.isFree && (
                    <span className="bg-green-100 text-green-700 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full">
                      متاح مجاناً
                    </span>
                  )}
                  {isLocked && (
                    <span className="bg-amber-100 text-amber-700 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      🔒 للمشتركين
                    </span>
                  )}
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {exam.title}
                </h2>
                <p className="text-sm text-gray-500 mb-8">
                  {exam.description}
                </p>
              </div>
              
              {isLocked ? (
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-sm text-center cursor-pointer text-sm"
                >
                  🔒 تفعيل بـكود أو اشتراك
                </button>
              ) : (
                <Link 
                  href={`/qudurat/test?examId=${exam.id}`}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-sm block text-center text-sm"
                >
                  ابدأ الاختبار الآن
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
