'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  ArrowLeft,
  RefreshCw,
  BarChart3,
  TrendingUp,
  Eye,
  MapPin,
  DownloadCloud,
  Layers,
  FileText,
  AlertCircle,
  Building2,
  Calendar,
  Sparkles,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { apiClient } from '@/lib/api-client';

const AdminNotificationCenter = dynamic(() => import('@/components/admin/AdminNotificationCenter'), {
  ssr: false,
});

interface DetailedAnalyticsData {
  topViewedProducts: Array<{
    _id: string;
    name: string;
    slug: string;
    viewsCount: number;
    brand: string;
    category?: {
      name: string;
    };
  }>;
  enquiriesByState: Array<{
    _id: string;
    totalRFQs: number;
  }>;
  dealerApplicationsByState: Array<{
    _id: string;
    totalApplicants: number;
  }>;
  topDownloads: Array<{
    _id: string;
    title: string;
    category: string;
    fileType: string;
    downloadCount: number;
    fileSize?: string;
  }>;
  monthlyEnquiryTrends: Array<{
    period: string;
    count: number;
  }>;
}

export default function AdminAnalyticsPage() {
  const router = useRouter();
  const [data, setData] = useState<DetailedAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('hpil_admin_token');

    if (!token) {
      router.push('/admin/login');
      return;
    }

    try {
      const res = await apiClient.get<DetailedAnalyticsData>('/admin/analytics/detailed', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.success && res.data) {
        setData(res.data);
      } else {
        setError(res.error?.message || 'Failed to calculate MongoDB analytics aggregations.');
      }
    } catch (err) {
      setError('Connection error loading platform analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const maxViews = data?.topViewedProducts?.[0]?.viewsCount || 1;
  const maxRFQs = data?.enquiriesByState?.[0]?.totalRFQs || 1;

  return (
    <div className="min-h-screen bg-steel-dark text-slate-100 flex flex-col font-sans">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-steel-navy/95 border-b border-steel-border backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/dashboard"
            className="p-2 bg-steel-dark border border-steel-border rounded-xl text-steel-muted hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-primary/10 border border-amber-primary/30 rounded-xl text-amber-primary">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold font-heading text-white tracking-wider text-base uppercase">
                Enterprise Platform Analytics
              </h1>
              <p className="text-xs text-amber-primary font-mono font-semibold">
                Hariom Pipe Industries Ltd &bull; MongoDB Aggregations Engine
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <AdminNotificationCenter />
          <button
            onClick={fetchAnalytics}
            disabled={loading}
            className="p-2.5 text-steel-muted hover:text-white bg-steel-dark border border-steel-border rounded-xl transition-colors flex items-center gap-1.5 text-xs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Re-calculate</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-8">
        {error && (
          <div className="p-4 bg-red-950/60 border border-red-500/40 rounded-2xl text-red-300 text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Executive Summary Banner */}
        <div className="bg-steel-navy border border-steel-border rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-primary/10 border border-amber-primary/30 rounded-full text-xs font-mono text-amber-primary font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AGGREGATION ENGINE ACTIVE</span>
            </div>
            <h2 className="text-xl font-bold font-heading text-white">Product Engagement & Demand Metrics</h2>
            <p className="text-sm text-steel-muted">
              Real-time intelligence on customer product page views, regional RFQ density, and investor downloads.
            </p>
          </div>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Viewed Products Tracking */}
          <div className="bg-steel-navy border border-steel-border rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-steel-border/50">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-amber-primary" />
                <h3 className="text-base font-bold font-heading text-white">Top Viewed Products</h3>
              </div>
              <span className="text-xs text-steel-muted font-mono">View Tracking Index</span>
            </div>

            {loading ? (
              <div className="py-12 text-center text-steel-muted text-xs">Aggregating product views...</div>
            ) : !data?.topViewedProducts || data.topViewedProducts.length === 0 ? (
              <div className="py-12 text-center text-steel-muted text-xs">No product view analytics recorded yet.</div>
            ) : (
              <div className="space-y-4">
                {data.topViewedProducts.map((p, idx) => {
                  const pct = Math.round((p.viewsCount / maxViews) * 100);
                  return (
                    <div key={p._id} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-2 truncate pr-2">
                          <span className="w-5 h-5 bg-steel-dark border border-steel-border rounded-full flex items-center justify-center text-[10px] font-bold text-amber-primary font-mono shrink-0">
                            {idx + 1}
                          </span>
                          <span className="font-bold text-white truncate">{p.name}</span>
                        </div>
                        <span className="font-mono text-amber-primary font-bold shrink-0">
                          {p.viewsCount} views
                        </span>
                      </div>
                      <div className="w-full bg-steel-dark rounded-full h-2.5 border border-steel-border/50 overflow-hidden">
                        <div
                          className="bg-amber-primary h-full rounded-full transition-all duration-700"
                          style={{ width: `${Math.max(pct, 4)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Regional RFQ Demand Heatmap */}
          <div className="bg-steel-navy border border-steel-border rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-steel-border/50">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold font-heading text-white">Geographic RFQ Demand</h3>
              </div>
              <span className="text-xs text-steel-muted font-mono">State-wise Density</span>
            </div>

            {loading ? (
              <div className="py-12 text-center text-steel-muted text-xs">Calculating regional density...</div>
            ) : !data?.enquiriesByState || data.enquiriesByState.length === 0 ? (
              <div className="py-12 text-center text-steel-muted text-xs">No state distribution data available yet.</div>
            ) : (
              <div className="space-y-4">
                {data.enquiriesByState.map((st) => {
                  const pct = Math.round((st.totalRFQs / maxRFQs) * 100);
                  return (
                    <div key={st._id} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-slate-200">{st._id || 'Unspecified'}</span>
                        <span className="font-mono text-blue-400 font-bold">{st.totalRFQs} enquiries</span>
                      </div>
                      <div className="w-full bg-steel-dark rounded-full h-2.5 border border-steel-border/50 overflow-hidden">
                        <div
                          className="bg-blue-400 h-full rounded-full transition-all duration-700"
                          style={{ width: `${Math.max(pct, 6)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Top Investor & Technical Downloads */}
          <div className="bg-steel-navy border border-steel-border rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-steel-border/50">
              <div className="flex items-center gap-2">
                <DownloadCloud className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold font-heading text-white">Most Downloaded Documents</h3>
              </div>
              <span className="text-xs text-steel-muted font-mono">Document Centre</span>
            </div>

            {loading ? (
              <div className="py-12 text-center text-steel-muted text-xs">Fetching document engagement...</div>
            ) : !data?.topDownloads || data.topDownloads.length === 0 ? (
              <div className="py-12 text-center text-steel-muted text-xs">No document downloads recorded yet.</div>
            ) : (
              <div className="space-y-3">
                {data.topDownloads.map((doc) => (
                  <div
                    key={doc._id}
                    className="p-3 bg-steel-dark border border-steel-border/60 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div className="space-y-0.5 truncate pr-2">
                      <div className="font-bold text-white truncate">{doc.title}</div>
                      <div className="text-[10px] text-steel-muted font-mono">
                        {doc.category} &bull; {doc.fileType}
                      </div>
                    </div>
                    <div className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg font-mono font-bold shrink-0">
                      {doc.downloadCount} dl
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Dealer Network Geographic Footprint */}
          <div className="bg-steel-navy border border-steel-border rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-steel-border/50">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold font-heading text-white">Dealer Application Density</h3>
              </div>
              <span className="text-xs text-steel-muted font-mono">Network Expansion</span>
            </div>

            {loading ? (
              <div className="py-12 text-center text-steel-muted text-xs">Analyzing dealership applications...</div>
            ) : !data?.dealerApplicationsByState || data.dealerApplicationsByState.length === 0 ? (
              <div className="py-12 text-center text-steel-muted text-xs">No dealer geographic metrics logged yet.</div>
            ) : (
              <div className="space-y-3">
                {data.dealerApplicationsByState.map((dlr) => (
                  <div
                    key={dlr._id}
                    className="p-3 bg-steel-dark border border-steel-border/60 rounded-xl flex items-center justify-between text-xs"
                  >
                    <span className="font-bold text-white">{dlr._id || 'Unspecified State'}</span>
                    <span className="px-2.5 py-1 bg-purple-500/10 border border-purple-500/30 text-purple-400 rounded-lg font-mono font-bold">
                      {dlr.totalApplicants} applications
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
