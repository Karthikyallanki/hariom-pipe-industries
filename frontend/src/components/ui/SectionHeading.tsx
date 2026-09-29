import React from 'react';

export interface SectionHeadingProps {
  category?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  theme?: 'light' | 'dark';
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  category,
  title,
  subtitle,
  centered = false,
  theme = 'light',
  className = '',
}) => {
  const isDark = theme === 'dark';

  return (
    <div className={`mb-10 ${centered ? 'text-center max-w-3xl mx-auto' : ''} ${className}`}>
      {category && (
        <span
          className={`inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded mb-3 ${
            isDark ? 'bg-orange-950/60 text-[#ff6500] border border-orange-800/50' : 'bg-orange-50 text-[#ff6500] border border-orange-200'
          }`}
        >
          {category}
        </span>
      )}
      <h2
        className={`text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight ${
          isDark ? 'text-white' : 'text-[#0b192c]'
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-3 text-base md:text-lg ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
};
