import React from 'react';
import { motion } from 'framer-motion';
import {
  Utensils,
  Wifi,
  Zap,
  Moon,
  ShieldCheck,
  HeartPulse,
  Check,
  ArrowRight,
  Sparkles,
  Presentation,
  Laptop,
  FileText,
} from 'lucide-react';
import { SectionHeading } from '../components/ui/SectionHeading';
import { amenitiesData } from '../data/amenitiesData';
import { PageId } from '../types';

interface HospitalityPageProps {
  onNavigate: (page: PageId) => void;
  onOpenRegister: () => void;
}

export const HospitalityPage: React.FC<HospitalityPageProps> = ({ onNavigate, onOpenRegister }) => {
  const iconMap: Record<string, React.ElementType> = {
    Utensils,
    Wifi,
    Zap,
    Moon,
    ShieldCheck,
    HeartPulse,
  };

  return (
    <div className="space-y-12 pb-16 pt-8 max-w-6xl mx-auto">
      {/* Section Heading */}
      <SectionHeading
        number="04"
        badge="EXHIBITION & CAMPUS AMENITIES"
        title="Physical Showcase &"
        gradientTitle="Builder Hospitality"
        description="On 22 September 2026, participants physically demonstrate their hardware prototypes and software deployments directly to jury panels at the LAEC Bidar campus exhibition arena."
      />

      {/* 1. In-Person Physical Showcase Highlight Box */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-gradient-to-br from-emerald-500/10 via-slate-900 to-obsidian-950 border-2 border-emerald-500/40 p-6 sm:p-8 backdrop-blur-xl shadow-2xl"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <Presentation className="w-3.5 h-3.5" />
              <span>OFFLINE PHYSICAL SHOWCASE PROTOCOL</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
              Project Exhibition & Offline Defense (22 Sep 2026)
            </h3>
            <p className="text-sm font-sans text-slate-300 mt-2 max-w-3xl leading-relaxed">
              To ensure 100% authenticity and interactive evaluation, there is strictly <strong>NO remote code upload or online judging</strong>. All builder squads physically exhibit their working hardware models, software deployments, and research solutions directly at the LAEC campus exhibition hall before industry juries.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-emerald-500/30 shrink-0 text-center">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Jury Evaluation</span>
            <span className="text-xl font-bold font-mono text-emerald-400">22 Sep • 2:00 PM</span>
            <span className="text-[11px] font-mono text-slate-400 block mt-0.5">LAEC Campus Arena</span>
          </div>
        </div>

        {/* 3 Physical Deliverables */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0 mt-0.5">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-display">Working Prototype / Device</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed font-sans">
                Laptops, IoT sensors, microcontrollers, and chargers ready for live interactive testing and scrutiny.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0 mt-0.5">
              <Presentation className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-display">Concise Slide Deck (PPT)</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed font-sans">
                Summary deck covering problem statement, system architecture, tech stack, and real-world viability.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0 mt-0.5">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-display">Documentation & College IDs</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed font-sans">
                Physical College ID cards or USN credentials for all team members and printed architecture summary.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. Participant Experience & Amenities Grid */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold mb-1">
            24-HOUR INFRASTRUCTURE
          </div>
          <h3 className="text-2xl font-bold font-display text-white">
            Built for Focused Engineering
          </h3>
          <p className="text-xs text-slate-400 font-mono mt-1">
            We ensure participants can dedicate 100% of their energy to learning, building, and collaborating.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {amenitiesData.map((amenity, index) => {
            const Icon = iconMap[amenity.iconName] || Sparkles;

            return (
              <motion.div
                key={amenity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.35 }}
                className="rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/95 to-obsidian-950 border border-slate-800/80 p-6 backdrop-blur-md hover:border-cyan-500/40 transition-all duration-300 hover:shadow-xl flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400/50 group-hover:shadow-neon-cyan transition-all">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-mono text-cyan-400 font-semibold">
                      {amenity.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold font-display text-white mb-2 group-hover:text-cyan-300 transition-colors">
                    {amenity.title}
                  </h3>

                  <p className="text-xs text-slate-400 font-sans leading-relaxed mb-4">
                    {amenity.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800 space-y-1.5">
                  {amenity.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                      <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={() => onNavigate('resources')}
          className="inline-flex items-center gap-2 text-sm font-mono text-cyan-400 hover:underline"
        >
          <span>Next: Explore Official Brochures & Posters</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenRegister}
          className="px-6 py-3 rounded-xl font-mono text-xs font-bold text-slate-950 bg-brand-gradient hover:opacity-95 shadow-md shadow-cyan-500/20 transition-all"
        >
          Register for Innovation Fest 2026
        </button>
      </div>
    </div>
  );
};
