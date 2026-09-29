import React from 'react';
import Link from 'next/link';
import { ArrowRight, Shield, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { IProduct } from '@/types';

export interface ProductCardProps {
  product: IProduct;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Card className="flex flex-col justify-between h-full group hover:border-[#ff6500]/50 transition-all duration-300">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <Badge variant="gold">{typeof product.category === 'object' ? product.category.name : 'Steel'}</Badge>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{product.brand}</span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-[#0b192c] group-hover:text-[#ff6500] transition-colors mb-2 line-clamp-1">
          {product.name}
        </h3>

        {/* Short Description */}
        <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">{product.shortDescription}</p>

        {/* Applications preview */}
        {product.applications && product.applications.length > 0 && (
          <div className="mb-4 pt-3 border-t border-slate-100">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
              Primary Applications
            </span>
            <div className="flex flex-wrap gap-1">
              {product.applications.slice(0, 3).map((app, idx) => (
                <span key={idx} className="inline-flex items-center gap-1 text-[11px] text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                  <CheckCircle2 className="w-3 h-3 text-[#ff6500]" />
                  {app}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Card Actions */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
        <Link href={`/products/${product.slug}`} className="w-full">
          <Button variant="outline" size="sm" className="w-full justify-between group-hover:border-[#ff6500] group-hover:text-[#ff6500]">
            <span>View Specifications</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </Card>
  );
};
