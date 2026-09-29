'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  ArrowLeft,
  Search,
  Filter,
  RefreshCw,
  FileText,
  Users,
  CheckCircle2,
  AlertCircle,
  X,
  Mail,
  Phone,
  Building2,
  MapPin,
  Clock,
  Send,
  Trash2,
  ExternalLink,
  MessageSquare,
  Loader2,
  Save,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { apiClient } from '@/lib/api-client';

const AdminNotificationCenter = dynamic(() => import('@/components/admin/AdminNotificationCenter'), {
  ssr: false,
});

interface QuoteEnquiry {
  _id: string;
  enquiryId: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  productName?: string;
  quantity?: string;
  requirementType: string;
  message: string;
  status: 'New' | 'Contacted' | 'In Progress' | 'Qualified' | 'Closed' | 'Rejected';
  notes: Array<{
    author: string;
    text: string;
    createdAt: string;
  }>;
  createdAt: string;
}

interface DealerEnquiry {
  _id: string;
  enquiryId: string;
  name: string;
  companyName: string;
  phone: string;
  email: string;
  state: string;
  city: string;
  businessType: string;
  productInterest: string[];
  existingBusinessDetails?: string;
  message: string;
  status: 'New' | 'Under Review' | 'Contacted' | 'Approved' | 'Rejected';
  createdAt: string;
}

