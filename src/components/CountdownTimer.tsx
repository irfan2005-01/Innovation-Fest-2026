import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Zap } from 'lucide-react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isLive: boolean;
}

export const CountdownTimer: React.FC = () => {
  // Target: September 21, 2026 11:00:00 AM IST (UTC+05:30)
  const targetDate = new Date('2026-09-21T11:00:00+05:30').getTime();

  const calculateTimeLeft = (): TimeLeft => {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isLive: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      isLive: false,
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeUnits = [
    { label: 'DAYS', value: timeLeft.days, color: 'text-nexora-cyan' },
    { label: 'HOURS', value: timeLeft.hours, color: 'text-nexora-violet' },
    { label: 'MINUTES', value: timeLeft.minutes, color: 'text-nexora-orange' },
    { label: 'SECONDS', value: timeLeft.seconds, color: 'text-slate-100' },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto my-8">
      {/* Timer Bar Top Label */}
      <div className="flex items-center justify-between px-3 py-1.5 mb-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs font-mono">
        <div className="flex items-center gap-2 text-slate-300">
          <Clock className="w-3.5 h-3.5 text-nexora-cyan animate-spin-slow" />
          <span>OFFICIAL SPRINT LAUNCH COUNTDOWN</span>
        </div>
        <div className="flex items-center gap-1.5 text-nexora-orange font-semibold">
          <span className="w-2 h-2 rounded-full bg-nexora-orange animate-pulse"></span>
          <span>{timeLeft.isLive ? 'SPRINT IN PROGRESS' : 'KICK-OFF: 21 SEP 11:00 AM IST'}</span>
        </div>
      </div>

      {/* Countdown Digits Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {timeUnits.map((unit, index) => (
          <motion.div
            key={unit.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="relative rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800/90 p-4 sm:p-5 text-center shadow-lg group hover:border-slate-700 transition-all"
          >
            {/* Ambient inner glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent rounded-2xl pointer-events-none" />

            <div className="relative">
              <div
                className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold font-mono tracking-tight ${unit.color} drop-shadow-sm`}
              >
                {String(unit.value).padStart(2, '0')}
              </div>
              <div className="mt-1 text-[11px] sm:text-xs font-mono font-semibold tracking-widest text-slate-400 uppercase">
                {unit.label}
              </div>
            </div>

            {/* Corner cyber accent */}
            <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-nexora-cyan transition-colors" />
          </motion.div>
        ))}
      </div>

      {/* Target verification footnote */}
      <div className="mt-3 text-center">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
          <Zap className="w-3 h-3 text-nexora-cyan" />
          Synchronized to Indian Standard Time (IST UTC+5:30) • Central Computing Arena, LAEC
        </span>
      </div>
    </div>
  );
};

