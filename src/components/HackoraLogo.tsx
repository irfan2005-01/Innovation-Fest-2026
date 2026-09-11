import React from 'react';
import { motion } from 'framer-motion';

interface HackoraLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  className?: string;
  showTagline?: boolean;
}

export const RotatingO: React.FC<{ size?: 'sm' | 'md' | 'lg' | 'hero' }> = ({ size = 'md' }) => {
  const dimensions =
    size === 'hero'
      ? 'w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24'
      : size === 'lg'
      ? 'w-10 h-10'
      : size === 'sm'
      ? 'w-6 h-6'
      : 'w-8 h-8';

  return (
    <div className={`relative inline-flex items-center justify-center ${dimensions} mx-0.5 align-middle select-none`}>
      {/* Ambient Pulsing Glow behind O */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.35, 0.65, 0.35],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500/40 via-violet-500/40 to-orange-500/30 blur-md pointer-events-none"
      />

      {/* Outer Clockwise Rotating Orbital Ring */}
      <motion.svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
      >
        <defs>
          <linearGradient id="orbit-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00F2FE" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#F97316" />
          </linearGradient>
        </defs>

        {/* Outer dashed ring with gradient */}
        <circle
          cx="50"
          cy="50"
          r="44"
          fill="none"
          stroke="url(#orbit-grad-1)"
          strokeWidth="3.5"
          strokeDasharray="6 8"
          strokeLinecap="round"
        />

        {/* Orbiting Satellite Node 1 */}
        <circle cx="50" cy="6" r="4.5" fill="#00F2FE" className="filter drop-shadow-[0_0_6px_#00F2FE]" />
        {/* Orbiting Satellite Node 2 */}
        <circle cx="50" cy="94" r="3.5" fill="#F97316" className="filter drop-shadow-[0_0_6px_#F97316]" />
      </motion.svg>

      {/* Inner Counter-Clockwise Rotating Ring */}
      <motion.svg
        viewBox="0 0 100 100"
        className="absolute inset-1 w-[85%] h-[85%] m-auto pointer-events-none"
        animate={{ rotate: -360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      >
        <defs>
          <linearGradient id="orbit-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F97316" />
            <stop offset="60%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#00F2FE" />
          </linearGradient>
        </defs>

        {/* Segmented Inner Arc */}
        <circle
          cx="50"
          cy="50"
          r="32"
          fill="none"
          stroke="url(#orbit-grad-2)"
          strokeWidth="3"
          strokeDasharray="18 14"
          strokeLinecap="round"
        />
        {/* Node on inner ring */}
        <circle cx="82" cy="50" r="3" fill="#8B5CF6" className="filter drop-shadow-[0_0_5px_#8B5CF6]" />
      </motion.svg>

      {/* Central Pulsing Tech Core */}
      <motion.div
        animate={{
          scale: [0.85, 1.1, 0.85],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="relative z-10 w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 rounded-full bg-gradient-to-tr from-cyan-300 via-white to-orange-300 shadow-[0_0_12px_#00F2FE]"
      />
    </div>
  );
};

export const HackoraLogo: React.FC<HackoraLogoProps> = ({
  size = 'md',
  className = '',
  showTagline = true,
}) => {
  if (size === 'hero') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        {/* Big Typography with Animated Rotating 'O' in INNOVATION */}
        <div className="my-2 select-none">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-display tracking-tight text-white flex items-center justify-center flex-wrap">
            <span>INN</span>
            <RotatingO size="hero" />
            <span>VATION</span>
          </h1>

          <div className="mt-1 sm:mt-2 text-3xl sm:text-5xl md:text-6xl font-black font-display tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-400 to-orange-400 uppercase">
            FEST 2026
          </div>
        </div>

        {/* National Level Fest Badge */}
        <div className="mt-4 mb-5">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/40 text-sm sm:text-base md:text-lg font-mono font-bold tracking-[0.2em] text-cyan-300 uppercase shadow-lg shadow-cyan-500/10 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>National Tech Conclave • Hackora, Ideathon & Expo</span>
          </div>
        </div>

        {/* Tagline & Organization Info */}
        {showTagline && (
          <div className="mt-2 space-y-5">
            {/* Organized By */}
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-xs font-mono text-slate-500 uppercase tracking-[0.3em]">
                Organized by
              </span>
              <span className="text-sm sm:text-base md:text-lg font-semibold text-white font-display tracking-wide">
                Lingaraj Appa Engineering College, Bidar
              </span>
            </div>

            {/* Divider */}
            <div className="flex items-center justify-center gap-3">
              <span className="h-[1px] w-8 sm:w-16 bg-gradient-to-r from-transparent to-violet-500/60" />
              <span className="text-xs font-mono text-slate-500 uppercase tracking-[0.3em]">
                In Collaboration with
              </span>
              <span className="h-[1px] w-8 sm:w-16 bg-gradient-to-l from-transparent to-violet-500/60" />
            </div>

            {/* Krishi Kalpa Foundation */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center justify-center gap-3">
                <img
                  src="/assets/krishi-kalpa-logo.png"
                  alt="Krishi Kalpa Logo"
                  className="h-9 sm:h-12 w-auto object-contain rounded-lg bg-white/95 px-2 py-1 shadow-md border border-emerald-500/30"
                />
                <span className="text-sm sm:text-base md:text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 font-display tracking-wide">
                  Krishi Kalpa Foundation
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] sm:text-xs font-mono text-emerald-300/80 tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Recognized by the Government of Karnataka
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Compact size for Navbar and Footer
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Rotating O Emblem */}
      <RotatingO size={size === 'sm' ? 'sm' : 'md'} />

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="font-black text-sm sm:text-base tracking-tight text-white font-display">
            INNOVATION FEST
          </span>
          <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-gradient-to-r from-cyan-500 to-violet-500 text-slate-950">
            2026
          </span>
        </div>
        <span className="text-[9px] font-mono text-cyan-400 tracking-wider">
          LAEC BIDAR // ENGINEERS' DAY
        </span>
      </div>
    </div>
  );
};

export const InnovationFestLogo = HackoraLogo;
