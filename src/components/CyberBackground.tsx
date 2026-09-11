import React from 'react';
import { motion } from 'framer-motion';

interface CyberBackgroundProps {
  theme: 'dark' | 'light';
}

export const CyberBackground: React.FC<CyberBackgroundProps> = ({ theme }) => {
  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* 1. BASE BACKGROUND GRADIENT */}
      {isDark ? (
        <div className="absolute inset-0 bg-gradient-to-b from-[#060919] via-[#050816] to-[#02040a] transition-colors duration-700" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-white via-[#f3f7fd] to-[#eef4fc] transition-colors duration-700" />
      )}

      {/* 2. TOP HERO ILLUMINATION CONE / STAGE LIGHT */}
      <div
        className={`absolute -top-40 left-1/2 -translate-x-1/2 w-[1100px] h-[650px] rounded-full blur-[140px] pointer-events-none transition-all duration-700 ${
          isDark
            ? 'bg-gradient-to-b from-cyan-500/22 via-violet-600/18 to-transparent'
            : 'bg-gradient-to-b from-sky-400/30 via-indigo-300/20 to-transparent'
        }`}
      />

      {/* 3. DYNAMIC FLOATING AURORA ORBS */}
      {/* Mobile-optimized lightweight static ambient glow (0% CPU/GPU overhead) */}
      <div className="md:hidden absolute inset-0 pointer-events-none">
        <div
          className={`absolute -top-10 left-1/2 -translate-x-1/2 w-[320px] h-[320px] rounded-full blur-[60px] opacity-40 pointer-events-none ${
            isDark ? 'bg-cyan-500/25' : 'bg-sky-400/25'
          }`}
        />
        <div
          className={`absolute top-1/3 -right-10 w-[260px] h-[260px] rounded-full blur-[50px] opacity-35 pointer-events-none ${
            isDark ? 'bg-violet-600/20' : 'bg-purple-400/25'
          }`}
        />
        <div
          className={`absolute bottom-20 -left-10 w-[240px] h-[240px] rounded-full blur-[50px] opacity-25 pointer-events-none ${
            isDark ? 'bg-orange-500/15' : 'bg-amber-300/25'
          }`}
        />
      </div>

      {/* Desktop Animated Aurora Orbs (Smooth on high-performance screens) */}
      <div className="hidden md:block">
        {/* Orb 1: Cyan / Sky (Top Left / Center) */}
        <motion.div
          animate={{
            x: [0, 40, -30, 0],
            y: [0, -35, 25, 0],
            scale: [1, 1.12, 0.95, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className={`absolute top-10 left-1/4 w-[550px] h-[550px] rounded-full blur-[130px] pointer-events-none transition-colors duration-700 ${
            isDark ? 'bg-cyan-500/16' : 'bg-cyan-400/22'
          }`}
        />

        {/* Orb 2: Purple / Violet (Mid Right) */}
        <motion.div
          animate={{
            x: [0, -50, 30, 0],
            y: [0, 45, -35, 0],
            scale: [1, 0.92, 1.1, 1],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          className={`absolute top-1/3 right-8 w-[600px] h-[600px] rounded-full blur-[150px] pointer-events-none transition-colors duration-700 ${
            isDark ? 'bg-violet-600/18' : 'bg-purple-400/22'
          }`}
        />

        {/* Orb 3: Orange / Amber Accent (Lower Left) */}
        <motion.div
          animate={{
            x: [0, 35, -25, 0],
            y: [0, -30, 20, 0],
            scale: [1, 1.08, 0.92, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
          className={`absolute bottom-24 left-8 w-[480px] h-[480px] rounded-full blur-[140px] pointer-events-none transition-colors duration-700 ${
            isDark ? 'bg-orange-500/10' : 'bg-amber-300/22'
          }`}
        />

        {/* Orb 4: Emerald / Teal Accent (Lower Right) */}
        <motion.div
          animate={{
            x: [0, -30, 20, 0],
            y: [0, 25, -25, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className={`absolute bottom-40 right-1/4 w-[450px] h-[450px] rounded-full blur-[130px] pointer-events-none transition-colors duration-700 ${
            isDark ? 'bg-emerald-500/12' : 'bg-emerald-400/18'
          }`}
        />
      </div>

      {/* 4. HIGH-TECH GRID & DOT MATRIX PATTERN */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${
          isDark ? 'opacity-85' : 'opacity-75'
        }`}
        style={{
          backgroundImage: isDark
            ? `radial-gradient(rgba(0, 242, 254, 0.28) 1.2px, transparent 1.2px),
               linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
               linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)`
            : `radial-gradient(rgba(100, 116, 139, 0.40) 1.4px, transparent 1.4px),
               linear-gradient(to right, rgba(148, 163, 184, 0.18) 1px, transparent 1px),
               linear-gradient(to bottom, rgba(148, 163, 184, 0.18) 1px, transparent 1px)`,
          backgroundSize: '36px 36px',
          maskImage:
            'radial-gradient(ellipse 95% 85% at 50% 30%, #000 65%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 95% 85% at 50% 30%, #000 65%, transparent 100%)',
        }}
      />

      {/* 5. FLOATING CYBER PARTICLES / STAR DUST (Desktop Only to ensure zero lag on mobile) */}
      <div className="hidden md:block absolute inset-0 overflow-hidden pointer-events-none">
        {PARTICLES.map((p, i) => (
          <motion.div
            key={i}
            initial={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              opacity: p.opacity,
            }}
            animate={{
              y: [0, -80, 0],
              x: [0, p.sway, 0],
              opacity: [p.opacity * 0.4, p.opacity, p.opacity * 0.4],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: p.delay,
            }}
            className={`absolute rounded-full pointer-events-none ${
              isDark ? p.colorDark : p.colorLight
            }`}
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              boxShadow: isDark
                ? `0 0 6px ${p.glowDark}`
                : '0 0 4px rgba(100, 116, 139, 0.4)',
            }}
          />
        ))}
      </div>

      {/* 7. FLOATING LOVE HEARTS ANIMATION */}
      {/* Mobile: Static heart glows for zero overhead */}
      <div className="md:hidden absolute inset-0 pointer-events-none overflow-hidden">
        {HEARTS_MOBILE.map((h, i) => (
          <div
            key={`heart-m-${i}`}
            className="absolute pointer-events-none"
            style={{ left: `${h.x}%`, top: `${h.y}%`, opacity: h.opacity }}
          >
            <svg
              width={h.size}
              height={h.size}
              viewBox="0 0 24 24"
              fill={h.fill}
              className={`filter ${h.glow}`}
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
        ))}
      </div>

      {/* Desktop: Animated floating hearts drifting upward */}
      <div className="hidden md:block absolute inset-0 pointer-events-none overflow-hidden">
        {HEARTS.map((h, i) => (
          <motion.div
            key={`heart-${i}`}
            initial={{
              left: `${h.x}%`,
              bottom: `${h.startY}%`,
              opacity: 0,
              scale: 0.5,
            }}
            animate={{
              bottom: [`${h.startY}%`, `${h.startY + h.travel}%`],
              x: [0, h.sway, -h.sway * 0.6, 0],
              opacity: [0, h.opacity, h.opacity, 0],
              scale: [0.5, 1, 1, 0.7],
              rotate: [0, h.sway > 0 ? 15 : -15, h.sway > 0 ? -10 : 10, 0],
            }}
            transition={{
              duration: h.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: h.delay,
            }}
            className="absolute pointer-events-none"
          >
            <svg
              width={h.size}
              height={h.size}
              viewBox="0 0 24 24"
              fill={h.fill}
              className={`filter ${h.glow}`}
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </motion.div>
        ))}
      </div>

      {/* 6. SUBTLE AMBIENT VIGNETTE / DEPTH SHADOW */}
      <div
        className="absolute inset-0 pointer-events-none transition-colors duration-700"
        style={{
          background: isDark
            ? 'radial-gradient(circle at 50% 10%, transparent 45%, rgba(2, 4, 10, 0.55) 95%)'
            : 'radial-gradient(circle at 50% 10%, transparent 55%, rgba(240, 246, 254, 0.45) 95%)',
        }}
      />
    </div>
  );
};

// 20 Deterministic Floating Particles
const PARTICLES = [
  { x: 12, y: 18, size: 2.5, duration: 12, delay: 0, sway: 15, opacity: 0.7, colorDark: 'bg-cyan-400', colorLight: 'bg-cyan-600', glowDark: 'rgba(0, 242, 254, 0.6)' },
  { x: 28, y: 35, size: 3, duration: 16, delay: 2, sway: -20, opacity: 0.6, colorDark: 'bg-violet-400', colorLight: 'bg-purple-600', glowDark: 'rgba(139, 92, 246, 0.6)' },
  { x: 45, y: 22, size: 2, duration: 14, delay: 1, sway: 10, opacity: 0.5, colorDark: 'bg-cyan-300', colorLight: 'bg-blue-500', glowDark: 'rgba(0, 242, 254, 0.5)' },
  { x: 62, y: 48, size: 3.5, duration: 18, delay: 3, sway: -15, opacity: 0.65, colorDark: 'bg-purple-400', colorLight: 'bg-indigo-600', glowDark: 'rgba(168, 85, 247, 0.6)' },
  { x: 78, y: 15, size: 2, duration: 11, delay: 0.5, sway: 18, opacity: 0.5, colorDark: 'bg-cyan-400', colorLight: 'bg-cyan-600', glowDark: 'rgba(0, 242, 254, 0.5)' },
  { x: 88, y: 40, size: 2.5, duration: 15, delay: 2.5, sway: -12, opacity: 0.6, colorDark: 'bg-amber-400', colorLight: 'bg-amber-600', glowDark: 'rgba(251, 191, 36, 0.6)' },
  { x: 18, y: 65, size: 3, duration: 17, delay: 1.5, sway: 22, opacity: 0.55, colorDark: 'bg-emerald-400', colorLight: 'bg-emerald-600', glowDark: 'rgba(52, 211, 153, 0.6)' },
  { x: 34, y: 80, size: 2, duration: 13, delay: 0.8, sway: -18, opacity: 0.5, colorDark: 'bg-cyan-400', colorLight: 'bg-cyan-600', glowDark: 'rgba(0, 242, 254, 0.5)' },
  { x: 52, y: 72, size: 2.5, duration: 19, delay: 3.2, sway: 14, opacity: 0.6, colorDark: 'bg-violet-400', colorLight: 'bg-purple-600', glowDark: 'rgba(139, 92, 246, 0.6)' },
  { x: 70, y: 85, size: 3, duration: 15, delay: 2.1, sway: -25, opacity: 0.5, colorDark: 'bg-cyan-300', colorLight: 'bg-blue-500', glowDark: 'rgba(0, 242, 254, 0.5)' },
  { x: 82, y: 70, size: 2, duration: 14, delay: 1.2, sway: 16, opacity: 0.55, colorDark: 'bg-emerald-400', colorLight: 'bg-emerald-600', glowDark: 'rgba(52, 211, 153, 0.6)' },
  { x: 22, y: 92, size: 2.5, duration: 16, delay: 0.4, sway: -14, opacity: 0.6, colorDark: 'bg-amber-300', colorLight: 'bg-orange-500', glowDark: 'rgba(251, 191, 36, 0.6)' },
  { x: 40, y: 55, size: 2, duration: 12, delay: 1.8, sway: 12, opacity: 0.5, colorDark: 'bg-cyan-400', colorLight: 'bg-cyan-600', glowDark: 'rgba(0, 242, 254, 0.5)' },
  { x: 58, y: 30, size: 3, duration: 17, delay: 2.7, sway: -20, opacity: 0.65, colorDark: 'bg-violet-400', colorLight: 'bg-purple-600', glowDark: 'rgba(139, 92, 246, 0.6)' },
  { x: 74, y: 60, size: 2, duration: 13, delay: 0.9, sway: 15, opacity: 0.5, colorDark: 'bg-cyan-400', colorLight: 'bg-cyan-600', glowDark: 'rgba(0, 242, 254, 0.5)' },
  { x: 92, y: 25, size: 2.5, duration: 15, delay: 2.3, sway: -16, opacity: 0.6, colorDark: 'bg-purple-400', colorLight: 'bg-indigo-600', glowDark: 'rgba(168, 85, 247, 0.6)' },
  { x: 8, y: 45, size: 2, duration: 18, delay: 3.5, sway: 20, opacity: 0.55, colorDark: 'bg-emerald-400', colorLight: 'bg-emerald-600', glowDark: 'rgba(52, 211, 153, 0.6)' },
  { x: 48, y: 90, size: 2.5, duration: 14, delay: 1.1, sway: -15, opacity: 0.5, colorDark: 'bg-cyan-300', colorLight: 'bg-blue-500', glowDark: 'rgba(0, 242, 254, 0.5)' },
  { x: 64, y: 5, size: 3, duration: 16, delay: 0.7, sway: 18, opacity: 0.6, colorDark: 'bg-violet-400', colorLight: 'bg-purple-600', glowDark: 'rgba(139, 92, 246, 0.6)' },
  { x: 30, y: 8, size: 2, duration: 13, delay: 2.2, sway: -12, opacity: 0.5, colorDark: 'bg-cyan-400', colorLight: 'bg-cyan-600', glowDark: 'rgba(0, 242, 254, 0.5)' },
];

// Floating Love Hearts (Desktop Animated)
const HEARTS = [
  { x: 5, startY: -5, travel: 110, size: 14, duration: 16, delay: 0, sway: 30, opacity: 0.18, fill: 'rgba(236, 72, 153, 0.6)', glow: 'drop-shadow(0 0 6px rgba(236, 72, 153, 0.4))' },
  { x: 15, startY: -8, travel: 115, size: 10, duration: 20, delay: 3, sway: -25, opacity: 0.14, fill: 'rgba(244, 114, 182, 0.5)', glow: 'drop-shadow(0 0 4px rgba(244, 114, 182, 0.3))' },
  { x: 25, startY: -3, travel: 108, size: 16, duration: 22, delay: 7, sway: 35, opacity: 0.2, fill: 'rgba(139, 92, 246, 0.5)', glow: 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.4))' },
  { x: 38, startY: -6, travel: 112, size: 12, duration: 18, delay: 1.5, sway: -20, opacity: 0.16, fill: 'rgba(236, 72, 153, 0.55)', glow: 'drop-shadow(0 0 5px rgba(236, 72, 153, 0.35))' },
  { x: 50, startY: -4, travel: 110, size: 18, duration: 24, delay: 5, sway: 28, opacity: 0.22, fill: 'rgba(251, 113, 133, 0.5)', glow: 'drop-shadow(0 0 10px rgba(251, 113, 133, 0.4))' },
  { x: 62, startY: -7, travel: 115, size: 11, duration: 19, delay: 2, sway: -32, opacity: 0.15, fill: 'rgba(0, 242, 254, 0.4)', glow: 'drop-shadow(0 0 5px rgba(0, 242, 254, 0.3))' },
  { x: 72, startY: -2, travel: 108, size: 15, duration: 21, delay: 8, sway: 22, opacity: 0.18, fill: 'rgba(236, 72, 153, 0.5)', glow: 'drop-shadow(0 0 7px rgba(236, 72, 153, 0.35))' },
  { x: 82, startY: -5, travel: 112, size: 9, duration: 17, delay: 4, sway: -18, opacity: 0.12, fill: 'rgba(168, 85, 247, 0.45)', glow: 'drop-shadow(0 0 4px rgba(168, 85, 247, 0.3))' },
  { x: 90, startY: -3, travel: 110, size: 13, duration: 23, delay: 6, sway: 26, opacity: 0.16, fill: 'rgba(244, 114, 182, 0.55)', glow: 'drop-shadow(0 0 6px rgba(244, 114, 182, 0.35))' },
  { x: 95, startY: -6, travel: 115, size: 10, duration: 20, delay: 9, sway: -24, opacity: 0.14, fill: 'rgba(251, 113, 133, 0.45)', glow: 'drop-shadow(0 0 5px rgba(251, 113, 133, 0.3))' },
  { x: 8, startY: -4, travel: 108, size: 8, duration: 15, delay: 10, sway: 15, opacity: 0.12, fill: 'rgba(139, 92, 246, 0.4)', glow: 'drop-shadow(0 0 3px rgba(139, 92, 246, 0.25))' },
  { x: 45, startY: -8, travel: 118, size: 20, duration: 26, delay: 12, sway: -30, opacity: 0.15, fill: 'rgba(236, 72, 153, 0.4)', glow: 'drop-shadow(0 0 10px rgba(236, 72, 153, 0.3))' },
];

// Static hearts for mobile (no animation overhead)
const HEARTS_MOBILE = [
  { x: 10, y: 20, size: 10, opacity: 0.12, fill: 'rgba(236, 72, 153, 0.4)', glow: 'drop-shadow(0 0 3px rgba(236, 72, 153, 0.2))' },
  { x: 85, y: 35, size: 8, opacity: 0.1, fill: 'rgba(244, 114, 182, 0.35)', glow: 'drop-shadow(0 0 2px rgba(244, 114, 182, 0.2))' },
  { x: 30, y: 60, size: 12, opacity: 0.14, fill: 'rgba(139, 92, 246, 0.35)', glow: 'drop-shadow(0 0 4px rgba(139, 92, 246, 0.2))' },
  { x: 70, y: 75, size: 9, opacity: 0.1, fill: 'rgba(251, 113, 133, 0.3)', glow: 'drop-shadow(0 0 3px rgba(251, 113, 133, 0.2))' },
  { x: 50, y: 45, size: 11, opacity: 0.12, fill: 'rgba(236, 72, 153, 0.35)', glow: 'drop-shadow(0 0 3px rgba(236, 72, 153, 0.2))' },
];
