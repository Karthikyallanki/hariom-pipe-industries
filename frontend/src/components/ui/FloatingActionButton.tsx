'use client';

import React, { useState } from 'react';
import { PhoneCall, MessageCircle, FileText, X, Sparkles, Phone } from 'lucide-react';
import { COMPANY_DETAILS } from '@/lib/constants';
import { QuoteDrawer } from './QuoteDrawer';

export const FloatingActionButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isQuoteDrawerOpen, setIsQuoteDrawerOpen] = useState(false);

  const whatsappNumber = '919100000000';
  const whatsappMessage = encodeURIComponent(
    'Hello Hariom Pipe Industries Team, I am interested in getting a quote for steel pipes & products.'
  );

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {/* Expanded Quick Action Items */}
        <div
          className={`flex flex-col items-end gap-3 mb-3 transition-all duration-300 transform ${
            isOpen
              ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
              : 'opacity-0 translate-y-6 scale-95 pointer-events-none'
          }`}
        >
          {/* Action 1: Click-to-chat via WhatsApp API */}
          <a
            href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 px-4 py-2.5 rounded-full bg-slate-900/90 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-600 hover:text-white shadow-xl backdrop-blur-md transition-all duration-200"
            title="Chat on WhatsApp"
          >
            <span className="text-xs font-semibold tracking-wide hidden sm:inline group-hover:text-white">
              WhatsApp Sales Chat
            </span>
            <div className="w-9 h-9 rounded-full bg-emerald-500/20 group-hover:bg-white/20 flex items-center justify-center transition">
              <MessageCircle className="w-5 h-5 text-emerald-400 group-hover:text-white" />
            </div>
          </a>

          {/* Action 2: Click-to-call Toll-Free Number */}
          <a
            href="tel:18001230360"
            className="group flex items-center gap-3 px-4 py-2.5 rounded-full bg-slate-900/90 border border-amber-500/40 text-amber-400 hover:bg-amber-500 hover:text-slate-950 shadow-xl backdrop-blur-md transition-all duration-200"
            title="Call Toll Free: 1800 1230 360"
          >
            <span className="text-xs font-semibold tracking-wide hidden sm:inline group-hover:text-slate-950">
              Toll-Free: 1800 1230 360
            </span>
            <div className="w-9 h-9 rounded-full bg-amber-500/20 group-hover:bg-slate-950/20 flex items-center justify-center transition">
              <PhoneCall className="w-5 h-5 text-amber-400 group-hover:text-slate-950" />
            </div>
          </a>

          {/* Action 3: Quick Request a Quote Form Drawer */}
          <button
            onClick={() => {
              setIsOpen(false);
              setIsQuoteDrawerOpen(true);
            }}
            className="group flex items-center gap-3 px-4 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:from-amber-400 hover:to-amber-500 shadow-xl shadow-amber-500/20 font-bold transition-all duration-200"
            title="Request a Quote"
          >
            <span className="text-xs font-bold tracking-wide">Request a Quote</span>
            <div className="w-9 h-9 rounded-full bg-slate-950/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-slate-950" />
            </div>
          </button>
        </div>

        {/* Main Floating Trigger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`relative group w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${
            isOpen
              ? 'bg-slate-800 text-slate-200 rotate-90 border border-slate-700'
              : 'bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-slate-950 hover:scale-105 shadow-amber-500/30'
          }`}
          aria-label="Quick Contact & Quote Options"
        >
          {/* Subtle Pulse ring */}
          {!isOpen && (
            <span className="absolute inset-0 rounded-full bg-amber-500/40 animate-ping pointer-events-none" />
          )}

          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <div className="relative">
              <Sparkles className="w-6 h-6 text-slate-950 group-hover:rotate-12 transition" />
            </div>
          )}
        </button>
      </div>

      {/* Slide-out Quote Drawer */}
      <QuoteDrawer
        isOpen={isQuoteDrawerOpen}
        onClose={() => setIsQuoteDrawerOpen(false)}
      />
    </>
  );
};
