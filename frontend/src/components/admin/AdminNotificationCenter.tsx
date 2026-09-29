'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell, FileText, Users, X, Check, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { getSocket } from '@/lib/socket';

export interface NotificationItem {
  id: string;
  type: 'QUOTE' | 'DEALER';
  title: string;
  subtitle: string;
  enquiryId: string;
  timestamp: string;
  read: boolean;
}

export default function AdminNotificationCenter() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Play subtle synth chime using Web Audio API
  const playAlertChime = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      // Audio context error ignored
    }
  };

  useEffect(() => {
    const socket = getSocket();

    const handleNewQuote = (data: { enquiryId: string; customerName: string; companyName: string; productName?: string; createdAt?: string }) => {
      const newItem: NotificationItem = {
        id: `quote-${Date.now()}-${Math.random()}`,
        type: 'QUOTE',
        title: `New Quotation Request: ${data.enquiryId}`,
        subtitle: `${data.customerName} (${data.companyName}) - ${data.productName || 'General Quote'}`,
        enquiryId: data.enquiryId,
        timestamp: data.createdAt ? new Date(data.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : 'Just now',
        read: false,
      };

      setNotifications((prev) => [newItem, ...prev.slice(0, 19)]);
      playAlertChime();
    };

    const handleNewDealer = (data: { enquiryId: string; applicantName: string; companyName: string; location?: string; createdAt?: string }) => {
      const newItem: NotificationItem = {
        id: `dealer-${Date.now()}-${Math.random()}`,
        type: 'DEALER',
        title: `New Dealership Application: ${data.enquiryId}`,
        subtitle: `${data.applicantName} (${data.companyName}) - ${data.location || 'India'}`,
        enquiryId: data.enquiryId,
        timestamp: data.createdAt ? new Date(data.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : 'Just now',
        read: false,
      };

      setNotifications((prev) => [newItem, ...prev.slice(0, 19)]);
      playAlertChime();
    };

    socket.on('new_quote_enquiry', handleNewQuote);
    socket.on('new_dealer_enquiry', handleNewDealer);

    return () => {
      socket.off('new_quote_enquiry', handleNewQuote);
      socket.off('new_dealer_enquiry', handleNewDealer);
    };
  }, [soundEnabled]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-steel-muted hover:text-white bg-steel-dark border border-steel-border rounded-xl transition-colors"
        title="Real-Time Alerts"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 bg-amber-primary text-steel-dark text-[10px] font-black rounded-full animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-steel-navy border border-steel-border rounded-2xl shadow-2xl z-50 overflow-hidden">
          {/* Panel Header */}
          <div className="p-4 border-b border-steel-border/60 flex items-center justify-between bg-steel-dark/50">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-primary" />
              <h3 className="font-bold text-xs text-white uppercase tracking-wider">
                Live Operation Alerts ({notifications.length})
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="text-steel-muted hover:text-white p-1 rounded-lg"
                title={soundEnabled ? 'Mute Alert Sound' : 'Enable Alert Sound'}
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-amber-primary" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="text-steel-muted hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-steel-border/30">
            {notifications.length === 0 ? (
              <div className="py-10 text-center text-steel-muted text-xs px-4">
                <p>No new real-time alerts received yet.</p>
                <p className="text-[10px] text-steel-border/80 mt-1">
                  Listening for incoming quotes and dealer applications...
                </p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3.5 flex items-start gap-3 hover:bg-steel-dark/60 transition-colors ${
                    !n.read ? 'bg-amber-primary/5' : ''
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg shrink-0 ${
                      n.type === 'QUOTE' ? 'bg-amber-primary/10 text-amber-primary' : 'bg-blue-500/10 text-blue-400'
                    }`}
                  >
                    {n.type === 'QUOTE' ? <FileText className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                  </div>

                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs text-white truncate">{n.title}</span>
                      <span className="text-[9px] text-steel-muted font-mono">{n.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-steel-muted truncate">{n.subtitle}</p>
                    <div className="pt-1 flex items-center gap-3 text-[10px]">
                      <Link
                        href="/admin/enquiries"
                        onClick={() => setIsOpen(false)}
                        className="text-amber-primary font-semibold hover:underline"
                      >
                        Inspect in Hub &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Panel Footer */}
          {notifications.length > 0 && (
            <div className="p-3 bg-steel-dark/80 border-t border-steel-border/60 flex justify-between items-center text-[10px]">
              <button
                onClick={markAllAsRead}
                className="text-steel-muted hover:text-white flex items-center gap-1"
              >
                <Check className="w-3 h-3 text-emerald-400" />
                <span>Mark All Read</span>
              </button>
              <button onClick={clearAll} className="text-red-400 hover:text-red-300">
                Clear List
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
