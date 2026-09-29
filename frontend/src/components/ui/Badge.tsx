import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'steel' | 'gold' | 'success' | 'warning' | 'info' | 'danger';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'steel', className = '' }) => {
  const variantStyles = {
    steel: 'bg-slate-100 text-slate-800 border-slate-300',
    gold: 'bg-amber-50 text-amber-900 border-amber-300 font-semibold',
    success: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    warning: 'bg-orange-50 text-orange-800 border-orange-300',
    info: 'bg-sky-50 text-sky-800 border-sky-300',
    danger: 'bg-rose-50 text-rose-800 border-rose-300',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium border ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
