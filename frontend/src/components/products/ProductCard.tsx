'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, CheckCircle2, FileText, Layers, Tag, Eye } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { QuoteDrawer } from '@/components/ui/QuoteDrawer';
import { IProduct } from '@/types';

export interface ProductCardProps {
  product: IProduct;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);

  const categoryName = typeof product.category === 'object' ? product.category.name : 'Steel';

  return (
    <>
      <Card className="flex flex-col justify-between h-full group relative overflow-hidden bg-white border border-slate-200 hover:border-amber-500/80 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300">
        {/* Sub-brand Accent Header */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="p-5">
          {/* Top Badges & Sub-brand */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <Badge variant="gold">{categoryName}</Badge>
            <span className="text-[11px] font-extrabold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 tracking-wider">
              {product.brand}
            </span>
          </div>

          {/* Product Title */}
          <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-amber-600 transition-colors mb-2 line-clamp-1">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">{product.shortDescription}</p>

          {/* Standards & Highlights Badges */}
          {product.standards && product.standards.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {product.standards.map((std, i) => (
                <span key={i} className="text-[10px] font-mono font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                  {std}
                </span>
              ))}
            </div>
          )}

          {/* Hover Spec Overlay Panel (Quick Specs Reveal on Hover) */}
          <div className="bg-slate-900 text-slate-100 p-3.5 rounded-xl border border-slate-800 my-2 space-y-2 transform transition-all duration-300 group-hover:border-amber-500/30">
            <div className="flex items-center justify-between text-[10px] uppercase font-extrabold text-amber-400 border-b border-slate-800 pb-1.5">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Quick Specifications
              </span>
              <span className="text-slate-400">IS Standard Compliant</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-0.5">
              {product.specifications?.slice(0, 4).map((spec, idx) => (
                <div key={idx} className="bg-slate-950/60 p-1.5 rounded border border-slate-800">
                  <span className="text-[10px] text-slate-400 block truncate">{spec.name}</span>
                  <span className="font-semibold text-white text-[11px] truncate block">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Applications list */}
          {product.applications && product.applications.length > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Key Industrial Applications
              </span>
              <div className="flex flex-wrap gap-1">
                {product.applications.slice(0, 2).map((app, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1 text-[11px] text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                    <CheckCircle2 className="w-3 h-3 text-amber-500" />
                    {app}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Card Action Buttons */}
        <div className="p-5 pt-3 bg-slate-50/80 border-t border-slate-100 grid grid-cols-2 gap-2">
          <Link href={`/products/${product.slug}`}>
            <Button variant="outline" size="sm" className="w-full text-xs font-bold justify-center border-slate-300 text-slate-700 hover:border-slate-800 hover:bg-slate-900 hover:text-white transition">
              <Eye className="w-3.5 h-3.5 mr-1" /> View Specs
            </Button>
          </Link>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsQuoteOpen(true)}
            className="w-full text-xs font-bold justify-center bg-amber-500 hover:bg-amber-600 text-slate-950 border-none shadow-sm shadow-amber-500/20"
          >
            <FileText className="w-3.5 h-3.5 mr-1" /> Get Quote
          </Button>
        </div>
      </Card>

      {/* Quote Drawer Triggered for this specific product */}
      <QuoteDrawer
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        initialCategory={categoryName}
        initialProduct={`${product.name} (${product.brand})`}
      />
    </>
  );
};
