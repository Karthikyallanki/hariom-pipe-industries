'use client';

import React, { useState } from 'react';
import { Users, CheckCircle2, ShieldCheck, ArrowRight, Building2, Store } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { apiClient } from '@/lib/api-client';

export default function DealerEnquiryPage() {
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    phone: '',
    email: '',
    state: '',
    city: '',
    businessType: 'Distributor',
    productInterest: ['Pipes & Tubes'],
    existingBusinessDetails: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const businessTypes = ['Distributor', 'Stockist', 'Retail Dealer', 'EPC Contractor', 'Industrial Fabricator'];

  const productOptions = ['Pipes & Tubes', 'Slit Coils & Strips', 'Scaffolding Systems', 'M.S. Billets'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProductCheckbox = (prod: string) => {
    if (formData.productInterest.includes(prod)) {
      setFormData({
        ...formData,
        productInterest: formData.productInterest.filter((p) => p !== prod),
      });
    } else {
      setFormData({
        ...formData,
        productInterest: [...formData.productInterest, prod],
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const res = await apiClient.post<{ enquiryId: string }>('/dealer-enquiries', formData);

    if (res.success && res.data) {
      setSubmittedRef(res.data.enquiryId);
    } else {
      setErrorMsg(res.error?.message || 'Failed to submit dealership application.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-[#0b192c] text-white rounded-2xl p-8 md:p-10 mb-8 shadow-xl bg-steel-pattern text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#ff6500] bg-orange-950/80 px-3 py-1 rounded border border-orange-800/50 mb-3 inline-block">
            Channel Partner & Dealership Network
          </span>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">BECOME AN AUTHORIZED DEALER</h1>
          <p className="text-slate-300 text-xs md:text-sm max-w-xl mx-auto">
            Partner with Hariom Pipe Industries Limited to expand your steel distribution business backed by factory direct supply and marketing support.
          </p>
        </div>

        {submittedRef ? (
          <Card className="text-center p-8 md:p-12 border-2 border-emerald-500/50 bg-emerald-50/20">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h2 className="text-2xl font-bold text-[#0b192c] mb-2">Dealership Application Submitted</h2>
            <p className="text-slate-600 text-sm max-w-md mx-auto mb-6">
              Your application has been logged and assigned to the Hariom Channel Partner Operations Team for review.
            </p>

            <div className="bg-white border border-slate-200 rounded-xl p-6 max-w-sm mx-auto mb-6 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Application Reference ID</span>
              <span className="text-2xl font-black text-[#ff6500] tracking-wider font-mono block">{submittedRef}</span>
              <span className="text-[11px] text-slate-500 mt-1 block">Keep this ID for dealership status inquiries.</span>
            </div>

            <Button variant="primary" onClick={() => setSubmittedRef(null)}>
              Submit Another Application
            </Button>
          </Card>
        ) : (
          <Card className="p-8">
            {errorMsg && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg text-xs font-medium">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Applicant / Proprietor Name *"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Suresh Patel"
                  required
                />
                <Input
                  label="Firm / Enterprise Name *"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="e.g. Patel Steel Traders & Hardware"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Phone / Mobile Number *"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. +91 98765 12345"
                  required
                />
                <Input
                  label="Email Address *"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. suresh@patelsteel.com"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="State *"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="e.g. Telangana"
                  required
                />
                <Input
                  label="City / District *"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Nizamabad"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Primary Business Type *
                  </label>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    className="w-full rounded-md border border-slate-300 p-2.5 text-sm text-slate-900 focus:border-[#0b192c] focus:ring-[#0b192c]"
                  >
                    {businessTypes.map((bt) => (
                      <option key={bt} value={bt}>
                        {bt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Product Portfolio Interest
                  </label>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {productOptions.map((prod) => (
                      <label key={prod} className="flex items-center gap-2 text-xs text-slate-800 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.productInterest.includes(prod)}
                          onChange={() => handleProductCheckbox(prod)}
                          className="rounded border-slate-300 text-[#ff6500] focus:ring-[#ff6500]"
                        />
                        <span>{prod}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <Input
                  label="Existing Business Details (Turnover / Stockyard Area)"
                  name="existingBusinessDetails"
                  value={formData.existingBusinessDetails}
                  onChange={handleChange}
                  placeholder="e.g. 5,000 sq.ft. stockyard, current annual turnover ~₹3 Cr"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Dealership Proposal Message *
                </label>
                <textarea
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Describe your current distribution footprint, target territory, and sales expectations..."
                  className="w-full rounded-md border border-slate-300 p-3 text-sm text-slate-900 focus:border-[#0b192c] focus:ring-[#0b192c]"
                  required
                />
              </div>

              <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={loading}>
                Submit Authorized Dealership Application
              </Button>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
}
