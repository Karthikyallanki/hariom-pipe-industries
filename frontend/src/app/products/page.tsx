'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, RefreshCw, SlidersHorizontal, ArrowUpRight } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProductCard } from '@/components/products/ProductCard';
import { Button } from '@/components/ui/Button';
import { apiClient } from '@/lib/api-client';
import { IProduct, ICategory } from '@/types';
import { PRODUCT_CATEGORIES } from '@/lib/constants';

export default function ProductsPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedApplication, setSelectedApplication] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    let endpoint = '/products?limit=24';
    if (selectedCategory) endpoint += `&category=${selectedCategory}`;
    if (selectedApplication) endpoint += `&application=${encodeURIComponent(selectedApplication)}`;
    if (searchQuery) endpoint += `&search=${encodeURIComponent(searchQuery)}`;

    const res = await apiClient.get<IProduct[]>(endpoint);
    if (res.success && res.data) {
      setProducts(res.data);
    } else {
      setProducts([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedApplication]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedApplication('');
  };

  const applicationsList = [
    'Structural Infrastructure',
    'Solar Module Racking',
    'Construction Framing',
    'Potable Water Supply',
    'Agricultural Irrigation',
    'Automotive Components',
    'Modular Furniture',
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-[#0b192c] text-white rounded-2xl p-8 md:p-12 mb-10 shadow-xl bg-steel-pattern relative overflow-hidden">
          <div className="max-w-3xl relative z-10">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#ff6500] bg-orange-950/80 px-3 py-1 rounded border border-orange-800/50 mb-4 inline-block">
              Product Portfolio & Catalogue
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
              PRECISION STEEL PIPES & TUBE SYSTEMS
            </h1>
            <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-6">
              Explore Hariom’s comprehensive range of Hot Rolled, Cold Rolled, Galvanized, Pre-Galvanized Pipes, Slit Coils, and Structural Scaffolding engineered to BIS standards.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/product-finder">
                <Button variant="primary" icon={<SlidersHorizontal className="w-4 h-4" />}>
                  Launch Product Finder
                </Button>
              </Link>
              <Link href="/compare">
                <Button variant="outline" className="border-slate-500 text-white hover:bg-slate-800">
                  Compare Specifications
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Search & Filter Control Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by keyword, grade, diameter or standard..."
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0b192c]"
              />
            </div>
            <Button type="submit" variant="primary">
              Search Catalogue
            </Button>
          </form>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Categories:
            </span>
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                selectedCategory === '' ? 'bg-[#0b192c] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Categories
            </button>
            {PRODUCT_CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                  selectedCategory === cat.slug ? 'bg-[#0b192c] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat.name}
              </button>
            ))}

            {(selectedCategory || selectedApplication || searchQuery) && (
              <button
                onClick={clearFilters}
                className="ml-auto text-xs text-[#ff6500] hover:underline flex items-center gap-1 font-semibold"
              >
                <RefreshCw className="w-3 h-3" /> Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-[#ff6500] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Loading Hariom Steel Product Specifications...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center my-8">
            <h3 className="text-lg font-bold text-slate-800 mb-2">No Matching Products Found</h3>
            <p className="text-slate-600 text-sm max-w-md mx-auto mb-6">
              We couldn't find any products matching your specific query filter. Try broadening your filter criteria or view all items.
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Reset Search Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
