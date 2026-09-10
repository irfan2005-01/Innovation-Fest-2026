import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  AlertTriangle,
  ArrowRight,
  Zap,
  Lightbulb,
  Box,
  MessageCircle,
  Phone,
  Copy,
  Check,
  Building2,
  User,
  ShieldCheck,
  Printer,
  FileText,
  Users,
  GraduationCap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  getStoredPayments,
  PaymentRecord,
  TeamMemberDetail,
} from '../../lib/supabase';
import { RotatingO } from '../HackoraLogo';
import PaymentCard from '../PaymentCard';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultEvent?: 'hackora' | 'ideathon' | 'expo';
}

type EventKey = 'hackora' | 'ideathon' | 'expo';

interface EventConfig {
  id: EventKey;
  name: string;
  category: string;
  tagline: string;
  feeNumber: number;
  feeDisplay: string;
  teamSizeLabel: string;
  minMembers: number;
  maxMembers: number;
  prizePool: string;
  accent: string;
  accentBg: string;
  icon: React.FC<{ className?: string; style?: React.CSSProperties }>;
}

const EVENTS: Record<EventKey, EventConfig> = {
  hackora: {
    id: 'hackora',
    name: 'HACKORA 2026',
    category: '24-Hour State-Level Hackathon',
    tagline: 'Continuous sprint of software & smart system engineering',
    feeNumber: 1200,
    feeDisplay: '₹1,200',
    teamSizeLabel: '2 to 4 Members',
    minMembers: 2,
    maxMembers: 4,
    prizePool: '₹35,000+',
    accent: '#00F2FE',
    accentBg: 'bg-cyan-500/15 border-cyan-500/50 text-cyan-300',
    icon: Zap,
  },
  ideathon: {
    id: 'ideathon',
    name: 'IDEATHON 2026',
    category: 'Pitch & Solution Challenge',
    tagline: 'High-impact technical problem solving & innovation pitching',
    feeNumber: 250,
    feeDisplay: '₹250',
    teamSizeLabel: '1 to 2 Members',
    minMembers: 1,
    maxMembers: 2,
    prizePool: '₹5,000+',
    accent: '#8B5CF6',
    accentBg: 'bg-purple-500/15 border-purple-500/50 text-purple-300',
    icon: Lightbulb,
  },
  expo: {
    id: 'expo',
    name: 'PROJECT EXPO 2026',
    category: 'Physical Working Model Exhibition',
    tagline: 'Working physical prototypes & engineering demonstrations',
    feeNumber: 250,
    feeDisplay: '₹250',
    teamSizeLabel: '1 to 2 Members',
    minMembers: 1,
    maxMembers: 2,
    prizePool: '₹5,000+',
    accent: '#10B981',
    accentBg: 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300',
    icon: Box,
  },
};

const HACKORA_THEMES = [
  'Agentic AI, Automation & Developer Tools',
  'Cybersecurity, Privacy & Data Trust',
  'HealthTech, Bio-Innovation & Assistive Tech',
  'AgriTech, Rural Economy & Food Systems',
  'Smart Infrastructure, Mobility & Clean Energy',
  'Smart Education, EdTech & Campus Management',
  'Open Innovation & Emerging Tech',
];

