'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Download as DownloadIcon, FileText, ShieldCheck, TrendingUp, DollarSign, Calendar, ExternalLink, Mail } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { apiClient } from '@/lib/api-client';
import { IDownloadItem } from '@/types';
import { COMPANY_DETAILS } from '@/lib/constants';

export default function InvestorsPage() {
  const [documents, setDocuments] = useState<IDownloadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  useEffect(() => {
    async function loadInvestorDocs() {
      const res = await apiClient.get<IDownloadItem[]>('/downloads');
      if (res.success && res.data) {
        setDocuments(res.data);
      }
      setLoading(false);
    }
    loadInvestorDocs();
  }, []);

  const handleDownloadClick = async (docId: string, fileUrl: string) => {
    apiClient.post(`/downloads/${docId}/increment`, {});
    window.open(fileUrl, '_blank');
  };

  const categories = ['All', 'Annual Report', 'Financial Disclosure', 'Brochure', 'Certificate'];

  const filteredDocs = activeCategory === 'All'
    ? documents
    : documents.filter((d) => d.category === activeCategory);

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="bg-[#0b192c] text-white rounded-2xl p-8 md:p-12 mb-12 shadow-xl bg-steel-pattern">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#ff6500] bg-orange-950/80 px-3 py-1 rounded border border-orange-800/50">
              Investor Relations & Governance
            </span>
            <Badge variant="gold">NSE: HARIOMPIPE | BSE: 543517</Badge>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
            FINANCIAL TRANSPARENCY & SHAREHOLDER VALUE
          </h1>
          <p className="text-slate-300 text-base md:text-lg max-w-3xl leading-relaxed">
            Welcome to the Hariom Pipe Industries Investor Relations Portal. Access quarterly financial results, audited annual reports, shareholding patterns, and stock exchange disclosures.
          </p>
        </div>

        {/* Stock Info & Investor Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="border-t-4 border-t-[#ff6500]">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Listed Stock Symbol</span>
            <h3 className="text-xl font-bold text-[#0b192c] mb-1">NSE: HARIOMPIPE</h3>
            <span className="text-xs text-slate-500 block">BSE Code: 543517 | ISIN: INE0GI001017</span>
          </Card>

          <Card className="border-t-4 border-t-emerald-600">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Production Scale</span>
            <h3 className="text-xl font-bold text-[#0b192c] mb-1">7,01,237 MTPA</h3>
            <span className="text-xs text-slate-500 block">Across 4 Integrated Units in South India</span>
          </Card>

          <Card className="border-t-4 border-t-blue-600">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Investor Cell Contact</span>
            <h3 className="text-sm font-bold text-[#0b192c] mb-1">{COMPANY_DETAILS.investorEmail}</h3>
            <span className="text-xs text-slate-500 block">Corporate Office, Himayatnagar, Hyderabad</span>
          </Card>
        </div>

        {/* Document Center Section */}
        <div className="mb-16">
          <SectionHeading
            category="Document Center"
            title="FINANCIAL REPORTS & DISCLOSURES"
            subtitle="Searchable library of audited annual reports, quarterly statements, and corporate disclosures."
            centered
          />

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-2 mb-8 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  activeCategory === cat ? 'bg-[#0b192c] text-white' : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Document List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-[#ff6500] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-slate-600 text-xs">Loading Disclosures...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDocs.map((doc) => (
                <Card key={doc._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-orange-50 text-[#ff6500] rounded-lg flex items-center justify-center font-bold shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="gold">{doc.category}</Badge>
                        {doc.financialYear && <span className="text-[10px] text-slate-500 font-semibold">FY {doc.financialYear}</span>}
                      </div>
                      <h4 className="text-sm font-bold text-[#0b192c]">{doc.title}</h4>
                      <span className="text-[11px] text-slate-500">{doc.fileType} • {doc.fileSize} • {doc.downloadCount} Downloads</span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="shrink-0"
                    icon={<DownloadIcon className="w-4 h-4" />}
                    onClick={() => handleDownloadClick(doc._id, doc.fileUrl)}
                  >
                    Download Document
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
