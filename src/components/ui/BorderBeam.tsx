import React from 'react';
import { motion } from 'framer-motion';

interface BorderBeamProps {
  duration?: number;
  colorFrom?: string;
  colorTo?: string;
  className?: string;
}

export const BorderBeam: React.FC<BorderBeamProps> = ({
  duration = 8,
  colorFrom = '#00F2FE',
  colorTo = '#8B5CF6',
  className = '',
}) => {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit] ${className}`}>
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{
          repeat: Infinity,
          duration,
          ease: 'linear',
        }}
        className="absolute -inset-[150%] origin-center pointer-events-none opacity-80"
        style={{
          background: `conic-gradient(from 0deg, transparent 0deg, transparent 270deg, ${colorFrom} 315deg, ${colorTo} 360deg)`,
        }}
      />
    </div>
  );
};

