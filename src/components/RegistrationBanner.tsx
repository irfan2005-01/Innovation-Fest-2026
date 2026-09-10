import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Clock, Users } from 'lucide-react';

interface RegistrationBannerProps {
  onOpenRegister: () => void;
}

export const RegistrationBanner: React.FC<RegistrationBannerProps> = ({ onOpenRegister }) => {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden p-8 sm:p-12 md:p-16 border border-slate-700/80 bg-gradient-to-br from-obsidian-900 via-slate-900 to-obsidian-950 shadow-2xl">
          {/* Animated Background Mesh & Glows */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-cyan-500/20 via-violet-600/15 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-orange-500/15 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto text-center">
            {/* Urgent Alert Tag */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-xs font-mono text-nexora-orange mb-6 shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-nexora-orange animate-ping" />
              <span>REGISTRATION PORTAL CLOSING SOON // STRICT CAP AT 50 TEAMS</span>
            </motion.div>

            {/* Banner Big Headline */}
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black font-display text-white tracking-tight leading-tight mb-4">
              READY TO BUILD AT{' '}
              <span className="text-gradient-brand">INNOVATION FEST 2026?</span>
            </h2>

            {/* Date & Venue Strip */}
            <div className="text-base sm:text-lg font-mono text-slate-300 font-semibold mb-8">
              21–22 September 2026 // Central Computing Arena, LAEC Campus, Bidar
            </div>

            {/* Feature quick stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10 max-w-xl mx-auto text-xs font-mono text-slate-300">
              <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-850/60 border border-slate-700/60">
                <Clock className="w-4 h-4 text-nexora-cyan shrink-0" />
                <span>24 Hours Continuous</span>
              </div>
              <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-850/60 border border-slate-700/60">
                <Users className="w-4 h-4 text-nexora-violet shrink-0" />
                <span>Teams of 2–4 Builders</span>
              </div>
              <div className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-850/60 border border-slate-700/60">
                <Shield className="w-4 h-4 text-nexora-orange shrink-0" />
                <span>Zero Midway Eliminations</span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onOpenRegister}
                className="w-full sm:w-auto px-10 py-5 rounded-2xl font-mono text-sm sm:text-base font-bold text-slate-950 bg-brand-gradient hover:opacity-95 shadow-2xl shadow-cyan-500/30 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3 group"
              >
                <span>Register & Pay Online (Deadline: 18 Sep 2026)</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </button>
            </div>

            <p className="text-xs font-mono text-slate-400 mt-4">
              Official State-Level Celebration • ₹45,000+ Prize Pool • Certificates for all verified participants
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
