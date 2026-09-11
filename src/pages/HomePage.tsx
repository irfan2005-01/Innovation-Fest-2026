import React from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  ShieldCheck,
  ArrowRight,
  Download,
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  Award,
  Users,
} from 'lucide-react';
import { HackoraLogo } from '../components/HackoraLogo';
import { CountdownTimer } from '../components/CountdownTimer';
import { InteractiveFestPoster } from '../components/InteractiveFestPoster';
import { SpotlightCard } from '../components/ui/SpotlightCard';
import { AnimatedCounter } from '../components/ui/AnimatedCounter';
import { PageId } from '../types';
import { eventsData } from '../data/eventsData';
import { officialThemes } from '../data/themesData';

export interface HomePageProps {
  onNavigate: (page: PageId) => void;
  onOpenRegister: () => void;
  onOpenBrochure: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenRegister,
  onOpenBrochure,
}) => {
  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. HERO SECTION & HACKATHON TITLE */}
      <section className="relative pt-8 sm:pt-12 text-center">
        {/* Ambient Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-500/15 via-violet-600/15 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Institutional Micro-badge */}
        <div className="inline-flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/80 text-[10px] sm:text-xs font-mono text-slate-300 mb-4 shadow-sm backdrop-blur-md max-w-full text-center">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse shrink-0" />
          <span className="hidden sm:inline">Lingaraj Appa Engineering College (LAEC), Bidar</span>
          <span className="sm:hidden">LAEC Bidar</span>
          <span className="text-slate-600">//</span>
          <span className="text-cyan-400 font-semibold">Engineers' Day Celebrations 2026</span>
        </div>

        {/* Umbrella Fest Subtitle */}
        <div className="mb-3">
          <span className="text-xs sm:text-sm font-mono tracking-[0.3em] uppercase text-cyan-400 font-bold block">
            INNOVATION FEST 2026
          </span>
          <span className="text-xs text-slate-400 italic">“Ideas today. A better tomorrow.”</span>
        </div>

        {/* Brand Official Logo Hero Artwork */}
        <HackoraLogo size="hero" className="mb-6" />



        {/* 3. ANIMATED DIGITAL FEST STAGE (REPLACED STATIC POSTER IMAGE) */}
        <InteractiveFestPoster
          onNavigate={onNavigate}
          onOpenRegister={onOpenRegister}
          onOpenBrochure={onOpenBrochure}
        />

        {/* Event Narrative & Action Buttons */}
        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-6 font-sans">
          Join 200+ passionate engineers across Karnataka for a 24-hour sprint of continuous coding, design, and physical prototype presentation at Central Computing Arena, LAEC Bidar.
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={onOpenRegister}
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-mono text-sm font-bold text-slate-950 bg-brand-gradient hover:opacity-95 shadow-xl shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Register & Pay Online</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={onOpenBrochure}
            className="w-full sm:w-auto px-7 py-4 rounded-xl font-mono text-sm font-semibold text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Download Official Brochure</span>
          </motion.button>
        </div>

        {/* Live Countdown Timer */}
        <CountdownTimer />

        {/* Quick Info Strip with Spotlight & Count-Up */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto text-left">
          <SpotlightCard
            enableTilt={true}
            spotlightColor="rgba(0, 242, 254, 0.18)"
            className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm"
          >
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>DATES</span>
            </div>
            <div className="text-sm font-bold text-white">21–22 September 2026</div>
            <div className="text-[11px] text-slate-400 font-mono">Engineers' Day Special</div>
          </SpotlightCard>

          <SpotlightCard
            enableTilt={true}
            spotlightColor="rgba(249, 115, 22, 0.18)"
            className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm"
          >
            <div className="flex items-center gap-2 text-xs font-mono text-orange-400 mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span>SPRINT FORMAT</span>
            </div>
            <div className="text-sm font-bold text-white">
              <AnimatedCounter to={24} suffix=" Continuous Hours" />
            </div>
            <div className="text-[11px] text-slate-400 font-mono">Zero Midway Eliminations</div>
          </SpotlightCard>

          <SpotlightCard
            enableTilt={true}
            spotlightColor="rgba(168, 85, 247, 0.18)"
            className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm"
          >
            <div className="flex items-center gap-2 text-xs font-mono text-purple-400 mb-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>VENUE</span>
            </div>
            <div className="text-sm font-bold text-white">Computing Arena</div>
            <div className="text-[11px] text-slate-400 font-mono">LAEC Campus, Bidar</div>
          </SpotlightCard>

          <SpotlightCard
            enableTilt={true}
            spotlightColor="rgba(16, 185, 129, 0.18)"
            className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm"
          >
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
              <Users className="w-3.5 h-3.5" />
              <span>PARTICIPATION</span>
            </div>
            <div className="text-sm font-bold text-white">
              <AnimatedCounter to={3} suffix=" Distinct Events" />
            </div>
            <div className="text-[11px] text-slate-400 font-mono">Hackora, Ideathon & Expo</div>
          </SpotlightCard>
        </div>
      </section>

      {/* 3. TOTAL GRAND PRIZE & PARTICIPANT CERTIFICATES SECTION */}
      <section className="relative">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-400 mb-3">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>EXCELLENCE CITATION & CREDENTIALS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
            Grand Honors & Rewards
          </h2>
          <p className="text-sm text-slate-400 mt-2 font-sans">
            Recognizing supreme engineering mastery and honoring all builder squads who build through the night.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* ₹45,000+ Grand Prize Card */}
          <SpotlightCard
            enableTilt={true}
            enableBorderBeam={false}
            spotlightColor="rgba(251, 191, 36, 0.25)"
            className="rounded-3xl border-2 border-amber-500/50 bg-gradient-to-br from-slate-900/90 via-slate-900/95 to-amber-950/20 p-8 shadow-2xl backdrop-blur-xl flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-bl-full pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>TOTAL GRAND PRIZE</span>
                </span>
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-md shadow-amber-500/20">
                  <Trophy className="w-6 h-6" />
                </div>
              </div>

              <div className="my-3">
                <AnimatedCounter
                  to={45000}
                  prefix="₹"
                  suffix="+"
                  className="text-5xl sm:text-6xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-amber-200"
                />
                <div className="text-xs font-mono text-amber-200/80 mt-1 uppercase tracking-wider font-semibold">
                  Consolidated Cash Prize Pool & Awards
                </div>
              </div>

              <p className="text-sm text-slate-300 font-sans leading-relaxed mt-4">
                Awarded across HACKORA 2026, IDEATHON 2026, and PROJECT EXPO 2026 for teams delivering exceptional, technically sophisticated, and practically viable engineering solutions.
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-800 space-y-2 text-xs font-mono text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>The Prestigious HACKORA 2026 Gold Trophy</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>Direct Investor & Incubation Pitch Opportunities</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>Winner Citation Certificate signed by LAEC & VTU</span>
              </div>
            </div>
          </SpotlightCard>

          {/* Official Certificates for All Participants */}
          <SpotlightCard
            enableTilt={true}
            spotlightColor="rgba(0, 242, 254, 0.22)"
            className="rounded-3xl border-2 border-cyan-500/50 bg-gradient-to-br from-slate-900/90 via-slate-900/95 to-cyan-950/20 p-8 shadow-2xl backdrop-blur-xl flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-bl-full pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>UNIVERSAL CREDENTIAL</span>
                </span>
                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-md shadow-cyan-500/20">
                  <Award className="w-6 h-6" />
                </div>
              </div>

              <div className="my-3">
                <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
                  Official Certificates for All Participants
                </h3>
                <div className="text-xs font-mono text-cyan-300/80 mt-1 uppercase tracking-wider font-semibold">
                  VTU-Affiliated Institutional Recognition
                </div>
              </div>

              <p className="text-sm text-slate-300 font-sans leading-relaxed mt-4">
                Every verified participant who takes part in Innovation Fest 2026 and presents their live demo receives an official, authenticated Certificate of Participation issued under Visvesvaraya Technological University (VTU) guidelines.
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-800 space-y-2 text-xs font-mono text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>Digitally Verifiable VTU Participation Credential</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>Official HACKORA 2026 Builder Kit (T-Shirt & Badges)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>Talent Directory inclusion shared with hiring partners</span>
              </div>
            </div>
          </SpotlightCard>
        </div>
      </section>

      {/* 4. THREE OFFICIAL EVENTS OVERVIEW (HACKORA, IDEATHON, PROJECT EXPO) */}
      <section className="relative">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-400 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>THREE OFFICIAL EVENTS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
            Innovation Fest 2026 Arenas
          </h2>
          <p className="text-sm text-slate-400 mt-2 font-sans">
            Choose how you want to build and compete at Lingaraj Appa Engineering College, Bidar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {eventsData.map((ev) => (
            <div
              key={ev.id}
              className="rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/95 to-obsidian-950 border border-slate-800 hover:border-cyan-500/40 p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-800 border border-slate-700 text-slate-300">
                    {ev.accentBadge}
                  </span>
                  <span className="text-xs font-mono text-cyan-400 font-bold">{ev.prizePool}</span>
                </div>

                <h3 className="text-xl font-bold text-white font-display group-hover:text-cyan-300 transition-colors">
                  {ev.name}
                </h3>
                <div className="text-xs font-mono text-purple-400 mt-0.5 mb-3 font-semibold">
                  {ev.tagline}
                </div>

                <p className="text-xs text-slate-300 font-sans leading-relaxed mb-4">
                  {ev.description}
                </p>

                <div className="space-y-1.5 py-3 border-y border-slate-800/80 text-xs font-mono text-slate-400">
                  <div className="flex justify-between">
                    <span>Team Size:</span>
                    <span className="text-white font-bold">{ev.teamSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Entry Fee:</span>
                    <span className="text-emerald-400 font-bold">{ev.fee}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 flex items-center justify-between">
                <button
                  onClick={() => onNavigate('events')}
                  className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
                >
                  <span>Event Details</span>
                  <ArrowRight className="w-3 h-3" />
                </button>

                <button
                  onClick={onOpenRegister}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-mono font-bold"
                >
                  Register
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. SIX THEMES PREVIEW SECTION */}
      <section className="relative">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-xs font-mono text-violet-400 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>NATIONAL HORIZONS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
            Six Official Innovation Themes
          </h2>
          <p className="text-sm text-slate-400 mt-2 font-sans">
            Participating squads select one challenge track to engineer and physically demonstrate.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {officialThemes.map((theme) => (
            <div
              key={theme.id}
              onClick={() => onNavigate('themes')}
              className="rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/95 to-obsidian-950 border border-slate-800 hover:border-cyan-500/50 p-5 cursor-pointer transition-all duration-300 hover:shadow-xl group flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800 mb-4">
                  <img
                    src={theme.image}
                    alt={theme.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent pointer-events-none" />
                  <span className="absolute bottom-2.5 left-2.5 text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-300 px-2 py-0.5 rounded bg-slate-950/80 border border-slate-700">
                    {theme.tagline}
                  </span>
                </div>

                <h3 className="text-base font-bold font-display text-white group-hover:text-cyan-300 transition-colors leading-snug">
                  {theme.title}
                </h3>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2 font-sans">
                  {theme.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-cyan-400">
                <span>View 4 Subtracks</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
