'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, CheckCircle2, ShieldCheck, Download, FileText, Share2, Layers } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { ProductCard } from '@/components/products/ProductCard';
import { apiClient } from '@/lib/api-client';
import { IProduct } from '@/types';
import { COMPANY_DETAILS } from '@/lib/constants';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [product, setProduct] = useState<IProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      if (!slug) return;
      setLoading(true);
      const res = await apiClient.get<{ product: IProduct; relatedProducts: IProduct[] }>(`/products/${slug}`);
      if (res.success && res.data) {
        setProduct(res.data.product);
        setRelatedProducts(res.data.relatedProducts || []);
      }
      setLoading(false);
    }
    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#ff6500] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Fetching Technical Datasheet...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 py-20">
        <div className="max-w-md mx-auto text-center bg-white p-8 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-2">Specification Not Found</h2>
          <p className="text-slate-600 text-sm mb-6">The requested pipe or coil specification is unavailable.</p>
          <Link href="/products">
            <Button variant="primary">Return to Catalog</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link href="/products" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#ff6500] transition-colors uppercase tracking-wider">
            <ArrowLeft className="w-4 h-4" /> Back to Product Catalog
          </Link>
        </div>

        {/* Product Hero */}
        <div className="bg-[#0b192c] text-white rounded-2xl p-8 md:p-12 mb-10 shadow-xl bg-steel-pattern relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="gold">{typeof product.category === 'object' ? product.category.name : 'Steel'}</Badge>
                <span className="text-xs font-extrabold uppercase tracking-widest text-slate-300">Brand: {product.brand}</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4 text-white">{product.name}</h1>
              <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-6">{product.shortDescription}</p>

              <div className="flex flex-wrap gap-4">
                <Link href={`/quote?product=${encodeURIComponent(product.name)}`}>
                  <Button variant="primary" size="lg" icon={<FileText className="w-5 h-5" />}>
                    Request Official Quote
                  </Button>
                </Link>
                <Link href="/compare">
                  <Button variant="outline" size="lg" className="border-slate-500 text-white hover:bg-slate-800">
                    Compare Specs
                  </Button>
                </Link>
              </div>
            </div>

            {/* Quick Metrics Badge Card */}
            <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-6 backdrop-blur">
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#ff6500] mb-4 pb-2 border-b border-slate-800">
                Manufacturing Highlights
              </h4>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Integrated Unit:</span>
                  <span className="font-semibold text-white">Mahabubnagar / Perundurai</span>
                </li>
                <li className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Quality Assurance:</span>
                  <span className="font-semibold text-white">100% Hydrostatic / Eddy Tested</span>
                </li>
                <li className="flex justify-between py-1">
                  <span className="text-slate-400">BIS Compliance:</span>
                  <span className="font-semibold text-white">IS Certified</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Detailed Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <Card>
              <h3 className="text-xl font-bold text-[#0b192c] mb-4 pb-2 border-b border-slate-200">
                Technical Overview & Manufacturing Process
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line mb-6">
                {product.description}
              </p>

              {/* Applications */}
              {product.applications && product.applications.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Key Applications</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {product.applications.map((app, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs font-medium text-slate-800">
                        <CheckCircle2 className="w-4 h-4 text-[#ff6500] shrink-0" />
                        <span>{app}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {/* Technical Specifications Table */}
            <Card>
              <h3 className="text-xl font-bold text-[#0b192c] mb-4 pb-2 border-b border-slate-200">
                Verified Technical Specifications
              </h3>
              {product.specifications && product.specifications.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 text-slate-700 uppercase font-semibold">
                      <tr>
                        <th className="px-4 py-3 rounded-l">Parameter</th>
                        <th className="px-4 py-3 rounded-r">Specification Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {product.specifications.map((spec, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-semibold text-slate-900">{spec.name}</td>
                          <td className="px-4 py-3 text-slate-700">{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">Specification details available on request.</p>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Standards & Finishes Card */}
            <Card>
              <h4 className="text-sm font-bold text-[#0b192c] uppercase tracking-wider mb-3">Standards & Finishes</h4>
              
              <div className="mb-4">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">BIS / International Standards</span>
                <div className="flex flex-wrap gap-1.5">
                  {product.standards && product.standards.map((std, i) => (
                    <Badge key={i} variant="steel">{std}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">Surface Finishes</span>
                <div className="flex flex-wrap gap-1.5">
                  {product.finishes && product.finishes.map((fn, i) => (
                    <Badge key={i} variant="gold">{fn}</Badge>
                  ))}
                </div>
              </div>
            </Card>

            {/* Quote Action Box */}
            <Card className="bg-[#0b192c] text-white border-none shadow-lg">
              <h4 className="text-lg font-bold mb-2">Need Custom Quotation?</h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Request pricing for specific wall thickness, lengths, or bulk mill orders directly from Hariom Sales Team.
              </p>
              <Link href={`/quote?product=${encodeURIComponent(product.name)}`}>
                <Button variant="primary" size="md" className="w-full">
                  Request Instant Quote
                </Button>
              </Link>
            </Card>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="pt-8 border-t border-slate-200">
            <h3 className="text-xl font-bold text-[#0b192c] mb-6">Related Steel Products</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel._id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
