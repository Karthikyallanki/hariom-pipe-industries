'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowRight, CheckCircle2, ShieldCheck, FileText, RefreshCw, Layers } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { apiClient } from '@/lib/api-client';
import { IProduct } from '@/types';

function CompareContent() {
  const searchParams = useSearchParams();
  const initialSlugs = searchParams.get('slugs') || 'hr-pipes-tubes,gi-pipes';

  const [availableProducts, setAvailableProducts] = useState<IProduct[]>([]);
  const [comparedProducts, setComparedProducts] = useState<IProduct[]>([]);
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>(initialSlugs.split(','));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCatalog() {
      const res = await apiClient.get<IProduct[]>('/products?limit=20');
      if (res.success && res.data) {
        setAvailableProducts(res.data);
      }
    }
    loadCatalog();
  }, []);

  useEffect(() => {
    async function fetchComparison() {
      if (selectedSlugs.length === 0) {
        setComparedProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const query = selectedSlugs.join(',');
      const res = await apiClient.get<IProduct[]>(`/products/compare?slugs=${encodeURIComponent(query)}`);

      if (res.success && res.data) {
        setComparedProducts(res.data);
      } else {
        setComparedProducts([]);
      }
      setLoading(false);
    }
    fetchComparison();
  }, [selectedSlugs]);

  const handleSelectProduct = (index: number, newSlug: string) => {
    const updated = [...selectedSlugs];
    if (newSlug) {
      updated[index] = newSlug;
    } else {
      updated.splice(index, 1);
    }
    setSelectedSlugs(updated);
  };

  const addSlot = () => {
    if (selectedSlugs.length < 3) {
      const unused = availableProducts.find((p) => !selectedSlugs.includes(p.slug));
      if (unused) {
        setSelectedSlugs([...selectedSlugs, unused.slug]);
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Product Slots Bar */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
            Select Products to Compare (Up to 3 Items)
          </h3>
          {selectedSlugs.length < 3 && availableProducts.length > selectedSlugs.length && (
            <Button variant="outline" size="sm" onClick={addSlot}>
              + Add Comparison Column
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {selectedSlugs.map((slug, idx) => (
            <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Column {idx + 1}
              </label>
              <select
                value={slug}
                onChange={(e) => handleSelectProduct(idx, e.target.value)}
                className="w-full rounded border border-slate-300 p-2 text-xs text-slate-900 bg-white"
              >
                {availableProducts.map((p) => (
                  <option key={p._id} value={p.slug}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </Card>

      {/* Comparison Matrix Table */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-4 border-[#ff6500] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-slate-600 text-xs">Loading Specification Matrix...</p>
        </div>
      ) : comparedProducts.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl border border-slate-200">
          <p className="text-slate-600 text-sm font-medium">Select products above to view comparison matrix.</p>
        </div>
      ) : (
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-[#0b192c] text-white">
                <tr>
                  <th className="p-4 w-1/4 border-b border-slate-800 uppercase font-bold tracking-wider">
                    Specification Parameter
                  </th>
                  {comparedProducts.map((prod) => (
                    <th key={prod._id} className="p-4 border-b border-slate-800 border-l border-slate-800">
                      <Badge variant="gold" className="mb-1">{typeof prod.category === 'object' ? prod.category.name : 'Steel'}</Badge>
                      <h4 className="text-sm font-bold text-white block">{prod.name}</h4>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {/* Row 1: Brand */}
                <tr className="hover:bg-slate-50">
                  <td className="p-4 font-bold text-slate-900 bg-slate-50">Manufacturer & Brand</td>
                  {comparedProducts.map((prod) => (
                    <td key={prod._id} className="p-4 text-slate-800 border-l border-slate-200 font-semibold">
                      {prod.brand}
                    </td>
                  ))}
                </tr>

                {/* Row 2: Short Description */}
                <tr className="hover:bg-slate-50">
                  <td className="p-4 font-bold text-slate-900 bg-slate-50">Product Description</td>
                  {comparedProducts.map((prod) => (
                    <td key={prod._id} className="p-4 text-slate-700 border-l border-slate-200 leading-relaxed">
                      {prod.shortDescription}
                    </td>
                  ))}
                </tr>

                {/* Row 3: Standards */}
                <tr className="hover:bg-slate-50">
                  <td className="p-4 font-bold text-slate-900 bg-slate-50">BIS / ISO Standards</td>
                  {comparedProducts.map((prod) => (
                    <td key={prod._id} className="p-4 border-l border-slate-200">
                      <div className="flex flex-wrap gap-1">
                        {prod.standards && prod.standards.map((s, i) => (
                          <Badge key={i} variant="steel">{s}</Badge>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Row 4: Finishes */}
                <tr className="hover:bg-slate-50">
                  <td className="p-4 font-bold text-slate-900 bg-slate-50">Surface Finish</td>
                  {comparedProducts.map((prod) => (
                    <td key={prod._id} className="p-4 border-l border-slate-200">
                      <div className="flex flex-wrap gap-1">
                        {prod.finishes && prod.finishes.map((f, i) => (
                          <Badge key={i} variant="gold">{f}</Badge>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Row 5: Primary Applications */}
                <tr className="hover:bg-slate-50">
                  <td className="p-4 font-bold text-slate-900 bg-slate-50">Target Applications</td>
                  {comparedProducts.map((prod) => (
                    <td key={prod._id} className="p-4 border-l border-slate-200">
                      <ul className="space-y-1">
                        {prod.applications && prod.applications.map((app, i) => (
                          <li key={i} className="flex items-center gap-1 text-slate-700">
                            <CheckCircle2 className="w-3 h-3 text-[#ff6500] shrink-0" /> {app}
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>

                {/* Row 6: Quotation CTA */}
                <tr className="bg-slate-100">
                  <td className="p-4 font-bold text-slate-900">Action</td>
                  {comparedProducts.map((prod) => (
                    <td key={prod._id} className="p-4 border-l border-slate-200">
                      <Link href={`/quote?product=${encodeURIComponent(prod.name)}`}>
                        <Button variant="primary" size="sm" className="w-full">
                          Quote for {prod.name.split(' ')[0]}
                        </Button>
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0b192c] text-white rounded-2xl p-8 md:p-10 mb-8 shadow-xl bg-steel-pattern text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#ff6500] bg-orange-950/80 px-3 py-1 rounded border border-orange-800/50 mb-3 inline-block">
            Technical Matrix Evaluation
          </span>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">PRODUCT SPECIFICATION COMPARISON</h1>
          <p className="text-slate-300 text-xs md:text-sm max-w-xl mx-auto">
            Evaluate outer diameters, BIS standards, zinc mass, and finishes side-by-side to choose the right steel pipe.
          </p>
        </div>

        <Suspense fallback={<div className="text-center py-12 text-slate-500">Loading Matrix...</div>}>
          <CompareContent />
        </Suspense>
      </div>
    </div>
  );
}
