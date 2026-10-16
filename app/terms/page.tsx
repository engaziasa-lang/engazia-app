import React from 'react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <>
      <script src="https://cdn.tailwindcss.com"></script>
      <div className="min-h-screen bg-slate-900 text-slate-200 font-sans selection:bg-indigo-500 selection:text-white" dir="ltr">
        
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

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-8">Terms of Service</h1>
          
          <div className="space-y-8 text-slate-300 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-white mb-3">1. Acceptance of Terms</h2>
              <p>By accessing and using ProposalGenius, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this service.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">2. License Key & Usage</h2>
              <p>When you purchase a Pro plan, you receive a license key for unlimited generation subject to fair use. This key is for your personal use only. Sharing, reselling, or distributing your license key is strictly prohibited and will result in immediate termination of your account without a refund.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">3. AI-Generated Content</h2>
              <p>ProposalGenius uses artificial intelligence to generate text. While we strive for high quality, we do not guarantee the accuracy, completeness, or suitability of the generated proposals for any specific purpose. You are solely responsible for reviewing and editing the content before sending it to your clients.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">4. Limitation of Liability</h2>
              <p>In no event shall ProposalGenius, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}
