import React from 'react';
import { MapPin, Globe, ArrowUp, Mail, Phone, MessageCircle, Instagram, FileText } from 'lucide-react';
import { RotatingO } from './HackoraLogo';
import { PageId } from '../types';

interface FooterProps {
  onNavigate: (page: PageId) => void;
  onOpenBrochure: () => void;
  onOpenRegister: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenBrochure,
  onOpenRegister,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/75 backdrop-blur-xl pt-12 pb-10 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-10 border-b border-slate-800/80">
          {/* Left Column: Institutional Branding (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <RotatingO size="md" />
              <div>
                <span className="text-xl font-black font-display text-white tracking-tight">
                  INNOVATION FEST 2026
                </span>
                <span className="block text-[11px] font-mono text-cyan-400 tracking-wider">
                  LAEC BIDAR // IDEAS TODAY. A BETTER TOMORROW.
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed font-sans max-w-lg">
              Presented by <strong>Lingaraj Appa Engineering College (LAEC)</strong>, Bidar on the occasion of Engineers' Day Celebrations 2026. Hosting <strong>HACKORA 2026</strong> (24-Hour National Hackathon), <strong>IDEATHON 2026</strong>, and <strong>PROJECT EXPO 2026</strong>.
            </p>

            <div className="text-xs font-mono text-slate-400 space-y-1.5 pt-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0" />
                <span>Central Computing Arena, LAEC Campus, Bidar - 585403, Karnataka</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-400 shrink-0" />
                <a
                  href="https://laecbidar.ac.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  laecbidar.ac.in (Affiliated to VTU Belagavi)
                </a>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={onOpenRegister}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-mono font-bold transition-all shadow-md shadow-cyan-500/20"
              >
                Register & Pay Online
              </button>
              <button
                onClick={onOpenBrochure}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-200 text-xs font-mono font-semibold transition-all flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                <span>Event Brochure</span>
              </button>
            </div>

            {/* Quick Page Links */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 pt-2 text-xs font-mono text-slate-400">
              <button
                onClick={() => onNavigate('home')}
                className="hover:text-cyan-400 transition-colors"
              >
                Fest Home
              </button>
              <span className="text-slate-700">•</span>
              <button
                onClick={() => onNavigate('events')}
                className="hover:text-cyan-400 transition-colors"
              >
                All Events
              </button>
              <span className="text-slate-700">•</span>
              <button
                onClick={() => onNavigate('schedule')}
                className="hover:text-cyan-400 transition-colors"
              >
                Schedule
              </button>
              <span className="text-slate-700">•</span>
              <button
                onClick={() => onNavigate('faq')}
                className="hover:text-cyan-400 transition-colors"
              >
                Rules & FAQ
              </button>
              <span className="text-slate-700">•</span>
              <button
                onClick={() => onNavigate('sponsors')}
                className="hover:text-cyan-400 transition-colors"
              >
                Title Sponsor
              </button>
            </div>
          </div>

          {/* Right Column: Contact Desks & Inquiries (6 cols) */}
          <div className="lg:col-span-6 space-y-3">
            <div className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-2">
              LAEC Placement & Event Secretariat Desks
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono text-cyan-400 font-semibold uppercase tracking-wider text-[11px]">
                  Official Event Support
                </span>
                <span className="text-[10px] font-mono text-slate-400">LAEC Placement Cell</span>
              </div>
              <div className="text-slate-200 font-bold text-sm">Innovation Fest 2026 Secretariat</div>
              <div className="text-slate-400">Lingaraj Appa Engineering College, Bidar</div>
              <div className="flex flex-wrap gap-4 pt-1 text-slate-300 font-mono text-xs">
                <a href="mailto:laecplacement@laec.edu.in" className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  <span>laecplacement@laec.edu.in</span>
                </a>
                <a href="tel:+917019301927" className="flex items-center gap-1.5 hover:text-purple-400 transition-colors">
                  <Phone className="w-3.5 h-3.5 text-purple-400" />
                  <span>+91 7019301927</span>
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href="https://wa.me/918296612843"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 transition-colors flex items-center gap-3"
              >
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase">WhatsApp Desk</div>
                  <div className="text-xs font-mono font-bold text-slate-200">8296612843</div>
                </div>
              </a>

              <a
                href="https://instagram.com/HACKORA_2K26"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-pink-500/50 transition-colors flex items-center gap-3"
              >
                <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400 shrink-0">
                  <Instagram className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Official Instagram</div>
                  <div className="text-xs font-mono font-bold text-slate-200">@HACKORA_2K26</div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Line Notice */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div className="text-center sm:text-left">
            © 2026 Lingaraj Appa Engineering College, Bidar. All rights reserved. <strong className="text-slate-400">#INNOVATIONFEST2026</strong>
            <div className="mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-x-2 gap-y-1 text-[11px]">
              <span className="text-slate-600">Contributors:</span>
              <a
                href="https://almas-portfolio.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-cyan-400 transition-colors"
              >
                Almas
              </a>
              <span className="text-slate-700">•</span>
              <a
                href="https://irfan2005portfolio.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-cyan-400 transition-colors"
              >
                Irfan
              </a>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <span className="text-slate-400">VTU Affiliated & AICTE Approved</span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-cyan-400 transition-colors"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
