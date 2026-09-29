'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Target, Eye, Award, MapPin, Building, History, CheckCircle2 } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { COMPANY_DETAILS } from '@/lib/constants';

export default function AboutPage() {
  const milestones = [
    { year: '1962', title: 'Group Founders Legacy', desc: 'Promoters initiated business operations in steel trading and iron distribution.' },
    { year: '2007', title: 'Hariom Pipe Industries Incorporated', desc: 'Formal incorporation of Hariom Pipe Industries Limited in Hyderabad, Telangana.' },
    { year: '2008', title: 'Unit I Mahabubnagar Commissioned', desc: 'Commenced integrated steel pipe mill operations in Mahabubnagar district.' },
    { year: '2020', title: 'Expansion & Backward Integration', desc: 'Expanded sponge iron kilns and continuous billet casting for self-sufficiency.' },
    { year: '2022', title: 'NSE & BSE Mainboard IPO Listing', desc: 'Successful Initial Public Offering (IPO) listing on National & Bombay Stock Exchanges.' },
    { year: '2024', title: '7,01,237 MTPA Capacity Milestone', desc: 'Acquisition and commissioning of Perundurai galvanizing plant and Unit IV expansion.' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="bg-[#0b192c] text-white rounded-2xl p-8 md:p-12 mb-12 shadow-xl bg-steel-pattern">
          <span className="text-xs font-bold uppercase tracking-widest text-[#ff6500] bg-orange-950/80 px-3 py-1 rounded border border-orange-800/50 mb-4 inline-block">
            Corporate Profile & Heritage
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
            INTEGRATED STEEL MANUFACTURING EXCELLENCE
          </h1>
          <p className="text-slate-300 text-base md:text-lg max-w-3xl leading-relaxed">
            Headquartered in Hyderabad, Hariom Pipe Industries Limited has evolved into one of South India's premier integrated steel manufacturers, delivering trusted pipes, coils, and scaffolding to infrastructure projects nationwide.
          </p>
        </div>

        {/* Company Overview & Core Pillars */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <Card className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-[#0b192c] mb-4 pb-2 border-b border-slate-200">
              Company Overview
            </h2>
            <p className="text-slate-700 text-sm leading-relaxed mb-4">
              Hariom Pipe Industries Limited is a publicly listed enterprise (NSE: HARIOMPIPE | BSE: 543517) operating an integrated iron and steel business model. Our operations span raw material reduction, sponge iron manufacturing, MS billet casting, ERW pipe rolling, continuous galvanizing, and precision strip slitting.
            </p>
            <p className="text-slate-700 text-sm leading-relaxed mb-6">
              With an aggregate installed production capacity of <strong>7,01,237 MTPA</strong> across 4 advanced manufacturing units in Telangana, Andhra Pradesh, and Tamil Nadu, we serve over 900 authorized dealers and 1,500 retail selling points.
            </p>

            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Headquarters</span>
                <span className="text-sm font-bold text-[#0b192c]">{COMPANY_DETAILS.headquarters}</span>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Incorporated</span>
                <span className="text-sm font-bold text-[#0b192c]">2007 (18+ Yrs)</span>
              </div>
            </div>
          </Card>

          {/* Vision & Mission */}
          <div className="space-y-6">
            <Card className="bg-[#0b192c] text-white border-none shadow-md">
              <div className="flex items-center gap-3 mb-3">
                <Eye className="w-6 h-6 text-[#ff6500]" />
                <h3 className="text-lg font-bold">Our Vision</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                To be India's most trusted integrated steel and pipe manufacturer, recognized for uncompromised engineering quality, sustainable manufacturing practices, and long-term stakeholder value.
              </p>
            </Card>

            <Card className="bg-slate-900 text-white border-none shadow-md">
              <div className="flex items-center gap-3 mb-3">
                <Target className="w-6 h-6 text-[#ff6500]" />
                <h3 className="text-lg font-bold">Our Mission</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                To continuously upgrade integrated manufacturing capacities, expand channel distribution networks, ensure strict BIS compliance, and deliver cost-effective steel solutions for nation-building projects.
              </p>
            </Card>
          </div>
        </div>

        {/* Milestone Timeline */}
        <div className="mb-16">
          <SectionHeading
            category="Journey & Milestones"
            title="VERIFIED GROWTH TIMELINE"
            subtitle="Key historical milestones defining Hariom's industrial expansion."
            centered
          />

          <div className="relative border-l-2 border-[#ff6500] ml-4 md:ml-32 space-y-8 pl-6 md:pl-8">
            {milestones.map((ms, idx) => (
              <div key={idx} className="relative group">
                <div className="absolute -left-[31px] md:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-[#ff6500] border-4 border-white shadow"></div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm group-hover:border-[#ff6500] transition-colors">
                  <span className="text-xs font-black text-[#ff6500] uppercase tracking-wider block mb-1">{ms.year}</span>
                  <h4 className="text-base font-bold text-[#0b192c] mb-1">{ms.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{ms.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
