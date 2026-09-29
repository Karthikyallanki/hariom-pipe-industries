import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, ExternalLink, ShieldCheck } from 'lucide-react';
import { COMPANY_DETAILS } from '@/lib/constants';

export const Footer = () => {
  return (
    <footer className="bg-[#070f1b] text-slate-300 pt-16 pb-8 border-t border-slate-800" aria-label="Corporate Footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: Corporate Profile */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#ff6500] rounded flex items-center justify-center font-black text-lg text-white" aria-hidden="true">
                H
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                HARIOM <span className="text-[#ff6500]">PIPES</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              Hariom Pipe Industries Limited is a premier integrated iron and steel manufacturer operating state-of-the-art production facilities across Telangana, Andhra Pradesh, and Tamil Nadu.
            </p>
            <div className="pt-2 text-xs text-slate-400 space-y-1">
              <p><strong className="text-white">Corporate Office:</strong> {COMPANY_DETAILS.corporateOffice}</p>
              <p><strong className="text-white">Stock Tickers:</strong> {COMPANY_DETAILS.listedExchanges}</p>
            </div>
          </div>

          {/* Col 2: Products */}
          <nav className="space-y-3" aria-label="Footer Products Navigation">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider text-[#ff6500]">Products</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/products/hr-pipes-tubes" className="hover:text-white transition-colors">HR Pipes & Tubes</Link></li>
              <li><Link href="/products/cr-pipes-tubes" className="hover:text-white transition-colors">CR Pipes & Tubes</Link></li>
              <li><Link href="/products/gi-pipes" className="hover:text-white transition-colors">GI Pipes (Galvanized)</Link></li>
              <li><Link href="/products/gp-pipes-tubes" className="hover:text-white transition-colors">GP Pipes & Tubes</Link></li>
              <li><Link href="/products/hrpo-slit-coils" className="hover:text-white transition-colors">HRPO Slit Coils</Link></li>
              <li><Link href="/products/crca-slit-coils" className="hover:text-white transition-colors">CRCA Slit Coils</Link></li>
              <li><Link href="/products/scaffolding-systems" className="hover:text-white transition-colors">Scaffolding Systems</Link></li>
              <li><Link href="/products/ms-billets" className="hover:text-white transition-colors">M.S. Billets</Link></li>
            </ul>
          </nav>

          {/* Col 3: Company & Governance */}
          <nav className="space-y-3" aria-label="Footer Company Navigation">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider text-[#ff6500]">Company</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/manufacturing" className="hover:text-white transition-colors">Manufacturing Plants</Link></li>
              <li><Link href="/industries" className="hover:text-white transition-colors">Industries Served</Link></li>
              <li><Link href="/quality" className="hover:text-white transition-colors">Quality Assurance</Link></li>
              <li><Link href="/esg" className="hover:text-white transition-colors">Sustainability & ESG</Link></li>
              <li><Link href="/investors" className="hover:text-white transition-colors">Investor Center</Link></li>
              <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
            </ul>
          </nav>

          {/* Col 4: Contact & Enquiries */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider text-[#ff6500]">Enquiry Desk</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#ff6500]" aria-hidden="true" />
                <a href={`tel:${COMPANY_DETAILS.phone}`} className="hover:underline">{COMPANY_DETAILS.phone}</a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#ff6500]" aria-hidden="true" />
                <a href={`mailto:${COMPANY_DETAILS.salesEmail}`} className="hover:underline">{COMPANY_DETAILS.salesEmail}</a>
              </p>
              <div className="pt-2">
                <Link href="/quote" className="inline-block bg-[#ff6500] text-white text-xs px-4 py-2 rounded font-semibold hover:bg-orange-600 transition-colors" aria-label="Submit a formal quotation request">
                  Request Quotation
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Hariom Pipe Industries Limited. All Rights Reserved.</p>
          <nav className="flex gap-6" aria-label="Legal & Utility Navigation">
            <Link href="/sitemap.xml" className="hover:text-slate-400">Sitemap</Link>
            <Link href="/contact" className="hover:text-slate-400">Contact Us</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};
