'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  LogOut,
  FileText,
  Users,
  MessageSquare,
  Briefcase,
  Package,
  TrendingUp,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Layers,
  Building2,
  PieChart,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { apiClient } from '@/lib/api-client';

const AdminNotificationCenter = dynamic(() => import('@/components/admin/AdminNotificationCenter'), {
  ssr: false,
});

interface DashboardOverviewData {
  kpi: {
    totalEnquiries: number;
    totalDealerEnquiries: number;
    totalContactMessages: number;
    totalJobApplications: number;
    totalProducts: number;
  };
  recentEnquiries: Array<{
    _id: string;
    enquiryId: string;
    name: string;
    companyName?: string;
    productName: string;
    status: string;
    createdAt: string;
  }>;
  recentDealerEnquiries: Array<{
    _id: string;
    enquiryId: string;
    name: string;
    companyName: string;
    city: string;
    state: string;
    status: string;
    createdAt: string;
  }>;
  enquiriesByStatus: Record<string, number>;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [data, setData] = useState<DashboardOverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOverview = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('hpil_admin_token');

    if (!token) {
      router.push('/admin/login');
      return;
    }

    try {
      const res = await apiClient.get<DashboardOverviewData>('/admin/analytics/overview', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.success && res.data) {
        setData(res.data);
      } else {
        if (res.error?.code === 'UNAUTHORIZED' || res.error?.code === 'INVALID_TOKEN') {
          localStorage.removeItem('hpil_admin_token');
          localStorage.removeItem('hpil_admin_user');
          router.push('/admin/login');
        } else {
          setError(res.error?.message || 'Failed to load dashboard analytics.');
        }
      }
    } catch (err) {
      setError('Connection error fetching dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('hpil_admin_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        // Ignore parse error
      }
    }
    fetchOverview();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('hpil_admin_token');
    localStorage.removeItem('hpil_admin_user');
    router.push('/admin/login');
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'PENDING':
      case 'RECEIVED':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'IN_REVIEW':
      case 'UNDER_REVIEW':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'QUOTED':
      case 'APPROVED':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'CLOSED':
      case 'REJECTED':
      case 'CANCELLED':
        return 'bg-steel-border/50 text-steel-muted border-steel-border';
      default:
        return 'bg-steel-border/40 text-steel-muted border-steel-border';
    }
  };

  return (
    <div className="min-h-screen bg-steel-dark text-slate-100 flex flex-col font-sans">
      {/* Admin Top Navigation */}
      <header className="sticky top-0 z-40 bg-steel-navy/95 border-b border-steel-border backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-primary/10 border border-amber-primary/30 rounded-xl text-amber-primary">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="font-bold font-heading text-white tracking-wider text-base uppercase block">
              Hariom Pipe Industries Ltd
            </span>
            <span className="text-xs text-amber-primary font-semibold tracking-widest uppercase">
              Admin Operations Hub
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <AdminNotificationCenter />

          <button
            onClick={fetchOverview}
            disabled={loading}
            className="p-2 text-steel-muted hover:text-white hover:bg-steel-border/40 rounded-lg transition-colors flex items-center gap-1 text-xs"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Sync</span>
          </button>

          <div className="h-6 w-px bg-steel-border/60 hidden sm:block" />

          {user && (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-semibold text-white">{user.name}</div>
                <div className="text-[10px] text-amber-primary font-mono">{user.role}</div>
              </div>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-300 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-8">
        {/* Welcome Section */}
        <div className="bg-steel-navy border border-steel-border rounded-2xl p-6 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-primary/10 border border-amber-primary/30 rounded-full text-xs font-mono text-amber-primary font-semibold mb-1">
              <span>LIVE SYSTEM STATUS: OPERATIONAL</span>
            </div>
            <h1 className="text-2xl font-bold font-heading text-white">
              Welcome Back, {user?.name || 'Administrator'}
            </h1>
            <p className="text-sm text-steel-muted">
              Hariom Pipe Industries Corporate Platform Management & Metrics Engine
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/analytics"
              className="px-4 py-2 bg-amber-primary hover:bg-amber-hover text-steel-dark rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-amber-primary/20"
            >
              <PieChart className="w-3.5 h-3.5" />
              <span>Platform Intelligence</span>
            </Link>
            <Link
              href="/"
              target="_blank"
              className="px-4 py-2 bg-steel-dark border border-steel-border text-steel-muted hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span>Visit Corporate Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-950/50 border border-red-500/40 rounded-xl text-red-300 text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-steel-navy border border-steel-border rounded-2xl p-5 space-y-3">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-steel-muted uppercase tracking-wider">
                Quote Enquiries
              </span>
              <div className="p-2 bg-amber-primary/10 rounded-lg text-amber-primary">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold font-heading text-white">
              {loading ? '-' : data?.kpi.totalEnquiries || 0}
            </div>
            <div className="text-[11px] text-steel-muted flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span>RFQs Received</span>
            </div>
          </div>

          <div className="bg-steel-navy border border-steel-border rounded-2xl p-5 space-y-3">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-steel-muted uppercase tracking-wider">
                Dealer Applications
              </span>
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold font-heading text-white">
              {loading ? '-' : data?.kpi.totalDealerEnquiries || 0}
            </div>
            <div className="text-[11px] text-steel-muted flex items-center gap-1">
              <Building2 className="w-3 h-3 text-blue-400" />
              <span>Distributor Network</span>
            </div>
          </div>

          <div className="bg-steel-navy border border-steel-border rounded-2xl p-5 space-y-3">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-steel-muted uppercase tracking-wider">
                Contact Messages
              </span>
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                <MessageSquare className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold font-heading text-white">
              {loading ? '-' : data?.kpi.totalContactMessages || 0}
            </div>
            <div className="text-[11px] text-steel-muted flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>General Inquiries</span>
            </div>
          </div>

          <div className="bg-steel-navy border border-steel-border rounded-2xl p-5 space-y-3">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-steel-muted uppercase tracking-wider">
                Job Applications
              </span>
              <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                <Briefcase className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold font-heading text-white">
              {loading ? '-' : data?.kpi.totalJobApplications || 0}
            </div>
            <div className="text-[11px] text-steel-muted flex items-center gap-1">
              <Clock className="w-3 h-3 text-purple-400" />
              <span>Careers Applications</span>
            </div>
          </div>

          <div className="bg-steel-navy border border-steel-border rounded-2xl p-5 space-y-3">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-steel-muted uppercase tracking-wider">
                Active Products
              </span>
              <div className="p-2 bg-orange-500/10 rounded-lg text-orange-400">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold font-heading text-white">
              {loading ? '-' : data?.kpi.totalProducts || 0}
            </div>
            <div className="text-[11px] text-steel-muted flex items-center gap-1">
              <Layers className="w-3 h-3 text-orange-400" />
              <span>Catalog SKUs</span>
            </div>
          </div>
        </div>

        {/* Dashboard Grid Tables & Status Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Quote Enquiries */}
          <div className="lg:col-span-2 bg-steel-navy border border-steel-border rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-steel-border/50">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-primary" />
                <h2 className="text-lg font-bold font-heading text-white">Recent RFQ Enquiries</h2>
              </div>
              <span className="text-xs text-steel-muted font-mono">Last 5 submissions</span>
            </div>

            {loading ? (
              <div className="py-12 text-center text-steel-muted text-xs">Loading RFQ inquiries...</div>
            ) : !data?.recentEnquiries || data.recentEnquiries.length === 0 ? (
              <div className="py-12 text-center text-steel-muted text-xs">No RFQ enquiries received yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-steel-border/40 text-steel-muted uppercase text-[10px] tracking-wider">
                      <th className="py-3 px-2">Ref ID</th>
                      <th className="py-3 px-2">Client / Company</th>
                      <th className="py-3 px-2">Product</th>
                      <th className="py-3 px-2">Status</th>
                      <th className="py-3 px-2">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-steel-border/30">
                    {data.recentEnquiries.map((enq) => (
                      <tr key={enq._id} className="hover:bg-steel-dark/50 transition-colors">
                        <td className="py-3 px-2 font-mono font-semibold text-amber-primary">
                          {enq.enquiryId}
                        </td>
                        <td className="py-3 px-2">
                          <div className="font-medium text-white">{enq.name}</div>
                          {enq.companyName && (
                            <div className="text-[10px] text-steel-muted">{enq.companyName}</div>
                          )}
                        </td>
                        <td className="py-3 px-2 text-steel-muted">{enq.productName}</td>
                        <td className="py-3 px-2">
                          <span
                            className={`px-2 py-0.5 border rounded-full text-[10px] font-semibold uppercase ${getStatusBadgeClass(
                              enq.status
                            )}`}
                          >
                            {enq.status}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-steel-muted text-[10px]">
                          {new Date(enq.createdAt).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Status Breakdown Panel */}
          <div className="bg-steel-navy border border-steel-border rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-steel-border/50">
              <div className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-blue-400" />
                <h2 className="text-lg font-bold font-heading text-white">Enquiry Pipeline</h2>
              </div>
            </div>

            {loading ? (
              <div className="py-12 text-center text-steel-muted text-xs">Calculating metrics...</div>
            ) : (
              <div className="space-y-4">
                {Object.entries(data?.enquiriesByStatus || { PENDING: 0, QUOTED: 0, IN_REVIEW: 0 }).map(
                  ([status, count]) => {
                    const total = data?.kpi.totalEnquiries || 1;
                    const percentage = Math.round((count / total) * 100);
                    return (
                      <div key={status} className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="font-semibold text-slate-200 uppercase tracking-wider">
                            {status}
                          </span>
                          <span className="font-mono text-amber-primary">
                            {count} ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-steel-dark rounded-full h-2 border border-steel-border/40 overflow-hidden">
                          <div
                            className="bg-amber-primary h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.max(percentage, 5)}%` }}
                          />
                        </div>
                      </div>
                    );
                  }
                )}

                <div className="pt-4 border-t border-steel-border/40 space-y-2">
                  <div className="text-xs font-semibold text-slate-300">Quick Administrative Actions</div>
                  <div className="grid grid-cols-1 gap-2 text-xs">
                    <Link
                      href="/products"
                      className="p-3 bg-steel-dark border border-steel-border/60 hover:border-amber-primary/50 rounded-xl text-steel-muted hover:text-white transition-colors flex items-center justify-between group"
                    >
                      <span>Explore Active Product Catalog</span>
                      <ChevronRight className="w-4 h-4 text-amber-primary group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      href="/dealer-enquiry"
                      className="p-3 bg-steel-dark border border-steel-border/60 hover:border-blue-400/50 rounded-xl text-steel-muted hover:text-white transition-colors flex items-center justify-between group"
                    >
                      <span>Review Dealer Network Requirements</span>
                      <ChevronRight className="w-4 h-4 text-blue-400 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Dealer Applications Table */}
        <div className="bg-steel-navy border border-steel-border rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-steel-border/50">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-bold font-heading text-white">
                Recent Dealer Partnership Applications
              </h2>
            </div>
            <span className="text-xs text-steel-muted font-mono">Distributor Onboarding</span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-steel-muted text-xs">Loading dealer applications...</div>
          ) : !data?.recentDealerEnquiries || data.recentDealerEnquiries.length === 0 ? (
            <div className="py-12 text-center text-steel-muted text-xs">
              No dealer partnership applications received yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-steel-border/40 text-steel-muted uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-2">Ref ID</th>
                    <th className="py-3 px-2">Applicant / Firm Name</th>
                    <th className="py-3 px-2">Location</th>
                    <th className="py-3 px-2">Status</th>
                    <th className="py-3 px-2">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-steel-border/30">
                  {data.recentDealerEnquiries.map((dlr) => (
                    <tr key={dlr._id} className="hover:bg-steel-dark/50 transition-colors">
                      <td className="py-3 px-2 font-mono font-semibold text-blue-400">
                        {dlr.enquiryId}
                      </td>
                      <td className="py-3 px-2">
                        <div className="font-medium text-white">{dlr.name}</div>
                        <div className="text-[10px] text-steel-muted">{dlr.companyName}</div>
                      </td>
                      <td className="py-3 px-2 text-steel-muted">
                        {dlr.city}, {dlr.state}
                      </td>
                      <td className="py-3 px-2">
                        <span
                          className={`px-2 py-0.5 border rounded-full text-[10px] font-semibold uppercase ${getStatusBadgeClass(
                            dlr.status
                          )}`}
                        >
                          {dlr.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-steel-muted text-[10px]">
                        {new Date(dlr.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
