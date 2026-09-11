import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Briefcase, Download, CheckCircle, Mail, Send } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SponsorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SponsorModal: React.FC<SponsorModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'inquiry' | 'deck'>('inquiry');
  const [submitted, setSubmitted] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [selectedTier, setSelectedTier] = useState('Platinum Partner');

  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.body.style.overflow;
      const prevTouchAction = document.body.style.touchAction;
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
      return () => {
        document.body.style.overflow = prevOverflow;
        document.body.style.touchAction = prevTouchAction;
      };
    }
  }, [isOpen]);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !contactEmail) return;
    setSubmitted(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#F97316', '#8B5CF6', '#00F2FE'],
    });
  };

  const handleDeckDownload = () => {
    const deckContent = `
================================================================================
               INNOVATION FEST 2026 // PARTNERSHIP PROPOSAL
        ENGINEERS' DAY CELEBRATIONS 2026 (21–22 SEPTEMBER 2026)
         Organized by Lingaraj Appa Engineering College (LAEC), Bidar
          Featuring HACKORA 2026, IDEATHON 2026 & PROJECT EXPO 2026
================================================================================

AUDIENCE & REACH:
- 500+ Student Engineers, Innovators & Builders across Karnataka & VTU
- Over 2,000+ Campus Footfall & Regional Tech Community Attention
- Dedicated Social Media Reach across LinkedIn, Instagram, and VTU Hubs

PARTNERSHIP TIERS:
1. PLATINUM PARTNER (Title Tech Partner) - ₹75,000 / In-kind Equivalent
   - Arena Mainstage Naming Rights
   - Logo on all VTU Certificates & Winner Trophies
   - Keynote Speaker Slot at Inauguration (15 Mins)
   - Exclusive On-Campus Recruitment & Technical Booth
   - Complete Opt-in Resume Directory of all Participants

2. GOLD PARTNER (Front-End / Domain Partner) - ₹35,000 / In-kind Equivalent
   - Track Naming Rights (e.g. AI Track powered by [Your Brand])
   - Dedicated Jury Evaluation Seat
   - Logo in Official Poster, Website, and T-Shirts
   - Promotional Swag Distribution in Participant Kits

3. SILVER & COMMUNITY PARTNERS - ₹15,000 / Refreshments & In-Kind
   - Website Logo placement
   - Acknowledgement in Valedictory Ceremony
   - Social Media Shoutouts

CONTACT FOR CUSTOM PACKAGES:
- Organizing Secretariat: Lingaraj Appa Engineering College (LAEC), Bidar
- Email: laecplacement@laec.edu.in | WhatsApp: +91 82966 12843
- Helpline Desk: +91 7019301927
================================================================================
    `;
    const blob = new Blob([deckContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'INNOVATION_FEST_2026_Sponsorship_Deck.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto overflow-x-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden rounded-2xl bg-obsidian-900 border border-slate-700/80 p-4 sm:p-6 md:p-8 shadow-2xl text-slate-100"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <span className="p-2.5 rounded-xl bg-gradient-to-br from-orange-500/20 to-cyan-500/20 border border-orange-500/40 text-orange-400">
              <Briefcase className="w-6 h-6" />
            </span>
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                Corporate Partnerships & Brand Alliances
              </span>
              <h3 className="text-2xl font-bold font-display text-white">
                Partner with Innovation Fest 2026
              </h3>
            </div>
          </div>

          {/* Tab Selector */}
          <div className="flex border-b border-slate-800 mb-6 font-mono text-xs">
            <button
              onClick={() => setActiveTab('inquiry')}
              className={`pb-3 px-4 font-semibold border-b-2 transition-colors ${
                activeTab === 'inquiry'
                  ? 'border-nexora-cyan text-nexora-cyan'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Direct Partnership Inquiry
            </button>
            <button
              onClick={() => setActiveTab('deck')}
              className={`pb-3 px-4 font-semibold border-b-2 transition-colors ${
                activeTab === 'deck'
                  ? 'border-nexora-cyan text-nexora-cyan'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Download Sponsorship Deck
            </button>
          </div>

          {activeTab === 'inquiry' ? (
            !submitted ? (
              <form onSubmit={handleInquirySubmit} className="space-y-4">
                <p className="text-sm text-slate-300 leading-relaxed">
                  Put your brand and engineering tools directly in the hands of 200+ top engineering builders. Fill in your details below and our sponsorship committee will connect within 24 hours.
                </p>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Company / Organization Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. CloudTech Solutions"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-nexora-orange"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="sponsor@company.com"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-nexora-orange"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Target Partnership Tier
                    </label>
                    <select
                      value={selectedTier}
                      onChange={(e) => setSelectedTier(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-sm text-white focus:outline-none focus:border-nexora-orange"
                    >
                      <option>Platinum Partner (Full Stack)</option>
                      <option>Gold Partner (Domain / Track)</option>
                      <option>Silver / Community Supporter</option>
                      <option>In-Kind (Cloud / APIs / Swag / Food)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-slate-900 bg-brand-gradient hover:opacity-95 shadow-md shadow-orange-500/20 transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Sponsorship Inquiry</span>
                  </button>
                </div>

                <div className="text-center pt-2">
                  <span className="text-xs text-slate-400">
                    Prefer direct email? Reach out at{' '}
                    <a
                      href="mailto:laecplacement@laec.edu.in"
                      className="text-cyan-400 hover:underline font-mono"
                    >
                      laecplacement@laec.edu.in
                    </a>
                  </span>
                </div>
              </form>
            ) : (
              <div className="text-center py-6">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-7 h-7" />
                </div>
                <h4 className="text-xl font-bold font-display text-white mb-2">
                  Inquiry Received from {companyName}!
                </h4>
                <p className="text-sm text-slate-300 max-w-md mx-auto mb-6">
                  Thank you for your interest in empowering Karnataka's future engineers. Our faculty sponsorship convener will contact you at <span className="font-mono text-white">{contactEmail}</span> with the customized deck and booth availability.
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-semibold border border-slate-600 transition-colors"
                >
                  Close
                </button>
              </div>
            )
          ) : (
            <div className="space-y-5">
              <p className="text-sm text-slate-300 leading-relaxed">
                Download the official Innovation Fest 2026 Sponsorship Proposal containing stage branding packages, flagship tracks (Hackora, Ideathon, Project Expo), talent acquisition rights, and media metrics.
              </p>

              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-2 text-xs font-mono text-slate-300">
                <div className="text-cyan-400 font-bold">• Platinum Tier: Keynote, Trophy Brand, 500+ Resume Directory</div>
                <div className="text-violet-400 font-bold">• Gold Tier: Track naming, jury seat, exhibition booth</div>
                <div className="text-orange-400 font-bold">• Silver Tier: Digital presence, poster branding, swag inclusion</div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                  <Mail className="w-4 h-4 text-cyan-400" />
                  <span>laecplacement@laec.edu.in</span>
                </div>
                <button
                  onClick={handleDeckDownload}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-slate-900 bg-brand-gradient hover:opacity-95 shadow-md shadow-cyan-500/20 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Deck</span>
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

