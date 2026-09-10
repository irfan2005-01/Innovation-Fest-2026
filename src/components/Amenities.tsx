import React from 'react';
import { motion } from 'framer-motion';
import { Utensils, Wifi, Zap, Moon, ShieldCheck, HeartPulse, Check, Sparkles } from 'lucide-react';
import { SectionHeading } from './ui/SectionHeading';
import { amenitiesData } from '../data/amenitiesData';

export const Amenities: React.FC = () => {
  const iconMap: Record<string, React.ElementType> = {
    Utensils,
    Wifi,
    Zap,
    Moon,
    ShieldCheck,
    HeartPulse,
  };

  return (
    <section id="amenities" className="py-20 md:py-28 relative bg-obsidian-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          number="03"
          badge="HOSPITALITY & INFRASTRUCTURE"
          title="Engineered Exclusively for"
          gradientTitle="Continuous High Focus"
          description="A 24-hour sprint demands world-class operational backing. LAEC Bidar provides every essential amenity so your team can dedicate 100% of your cognitive bandwidth to shipping code."
        />

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {amenitiesData.map((amenity, index) => {
            const Icon = iconMap[amenity.iconName] || Sparkles;

            return (
              <motion.div
                key={amenity.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group rounded-2xl bg-gradient-to-b from-slate-900/70 to-obsidian-950/80 border border-slate-800/80 p-6 sm:p-7 backdrop-blur-md hover:border-slate-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  {/* Top Row: Icon & Badge */}
                  <div className="flex items-start justify-between gap-3 mb-5">
                    <div className="w-12 h-12 rounded-xl bg-slate-800/90 border border-slate-700/80 flex items-center justify-center text-nexora-cyan group-hover:border-nexora-cyan/50 group-hover:shadow-neon-cyan transition-all">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-slate-800/90 border border-slate-700/80 text-[11px] font-mono text-nexora-orange">
                      {amenity.badge}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold font-display text-white mb-2.5 group-hover:text-nexora-cyan transition-colors">
                    {amenity.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-400 font-sans leading-relaxed mb-5">
                    {amenity.description}
                  </p>
                </div>

                {/* Features Checklist */}
                <div className="pt-4 border-t border-slate-800/80 space-y-2">
                  {amenity.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                      <Check className="w-3.5 h-3.5 text-nexora-cyan shrink-0 mt-0.5" />
                      <span>{feat}</span>
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

