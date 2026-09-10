import React from 'react';
import { motion } from 'framer-motion';

interface SectionHeadingProps {
  number?: string;
  badge: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  gradientTitle?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  number,
  badge,
  title,
  description,
  align = 'center',
  gradientTitle,
}) => {
  const isCenter = align === 'center';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      className={`mb-12 md:mb-16 ${isCenter ? 'text-center mx-auto' : 'text-left'} max-w-3xl`}
    >
      {/* Badge / Pill */}
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-700/80 bg-slate-900/80 text-xs font-mono mb-4 text-nexora-cyan shadow-sm ${isCenter ? 'mx-auto' : ''}`}>
        <span className="w-2 h-2 rounded-full bg-nexora-cyan animate-pulse"></span>
        {number && <span className="text-slate-400 font-semibold">{number} //</span>}
        <span className="tracking-wide uppercase">{badge}</span>
      </div>

      {/* Main Title */}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-display leading-tight">
        {title}{' '}
        {gradientTitle && (
          <span className="text-gradient-brand block sm:inline">{gradientTitle}</span>
        )}
      </h2>

      {/* Optional Description */}
      {description && (
        <p className="mt-4 text-base sm:text-lg text-slate-400 font-normal leading-relaxed">
          {description}
        </p>
      )}
    </motion.div>
  );
};

