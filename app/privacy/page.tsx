import React from 'react';
import Link from 'next/link';

export default function PrivacyPage() {
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
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-8">Privacy Policy</h1>
          
          <div className="space-y-8 text-slate-300 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-white mb-3">1. Information We Collect</h2>
              <p>We collect minimal information required to provide our service. This includes the text you input to generate proposals (which is sent temporarily to our AI providers and not stored permanently by us) and your license key data for authentication purposes.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">2. Payment Processing</h2>
              <p>All payments are securely processed by our Merchant of Record, Lemon Squeezy. We do not collect, process, or store your credit card information or billing details on our servers.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">3. How We Use Your Information</h2>
              <p>We use the information we collect to operate and maintain the service, validate your license key, and improve our AI generation algorithms. We do not sell or share your personal data with third parties for marketing purposes.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">4. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact us at support@proposalgenius.com.</p>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}
