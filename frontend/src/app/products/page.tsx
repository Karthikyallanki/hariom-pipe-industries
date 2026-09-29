'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Filter, RefreshCw, SlidersHorizontal, ArrowUpRight, Sparkles, Building2, Layers, ShieldCheck } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProductCard } from '@/components/products/ProductCard';
import { Button } from '@/components/ui/Button';
import { MOCK_PRODUCTS, MOCK_CATEGORIES, SUB_BRANDS } from '@/lib/mockData';
import { IProduct } from '@/types';

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'pipes' | 'coils' | 'scaffolding' | 'billets'>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('');

  // Interactive Client-Side Filtering
  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((product) => {
      // Category filter match
      const slug = product.category.slug.toLowerCase();
      let matchesFilter = true;
      if (activeFilter === 'pipes') {
        matchesFilter = slug.includes('pipes');
      } else if (activeFilter === 'coils') {
        matchesFilter = slug.includes('coils');
      } else if (activeFilter === 'scaffolding') {
        matchesFilter = slug.includes('scaffolding');
      } else if (activeFilter === 'billets') {
        matchesFilter = slug.includes('billets');
      }

      // Brand filter match
      let matchesBrand = true;
      if (selectedBrand) {
        matchesBrand = product.brand.toLowerCase() === selectedBrand.toLowerCase();
      }

      // Search Query match
      let matchesQuery = true;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const inName = product.name.toLowerCase().includes(q);
        const inBrand = product.brand.toLowerCase().includes(q);
        const inDesc = product.shortDescription.toLowerCase().includes(q);
        const inSpecs = product.specifications?.some(
          (s) => s.name.toLowerCase().includes(q) || s.value.toLowerCase().includes(q)
        );
        const inStds = product.standards?.some((std) => std.toLowerCase().includes(q));
        matchesQuery = inName || inBrand || inDesc || inSpecs || inStds;
      }

      return matchesFilter && matchesBrand && matchesQuery;
    });
  }, [activeFilter, selectedBrand, searchQuery]);

  const clearAllFilters = () => {
    setSearchQuery('');
    setActiveFilter('all');
    setSelectedBrand('');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Page Banner Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-amber-500/30 rounded-3xl p-8 md:p-12 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" /> Interactive Product Catalog
            </span>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white uppercase">
              Precision Steel Pipes, Coils & Structural Systems
            </h1>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              Explore Hariom’s complete hierarchy of IS-compliant Hot Rolled, Cold Rolled, Galvanized Pipes, Slit Coils, Scaffolding, and MS Billets manufactured across 4 integrated plant facilities.
            </p>

            {/* Sub-brand highlight pills */}
            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <span className="text-slate-400 font-semibold self-center mr-1">Featured Sub-Brands:</span>
              {SUB_BRANDS.map((b) => (
                <button
                  key={b.name}
                  onClick={() => setSelectedBrand(selectedBrand === b.name ? '' : b.name)}
                  className={`px-3 py-1 rounded-full border transition font-bold ${
                    selectedBrand === b.name
                      ? 'bg-amber-500 text-slate-950 border-amber-400'
                      : 'bg-slate-950/80 border-slate-800 text-amber-400 hover:border-amber-500/50'
                  }`}
                >
                  {b.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Filter Control Center */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-3.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product name, sub-brand (Zincon, Dura Edge, Hariom Veer), or standard (IS 1239, IS 1161)..."
              className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-3 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Core Category Tabs (Instant Client-side filter) */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800/80">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2 flex items-center gap-1">
                <Filter className="w-4 h-4 text-amber-500" /> Category Filter:
              </span>

              <button
                onClick={() => setActiveFilter('all')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeFilter === 'all'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/20'
                    : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700'
                }`}
              >
                All Products ({MOCK_PRODUCTS.length})
              </button>

              <button
                onClick={() => setActiveFilter('pipes')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeFilter === 'pipes'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/20'
                    : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700'
                }`}
              >
                Pipes & Tubes (4)
              </button>

              <button
                onClick={() => setActiveFilter('coils')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeFilter === 'coils'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/20'
                    : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700'
                }`}
              >
                Slit Coils (4)
              </button>

              <button
                onClick={() => setActiveFilter('scaffolding')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeFilter === 'scaffolding'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/20'
                    : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700'
                }`}
              >
                Scaffolding Systems (1)
              </button>

              <button
                onClick={() => setActiveFilter('billets')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeFilter === 'billets'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/20'
                    : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700'
                }`}
              >
                M.S. Billets (1)
              </button>
            </div>

            {(activeFilter !== 'all' || selectedBrand || searchQuery) && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reset All Filters
              </button>
            )}
          </div>
        </div>

        {/* Product Grid Count Display */}
        <div className="flex items-center justify-between text-xs text-slate-400 px-2">
          <span>
            Showing <strong className="text-white font-bold">{filteredProducts.length}</strong> products
            {activeFilter !== 'all' ? ` in ${activeFilter.toUpperCase()}` : ''}
          </span>
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> BIS IS 1239 / 1161 / 4923 Certified Quality
          </span>
        </div>

        {/* Product Cards Interactive Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-slate-950 rounded-2xl border border-slate-800 p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-amber-500">
              <Filter className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">No Products Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              We couldn't find any products matching your specific search query or active filter. Try resetting your filter selection.
            </p>
            <button
              onClick={clearAllFilters}
              className="px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-lg hover:bg-amber-400 transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
