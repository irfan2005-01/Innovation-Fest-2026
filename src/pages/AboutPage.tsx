import React from 'react';
import { motion } from 'framer-motion';
import { Timer, ShieldCheck, Users, Rocket, Check, ArrowRight, Building2 } from 'lucide-react';
import { SectionHeading } from '../components/ui/SectionHeading';
import { pillarsData } from '../data/pillarsData';
import { PageId } from '../types';

interface AboutPageProps {
  onNavigate: (page: PageId) => void;
  onOpenRegister: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate, onOpenRegister }) => {
  const iconMap: Record<string, React.ElementType> = {
    Timer,
    ShieldCheck,
    Users,
    Rocket,
  };

  return (
    <div className="space-y-16 pb-16 pt-8 max-w-6xl mx-auto">
      {/* Page Header */}
      <SectionHeading
        number="01"
        badge="INNOVATION FRAMEWORK"
        title="Where Ideas Become"
        gradientTitle="Working Solutions"
        description="Organized by Lingaraj Appa Engineering College (LAEC), Bidar on the occasion of Engineers' Day 2026, HACKORA brings together 200+ passionate engineers to code, innovate, and transform."
      />

      {/* Institutional Context Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-6 sm:p-8 bg-slate-900/60 border border-slate-800 backdrop-blur-md"
      >
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-nexora-cyan shrink-0">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs font-mono text-nexora-cyan uppercase tracking-wider">
              Host Institution // Lingaraj Appa Engineering College (LAEC)
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-display text-white mt-1 mb-2">
              Empowering Karnataka's Engineering Vanguard
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              Located in the historic city of Bidar, LAEC is affiliated to Visvesvaraya Technological University (VTU) and recognized by AICTE. On the occasion of Engineers' Day Celebrations 2026 commemorating Bharat Ratna Sir M. Visvesvaraya, LAEC hosts <strong>HACKORA 2026</strong> — an uncompromising 24-hour sprint engineered to cultivate grassroots innovation, production craftsmanship, and architectural rigor.
            </p>
          </div>
        </div>
      </motion.div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pillarsData.map((pillar, index) => {
          const Icon = iconMap[pillar.iconName] || Rocket;

          return (
            <motion.div
              key={pillar.number}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="group rounded-2xl bg-slate-900/60 border border-slate-800/80 p-7 backdrop-blur-md hover:border-slate-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-nexora-cyan group-hover:border-cyan-400/60 group-hover:shadow-neon-cyan transition-all">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-black font-mono text-slate-600">
                    #{pillar.number}
                  </span>
                </div>

                <div className="text-xs font-mono text-nexora-violet font-semibold uppercase tracking-wider mb-1">
                  {pillar.tagline}
                </div>
                <h3 className="text-xl font-bold font-display text-white mb-3">
                  {pillar.title}
                </h3>

                <p className="text-sm text-slate-400 leading-relaxed font-sans mb-6">
                  {pillar.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">{pillar.stats}</span>
                <span className="flex items-center gap-1 text-nexora-cyan">
                  <Check className="w-3.5 h-3.5" />
                  <span>Guaranteed</span>
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Action Footer */}
      <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={() => onNavigate('schedule')}
          className="inline-flex items-center gap-2 text-sm font-mono text-nexora-cyan hover:underline"
        >
          <span>Next: Explore 24-Hour Schedule</span>
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

