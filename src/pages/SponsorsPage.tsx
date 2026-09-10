import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { SectionHeading } from '../components/ui/SectionHeading';
import { titleSponsor } from '../data/sponsorsData';
import { PageId } from '../types';

interface SponsorsPageProps {
  onNavigate: (page: PageId) => void;
  onOpenSponsorModal: () => void;
  onOpenRegister: () => void;
}

export const SponsorsPage: React.FC<SponsorsPageProps> = ({
  onNavigate,
  onOpenRegister,
}) => {
  return (
    <div className="space-y-16 pb-16 pt-8 max-w-6xl mx-auto">
      <SectionHeading
        number="05"
        badge="OFFICIAL TITLE SPONSOR"
        title="Presented in Partnership With"
        gradientTitle="Rotary Silver Club"
        description="Innovation Fest 2026 is proud to be presented by Rotary Silver Club — championing young engineers, technological empowerment, and impactful community leadership."
      />

      {/* Featured Title Sponsor Banner Display */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative group rounded-3xl p-1 bg-gradient-to-r from-cyan-500/50 via-blue-500/50 to-amber-500/50 hover:from-cyan-400 hover:via-blue-400 hover:to-amber-400 shadow-2xl shadow-cyan-500/20 transition-all duration-500"
      >
        <div className="rounded-[22px] overflow-hidden bg-slate-950/95 backdrop-blur-xl border border-white/15">
          <img
            src={titleSponsor.bannerImage}
            alt="Rotary Silver Club - Official Title Sponsor"
            className="w-full h-auto object-contain select-none"
          />
        </div>
      </motion.div>

      {/* Rotary Silver Club Profile & Mission */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-md flex flex-col justify-between"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-mono mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>PEOPLE OF ACTION</span>
            </div>
            <h3 className="text-2xl font-bold font-display text-white mb-2">
              Service Above Self
            </h3>
            <p className="text-slate-300 font-sans text-sm leading-relaxed mb-6">
              Rotary Silver Club is committed to humanitarian service, fostering high ethical standards in all vocations, and building goodwill and peace worldwide. In collaboration with Lingaraj Appa Engineering College, Bidar, Rotary Silver Club is empowering student engineers to turn visionary ideas into transformative solutions.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono pt-4 border-t border-slate-800">
            {titleSponsor.corePillars.map((pillar) => (
              <div key={pillar} className="flex items-center gap-2 text-slate-200">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>{pillar}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-md flex flex-col justify-between"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-mono mb-4">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>INNOVATION & IMPACT</span>
            </div>
            <h3 className="text-2xl font-bold font-display text-white mb-2">
              Ideas • Innovation • Impact
            </h3>
            <p className="text-slate-300 font-sans text-sm leading-relaxed mb-6">
              Providing platform resources, merit awards, and technological support for over 200+ engineering students competing in HACKORA (24H Hackathon), IDEATHON, and PROJECT EXPO on Engineers' Day Celebrations 2026.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-800">
            <button
              onClick={onOpenRegister}
              className="px-5 py-2.5 rounded-xl font-mono text-xs font-bold text-slate-950 bg-brand-gradient hover:opacity-95 shadow-md shadow-cyan-500/20 transition-all"
            >
              Register for Fest
            </button>
            <a
              href="mailto:sponsors.hackora@laecbidar.ac.in"
              className="px-5 py-2.5 rounded-xl font-mono text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors flex items-center gap-2"
            >
              <Mail className="w-3.5 h-3.5 text-cyan-400" />
              <span>Contact Secretariat</span>
            </a>
          </div>
        </motion.div>
      </div>

      {/* Action Footer */}
      <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={() => onNavigate('faq')}
          className="inline-flex items-center gap-2 text-sm font-mono text-cyan-400 hover:underline"
        >
          <span>Next: Rules, Eligibility & FAQs</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenRegister}
          className="px-6 py-3 rounded-xl font-mono text-xs font-bold text-slate-950 bg-brand-gradient hover:opacity-95 shadow-md shadow-cyan-500/20 transition-all"
        >
          Register for INNOVATION FEST 2026
        </button>
      </div>
    </div>
  );
};

