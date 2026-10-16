import React from 'react';
import Link from 'next/link';

export default function RefundPage() {
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
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-8">Refund Policy</h1>
          
          <div className="space-y-8 text-slate-300 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-white mb-3">1. Digital Goods Concept</h2>
              <p>ProposalGenius provides a digital service utilizing advanced AI models that incur immediate computing costs upon usage. Because of the nature of digital goods and immediate access to our Pro features, we have a strict refund policy.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">2. No Refunds After Usage</h2>
              <p>Once a license key has been activated on our platform and used to generate a proposal, the sale is considered final and non-refundable. We provide 3 free credits upfront specifically so users can test the quality of the service before making a purchase decision.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">3. Exceptions</h2>
              <p>Refunds may only be issued in the rare event of severe technical failure on our end preventing you from using the service entirely, provided you contact our support team within 3 days of purchase and the issue cannot be resolved.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">4. Subscription Cancellations</h2>
              <p>If you are on a recurring billing plan, you may cancel your subscription at any time through the customer portal provided by Lemon Squeezy in your email receipt. Canceling will stop future charges, but will not refund past charges.</p>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}
