'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, User, Share2, Tag } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { apiClient } from '@/lib/api-client';

interface IBlog {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  readTimeMinutes: number;
  publishedAt: string;
}

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [blog, setBlog] = useState<IBlog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBlog() {
      if (!slug) return;
      const res = await apiClient.get<{ blog: IBlog }>(`/blogs/${slug}`);
      if (res.success && res.data) {
        setBlog(res.data.blog);
      }
      setLoading(false);
    }
    loadBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#ff6500] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-slate-600 text-xs">Loading Article...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-slate-50 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Article Not Found</h2>
        <Link href="/blogs">
          <Button variant="primary">Back to Insights</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/blogs" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#ff6500] uppercase tracking-wider mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Insights Hub
        </Link>

        {/* Article Header */}
        <div className="bg-[#0b192c] text-white rounded-2xl p-8 md:p-12 mb-8 shadow-xl bg-steel-pattern">
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="gold">{blog.category}</Badge>
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#ff6500]" /> {blog.readTimeMinutes} min read
            </span>
          </div>

          <h1 className="text-2xl md:text-4xl font-black tracking-tight mb-4 leading-tight text-white">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-4 border-t border-slate-800">
            <span className="flex items-center gap-1.5 font-medium text-slate-200">
              <User className="w-3.5 h-3.5 text-[#ff6500]" /> {blog.author}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#ff6500]" />
              {new Date(blog.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Article Body */}
        <Card className="p-8 md:p-12 mb-10 leading-relaxed text-slate-800 text-sm space-y-4">
          <p className="text-base font-semibold text-slate-900 border-l-4 border-[#ff6500] pl-4 py-1 italic bg-slate-50 rounded-r">
            {blog.summary}
          </p>

          <div className="pt-4 whitespace-pre-line text-slate-700 leading-relaxed space-y-4">
            {blog.content}
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="pt-8 border-t border-slate-200 flex flex-wrap items-center gap-2">
              <Tag className="w-4 h-4 text-slate-400" />
              {blog.tags.map((t, i) => (
                <span key={i} className="text-xs text-slate-700 bg-slate-100 px-3 py-1 rounded font-semibold border border-slate-200">
                  #{t}
                </span>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
