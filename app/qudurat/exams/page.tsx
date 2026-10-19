// app/qudurat/exams/page.tsx
'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { EXAMS_DATA } from '../lib/examsConfig';

// مكون نافذة التفعيل 
function ActivationModalComponent({
  isOpen,
  onClose,
  code,
  setCode,
  error,
  onActivate,
  isActivating
}: {
  isOpen: boolean;
  onClose: () => void;
  code: string;
  setCode: (val: string) => void;
  error: string;
  onActivate: () => void;
  isActivating: boolean;
}) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4" dir="rtl">
      <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-md w-full border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">🔑 تفعيل الاشتراك</h2>
          <button onClick={onClose} disabled={isActivating} className="text-gray-400 hover:text-gray-600 font-bold text-2xl cursor-pointer leading-none">&times;</button>
        </div>
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          أدخل كود التفعيل الذي وصلك عبر البريد الإلكتروني أو رسالة الجوال لفتح جميع الاختبارات. <br/>
          <span className="text-xs text-red-500 font-medium mt-1 inline-block">ملاحظة: سيتم ربط الكود بهذا الجهاز فقط.</span>
        </p>
        
        <input
          type="text"
          placeholder="مثال: QUD-XXXX"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          disabled={isActivating}
          className="w-full border-2 border-gray-200 rounded-xl p-3 text-center text-lg font-bold tracking-widest text-gray-800 uppercase focus:border-blue-500 focus:outline-none transition-all mb-2 disabled:bg-gray-50 disabled:text-gray-400"
          dir="ltr"
          autoFocus
        />
        {error && <p className="text-red-500 text-xs font-bold mb-4">{error}</p>}
        
        <div className="mt-6 flex gap-3">
          <button 
            onClick={onActivate} 
            disabled={isActivating}
            className={`flex-1 text-white font-bold py-3 rounded-xl transition-all shadow-md ${isActivating ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'}`}
          >
            {isActivating ? 'جاري التحقق...' : 'تفعيل الآن'}
          </button>
          <button 
            onClick={onClose} 
            disabled={isActivating}
            className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition-all cursor-pointer disabled:opacity-50"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ExamsPage() {
  const router = useRouter();
  const [isUserSubscribed, setIsUserSubscribed] = useState(false);
  const [deviceId, setDeviceId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activationCode, setActivationCode] = useState('');
  const [activationError, setActivationError] = useState('');
  const [isActivating, setIsActivating] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const subStatus = localStorage.getItem('qudurat_subscribed') === 'true';
    setIsUserSubscribed(subStatus);

    let id = localStorage.getItem('qudurat_device_id');
    if (!id) {
      id = 'dev_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('qudurat_device_id', id);
    }
    setDeviceId(id);
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
        localStorage.setItem('qudurat_subscribed', 'true');
        setIsModalOpen(false);
        setActivationCode('');
        alert(data.message);
      } else {
        setActivationError(data.message || 'الكود غير صحيح أو تم استخدامه مسبقاً.');
      }
    } catch (error) {
      setActivationError('حدث خطأ في الاتصال بالخادم. تأكد من اتصالك بالإنترنت وحاول مرة أخرى.');
    } finally {
      setIsActivating(false);
    }
  };

  const handleStartExam = (examId: number) => {
    router.push(`/qudurat/test?examId=${examId}`);
  };

  // وظيفة لتسهيل تجربة المستخدم: عند الضغط على اختبار مغلق تفتح له نافذة التفعيل فوراً
  const handleLockedExamClick = () => {
    setIsModalOpen(true);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-8" dir="rtl">
      <ActivationModalComponent 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        code={activationCode}
        setCode={setActivationCode}
        error={activationError}
        onActivate={handleActivateCode}
        isActivating={isActivating}
      />

      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-blue-900 mb-10">
          باقات اختبارات القدرات - كليك قدرات
        </h1>

        {/* اللافتة التسويقية الجديدة للشراء والتفعيل */}
        {!isUserSubscribed ? (
          <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6 md:p-8 mb-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-right">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center md:justify-start gap-2">
                <span>🚀</span> افتح جميع الاختبارات الآن!
              </h2>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                اشترك للحصول على وصول فوري لـ 10 اختبارات محاكية شاملة، وتدرب في بيئة مطابقة لاختبار قياس الحقيقي.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-shrink-0">
              <a 
                href="https://enjazya.lemonsqueezy.com/checkout/buy/13f3f36f-c53b-4227-91c6-b556ae13aee2" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-center bg-blue-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-blue-700 transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <span>🛒</span> اشترِ الباقة
              </a>
              <button 
                onClick={() => setIsModalOpen(true)} 
                className="text-center bg-white border-2 border-blue-600 text-blue-700 font-bold py-3 px-8 rounded-xl hover:bg-blue-50 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>🔑</span> أدخل الكود
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-green-50 rounded-2xl border border-green-200 p-6 mb-10 flex items-center justify-center gap-3">
            <span className="text-2xl">🌟</span>
            <p className="text-green-800 font-bold text-lg">حسابك VIP مفعل. جميع الاختبارات متاحة لك الآن للتدرب!</p>
          </div>
        )}

        {/* شبكة الاختبارات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {EXAMS_DATA.map((exam) => {
            const isLocked = !exam.isFree && !isUserSubscribed;
            return (
              <div key={exam.id} className={`bg-white rounded-2xl p-6 border-2 transition-all flex flex-col ${isLocked ? 'border-gray-200 opacity-90 hover:opacity-100' : 'border-green-400 shadow-md'}`}>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-lg text-gray-800">{exam.title}</h3>
                  {exam.isFree && <span className="bg-green-100 text-green-700 text-[11px] font-bold px-3 py-1 rounded-full whitespace-nowrap">مجاني</span>}
                  {isLocked && <span className="bg-amber-100 text-amber-700 text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1 whitespace-nowrap">🔒 للمشتركين</span>}
                </div>
                
                <p className="text-gray-500 text-sm mb-6 flex-grow">{exam.description}</p>
                
                {isLocked ? (
                  <button 
                    onClick={handleLockedExamClick} 
                    className="w-full bg-slate-400 text-white font-bold py-3.5 rounded-xl cursor-pointer hover:bg-slate-500 transition-all text-sm flex items-center justify-center gap-2"
                  >
                    <span>🔒</span> اشترك لفتح الاختبار
                  </button>
                ) : (
                  <button 
                    onClick={() => handleStartExam(exam.id)}
                    className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl cursor-pointer hover:bg-blue-700 transition-all shadow-sm text-sm"
                  >
                    ابدأ الاختبار الآن
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
