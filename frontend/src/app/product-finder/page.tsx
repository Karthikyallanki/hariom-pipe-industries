'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { SlidersHorizontal, CheckCircle2, ArrowRight, RefreshCw, ShieldCheck, FileText } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/components/products/ProductCard';
import { apiClient } from '@/lib/api-client';
import { IProduct } from '@/types';
import { PRODUCT_CATEGORIES } from '@/lib/constants';

export default function ProductFinderPage() {
  const [selectedApplication, setSelectedApplication] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedFinish, setSelectedFinish] = useState('');
  const [selectedStandard, setSelectedStandard] = useState('');

  const [matchingProducts, setMatchingProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const applicationsList = [
    'Structural Infrastructure',
    'Solar Module Racking',
    'Construction Framing',
    'Potable Water Supply',
    'Agricultural Irrigation',
    'Automotive Components',
    'Modular Furniture',
  ];

  const finishesList = ['Hot-Dip Galvanized', 'Pre-Galvanized Spangle Finish', 'Black Oiled', 'Bright Smooth'];

  const standardsList = ['IS 1161', 'IS 1239 (Part-1)', 'IS 4923', 'IS 2830'];

  const handleSearchFinder = async () => {
    setLoading(true);
    setHasSearched(true);

    let queryParams = '/products/finder?';
    if (selectedApplication) queryParams += `&application=${encodeURIComponent(selectedApplication)}`;
    if (selectedCategory) queryParams += `&category=${encodeURIComponent(selectedCategory)}`;
    if (selectedFinish) queryParams += `&finish=${encodeURIComponent(selectedFinish)}`;
    if (selectedStandard) queryParams += `&standard=${encodeURIComponent(selectedStandard)}`;

    const res = await apiClient.get<IProduct[]>(queryParams);

    if (res.success && res.data) {
      setMatchingProducts(res.data);
    } else {
      setMatchingProducts([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    handleSearchFinder();
  }, [selectedApplication, selectedCategory, selectedFinish, selectedStandard]);

  const resetFinder = () => {
    setSelectedApplication('');
    setSelectedCategory('');
    setSelectedFinish('');
    setSelectedStandard('');
    setHasSearched(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-[#0b192c] text-white rounded-2xl p-8 md:p-12 mb-10 shadow-xl bg-steel-pattern text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#ff6500] bg-orange-950/80 px-3 py-1 rounded border border-orange-800/50 mb-3 inline-block">
            Smart Specification Assistant
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-3">FIND THE RIGHT STEEL PRODUCT</h1>
          <p className="text-slate-300 text-sm md:text-base max-w-2xl mx-auto">
            Select your project sector, category, required finish, or BIS standard to discover recommended Hariom Pipe specifications.
          </p>
        </div>

        {/* Rule Selector Panel */}
        <Card className="p-8 mb-10 border-t-4 border-t-[#ff6500]">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200">
            <h3 className="text-lg font-bold text-[#0b192c] flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-[#ff6500]" /> Product Discovery Parameters
            </h3>
            {(selectedApplication || selectedCategory || selectedFinish || selectedStandard) && (
              <button
                onClick={resetFinder}
                className="text-xs text-[#ff6500] hover:underline flex items-center gap-1 font-semibold"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reset Selection
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1: Application */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                1. Target Application
              </label>
              <select
                value={selectedApplication}
                onChange={(e) => setSelectedApplication(e.target.value)}
                className="w-full rounded-md border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-[#0b192c] focus:ring-[#0b192c]"
              >
                <option value="">All Applications</option>
                {applicationsList.map((app) => (
                  <option key={app} value={app}>
                    {app}
                  </option>
                ))}
              </select>
            </div>

            {/* Step 2: Category */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                2. Product Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-md border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-[#0b192c] focus:ring-[#0b192c]"
              >
                <option value="">All Categories</option>
                {PRODUCT_CATEGORIES.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Step 3: Finish */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                3. Surface Finish
              </label>
              <select
                value={selectedFinish}
                onChange={(e) => setSelectedFinish(e.target.value)}
                className="w-full rounded-md border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-[#0b192c] focus:ring-[#0b192c]"
              >
                <option value="">All Finishes</option>
                {finishesList.map((fn) => (
                  <option key={fn} value={fn}>
                    {fn}
                  </option>
                ))}
              </select>
            </div>

            {/* Step 4: BIS Standard */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                4. BIS / ISO Standard
              </label>
              <select
                value={selectedStandard}
                onChange={(e) => setSelectedStandard(e.target.value)}
                className="w-full rounded-md border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-[#0b192c] focus:ring-[#0b192c]"
              >
                <option value="">All Standards</option>
                {standardsList.map((std) => (
                  <option key={std} value={std}>
                    {std}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Results Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-[#0b192c]">
              Matching Steel Specifications ({matchingProducts.length})
            </h3>
            {hasSearched && (
              <Badge variant="gold">
                {matchingProducts.length > 0 ? 'Optimal Matches Found' : 'No Direct Rule Matches'}
              </Badge>
            )}
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="w-8 h-8 border-4 border-[#ff6500] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-slate-600 text-xs">Evaluating Product Rules...</p>
            </div>
          ) : matchingProducts.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
              <h4 className="text-base font-bold text-slate-800 mb-2">No Products Match Current Criteria</h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto mb-6">
                Try selecting a broader combination of application or finish options.
              </p>
              <Button variant="outline" onClick={resetFinder}>
                Reset Finder Rules
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {matchingProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
