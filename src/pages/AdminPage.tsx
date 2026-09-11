import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  Unlock,
  CheckCircle2,
  Clock,
  Search,
  Download,
  RefreshCw,
  Database,
  MessageCircle,
  Trash2,
  Users,
  X,
  Copy,
  Check,
  AlertTriangle,
  Code2,
  LogOut,
  IndianRupee,
  Eye,
  ExternalLink,
  UploadCloud,
} from 'lucide-react';
import {
  fetchAllPayments,
  updatePaymentStatus,
  deletePaymentRecord,
  exportPaymentsToCSV,
  syncLocalPaymentsToSupabase,
  PaymentRecord,
  isSupabaseConfigured,
} from '../lib/supabase';
import { PageId } from '../types';
import { RotatingO } from '../components/HackoraLogo';

interface AdminPageProps {
  onNavigate: (page: PageId) => void;
  onOpenRegister: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate, onOpenRegister }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Data State
  const [records, setRecords] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [supabaseLive, setSupabaseLive] = useState(false);
  const [supabaseCount, setSupabaseCount] = useState(0);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<'all' | 'hackora' | 'ideathon' | 'project_expo'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');

  // Modals & Drawers
  const [selectedRecord, setSelectedRecord] = useState<PaymentRecord | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchAllPayments();
      setRecords(res.records);
      setSupabaseLive(res.supabaseLive);
      setSupabaseCount(res.supabaseCount);
    } catch (err) {
      console.error('Error fetching payments:', err);
    } finally {
      setLoading(false);
    }
  };

  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncToCloud = async () => {
    setIsSyncing(true);
    try {
      const res = await syncLocalPaymentsToSupabase();
      if (res.success && res.syncedCount > 0) {
        setActionSuccessMessage(`Successfully uploaded ${res.syncedCount} local registration(s) to Supabase Cloud!`);
        await loadData();
      } else if (res.syncedCount === 0) {
        setActionSuccessMessage('All records are already in the cloud.');
      } else {
        setActionSuccessMessage(`Notice: ${res.error || 'Sync could not complete.'}`);
      }
    } catch (e: any) {
      setActionSuccessMessage('Sync error: ' + (e?.message || 'Check database connection'));
    } finally {
      setIsSyncing(false);
      setTimeout(() => setActionSuccessMessage(null), 4500);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetch('/api/admin/session')
      .then((response) => setIsAuthenticated(response.ok))
      .catch(() => setIsAuthenticated(false));
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode }),
      });
      const result = await response.json().catch(() => ({}));
      if (response.ok && result.success) {
        setIsAuthenticated(true);
        setAuthError(null);
        return;
      } else if (response.status === 401) {
        setAuthError(result.error || 'Incorrect Secretariat passcode. Access restricted.');
        return;
      }
    } catch {
      // Backend service unreachable (e.g. running on Vite dev server without Vercel API routes)
    }

    // Localhost dev preview fallback
    const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    if (isLocal && (passcode === 'laec2026' || passcode === 'admin2026' || passcode === 'fest2026')) {
      setIsAuthenticated(true);
      setAuthError(null);
      return;
    }

    setAuthError('Could not reach the secure admin service. (For local preview testing, use passcode: laec2026)');
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' }).catch(() => undefined);
    setIsAuthenticated(false);
    setPasscode('');
  };

  const handleStatusChange = async (id: string, newStatus: 'pending' | 'verified' | 'rejected') => {
    await updatePaymentStatus(id, newStatus);
    setRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    if (selectedRecord && selectedRecord.id === id) {
      setSelectedRecord({ ...selectedRecord, status: newStatus });
    }
    setActionSuccessMessage(`Payment status updated to ${newStatus.toUpperCase()}`);
    setTimeout(() => setActionSuccessMessage(null), 3000);
  };

  const handleDelete = async (id: string, teamName: string) => {
    if (window.confirm(`Are you sure you want to delete registration for "${teamName}"?`)) {
      await deletePaymentRecord(id);
      setRecords((prev) => prev.filter((r) => r.id !== id));
      if (selectedRecord?.id === id) setSelectedRecord(null);
      setActionSuccessMessage('Record removed.');
      setTimeout(() => setActionSuccessMessage(null), 3000);
    }
  };

  // Metrics Calculations
  const verifiedRevenue = records
    .filter((r) => r.status === 'verified')
    .reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
  const totalRevenue = records.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
  const verifiedCount = records.filter((r) => r.status === 'verified').length;
  const pendingCount = records.filter((r) => r.status === 'pending').length;
  const rejectedCount = records.filter((r) => r.status === 'rejected').length;

  const hackoraCount = records.filter(
    (r) => r.eventType === 'hackora' || r.eventName?.toLowerCase().includes('hackora')
  ).length;
  const ideathonCount = records.filter(
    (r) => r.eventType === 'ideathon' || r.eventName?.toLowerCase().includes('ideathon')
  ).length;
  const expoCount = records.filter(
    (r) =>
      r.eventType === 'project_expo' ||
      r.eventType === 'expo' ||
      r.eventName?.toLowerCase().includes('expo')
  ).length;
  const localRecordsCount = records.filter((r) => r.source === 'local_fallback').length;

  // Filtered Records
  const filteredRecords = records.filter((r) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      r.teamName?.toLowerCase().includes(q) ||
      r.leaderName?.toLowerCase().includes(q) ||
      r.leaderPhone?.toLowerCase().includes(q) ||
      r.leaderEmail?.toLowerCase().includes(q) ||
      r.studentId?.toLowerCase().includes(q) ||
      r.utrNumber?.toLowerCase().includes(q) ||
      r.payerName?.toLowerCase().includes(q) ||
      r.payerUpiId?.toLowerCase().includes(q) ||
      r.registrationToken?.toLowerCase().includes(q) ||
      r.collegeName?.toLowerCase().includes(q);

    const matchesEvent =
      selectedEvent === 'all' ||
      (selectedEvent === 'hackora' &&
        (r.eventType === 'hackora' || r.eventName?.toLowerCase().includes('hackora'))) ||
      (selectedEvent === 'ideathon' &&
        (r.eventType === 'ideathon' || r.eventName?.toLowerCase().includes('ideathon'))) ||
      (selectedEvent === 'project_expo' &&
        (r.eventType === 'project_expo' ||
          r.eventType === 'expo' ||
          r.eventName?.toLowerCase().includes('expo')));

    const matchesStatus = selectedStatus === 'all' || r.status === selectedStatus;

    return matchesQuery && matchesEvent && matchesStatus;
  });

  const sqlSnippet = `-- Secure database access is configured in:
-- supabase/secure-server-access.sql
--
-- Run that file once in the Supabase SQL Editor after the Vercel API
-- environment variables are configured. Do not create public SELECT,
-- INSERT, UPDATE, or DELETE policies for the payments table.`;

  const copySqlToClipboard = () => {
    navigator.clipboard.writeText(sqlSnippet);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  // --------------------------------------------------------------------------
  // LOCKED LOGIN SCREEN
  // --------------------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="w-full max-w-md p-8 rounded-3xl bg-slate-900/90 border border-slate-700 shadow-2xl backdrop-blur-xl text-center space-y-6"
        >
          <div className="mx-auto w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/10">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
              LAEC Secretariat Portal
            </div>
            <h2 className="text-2xl font-black font-display text-white">
              Admin & Payments Desk
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-1.5">
              Authorized access only for Lingaraj Appa Engineering College fest committee.
            </p>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-mono flex items-center gap-2 text-left">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">
                Secretariat Access Passcode
              </label>
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter admin passcode"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-sm focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl font-bold font-mono text-xs text-slate-950 bg-brand-gradient hover:opacity-95 shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              <span>Unlock Admin Desk</span>
            </button>
          </form>

          <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-500 flex items-center justify-between">
            <span className="text-slate-500">Authorized Committee Members Only</span>
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="text-slate-400 hover:text-white underline"
            >
              Back to Fest Home
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // AUTHENTICATED ADMIN DASHBOARD
  // --------------------------------------------------------------------------
  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0">
            <RotatingO size="md" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
              <span>LAEC BIDAR // SECRETARIAT PORTAL</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span className="text-slate-400">INNOVATION FEST 2026</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-display text-white">
              Registrations & Payments Ledger
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Supabase Status Indicator */}
          <div
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-2 ${
              isSupabaseConfigured
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isSupabaseConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            <span>
              {isSupabaseConfigured
                ? `Supabase: ${supabaseLive ? `${supabaseCount} rows` : 'Online'}`
                : 'Supabase Key Pending'}
            </span>
          </div>

          <button
            onClick={() => setShowSqlModal(true)}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 text-xs font-mono flex items-center gap-1.5 transition-colors"
            title="View Supabase Setup SQL"
          >
            <Code2 className="w-4 h-4" />
            <span className="hidden sm:inline">Supabase SQL</span>
          </button>

          <button
            onClick={loadData}
            disabled={loading}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 text-cyan-400 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {localRecordsCount > 0 && (
            <button
              onClick={handleSyncToCloud}
              disabled={isSyncing}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:opacity-95 text-slate-950 font-mono text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-500/25 transition-all"
              title="Upload records saved on this device to Supabase Cloud"
            >
              <UploadCloud className={`w-4 h-4 ${isSyncing ? 'animate-bounce' : ''}`} />
              <span>{isSyncing ? 'Uploading...' : `Upload ${localRecordsCount} to Cloud`}</span>
            </button>
          )}

          <button
            onClick={() => exportPaymentsToCSV(filteredRecords)}
            disabled={records.length === 0}
            className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold flex items-center gap-2 transition-colors disabled:opacity-40"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleLogout}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors"
            title="Lock Portal"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {actionSuccessMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{actionSuccessMessage}</span>
        </motion.div>
      )}

      {/* Metrics Row - Clickable Quick-Filters */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Verified Revenue & Total Pipeline */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
            <span>Verified Revenue</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
            ₹{verifiedRevenue.toLocaleString()}
          </div>
          <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between pt-0.5">
            <span>Pipeline total:</span>
            <span className="text-slate-300 font-semibold">₹{totalRevenue.toLocaleString()}</span>
          </div>
        </div>

        {/* Total Teams (Click to show all events) */}
        <button
          type="button"
          onClick={() => setSelectedEvent('all')}
          className={`p-4 sm:p-5 rounded-2xl bg-slate-900/90 border text-left transition-all ${
            selectedEvent === 'all'
              ? 'border-purple-500/60 ring-2 ring-purple-500/20 bg-slate-900 shadow-lg'
              : 'border-slate-800 hover:border-slate-700'
          } space-y-1`}
        >
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-purple-400" />
              <span>Total Teams</span>
            </div>
            {selectedEvent === 'all' && (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">
                ACTIVE
              </span>
            )}
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-white">
            {records.length}
          </div>
          <div className="text-[11px] font-mono text-slate-400">
            All 3 tracks combined
          </div>
        </button>

        {/* Hackora 2026 */}
        <button
          type="button"
          onClick={() => setSelectedEvent(selectedEvent === 'hackora' ? 'all' : 'hackora')}
          className={`p-4 sm:p-5 rounded-2xl bg-slate-900/90 border text-left transition-all ${
            selectedEvent === 'hackora'
              ? 'border-cyan-500/60 ring-2 ring-cyan-500/20 bg-cyan-950/25 shadow-lg'
              : 'border-slate-800 hover:border-slate-700'
          } space-y-1`}
        >
          <div className="text-[11px] font-mono text-cyan-300 uppercase tracking-wider flex items-center justify-between">
            <span>Hackora (₹1,200)</span>
            {selectedEvent === 'hackora' && (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                FILTERED
              </span>
            )}
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-cyan-300">
            {hackoraCount} <span className="text-xs font-normal text-slate-400">teams</span>
          </div>
          <div className="text-[11px] font-mono text-slate-400">
            ₹{(hackoraCount * 1200).toLocaleString()}
          </div>
        </button>

        {/* Ideathon 2026 */}
        <button
          type="button"
          onClick={() => setSelectedEvent(selectedEvent === 'ideathon' ? 'all' : 'ideathon')}
          className={`p-4 sm:p-5 rounded-2xl bg-slate-900/90 border text-left transition-all ${
            selectedEvent === 'ideathon'
              ? 'border-purple-500/60 ring-2 ring-purple-500/20 bg-purple-950/25 shadow-lg'
              : 'border-slate-800 hover:border-slate-700'
          } space-y-1`}
        >
          <div className="text-[11px] font-mono text-purple-300 uppercase tracking-wider flex items-center justify-between">
            <span>Ideathon (₹250)</span>
            {selectedEvent === 'ideathon' && (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">
                FILTERED
              </span>
            )}
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-purple-300">
            {ideathonCount} <span className="text-xs font-normal text-slate-400">teams</span>
          </div>
          <div className="text-[11px] font-mono text-slate-400">
            ₹{(ideathonCount * 250).toLocaleString()}
          </div>
        </button>

        {/* Project Expo 2026 */}
        <button
          type="button"
          onClick={() => setSelectedEvent(selectedEvent === 'project_expo' ? 'all' : 'project_expo')}
          className={`col-span-2 lg:col-span-1 p-4 sm:p-5 rounded-2xl bg-slate-900/90 border text-left transition-all ${
            selectedEvent === 'project_expo'
              ? 'border-emerald-500/60 ring-2 ring-emerald-500/20 bg-emerald-950/25 shadow-lg'
              : 'border-slate-800 hover:border-slate-700'
          } space-y-1`}
        >
          <div className="text-[11px] font-mono text-emerald-300 uppercase tracking-wider flex items-center justify-between">
            <span>Expo (₹250)</span>
            {selectedEvent === 'project_expo' && (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                FILTERED
              </span>
            )}
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-300">
            {expoCount} <span className="text-xs font-normal text-slate-400">teams</span>
          </div>
          <div className="text-[11px] font-mono text-slate-400">
            ₹{(expoCount * 250).toLocaleString()}
          </div>
        </button>
      </div>

      {/* Interactive Verification Status Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs font-mono">
        <span className="text-slate-400 text-[11px] uppercase tracking-wider mr-1">Status Quick-Filters:</span>
        <button
          type="button"
          onClick={() => setSelectedStatus('all')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
            selectedStatus === 'all'
              ? 'bg-white text-slate-950 shadow-md'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700'
          }`}
        >
          All ({records.length})
        </button>
        <button
          type="button"
          onClick={() => setSelectedStatus('pending')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
            selectedStatus === 'pending'
              ? 'bg-amber-400 text-slate-950 shadow-md'
              : 'bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          Pending ({pendingCount})
        </button>
        <button
          type="button"
          onClick={() => setSelectedStatus('verified')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
            selectedStatus === 'verified'
              ? 'bg-emerald-400 text-slate-950 shadow-md'
              : 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          Verified ({verifiedCount})
        </button>
        <button
          type="button"
          onClick={() => setSelectedStatus('rejected')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
            selectedStatus === 'rejected'
              ? 'bg-red-400 text-slate-950 shadow-md'
              : 'bg-red-500/15 border border-red-500/30 text-red-300 hover:bg-red-500/25'
          }`}
        >
          <X className="w-3.5 h-3.5" />
          Rejected ({rejectedCount})
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Team Name, Leader, USN, Phone, UTR, Payer..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:border-cyan-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Event Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedEvent}
              onChange={(e: any) => setSelectedEvent(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 font-mono text-xs focus:border-cyan-400 focus:outline-none"
            >
              <option value="all">All Events (Hackora, Idea, Expo)</option>
              <option value="hackora">HACKORA 2026 (₹1,200)</option>
              <option value="ideathon">IDEATHON 2026 (₹250)</option>
              <option value="project_expo">PROJECT EXPO 2026 (₹250)</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedStatus}
              onChange={(e: any) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 font-mono text-xs focus:border-cyan-400 focus:outline-none"
            >
              <option value="all">All Statuses (Pending, Verified, Rejected)</option>
              <option value="pending">Pending Verification</option>
              <option value="verified">Verified & Confirmed</option>
              <option value="rejected">Rejected / Invalid UTR</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-1">
          <span>
            Showing <strong className="text-white">{filteredRecords.length}</strong> of{' '}
            <strong className="text-white">{records.length}</strong> total registrations
          </span>
          {(searchQuery || selectedEvent !== 'all' || selectedStatus !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedEvent('all');
                setSelectedStatus('all');
              }}
              className="text-cyan-400 hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Registrations Table */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Token & Date</th>
                <th className="py-3.5 px-4">Team & College</th>
                <th className="py-3.5 px-4">Event</th>
                <th className="py-3.5 px-4">Leader Contact</th>
                <th className="py-3.5 px-4">Fee & UTR / Payer</th>
                <th className="py-3.5 px-4">Proof</th>
                <th className="py-3.5 px-4">Verification</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <div className="max-w-sm mx-auto space-y-2">
                      <Database className="w-8 h-8 text-slate-600 mx-auto" />
                      <p className="text-sm font-semibold text-white">No registrations found</p>
                      <p className="text-xs text-slate-400">
                        Try clearing your search query or submit a test registration using the button below.
                      </p>
                      <button
                        onClick={onOpenRegister}
                        className="mt-3 px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
                      >
                        Submit Test Registration
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r) => {
                  const isVerified = r.status === 'verified';
                  const isRejected = r.status === 'rejected';

                  return (
                    <tr
                      key={r.id}
                      className="hover:bg-slate-850/60 transition-colors cursor-pointer"
                      onClick={() => setSelectedRecord(r)}
                    >
                      {/* Token & Date */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-cyan-300 text-xs">
                          {r.registrationToken}
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>{new Date(r.created_at).toLocaleDateString()}</span>
                        </div>
                      </td>

                      {/* Team & College */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white text-xs">{r.teamName}</div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[180px]">
                          {r.collegeName}
                        </div>
                      </td>

                      {/* Event */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                            r.eventType === 'hackora' || r.eventName?.includes('HACKORA')
                              ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                              : r.eventType === 'ideathon' || r.eventName?.includes('IDEATHON')
                              ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                              : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {r.eventName || r.eventType}
                        </span>
                      </td>

                      {/* Leader Contact */}
                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                        <div className="text-white text-xs font-medium">{r.leaderName}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <a
                            href={`https://wa.me/91${r.leaderPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                              `Hello ${r.leaderName}, this is the LAEC Innovation Fest 2026 Secretariat regarding your registration (Token: ${r.registrationToken}) for ${r.eventName}.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-400 hover:underline flex items-center gap-1 text-[11px]"
                            title="Message on WhatsApp"
                          >
                            <MessageCircle className="w-3 h-3" />
                            <span>{r.leaderPhone}</span>
                          </a>
                        </div>
                      </td>

                      {/* Fee, UTR & Payer Info */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white">₹{r.amount}</div>
                        <div className="text-[11px] font-mono text-emerald-400 tracking-wider">
                          {r.utrNumber}
                        </div>
                        {(r.payerName || r.payerUpiId) && (
                          <div
                            className="text-[10px] text-slate-400 mt-0.5 max-w-[150px] truncate"
                            title={`Payer: ${r.payerName || '—'} (${r.payerUpiId || '—'})`}
                          >
                            <span className="text-slate-300 font-semibold">{r.payerName || 'Payer'}</span>
                            {r.payerUpiId && (
                              <span className="text-cyan-400/90 block text-[9px] truncate font-mono">
                                {r.payerUpiId}
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Screenshot Proof Thumbnail */}
                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                        {r.paymentScreenshotUrl ? (
                          <button
                            type="button"
                            onClick={() => setPreviewImage(r.paymentScreenshotUrl || null)}
                            className="relative group rounded-xl overflow-hidden border border-slate-700 hover:border-cyan-400 transition-all block w-12 h-12 bg-slate-950 shadow-md shrink-0"
                            title="Click to view full screenshot proof"
                          >
                            <img
                              src={r.paymentScreenshotUrl}
                              alt="Payment proof"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <Eye className="w-3.5 h-3.5 text-cyan-300" />
                            </div>
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-500 italic">No proof</span>
                        )}
                      </td>

                      {/* Verification Status */}
                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            isVerified
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : isRejected
                              ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isVerified
                                ? 'bg-emerald-400'
                                : isRejected
                                ? 'bg-red-400'
                                : 'bg-amber-400 animate-pulse'
                            }`}
                          />
                          <span>
                            {isVerified ? 'Verified' : isRejected ? 'Rejected' : 'Pending'}
                          </span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {!isVerified && (
                            <button
                              onClick={() => handleStatusChange(r.id, 'verified')}
                              className="px-2 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold transition-colors"
                              title="Mark Verified"
                            >
                              Verify
                            </button>
                          )}

                          {!isRejected && (
                            <button
                              onClick={() => handleStatusChange(r.id, 'rejected')}
                              className="px-2 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 text-[10px] font-bold transition-colors"
                              title="Mark Rejected"
                            >
                              Reject
                            </button>
                          )}

                          <button
                            onClick={() => handleDelete(r.id, r.teamName)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors"
                            title="Delete Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* RECORD DETAILS MODAL / DRAWER */}
      {/* ---------------------------------------------------- */}
      <AnimatePresence>
        {selectedRecord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-700 p-6 shadow-2xl text-slate-100 font-mono space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                <div>
                  <div className="text-[10px] text-cyan-400 uppercase tracking-widest font-bold">
                    Registration Details
                  </div>
                  <h3 className="text-xl font-bold font-display text-white mt-0.5">
                    {selectedRecord.teamName}
                  </h3>
                  <div className="text-xs text-slate-400">{selectedRecord.registrationToken}</div>
                </div>

                <button
                  onClick={() => setSelectedRecord(null)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Banner */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <span className="text-slate-400">Payment Status:</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    selectedRecord.status === 'verified'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : selectedRecord.status === 'rejected'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}
                >
                  {selectedRecord.status}
                </span>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block uppercase">Event</span>
                  <span className="font-bold text-white">{selectedRecord.eventName}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block uppercase">Amount Paid</span>
                  <span className="font-bold text-cyan-300">₹{selectedRecord.amount}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 col-span-2">
                  <span className="text-[10px] text-slate-500 block uppercase">12-Digit UTR</span>
                  <span className="font-bold text-emerald-400 text-sm tracking-wider">
                    {selectedRecord.utrNumber}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block uppercase font-mono">Payer Account Name</span>
                  <span className="font-bold text-white text-xs">{selectedRecord.payerName || '—'}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block uppercase font-mono">Payer UPI ID</span>
                  <span className="font-bold text-cyan-300 text-xs font-mono">{selectedRecord.payerUpiId || '—'}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block uppercase">College</span>
                  <span className="font-medium text-slate-200">{selectedRecord.collegeName}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block uppercase">Theme / Track</span>
                  <span className="font-medium text-slate-200">{selectedRecord.themeId || '—'}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 col-span-2">
                  <span className="text-[10px] text-slate-500 block uppercase">Leader Contact</span>
                  <div className="text-white font-bold">{selectedRecord.leaderName}</div>
                  <div className="text-slate-400 text-[11px] mt-0.5 flex flex-wrap gap-3">
                    <span>Phone: {selectedRecord.leaderPhone}</span>
                    <span>Email: {selectedRecord.leaderEmail}</span>
                    {selectedRecord.studentId && <span>USN: {selectedRecord.studentId}</span>}
                  </div>
                </div>

                {selectedRecord.projectTitle && (
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 col-span-2">
                    <span className="text-[10px] text-slate-500 block uppercase">Project / Concept Title</span>
                    <span className="text-slate-200 font-bold">{selectedRecord.projectTitle}</span>
                  </div>
                )}

                {/* Payment Screenshot Proof Card */}
                {selectedRecord.paymentScreenshotUrl ? (
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 col-span-2 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 block uppercase font-mono font-bold flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Payment Screenshot Proof</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setPreviewImage(selectedRecord.paymentScreenshotUrl || null)}
                        className="text-[10px] text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1 underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Enlarge in Lightbox</span>
                      </button>
                    </div>
                    <div
                      onClick={() => setPreviewImage(selectedRecord.paymentScreenshotUrl || null)}
                      className="cursor-pointer group relative rounded-xl overflow-hidden border border-slate-700 hover:border-cyan-500 transition-colors bg-slate-950 flex items-center justify-center p-2"
                    >
                      <img
                        src={selectedRecord.paymentScreenshotUrl}
                        alt="Payment proof screenshot"
                        className="max-h-60 max-w-full object-contain rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-xs text-cyan-300 font-bold">
                        <Eye className="w-4 h-4" />
                        <span>Click to view full screen</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 col-span-2 text-slate-500 text-xs italic">
                    No payment screenshot uploaded for this registration.
                  </div>
                )}

              </div>

              {/* All Registered Team Members */}
              {selectedRecord.members && selectedRecord.members.length > 0 && (
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
                  <span className="text-[10px] text-slate-500 uppercase block font-mono">
                    Registered Team Roster ({selectedRecord.members.length + 1} Members)
                  </span>
                  <div className="space-y-1.5 font-mono">
                    <div className="flex items-center justify-between text-cyan-300 bg-slate-900/50 p-1.5 rounded-lg">
                      <span>1. {selectedRecord.leaderName} (Leader)</span>
                      <span className="text-slate-400 text-[11px]">
                        USN: {selectedRecord.studentId || '—'} • {selectedRecord.branch || ''}
                      </span>
                    </div>
                    {selectedRecord.members.map((m, idx) => (
                      <div key={idx} className="flex items-center justify-between text-slate-300 bg-slate-900/30 p-1.5 rounded-lg">
                        <span>{idx + 2}. {m.name}</span>
                        <span className="text-slate-400 text-[11px]">
                          USN: {m.usn || '—'} {m.branch ? `• ${m.branch}` : ''} {m.phone ? `• ${m.phone}` : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Verification Toggle Buttons */}
              <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-800">
                <a
                  href={`https://wa.me/91${selectedRecord.leaderPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                    `Hello ${selectedRecord.leaderName}! This is LAEC Secretariat regarding your INNOVATION FEST 2026 registration (Token: ${selectedRecord.registrationToken}). Your payment status is currently: ${selectedRecord.status.toUpperCase()}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Lead</span>
                </a>

                <div className="flex items-center gap-2">
                  {selectedRecord.status !== 'verified' && (
                    <button
                      onClick={() => handleStatusChange(selectedRecord.id, 'verified')}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold"
                    >
                      Verify Payment
                    </button>
                  )}

                  {selectedRecord.status !== 'rejected' && (
                    <button
                      onClick={() => handleStatusChange(selectedRecord.id, 'rejected')}
                      className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 text-xs font-bold"
                    >
                      Reject
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ---------------------------------------------------- */}
      {/* FULL-SCREEN LIGHTBOX MODAL FOR PAYMENT SCREENSHOT */}
      {/* ---------------------------------------------------- */}
      <AnimatePresence>
        {previewImage && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            onClick={() => setPreviewImage(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-4xl max-h-[92vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setPreviewImage(null)}
                className="absolute -top-10 right-0 p-2 rounded-full bg-slate-800 text-white hover:bg-slate-700 transition-colors"
                title="Close screenshot preview"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={previewImage}
                alt="Payment proof screenshot"
                className="max-h-[82vh] max-w-full rounded-2xl border border-slate-700 shadow-2xl object-contain bg-slate-950"
              />
              <div className="mt-3 flex items-center gap-3">
                <a
                  href={previewImage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-400 font-mono text-xs flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Full Size in New Tab</span>
                </a>
                <button
                  type="button"
                  onClick={() => setPreviewImage(null)}
                  className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-mono text-xs transition-colors"
                >
                  Close Preview
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ---------------------------------------------------- */}
      {/* SUPABASE SQL HELPER MODAL */}
      {/* ---------------------------------------------------- */}
      <AnimatePresence>
        {showSqlModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-700 p-6 shadow-2xl text-slate-100 font-mono space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <Database className="w-5 h-5 text-cyan-400" />
                  <div>
                    <h3 className="text-lg font-bold text-white font-display">
                      Supabase Payments Table & RLS Setup
                    </h3>
                    <p className="text-xs text-slate-400">
                      Ensure your Supabase project accepts public registrations seamlessly.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowSqlModal(false)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                <div className="text-slate-300">
                  <strong>Instructions:</strong>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-slate-400 text-[11px]">
                  <li>Open your Supabase Dashboard: <code className="text-cyan-400">https://supabase.com/dashboard/project/zdovivfymeopxxvxougi</code></li>
                  <li>Go to <strong>SQL Editor</strong> &gt; <strong>New Query</strong>.</li>
                  <li>Paste the script below and click <strong>Run</strong>.</li>
                </ol>
              </div>

              <div className="relative">
                <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 text-xs overflow-x-auto leading-relaxed">
                  {sqlSnippet}
                </pre>

                <button
                  onClick={copySqlToClipboard}
                  className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs flex items-center gap-1.5 transition-colors"
                >
                  {copiedSql ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Copy SQL</span>
                    </>
                  )}
                </button>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setShowSqlModal(false)}
                  className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
