import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Lightbulb,
  Rocket,
  Trophy,
  Calendar,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Terminal,
  Activity,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { PageId } from '../types';
import { BorderBeam } from './ui/BorderBeam';

interface InteractiveFestPosterProps {
  onNavigate: (page: PageId) => void;
  onOpenRegister: () => void;
  onOpenBrochure?: () => void;
}

type TrackKey = 'hackora' | 'ideathon' | 'expo';

interface TrackDetail {
  key: TrackKey;
  tabLabel: string;
  badge: string;
  title: string;
  tagline: string;
  fee: string;
  prizePool: string;
  firstPrize: string;
  format: string;
  teamSize: string;
  color: {
    primary: string;
    border: string;
    bg: string;
    glow: string;
    text: string;
    gradient: string;
  };
  highlights: string[];
  terminalLogs: string[];
  tags: string[];
}

const TRACKS: Record<TrackKey, TrackDetail> = {
  hackora: {
    key: 'hackora',
    tabLabel: 'HACKORA 2026',
    badge: 'Flagship 24H Hackathon',
    title: 'HACKORA 2026',
    tagline: '24-Hour Continuous National Hackathon Sprint',
    fee: '₹1,200 / team',
    prizePool: '₹35,000+',
    firstPrize: '₹25,000 1st Prize',
    format: '24-Hour Non-Stop Offline Arena (Overnight Sprint)',
    teamSize: '2–4 Builders / Team',
    color: {
      primary: 'cyan',
      border: 'border-cyan-500/50',
      bg: 'bg-cyan-500/10',
      glow: 'shadow-cyan-500/20',
      text: 'text-cyan-400',
      gradient: 'from-cyan-500 via-blue-500 to-indigo-500',
    },
    highlights: [
      '24 hours continuous hacking at Central Computing Arena, LAEC',
      'Special citations: Best UI/UX, Most Innovative, & Best Architecture',
      'Free overnight computing labs, high-speed Wi-Fi, and refreshments',
      'Official VTU-recognized Certificate of Participation for all builders',
    ],
    terminalLogs: [
      'sys: arena_grid_online [24:00:00 SPRINT CLOCK ARMED]',
      'net: dedicated_gigabit_link connected to computing_arena',
      'lab: hardware_kits & IoT_stations accessible 24/7',
      'eval: live jury inspection scheduled at checkpoints',
      'status: REGISTRATION_OPEN // 50 TEAM CAPACITY CAP',
    ],
    tags: ['AI & LLMs', 'Embedded IoT', 'Full-Stack Web3', 'Cyber Defense', 'Robotics'],
  },
  ideathon: {
    key: 'ideathon',
    tabLabel: 'IDEATHON 2026',
    badge: 'Concept & Vision Sprint',
    title: 'IDEATHON 2026',
    tagline: 'Think It. Pitch It. Transform It.',
    fee: '₹250 / team',
    prizePool: '₹5,000+',
    firstPrize: '₹3,000 1st Prize',
    format: 'Pitch Deck & Live Presentation to Expert Jury',
    teamSize: '1–2 Members / Team',
    color: {
      primary: 'purple',
      border: 'border-purple-500/50',
      bg: 'bg-purple-500/10',
      glow: 'shadow-purple-500/20',
      text: 'text-purple-400',
      gradient: 'from-purple-500 via-pink-500 to-rose-500',
    },
    highlights: [
      'Present problem-solving decks directly to industry leaders',
      'Refine market viability, monetization, and technical roadmaps',
      'Citations for Most Socially Impactful and Best Feasibility',
      'Official Certificate of Participation for every presenter',
    ],
    terminalLogs: [
      'sys: pitch_auditorium initialized [STAGE_A]',
      'eval: criteria: [originality: 30%, market_fit: 35%, clarity: 35%]',
      'deck: slides_projection_aspect_ratio: 16:9 supported',
      'jury: academic researchers & startup mentors on panel',
      'status: REGISTRATION_OPEN // OPEN INNOVATION TRACKS',
    ],
    tags: ['Smart Healthcare', 'Agritech', 'Fintech Vision', 'Clean Energy', 'EdTech'],
  },
  expo: {
    key: 'expo',
    tabLabel: 'PROJECT EXPO 2026',
    badge: 'Physical Working Model Expo',
    title: 'PROJECT EXPO 2026',
    tagline: 'Physical Hardware & Working Prototype Exhibition',
    fee: '₹250 / team',
    prizePool: '₹5,000+',
    firstPrize: '₹3,000 1st Prize',
    format: 'Live Working Hardware Demonstration on Expo Floor',
    teamSize: '1–4 Builders / Team',
    color: {
      primary: 'emerald',
      border: 'border-emerald-500/50',
      bg: 'bg-emerald-500/10',
      glow: 'shadow-emerald-500/20',
      text: 'text-emerald-400',
      gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
    },
    highlights: [
      'Dedicated exhibition booth with power outlets and display space',
      'Demonstrate working hardware models and physical circuits live',
      'Special awards for Best Engineering Craftsmanship and Working Demo',
      'Official Certificate of Participation for all squad members',
    ],
    terminalLogs: [
      'sys: expo_hall configured [STALL_SLOTS_ALLOCATED]',
      'pwr: 230V AC regulated supply at each team workstation',
      'demo: live prototype execution before evaluating engineers',
      'scope: mechanical, electrical, electronics & embedded systems',
      'status: REGISTRATION_OPEN // DEMO SLOTS LIMITED',
    ],
    tags: ['IoT Hardware', 'Robotics', 'EV Systems', 'Automation', 'Sensors'],
  },
};

