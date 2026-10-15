"use client";
import React, { useState } from 'react';

export default function ContractBuilder() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    party1Name: '',
    party1Id: '',
    party2Name: '',
    party2Id: '',
    projectDesc: '',
    totalAmount: '',
    durationDays: '',
    penaltyPercentage: '1'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <>
      {/* هذا السطر السحري هو الذي سيقوم بتشغيل التصميم والألوان فوراً */}
      <script src="https://cdn.tailwindcss.com"></script>
      
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" dir="rtl" style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif' }}>
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-slate-900 px-8 py-6 text-white text-right">
            <h2 className="text-2xl font-bold">مصنع العقود الآلي</h2>
            <p className="text-slate-300 mt-2 text-sm">عقد مقاولة باطن (أعمال تشطيبات وعظم)</p>
          </div>
          
          <div className="p-8">
            {/* شريط التقدم */}
            <div className="mb-10 flex justify-between items-center relative px-4" dir="ltr">
               <div className="absolute left-4 right-4 top-1/2 h-1 bg-gray-200 -z-10 transform -translate-y-1/2"></div>
               
               <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 ${step >= 1 ? 'bg-blue-600 border-blue-100 text-white shadow-md' : 'bg-white border-gray-300 text-gray-400'}`}>1</div>
               <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 ${step >= 2 ? 'bg-blue-600 border-blue-100 text-white shadow-md' : 'bg-white border-gray-300 text-gray-400'}`}>2</div>
               <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 ${step >= 3 ? 'bg-blue-600 border-blue-100 text-white shadow-md' : 'bg-white border-gray-300 text-gray-400'}`}>3</div>
            </div>

            {/* الخطوة 1: بيانات الأطراف */}
            {step === 1 && (
              <div className="space-y-6 text-right">
                <h3 className="text-xl font-semibold text-gray-800 border-b pb-3">بيانات الأطراف</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">اسم الطرف الأول (المالك/المقاول الرئيسي)</label>
                    <input type="text" name="party1Name" value={formData.party1Name} onChange={handleChange} className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3 border outline-none transition-shadow text-right" placeholder="مؤسسة العمارة الحديثة" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهوية / السجل التجاري</label>
                    <input type="text" name="party1Id" value={formData.party1Id} onChange={handleChange} className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3 border outline-none transition-shadow text-right" placeholder="1010XXXXXX" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">اسم الطرف الثاني (مقاول الباطن)</label>
                    <input type="text" name="party2Name" value={formData.party2Name} onChange={handleChange} className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3 border outline-none transition-shadow text-right" placeholder="مؤسسة الإنجاز السريع" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهوية / السجل التجاري</label>
                    <input type="text" name="party2Id" value={formData.party2Id} onChange={handleChange} className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3 border outline-none transition-shadow text-right" placeholder="1010XXXXXX" />
                  </div>
                </div>
              </div>
            )}

            {/* الخطوة 2: تفاصيل المشروع */}
            {step === 2 && (
              <div className="space-y-6 text-right">
                <h3 className="text-xl font-semibold text-gray-800 border-b pb-3">تفاصيل المشروع والاتفاق</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الوصف الدقيق للعمل المطلوب</label>
                  <textarea name="projectDesc" value={formData.projectDesc} onChange={handleChange} rows={3} className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3 border outline-none transition-shadow text-right" placeholder="أعمال السباكة وتأسيس الكهرباء للمشروع..."></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">القيمة الإجمالية للعقد (ريال)</label>
                    <input type="number" name="totalAmount" value={formData.totalAmount} onChange={handleChange} className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3 border outline-none transition-shadow text-right" placeholder="150000" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">مدة التنفيذ (بالأيام)</label>
                    <input type="number" name="durationDays" value={formData.durationDays} onChange={handleChange} className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3 border outline-none transition-shadow text-right" placeholder="90" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">غرامة التأخير (نسبة مئوية عن كل أسبوع تأخير)</label>
                    <select name="penaltyPercentage" value={formData.penaltyPercentage} onChange={handleChange} className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3 border outline-none transition-shadow text-right text-gray-700">
                      <option value="1">1% من قيمة الدفعة</option>
                      <option value="2">2% من قيمة الدفعة</option>
                      <option value="5">5% من قيمة الدفعة</option>
                      <option value="10">10% (الحد الأقصى)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* الخطوة 3: المراجعة والدفع */}
            {step === 3 && (
              <div className="space-y-6 text-center">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-8 shadow-sm">
                  <svg className="w-16 h-16 text-emerald-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">العقد جاهز للإصدار</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto text-sm">تم تجميع بياناتك بنجاح وصياغتها ضمن القالب القانوني المعتمد. الوثيقة جاهزة للتحميل الفوري كملف PDF محمي وجاهز للتوقيع.</p>
                  <div className="bg-white p-5 rounded-xl shadow-sm inline-block border border-gray-100 min-w-[200px]">
                    <p className="text-sm text-gray-500 mb-1">رسوم إصدار الوثيقة</p>
                    <p className="text-4xl font-bold text-slate-900">350 <span className="text-lg text-gray-500 font-normal">ريال</span></p>
                  </div>
                </div>
              </div>
            )}

            {/* أزرار التنقل */}
            <div className="mt-10 flex justify-between pt-6 border-t border-gray-100">
              {step < 3 ? (
                <button onClick={nextStep} className="px-8 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg focus:outline-none">
                  التالي
                </button>
              ) : (
                <button className="px-8 py-2.5 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors shadow-md hover:shadow-lg flex items-center gap-2 focus:outline-none">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                  دفع وإصدار العقد
                </button>
              )}
              
              {step > 1 ? (
                <button onClick={prevStep} className="px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors focus:outline-none">
                  السابق
                </button>
              ) : <div></div>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
