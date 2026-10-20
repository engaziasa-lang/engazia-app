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
    <div className="max-w-7xl mx-auto px-4 py-10" dir="rtl">
      
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

      {/* الهيدر العلوي */}
      <header className="flex flex-col items-center justify-center mb-12 text-center">
        <div className="flex items-center justify-between w-full max-w-3xl mb-6 px-4">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-md">
              <span>ك</span>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">منصة كليك قدرات</h2>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">الاحتراف في التدريب المحاكي</span>
            </div>
          </div>

          {/* زر اشترِ الباقة وتفعيل الكود إذا لم يكن مشتركاً */}
          {!isUserSubscribed && (
            <div className="flex items-center gap-2">
              <a href="https://enjazya.lemonsqueezy.com/checkout/buy/13f3f36f-c53b-4227-91c6-b556ae13aee2" target="_blank" rel="noopener noreferrer" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md transition-all flex items-center gap-1">
                🛒 اشترِ الباقة
              </a>
              <button onClick={() => setIsModalOpen(true)} className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md transition-all">
                🔑 لدي كود
              </button>
            </div>
          )}
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mt-2">
          لوحة الاختبارات الشاملة
        </h1>
        <p className="text-gray-500 text-sm mt-2 max-w-md">
          اختر الاختبار لبدء التدريب المحاكي المكون من 5 أقسام.
        </p>
      </header>
      
      {/* شبكة عرض البطاقات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {EXAMS_DATA.map((exam) => {
          const isLocked = !exam.isFree && !isUserSubscribed;

          return (
            <div 
              key={exam.id} 
              className={`bg-white rounded-2xl border p-8 text-center shadow-sm transition-all duration-200 flex flex-col justify-between ${isLocked ? 'border-gray-200 bg-gray-50/50' : 'border-gray-200 hover:border-blue-500 hover:shadow-md'}`}
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
                  className="w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-sm text-center cursor-pointer"
                >
                  🔒 تفعيل بـكود أو اشتراك
                </button>
              ) : (
                <Link 
                  href={`/qudurat/test?examId=${exam.id}`}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-sm block text-center"
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
