import React from 'react';
import { motion } from 'framer-motion';
import { Timer, ShieldCheck, Users, Rocket, Check, Sparkles } from 'lucide-react';
import { SectionHeading } from './ui/SectionHeading';
import { pillarsData } from '../data/pillarsData';

export const Pillars: React.FC = () => {
  const iconMap: Record<string, React.ElementType> = {
    Timer,
    ShieldCheck,
    Users,
    Rocket,
  };

  return (
    <section id="about" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          number="01"
          badge="INNOVATION FRAMEWORK"
          title="Where Ideas Become"
          gradientTitle="Working Solutions"
          description="Engineered for builders who thrive under pressure. HACKORA redefines the hackathon experience with a participant-first architecture designed to maximize execution and minimize friction."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {pillarsData.map((pillar, index) => {
            const Icon = iconMap[pillar.iconName] || Sparkles;

            return (
              <motion.div
                key={pillar.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative rounded-2xl bg-gradient-to-br from-slate-900/70 to-obsidian-900/90 border border-slate-800/90 p-7 sm:p-8 backdrop-blur-md hover:border-slate-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                {/* Ambient hover gradient glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-violet-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                <div className="relative">
                  {/* Top Bar: Number & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <span className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-nexora-cyan group-hover:border-nexora-cyan/50 group-hover:shadow-neon-cyan transition-all">
                        <Icon className="w-6 h-6" />
                      </span>
                      <span className="text-2xl font-black font-mono text-slate-600 group-hover:text-slate-400 transition-colors">
                        #{pillar.number}
                      </span>
                    </div>

                    <span className="px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700/80 text-[11px] font-mono text-nexora-cyan">
                      {pillar.stats}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <div className="mb-3">
                    <span className="text-xs font-mono text-nexora-violet font-semibold uppercase tracking-wider block mb-1">
                      {pillar.tagline}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold font-display text-white group-hover:text-slate-100 transition-colors">
                      {pillar.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-400 leading-relaxed font-sans mb-6">
                    {pillar.description}
                  </p>

                  {/* Bottom indicator */}
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-500 group-hover:text-nexora-cyan transition-colors">
                    <Check className="w-4 h-4 text-nexora-cyan" />
                    <span>Active Protocol // Enforced at LAEC Arena</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

