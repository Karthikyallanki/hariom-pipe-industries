'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { FileText, CheckCircle2, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { apiClient } from '@/lib/api-client';

function QuoteFormContent() {
  const searchParams = useSearchParams();
  const prefilledProduct = searchParams.get('product') || '';
  const prefilledRequirement = searchParams.get('requirement') || '';

  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    productName: prefilledProduct,
    quantity: '',
    requirementType: prefilledRequirement || 'Quotation Request',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (prefilledProduct) {
      setFormData((prev) => ({ ...prev, productName: prefilledProduct }));
    }
  }, [prefilledProduct]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const res = await apiClient.post<{ enquiryId: string }>('/enquiries', formData);

    if (res.success && res.data) {
      setSubmittedRef(res.data.enquiryId);
    } else {
      setErrorMsg(res.error?.message || 'Failed to submit quotation request. Please check inputs.');
    }
    setLoading(false);
  };

  if (submittedRef) {
    return (
      <Card className="text-center p-8 md:p-12 border-2 border-emerald-500/50 bg-emerald-50/20">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <h2 className="text-2xl font-bold text-[#0b192c] mb-2">Quotation Request Successfully Submitted</h2>
        <p className="text-slate-600 text-sm max-w-md mx-auto mb-6">
          Your inquiry has been logged in our enterprise CRM system and dispatched to a Hariom technical sales officer.
        </p>

        <div className="bg-white border border-slate-200 rounded-xl p-6 max-w-sm mx-auto mb-6 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Generated Quote Reference ID</span>
          <span className="text-2xl font-black text-[#ff6500] tracking-wider font-mono block">{submittedRef}</span>
          <span className="text-[11px] text-slate-500 mt-1 block">Save this ID for tracking enquiry status.</span>
        </div>

        <Button variant="primary" onClick={() => setSubmittedRef(null)}>
          Submit Another Inquiry
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-8">
      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg text-xs font-medium">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Full Name *"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Rajesh Kumar"
            required
          />
          <Input
            label="Company / Organization Name *"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="e.g. Apex Infrastructure Pvt Ltd"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Email Address *"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="e.g. rajesh@apexinfra.com"
            required
          />
          <Input
            label="Phone / Mobile Number *"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="e.g. +91 98765 43210"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="City *"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="e.g. Hyderabad"
            required
          />
          <Input
            label="State *"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="e.g. Telangana"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Product Specification"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            placeholder="e.g. GI Pipe 50mm NB Heavy Class"
          />
          <Input
            label="Estimated Quantity / Tonnage"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="e.g. 25 Metric Tons / 500 Meters"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
            Detailed Requirement Message *
          </label>
          <textarea
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            placeholder="Provide details on required diameter, thickness, delivery location, and delivery schedule..."
            className="w-full rounded-md border border-slate-300 p-3 text-sm text-slate-900 focus:border-[#0b192c] focus:ring-[#0b192c]"
            required
          />
        </div>

        <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={loading}>
          Submit Quotation Request
        </Button>
      </form>
    </Card>
  );
}

export default function QuotePage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-[#0b192c] text-white rounded-2xl p-8 md:p-10 mb-8 shadow-xl bg-steel-pattern text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#ff6500] bg-orange-950/80 px-3 py-1 rounded border border-orange-800/50 mb-3 inline-block">
            Commercial Enquiry Desk
          </span>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">REQUEST OFFICIAL QUOTATION</h1>
          <p className="text-slate-300 text-xs md:text-sm max-w-xl mx-auto">
            Direct technical & pricing requests for Hariom HR, CR, GI, GP Pipes, Slit Coils, Scaffolding, and MS Billets.
          </p>
        </div>

        <Suspense fallback={<div className="text-center py-12 text-slate-500 font-medium">Loading Quotation Form...</div>}>
          <QuoteFormContent />
        </Suspense>
      </div>
    </div>
  );
}
