import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Award, Medal, Palette, Cpu, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import { SectionHeading } from './ui/SectionHeading';
import { podiumPrizes, specialCitations, universalPerks } from '../data/prizesData';

export const Prizes: React.FC = () => {
  const citationIcons: Record<string, React.ElementType> = {
    Palette,
    Cpu,
    Sparkles,
  };

  return (
    <section id="prizes" className="py-20 md:py-28 relative">
      {/* Glow Backdrop */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-amber-500/10 via-violet-500/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          number="04"
          badge="REWARDS & CITATIONS"
          title="Celebrate Excellence with"
          gradientTitle="₹1,00,000+ Prize Pool"
          description="Honoring top-tier engineering, product craftsmanship, and inclusive leadership with prestigious trophies, cash grants, and institutional citations."
        />

        {/* Podium Grid (3 Cards - Winner Center or 1st/2nd/3rd) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch mb-16">
          {podiumPrizes.map((prize) => {
            const isFirst = prize.rank === '01';

            return (
              <motion.div
                key={prize.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: isFirst ? 0.1 : 0.2 }}
                className={`relative rounded-2xl flex flex-col justify-between transition-all duration-300 p-7 sm:p-8 backdrop-blur-xl ${
                  isFirst
                    ? 'bg-gradient-to-b from-slate-900/90 via-slate-900/95 to-amber-950/20 border-2 border-amber-400/60 shadow-2xl shadow-amber-500/10 md:-translate-y-3'
                    : 'bg-slate-900/60 border border-slate-800/80 hover:border-slate-700'
                }`}
              >
                {/* Winner Top Highlight Tag */}
                {isFirst && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-amber-300 text-slate-950 text-xs font-mono font-extrabold uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 fill-slate-950" />
                    <span>GRAND CHAMPION</span>
                  </div>
                )}

                <div>
                  {/* Rank badge & Trophy icon */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl sm:text-4xl font-black font-mono text-slate-600">
                      #{prize.rank}
                    </span>
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        isFirst
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-lg shadow-amber-500/20'
                          : prize.rank === '02'
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                          : 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
                      }`}
                    >
                      <Trophy className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Title */}
                  <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
                    {prize.badgeText}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold font-display text-white mb-3">
                    {prize.title}
                  </h3>

                  {/* Cash Reward Amount */}
                  <div className="my-4 pb-4 border-b border-slate-800">
                    <span className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300">
                      {prize.amount}
                    </span>
                    <span className="text-xs font-mono text-slate-400 ml-2">
                      Direct Cash Grant
                    </span>
                  </div>

                  {/* Trophy Name */}
                  <div className="flex items-center gap-2 text-xs font-mono text-amber-300 mb-4">
                    <Medal className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{prize.trophy}</span>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6 font-sans">
                    {prize.description}
                  </p>
                </div>

                {/* Perks Checklist */}
                <div className="pt-4 border-t border-slate-800 space-y-2">
                  <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2">
                    Reward Package:
                  </div>
                  {prize.perks.map((perk, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-nexora-cyan shrink-0 mt-0.5" />
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Special Recognition Domain Citation Cards */}
        <div className="mb-14">
          <div className="text-center mb-8">
            <span className="text-xs font-mono text-nexora-violet uppercase tracking-wider font-semibold">
              Special Domain Citations
            </span>
            <h3 className="text-2xl font-bold font-display text-white mt-1">
              Category Excellence Honors
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {specialCitations.map((citation, index) => {
              const Icon = citationIcons[citation.iconName] || Award;

              return (
                <motion.div
                  key={citation.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="rounded-xl p-6 bg-slate-900/50 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-nexora-cyan">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-800 font-mono text-xs font-bold text-amber-300 border border-slate-700">
                        {citation.reward}
                      </span>
                    </div>

                    <h4 className="text-base sm:text-lg font-bold font-display text-white mb-2">
                      {citation.title}
                    </h4>

                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
                      {citation.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-500">
                    Official citation plaque + VTU honor certificate
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Universal Participation Certificate Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-obsidian-900 to-slate-900 border border-slate-700/80 backdrop-blur-md"
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-nexora-cyan shrink-0">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs font-mono text-nexora-cyan uppercase tracking-wider">
                  Universal Builder Credential
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-white mt-1">
                  Official VTU-Affiliated Participation Certificate
                </h3>
                <p className="text-sm text-slate-300 mt-1 max-w-2xl">
                  Every active participant who commits code and participates in the live demonstration rounds receives an official authenticated certificate issued by LAEC Bidar under Visvesvaraya Technological University (VTU) guidelines.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-slate-300 w-full lg:w-auto shrink-0">
              {universalPerks.map((perk, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/60 border border-slate-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-nexora-cyan shrink-0" />
                  <span className="truncate">{perk}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

