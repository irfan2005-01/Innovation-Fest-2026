import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Flame, Download, ArrowRight, Radio } from 'lucide-react';
import { CountdownTimer } from './CountdownTimer';

interface HeroProps {
  onOpenRegister: () => void;
  onOpenBrochure: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenRegister, onOpenBrochure }) => {
  const metadataItems = [
    {
      icon: Calendar,
      label: 'Dates',
      value: '21–22 September 2026',
      sub: 'Engineers\' Day Special',
      color: 'text-nexora-cyan',
    },
    {
      icon: Flame,
      label: 'Format',
      value: '24-Hour Continuous Sprint',
      sub: 'Zero Midway Eliminations',
      color: 'text-nexora-orange',
    },
    {
      icon: Radio,
      label: 'Problem Statements',
      value: 'Announced Live On-Campus',
      sub: 'Kick-Off: 11:00 AM Sharp',
      color: 'text-nexora-violet',
    },
    {
      icon: MapPin,
      label: 'Venue',
      value: 'Central Computing Arena',
      sub: 'LAEC Campus, Bidar, Karnataka',
      color: 'text-emerald-400',
    },
    {
      icon: Users,
      label: 'Audience',
      value: '200+ Handpicked Builders',
      sub: 'Top Talent Across Karnataka',
      color: 'text-pink-400',
    },
  ];

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background Ambient Radial Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-tr from-cyan-500/15 via-violet-600/15 to-orange-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-10 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-20 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        {/* Micro-badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs sm:text-sm font-mono text-slate-200 mb-6 shadow-lg backdrop-blur-md"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-nexora-orange opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-nexora-orange"></span>
          </span>
          <span className="text-slate-300 font-medium">Engineers' Day Celebrations 2026</span>
          <span className="text-slate-600">//</span>
          <span className="text-nexora-cyan font-semibold">State-Level Hackathon</span>
        </motion.div>

        {/* Primary Headline with Orbital 'O' */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex items-center justify-center font-display font-black tracking-tighter text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-white select-none my-2"
        >
          <span>NEX</span>

          {/* Styled Orbital 'O' */}
          <span className="relative inline-flex items-center justify-center mx-1 sm:mx-2 w-[1em] h-[1em]">
            {/* Outer animated rotating orbital ring */}
            <span className="absolute inset-0 rounded-full border-2 border-dashed border-nexora-cyan/40 animate-spin-slow" />

            {/* Glowing orbital body */}
            <span className="w-[0.8em] h-[0.8em] rounded-full bg-gradient-to-tr from-[#00F2FE] via-[#8B5CF6] to-[#F97316] p-[3px] shadow-lg shadow-violet-500/30 flex items-center justify-center">
              <span className="w-full h-full rounded-full bg-obsidian-950 flex items-center justify-center">
                {/* Core nucleus */}
                <span className="w-2.5 h-2.5 sm:w-4 sm:h-4 rounded-full bg-gradient-to-r from-nexora-cyan to-nexora-orange animate-pulse" />
              </span>
            </span>

            {/* Orbiting Satellite Dot */}
            <span className="absolute -top-1 right-1 w-2.5 h-2.5 rounded-full bg-nexora-orange shadow-md shadow-orange-500/80 animate-ping" />
          </span>

          <span>RA</span>
          <span className="text-gradient-brand text-4xl sm:text-5xl md:text-6xl lg:text-7xl ml-2 font-mono font-bold self-start mt-2">
            '26
          </span>
        </motion.div>

        {/* Subtitle & Motto */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-3 space-y-2"
        >
          <div className="text-lg sm:text-2xl md:text-3xl font-extrabold tracking-widest text-slate-200 font-display uppercase">
            STATE-LEVEL 24-HOUR HACKATHON
          </div>
          <div className="flex items-center justify-center gap-3 text-xs sm:text-sm md:text-base font-mono font-semibold tracking-widest text-gradient-brand">
            <span>CODE.</span>
            <span>•</span>
            <span>INNOVATE.</span>
            <span>•</span>
            <span>TRANSFORM.</span>
          </div>
        </motion.div>

        {/* Institutional Host Ribbon */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-4 text-xs sm:text-sm text-slate-400 font-mono"
        >
          Organized by <strong className="text-white">Lingaraj Appa Engineering College (LAEC)</strong>, Bidar, Karnataka
        </motion.div>

        {/* Interactive Live Countdown Timer */}
        <CountdownTimer />

        {/* Primary Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6 mb-12"
        >
          <button
            onClick={onOpenRegister}
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold font-mono text-sm tracking-wide text-slate-950 bg-brand-gradient hover:opacity-95 shadow-xl shadow-cyan-500/25 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 group"
          >
            <span>Register & Pay Online</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onOpenBrochure}
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-mono text-sm font-semibold text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2.5 backdrop-blur-md"
          >
            <Download className="w-4 h-4 text-nexora-cyan" />
            <span>Download Brochure (PDF)</span>
          </button>
        </motion.div>

        {/* Event Metadata Grid (Quick-info strip) */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 pt-8 border-t border-slate-800/80"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {metadataItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="flex flex-col items-start text-left p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <Icon className={`w-4 h-4 ${item.color}`} />
                    <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                      {item.label}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-white leading-snug">
                    {item.value}
                  </div>
                  <div className="text-xs text-slate-400 font-mono mt-1">
                    {item.sub}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
