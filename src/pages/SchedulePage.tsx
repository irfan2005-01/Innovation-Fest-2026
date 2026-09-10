import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, ChevronRight, Tag, Milestone, ArrowRight } from 'lucide-react';
import { SectionHeading } from '../components/ui/SectionHeading';
import { timelineData } from '../data/timelineData';
import { TimelineItem, PageId } from '../types';

interface SchedulePageProps {
  onNavigate: (page: PageId) => void;
  onOpenRegister: () => void;
}

export const SchedulePage: React.FC<SchedulePageProps> = ({ onNavigate, onOpenRegister }) => {
  const [filterDay, setFilterDay] = useState<'All' | 'Day 1' | 'Day 2'>('All');
  const [selectedItem, setSelectedItem] = useState<TimelineItem>(timelineData[1]);

  const filteredItems = timelineData.filter((item) => {
    if (filterDay === 'All') return true;
    return item.day === filterDay;
  });

  return (
    <div className="space-y-12 pb-16 pt-8 max-w-6xl mx-auto">
      <SectionHeading
        number="03"
        badge="EVENT TIMELINE // OFFICIAL SCHEDULE"
        title="Continuous 24-Hour"
        gradientTitle="Execution Schedule"
        description="Every hour is structured with precision. Zero early eliminations ensure every team receives the full 24-hour cycle to build, test, and present."
      />

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-900/90 border border-slate-800">
          {(['All', 'Day 1', 'Day 2'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterDay(tab)}
              className={`px-4 py-2 rounded-lg font-mono text-xs font-semibold transition-all ${
                filterDay === tab
                  ? 'bg-gradient-to-r from-cyan-500/20 to-violet-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent'
              }`}
            >
              {tab === 'All' ? 'All Milestones & Checkpoints' : tab === 'Day 1' ? 'Day 1: Kick-Off & Reviews' : 'Day 2: Freeze & Juries'}
            </button>
          ))}
        </div>

        <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
          <span>Kick-Off 11:00 AM (21 Sep) • Code Freeze 11:00 AM (22 Sep)</span>
        </div>
      </div>

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Timeline list */}
        <div className="lg:col-span-7 space-y-3">
          {filteredItems.map((item, index) => {
            const isSelected = selectedItem.id === item.id;
            const isKickoff = item.id === 't-2';
            const isFreeze = item.id === 't-8';

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: index * 0.03 }}
                onClick={() => setSelectedItem(item)}
                className={`cursor-pointer rounded-xl p-4 transition-all duration-200 border ${
                  isSelected
                    ? 'bg-slate-800/90 border-cyan-500/60 shadow-lg shadow-cyan-500/10'
                    : 'bg-slate-900/50 border-slate-800/80 hover:bg-slate-850 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 flex flex-col items-center">
                      <span className="px-2.5 py-1 rounded-md bg-slate-950/80 border border-slate-700 font-mono text-xs font-bold text-slate-200">
                        {item.time}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 mt-1">
                        {item.day}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        {item.checkpointNumber && (
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-violet-500/20 border border-violet-500/40 text-violet-300">
                            CP {item.checkpointNumber}
                          </span>
                        )}
                        {isKickoff && (
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 border border-cyan-500/40 text-cyan-300">
                            CLOCK START
                          </span>
                        )}
                        {isFreeze && (
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-orange-500/20 border border-orange-500/40 text-orange-300">
                            CODE FREEZE
                          </span>
                        )}
                        <h4 className="text-sm sm:text-base font-bold text-white font-display">
                          {item.title}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <ChevronRight
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isSelected ? 'text-cyan-400 rotate-90 lg:rotate-0' : 'text-slate-600'
                    }`}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Selected detail */}
        <div className="lg:col-span-5 lg:sticky lg:top-28">
          <div className="rounded-2xl bg-slate-900/90 border border-slate-700/80 p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-brand-gradient" />

            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono font-bold text-white">
                  {selectedItem.day} // {selectedItem.time}
                </span>
              </div>
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-slate-800 text-cyan-400 border border-slate-700">
                {selectedItem.type.toUpperCase()}
              </span>
            </div>

            <h3 className="text-xl font-bold font-display text-white mb-3">
              {selectedItem.title}
            </h3>

            <p className="text-sm text-slate-300 leading-relaxed mb-6 font-sans">
              {selectedItem.description}
            </p>

            <div className="space-y-3 pt-4 border-t border-slate-800">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-purple-400" />
                <span>Deliverables & Focus</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedItem.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs font-mono text-slate-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
              <div className="font-mono text-cyan-400 font-semibold flex items-center gap-1.5">
                <Milestone className="w-3.5 h-3.5" />
                <span>On-Site Instruction</span>
              </div>
              <p className="text-slate-400">
                All evaluations are conducted live in-person at LAEC Bidar campus workstations. Working prototypes and PPT presentation decks are demonstrated directly to jury panels.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={() => onNavigate('hospitality')}
          className="inline-flex items-center gap-2 text-sm font-mono text-cyan-400 hover:underline"
        >
          <span>Next: Physical Showcase & Amenities</span>
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
