'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, User, ArrowRight, BookOpen, Tag } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { apiClient } from '@/lib/api-client';

interface IBlog {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  author: string;
  category: string;
  tags: string[];
  readTimeMinutes: number;
  publishedAt: string;
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBlogs() {
      const res = await apiClient.get<IBlog[]>('/blogs');
      if (res.success && res.data) {
        setBlogs(res.data);
      }
      setLoading(false);
    }
    loadBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="bg-[#0b192c] text-white rounded-2xl p-8 md:p-12 mb-12 shadow-xl bg-steel-pattern text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#ff6500] bg-orange-950/80 px-3 py-1 rounded border border-orange-800/50 mb-3 inline-block">
            Enterprise News & Technical Whitepapers
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-3">HARIOM INDUSTRY INSIGHTS</h1>
          <p className="text-slate-300 text-sm md:text-base max-w-2xl mx-auto">
            Stay updated with technical metallurgical whitepapers, BIS standard updates, and corporate press releases.
          </p>
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-4 border-[#ff6500] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-slate-600 text-xs">Loading Industry Insights...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <Card key={blog._id} className="flex flex-col justify-between h-full group hover:border-[#ff6500]/50 transition-all">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <Badge variant="gold">{blog.category}</Badge>
                    <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#ff6500]" /> {blog.readTimeMinutes} min read
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#0b192c] group-hover:text-[#ff6500] transition-colors mb-2 line-clamp-2">
                    {blog.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">{blog.summary}</p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {blog.tags && blog.tags.slice(0, 3).map((t, i) => (
                      <span key={i} className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-medium">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">
                    {new Date(blog.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>

                  <Link href={`/blogs/${blog.slug}`}>
                    <Button variant="outline" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                      Read Article
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
