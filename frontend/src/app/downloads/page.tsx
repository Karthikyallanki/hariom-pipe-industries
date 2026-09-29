'use client';

import React, { useState, useEffect } from 'react';
import { Download as DownloadIcon, FileText, Search, Filter } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { apiClient } from '@/lib/api-client';
import { IDownloadItem } from '@/types';

export default function DownloadsPage() {
  const [documents, setDocuments] = useState<IDownloadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  useEffect(() => {
    async function loadDocs() {
      let endpoint = '/downloads';
      if (searchQuery) endpoint += `?search=${encodeURIComponent(searchQuery)}`;
      const res = await apiClient.get<IDownloadItem[]>(endpoint);
      if (res.success && res.data) {
        setDocuments(res.data);
      }
      setLoading(false);
    }
    loadDocs();
  }, [searchQuery]);

  const handleDownload = (docId: string, fileUrl: string) => {
    apiClient.post(`/downloads/${docId}/increment`, {});
    window.open(fileUrl, '_blank');
  };

  const categories = ['All', 'Brochure', 'Product Catalogue', 'Technical Datasheet', 'Certificate', 'Annual Report', 'Financial Disclosure'];

  const filteredDocs = activeCategory === 'All'
    ? documents
    : documents.filter((d) => d.category === activeCategory);

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-[#0b192c] text-white rounded-2xl p-8 md:p-12 mb-10 shadow-xl bg-steel-pattern text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#ff6500] bg-orange-950/80 px-3 py-1 rounded border border-orange-800/50 mb-3 inline-block">
            Technical & Corporate Document Repository
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-3">DOWNLOAD CENTER</h1>
          <p className="text-slate-300 text-sm md:text-base max-w-2xl mx-auto">
            Download official product brochures, technical specifications, BIS certificates, and investor annual reports.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8 shadow-sm">
          <div className="relative mb-6">
            <Search className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents by title or standard..."
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0b192c]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                  activeCategory === cat ? 'bg-[#0b192c] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Downloads Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-[#ff6500] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-slate-600 text-xs">Loading Document Repository...</p>
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl border border-slate-200">
            <p className="text-slate-600 text-sm font-medium">No documents match the specified query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocs.map((doc) => (
              <Card key={doc._id} className="flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <Badge variant="gold">{doc.category}</Badge>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{doc.fileType}</span>
                  </div>

                  <h3 className="text-base font-bold text-[#0b192c] mb-2">{doc.title}</h3>
                  <p className="text-xs text-slate-500 mb-4">File Size: {doc.fileSize} • {doc.downloadCount} Downloads</p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-between"
                  icon={<DownloadIcon className="w-4 h-4 text-[#ff6500]" />}
                  onClick={() => handleDownload(doc._id, doc.fileUrl)}
                >
                  <span>Download PDF</span>
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
