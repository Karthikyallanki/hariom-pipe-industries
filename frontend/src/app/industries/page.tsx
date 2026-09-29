'use client';

import React from 'react';
import Link from 'next/link';
import { Building2, Zap, Wrench, Layers, CheckCircle2, ArrowRight } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function IndustriesPage() {
  const sectors = [
    {
      id: 'infrastructure',
      title: 'Infrastructure & Solar Racking',
      icon: <Building2 className="w-8 h-8 text-[#ff6500]" />,
      challenge: 'Infrastructure projects demand structural tubes with high yield strength, uniform wall thickness, and atmospheric corrosion resistance for 25+ year lifespans.',
      solution: 'Hariom HR & GP Structural Pipes conform to IS 4923 / YST 310 grades, providing superior load-bearing capacity for solar panel mounting structures, highway barriers, and industrial sheds.',
      products: ['HR Pipes & Tubes', 'GP Pipes & Tubes', 'HRPO Slit Coils'],
    },
    {
      id: 'agriculture',
      title: 'Agriculture & Irrigation',
      icon: <Zap className="w-8 h-8 text-[#ff6500]" />,
      challenge: 'Subterranean water conveyance and agricultural borewells require rust-proof piping capable of withstanding soil acidity and hydraulic pressure.',
      solution: 'Hariom Hot-Dip Galvanized Iron (GI) Pipes undergo 100% hydrostatic testing and continuous zinc dipping, offering maximum resistance against soil and water corrosion.',
      products: ['Galvanized Iron (GI) Pipes', 'GP Pipes & Tubes'],
    },
    {
      id: 'construction',
      title: 'Building & Civil Construction',
      icon: <Wrench className="w-8 h-8 text-[#ff6500]" />,
      challenge: 'Modern construction sites require high-safety load scaffolding systems and structural framing components to protect site workers.',
      solution: 'Hariom Heavy-Duty Scaffolding Systems, props, standards, and MS Billets deliver structural integrity tested up to 45 kN per prop.',
      products: ['Scaffolding Systems', 'M.S. Billets', 'HR Pipes & Tubes'],
    },
    {
      id: 'engineering',
      title: 'Automotive & Precision Engineering',
      icon: <Layers className="w-8 h-8 text-[#ff6500]" />,
      challenge: 'Automotive tube fabricators require close dimensional tolerances, clean surface finishes, and high bendability.',
      solution: 'Hariom Precision Cold Rolled (CR) Tubes and CRCA Slit Coils provide smooth surfaces ideal for chrome plating, powder coating, and precision bending.',
      products: ['CR Pipes & Tubes', 'CRCA Slit Coils', 'CRFH Slit Coils'],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0b192c] text-white rounded-2xl p-8 md:p-12 mb-12 shadow-xl bg-steel-pattern">
          <span className="text-xs font-bold uppercase tracking-widest text-[#ff6500] bg-orange-950/80 px-3 py-1 rounded border border-orange-800/50 mb-4 inline-block">
            Industry Solutions
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
            STEEL SOLUTIONS FOR CORE SECTORS
          </h1>
          <p className="text-slate-300 text-base md:text-lg max-w-3xl leading-relaxed">
            From solar mounting structures and municipal water supply to high-rise scaffolding and automotive components, Hariom Pipes powers India's vital economic sectors.
          </p>
        </div>

        <div className="space-y-8 mb-16">
          {sectors.map((sec) => (
            <Card key={sec.id} className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-4">
                  <div className="mb-4">{sec.icon}</div>
                  <h3 className="text-2xl font-bold text-[#0b192c] mb-2">{sec.title}</h3>
                  <div className="pt-2">
                    <Link href={`/quote?requirement=${encodeURIComponent(sec.title)}`}>
                      <Button variant="primary" size="sm" icon={<ArrowRight className="w-4 h-4" />}>
                        Request Sector Quote
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="lg:col-span-8 space-y-4">
                  <div>
                    <strong className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Industry Challenge</strong>
                    <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded border border-slate-200">{sec.challenge}</p>
                  </div>

                  <div>
                    <strong className="text-xs font-bold text-[#ff6500] uppercase tracking-wider block mb-1">Hariom Engineering Solution</strong>
                    <p className="text-xs text-slate-700 leading-relaxed">{sec.solution}</p>
                  </div>

                  <div>
                    <strong className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Recommended Products</strong>
                    <div className="flex flex-wrap gap-2">
                      {sec.products.map((prod, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1.5 text-xs text-slate-800 bg-slate-100 px-3 py-1 rounded font-semibold border border-slate-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#ff6500]" /> {prod}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
