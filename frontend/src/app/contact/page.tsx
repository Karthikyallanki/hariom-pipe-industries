'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, CheckCircle2, Navigation, Send, Building } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { apiClient } from '@/lib/api-client';
import { COMPANY_DETAILS } from '@/lib/constants';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    department: 'General Inquiries',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const departments = [
    'General Inquiries',
    'Sales & Commercial Quotations',
    'Dealer & Channel Distribution',
    'Investor Relations & Financials',
    'Human Resources & Careers',
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const res = await apiClient.post('/contact', formData);

    if (res.success) {
      setSubmitted(true);
    } else {
      setErrorMsg(res.error?.message || 'Failed to dispatch contact message.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-[#0b192c] text-white rounded-2xl p-8 md:p-12 mb-12 shadow-xl bg-steel-pattern text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#ff6500] bg-orange-950/80 px-3 py-1 rounded border border-orange-800/50 mb-3 inline-block">
            Corporate Communications Desk
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-3">CONTACT HARIOM PIPE INDUSTRIES</h1>
          <p className="text-slate-300 text-sm md:text-base max-w-2xl mx-auto">
            Get in touch with our corporate office, sales desks, dealer division, or investor relations officers.
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* Left Corporate Office & Contact Cards */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="border-t-4 border-t-[#ff6500]">
              <div className="flex items-center gap-3 mb-4">
                <Building className="w-6 h-6 text-[#ff6500]" />
                <h3 className="text-lg font-bold text-[#0b192c]">Corporate Headquarters</h3>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed mb-4">
                {COMPANY_DETAILS.corporateOffice}
              </p>
              <div className="pt-2 flex flex-wrap gap-2">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(COMPANY_DETAILS.corporateOffice)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ff6500] bg-orange-50 px-3 py-1.5 rounded border border-orange-200 hover:bg-orange-100 transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" /> Get Directions
                </a>
              </div>
            </Card>

            <Card>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Direct Phone & Email Contacts</h4>
              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#ff6500] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Toll-Free Helpline:</span>
                    <a href={`tel:${COMPANY_DETAILS.tollFree}`} className="text-slate-600 hover:text-[#ff6500]">
                      {COMPANY_DETAILS.tollFree}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#ff6500] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Board Line:</span>
                    <a href={`tel:${COMPANY_DETAILS.phone}`} className="text-slate-600 hover:text-[#ff6500]">
                      {COMPANY_DETAILS.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2 border-t border-slate-100">
                  <Mail className="w-4 h-4 text-[#ff6500] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Commercial Sales:</span>
                    <a href={`mailto:${COMPANY_DETAILS.salesEmail}`} className="text-slate-600 hover:text-[#ff6500]">
                      {COMPANY_DETAILS.salesEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#ff6500] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Investor Desk:</span>
                    <a href={`mailto:${COMPANY_DETAILS.investorEmail}`} className="text-slate-600 hover:text-[#ff6500]">
                      {COMPANY_DETAILS.investorEmail}
                    </a>
                  </div>
                </div>
              </div>
            </Card>

            {/* Specialized Enquiry Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <Link href="/quote">
                <Button variant="primary" size="md" className="w-full">
                  Product Quote
                </Button>
              </Link>
              <Link href="/dealer-enquiry">
                <Button variant="outline" size="md" className="w-full">
                  Dealer Portal
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Interactive Contact Form */}
          <div className="lg:col-span-7">
            {submitted ? (
              <Card className="text-center p-8 md:p-12 border-2 border-emerald-500/50 bg-emerald-50/20">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-[#0b192c] mb-2">Message Dispatched Successfully</h3>
                <p className="text-slate-600 text-xs max-w-md mx-auto mb-6">
                  Thank you for reaching out. Your inquiry has been routed to the requested department.
                </p>
                <Button variant="primary" onClick={() => setSubmitted(false)}>
                  Send Another Message
                </Button>
              </Card>
            ) : (
              <Card className="p-8">
                <h3 className="text-xl font-bold text-[#0b192c] mb-6 pb-2 border-b border-slate-200">
                  Send Corporate Inquiry
                </h3>

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
                      placeholder="e.g. Anish Sharma"
                      required
                    />
                    <Input
                      label="Email Address *"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. anish@company.com"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Phone Number *"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. +91 98765 43210"
                      required
                    />
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                        Target Department *
                      </label>
                      <select
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        className="w-full rounded-md border border-slate-300 p-2.5 text-sm text-slate-900 focus:border-[#0b192c] focus:ring-[#0b192c]"
                      >
                        {departments.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <Input
                      label="Subject *"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="e.g. Inquiry regarding GI Pipe bulk supply for project"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Type your message or corporate inquiry details here..."
                      className="w-full rounded-md border border-slate-300 p-3 text-sm text-slate-900 focus:border-[#0b192c] focus:ring-[#0b192c]"
                      required
                    />
                  </div>

                  <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={loading} icon={<Send className="w-4 h-4" />}>
                    Send Message
                  </Button>
                </form>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
