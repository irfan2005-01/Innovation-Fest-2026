import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  CheckCircle2,
  Download,
  Printer,
  ArrowLeft,
  X,
  Users,
  Edit3,
  Check,
  RefreshCw,
  Home,
  Filter,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PageId } from '../types';
import {
  HACKORA_CHALLENGE_TRACKS,
  getProblemStatementByCode,
} from '../data/hackoraTracksData';
import {
  TeamAllocationRecord,
  getStoredAllocations,
  saveTeamAllocation,
  exportAllocationsToCSV,
} from '../lib/allocations';
import { fetchAllPayments, getStoredPayments, PaymentRecord } from '../lib/supabase';
import { RotatingO } from '../components/HackoraLogo';

interface AllocationPageProps {
  onNavigate: (page: PageId) => void;
}

export const AllocationPage: React.FC<AllocationPageProps> = ({ onNavigate }) => {
  const [teams, setTeams] = useState<PaymentRecord[]>([]);
  const [allocations, setAllocations] = useState<Record<string, TeamAllocationRecord>>({});
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrackFilter, setSelectedTrackFilter] = useState<string>('all');
  const [eventScope, setEventScope] = useState<'hackora' | 'all'>('hackora');
  const [showMatrixBanner, setShowMatrixBanner] = useState(false);

  // Modal State for Assigning / Changing Problem Statement
  const [activeModalTeam, setActiveModalTeam] = useState<PaymentRecord | null>(null);
  const [modalSelectedTrack, setModalSelectedTrack] = useState<string>('01');
  const [modalSelectedPSCode, setModalSelectedPSCode] = useState<string>('AI-01');
  const [modalCustomNotes, setModalCustomNotes] = useState<string>('');

  // ---------------------------------------------------------------------------
  // 1. DATA INITIALIZATION
  // ---------------------------------------------------------------------------
  const loadData = async () => {
    try {
      setAllocations(getStoredAllocations());
      const res = await fetchAllPayments();
      if (res.records && res.records.length > 0) {
        setTeams(res.records);
      } else {
        const local = getStoredPayments();
        setTeams(local);
      }
    } catch (err) {
      console.error('Error fetching teams:', err);
      const local = getStoredPayments();
      setTeams(local);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await loadData();
      setLoading(false);
    };
    init();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
    setToastMessage('✓ Teams and allocations synchronized');
    setTimeout(() => setToastMessage(null), 2500);
  };

  // ---------------------------------------------------------------------------
  // 2. SEARCH & FILTERED TEAMS LIST
  // ---------------------------------------------------------------------------
  const filteredTeams = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return teams.filter((team) => {
      // Event Scope Filter (default to Hackora teams only)
      if (eventScope === 'hackora') {
        const isHackora =
          team.eventType === 'hackora' ||
          (team.eventName ? team.eventName.toLowerCase().includes('hackora') : false);
        if (!isHackora) return false;
      }

      // Track Allocation Lookup
      const allocation =
        allocations[team.id] ||
        (team.registrationToken ? allocations[team.registrationToken] : null) ||
        (team.teamName ? allocations[`name_${team.teamName.toLowerCase().trim()}`] : null);

      // Track Filter
      if (selectedTrackFilter !== 'all') {
        if (selectedTrackFilter === 'unallocated') {
          if (allocation && allocation.problemStatementCode) return false;
        } else {
          if (!allocation || allocation.trackNumber !== selectedTrackFilter) {
            return false;
          }
        }
      }

      // Search Query Matching
      if (!q) return true;

      const teamNameMatches = team.teamName ? team.teamName.toLowerCase().includes(q) : false;
      const leaderNameMatches = team.leaderName ? team.leaderName.toLowerCase().includes(q) : false;
      const collegeMatches = team.collegeName ? team.collegeName.toLowerCase().includes(q) : false;
      const tokenMatches = team.registrationToken ? team.registrationToken.toLowerCase().includes(q) : false;
      const phoneMatches = team.leaderPhone ? team.leaderPhone.includes(q) : false;
      const idMatches = team.id ? team.id.toLowerCase().includes(q) : false;

      const psCodeMatches = allocation?.problemStatementCode
        ? allocation.problemStatementCode.toLowerCase().includes(q)
        : false;
      const psTitleMatches = allocation?.problemStatementTitle
        ? allocation.problemStatementTitle.toLowerCase().includes(q)
        : false;

      return (
        teamNameMatches ||
        leaderNameMatches ||
        collegeMatches ||
        tokenMatches ||
        phoneMatches ||
        idMatches ||
        psCodeMatches ||
        psTitleMatches
      );
    });
  }, [teams, searchQuery, selectedTrackFilter, eventScope, allocations]);

  // Statistics Summary
  const stats = useMemo(() => {
    let allocatedCount = 0;
    let unallocatedCount = 0;
    const trackCounts: Record<string, number> = {
      '01': 0,
      '02': 0,
      '03': 0,
      '04': 0,
      '05': 0,
      '06': 0,
      OPEN: 0,
    };

    const hackoraTeams = teams.filter((t) =>
      eventScope === 'all'
        ? true
        : t.eventType === 'hackora' || (t.eventName && t.eventName.toLowerCase().includes('hackora'))
    );

    hackoraTeams.forEach((t) => {
      const alloc =
        allocations[t.id] ||
        (t.registrationToken ? allocations[t.registrationToken] : null) ||
        (t.teamName ? allocations[`name_${t.teamName.toLowerCase().trim()}`] : null);

      if (alloc && alloc.problemStatementCode) {
        allocatedCount++;
        if (trackCounts[alloc.trackNumber] !== undefined) {
          trackCounts[alloc.trackNumber]++;
        } else {
          trackCounts['OPEN']++;
        }
      } else {
        unallocatedCount++;
      }
    });

    return {
      total: hackoraTeams.length,
      allocated: allocatedCount,
      unallocated: unallocatedCount,
      tracks: trackCounts,
    };
  }, [teams, allocations, eventScope]);

  // ---------------------------------------------------------------------------
  // 3. MODAL ACTIONS (ASSIGN / UPDATE ALLOCATION)
  // ---------------------------------------------------------------------------
  const handleOpenAssignModal = (team: PaymentRecord) => {
    setActiveModalTeam(team);

    // If already allocated, populate existing data
    const existing =
      allocations[team.id] ||
      (team.registrationToken ? allocations[team.registrationToken] : null) ||
      (team.teamName ? allocations[`name_${team.teamName.toLowerCase().trim()}`] : null);

    if (existing) {
      setModalSelectedTrack(existing.trackNumber || '01');
      setModalSelectedPSCode(existing.problemStatementCode || 'AI-01');
      setModalCustomNotes(existing.customNotes || '');
    } else {
      // Default initial Track 01, AI-01
      setModalSelectedTrack('01');
      setModalSelectedPSCode('AI-01');
      setModalCustomNotes(team.projectTitle || '');
    }
  };

  const handleSaveAllocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalTeam) return;

    const trackObj = HACKORA_CHALLENGE_TRACKS.find((t) => t.number === modalSelectedTrack);
    const psObj = getProblemStatementByCode(modalSelectedPSCode);

    const teamIdentifier = activeModalTeam.registrationToken || activeModalTeam.id;

    const newAllocation: TeamAllocationRecord = {
      teamId: teamIdentifier,
      teamName: activeModalTeam.teamName,
      leaderName: activeModalTeam.leaderName,
      leaderPhone: activeModalTeam.leaderPhone,
      leaderEmail: activeModalTeam.leaderEmail,
      collegeName: activeModalTeam.collegeName,
      members: activeModalTeam.members?.map((m) => m.name),
      trackNumber: modalSelectedTrack,
      trackName: trackObj?.themeName || (modalSelectedTrack === 'OPEN' ? 'Open Innovation' : 'Custom Track'),
      problemStatementCode: modalSelectedPSCode,
      problemStatementTitle: psObj?.title || modalCustomNotes || 'Custom Solution',
      customNotes: modalCustomNotes.trim(),
      allocatedAt: new Date().toISOString(),
    };

    const updated = saveTeamAllocation(newAllocation);
    setAllocations(updated);

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#00F2FE', '#8B5CF6', '#10B981', '#F5EE38'],
    });

    setToastMessage(
      `✓ Allocated [${newAllocation.problemStatementCode}] to "${activeModalTeam.teamName}"`
    );
    setTimeout(() => setToastMessage(null), 3500);
    setActiveModalTeam(null);
  };

  // ---------------------------------------------------------------------------
  // 4. EXPORT HANDLERS (PROPER PDF PRINT & CSV)
  // ---------------------------------------------------------------------------
  const handleTriggerPrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const recordsToExport = filteredTeams.map((team, idx) => {
      const alloc =
        allocations[team.id] ||
        (team.registrationToken ? allocations[team.registrationToken] : null) ||
        (team.teamName ? allocations[`name_${team.teamName.toLowerCase().trim()}`] : null);

      const membersSummary = team.members?.map((m) => m.name).join(', ') || 'N/A';

      return {
        slNo: idx + 1,
        teamId: team.registrationToken || team.studentId || team.id,
        teamName: team.teamName,
        leaderName: team.leaderName,
        leaderPhone: team.leaderPhone || 'N/A',
        collegeName: team.collegeName,
        membersSummary,
        trackNumber: alloc?.trackNumber || 'UNASSIGNED',
        trackName: alloc?.trackName || 'Pending Allocation',
        psCode: alloc?.problemStatementCode || 'PENDING',
        psTitle: alloc?.problemStatementTitle || 'None Selected',
        customNotes: alloc?.customNotes || '',
        status: alloc?.problemStatementCode ? 'Allocated' : 'Pending',
      };
    });

    exportAllocationsToCSV(recordsToExport);
  };

  return (
    <div className="space-y-6 pb-28 pt-2">
      {/* --------------------------------------------------------------------- */}
      {/* 1. TOP HEADER & NAVIGATION */}
      {/* --------------------------------------------------------------------- */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
            <RotatingO size="sm" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 font-mono text-[10px] font-bold uppercase tracking-wider">
                HACKORA 2026 // ALLOCATION DESK
              </span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-[10px] font-bold">
                6 CHALLENGE TRACKS
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black font-display text-white tracking-tight mt-0.5">
              Theme & Problem Statement Allocation Desk
            </h1>
            <p className="text-xs font-mono text-slate-400">
              Lingaraj Appa Engineering College, Bidar • 24-Hour National Hackathon
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowMatrixBanner((prev) => !prev)}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 hover:text-white text-xs font-mono font-bold transition-colors flex items-center gap-1.5"
            title="Toggle Challenge Tracks and Problem Statements Matrix"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">
              {showMatrixBanner ? 'Hide Tracks Matrix' : 'View Tracks Matrix'}
            </span>
          </button>

          <button
            type="button"
            onClick={handleTriggerPrint}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-95 text-slate-950 font-mono text-xs font-black transition-all flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 active:scale-[0.99]"
            title="Export official printable ledger formatted for PDF generation"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Export PDF / Print</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold transition-colors flex items-center gap-1.5"
            title="Download CSV Spreadsheet of all allocated teams"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Refresh teams list"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => onNavigate('admin')}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 hover:text-white text-xs font-mono font-bold transition-colors flex items-center gap-1.5"
            title="Return to Admin Secretariat Desk"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Return to Fest Home"
          >
            <Home className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="p-3.5 rounded-2xl bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold flex items-center gap-2 shadow-lg"
        >
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{toastMessage}</span>
        </motion.div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* 2. OFFICIAL HACKORA 2026 CHALLENGE TRACKS & PS MATRIX (BANNER) */}
      {/* --------------------------------------------------------------------- */}
      {showMatrixBanner && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="p-5 rounded-2xl bg-slate-950/90 border border-purple-500/40 space-y-4 shadow-2xl"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider">
                  Official Problem Statements Matrix (19 Total Across 6 Tracks)
                </h3>
              </div>
              <p className="text-xs font-mono text-slate-400">
                Lingaraj Appa Engineering College, Bidar • HACKORA 2026 Challenge Tracks
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowMatrixBanner(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {HACKORA_CHALLENGE_TRACKS.map((track) => (
              <div
                key={track.id}
                className={`p-4 rounded-xl bg-slate-900/90 border ${track.borderColor} space-y-2 text-xs font-mono`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-white font-bold font-mono text-[10px]">
                      {track.number}
                    </span>
                    <span className={`font-bold text-xs ${track.textColor}`}>
                      {track.themeName}
                    </span>
                  </div>
                </div>

                <ul className="space-y-1.5 pt-1 text-slate-300">
                  {track.problemStatements.map((ps) => (
                    <li key={ps.id} className="flex items-start gap-1.5 leading-tight">
                      <span className="text-cyan-400 font-bold shrink-0">[{ps.code}]</span>
                      <span className="text-white">{ps.title}</span>
                      {ps.isNew && (
                        <span className="ml-1 px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 text-[9px] font-black uppercase">
                          NEW
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* 3. TRACK FILTER PILLS & METRICS RIBBON */}
      {/* --------------------------------------------------------------------- */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3.5">
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by team name, leader, college, USN, PS code (e.g. AI-01, SE-04)..."
              className="w-full pl-11 pr-10 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs placeholder-slate-500 focus:outline-none focus:border-purple-400 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-white p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setEventScope(eventScope === 'hackora' ? 'all' : 'hackora')}
              className={`px-3 py-3 rounded-xl border text-xs font-mono font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                eventScope === 'hackora'
                  ? 'bg-purple-500/15 border-purple-500/50 text-purple-300'
                  : 'bg-slate-800 border-slate-700 text-slate-300'
              }`}
              title="Toggle event scope"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>{eventScope === 'hackora' ? 'Hackora Teams' : 'All Fest Teams'}</span>
            </button>
          </div>
        </div>

        {/* Track Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 font-mono text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedTrackFilter('all')}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                selectedTrackFilter === 'all'
                  ? 'bg-purple-500 text-white border-purple-500 font-bold shadow-md shadow-purple-500/20'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              All Teams ({stats.total})
            </button>

            {HACKORA_CHALLENGE_TRACKS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedTrackFilter(t.number)}
                className={`px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                  selectedTrackFilter === t.number
                    ? `${t.badgeColor} font-bold shadow-md`
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                <span>Track {t.number}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950/60 font-mono">
                  {stats.tracks[t.number] || 0}
                </span>
              </button>
            ))}

            <button
              type="button"
              onClick={() => setSelectedTrackFilter('unallocated')}
              className={`px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                selectedTrackFilter === 'unallocated'
                  ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
              }`}
            >
              <span>Unallocated</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950/60 font-mono">
                {stats.unallocated}
              </span>
            </button>
          </div>

          <div className="text-slate-400 text-[11px]">
            Showing <span className="text-white font-bold">{filteredTeams.length}</span> teams •{' '}
            <span className="text-emerald-400 font-bold">{stats.allocated} allocated</span> •{' '}
            <span className="text-amber-400 font-bold">{stats.unallocated} pending</span>
          </div>
        </div>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* 4. MAIN PARTICIPANT TEAMS ALLOCATION TABLE */}
      {/* --------------------------------------------------------------------- */}
      {loading ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-400 font-mono text-xs">
          <div className="w-8 h-8 mx-auto mb-2 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
          <p>Loading hackathon participants...</p>
        </div>
      ) : filteredTeams.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-400 font-mono text-xs space-y-3">
          <Users className="w-8 h-8 mx-auto text-slate-600" />
          <p className="text-white font-bold text-sm">No teams found matching current filters</p>
          <p className="text-slate-400">Try clearing the search query or selecting "All Teams".</p>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:text-white"
            >
              Clear Search Filter
            </button>
          )}
        </div>
      ) : (
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3 text-center w-12">#</th>
                  <th className="py-3 px-4">Team Details</th>
                  <th className="py-3 px-4">Leader & College</th>
                  <th className="py-3 px-4">Team Members</th>
                  <th className="py-3 px-4">Assigned Track</th>
                  <th className="py-3 px-4">Problem Statement</th>
                  <th className="py-3 px-4 text-right">Allocation Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredTeams.map((team, index) => {
                  const alloc =
                    allocations[team.id] ||
                    (team.registrationToken ? allocations[team.registrationToken] : null) ||
                    (team.teamName ? allocations[`name_${team.teamName.toLowerCase().trim()}`] : null);

                  const trackInfo = alloc?.trackNumber
                    ? HACKORA_CHALLENGE_TRACKS.find((t) => t.number === alloc.trackNumber)
                    : null;

                  const hasPS = Boolean(alloc?.problemStatementCode);

                  return (
                    <tr
                      key={team.id}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        hasPS ? 'bg-slate-900/40' : 'bg-amber-500/[0.03]'
                      }`}
                    >
                      {/* Sl. No. */}
                      <td className="py-3 px-3 text-center text-slate-500 font-bold">
                        {index + 1}
                      </td>

                      {/* Team Details */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-white text-sm">{team.teamName}</div>
                        <div className="text-[10px] text-cyan-400">
                          {team.registrationToken || team.studentId || team.id}
                        </div>
                        {team.arrived && (
                          <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[9px] font-bold">
                            ✓ Arrived
                          </span>
                        )}
                      </td>

                      {/* Leader & College */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-200">{team.leaderName}</div>
                        {team.leaderPhone && (
                          <div className="text-[10px] text-slate-400">{team.leaderPhone}</div>
                        )}
                        <div className="text-[10px] text-slate-400 truncate max-w-[180px]">
                          {team.collegeName}
                        </div>
                      </td>

                      {/* Members */}
                      <td className="py-3 px-4">
                        {team.members && team.members.length > 0 ? (
                          <div className="text-[11px] text-slate-300 max-w-[200px]">
                            {team.members.map((m) => m.name).join(', ')}
                          </div>
                        ) : (
                          <span className="text-slate-500 text-[10px]">Leader Only</span>
                        )}
                      </td>

                      {/* Assigned Track */}
                      <td className="py-3 px-4">
                        {alloc?.trackNumber ? (
                          <div className="space-y-1">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                                trackInfo?.badgeColor || 'bg-purple-500/15 text-purple-300 border-purple-500/40'
                              }`}
                            >
                              Track {alloc.trackNumber}: {alloc.trackName}
                            </span>
                          </div>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-medium">
                            Unallocated
                          </span>
                        )}
                      </td>

                      {/* Assigned Problem Statement */}
                      <td className="py-3 px-4">
                        {hasPS ? (
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold text-[10px] border border-cyan-500/30">
                                {alloc.problemStatementCode}
                              </span>
                              <span className="font-bold text-white text-xs">
                                {alloc.problemStatementTitle}
                              </span>
                            </div>
                            {alloc.customNotes && (
                              <div className="text-[10px] text-slate-400 italic truncate max-w-[220px]">
                                Note: {alloc.customNotes}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-500 text-[11px] italic">
                            No PS selected yet
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleOpenAssignModal(team)}
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all inline-flex items-center gap-1.5 ${
                            hasPS
                              ? 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700'
                              : 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:opacity-95 shadow-md shadow-purple-500/20'
                          }`}
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>{hasPS ? 'Change PS' : 'Assign PS'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* 5. MODAL: ASSIGN / CHANGE PROBLEM STATEMENT */}
      {/* --------------------------------------------------------------------- */}
      <AnimatePresence>
        {activeModalTeam && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl text-left space-y-5 relative"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono text-[10px] font-bold">
                      {activeModalTeam.registrationToken || activeModalTeam.id}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      {activeModalTeam.collegeName}
                    </span>
                  </div>
                  <h3 className="text-xl font-black font-display text-white mt-1">
                    Assign PS for "{activeModalTeam.teamName}"
                  </h3>
                  <p className="text-xs font-mono text-slate-400">
                    Leader: <strong className="text-slate-200">{activeModalTeam.leaderName}</strong>
                    {activeModalTeam.leaderPhone && ` • Phone: ${activeModalTeam.leaderPhone}`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveModalTeam(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveAllocation} className="space-y-4 font-mono text-xs">
                {/* Step 1: Select Track / Theme */}
                <div>
                  <label className="block text-slate-200 font-bold uppercase tracking-wider mb-2">
                    Step 1: Select Challenge Track (01 to 06) *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {HACKORA_CHALLENGE_TRACKS.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          setModalSelectedTrack(t.number);
                          // Auto-select first PS in that track
                          if (t.problemStatements.length > 0) {
                            setModalSelectedPSCode(t.problemStatements[0].code);
                          }
                        }}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          modalSelectedTrack === t.number
                            ? `${t.badgeColor} shadow-md border-current font-bold ring-1 ring-current`
                            : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="px-1.5 py-0.5 rounded bg-slate-900 text-[10px] font-bold">
                            Track {t.number}
                          </span>
                          {modalSelectedTrack === t.number && (
                            <Check className="w-4 h-4 text-cyan-400" />
                          )}
                        </div>
                        <div className="font-display font-bold text-xs text-white">
                          {t.themeName}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 2: Select Problem Statement */}
                <div>
                  <label className="block text-slate-200 font-bold uppercase tracking-wider mb-2">
                    Step 2: Select Problem Statement for Track {modalSelectedTrack} *
                  </label>

                  {/* Filtered PS for the selected track */}
                  <div className="space-y-2">
                    {HACKORA_CHALLENGE_TRACKS.find((t) => t.number === modalSelectedTrack)
                      ?.problemStatements.map((ps) => (
                        <div
                          key={ps.id}
                          onClick={() => setModalSelectedPSCode(ps.code)}
                          className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                            modalSelectedPSCode === ps.code
                              ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-md'
                              : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`px-2 py-0.5 rounded font-mono font-bold text-xs ${
                                modalSelectedPSCode === ps.code
                                  ? 'bg-cyan-400 text-slate-950'
                                  : 'bg-slate-800 text-cyan-300'
                              }`}
                            >
                              {ps.code}
                            </span>
                            <span className="font-bold text-sm text-white">
                              {ps.title}
                            </span>
                            {ps.isNew && (
                              <span className="px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 text-[9px] font-black uppercase">
                                NEW
                              </span>
                            )}
                          </div>

                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                              modalSelectedPSCode === ps.code
                                ? 'bg-cyan-400 border-cyan-400 text-slate-950'
                                : 'border-slate-700 bg-slate-800'
                            }`}
                          >
                            {modalSelectedPSCode === ps.code && <Check className="w-3.5 h-3.5" />}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Optional Custom Notes */}
                <div>
                  <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1">
                    Custom Project Focus / Sub-Title (Optional)
                  </label>
                  <input
                    type="text"
                    value={modalCustomNotes}
                    onChange={(e) => setModalCustomNotes(e.target.value)}
                    placeholder="e.g. Focus on Kannada voice assistant, IoT edge hardware, specific API..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-400 text-xs"
                  />
                </div>

                {/* Footer Buttons */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveModalTeam(null)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-95 text-slate-950 font-black text-xs transition-all shadow-lg shadow-cyan-500/20 active:scale-[0.99] flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm & Save Allocation</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --------------------------------------------------------------------- */}
      {/* 6. OFFICIAL PRINT LAYOUT (FOR BROWSER PRINT / EXPORT PDF) */}
      {/* --------------------------------------------------------------------- */}
      <div id="print-allocation-ledger" className="hidden print:block text-black bg-white p-6 font-sans">
        {/* Institutional Header */}
        <div className="text-center border-b-2 border-black pb-3 mb-4">
          <h1 className="text-xl font-bold uppercase tracking-wide">
            Lingaraj Appa Engineering College, Bidar
          </h1>
          <p className="text-xs uppercase font-semibold text-gray-700">
            Approved by AICTE, New Delhi • Affiliated to VTU, Belagavi
          </p>
          <h2 className="text-lg font-black uppercase mt-1 tracking-wider">
            HACKORA 2026 – 24-Hour National Level Hackathon
          </h2>
          <h3 className="text-sm font-bold uppercase underline mt-0.5">
            Official Theme & Problem Statement Allocation Ledger
          </h3>
        </div>

        {/* Ledger Metadata Bar */}
        <div className="flex justify-between items-center text-xs mb-3 font-mono border border-black p-2">
          <div>
            <strong>Filter Track:</strong>{' '}
            {selectedTrackFilter === 'all'
              ? 'All 6 Challenge Tracks'
              : `Track ${selectedTrackFilter}`}
          </div>
          <div>
            <strong>Total Teams Listed:</strong> {filteredTeams.length}
          </div>
          <div>
            <strong>Date & Time:</strong> {new Date().toLocaleString()}
          </div>
        </div>

        {/* Official Ledger Table */}
        <table className="w-full text-xs border-collapse border border-black mb-6">
          <thead>
            <tr className="bg-gray-100 border-b border-black text-left">
              <th className="border border-black p-1.5 text-center w-8">Sl.</th>
              <th className="border border-black p-1.5 w-24">Team ID</th>
              <th className="border border-black p-1.5 w-36">Team Name</th>
              <th className="border border-black p-1.5 w-32">Leader & Contact</th>
              <th className="border border-black p-1.5 w-36">College Name</th>
              <th className="border border-black p-1.5 w-32">Assigned Track</th>
              <th className="border border-black p-1.5">Problem Statement (Code & Title)</th>
              <th className="border border-black p-1.5 w-20 text-center">Sign / Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredTeams.map((team, idx) => {
              const alloc =
                allocations[team.id] ||
                (team.registrationToken ? allocations[team.registrationToken] : null) ||
                (team.teamName ? allocations[`name_${team.teamName.toLowerCase().trim()}`] : null);

              return (
                <tr key={team.id} className="border-b border-black">
                  <td className="border border-black p-1.5 text-center font-bold">{idx + 1}</td>
                  <td className="border border-black p-1.5 font-mono text-[10px]">
                    {team.registrationToken || team.studentId || team.id}
                  </td>
                  <td className="border border-black p-1.5 font-bold">{team.teamName}</td>
                  <td className="border border-black p-1.5">
                    <div>{team.leaderName}</div>
                    <div className="text-[10px] text-gray-600">{team.leaderPhone || '-'}</div>
                  </td>
                  <td className="border border-black p-1.5 text-[10px]">{team.collegeName}</td>
                  <td className="border border-black p-1.5 text-[10px]">
                    {alloc?.trackNumber ? (
                      <strong>Track {alloc.trackNumber}: {alloc.trackName}</strong>
                    ) : (
                      <span className="italic text-gray-500">Unallocated</span>
                    )}
                  </td>
                  <td className="border border-black p-1.5">
                    {alloc?.problemStatementCode ? (
                      <div>
                        <strong>[{alloc.problemStatementCode}]</strong> {alloc.problemStatementTitle}
                        {alloc.customNotes && (
                          <div className="text-[9px] text-gray-600">Note: {alloc.customNotes}</div>
                        )}
                      </div>
                    ) : (
                      <span className="italic text-gray-500">Pending Assignment</span>
                    )}
                  </td>
                  <td className="border border-black p-1.5 text-center text-[10px]">
                    {alloc?.problemStatementCode ? 'Allocated' : 'Pending'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Track-wise Statistics Summary */}
        <div className="border border-black p-3 text-xs mb-6 font-mono">
          <div className="font-bold uppercase mb-1 underline">
            Track-wise Allocation Summary
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div><strong>Track 01 (Agentic AI):</strong> {stats.tracks['01'] || 0} teams</div>
            <div><strong>Track 02 (Cybersecurity):</strong> {stats.tracks['02'] || 0} teams</div>
            <div><strong>Track 03 (HealthTech):</strong> {stats.tracks['03'] || 0} teams</div>
            <div><strong>Track 04 (Agritech):</strong> {stats.tracks['04'] || 0} teams</div>
            <div><strong>Track 05 (Smart Infra):</strong> {stats.tracks['05'] || 0} teams</div>
            <div><strong>Track 06 (Smart Education):</strong> {stats.tracks['06'] || 0} teams</div>
            <div><strong>Total Allocated:</strong> {stats.allocated} teams</div>
            <div><strong>Total Pending:</strong> {stats.unallocated} teams</div>
            <div><strong>Grand Total:</strong> {stats.total} teams</div>
          </div>
        </div>

        {/* Signatures */}
        <div className="flex justify-between items-end text-xs font-mono mt-12 pt-8">
          <div className="text-center">
            <div className="w-48 border-b border-black mb-1" />
            <span>Hackathon Student Lead</span>
          </div>
          <div className="text-center">
            <div className="w-48 border-b border-black mb-1" />
            <span>Faculty Event Coordinator</span>
          </div>
          <div className="text-center">
            <div className="w-48 border-b border-black mb-1" />
            <span>Head of Jury / Secretariat</span>
          </div>
        </div>
      </div>
    </div>
  );
};
