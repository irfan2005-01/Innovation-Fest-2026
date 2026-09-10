import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, ChevronRight, Tag, Milestone } from 'lucide-react';
import { SectionHeading } from './ui/SectionHeading';
import { timelineData } from '../data/timelineData';
import { TimelineItem } from '../types';

export const Timeline: React.FC = () => {
  const [filterDay, setFilterDay] = useState<'All' | 'Day 1' | 'Day 2'>('All');
  const [selectedItem, setSelectedItem] = useState<TimelineItem>(timelineData[1]); // Default to Kick-off

  const filteredItems = timelineData.filter((item) => {
    if (filterDay === 'All') return true;
    return item.day === filterDay;
  });

  return (
    <section id="timeline" className="py-20 md:py-28 relative bg-obsidian-900/40">
      {/* Background radial accent */}
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          number="02"
          badge="EVENT TIMELINE"
          title="Continuous 24-Hour"
          gradientTitle="Execution Schedule"
          description="Every hour is meticulously structured. Track the progression from morning inauguration and live problem reveals to late-night debug surges and final stage demonstrations."
        />

        {/* Filter Tabs & Quick Jump */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-900/90 border border-slate-800">
            {(['All', 'Day 1', 'Day 2'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterDay(tab)}
                className={`px-4 py-2 rounded-lg font-mono text-xs font-semibold transition-all ${
                  filterDay === tab
                    ? 'bg-gradient-to-r from-nexora-cyan/20 to-nexora-violet/20 text-nexora-cyan border border-nexora-cyan/40 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                {tab === 'All' ? 'Full 24-Hour Sprint' : tab === 'Day 1' ? 'Day 1: Ideation & Architecture' : 'Day 2: Freeze & Demonstrations'}
              </button>
            ))}
          </div>

          <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-nexora-cyan"></span>
            <span>Total 12 Checkpoint Milestones</span>
          </div>
        </div>

        {/* 2-Column Responsive Layout: Left Timeline List, Right Selected Checkpoint Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Timeline List (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-3">
            {filteredItems.map((item, index) => {
              const isSelected = selectedItem.id === item.id;
              const isKickoff = item.id === 't-2';
              const isFreeze = item.id === 't-10';

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-20px' }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                  onClick={() => setSelectedItem(item)}
                  className={`cursor-pointer rounded-xl p-4 transition-all duration-200 border relative ${
                    isSelected
                      ? 'bg-slate-800/90 border-nexora-cyan/60 shadow-lg shadow-cyan-500/10'
                      : 'bg-slate-900/50 border-slate-800/80 hover:bg-slate-850 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      {/* Time pill */}
                      <div className="shrink-0 flex flex-col items-center">
                        <span className="px-2.5 py-1 rounded-md bg-slate-950/80 border border-slate-700/80 font-mono text-xs font-bold text-slate-200">
                          {item.time}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 mt-1">
                          {item.day}
                        </span>
                      </div>

                      {/* Content */}
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
                        isSelected ? 'text-nexora-cyan rotate-90 lg:rotate-0' : 'text-slate-600'
                      }`}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right Selected Checkpoint Card (5 cols on lg, sticky) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="rounded-2xl bg-gradient-to-b from-slate-900/90 to-obsidian-900/95 border border-slate-700/80 p-6 sm:p-7 shadow-2xl backdrop-blur-xl relative overflow-hidden">
              {/* Subtle top gradient bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-brand-gradient" />

              {/* Status Header */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-nexora-cyan" />
                  <span className="text-xs font-mono font-bold text-white">
                    {selectedItem.day} // {selectedItem.time}
                  </span>
                </div>
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-slate-800 text-nexora-cyan border border-slate-700">
                  {selectedItem.type.toUpperCase()}
                </span>
              </div>

              {/* Checkpoint Title */}
              <h3 className="text-xl sm:text-2xl font-bold font-display text-white mb-3 leading-snug">
                {selectedItem.title}
              </h3>

              {/* Detailed Description */}
              <p className="text-sm text-slate-300 leading-relaxed mb-6 font-sans">
                {selectedItem.description}
              </p>

              {/* Focus tags */}
              <div className="space-y-3 pt-4 border-t border-slate-800/80">
                <div className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-nexora-violet" />
                  <span>Key Sprint Deliverables</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedItem.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-xs font-mono text-slate-200"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Operational Advisory */}
              <div className="mt-6 p-4 rounded-xl bg-slate-850/80 border border-slate-800 text-xs text-slate-300 space-y-1.5">
                <div className="font-mono text-nexora-cyan font-semibold flex items-center gap-1.5">
                  <Milestone className="w-3.5 h-3.5" />
                  <span>Venue Instruction</span>
                </div>
                <p className="text-slate-400">
                  Team representatives must be stationed at their assigned workstations for mentor verification logs during this window.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