const BRANCH_OPTIONS = [
  'CSE - Computer Science & Engg',
  'ISE - Information Science & Engg',
  'ECE - Electronics & Communication',
  'MECH - Mechanical Engg',
  'CIVIL - Civil Engg',
  'EEE - Electrical & Electronics',
  'AIML - Artificial Intelligence & ML',
  'AIDS - AI & Data Science',
  'OTHER - Other Department',
];

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  defaultEvent = 'hackora',
}) => {
  const [selectedEvent, setSelectedEvent] = useState<EventKey>(defaultEvent);
  const [step, setStep] = useState<'details' | 'payment' | 'receipt' | 'history'>('details');

  // Shared Base Fields (Purely professional)
  const [teamName, setTeamName] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [leaderName, setLeaderName] = useState('');
  const [leaderEmail, setLeaderEmail] = useState('');
  const [leaderPhone, setLeaderPhone] = useState('');
  const [leaderUsn, setLeaderUsn] = useState('');
  const [leaderBranch, setLeaderBranch] = useState(BRANCH_OPTIONS[0]);
  const [leaderYear, setLeaderYear] = useState('3rd Year');
  const [teamSize, setTeamSize] = useState<number>(2);

  // Additional Members (up to 3 additional members)
  const [members, setMembers] = useState<TeamMemberDetail[]>([
    { name: '', email: '', phone: '', usn: '', branch: BRANCH_OPTIONS[0] },
    { name: '', email: '', phone: '', usn: '', branch: BRANCH_OPTIONS[0] },
    { name: '', email: '', phone: '', usn: '', branch: BRANCH_OPTIONS[0] },
  ]);

  // Event Track & Project/Pitch Title
  // Hackathon: Themes only (no project title)
  // Ideathon & Expo: Title only (no themes/categories)
  const [hackoraTheme, setHackoraTheme] = useState(HACKORA_THEMES[0]);
  const [ideathonSolutionTitle, setIdeathonSolutionTitle] = useState('');
  const [expoModelTitle, setExpoModelTitle] = useState('');

  // UI & Receipt States
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [receiptRecord, setReceiptRecord] = useState<PaymentRecord | null>(null);
  const [copiedToken, setCopiedToken] = useState(false);
  const [storedRecords, setStoredRecords] = useState<PaymentRecord[]>([]);

  // Keep team size in valid bounds when event changes
  useEffect(() => {
    const cfg = EVENTS[selectedEvent];
    if (teamSize < cfg.minMembers) setTeamSize(cfg.minMembers);
    if (teamSize > cfg.maxMembers) setTeamSize(cfg.maxMembers);
  }, [selectedEvent]);

  // Load history records
  useEffect(() => {
    if (isOpen) {
      setStoredRecords(getStoredPayments());
    }
  }, [isOpen, step]);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00F2FE', '#8B5CF6', '#10B981', '#F59E0B'],
      });
    } catch {
      // Ignore in environments without canvas
    }
  };

  const handleCopyToken = (token: string) => {
    navigator.clipboard.writeText(token);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Mandatory Core Fields
    if (
      !teamName.trim() ||
      !collegeName.trim() ||
      !leaderName.trim() ||
      !leaderEmail.trim() ||
      !leaderPhone.trim() ||
      !leaderUsn.trim()
    ) {
      setSubmitError('Please fill in all mandatory team and leader information (Name, Email, Phone, College, USN).');
      return;
    }

    // Phone validation
    const cleanPhone = leaderPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setSubmitError('Please enter a valid 10-digit mobile/WhatsApp number for the team leader.');
      return;
    }

    // 2. Event-Specific Validation (Hackathon requires Theme; Ideathon & Expo require Title)
    if (selectedEvent === 'hackora' && !hackoraTheme) {
      setSubmitError('Please select a Hackathon Track / Theme.');
      return;
    }

    if (selectedEvent === 'ideathon' && !ideathonSolutionTitle.trim()) {
      setSubmitError('Please enter your Ideathon Pitch / Solution Title.');
      return;
    }

    if (selectedEvent === 'expo' && !expoModelTitle.trim()) {
      setSubmitError('Please enter your Physical Working Model Title.');
      return;
    }

    // 3. Additional Members Validation (if teamSize > 1)
    const requiredMemberCount = teamSize - 1;
    for (let i = 0; i < requiredMemberCount; i++) {
      const m = members[i];
      if (!m || !m.name.trim() || !m.usn?.trim()) {
        setSubmitError(`Please enter Full Name and USN / Student ID for Team Member ${i + 2}.`);
        return;
      }
    }

    setSubmitError(null);
    setStep('payment');
  };

  const resetForm = () => {
    setStep('details');
    setTeamName('');
    setCollegeName('');
    setLeaderName('');
    setLeaderEmail('');
    setLeaderPhone('');
    setLeaderUsn('');
    setHackoraTheme(HACKORA_THEMES[0]);
    setIdeathonSolutionTitle('');
    setExpoModelTitle('');
    setReceiptRecord(null);
    setSubmitError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  const currentEvent = EVENTS[selectedEvent];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-4xl rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl p-5 sm:p-7 md:p-8 z-10 my-auto overflow-hidden max-h-[92vh] flex flex-col"
        >
          {/* Subtle Ambient Glow */}
          <div
            className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-20"
            style={{ backgroundColor: currentEvent.accent }}
          />

          {/* Modal Header */}
          <div className="flex items-start justify-between border-b border-slate-800/80 pb-4 shrink-0">
            <div className="flex items-center gap-3">
              <RotatingO size="sm" />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-black font-display text-white tracking-wide">
                    OFFICIAL EVENT REGISTRATION
                  </h2>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                    2026
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Lingaraj Appa Engineering College, Bidar • Engineers' Day 2026
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {storedRecords.length > 0 && (
                <button
                  type="button"
                  onClick={() => setStep(step === 'history' ? 'details' : 'history')}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] font-mono text-cyan-400 flex items-center gap-1.5 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{step === 'history' ? 'New Form' : `Receipts (${storedRecords.length})`}</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleClose}
                className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Step Indicator Progress Bar */}
          {step !== 'history' && (
            <div className="pt-3 pb-2 shrink-0">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
                <span className={step === 'details' ? 'text-cyan-400 font-bold' : ''}>
                  1. Team & Academic Info
                </span>
                <span className={step === 'payment' ? 'text-cyan-400 font-bold' : ''}>
                  2. UPI Payment & UTR
                </span>
                <span className={step === 'receipt' ? 'text-emerald-400 font-bold' : ''}>
                  3. Entry Pass & Receipt
                </span>
              </div>
              <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-gradient transition-all duration-300"
                  style={{
                    width: step === 'details' ? '33%' : step === 'payment' ? '66%' : '100%',
                  }}
                />
              </div>
            </div>
          )}

          {/* Error Banner */}
          {submitError && (
            <div className="my-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono flex items-center gap-2 shrink-0">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          {/* Scrollable Form Content */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-4 py-2">
            {/* ---------------------------------------------------- */}
            {/* STEP 1: EVENT-SPECIFIC REGISTRATION DETAILS */}
            {/* ---------------------------------------------------- */}
            {step === 'details' && (
              <form onSubmit={handleDetailsSubmit} className="space-y-4">
                {/* 1. Event Selector Tabs */}
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1.5 uppercase tracking-wider">
                    Select Event Track *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {(Object.keys(EVENTS) as EventKey[]).map((evtKey) => {
                      const evt = EVENTS[evtKey];
                      const isSelected = selectedEvent === evtKey;
                      const IconComponent = evt.icon;
                      return (
                        <button
                          key={evt.id}
                          type="button"
                          onClick={() => {
                            setSelectedEvent(evtKey);
                            setSubmitError(null);
                          }}
                          className={`p-3 rounded-2xl border text-left transition-all relative ${
                            isSelected
                              ? 'bg-slate-900 border-cyan-400 ring-1 ring-cyan-400/50 shadow-lg shadow-cyan-500/10'
                              : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 opacity-75 hover:opacity-100'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <IconComponent
                              className="w-4 h-4"
                              style={{ color: isSelected ? evt.accent : '#94A3B8' }}
                            />
                            <span className="text-xs font-bold font-mono text-white">
                              {evt.feeDisplay}
                            </span>
                          </div>
                          <div className="font-bold text-white text-xs mt-1.5">{evt.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                            {evt.teamSizeLabel}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Event Summary Banner */}
                <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full animate-pulse"
                      style={{ backgroundColor: currentEvent.accent }}
                    />
                    <span className="font-bold text-white">{currentEvent.name}</span>
                    <span className="text-slate-400 hidden sm:inline">| {currentEvent.category}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400">Fee:</span>
                    <span className="font-black text-cyan-300 text-sm">
                      {currentEvent.feeDisplay}
                    </span>
                    <span className="text-[11px] text-slate-400">({currentEvent.teamSizeLabel})</span>
                  </div>
                </div>

                {/* 2. Team & College Section */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                  <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Team & College Information</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-slate-300 mb-1">
                        Team Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-slate-300 mb-1">
                        College / Institution Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={collegeName}
                        onChange={(e) => setCollegeName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Team Size Selector */}
                  <div>
                    <label className="block text-[11px] font-mono text-slate-300 mb-1">
                      Number of Team Members ({currentEvent.teamSizeLabel}) *
                    </label>
                    <div className="flex gap-2">
                      {Array.from(
                        { length: currentEvent.maxMembers - currentEvent.minMembers + 1 },
                        (_, i) => currentEvent.minMembers + i
                      ).map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setTeamSize(size)}
                          className={`flex-1 py-1.5 px-3 rounded-lg border text-xs font-mono font-bold transition-all ${
                            teamSize === size
                              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                              : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                          }`}
                        >
                          {size} {size === 1 ? 'Member (Solo)' : 'Members'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 3. Event Track / Title Section */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                  <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span>
                        {selectedEvent === 'hackora'
                          ? 'Hackathon Track / Theme'
                          : selectedEvent === 'ideathon'
                          ? 'Proposed Solution / Pitch Title'
                          : 'Working Model / Prototype Title'}
                      </span>
                    </div>
                    <span className="text-[10px] text-cyan-300 font-bold bg-cyan-500/10 px-2 py-0.5 rounded">
                      {currentEvent.category}
                    </span>
                  </div>

                  {/* HACKORA Form Fields - THEMES ONLY */}
                  {selectedEvent === 'hackora' && (
                    <div>
                      <label className="block text-[11px] font-mono text-slate-300 mb-1">
                        Hackathon Track / Theme *
                      </label>
                      <select
                        value={hackoraTheme}
                        onChange={(e) => setHackoraTheme(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-cyan-500/40 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                      >
                        {HACKORA_THEMES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                      <p className="text-[10px] font-mono text-slate-400 mt-1.5">
                        Select your challenge theme. Specific project titles and prototypes are formulated during the 24-hour sprint.
                      </p>
                    </div>
                  )}

                  {/* IDEATHON Form Fields - TITLES ONLY */}
                  {selectedEvent === 'ideathon' && (
                    <div>
                      <label className="block text-[11px] font-mono text-slate-300 mb-1">
                        Proposed Solution / Pitch Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={ideathonSolutionTitle}
                        onChange={(e) => setIdeathonSolutionTitle(e.target.value)}
                        placeholder="e.g., Micro-Solar Cold Storage Chain for Rural Farmers"
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-purple-500/40 text-white text-xs font-mono focus:border-purple-400 focus:outline-none"
                      />
                      <p className="text-[10px] font-mono text-slate-400 mt-1.5">
                        Provide a clear, descriptive title for your innovation pitch or idea.
                      </p>
                    </div>
                  )}

                  {/* PROJECT EXPO Form Fields - TITLES ONLY */}
                  {selectedEvent === 'expo' && (
                    <div>
                      <label className="block text-[11px] font-mono text-slate-300 mb-1">
                        Working Model Display Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={expoModelTitle}
                        onChange={(e) => setExpoModelTitle(e.target.value)}
                        placeholder="e.g., Dual-Axis Smart Solar Tracker Prototype"
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-emerald-500/40 text-white text-xs font-mono focus:border-emerald-400 focus:outline-none"
                      />
                      <p className="text-[10px] font-mono text-slate-400 mt-1.5">
                        Provide the name of the physical working prototype or model you will display.
                      </p>
                    </div>
                  )}
                </div>

                {/* 4. Team Leader Information (Primary Point of Contact) */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                  <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    <span>
                      Team Leader Information (Point of Contact)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-slate-300 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={leaderName}
                        onChange={(e) => setLeaderName(e.target.value)}
                        placeholder="e.g., Rahul Sharma"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-slate-300 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={leaderEmail}
                        onChange={(e) => setLeaderEmail(e.target.value)}
                        placeholder="e.g., rahul@example.com"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-slate-300 mb-1">
                        WhatsApp Contact Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={leaderPhone}
                        onChange={(e) => setLeaderPhone(e.target.value)}
                        placeholder="10-digit mobile number"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-slate-300 mb-1">
                        USN / Student ID *
                      </label>
                      <input
                        type="text"
                        required
                        value={leaderUsn}
                        onChange={(e) => setLeaderUsn(e.target.value.toUpperCase())}
                        placeholder="e.g., 3LA22CS045"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-slate-300 mb-1">
                        Department & Year *
                      </label>
                      <div className="grid grid-cols-2 gap-1.5">
                        <select
                          value={leaderBranch}
                          onChange={(e) => setLeaderBranch(e.target.value)}
                          className="w-full px-2 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                        >
                          {BRANCH_OPTIONS.map((b) => (
                            <option key={b} value={b.split(' ')[0]}>
                              {b.split(' ')[0]}
                            </option>
                          ))}
                        </select>
                        <select
                          value={leaderYear}
                          onChange={(e) => setLeaderYear(e.target.value)}
                          className="w-full px-2 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                        >
                          <option value="1st Year">1st Yr</option>
                          <option value="2nd Year">2nd Yr</option>
                          <option value="3rd Year">3rd Yr</option>
                          <option value="4th Year">4th Yr</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5. Additional Team Members (if teamSize > 1) */}
                {teamSize > 1 && (
                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                    <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-purple-400" />
                      <span>
                        Additional Team Members ({teamSize - 1} Member{teamSize - 1 > 1 ? 's' : ''})
                      </span>
                    </div>

                    {Array.from({ length: teamSize - 1 }).map((_, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2"
                      >
                        <div className="text-[11px] font-mono text-cyan-300 font-bold">
                          Member {idx + 2} Details:
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          <div>
                            <label className="block text-[10px] font-mono text-slate-300 mb-0.5">
                              Full Name *
                            </label>
                            <input
                              type="text"
                              required
                              value={members[idx]?.name || ''}
                              onChange={(e) => {
                                const updated = [...members];
                                updated[idx] = { ...updated[idx], name: e.target.value };
                                setMembers(updated);
                              }}
                              placeholder="Teammate Full Name"
                              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-mono text-slate-300 mb-0.5">
                              USN / Student ID *
                            </label>
                            <input
                              type="text"
                              required
                              value={members[idx]?.usn || ''}
                              onChange={(e) => {
                                const updated = [...members];
                                updated[idx] = { ...updated[idx], usn: e.target.value.toUpperCase() };
                                setMembers(updated);
                              }}
                              placeholder="e.g., 3LA22CS012"
                              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-mono text-slate-400 mb-0.5">
                              Mobile Number (Optional)
                            </label>
                            <input
                              type="tel"
                              value={members[idx]?.phone || ''}
                              onChange={(e) => {
                                const updated = [...members];
                                updated[idx] = { ...updated[idx], phone: e.target.value };
                                setMembers(updated);
                              }}
                              placeholder="10-digit mobile"
                              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Bottom Fee Due Strip & Proceed Button */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
                  <div>
                    <span className="text-xs font-mono text-slate-400 block">Registration Fee Due:</span>
                    <span className="text-2xl font-black font-mono text-cyan-400">
                      {currentEvent.feeDisplay}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 ml-2">
                      ({currentEvent.name})
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-7 py-3 rounded-xl font-bold font-mono text-xs text-slate-950 bg-brand-gradient hover:opacity-95 shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Proceed to UPI Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* ---------------------------------------------------- */}
            {/* STEP 2: INSTANT UPI PAYMENT & UTR SUBMISSION */}
            {/* ---------------------------------------------------- */}
            {step === 'payment' && (
              <PaymentCard
                event={currentEvent}
                teamName={teamName}
                collegeName={collegeName}
                leaderName={leaderName}
                leaderEmail={leaderEmail}
                leaderPhone={leaderPhone}
                studentId={leaderUsn}
                branch={leaderBranch}
                year={leaderYear}
                themeId={selectedEvent === 'hackora' ? hackoraTheme : undefined}
                projectTitle={
                  selectedEvent === 'ideathon'
                    ? ideathonSolutionTitle
                    : selectedEvent === 'expo'
                    ? expoModelTitle
                    : undefined
                }
                members={members.slice(0, Math.max(0, teamSize - 1)).filter((m) => m.name.trim())}
                onSuccess={(record) => {
                  setReceiptRecord(record);
                  setStep('receipt');
                  triggerConfetti();
                }}
                onBack={() => setStep('details')}
              />
            )}

            {/* ---------------------------------------------------- */}
            {/* STEP 3: REGISTRATION PASS / VERIFIED DIGITAL RECEIPT */}
            {/* ---------------------------------------------------- */}
            {step === 'receipt' && receiptRecord && (
              <div className="space-y-4 py-2">
                {/* Official Ticket Card (Print Ready) */}
                <div
                  id="print-receipt-card"
                  className="relative rounded-3xl p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-cyan-500/40 shadow-2xl overflow-hidden font-mono"
                >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

                  {/* Header Badge */}
                  <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-2.5">
                      <RotatingO size="md" />
                      <div>
                        <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest">
                          INNOVATION FEST 2026 // ENTRY PASS
                        </div>
                        <div className="text-base font-black text-white font-display">
                          Lingaraj Appa Engineering College, Bidar
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Engineers' Day Celebrations • 21–22 September 2026
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                        Verification Pending
                      </span>
                      <div className="text-[10px] text-slate-400 mt-1">
                        Fee: ₹{receiptRecord.amount} (Paid via UPI)
                      </div>
                    </div>
                  </div>

                  {/* Unique Token Display */}
                  <div className="my-4 p-3.5 rounded-xl bg-slate-900/90 border border-cyan-500/30 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase text-slate-400 tracking-wider">
                        Official Registration Token
                      </div>
                      <div className="text-base sm:text-lg font-black text-cyan-300 tracking-wider font-mono">
                        {receiptRecord.registrationToken}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyToken(receiptRecord.registrationToken)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors flex items-center gap-1.5 text-xs"
                      title="Copy Token"
                    >
                      {copiedToken ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 text-[10px]">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-cyan-400" />
                          <span className="text-[10px]">Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Metadata Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs border-y border-slate-800/80 py-4">
                    <div>
                      <span className="text-slate-400 block text-[10px]">REGISTERED EVENT</span>
                      <span className="font-bold text-white text-sm">
                        {receiptRecord.eventName}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px]">TEAM NAME</span>
                      <span className="font-bold text-cyan-300 text-sm">
                        {receiptRecord.teamName}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px]">COLLEGE / INSTITUTION</span>
                      <span className="font-semibold text-slate-200">
                        {receiptRecord.collegeName}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px]">LEADER (USN & CONTACT)</span>
                      <span className="font-semibold text-slate-200">
                        {receiptRecord.leaderName} ({receiptRecord.studentId || '—'}) • {receiptRecord.leaderPhone}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px]">UPI REFERENCE (UTR)</span>
                      <span className="font-bold text-emerald-400 tracking-wider">
                        {receiptRecord.utrNumber}
                      </span>
                    </div>

                    {receiptRecord.themeId && (
                      <div className="col-span-1 sm:col-span-2">
                        <span className="text-slate-400 block text-[10px]">HACKATHON THEME / TRACK</span>
                        <span className="font-semibold text-cyan-300">
                          {receiptRecord.themeId}
                        </span>
                      </div>
                    )}

                    {receiptRecord.projectTitle && (
                      <div className="col-span-1 sm:col-span-2">
                        <span className="text-slate-400 block text-[10px]">
                          {receiptRecord.eventType === 'project_expo' || receiptRecord.eventType === 'expo' || receiptRecord.eventName?.toLowerCase().includes('expo')
                            ? 'WORKING MODEL / PROTOTYPE TITLE'
                            : receiptRecord.eventType === 'ideathon' || receiptRecord.eventName?.toLowerCase().includes('ideathon')
                            ? 'PROPOSED SOLUTION / PITCH TITLE'
                            : 'PROJECT TITLE'}
                        </span>
                        <span className="font-bold text-white">
                          {receiptRecord.projectTitle}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Additional Members List */}
                  {receiptRecord.members && receiptRecord.members.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs">
                      <span className="text-[10px] text-slate-400 block mb-1 uppercase">Team Members:</span>
                      <div className="space-y-1">
                        <div className="text-slate-300 text-[11px]">
                          1. {receiptRecord.leaderName} (Leader) — USN: {receiptRecord.studentId} | {receiptRecord.leaderEmail}
                        </div>
                        {receiptRecord.members.map((m, idx) => (
                          <div key={idx} className="text-slate-300 text-[11px]">
                            {idx + 2}. {m.name} — USN: {m.usn || '—'} | {m.email} | {m.phone}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Footer note & Synchronized database badge */}
                  <div className="pt-3 flex items-center justify-between text-[10px] text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>
                        {receiptRecord.source === 'supabase'
                          ? 'Synchronized to LAEC Cloud Supabase'
                          : 'Recorded to Secretariat Ledger (Offline Cache Ready)'}
                      </span>
                    </div>
                    <span>Issued: {new Date(receiptRecord.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* WhatsApp Secretariat Confirmation Action */}
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono space-y-2">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold">
                    <MessageCircle className="w-4 h-4" />
                    <span>Instant Secretariat WhatsApp Verification</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    To expedite immediate check-in and confirmation, send your pass token & UTR to the organizing committee desk on WhatsApp.
                  </p>
                  <a
                    href={`https://wa.me/918296612843?text=${encodeURIComponent(
                      `Hello LAEC Secretariat! We have registered for INNOVATION FEST 2026.\n\n*Registration Token:* ${receiptRecord.registrationToken}\n*Event:* ${receiptRecord.eventName}\n*Team Name:* ${receiptRecord.teamName}\n*College:* ${receiptRecord.collegeName}\n*Leader:* ${receiptRecord.leaderName} (USN: ${receiptRecord.studentId}, Phone: ${receiptRecord.leaderPhone})\n*Amount:* Rs.${receiptRecord.amount}\n*UTR Number:* ${receiptRecord.utrNumber}\n\nPlease verify our registration pass. Thank you!`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-mono text-xs transition-colors shadow-lg shadow-emerald-500/20"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Send Verification WhatsApp to Secretariat (+91 8296612843)</span>
                  </a>
                </div>

                {/* Print & Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-mono font-semibold flex items-center gap-2 transition-colors"
                  >
                    <Printer className="w-4 h-4 text-cyan-400" />
                    <span>Print / Save PDF</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-mono font-semibold transition-colors"
                    >
                      Register Another Event
                    </button>

                    <button
                      type="button"
                      onClick={handleClose}
                      className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-mono font-bold transition-colors"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* VIEW SAVED RECEIPTS / HISTORY VIEW */}
            {/* ---------------------------------------------------- */}
            {step === 'history' && (
              <div className="space-y-3 py-2">
                {storedRecords.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 font-mono text-xs space-y-3">
                    <FileText className="w-8 h-8 mx-auto text-slate-600" />
                    <p>No previous registrations saved in this browser yet.</p>
                    <button
                      onClick={() => setStep('details')}
                      className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold"
                    >
                      Register a Team
                    </button>
                  </div>
                ) : (
                  storedRecords.map((rec) => (
                    <div
                      key={rec.id || rec.registrationToken}
                      className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs font-mono hover:border-cyan-500/40 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="font-bold text-white text-sm">{rec.teamName}</span>
                          <span className="text-cyan-400 block text-[11px] font-bold">
                            {rec.registrationToken}
                          </span>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                          {rec.status === 'verified' ? 'Verified' : 'Pending Verification'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-slate-300 pt-1 text-[11px]">
                        <div>Event: {rec.eventName}</div>
                        <div>Fee Paid: ₹{rec.amount}</div>
                        <div>UTR: {rec.utrNumber}</div>
                        <div>Leader: {rec.leaderName}</div>
                      </div>

                      <div className="pt-2 flex items-center justify-between border-t border-slate-800/80">
                        <span className="text-[10px] text-slate-400">
                          {new Date(rec.created_at).toLocaleString()}
                        </span>

                        <a
                          href={`https://wa.me/918296612843?text=${encodeURIComponent(
                            `Hello LAEC Secretariat, inquiry regarding registration token: ${rec.registrationToken} for ${rec.teamName} (${rec.eventName}, UTR: ${rec.utrNumber}).`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Secretariat Help</span>
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Footer Helpline */}
          <div className="pt-3 mt-2 border-t border-slate-800 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 shrink-0 gap-2">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-cyan-400" />
              <span>Call: +91 7019301927</span>
            </span>

            <a
              href="https://wa.me/918296612843"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-emerald-400 hover:underline"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Secretariat: 8296612843</span>
            </a>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
