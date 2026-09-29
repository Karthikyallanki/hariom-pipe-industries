'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, FileText, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { COMPANY_DETAILS } from '@/lib/constants';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Products', href: '/products' },
    { name: 'Manufacturing', href: '/manufacturing' },
    { name: 'Industries', href: '/industries' },
    { name: 'Quality', href: '/quality' },
    { name: 'ESG', href: '/esg' },
    { name: 'Investors', href: '/investors' },
    { name: 'Careers', href: '/careers' },
    { name: 'Insights', href: '/blogs' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0b192c] text-white shadow-lg border-b border-slate-800">
      {/* Top Utility Bar */}
      <div className="bg-[#070f1b] text-slate-300 text-xs py-2 px-4 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-[#ff6500]" aria-hidden="true" />
              <strong className="text-white">NSE / BSE Listed:</strong> {COMPANY_DETAILS.listedExchanges}
            </span>
            <span className="hidden md:inline text-slate-600" aria-hidden="true">|</span>
            <span className="hidden md:inline">Total Capacity: {COMPANY_DETAILS.totalCapacityMTPA}</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={`tel:${COMPANY_DETAILS.phone}`}
              className="flex items-center gap-1 hover:text-[#ff6500] transition-colors"
              aria-label={`Call Hariom Pipes corporate line ${COMPANY_DETAILS.phone}`}
            >
              <Phone className="w-3 h-3 text-[#ff6500]" aria-hidden="true" />
              <span>{COMPANY_DETAILS.phone}</span>
            </a>
            <span className="text-slate-600" aria-hidden="true">|</span>
            <Link
              href="/dealer-enquiry"
              className="hover:text-[#ff6500] transition-colors font-medium"
              aria-label="Access Dealer Portal Application"
            >
              Dealer Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3" aria-label="Hariom Pipe Industries Limited Homepage">
            <div className="w-10 h-10 bg-[#ff6500] rounded flex items-center justify-center font-black text-xl text-white shadow-md" aria-hidden="true">
              H
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white block leading-tight">
                HARIOM <span className="text-[#ff6500]">PIPES</span>
              </span>
              <span className="text-[10px] tracking-widest uppercase text-slate-400 font-semibold block">
                Hariom Pipe Industries Ltd.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2" aria-label="Main Corporate Navigation">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`px-3 py-2 rounded-md text-xs font-semibold tracking-wide transition-colors ${
                    isActive
                      ? 'bg-[#ff6500] text-white'
                      : 'text-slate-200 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Primary Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link href="/quote" aria-label="Request quotation for steel pipes">
              <Button variant="primary" size="sm" icon={<FileText className="w-4 h-4" aria-hidden="true" />}>
                Request Quote
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-menu"
          role="region"
          aria-label="Mobile Navigation Drawer"
          className="lg:hidden bg-[#0a1424] border-b border-slate-800 px-4 pt-2 pb-6 space-y-2"
        >
          <nav aria-label="Mobile Navigation">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#ff6500] text-white font-bold'
                      : 'text-slate-200 hover:bg-[#ff6500] hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="pt-4 flex flex-col gap-2">
            <Link href="/quote" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" size="md" className="w-full">
                Request a Quote
              </Button>
            </Link>
            <Link href="/dealer-enquiry" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" size="md" className="w-full border-slate-600 text-slate-200 hover:bg-slate-800">
                Dealer Application
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
