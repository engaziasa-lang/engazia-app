"use client";
import React, { useState } from 'react';

export default function ProposalAI() {
  const [jobDescription, setJobDescription] = useState('');
  const [skills, setSkills] = useState('');
  const [tone, setTone] = useState('Professional');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedProposal, setGeneratedProposal] = useState('');
  
  const [freeCredits, setFreeCredits] = useState(3); 
  const [isPro, setIsPro] = useState(false); 
  const [activationKey, setActivationKey] = useState('');
  const [keyError, setKeyError] = useState('');
  const [isActivating, setIsActivating] = useState(false);
  
  // حالة زر النسخ
  const [isCopied, setIsCopied] = useState(false);

  const handleActivate = async () => {
    if (!activationKey.trim()) {
      setKeyError("Please enter a license key.");
      return;
    }

    setIsActivating(true);
    setKeyError('');

    try {
      const response = await fetch('/api/verify-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: activationKey }),
      });

      const data = await response.json();

      if (data.valid) {
        setIsPro(true);
        alert("Success! Your account is now Pro.");
      } else {
        setKeyError("Invalid or expired key.");
      }
    } catch (error) {
      setKeyError("Connection error, please try again.");
    } finally {
      setIsActivating(false);
    }
  };

  const handleGenerate = async () => {
    if (!isPro && freeCredits <= 0) return;
    if (!jobDescription) return;

    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription, skills, tone }),
      });

      const data = await response.json();

      if (data.result) {
        setGeneratedProposal(data.result);
        if (!isPro) setFreeCredits(freeCredits - 1); 
      } else {
        alert("Something went wrong.");
      }
    } catch (error) {
      alert("Failed to connect to the server.");
    } finally {
      setIsGenerating(false);
    }
  };

  // دالة نسخ النص
  const handleCopy = () => {
    if (!generatedProposal) return;
    navigator.clipboard.writeText(generatedProposal);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <>
      <script src="https://cdn.tailwindcss.com"></script>
      
      <div className="min-h-screen bg-slate-900 text-slate-200 font-sans selection:bg-indigo-500 selection:text-white" dir="ltr">
        
        <nav className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(79,70,229,0.5)]">AI</div>
              <span className="font-bold text-xl tracking-tight text-white">Proposal<span className="text-indigo-400">Genius</span></span>
            </div>
            {isPro ? (
               <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase">Pro Active</span>
            ) : (
              <button className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-slate-700">
                Free Plan
              </button>
            )}
          </div>
        </nav>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
              Win More Jobs on <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">Upwork</span> & <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-green-300">Fiverr</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Stop wasting hours writing cover letters. Paste the job description, and let our AI write a highly-converting proposal in 3 seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 shadow-xl h-fit">
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-2 flex justify-between">
                  <span>1. Paste Job Description</span>
                  <span className="text-indigo-400 text-xs">Required</span>
                </label>
                <textarea 
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="e.g. I need a Next.js developer to build a landing page..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-48 resize-none placeholder:text-slate-600"
                  disabled={!isPro && freeCredits <= 0} 
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">2. Your Key Skills</label>
                  <input 
                    type="text" 
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="e.g. React, UI/UX"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
                    disabled={!isPro && freeCredits <= 0}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">3. Proposal Tone</label>
                  <select 
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none"
                    disabled={!isPro && freeCredits <= 0}
                  >
                    <option>Professional</option>
                    <option>Conversational</option>
                    <option>Enthusiastic</option>
                    <option>Direct & Confident</option>
                  </select>
                </div>
              </div>

              {(isPro || freeCredits > 0) ? (
                <button 
                  onClick={handleGenerate}
                  disabled={isGenerating || !jobDescription}
                  className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                    (!jobDescription)
                      ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)]'
                  }`}
                >
                  {isGenerating ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Writing Magic...
                    </span>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                      {isPro ? "Generate Proposal (Unlimited)" : `Generate Proposal (${freeCredits} Free Left)`}
                    </>
                  )}
                </button>
              ) : (
                <div className="bg-slate-800/80 p-5 rounded-xl border border-indigo-500/30 text-center animate-fade-in">
                  <h4 className="text-lg font-bold text-white mb-2">Free Credits Exhausted</h4>
                  <p className="text-slate-400 text-sm mb-4">To unlock unlimited proposals, please upgrade your plan.</p>
                  
                  <a 
                    href="https://enjazya.lemonsqueezy.com/checkout/buy/0c9b6d67-9a87-4e8c-a45d-19c9b0e429cb" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-black py-3 rounded-lg transition-colors shadow-lg text-lg flex items-center justify-center gap-2 cursor-pointer mb-4"
                  >
                     <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.381z" clipRule="evenodd"></path></svg>
                    Upgrade Now
                  </a>

                  <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-lg border border-slate-600 text-left">
                    <span className="text-amber-400 font-bold pl-2 flex items-center gap-1">PRO <span className="text-xl">🔑</span></span>
                    <input 
                      type="text" 
                      value={activationKey}
                      onChange={(e) => setActivationKey(e.target.value)}
                      placeholder="License key..."
                      className="flex-1 bg-transparent border-none px-2 text-white text-sm focus:ring-0 outline-none placeholder:text-slate-500"
                    />
                    <button 
                      onClick={handleActivate}
                      disabled={isActivating}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md text-sm font-bold transition-colors disabled:opacity-50"
                    >
                      {isActivating ? "Checking..." : "Activate"}
                    </button>
                  </div>
                  {keyError && <p className="text-red-400 text-xs mt-2 text-left">{keyError}</p>}
                </div>
              )}
            </div>

            <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50 flex flex-col relative overflow-hidden h-[600px]">
              <h3 className="text-lg font-semibold text-slate-300 mb-4 flex items-center gap-2 z-10 relative shrink-0">
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                Generated Result
              </h3>
              
              {generatedProposal ? (
                <div className="flex-1 flex flex-col relative h-full">
                  <textarea 
                    value={generatedProposal}
                    onChange={(e) => setGeneratedProposal(e.target.value)}
                    className="w-full h-full bg-slate-900 border border-slate-700 rounded-xl p-5 text-slate-300 text-sm leading-relaxed focus:ring-2 focus:ring-indigo-500 outline-none resize-none flex-1 pb-16"
                  ></textarea>
                  
                  {/* زر النسخ العائم */}
                  <div className="absolute bottom-4 right-4 z-20">
                    <button 
                      onClick={handleCopy}
                      className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg flex items-center gap-2"
                    >
                      {isCopied ? (
                        <>
                          <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                          Copied!
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                          Copy Text
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 border-2 border-dashed border-slate-700 rounded-xl flex items-center justify-center text-slate-500 flex-col gap-3 h-full">
                  <svg className="w-12 h-12 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002 2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                  <p>Your AI-crafted proposal will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
