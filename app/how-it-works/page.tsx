import React from 'react';
import Link from 'next/link';

export default function HowItWorksPage() {
  return (
    <>
      <script src="https://cdn.tailwindcss.com"></script>
      <div className="min-h-screen bg-slate-900 text-slate-200 font-sans selection:bg-indigo-500 selection:text-white" dir="ltr">
        
        {/* شريط التصفح العُلوي */}
        <nav className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/proposal-ai" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(79,70,229,0.5)]">AI</div>
              <span className="font-bold text-xl tracking-tight text-white">Proposal<span className="text-indigo-400">Genius</span></span>
            </Link>
            <Link href="/proposal-ai" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
              &larr; Back to Tool
            </Link>
          </div>
        </nav>

        {/* المحتوى الرئيسي */}
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">How ProposalGenius Works</h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Win more freelance jobs in 3 simple steps. No more staring at a blank page.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            
            {/* الخطوة الأولى */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 text-center relative overflow-hidden">
              <div className="w-16 h-16 bg-indigo-600/20 text-indigo-400 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 border border-indigo-500/30">
                1
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Paste the Job</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                Found a great job on Upwork or Fiverr? Simply copy the client's job description and paste it into our tool.
              </p>
            </div>

            {/* الخطوة الثانية */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 text-center relative overflow-hidden">
              <div className="w-16 h-16 bg-indigo-600/20 text-indigo-400 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 border border-indigo-500/30">
                2
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Add Your Skills</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                Type in your key skills (e.g., Next.js, UI/UX) and select the tone of voice you want the proposal to have.
              </p>
            </div>

            {/* الخطوة الثالثة */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 text-center relative overflow-hidden">
              <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-[0_0_20px_rgba(79,70,229,0.4)]">
                3
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Generate & Win</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                Click generate and get a highly-converting, personalized cover letter in 3 seconds. Copy, tweak, and apply!
              </p>
            </div>

          </div>

          <div className="text-center">
            <Link href="/proposal-ai" className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-8 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all text-lg">
              Try it for Free Now
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </Link>
          </div>

        </main>
      </div>
    </>
  );
}
