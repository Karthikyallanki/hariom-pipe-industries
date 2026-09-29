'use client';

import React, { useState } from 'react';
import { Briefcase, MapPin, CheckCircle2, Send, Users, ShieldCheck } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { apiClient } from '@/lib/api-client';

export default function CareersPage() {
  const [selectedJob, setSelectedJob] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    applicantName: '',
    email: '',
    phone: '',
    positionApplied: '',
    experienceYears: '3',
    resumeUrl: '',
    coverLetter: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const openPositions = [
    {
      title: 'Senior Metallurgical Engineer',
      location: 'Mahabubnagar Plant, Telangana',
      department: 'Production & Quality Control',
      experience: '5 - 8 Years',
      type: 'Full-Time',
      desc: 'Oversee induction furnace steel melting, chemical composition analysis, and billet casting operations.',
    },
    {
      title: 'Quality Assurance Lead — Galvanizing',
      location: 'Perundurai Plant, Tamil Nadu',
      department: 'Quality Assurance',
      experience: '4 - 7 Years',
      type: 'Full-Time',
      desc: 'Lead continuous hot-dip zinc coating measurement, hydrostatic pressure testing, and BIS certification audits.',
    },
    {
      title: 'Regional B2B Sales Manager',
      location: 'Hyderabad Corporate Office',
      department: 'Commercial Sales',
      experience: '6 - 10 Years',
      type: 'Full-Time',
      desc: 'Expand institutional sales of HR/CR/GI pipes with solar racking, EPC contractors, and infrastructure buyers.',
    },
    {
      title: 'Maintenance Electrical Engineer',
      location: 'Ananthapur Plant, Andhra Pradesh',
      department: 'Plant Maintenance',
      experience: '3 - 5 Years',
      type: 'Full-Time',
      desc: 'Manage high-voltage sub-station transformers, PLC kiln controls, and induction furnace power supply units.',
    },
  ];

  const handleApplyClick = (jobTitle: string) => {
    setSelectedJob(jobTitle);
    setFormData((prev) => ({ ...prev, positionApplied: jobTitle }));
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const res = await apiClient.post('/job-applications', formData);

    if (res.success) {
      setSubmitted(true);
    } else {
      setErrorMsg(res.error?.message || 'Failed to submit application. Please check form fields.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="bg-[#0b192c] text-white rounded-2xl p-8 md:p-12 mb-12 shadow-xl bg-steel-pattern text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#ff6500] bg-orange-950/80 px-3 py-1 rounded border border-orange-800/50 mb-3 inline-block">
            Careers & Talent Portal
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-3">BUILD YOUR CAREER WITH HARIOM</h1>
          <p className="text-slate-300 text-sm md:text-base max-w-2xl mx-auto">
            Join an enterprise team of engineers, metallurgists, and business leaders driving South India's premier steel manufacturing group.
          </p>
        </div>

        {/* Open Positions List */}
        <div className="mb-16">
          <SectionHeading
            category="Current Opportunities"
            title="OPEN POSITIONS AT HARIOM"
            subtitle="Explore active openings across our corporate office and manufacturing facilities."
            centered
          />

          <div className="space-y-4">
            {openPositions.map((job, idx) => (
              <Card key={idx} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-6">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <Badge variant="gold">{job.department}</Badge>
                    <Badge variant="steel">{job.type}</Badge>
                  </div>
                  <h3 className="text-xl font-bold text-[#0b192c]">{job.title}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <MapPin className="w-3.5 h-3.5 text-[#ff6500]" /> {job.location}
                    </span>
                    <span>Experience: {job.experience}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-2">{job.desc}</p>
                </div>

                <Button
                  variant="primary"
                  size="md"
                  className="shrink-0"
                  onClick={() => handleApplyClick(job.title)}
                >
                  Apply Now
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Application Form Form */}
        <div id="application-form" className="max-w-3xl mx-auto">
          <Card className="p-8 border-t-4 border-t-[#ff6500]">
            <h3 className="text-xl font-bold text-[#0b192c] mb-2">
              {selectedJob ? `Apply for ${selectedJob}` : 'General Job Application'}
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Submit your professional credentials directly to Hariom Human Resources.
            </p>

            {submitted ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                <h4 className="text-lg font-bold text-[#0b192c] mb-1">Application Submitted Successfully</h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto mb-6">
                  Thank you for applying. Shortlisted candidates will be contacted by our HR recruitment team.
                </p>
                <Button variant="outline" onClick={() => setSubmitted(false)}>
                  Submit Another Candidate Profile
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {errorMsg && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg text-xs font-medium">
                    {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Applicant Full Name *"
                    name="applicantName"
                    value={formData.applicantName}
                    onChange={handleChange}
                    placeholder="e.g. Vikram Reddy"
                    required
                  />
                  <Input
                    label="Email Address *"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. vikram@gmail.com"
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
                  <Input
                    label="Position Applied For *"
                    name="positionApplied"
                    value={formData.positionApplied}
                    onChange={handleChange}
                    placeholder="e.g. Senior Metallurgical Engineer"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Total Years of Experience *"
                    type="number"
                    name="experienceYears"
                    value={formData.experienceYears}
                    onChange={handleChange}
                    placeholder="e.g. 5"
                    required
                  />
                  <Input
                    label="Resume / Portfolio Link (Google Drive / LinkedIn) *"
                    name="resumeUrl"
                    value={formData.resumeUrl}
                    onChange={handleChange}
                    placeholder="e.g. https://linkedin.com/in/profile"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Cover Letter / Additional Notes
                  </label>
                  <textarea
                    name="coverLetter"
                    rows={4}
                    value={formData.coverLetter}
                    onChange={handleChange}
                    placeholder="Briefly highlight your metallurgical, plant engineering, or sales accomplishments..."
                    className="w-full rounded-md border border-slate-300 p-3 text-sm text-slate-900 focus:border-[#0b192c] focus:ring-[#0b192c]"
                  />
                </div>

                <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={loading} icon={<Send className="w-4 h-4" />}>
                  Submit Application
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
