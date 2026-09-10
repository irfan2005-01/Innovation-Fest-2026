import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Layers, Activity, Shield, Sparkles, AlertCircle } from 'lucide-react';
import { SectionHeading } from './ui/SectionHeading';
import { tracksData } from '../data/tracksData';

export const Tracks: React.FC = () => {
  const iconMap: Record<string, React.ElementType> = {
    Cpu,
    Layers,
    Activity,
    Shield,
  };

  return (
    <section id="tracks" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="CHALLENGE HORIZONS"
          title="Thematic Focus"
          gradientTitle="Engineering Domains"
          description="While specific problem statements are released live at 11:00 AM on 21 September, challenges will center around 4 core technological pillars designed to solve critical real-world friction."
        />

        {/* Live Reveal Banner Notice */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 via-violet-950/40 to-slate-900 border border-slate-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-nexora-orange/20 text-nexora-orange">
              <AlertCircle className="w-5 h-5" />
            </span>
            <div>
              <div className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Fair-Play Protocol // Zero Pre-Cooked Code
              </div>
              <p className="text-xs text-slate-300">
                Detailed challenge briefs with dataset access will be published on arena screens at 11:00 AM sharp.
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-slate-800 text-xs font-mono text-nexora-cyan border border-slate-700 shrink-0">
            Open Innovation Track Also Supported
          </span>
        </motion.div>

        {/* Tracks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {tracksData.map((track, index) => {
            const Icon = iconMap[track.iconName] || Sparkles;

            return (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group rounded-2xl bg-slate-900/60 border border-slate-800/80 p-7 hover:border-slate-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 backdrop-blur-md relative overflow-hidden"
              >
                {/* Accent corner line */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-cyan-500/10 via-transparent to-transparent pointer-events-none" />

                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-nexora-cyan group-hover:border-nexora-cyan/50 group-hover:shadow-neon-cyan transition-all">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-[11px] font-mono text-slate-300">
                    {track.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold font-display text-white mb-1 group-hover:text-nexora-cyan transition-colors">
                  {track.title}
                </h3>
                <div className="text-xs font-mono text-nexora-violet mb-3 font-semibold">
                  {track.subtitle}
                </div>

                <p className="text-sm text-slate-300 leading-relaxed mb-6 font-sans">
                  {track.description}
                </p>

                {/* Example scope bullet points */}
                <div className="pt-4 border-t border-slate-800/80 space-y-1.5">
                  <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2">
                    Scope Inspirations:
                  </div>
                  {track.problemExamples.map((ex, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-nexora-cyan"></span>
                      <span>{ex}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