export const InteractiveFestPoster: React.FC<InteractiveFestPosterProps> = ({
  onNavigate,
  onOpenRegister,
}) => {
  const [activeTrack, setActiveTrack] = useState<TrackKey>('hackora');
  const current = TRACKS[activeTrack];

  return (
    <div className="relative my-8 sm:my-10 max-w-5xl mx-auto w-full">
      {/* Outer Holographic Container with Laser Border Beam */}
      <div className="relative rounded-3xl p-[1.5px] bg-slate-900/90 border border-slate-800 shadow-2xl shadow-cyan-500/15 overflow-hidden group">
        {/* Animated Laser Border Beam */}
        <BorderBeam duration={10} colorFrom="#00f2fe" colorTo="#8b5cf6" />

        {/* Animated Laser Scanline Sweep (Desktop Only) */}
        <div className="hidden md:block absolute inset-0 overflow-hidden pointer-events-none z-20">
          <motion.div
            animate={{ y: ['-100%', '300%'] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            className="w-full h-32 bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent pointer-events-none"
          />
        </div>

        {/* Inner Card Screen */}
        <div className="rounded-[22px] bg-slate-950/95 backdrop-blur-2xl p-4 sm:p-7 md:p-8 text-slate-200 relative overflow-hidden border border-white/5">
          {/* Ambient Background Glows */}
          <div
            className={`absolute -top-32 -right-32 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-colors duration-700 ${
              activeTrack === 'hackora'
                ? 'bg-cyan-500/15'
                : activeTrack === 'ideathon'
                ? 'bg-purple-500/15'
                : 'bg-emerald-500/15'
            }`}
          />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-grid-dense opacity-20 pointer-events-none" />

          {/* 1. HUD TOP STATUS BAR */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-slate-800/80 text-xs font-mono">
            {/* Left Signal */}
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-slate-300 uppercase tracking-widest font-bold text-[11px]">
                LAEC INNOVATION FEST 2026 // LIVE ARENA
              </span>
            </div>

            {/* Center Badges */}
            <div className="hidden sm:flex items-center gap-3 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                <span>21–22 SEP 2026</span>
              </span>
              <span className="text-slate-700">•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-orange-400" />
                <span>BIDAR, KARNATAKA</span>
              </span>
            </div>

            {/* Right Prize Highlight */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold text-[11px]">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>₹45,000+ TOTAL PRIZES</span>
            </div>
          </div>

          {/* 2. INTERACTIVE EVENT TRACK SELECTOR TABS WITH SPRING GLIDER */}
          <div className="relative z-10 grid grid-cols-3 gap-2 sm:gap-3 mb-6 p-1.5 rounded-2xl bg-slate-900/80 border border-slate-800">
            {/* Tab 1: Hackora */}
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveTrack('hackora')}
              className="relative p-2 sm:p-3 rounded-xl font-mono text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 group z-10"
            >
              {activeTrack === 'hackora' && (
                <motion.div
                  layoutId="activeTrackGlider"
                  className="absolute inset-0 rounded-xl bg-cyan-500 shadow-lg shadow-cyan-500/25 -z-10"
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                />
              )}
              <Zap
                className={`w-4 h-4 shrink-0 transition-colors ${
                  activeTrack === 'hackora' ? 'text-slate-950' : 'text-slate-400 group-hover:text-white'
                }`}
              />
              <span
                className={`truncate transition-colors ${
                  activeTrack === 'hackora' ? 'text-slate-950 font-black' : 'text-slate-400 group-hover:text-white'
                }`}
              >
                HACKORA
              </span>
              <span
                className={`hidden md:inline-block text-[10px] px-1.5 py-0.5 rounded font-bold transition-colors ${
                  activeTrack === 'hackora' ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-cyan-300'
                }`}
              >
                ₹1,200
              </span>
            </motion.button>

            {/* Tab 2: Ideathon */}
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveTrack('ideathon')}
              className="relative p-2 sm:p-3 rounded-xl font-mono text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 group z-10"
            >
              {activeTrack === 'ideathon' && (
                <motion.div
                  layoutId="activeTrackGlider"
                  className="absolute inset-0 rounded-xl bg-purple-500 shadow-lg shadow-purple-500/25 -z-10"
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                />
              )}
              <Lightbulb
                className={`w-4 h-4 shrink-0 transition-colors ${
                  activeTrack === 'ideathon' ? 'text-white' : 'text-slate-400 group-hover:text-white'
                }`}
              />
              <span
                className={`truncate transition-colors ${
                  activeTrack === 'ideathon' ? 'text-white font-black' : 'text-slate-400 group-hover:text-white'
                }`}
              >
                IDEATHON
              </span>
              <span
                className={`hidden md:inline-block text-[10px] px-1.5 py-0.5 rounded font-bold transition-colors ${
                  activeTrack === 'ideathon' ? 'bg-white/20 text-white' : 'bg-slate-800 text-purple-300'
                }`}
              >
                ₹250
              </span>
            </motion.button>

            {/* Tab 3: Project Expo */}
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveTrack('expo')}
              className="relative p-2 sm:p-3 rounded-xl font-mono text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 group z-10"
            >
              {activeTrack === 'expo' && (
                <motion.div
                  layoutId="activeTrackGlider"
                  className="absolute inset-0 rounded-xl bg-emerald-500 shadow-lg shadow-emerald-500/25 -z-10"
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                />
              )}
              <Rocket
                className={`w-4 h-4 shrink-0 transition-colors ${
                  activeTrack === 'expo' ? 'text-slate-950' : 'text-slate-400 group-hover:text-white'
                }`}
              />
              <span
                className={`truncate transition-colors ${
                  activeTrack === 'expo' ? 'text-slate-950 font-black' : 'text-slate-400 group-hover:text-white'
                }`}
              >
                PROJECT EXPO
              </span>
              <span
                className={`hidden md:inline-block text-[10px] px-1.5 py-0.5 rounded font-bold transition-colors ${
                  activeTrack === 'expo' ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-emerald-300'
                }`}
              >
                ₹250
              </span>
            </motion.button>
          </div>

          {/* 3. DYNAMIC ANIMATED TRACK SHOWCASE STAGE */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTrack}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
            >
              {/* Left Column: Track Details & Highlights (7 cols) */}
              <div className="lg:col-span-7 space-y-4 text-left">
                {/* Track Badge & Tag */}
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider ${current.color.bg} ${current.color.border} ${current.color.text} border`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{current.badge}</span>
                  </span>

                  <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[11px]">
                    {current.teamSize}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[11px]">
                    Fee: <strong className="text-white">{current.fee}</strong>
                  </span>
                </div>

                {/* Track Main Title */}
                <div>
                  <h3 className="text-2xl sm:text-4xl font-black font-display text-white tracking-tight">
                    {current.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-mono text-slate-400 mt-1 font-semibold">
                    {current.tagline}
                  </p>
                </div>

                {/* Highlights List */}
                <ul className="space-y-2 text-xs sm:text-sm text-slate-300 font-sans">
                  {current.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <ChevronRight className={`w-4 h-4 mt-0.5 shrink-0 ${current.color.text}`} />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>

                {/* Quick Track Metrics Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 font-mono text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block uppercase">Prize Pool</span>
                    <span className="font-bold text-amber-300 text-sm">{current.prizePool}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block uppercase">1st Prize</span>
                    <span className={`font-bold text-sm ${current.color.text}`}>{current.firstPrize}</span>
                  </div>
                  <div className="col-span-2 sm:col-span-1 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block uppercase">Credentials</span>
                    <span className="font-bold text-slate-200 text-xs flex items-center gap-1 mt-0.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                      <span>VTU Verified</span>
                    </span>
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onOpenRegister}
                    className={`px-5 py-3 rounded-xl font-mono text-xs font-bold transition-all shadow-lg flex items-center gap-2 group ${
                      activeTrack === 'hackora'
                        ? 'bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-cyan-500/30'
                        : activeTrack === 'ideathon'
                        ? 'bg-purple-500 hover:bg-purple-400 text-white shadow-purple-500/30'
                        : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/30'
                    }`}
                  >
                    <span>Register For {current.tabLabel}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigate('events')}
                    className="px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-mono text-xs font-semibold transition-colors"
                  >
                    View Track Rules
                  </button>
                </div>
              </div>

              {/* Right Column: Animated Cyber Terminal & Telemetry (5 cols) */}
              <div className="lg:col-span-5 space-y-3">
                {/* Cyber Terminal Window */}
                <div className="rounded-2xl bg-slate-950 border border-slate-800/90 shadow-xl overflow-hidden font-mono text-left">
                  {/* Window Bar */}
                  <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                      <span className="ml-2 text-slate-300 font-semibold text-[10px]">
                        terminal://laec.fest.engine
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-cyan-400 text-[10px]">
                      <Terminal className="w-3 h-3" />
                      <span>ONLINE</span>
                    </div>
                  </div>

                  {/* Terminal Output */}
                  <div className="p-4 text-[11px] leading-relaxed text-slate-300 space-y-1.5 bg-slate-950/90 min-h-[140px]">
                    {current.terminalLogs.map((log, i) => (
                      <div key={i} className="flex items-start gap-1.5">
                        <span className="text-cyan-400 select-none">&gt;</span>
                        <span className={i === 0 ? current.color.text + ' font-bold' : 'text-slate-300'}>
                          {log}
                        </span>
                      </div>
                    ))}
                    <div className="flex items-center gap-1 text-slate-500 pt-1">
                      <span className="text-emerald-400 animate-pulse font-bold">_</span>
                      <span className="text-[10px]">awaiting team arrival on 21 Sep...</span>
                    </div>
                  </div>
                </div>

                {/* Animated Audio Equalizer / Cyber Bars Strip */}
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <Activity className={`w-3.5 h-3.5 ${current.color.text} animate-pulse`} />
                    <span>Arena Signal Activity:</span>
                  </div>

                  {/* 12 Animated Soundwave Frequency Bars */}
                  <div className="flex items-end gap-1 h-5">
                    {[12, 20, 8, 16, 24, 14, 22, 10, 18, 24, 14, 18].map((height, idx) => (
                      <motion.div
                        key={idx}
                        animate={{ height: [height * 0.4, height, height * 0.5] }}
                        transition={{
                          duration: 0.8 + (idx % 4) * 0.2,
                          repeat: Infinity,
                          repeatType: 'reverse',
                          ease: 'easeInOut',
                        }}
                        className={`w-1 rounded-full ${
                          idx % 3 === 0
                            ? 'bg-cyan-400'
                            : idx % 3 === 1
                            ? 'bg-purple-400'
                            : 'bg-emerald-400'
                        }`}
                        style={{ height: `${height}px` }}
                      />
                    ))}
                  </div>
                </div>

                {/* Floating Tech Tags */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {current.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-[10px] font-mono text-slate-300 hover:border-slate-700 transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* 4. BOTTOM CONTINUOUS CYBER TICKER */}
          <div className="relative z-10 mt-6 pt-4 border-t border-slate-800/80 overflow-hidden font-mono text-xs text-slate-400">
            <motion.div
              animate={{ x: [0, -1200] }}
              transition={{ repeat: Infinity, duration: 28, ease: 'linear' }}
              className="flex items-center gap-8 whitespace-nowrap"
            >
              <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>INNOVATION FEST 2026</span>
              </span>
              <span className="text-slate-600">//</span>
              <span>24 HOURS CONTINUOUS SPRINT</span>
              <span className="text-slate-600">//</span>
              <span className="text-amber-300 font-bold">₹45,000+ CONSOLIDATED CASH PRIZE POOL</span>
              <span className="text-slate-600">//</span>
              <span>OFFICIAL TITLE SPONSOR: ROTARY SILVER CLUB</span>
              <span className="text-slate-600">//</span>
              <span className="text-emerald-400 font-bold">VTU AFFILIATED & LAEC HOSTED</span>
              <span className="text-slate-600">//</span>
              <span>CERTIFICATES OF PARTICIPATION FOR ALL BUILDERS</span>
              <span className="text-slate-600">//</span>
              <span>NO MIDWAY ELIMINATIONS</span>
              {/* Duplicate for seamless infinite loop */}
              <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>INNOVATION FEST 2026</span>
              </span>
              <span className="text-slate-600">//</span>
              <span>24 HOURS CONTINUOUS SPRINT</span>
              <span className="text-slate-600">//</span>
              <span className="text-amber-300 font-bold">₹45,000+ CONSOLIDATED CASH PRIZE POOL</span>
              <span className="text-slate-600">//</span>
              <span>OFFICIAL TITLE SPONSOR: ROTARY SILVER CLUB</span>
              <span className="text-slate-600">//</span>
              <span className="text-emerald-400 font-bold">VTU AFFILIATED & LAEC HOSTED</span>
              <span className="text-slate-600">//</span>
              <span>CERTIFICATES OF PARTICIPATION FOR ALL BUILDERS</span>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

