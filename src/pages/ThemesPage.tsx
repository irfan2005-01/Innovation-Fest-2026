import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { SectionHeading } from '../components/ui/SectionHeading';
import { officialThemes } from '../data/themesData';
import { PageId } from '../types';

interface ThemesPageProps {
  onNavigate: (page: PageId) => void;
  onOpenRegister: () => void;
}

export const ThemesPage: React.FC<ThemesPageProps> = ({ onNavigate, onOpenRegister }) => {
  return (
    <div className="space-y-12 pb-16 pt-8 max-w-6xl mx-auto">
      {/* Section Heading */}
      <SectionHeading
        number="02"
        badge="CHALLENGE HORIZONS // SIX OFFICIAL THEMES"
        title="Six Official"
        gradientTitle="Innovation Themes"
        description="Choose your engineering challenge track. Every participating team in HACKORA 2026 selects one theme to architect, code, test, and physically exhibit at the LAEC Bidar campus."
      />

      {/* Fair Ground / Live Problem Release Protocol */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5 rounded-2xl bg-gradient-to-r from-slate-900/90 via-obsidian-900 to-slate-900/90 border border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 backdrop-blur-md"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              100% Fair Ground Protocol // On-Campus Physical Evaluation
            </div>
            <p className="text-xs text-slate-300">
              Teams build solutions under one of the 6 official themes. Working prototypes and PPTs are evaluated in-person on 22 September 2026 at LAEC Bidar.
            </p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-slate-800 text-xs font-mono text-cyan-400 border border-slate-700 shrink-0">
          Open Innovation Supported
        </span>
      </motion.div>

      {/* Six Themes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {officialThemes.map((theme, index) => (
          <motion.div
            key={theme.id}
            id={theme.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.35 }}
            className={`rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-900/95 to-obsidian-950 border-2 ${theme.color} p-6 sm:p-7 backdrop-blur-xl transition-all duration-300 hover:shadow-xl flex flex-col justify-between group`}
          >
            <div>
              {/* Header with Theme Banner Image & Tagline */}
              <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start mb-5">
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shrink-0 border border-slate-700/80 shadow-lg bg-slate-950">
                  <img
                    src={theme.image}
                    alt={theme.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent pointer-events-none" />
                </div>

                <div className="text-center sm:text-left flex-1 min-w-0">
                  <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-slate-400 block mb-1">
                    {theme.tagline}
                  </span>
                  <h3 className="text-xl font-bold font-display text-white group-hover:text-cyan-300 transition-colors leading-tight">
                    {theme.title}
                  </h3>
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-slate-800 border border-slate-700 text-slate-300">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    <span>Theme #{index + 1}</span>
                  </div>
                </div>
              </div>

              {/* Theme Description */}
              <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed mb-6">
                {theme.description}
              </p>

              {/* Subtracks / Problem Domains */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2 mb-6">
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2 font-semibold">
                  Focus Subtracks & Scopes:
                </div>
                {theme.subtracks.map((sub, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-300 font-sans">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{sub}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Select this Theme Action */}
            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400">
                Eligible for Hackora & Project Expo
              </span>
              <button
                onClick={onOpenRegister}
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 hover:underline"
              >
                <span>Select this Theme</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Action Footer */}
      <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={() => onNavigate('schedule')}
          className="inline-flex items-center gap-2 text-sm font-mono text-cyan-400 hover:underline"
        >
          <span>Next: View 24-Hour Schedule & Checkpoints</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenRegister}
          className="px-6 py-3 rounded-xl font-mono text-xs font-bold text-slate-950 bg-brand-gradient hover:opacity-95 shadow-md shadow-cyan-500/20 transition-all"
        >
          Register for HACKORA 2026
        </button>
      </div>
    </div>
  );
};

export const TracksPage = ThemesPage;

