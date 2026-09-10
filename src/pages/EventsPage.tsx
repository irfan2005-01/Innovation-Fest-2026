import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Zap,
  Lightbulb,
  Box,
  Trophy,
  Users,
  Clock,
  IndianRupee,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Star,
  Cpu,
  FileCheck,
} from 'lucide-react';
import { SectionHeading } from '../components/ui/SectionHeading';
import { eventsData, consolidatedPrizes } from '../data/eventsData';
import { PageId } from '../types';

interface EventsPageProps {
  onNavigate: (page: PageId) => void;
  onOpenRegister: () => void;
}

export const EventsPage: React.FC<EventsPageProps> = ({ onNavigate, onOpenRegister }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'hackora' | 'ideathon' | 'expo'>('all');

  const filteredEvents =
    activeTab === 'all'
      ? eventsData
      : eventsData.filter((e) => e.id === activeTab);

  const getEventIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap':
        return <Zap className="w-6 h-6 text-cyan-400" />;
      case 'Lightbulb':
        return <Lightbulb className="w-6 h-6 text-purple-400" />;
      case 'Box':
        return <Box className="w-6 h-6 text-emerald-400" />;
      default:
        return <Sparkles className="w-6 h-6 text-cyan-400" />;
    }
  };

  const getColorClasses = (colorTheme: string) => {
    switch (colorTheme) {
      case 'cyan':
        return {
          border: 'border-cyan-500/40 hover:border-cyan-400',
          badgeBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
          gradientBg: 'from-cyan-500/10 via-slate-900 to-obsidian-950',
          accentText: 'text-cyan-400',
          btnBg: 'bg-cyan-500 text-slate-950 hover:bg-cyan-400',
        };
      case 'purple':
        return {
          border: 'border-purple-500/40 hover:border-purple-400',
          badgeBg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
          gradientBg: 'from-purple-500/10 via-slate-900 to-obsidian-950',
          accentText: 'text-purple-400',
          btnBg: 'bg-purple-500 text-white hover:bg-purple-400',
        };
      case 'emerald':
        return {
          border: 'border-emerald-500/40 hover:border-emerald-400',
          badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          gradientBg: 'from-emerald-500/10 via-slate-900 to-obsidian-950',
          accentText: 'text-emerald-400',
          btnBg: 'bg-emerald-500 text-slate-950 hover:bg-emerald-400',
        };
      default:
        return {
          border: 'border-slate-700 hover:border-cyan-400',
          badgeBg: 'bg-slate-800 text-slate-300 border-slate-700',
          gradientBg: 'from-slate-900 via-slate-900 to-obsidian-950',
          accentText: 'text-cyan-400',
          btnBg: 'bg-brand-gradient text-slate-950 hover:opacity-95',
        };
    }
  };

  return (
    <div className="space-y-12 pb-16 pt-8 max-w-6xl mx-auto">
      {/* Section Header */}
      <SectionHeading
        number="01"
        badge="INNOVATION FEST 2026 // THREE FLAGSHIP EVENTS"
        title="Choose Your Challenge"
        gradientTitle="Hack, Pitch or Exhibit"
        description="Organized by Lingaraj Appa Engineering College (LAEC), Bidar on the occasion of Engineers' Day Celebrations 2026. Pick from three distinct competition formats tailored to developers, ideators, and prototype makers."
      />

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-900/90 border border-slate-800">
          {[
            { id: 'all', label: 'All 3 Events' },
            { id: 'hackora', label: 'HACKORA (24H Hackathon)' },
            { id: 'ideathon', label: 'IDEATHON (Pitch)' },
            { id: 'expo', label: 'PROJECT EXPO (Exhibition)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg font-mono text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-nexora-cyan/20 to-nexora-violet/20 text-nexora-cyan border border-nexora-cyan/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>Offline On-Campus Defense: 22 Sep 2026 @ LAEC Bidar</span>
        </div>
      </div>

      {/* Events Cards */}
      <div className="space-y-8">
        {filteredEvents.map((event, index) => {
          const colors = getColorClasses(event.colorTheme);

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.35 }}
              className={`rounded-2xl bg-gradient-to-br ${colors.gradientBg} border-2 ${colors.border} p-6 sm:p-8 backdrop-blur-xl transition-all shadow-xl`}
            >
              {/* Card Header */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
                <div className="flex items-start gap-4">
                  <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 shrink-0">
                    {getEventIcon(event.iconName)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-mono font-bold uppercase tracking-wider ${colors.badgeBg}`}>
                        {event.accentBadge}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        {event.tagline}
                      </span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-white mt-1">
                      {event.name}
                    </h3>
                    <p className="text-sm font-sans text-slate-300 mt-1 max-w-2xl leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                </div>

                {/* Quick Meta Pills */}
                <div className="flex lg:flex-col items-center lg:items-end gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                      Prize Pool
                    </span>
                    <span className={`text-2xl font-black font-mono ${colors.accentText}`}>
                      {event.prizePool}
                    </span>
                  </div>
                  <button
                    onClick={onOpenRegister}
                    className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all shadow-md flex items-center gap-2 ${colors.btnBg}`}
                  >
                    <span>Register for {event.name.split(' ')[0]}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Event Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 mb-1">
                    <Users className="w-3.5 h-3.5 text-cyan-400" />
                    <span>TEAM SIZE</span>
                  </div>
                  <div className="text-sm font-bold text-white font-mono">{event.teamSize}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 mb-1">
                    <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
                    <span>REGISTRATION FEE</span>
                  </div>
                  <div className="text-sm font-bold text-white font-mono">{event.fee}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 mb-1">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    <span>1ST PRIZE</span>
                  </div>
                  <div className="text-sm font-bold text-white font-mono">{event.firstPrize}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 mb-1">
                    <Clock className="w-3.5 h-3.5 text-violet-400" />
                    <span>2ND PRIZE</span>
                  </div>
                  <div className="text-sm font-bold text-white font-mono">{event.secondPrize}</div>
                </div>
              </div>

              {/* Highlights & Rules 2-Column */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80">
                  <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Event Highlights & Benefits</span>
                  </h4>
                  <ul className="space-y-2">
                    {event.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-300 font-sans">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80">
                  <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
                    <span>Mandatory Guidelines & Rules</span>
                  </h4>
                  <ul className="space-y-2">
                    {event.rules.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-300 font-sans">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0 mt-1.5" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Special Recognitions & Consolidated Pool Summary */}
      <div className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-slate-900/90 via-obsidian-900 to-slate-900/90 border border-slate-700/80">
        <div className="text-center max-w-xl mx-auto mb-6">
          <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold mb-1">
            CONSOLIDATED EVENT PRIZE POOL
          </div>
          <h3 className="text-2xl font-bold font-display text-white">
            ₹45,000+ Total Cash Grants & Citations
          </h3>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Plus official VTU-affiliated Certificate of Participation for every verified participant
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {consolidatedPrizes.specialRecognitions.map((rec, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-center flex flex-col items-center justify-center gap-2 hover:border-slate-700 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center">
                {rec.icon === 'Sparkles' && <Sparkles className="w-5 h-5 text-cyan-400" />}
                {rec.icon === 'Users' && <Users className="w-5 h-5 text-purple-400" />}
                {rec.icon === 'Star' && <Star className="w-5 h-5 text-amber-400" />}
                {rec.icon === 'Cpu' && <Cpu className="w-5 h-5 text-blue-400" />}
                {rec.icon === 'FileCheck' && <FileCheck className="w-5 h-5 text-emerald-400" />}
              </div>
              <span className="text-xs font-bold text-slate-200 font-sans">{rec.label}</span>
              <span className="text-[10px] font-mono text-slate-400">Excellence Award</span>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => onNavigate('themes')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-semibold border border-slate-700 transition-colors"
          >
            <span>Explore 6 Official Themes</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenRegister}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-gradient hover:opacity-95 text-slate-950 font-mono text-xs font-bold transition-all shadow-md shadow-cyan-500/20"
          >
            <span>Register & Pay Online</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
