'use client';

import React, { useState } from 'react';
import { Factory, MapPin, Layers, CheckCircle2, ShieldCheck, Flame, Cpu, Gauge, Sparkles, ChevronRight, Activity } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function ManufacturingPage() {
  const [activeStep, setActiveStep] = useState(0);

  const timelineSteps = [
    {
      num: '01',
      title: 'Raw Material Reduction (Sponge Iron)',
      facility: 'Unit I (Mahabubnagar) & Unit II (Ananthapur)',
      capacity: 'Sponge Iron Division: 3,00,000 MTPA',
      badge: 'DRI Ore Kilns',
      description:
        'High-grade iron ore lump is directly reduced inside heavy-duty rotary kilns using non-coking coal at 1050°C. This converts iron oxide into metallized Sponge Iron (DRI) with high metallic purity (> 88% Fe).',
      keySpecs: ['Kiln Operating Temp: 1050°C', 'Metallic Fe Purity: ≥ 88%', 'Raw Ore Feed: High Grade Lump'],
      processHighlight: 'Direct Reduced Iron (DRI) Sponge Iron Kilns in operation.',
      icon: Flame,
    },
    {
      num: '02',
      title: 'Induction Melting & Continuous Casting (CCM)',
      facility: 'Unit I (Mahabubnagar Integrated Plant)',
      capacity: 'M.S. Billets Capacity: 2,50,000 MTPA',
      badge: 'CCM Casting',
      description:
        'Sponge Iron is blended with high-purity internal scrap in 15-Ton Induction Furnaces. The liquid steel is refined, deslagged, and poured into a 2-Strand Curved Mold Continuous Casting Machine (CCM) to cast dense 100x100mm & 125x125mm M.S. Billets.',
      keySpecs: ['Furnace Capacity: 15-Ton Induction', 'Casting Strands: 2-Strand CCM', 'Billet Sizes: 100sq, 125sq, 150sq'],
      processHighlight: 'Molten steel continuously cast into solid MS Billets.',
      icon: Cpu,
    },
    {
      num: '03',
      title: 'High-Frequency ERW Pipe Milling',
      facility: 'Unit I (Mahabubnagar) & Unit III (Perundurai)',
      capacity: 'Tube Mill Capacity: 3,00,000 MTPA',
      badge: 'HFIW ERW Mill',
      description:
        'Hot Rolled & Cold Rolled slit coils pass through precision multi-stage forming rolls into cylindrical shapes. High-Frequency Induction Welding (HFIW) at 450 kHz fuses the seam continuously without adding filler metal.',
      keySpecs: ['Welding Frequency: 450 kHz HFIW', 'OD Range: 15mm - 219mm', 'Thickness: 1.2mm - 8.0mm'],
      processHighlight: 'High-speed ERW tube mill seam welding.',
      icon: Factory,
    },
    {
      num: '04',
      title: 'Hot-Dip Galvanizing Kettles (Zincon)',
      facility: 'Unit III (Perundurai, Tamil Nadu) & Unit IV (Mahabubnagar)',
      capacity: 'Galvanizing Capacity: 1,20,000 MTPA',
      badge: '99.99% Pure Zinc Bath',
      description:
        'Cleaned & pickled steel pipes are completely submerged into a molten zinc kettle maintained at 450°C. This forms a multi-layered zinc-iron alloy shield with coating density > 360 g/m² for multi-decade corrosion resistance.',
      keySpecs: ['Zinc Purity: 99.99% Primary Zinc', 'Zinc Coating Density: ≥ 360 g/m²', 'Immersion Temp: 450°C'],
      processHighlight: 'Pipes submerged in hot-dip galvanizing kettles.',
      icon: Layers,
    },
    {
      num: '05',
      title: 'Quality Control & Hydrostatic Inspection',
      facility: 'All 4 Manufacturing Units (QC Labs)',
      capacity: '100% Quality Inspected Batches',
      badge: 'BIS / ISO Certified',
      description:
        'Every single pipe batch undergoes rigorous non-destructive testing (NDT), Eddy Current flaw detection, wall thickness ultrasonic measurement, and 100% Hydrostatic Pressure Testing up to 50 bar (5 MPa).',
      keySpecs: ['Hydrostatic Test: 50 Bar (5 MPa)', 'Flaw Detection: Eddy Current NDT', 'Certifications: IS 1239 / 1161 / 4923'],
      processHighlight: 'Hydrostatic testing bay & ultrasonic weld inspection.',
      icon: ShieldCheck,
    },
  ];

  const CurrentIcon = timelineSteps[activeStep].icon;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Hero Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-amber-500/30 rounded-3xl p-8 md:p-12 shadow-2xl">
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" /> Integrated Manufacturing Footprint
            </span>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white uppercase">
              7,01,237 MTPA Integrated Production Value Chain
            </h1>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              From raw iron ore reduction in sponge kilns to high-frequency ERW milling, hot-dip galvanizing, and hydrostatic testing across 4 plant units in Southern India.
            </p>
          </div>
        </div>

        {/* SECTION: Integrated Manufacturing Journey (Animated Timeline) */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-amber-500 bg-amber-500/10 px-3.5 py-1 rounded-full border border-amber-500/20">
              Interactive Production Journey
            </span>
            <h2 className="text-2xl md:text-4xl font-black tracking-tight text-white uppercase">
              5-Step Manufacturing Process
            </h2>
            <p className="text-xs md:text-sm text-slate-400 max-w-2xl mx-auto">
              Click through the manufacturing stages to explore the technology, facility specs, and quality controls at each step.
            </p>
          </div>

          {/* Timeline Step Navigation Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {timelineSteps.map((step, idx) => {
              const IconComp = step.icon;
              const isActive = activeStep === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between h-32 relative overflow-hidden group ${
                    isActive
                      ? 'bg-gradient-to-br from-amber-500/20 via-slate-900 to-slate-950 border-amber-500 shadow-xl shadow-amber-500/10 ring-1 ring-amber-500'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-mono font-black ${
                        isActive ? 'text-amber-400' : 'text-slate-600'
                      }`}
                    >
                      STEP {step.num}
                    </span>
                    <IconComp
                      className={`w-5 h-5 ${
                        isActive ? 'text-amber-400 scale-110' : 'text-slate-600 group-hover:text-slate-400'
                      } transition-transform`}
                    />
                  </div>
                  <div>
                    <h3
                      className={`text-xs font-bold line-clamp-2 ${
                        isActive ? 'text-white font-extrabold' : 'text-slate-300'
                      }`}
                    >
                      {step.title}
                    </h3>
                  </div>

                  {/* Active Indicator Bar */}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500 animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Step Content Display Card */}
          <div className="bg-slate-950 border border-amber-500/30 rounded-3xl p-6 md:p-10 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-in fade-in duration-300">
            {/* Left Details */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-extrabold text-amber-500 bg-amber-500/10 px-3 py-1 rounded-md border border-amber-500/30">
                    STAGE {timelineSteps[activeStep].num} OF 05
                  </span>
                  <span className="text-xs text-slate-300 bg-slate-900 border border-slate-800 px-3 py-1 rounded-md flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-500" />
                    {timelineSteps[activeStep].facility}
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                  {timelineSteps[activeStep].title}
                </h3>
              </div>

              <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                {timelineSteps[activeStep].description}
              </p>

              {/* Key Specs Pills */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                  Technical Parameters & Capabilities:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {timelineSteps[activeStep].keySpecs.map((spec, i) => (
                    <div
                      key={i}
                      className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <button
                  onClick={() =>
                    setActiveStep((prev) => (prev < timelineSteps.length - 1 ? prev + 1 : 0))
                  }
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-amber-500/20 transition"
                >
                  Next Process Stage <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Process Graphic Representation Card */}
            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-6 relative overflow-hidden">
              <div className="w-20 h-20 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
                <CurrentIcon className="w-10 h-10 animate-bounce" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-amber-500 uppercase tracking-widest block">
                  {timelineSteps[activeStep].badge}
                </span>
                <h4 className="text-lg font-bold text-white">
                  {timelineSteps[activeStep].processHighlight}
                </h4>
                <p className="text-xs text-slate-400">
                  {timelineSteps[activeStep].capacity}
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <Activity className="w-4 h-4" /> Live Operational Status
                </span>
                <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                  ONLINE 100%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Plant Facilities Grid */}
        <div className="pt-8 space-y-6">
          <SectionHeading
            category="Plant Network"
            title="FOUR INTEGRATED MANUFACTURING UNITS"
            subtitle="Spread across Telangana, Andhra Pradesh, and Tamil Nadu."
            centered
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-950 border border-slate-800 p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-500 uppercase flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> Mahabubnagar, Telangana
                </span>
                <Badge variant="gold">Integrated Steel Plant</Badge>
              </div>
              <h3 className="text-xl font-bold text-white">Unit I - Integrated Main Plant</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Houses Sponge Iron rotary kilns, 15-Ton Induction Furnaces, 2-Strand Continuous Casting Machine (CCM) for MS Billets, and ERW Tube Mills for HR/CR Pipes.
              </p>
            </Card>

            <Card className="bg-slate-950 border border-slate-800 p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-500 uppercase flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> Ananthapur, Andhra Pradesh
                </span>
                <Badge variant="gold">Raw Material Division</Badge>
              </div>
              <h3 className="text-xl font-bold text-white">Unit II - Sponge Iron Facility</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Dedicated raw material reduction plant operating sponge iron rotary kilns with captive coal handling and iron ore processing systems.
              </p>
            </Card>

            <Card className="bg-slate-950 border border-slate-800 p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-500 uppercase flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> Perundurai, Tamil Nadu
                </span>
                <Badge variant="gold">Galvanizing Division</Badge>
              </div>
              <h3 className="text-xl font-bold text-white">Unit III - Perundurai Galvanizing Unit</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Equipped with automatic hot-dip galvanizing kettles producing Zincon GI Pipes and high-speed CNC slitting lines for GP & HRPO Coils.
              </p>
            </Card>

            <Card className="bg-slate-950 border border-slate-800 p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-500 uppercase flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> Mahabubnagar, Telangana
                </span>
                <Badge variant="gold">CR & Galvanizing Expansion</Badge>
              </div>
              <h3 className="text-xl font-bold text-white">Unit IV - Advanced Cold Rolling Mill</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                State-of-the-art Cold Reversing Mill (CRM) and continuous galvanizing lines for premium Dura Edge CR Pipes & CRCA Coils.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
