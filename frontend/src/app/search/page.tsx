'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, Package, BookOpen, FileText, Factory, ArrowRight } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { apiClient } from '@/lib/api-client';

interface ISearchResults {
  query: string;
  counts: {
    products: number;
    articles: number;
    documents: number;
    facilities: number;
    total: number;
  };
  results: {
    products: Array<{ _id: string; name: string; slug: string; shortDescription: string; brand: string }>;
    articles: Array<{ _id: string; title: string; slug: string; summary: string; category: string }>;
    documents: Array<{ _id: string; title: string; category: string; fileUrl: string; fileSize: string }>;
    facilities: Array<{ _id: string; unitName: string; location: string; facilityType: string }>;
  };
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<ISearchResults | null>(null);
  const [loading, setLoading] = useState(false);

  const performSearch = async (searchStr: string) => {
    if (!searchStr.trim()) return;
    setLoading(true);
    const res = await apiClient.get<ISearchResults>(`/search?q=${encodeURIComponent(searchStr)}`);
    if (res.success && res.data) {
      setResults(res.data);
    } else {
      setResults(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
    performSearch(query);
  };

  return (
    <div className="space-y-8">
      {/* Search Input Bar */}
      <Card className="p-6">
        <form onSubmit={handleSearchSubmit} className="flex gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search across products, specifications, articles, documents, and plants..."
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0b192c]"
            />
          </div>
          <Button type="submit" variant="primary" isLoading={loading}>
            Search
          </Button>
        </form>
      </Card>

      {/* Results Presentation */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-4 border-[#ff6500] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-slate-600 text-xs">Searching Hariom Enterprise Database...</p>
        </div>
      ) : results ? (
        <div className="space-y-8">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <h2 className="text-lg font-bold text-[#0b192c]">
              Search Results for <span className="text-[#ff6500]">"{results.query}"</span>
            </h2>
            <Badge variant="gold">{results.counts.total} Results Found</Badge>
          </div>

          {/* Group 1: Products */}
          {results.results.products.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <Package className="w-4 h-4 text-[#ff6500]" /> Products ({results.counts.products})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.results.products.map((prod) => (
                  <Card key={prod._id} className="p-5 flex flex-col justify-between">
                    <div>
                      <Badge variant="steel" className="mb-2">{prod.brand}</Badge>
                      <h4 className="text-base font-bold text-[#0b192c] mb-1">{prod.name}</h4>
                      <p className="text-xs text-slate-600 line-clamp-2 mb-3">{prod.shortDescription}</p>
                    </div>
                    <Link href={`/products/${prod.slug}`}>
                      <Button variant="outline" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                        View Product Specs
                      </Button>
                    </Link>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Group 2: Technical Articles */}
          {results.results.articles.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#ff6500]" /> Articles & Whitepapers ({results.counts.articles})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.results.articles.map((art) => (
                  <Card key={art._id} className="p-5 flex flex-col justify-between">
                    <div>
                      <Badge variant="gold" className="mb-2">{art.category}</Badge>
                      <h4 className="text-base font-bold text-[#0b192c] mb-1">{art.title}</h4>
                      <p className="text-xs text-slate-600 line-clamp-2 mb-3">{art.summary}</p>
                    </div>
                    <Link href={`/blogs/${art.slug}`}>
                      <Button variant="outline" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                        Read Article
                      </Button>
                    </Link>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Group 3: Downloads */}
          {results.results.documents.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#ff6500]" /> Documents ({results.counts.documents})
              </h3>
              <div className="space-y-3">
                {results.results.documents.map((doc) => (
                  <Card key={doc._id} className="p-4 flex items-center justify-between gap-4">
                    <div>
                      <Badge variant="steel" className="mb-1">{doc.category}</Badge>
                      <h4 className="text-sm font-bold text-[#0b192c]">{doc.title}</h4>
                    </div>
                    <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm">Download PDF</Button>
                    </a>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {results.counts.total === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
              <p className="text-slate-600 text-sm font-medium">No results found for "{results.query}".</p>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0b192c] text-white rounded-2xl p-8 md:p-10 mb-8 shadow-xl bg-steel-pattern text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#ff6500] bg-orange-950/80 px-3 py-1 rounded border border-orange-800/50 mb-3 inline-block">
            Site-Wide Intelligence Search
          </span>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">GLOBAL ENTERPRISE SEARCH</h1>
          <p className="text-slate-300 text-xs md:text-sm max-w-xl mx-auto">
            Search products, specifications, articles, investor disclosures, and manufacturing plants.
          </p>
        </div>

        <Suspense fallback={<div className="text-center py-12 text-slate-500">Loading Search Bar...</div>}>
          <SearchContent />
        </Suspense>
      </div>
    </div>
  );
}
