'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If already logged in, redirect to dashboard
    const token = localStorage.getItem('hpil_admin_token');
    if (token) {
      router.push('/admin/dashboard');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);

    try {
      const res = await apiClient.post<{
        user: { id: string; name: string; email: string; role: string };
        token: string;
      }>('/admin/login', { email, password });

      if (res.success && res.data) {
        localStorage.setItem('hpil_admin_token', res.data.token);
        localStorage.setItem('hpil_admin_user', JSON.stringify(res.data.user));
        router.push('/admin/dashboard');
      } else {
        setError(res.error?.message || 'Invalid credentials. Please verify and try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-steel-dark flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background visual elements */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ff6500_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Header Branding */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-3 bg-amber-primary/10 border border-amber-primary/30 rounded-2xl mb-4 text-amber-primary">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-heading uppercase">
            Hariom Pipe Industries
          </h1>
          <p className="mt-1 text-sm text-steel-muted">
            Enterprise Management & Operations Control Portal
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-steel-navy/90 border border-steel-border/80 shadow-2xl rounded-2xl p-8 backdrop-blur-xl space-y-6">
          <div className="border-b border-steel-border/50 pb-4">
            <h2 className="text-lg font-semibold text-white">Administrator Authentication</h2>
            <p className="text-xs text-steel-muted">Sign in with authorized corporate credentials</p>
          </div>

          {error && (
            <div className="p-4 bg-red-950/50 border border-red-500/40 rounded-xl text-red-300 text-xs flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-200">Authentication Failed</p>
                <p className="mt-0.5 text-red-300/80">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-steel-muted uppercase tracking-wider mb-2">
                Corporate Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-steel-muted">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@hariompipes.com"
                  className="w-full pl-10 pr-4 py-3 bg-steel-dark/80 border border-steel-border/80 rounded-xl text-white placeholder-steel-muted text-sm focus:outline-none focus:border-amber-primary focus:ring-1 focus:ring-amber-primary transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-steel-muted uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-steel-muted">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-steel-dark/80 border border-steel-border/80 rounded-xl text-white placeholder-steel-muted text-sm focus:outline-none focus:border-amber-primary focus:ring-1 focus:ring-amber-primary transition-colors"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-amber-primary hover:bg-amber-hover disabled:bg-amber-primary/50 text-steel-dark font-bold rounded-xl text-sm transition-all shadow-lg shadow-amber-primary/20 flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Admin Portal</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-steel-border/40 text-center text-xs text-steel-muted">
            <p>Protected Corporate System &bull; Authorized Personnel Only</p>
            <div className="mt-3">
              <Link href="/" className="text-amber-primary hover:underline text-xs">
                &larr; Return to Main Corporate Website
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
