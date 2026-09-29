'use client';

import React from 'react';
import Link from 'next/link';
import { Leaf, Flame, Shield, Users, HeartHandshake, AlertCircle } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function ESGPage() {
  const esgPillars = [
    {
      title: 'Environmental Stewardship',
      icon: <Leaf className="w-6 h-6 text-emerald-600" />,
      items: [
        'Hot charging manufacturing techniques reducing thermal energy consumption during billet processing.',
        'Utilization of industrial bio-gas and waste heat recovery systems across kiln operations.',
        'Closed-loop water recycling systems minimizing industrial freshwater withdrawal at Mahabubnagar.',
      ],
    },
    {
      title: 'Social Responsibility & Safety',
      icon: <Users className="w-6 h-6 text-blue-600" />,
      items: [
        'Strict industrial safety protocols, mandatory Personal Protective Equipment (PPE), and zero-harm workplace goals.',
        'Local workforce development and technical skill building initiatives in Telangana & Andhra Pradesh.',
        'Community healthcare drives and educational support programs in surrounding plant villages.',
      ],
    },
    {
      title: 'Corporate Governance',
      icon: <Shield className="w-6 h-6 text-[#ff6500]" />,
      items: [
        'Board oversight with independent directors ensuring transparent financial reporting.',
        'Zero tolerance policy for ethical violations, corruption, or non-compliance.',
        'Regular SEBI, NSE & BSE compliance disclosures for public shareholder protection.',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="bg-[#0b192c] text-white rounded-2xl p-8 md:p-12 mb-12 shadow-xl bg-steel-pattern">
          <span className="text-xs font-bold uppercase tracking-widest text-[#ff6500] bg-orange-950/80 px-3 py-1 rounded border border-orange-800/50 mb-4 inline-block">
            Sustainability & Corporate Responsibility
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
            RESPONSIBLE STEEL MANUFACTURING
          </h1>
          <p className="text-slate-300 text-base md:text-lg max-w-3xl leading-relaxed">
            Hariom Pipe Industries Limited is committed to eco-friendly production practices, energy efficiency, waste heat recovery, and community development.
          </p>
        </div>

        {/* ESG Disclosure Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-10 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-900 leading-relaxed">
            <strong>Disclosure Notice:</strong> In compliance with corporate transparency guidelines, quantitative ESG metrics and carbon emission figures presented are based on official annual company filings. Detailed ESG reports can be accessed via the Investor Document Center.
          </p>
        </div>

        {/* ESG Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {esgPillars.map((pillar, idx) => (
            <Card key={idx} className="flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  {pillar.icon}
                  <h3 className="text-lg font-bold text-[#0b192c]">{pillar.title}</h3>
                </div>
                <ul className="space-y-3 text-xs text-slate-600">
                  {pillar.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ff6500] shrink-0 mt-1.5"></span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
