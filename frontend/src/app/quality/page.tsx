'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Award, CheckCircle2, FileText } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default function QualityPage() {
  const standards = [
    { code: 'IS 1161', title: 'Steel Tubes for Structural Purposes', desc: 'Conforms to YST 210, YST 240 & YST 310 tensile strength grades.' },
    { code: 'IS 1239 (Part-1)', title: 'Steel Tubes, Tubulars & Fittings', desc: 'Covers Light, Medium, and Heavy class water & gas pipes.' },
    { code: 'IS 4923', title: 'Hollow Steel Sections for Structural Use', desc: 'Square and rectangular structural steel hollow sections.' },
    { code: 'IS 2830', title: 'Carbon Steel Cast Billets', desc: 'Standard for continuously cast billets used in re-rolling.' },
  ];

  const inspectionSteps = [
    { step: 'Stage 1', title: 'Spectro Chemical Analysis', desc: 'Raw iron ore, sponge iron, and liquid steel samples analyzed for Carbon, Manganese, Sulfur & Phosphorus content.' },
    { step: 'Stage 2', title: 'Dimensional & Gauge Audit', desc: 'Laser micrometers verify outer diameter, wall thickness, and length tolerances.' },
    { step: 'Stage 3', title: 'Hydrostatic Pressure Testing', desc: '100% of GI pipes tested up to 5 MPa pressure to ensure zero weld seam leaks.' },
    { step: 'Stage 4', title: 'Zinc Coating Measurement', desc: 'Magnetic thickness gauges measure zinc mass (minimum 360 g/m² as per BIS).' },
    { step: 'Stage 5', title: 'Flattening & Weld Ductility Test', desc: 'Mechanical flattening and 90° bend tests verify weld seam ductility.' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="bg-[#0b192c] text-white rounded-2xl p-8 md:p-12 mb-12 shadow-xl bg-steel-pattern">
          <span className="text-xs font-bold uppercase tracking-widest text-[#ff6500] bg-orange-950/80 px-3 py-1 rounded border border-orange-800/50 mb-4 inline-block">
            Quality Assurance & BIS Compliance
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
            UNCOMPROMISING QUALITY CONTROL
          </h1>
          <p className="text-slate-300 text-base md:text-lg max-w-3xl leading-relaxed">
            Quality is at the core of Hariom Pipe's integrated manufacturing process. Every pipe batch undergoes 5-stage mechanical and non-destructive testing.
          </p>
        </div>

        {/* Standards Grid */}
        <div className="mb-16">
          <SectionHeading
            category="BIS Certifications"
            title="VERIFIED BUREAU OF INDIAN STANDARDS (BIS)"
            subtitle="Our manufacturing facilities produce steel pipes adhering strictly to Indian and International standards."
            centered
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {standards.map((std, idx) => (
              <Card key={idx} className="border-t-4 border-t-[#ff6500]">
                <Badge variant="gold" className="mb-2">{std.code}</Badge>
                <h4 className="text-base font-bold text-[#0b192c] mb-2">{std.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{std.desc}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* 5-Stage Inspection Process */}
        <div className="mb-16">
          <SectionHeading
            category="Inspection Protocol"
            title="5-STAGE QUALITY CONTROL PROCESS"
            subtitle="Rigorous testing protocols applied from raw iron reduction to finished pipe bundling."
            centered
          />

          <div className="space-y-4">
            {inspectionSteps.map((ins, i) => (
              <Card key={i} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-extrabold text-[#ff6500] bg-orange-50 px-3 py-1.5 rounded border border-orange-200 shrink-0">
                    {ins.step}
                  </span>
                  <div>
                    <h4 className="text-base font-bold text-[#0b192c]">{ins.title}</h4>
                    <p className="text-xs text-slate-600 mt-0.5">{ins.desc}</p>
                  </div>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 hidden md:block" />
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
