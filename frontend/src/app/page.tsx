'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ShieldCheck,
  Factory,
  Award,
  Users,
  CheckCircle2,
  FileText,
  SlidersHorizontal,
  ChevronRight,
  TrendingUp,
  Building2,
  Layers,
  Wrench,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProductCard } from '@/components/products/ProductCard';
import { apiClient } from '@/lib/api-client';
import { IProduct } from '@/types';
import { COMPANY_DETAILS, PRODUCT_CATEGORIES } from '@/lib/constants';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<IProduct[]>([]);
  const [activeTab, setActiveTab] = useState('pipes-tubes');

  useEffect(() => {
    async function loadFeatured() {
      const res = await apiClient.get<IProduct[]>('/products?featured=true&limit=8');
      if (res.success && res.data) {
        setFeaturedProducts(res.data);
      }
    }
    loadFeatured();
  }, []);

  const metrics = [
    { label: 'Installed Capacity', value: COMPANY_DETAILS.totalCapacityMTPA, sub: 'Across 4 Integrated Units' },
    { label: 'Authorized Dealers', value: COMPANY_DETAILS.dealerCount, sub: 'Pan-India Distribution' },
    { label: 'Retail Selling Points', value: COMPANY_DETAILS.retailPoints, sub: 'South & Central India' },
    { label: 'Legacy of Excellence', value: '18+ Years', sub: 'Established in 2007' },
  ];

  const industries = [
    {
      title: 'Infrastructure & Solar',
      desc: 'High-tensile HR & GP structural tubes engineered for solar mounting structures, highway guardrails, and heavy framework.',
      icon: <Building2 className="w-8 h-8 text-[#ff6500]" />,
    },
    {
      title: 'Agriculture & Irrigation',
      desc: 'Hot-dip Galvanized Iron (GI) pipes certified under IS 1239 for long-lasting water transportation and tube-wells.',
      icon: <Zap className="w-8 h-8 text-[#ff6500]" />,
    },
    {
      title: 'Building Construction',
      desc: 'Heavy-duty steel scaffolding systems, cuplock standards, props, and structural pipes for high-rise developments.',
      icon: <Wrench className="w-8 h-8 text-[#ff6500]" />,
    },
    {
      title: 'Automotive & Furniture',
      desc: 'Precision Cold Rolled (CR) tubes offering close wall thickness tolerances and smooth surface finish for chrome plating.',
      icon: <Layers className="w-8 h-8 text-[#ff6500]" />,
    },
  ];

  const valueChainSteps = [
    { step: '01', title: 'Raw Material Reduction', desc: 'High-grade iron ore reduced in sponge iron kilns at Ananthapur & Mahabubnagar.' },
    { step: '02', title: 'Induction Melting & CCM', desc: 'Sponge iron processed in induction furnaces and continuously cast into MS Billets.' },
    { step: '03', title: 'ERW & Cold Tandem Mills', desc: 'High-frequency ERW pipe mills & cold rolling tandem mills process precision tubes.' },
    { step: '04', title: 'Hot-Dip Galvanizing Kettle', desc: 'Pipes submerged in molten zinc baths at Perundurai unit to achieve anti-corrosion coating.' },
    { step: '05', title: 'Hydrostatic & QC Inspection', desc: '100% pressure testing and dimensional audits prior to dispatch.' },
  ];

  return (
    <div className="space-y-0">
      {/* SECTION 1 — HERO BANNER */}
      <section className="relative bg-[#0b192c] text-white pt-20 pb-28 overflow-hidden bg-steel-pattern border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 bg-orange-950/80 border border-orange-800/60 px-3.5 py-1.5 rounded-full">
                <ShieldCheck className="w-4 h-4 text-[#ff6500]" />
                <span className="text-xs font-bold uppercase tracking-widest text-[#ff6500]">
                  NSE: HARIOMPIPE | BSE: 543517
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none text-white">
                ENGINEERED FOR STRENGTH. <br />
                <span className="text-gradient-gold">BUILT FOR WHAT'S NEXT.</span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
                Hariom Pipe Industries Limited is a premier integrated iron and steel manufacturer. From sponge iron and MS billets to precision HR, CR, GI pipes, and scaffolding systems—we build the backbone of modern Indian infrastructure.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-wrap gap-4 items-center">
                <Link href="/products">
                  <Button variant="primary" size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                    Explore Products
                  </Button>
                </Link>
                <Link href="/quote">
                  <Button variant="secondary" size="lg" className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700">
                    Request a Quote
                  </Button>
                </Link>
                <Link href="/manufacturing">
                  <Button variant="ghost" size="lg" className="text-slate-300 hover:text-white hover:bg-slate-800">
                    Explore Manufacturing →
                  </Button>
                </Link>
              </div>

              {/* Trust Callouts */}
              <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-xs text-slate-400">
                <div>
                  <strong className="text-white block text-sm font-bold">7,01,237 MTPA</strong>
                  Total Capacity
                </div>
                <div>
                  <strong className="text-white block text-sm font-bold">4 Units</strong>
                  Telangana, AP, TN
                </div>
                <div>
                  <strong className="text-white block text-sm font-bold">BIS Certified</strong>
                  IS 1161 / 1239 / 4923
                </div>
              </div>
            </div>

            {/* Right Industrial Card Display */}
            <div className="lg:col-span-5">
              <div className="bg-gradient-to-br from-slate-900 to-[#0f172a] border border-slate-700/80 rounded-2xl p-6 shadow-2xl space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <span className="text-xs font-bold text-[#ff6500] uppercase tracking-widest flex items-center gap-1.5">
                    <Factory className="w-4 h-4" /> Integrated Operations
                  </span>
                  <Badge variant="gold">South India Leader</Badge>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/50">
                    <span className="text-xs text-slate-400 font-semibold block uppercase">Key Facility Focus</span>
                    <h4 className="text-base font-bold text-white mt-1">Mahabubnagar Integrated Plant</h4>
                    <p className="text-xs text-slate-300 mt-1">Sponge Iron, MS Billets & High-Frequency ERW Pipe Mills.</p>
                  </div>

                  <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/50">
                    <span className="text-xs text-slate-400 font-semibold block uppercase">Coil & Galvanizing Hub</span>
                    <h4 className="text-base font-bold text-white mt-1">Perundurai Unit III (Tamil Nadu)</h4>
                    <p className="text-xs text-slate-300 mt-1">Continuous Hot-Dip Galvanizing Kettles & Strip Slitting.</p>
                  </div>
                </div>

                <div className="pt-2">
                  <Link href="/product-finder" className="w-full block">
                    <Button variant="primary" size="md" className="w-full justify-between" icon={<SlidersHorizontal className="w-4 h-4" />}>
                      <span>Find the Right Product</span>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — TRUST & METRICS SNAPSHOT */}
      <section className="bg-white py-12 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {metrics.map((item, i) => (
              <div key={i} className="p-6 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#ff6500]/50 transition-colors">
                <span className="text-3xl md:text-4xl font-black text-[#0b192c] block mb-1">{item.value}</span>
                <span className="text-xs font-bold text-[#ff6500] uppercase tracking-wider block mb-1">{item.label}</span>
                <span className="text-[11px] text-slate-500">{item.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 — INTERACTIVE PRODUCT EXPLORER */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            category="Manufacturing Portfolio"
            title="ENGINEERED STEEL PRODUCT SPECTRUM"
            subtitle="Explore our comprehensive range of MS Billets, HR, CR, GI, GP Pipes, Slit Coils, and Structural Scaffolding."
            centered
          />

          {/* Featured Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {featuredProducts.length > 0 ? (
              featuredProducts.slice(0, 4).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-slate-500 text-sm">
                Loading products...
              </div>
            )}
          </div>

          <div className="text-center">
            <Link href="/products">
              <Button variant="primary" size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                View Entire Product Catalog
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 4 — INTEGRATED MANUFACTURING VALUE CHAIN */}
      <section className="py-20 bg-[#0b192c] text-white bg-steel-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            category="End-to-End Integration"
            title="OUR INTEGRATED MANUFACTURING JOURNEY"
            subtitle="From raw iron ore reduction to continuous galvanizing and quality inspection."
            theme="dark"
            centered
          />

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {valueChainSteps.map((step, idx) => (
              <div key={idx} className="bg-slate-900/80 border border-slate-800 p-6 rounded-xl relative hover:border-[#ff6500] transition-colors">
                <span className="text-3xl font-black text-[#ff6500] block mb-2">{step.step}</span>
                <h4 className="text-sm font-bold text-white mb-2">{step.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 — INDUSTRIES SERVED */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            category="Application Sectors"
            title="POWERING INDIA'S CORE INDUSTRIES"
            subtitle="Delivering specialized steel pipes and structural profiles across key economic sectors."
            centered
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {industries.map((ind, i) => (
              <Card key={i} className="flex flex-col justify-between">
                <div>
                  <div className="mb-4">{ind.icon}</div>
                  <h3 className="text-lg font-bold text-[#0b192c] mb-2">{ind.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">{ind.desc}</p>
                </div>
                <Link href="/industries" className="text-xs font-bold text-[#ff6500] hover:underline flex items-center gap-1">
                  Explore Solutions <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6 — DEALER & PARTNER NETWORK CTA */}
      <section className="py-16 bg-[#ff6500] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest bg-black/20 px-3 py-1 rounded inline-block mb-3">
              Distribution Network Expansion
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              BECOME AN AUTHORIZED HARIOM DEALER
            </h2>
            <p className="text-white/90 text-sm md:text-base mt-2 max-w-2xl">
              Join a network of 900+ authorized dealers backed by robust factory supply chains, marketing support, and direct factory pricing.
            </p>
          </div>

          <div className="shrink-0 flex gap-4">
            <Link href="/dealer-enquiry">
              <Button variant="secondary" size="lg" className="bg-[#0b192c] hover:bg-slate-900 text-white">
                Apply for Dealership
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
