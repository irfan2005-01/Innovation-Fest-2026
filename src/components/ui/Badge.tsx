import React from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'violet' | 'orange' | 'outline' | 'slate';
  size?: 'sm' | 'md';
  pulse?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'cyan',
  size = 'md',
  pulse = false,
  className,
}) => {
  const variantStyles = {
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    violet: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
    orange: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    outline: 'bg-transparent text-slate-300 border-slate-700',
    slate: 'bg-slate-800/80 text-slate-300 border-slate-700/80',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2.5 py-0.5 font-mono',
    md: 'text-xs px-3 py-1 font-mono',
  };

  const pulseColors = {
    cyan: 'bg-cyan-400',
    violet: 'bg-violet-400',
    orange: 'bg-orange-400',
    outline: 'bg-slate-400',
    slate: 'bg-slate-400',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium tracking-wide shadow-sm',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span
            className={cn(
              'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
              pulseColors[variant]
            )}
          />
          <span
            className={cn('relative inline-flex rounded-full h-2 w-2', pulseColors[variant])}
          />
        </span>
      )}
      {children}
    </span>
  );
};

