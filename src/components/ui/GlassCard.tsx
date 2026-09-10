import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../utils/cn';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  glow?: 'cyan' | 'violet' | 'orange' | 'none';
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  glow = 'none',
  hoverEffect = true,
  ...props
}) => {
  const glowStyles = {
    none: '',
    cyan: 'hover:border-nexora-cyan/50 hover:shadow-neon-cyan',
    violet: 'hover:border-nexora-violet/50 hover:shadow-neon-violet',
    orange: 'hover:border-nexora-orange/50 hover:shadow-neon-orange',
  };

  return (
    <motion.div
      className={cn(
        'rounded-2xl p-6 bg-slate-900/60 backdrop-blur-md border border-slate-800/80 transition-all duration-300 relative overflow-hidden',
        hoverEffect && 'hover:bg-slate-900/80 hover:-translate-y-1',
        glowStyles[glow],
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};