export default function AdminEnquiriesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'QUOTES' | 'DEALERS'>('QUOTES');

  // Data states
  const [quoteEnquiries, setQuoteEnquiries] = useState<QuoteEnquiry[]>([]);
  const [dealerEnquiries, setDealerEnquiries] = useState<DealerEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal / Detail drawer states
  const [selectedQuote, setSelectedQuote] = useState<QuoteEnquiry | null>(null);
  const [selectedDealer, setSelectedDealer] = useState<DealerEnquiry | null>(null);
  const [noteInput, setNoteInput] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchEnquiries = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('hpil_admin_token');

    if (!token) {
      router.push('/admin/login');
      return;
    }

    try {
      const [quotesRes, dealersRes] = await Promise.all([
        apiClient.get<QuoteEnquiry[]>('/enquiries/admin/all', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        apiClient.get<DealerEnquiry[]>('/dealer-enquiries/admin/all', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (quotesRes.success && quotesRes.data) {
        setQuoteEnquiries(quotesRes.data);
      } else {
        setError(quotesRes.error?.message || 'Failed to fetch quotation requests.');
      }

      if (dealersRes.success && dealersRes.data) {
        setDealerEnquiries(dealersRes.data);
      }
    } catch (err) {
      setError('Connection error loading enquiry management data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleUpdateQuoteStatusAndNote = async (newStatus?: string) => {
    if (!selectedQuote) return;
    setUpdatingStatus(true);
    setError(null);
    const token = localStorage.getItem('hpil_admin_token');

    try {
      const res = await apiClient.patch<QuoteEnquiry>(
        `/enquiries/admin/${selectedQuote._id}`,
        {
          status: newStatus || selectedQuote.status,
          noteText: noteInput.trim() || undefined,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.success && res.data) {
        setSelectedQuote(res.data);
        setQuoteEnquiries((prev) => prev.map((q) => (q._id === res.data!._id ? res.data! : q)));
        setNoteInput('');
        setSuccessMessage(`Enquiry ${res.data.enquiryId} updated successfully.`);
      } else {
        setError(res.error?.message || 'Failed to update enquiry.');
      }
    } catch (err) {
      setError('Error communicating with server while updating enquiry.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleUpdateDealerStatus = async (newStatus: string) => {
    if (!selectedDealer) return;
    setUpdatingStatus(true);
    setError(null);
    const token = localStorage.getItem('hpil_admin_token');

    try {
      const res = await apiClient.patch<DealerEnquiry>(
        `/dealer-enquiries/admin/${selectedDealer._id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.success && res.data) {
        setSelectedDealer(res.data);
        setDealerEnquiries((prev) => prev.map((d) => (d._id === res.data!._id ? res.data! : d)));
        setSuccessMessage(`Dealer Application ${res.data.enquiryId} updated to ${newStatus}.`);
      } else {
        setError(res.error?.message || 'Failed to update dealer application.');
      }
    } catch (err) {
      setError('Error updating dealer application status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDeleteEnquiry = async () => {
    if (!deleteConfirmId) return;
    const token = localStorage.getItem('hpil_admin_token');

    try {
      if (activeTab === 'QUOTES') {
        const res = await apiClient.delete(`/enquiries/admin/${deleteConfirmId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.success) {
          setQuoteEnquiries((prev) => prev.filter((q) => q._id !== deleteConfirmId));
          if (selectedQuote?._id === deleteConfirmId) setSelectedQuote(null);
          setSuccessMessage('Quotation request deleted successfully.');
        }
      } else {
        const res = await apiClient.delete(`/dealer-enquiries/admin/${deleteConfirmId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.success) {
          setDealerEnquiries((prev) => prev.filter((d) => d._id !== deleteConfirmId));
          if (selectedDealer?._id === deleteConfirmId) setSelectedDealer(null);
          setSuccessMessage('Dealer application deleted successfully.');
        }
      }
    } catch (err) {
      setError('Error deleting record.');
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Contacted':
      case 'Under Review':
      case 'In Progress':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Qualified':
      case 'Approved':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Closed':
      case 'Rejected':
        return 'bg-steel-border/50 text-steel-muted border-steel-border';
      default:
        return 'bg-steel-border/40 text-steel-muted border-steel-border';
    }
  };

  // Filtered lists
  const filteredQuotes = quoteEnquiries.filter((q) => {
    const matchesSearch =
      q.enquiryId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.productName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || q.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredDealers = dealerEnquiries.filter((d) => {
    const matchesSearch =
      d.enquiryId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.state.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold font-heading text-white tracking-wider text-base uppercase">
                Enquiry & RFQ Operations Hub
              </h1>
              <p className="text-xs text-amber-primary font-mono font-semibold">
                Hariom Pipe Industries Ltd &bull; Customer Pipeline
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <AdminNotificationCenter />
          <button
            onClick={fetchEnquiries}
            disabled={loading}
            className="p-2.5 text-steel-muted hover:text-white bg-steel-dark border border-steel-border rounded-xl transition-colors flex items-center gap-1.5 text-xs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Sync Data</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
        {/* Banner Feedback */}
        {successMessage && (
          <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl text-emerald-300 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{successMessage}</span>
            </div>
            <button onClick={() => setSuccessMessage(null)} className="text-emerald-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-950/60 border border-red-500/40 rounded-2xl text-red-300 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span>{error}</span>
            </div>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Tab Controls & Search Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-steel-navy border border-steel-border rounded-2xl p-4">
          {/* Tabs */}
          <div className="flex bg-steel-dark p-1 rounded-xl border border-steel-border/60">
            <button
              onClick={() => {
                setActiveTab('QUOTES');
                setStatusFilter('ALL');
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'QUOTES'
                  ? 'bg-amber-primary text-steel-dark shadow-md'
                  : 'text-steel-muted hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Quotation Requests ({quoteEnquiries.length})</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('DEALERS');
                setStatusFilter('ALL');
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'DEALERS'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-steel-muted hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Dealer Applications ({dealerEnquiries.length})</span>
            </button>
          </div>

          {/* Search & Status Filter */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-steel-muted" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Ref ID, Name, Firm..."
                className="w-full pl-10 pr-4 py-2 bg-steel-dark border border-steel-border/80 rounded-xl text-white placeholder-steel-muted text-xs focus:outline-none focus:border-amber-primary"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-2 px-3 bg-steel-dark border border-steel-border/80 rounded-xl text-white text-xs focus:outline-none focus:border-amber-primary"
            >
              <option value="ALL">All Statuses</option>
              {activeTab === 'QUOTES' ? (
                <>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Closed">Closed</option>
                  <option value="Rejected">Rejected</option>
                </>
              ) : (
                <>
                  <option value="New">New</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </>
              )}
            </select>
          </div>
        </div>

        {/* DATA TABLE: QUOTE ENQUIRIES */}
        {activeTab === 'QUOTES' && (
          <div className="bg-steel-navy border border-steel-border rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-steel-border/50">
              <h2 className="text-base font-bold font-heading text-white">
                Customer Quote Requests ({filteredQuotes.length})
              </h2>
            </div>

            {loading ? (
              <div className="py-16 text-center text-steel-muted text-xs">
                Fetching quotation enquiries...
              </div>
            ) : filteredQuotes.length === 0 ? (
              <div className="py-16 text-center text-steel-muted text-xs">
                No quote requests found matching criteria.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-steel-border/40 text-steel-muted uppercase text-[10px] tracking-wider">
                      <th className="py-3 px-3">Ref ID</th>
                      <th className="py-3 px-3">Customer & Firm</th>
                      <th className="py-3 px-3">Product / Qty</th>
                      <th className="py-3 px-3">Location</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3">Notes</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-steel-border/30">
                    {filteredQuotes.map((q) => (
                      <tr key={q._id} className="hover:bg-steel-dark/50 transition-colors">
                        <td className="py-3.5 px-3 font-mono font-bold text-amber-primary">
                          {q.enquiryId}
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="font-bold text-white">{q.name}</div>
                          <div className="text-[10px] text-steel-muted">{q.companyName}</div>
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="text-white font-medium">{q.productName || 'General Quote'}</div>
                          {q.quantity && <div className="text-[10px] text-amber-primary font-mono">{q.quantity}</div>}
                        </td>
                        <td className="py-3.5 px-3 text-steel-muted">
                          {q.city}, {q.state}
                        </td>
                        <td className="py-3.5 px-3">
                          <span
                            className={`px-2.5 py-1 border rounded-full text-[10px] font-semibold uppercase ${getStatusBadge(
                              q.status
                            )}`}
                          >
                            {q.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-steel-muted text-[10px]">
                          {q.notes?.length ? `${q.notes.length} internal notes` : 'No notes'}
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedQuote(q)}
                              className="px-3 py-1.5 bg-steel-dark border border-steel-border hover:border-amber-primary text-slate-200 hover:text-amber-primary rounded-lg font-medium transition-colors"
                            >
                              Inspect & Note
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(q._id)}
                              className="p-1.5 bg-red-950/40 border border-red-500/30 text-red-400 hover:bg-red-900/60 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* DATA TABLE: DEALER APPLICATIONS */}
        {activeTab === 'DEALERS' && (
          <div className="bg-steel-navy border border-steel-border rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-steel-border/50">
              <h2 className="text-base font-bold font-heading text-white">
                Dealer Partnership Applications ({filteredDealers.length})
              </h2>
            </div>

            {loading ? (
              <div className="py-16 text-center text-steel-muted text-xs">
                Fetching dealer applications...
              </div>
            ) : filteredDealers.length === 0 ? (
              <div className="py-16 text-center text-steel-muted text-xs">
                No dealer applications found matching criteria.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-steel-border/40 text-steel-muted uppercase text-[10px] tracking-wider">
                      <th className="py-3 px-3">Ref ID</th>
                      <th className="py-3 px-3">Applicant & Business</th>
                      <th className="py-3 px-3">Business Type</th>
                      <th className="py-3 px-3">Location</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-steel-border/30">
                    {filteredDealers.map((d) => (
                      <tr key={d._id} className="hover:bg-steel-dark/50 transition-colors">
                        <td className="py-3.5 px-3 font-mono font-bold text-blue-400">
                          {d.enquiryId}
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="font-bold text-white">{d.name}</div>
                          <div className="text-[10px] text-steel-muted">{d.companyName}</div>
                        </td>
                        <td className="py-3.5 px-3 text-steel-muted">{d.businessType}</td>
                        <td className="py-3.5 px-3 text-steel-muted">
                          {d.city}, {d.state}
                        </td>
                        <td className="py-3.5 px-3">
                          <span
                            className={`px-2.5 py-1 border rounded-full text-[10px] font-semibold uppercase ${getStatusBadge(
                              d.status
                            )}`}
                          >
                            {d.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedDealer(d)}
                              className="px-3 py-1.5 bg-steel-dark border border-steel-border hover:border-blue-400 text-slate-200 hover:text-blue-400 rounded-lg font-medium transition-colors"
                            >
                              Inspect Details
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(d._id)}
                              className="p-1.5 bg-red-950/40 border border-red-500/30 text-red-400 hover:bg-red-900/60 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* QUOTE ENQUIRY DETAIL & NOTES MODAL */}
      {selectedQuote && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-steel-navy border border-steel-border rounded-2xl w-full max-w-3xl my-8 p-6 space-y-6 shadow-2xl relative">
            <div className="flex justify-between items-center pb-4 border-b border-steel-border/60">
              <div>
                <span className="font-mono text-xs font-bold text-amber-primary">
                  {selectedQuote.enquiryId}
                </span>
                <h2 className="text-lg font-bold font-heading text-white">Quotation Request Details</h2>
              </div>
              <button
                onClick={() => setSelectedQuote(null)}
                className="text-steel-muted hover:text-white p-1 rounded-lg hover:bg-steel-border/40"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-steel-dark p-4 rounded-xl border border-steel-border/60 text-xs">
              <div className="space-y-1">
                <div className="text-[10px] text-steel-muted uppercase tracking-wider">Client Name & Firm</div>
                <div className="font-bold text-white text-sm">{selectedQuote.name}</div>
                <div className="text-amber-primary">{selectedQuote.companyName}</div>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] text-steel-muted uppercase tracking-wider">Contact Communication</div>
                <div className="flex items-center gap-2 text-slate-200">
                  <Mail className="w-3.5 h-3.5 text-steel-muted" />
                  <a href={`mailto:${selectedQuote.email}`} className="hover:underline text-amber-primary">
                    {selectedQuote.email}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <Phone className="w-3.5 h-3.5 text-steel-muted" />
                  <a href={`tel:${selectedQuote.phone}`} className="hover:underline">
                    {selectedQuote.phone}
                  </a>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] text-steel-muted uppercase tracking-wider">Target Specification</div>
                <div className="font-semibold text-white">{selectedQuote.productName || 'General Requirement'}</div>
                {selectedQuote.quantity && (
                  <div className="text-amber-primary font-mono font-bold">Qty: {selectedQuote.quantity}</div>
                )}
              </div>

              <div className="space-y-1">
                <div className="text-[10px] text-steel-muted uppercase tracking-wider">Location & Date</div>
                <div className="text-slate-200">
                  {selectedQuote.city}, {selectedQuote.state}
                </div>
                <div className="text-steel-muted text-[10px]">
                  {new Date(selectedQuote.createdAt).toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Customer Message */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-steel-muted uppercase tracking-wider">
                Customer Technical Requirement Message:
              </label>
              <div className="p-3.5 bg-steel-dark border border-steel-border/70 rounded-xl text-xs text-slate-200 leading-relaxed font-mono">
                {selectedQuote.message}
              </div>
            </div>

            {/* Status Selector & Admin Notes */}
            <div className="space-y-4 pt-2 border-t border-steel-border/60">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <label className="text-xs font-bold text-white uppercase tracking-wider">
                  Update Pipeline Status:
                </label>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedQuote.status}
                    onChange={(e) => handleUpdateQuoteStatusAndNote(e.target.value)}
                    disabled={updatingStatus}
                    className="py-2 px-3 bg-steel-dark border border-amber-primary/50 rounded-xl text-white text-xs font-semibold focus:outline-none"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Closed">Closed</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Existing Notes Log */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-steel-muted uppercase tracking-wider">
                  Internal Administrative Notes History ({selectedQuote.notes?.length || 0}):
                </label>
                {selectedQuote.notes?.length ? (
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                    {selectedQuote.notes.map((note, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-steel-dark border border-steel-border/50 rounded-xl text-xs space-y-1"
                      >
                        <div className="flex justify-between items-center text-[10px] text-steel-muted">
                          <span className="font-semibold text-amber-primary">{note.author}</span>
                          <span>{new Date(note.createdAt).toLocaleString('en-IN')}</span>
                        </div>
                        <p className="text-slate-200">{note.text}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 bg-steel-dark text-steel-muted text-xs rounded-xl text-center">
                    No internal notes logged yet for this enquiry.
                  </div>
                )}
              </div>

              {/* Add Note Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="Type internal sales note, pricing quote, or follow-up note..."
                  className="flex-1 p-2.5 bg-steel-dark border border-steel-border rounded-xl text-white text-xs focus:outline-none focus:border-amber-primary"
                />
                <button
                  type="button"
                  onClick={() => handleUpdateQuoteStatusAndNote()}
                  disabled={updatingStatus || !noteInput.trim()}
                  className="px-4 py-2.5 bg-amber-primary hover:bg-amber-hover disabled:opacity-50 text-steel-dark font-bold rounded-xl text-xs flex items-center gap-1.5"
                >
                  {updatingStatus ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Save Note</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DEALER APPLICATION DETAIL MODAL */}
      {selectedDealer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-steel-navy border border-steel-border rounded-2xl w-full max-w-2xl my-8 p-6 space-y-6 shadow-2xl relative">
            <div className="flex justify-between items-center pb-4 border-b border-steel-border/60">
              <div>
                <span className="font-mono text-xs font-bold text-blue-400">
                  {selectedDealer.enquiryId}
                </span>
                <h2 className="text-lg font-bold font-heading text-white">Dealership Application Details</h2>
              </div>
              <button
                onClick={() => setSelectedDealer(null)}
                className="text-steel-muted hover:text-white p-1 rounded-lg hover:bg-steel-border/40"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-steel-dark p-4 rounded-xl border border-steel-border/60 text-xs">
              <div className="space-y-1">
                <div className="text-[10px] text-steel-muted uppercase tracking-wider">Applicant & Firm</div>
                <div className="font-bold text-white text-sm">{selectedDealer.name}</div>
                <div className="text-blue-400 font-semibold">{selectedDealer.companyName}</div>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] text-steel-muted uppercase tracking-wider">Contact Communication</div>
                <div className="flex items-center gap-2 text-slate-200">
                  <Mail className="w-3.5 h-3.5 text-steel-muted" />
                  <a href={`mailto:${selectedDealer.email}`} className="hover:underline text-blue-400">
                    {selectedDealer.email}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <Phone className="w-3.5 h-3.5 text-steel-muted" />
                  <a href={`tel:${selectedDealer.phone}`} className="hover:underline">
                    {selectedDealer.phone}
                  </a>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] text-steel-muted uppercase tracking-wider">Business Type & Interest</div>
                <div className="font-semibold text-white">{selectedDealer.businessType}</div>
                <div className="text-steel-muted text-[10px]">
                  Interest: {selectedDealer.productInterest?.join(', ') || 'All Steel Products'}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] text-steel-muted uppercase tracking-wider">Location & Date</div>
                <div className="text-slate-200">
                  {selectedDealer.city}, {selectedDealer.state}
                </div>
                <div className="text-steel-muted text-[10px]">
                  {new Date(selectedDealer.createdAt).toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-steel-muted uppercase tracking-wider">
                Applicant Proposal Message:
              </label>
              <div className="p-3.5 bg-steel-dark border border-steel-border/70 rounded-xl text-xs text-slate-200 leading-relaxed font-mono">
                {selectedDealer.message}
              </div>
            </div>

            {selectedDealer.existingBusinessDetails && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-steel-muted uppercase tracking-wider">
                  Existing Distribution Infrastructure & Details:
                </label>
                <div className="p-3.5 bg-steel-dark border border-steel-border/70 rounded-xl text-xs text-slate-200">
                  {selectedDealer.existingBusinessDetails}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-steel-border/60 flex items-center justify-between">
              <label className="text-xs font-bold text-white uppercase tracking-wider">
                Application Status:
              </label>
              <select
                value={selectedDealer.status}
                onChange={(e) => handleUpdateDealerStatus(e.target.value)}
                disabled={updatingStatus}
                className="py-2 px-4 bg-steel-dark border border-blue-400/50 rounded-xl text-white text-xs font-semibold focus:outline-none"
              >
                <option value="New">New</option>
                <option value="Under Review">Under Review</option>
                <option value="Contacted">Contacted</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-steel-navy border border-steel-border rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-base font-bold font-heading text-white">Confirm Record Deletion</h3>
            </div>
            <p className="text-xs text-steel-muted leading-relaxed">
              Are you sure you want to permanently delete this enquiry from the Hariom Pipes system?
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 bg-steel-dark border border-steel-border text-steel-muted hover:text-white rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteEnquiry}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
