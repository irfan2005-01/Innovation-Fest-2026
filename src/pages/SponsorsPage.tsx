import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Sparkles, ArrowRight, Download, Handshake, Award, Users } from 'lucide-react';
import { SectionHeading } from '../components/ui/SectionHeading';
import { PageId } from '../types';

interface SponsorsPageProps {
  onNavigate: (page: PageId) => void;
  onOpenSponsorModal: () => void;
  onOpenRegister: () => void;
}

export const SponsorsPage: React.FC<SponsorsPageProps> = ({
  onNavigate,
  onOpenSponsorModal,
  onOpenRegister,
}) => {
  return (
    <div className="space-y-16 pb-16 pt-8 max-w-6xl mx-auto">
      <SectionHeading
        number="05"
        badge="PARTNERS & SPONSORSHIPS"
        title="Empower the Next Generation of"
        gradientTitle="Engineering Innovators"
        description="Put your brand, development tools, and mentorship directly in front of 200+ top engineering builders, physical prototype creators, and software architects at LAEC Bidar."
      />

      {/* Call to Action Bar */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={onOpenSponsorModal}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-mono text-xs font-bold text-slate-950 bg-brand-gradient hover:opacity-95 shadow-lg shadow-cyan-500/20 transition-all transform hover:-translate-y-0.5"
        >
          <Handshake className="w-4 h-4" />
          <span>Partner With Us // Inquire Now</span>
        </button>

        <button
          onClick={onOpenSponsorModal}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-mono text-xs font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-colors"
        >
          <Download className="w-4 h-4 text-cyan-400" />
          <span>Download Sponsorship Proposal</span>
        </button>

        <a
          href="mailto:sponsors.hackora@laecbidar.ac.in"
          className="flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-mono text-slate-400 hover:text-cyan-300 transition-colors"
        >
          <Mail className="w-4 h-4 text-amber-400" />
          <span>sponsors.hackora@laecbidar.ac.in</span>
        </a>
      </div>

      {/* Sponsorship Opportunities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-7 rounded-3xl bg-slate-900/80 border border-cyan-500/30 backdrop-blur-md flex flex-col justify-between"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-mono mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>TITLE PARTNER</span>
            </div>
            <h3 className="text-xl font-bold font-display text-white mb-2">
              Festival Title Partnership
            </h3>
            <p className="text-slate-300 font-sans text-xs leading-relaxed mb-6">
              Premier branding across all offline stage banners, digital certificates, live hackathon livestream, and keynotes. Includes opening ceremony address and exclusive talent access.
            </p>
          </div>
          <button
            onClick={onOpenSponsorModal}
            className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold transition-colors"
          >
            Explore Title Tier →
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="p-7 rounded-3xl bg-slate-900/80 border border-purple-500/30 backdrop-blur-md flex flex-col justify-between"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30 text-xs font-mono mb-4">
              <Award className="w-3.5 h-3.5" />
              <span>TRACK SPONSOR</span>
            </div>
            <h3 className="text-xl font-bold font-display text-white mb-2">
              Domain / Problem Track
            </h3>
            <p className="text-slate-300 font-sans text-xs leading-relaxed mb-6">
              Sponsor specific tracks (Agentic AI, Cybersecurity, AgriTech, Clean Energy). Provide proprietary APIs or challenge statements with dedicated prizes for the winning team.
            </p>
          </div>
          <button
            onClick={onOpenSponsorModal}
            className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-purple-500/40 text-purple-300 font-mono text-xs font-bold transition-colors"
          >
            Sponsor a Track →
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="p-7 rounded-3xl bg-slate-900/80 border border-emerald-500/30 backdrop-blur-md flex flex-col justify-between"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-mono mb-4">
              <Users className="w-3.5 h-3.5" />
              <span>COMMUNITY PARTNER</span>
            </div>
            <h3 className="text-xl font-bold font-display text-white mb-2">
              Ecosystem & Tech Partner
            </h3>
            <p className="text-slate-300 font-sans text-xs leading-relaxed mb-6">
              Provide cloud credits, developer tools, hardware kits, or participant swag. Ideal for tech communities, developer tooling startups, and local innovation hubs.
            </p>
          </div>
          <button
            onClick={onOpenSponsorModal}
            className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold transition-colors"
          >
            Partner as Ecosystem →
          </button>
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

