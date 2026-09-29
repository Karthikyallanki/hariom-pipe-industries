'use client';

import React, { useState, useEffect } from 'react';
import { Factory, MapPin, Layers, CheckCircle2, ShieldCheck, Cpu } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { apiClient } from '@/lib/api-client';

interface IFacility {
  _id: string;
  unitName: string;
  location: string;
  state: string;
  facilityType: string;
  capacityDetails: string;
  capabilities: string[];
}

export default function ManufacturingPage() {
  const [facilities, setFacilities] = useState<IFacility[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFacilities() {
      const res = await apiClient.get<IFacility[]>('/facilities');
      if (res.success && res.data) {
        setFacilities(res.data);
      }
      setLoading(false);
    }
    loadFacilities();
  }, []);

  const processSteps = [
    { num: '01', title: 'Raw Material Reduction', detail: 'High-grade iron ore reduced in sponge iron kilns to produce Direct Reduced Iron (DRI).' },
    { num: '02', title: 'Steel Making (Induction & CCM)', detail: 'Sponge iron melted with quality scrap in induction furnaces and continuously cast into MS Billets.' },
    { num: '03', title: 'Slitting & Tube Forming', detail: 'HR/CR coils precision-slit and processed through High-Frequency Induction ERW Tube Mills.' },
    { num: '04', title: 'Hot-Dip Galvanizing Kettle', detail: 'Pipes submerged in molten zinc baths at Perundurai to achieve uniform anti-rust coating.' },
    { num: '05', title: 'Hydrostatic & QC Audits', detail: '100% hydrostatic pressure testing, ultrasonic eddy current testing, and dimensional inspection.' },
    { num: '06', title: 'Packaging & Dispatch', detail: 'Automated hexagonal bundle strapping, protective capping, and logistics dispatch.' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="bg-[#0b192c] text-white rounded-2xl p-8 md:p-12 mb-12 shadow-xl bg-steel-pattern">
          <span className="text-xs font-bold uppercase tracking-widest text-[#ff6500] bg-orange-950/80 px-3 py-1 rounded border border-orange-800/50 mb-4 inline-block">
            Manufacturing Operations & Facilities
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
            7,01,237 MTPA INTEGRATION FOOTPRINT
          </h1>
          <p className="text-slate-300 text-base md:text-lg max-w-3xl leading-relaxed">
            Hariom Pipe Industries operates 4 primary manufacturing facilities across Telangana, Andhra Pradesh, and Tamil Nadu, ensuring complete control from raw iron reduction to finished galvanized pipes.
          </p>
        </div>

        {/* Manufacturing Facilities Grid */}
        <div className="mb-16">
          <SectionHeading
            category="Plant Network"
            title="FOUR PRIMARY MANUFACTURING UNITS"
            subtitle="Explore our integrated production centers across Southern India."
            centered
          />

          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-[#ff6500] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-slate-600 text-sm">Loading Manufacturing Plants...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {facilities.map((fac) => (
                <Card key={fac._id} className="flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-xs font-bold text-[#ff6500] uppercase tracking-wider flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> {fac.location}, {fac.state}
                      </span>
                      <Badge variant="gold">{fac.facilityType}</Badge>
                    </div>

                    <h3 className="text-xl font-bold text-[#0b192c] mb-2">{fac.unitName}</h3>
                    <p className="text-xs text-slate-600 mb-4 bg-slate-50 p-3 rounded border border-slate-200">
                      <strong>Capacities & Output:</strong> {fac.capacityDetails}
                    </p>

                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Plant Capabilities</span>
                      {fac.capabilities && fac.capabilities.map((cap, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#ff6500] shrink-0" />
                          <span>{cap}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Process Flow Timeline */}
        <div>
          <SectionHeading
            category="Quality Value Chain"
            title="THE HARIOM MANUFACTURING PROCESS"
            subtitle="Step-by-step production flow from raw ore to finished steel pipes."
            centered
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {processSteps.map((p, i) => (
              <Card key={i} className="relative">
                <span className="text-2xl font-black text-[#ff6500] block mb-2">{p.num}</span>
                <h4 className="text-base font-bold text-[#0b192c] mb-2">{p.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{p.detail}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
