import React from 'react';
import { motion } from 'framer-motion';
import { Download, Mail, Sparkles, Handshake } from 'lucide-react';
import { SectionHeading } from './ui/SectionHeading';
import { platinumPartners, goldPartners, silverAndCommunityPartners } from '../data/sponsorsData';

interface SponsorsProps {
  onOpenSponsorModal: () => void;
}

export const Sponsors: React.FC<SponsorsProps> = ({ onOpenSponsorModal }) => {
  return (
    <section id="sponsors" className="py-20 md:py-28 relative bg-obsidian-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          number="05"
          badge="PARTNERS & SUPPORTERS"
          title="Empowering the Next Generation of"
          gradientTitle="Student Builders"
          description="Interested in supporting 200+ engineers? Download our Sponsorship Proposal or reach out to our team to explore tailored engagement packages."
        />

        {/* Action Bar (Download Deck & Partner with us) */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
          <button
            onClick={onOpenSponsorModal}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-mono text-xs font-bold text-slate-950 bg-brand-gradient hover:opacity-95 shadow-md shadow-cyan-500/20 transition-all transform hover:-translate-y-0.5"
          >
            <Download className="w-4 h-4" />
            <span>Download Sponsorship Deck (PDF)</span>
          </button>

          <button
            onClick={onOpenSponsorModal}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-mono text-xs font-semibold text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 transition-colors"
          >
            <Handshake className="w-4 h-4 text-nexora-orange" />
            <span>Partner With Us // Inquire Now</span>
          </button>

          <a
            href="mailto:sponsors.hackora@laecbidar.ac.in"
            className="flex items-center gap-1.5 px-4 py-3 rounded-xl text-xs font-mono text-slate-400 hover:text-nexora-cyan transition-colors"
          >
            <Mail className="w-4 h-4" />
            <span>sponsors.hackora@laecbidar.ac.in</span>
          </a>
        </div>

        {/* TIER 1: Platinum Partners (Title Tech Partners) */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-nexora-cyan"></span>
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Title / Platinum Partners — Full Stack Ecosystem Leaders
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Stage presence, certificate logo, dedicated social reels
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {platinumPartners.map((p, idx) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="group relative rounded-2xl bg-gradient-to-br from-slate-900/80 via-slate-900/90 to-obsidian-950 border-2 border-cyan-500/30 p-8 text-center backdrop-blur-xl hover:border-cyan-400/60 transition-all duration-300 shadow-xl hover:shadow-neon-cyan"
              >
                {/* Micro badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[11px] font-mono text-nexora-cyan mb-4">
                  <Sparkles className="w-3 h-3" />
                  <span>{p.slotLabel}</span>
                </div>

                {/* Glass placeholder logo box */}
                <div className="h-28 rounded-xl bg-slate-950/60 border border-dashed border-slate-700/80 flex flex-col items-center justify-center my-4 group-hover:border-cyan-400/40 transition-colors">
                  <div className="text-xl sm:text-2xl font-black font-mono tracking-widest text-slate-200">
                    [ {p.name} ]
                  </div>
                  <div className="text-xs font-mono text-slate-400 mt-1">
                    {p.category}
                  </div>
                </div>

                <p className="text-xs font-mono text-slate-300 mt-4 leading-relaxed">
                  Key Deliverable: {p.perks}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* TIER 2: Gold Partners (Front-End & Domain Partners) */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-nexora-violet"></span>
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Gold Partners — Domain & Track Allies
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Poster branding, website display, promotional visibility
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {goldPartners.map((p, idx) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.08 }}
                className="group rounded-xl bg-slate-900/60 border border-slate-800/80 p-5 text-center hover:border-violet-500/50 transition-all duration-300 backdrop-blur-md"
              >
                <div className="text-[10px] font-mono text-nexora-violet uppercase tracking-wider mb-2">
                  {p.slotLabel}
                </div>

                <div className="h-20 rounded-lg bg-slate-950/70 border border-dashed border-slate-700/70 flex flex-col items-center justify-center my-2 group-hover:border-violet-400/40">
                  <div className="text-sm font-bold font-mono text-slate-200">
                    [ {p.name} ]
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {p.category}
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 mt-2 font-mono">
                  {p.perks}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* TIER 3: Silver & Community Supporters */}
        <div>
          <div className="flex items-center gap-2.5 mb-6 pb-2 border-b border-slate-800">
            <span className="w-2.5 h-2.5 rounded-full bg-nexora-orange"></span>
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Silver & Community Supporters
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {silverAndCommunityPartners.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/60 text-center hover:border-slate-700 transition-colors"
              >
                <div className="text-xs font-bold text-slate-200 font-mono">
                  {item.name}
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                  {item.role}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
