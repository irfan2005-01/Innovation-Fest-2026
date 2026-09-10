import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  Mail,
  Phone,
  MessageCircle,
  Instagram,
  GraduationCap,
  Users,
  UserRound,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { SectionHeading } from '../components/ui/SectionHeading';
import { faqData } from '../data/faqData';
import { PageId } from '../types';

interface FAQPageProps {
  onNavigate: (page: PageId) => void;
  onOpenRegister: () => void;
}

export const FAQPage: React.FC<FAQPageProps> = ({ onNavigate, onOpenRegister }) => {
  const [openId, setOpenId] = useState<string | null>('faq-1');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Rules', 'Judging', 'Logistics', 'General'];

  const filteredFaqs = faqData.filter((item) => {
    if (selectedCategory === 'All') return true;
    return item.category === selectedCategory;
  });

  const toggleAccordion = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const committeeMembers = [
    {
      id: 'faculty',
      title: 'Faculty Coordinators',
      desc: 'Guiding academic standards, VTU accreditation protocols, and overarching institutional governance.',
      icon: GraduationCap,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/30',
    },
    {
      id: 'organizing',
      title: 'Organizing Committee',
      desc: 'Managing team registrations, campus hospitality, logistics, awards, and event operations.',
      icon: Users,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/30',
    },
    {
      id: 'student',
      title: 'Student Coordinators',
      desc: 'Active student builders and volunteers assisting participants with on-campus check-in and support.',
      icon: UserRound,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/30',
    },
    {
      id: 'technical',
      title: 'Technical & Jury Panel',
      desc: 'External industry specialists and researchers evaluating technical architecture, innovation, and pitch execution.',
      icon: ShieldCheck,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/30',
    },
  ];

  return (
    <div className="space-y-16 pb-16 pt-8 max-w-5xl mx-auto">
      {/* Section Heading */}
      <SectionHeading
        number="06"
        badge="KNOWLEDGE DESK & EVENT GUIDELINES"
        title="Rules, Questions &"
        gradientTitle="Organizing Committee"
        description="Find comprehensive details regarding event eligibility, mandatory offline physical showcase rules, team size guidelines, and direct contact channels for LAEC Bidar."
      />

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full font-mono text-xs font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-cyan-500/20 to-violet-500/20 text-cyan-400 border border-cyan-500/50 shadow-sm'
                : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Accordion FAQ List */}
      <div className="space-y-3.5">
        {filteredFaqs.map((faq) => {
          const isOpen = openId === faq.id;

          return (
            <motion.div
              key={faq.id}
              className={`rounded-2xl border transition-colors duration-200 overflow-hidden ${
                isOpen
                  ? 'bg-slate-900/90 border-cyan-500/40 shadow-lg'
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleAccordion(faq.id)}
                aria-expanded={isOpen}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      isOpen ? 'bg-cyan-400' : 'bg-slate-600'
                    }`}
                  />
                  <span className="text-base sm:text-lg font-bold font-display text-white">
                    {faq.question}
                  </span>
                </div>

                <div
                  className={`p-1.5 rounded-lg bg-slate-800 text-slate-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-cyan-400 bg-slate-700' : ''
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-5 pb-6 sm:px-6 pt-1 text-sm text-slate-300 font-sans leading-relaxed border-t border-slate-800/80">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Organizing Committee Section */}
      <div className="pt-8 border-t border-slate-800">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-mono text-purple-400 uppercase tracking-widest font-bold block mb-1">
            BEHIND THE FEST
          </span>
          <h3 className="text-2xl font-bold font-display text-white">
            Organizing Committee & Patrons
          </h3>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Dedicated leadership ensuring an exceptional experience for every builder
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {committeeMembers.map((member) => {
            const Icon = member.icon;
            return (
              <div
                key={member.id}
                className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/90 to-obsidian-950 border border-slate-800 hover:border-slate-700 text-center flex flex-col justify-between transition-all group"
              >
                <div>
                  <div
                    className={`mx-auto w-12 h-12 rounded-2xl border flex items-center justify-center mb-4 ${member.bg}`}
                  >
                    <Icon className={`w-6 h-6 ${member.color} group-hover:scale-110 transition-transform`} />
                  </div>
                  <h4 className="text-sm font-bold text-white font-display mb-2">{member.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">{member.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Official Help Desks & Contact Strip */}
      <div className="rounded-2xl p-6 sm:p-8 bg-slate-900/80 border border-slate-800 backdrop-blur-md">
        <div className="text-center max-w-xl mx-auto mb-6">
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold block mb-1">
            GET IN TOUCH
          </span>
          <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
            Official Inquiry & Support Desks
          </h3>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Reach out directly for team verification, event queries, or travel logistics
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href="mailto:laecplacement@laec.edu.in"
            className="flex items-center gap-3 p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/50 transition-colors"
          >
            <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Official Email</span>
              <span className="text-xs font-semibold text-slate-200 truncate block">
                laecplacement@laec.edu.in
              </span>
            </div>
          </a>

          <a
            href="tel:+917019301927"
            className="flex items-center gap-3 p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-purple-500/50 transition-colors"
          >
            <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400 shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Contact Helpline</span>
              <span className="text-xs font-semibold text-slate-200 truncate block">
                +91 7019301927
              </span>
            </div>
          </a>

          <a
            href="https://wa.me/918296612843"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-emerald-500/50 transition-colors"
          >
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">WhatsApp Desk</span>
              <span className="text-xs font-semibold text-slate-200 truncate block">
                8296612843
              </span>
            </div>
          </a>

          <a
            href="https://instagram.com/HACKORA_2K26"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-pink-500/50 transition-colors"
          >
            <div className="p-2.5 rounded-lg bg-pink-500/10 text-pink-400 shrink-0">
              <Instagram className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Official Instagram</span>
              <span className="text-xs font-semibold text-slate-200 truncate block">
                @HACKORA_2K26
              </span>
            </div>
          </a>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={() => onNavigate('sponsors')}
          className="inline-flex items-center gap-2 text-sm font-mono text-cyan-400 hover:underline"
        >
          <span>Next: Explore Partners & Sponsors</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenRegister}
          className="px-6 py-3 rounded-xl font-mono text-xs font-bold text-slate-950 bg-brand-gradient hover:opacity-95 shadow-md shadow-cyan-500/20 transition-all"
        >
          Register for HACKORA 2026
        </button>
      </div>
    </div>
  );
};
