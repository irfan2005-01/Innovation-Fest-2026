import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  UserPlus,
  Users,
  CreditCard,
  Banknote,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  MessageCircle,
  Copy,
  Check,
  Building2,
  BadgePercent,
} from 'lucide-react';
import {
  submitManualRegistration,
  uploadPaymentScreenshot,
  PaymentRecord,
  TeamMemberDetail,
} from '../../lib/supabase';

interface ManualRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newRecord: PaymentRecord) => void;
}

const THEME_OPTIONS = [
  'Agentic AI & Autonomous Systems',
  'Cyber Security & Digital Forensics',
  'HealthTech & Bio-Medical Systems',
  'AgriTech & Rural Empowerment',
  'Smart Infrastructure, IoT & Cities',
  'Smart Education, EdTech & Campus Management',
  'Open Innovation / Interdisciplinary',
];

export const ManualRegistrationModal: React.FC<ManualRegistrationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  // Form State
  const [eventType, setEventType] = useState<'hackora' | 'ideathon' | 'project_expo'>('hackora');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'upi'>('cash');
  const [teamName, setTeamName] = useState('');
  const [collegeName, setCollegeName] = useState('Lingaraj Appa Engineering College, Bidar');
  const [themeId, setThemeId] = useState(THEME_OPTIONS[0]);
  const [projectTitle, setProjectTitle] = useState('');

  // Leader Details
  const [leaderName, setLeaderName] = useState('');
  const [leaderPhone, setLeaderPhone] = useState('');
  const [leaderEmail, setLeaderEmail] = useState('');
  const [leaderUsn, setLeaderUsn] = useState('');
  const [branch, setBranch] = useState('CSE');
  const [year, setYear] = useState('3rd Year');

  // Additional Members
  const [members, setMembers] = useState<TeamMemberDetail[]>([]);

  // Payment Details
  const [amount, setAmount] = useState(1200);
  const [isAmountManuallyEdited, setIsAmountManuallyEdited] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [payerName, setPayerName] = useState('');
  const [payerUpiId, setPayerUpiId] = useState('');
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<'verified' | 'pending'>('verified');

  // Status & UI
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successRecord, setSuccessRecord] = useState<PaymentRecord | null>(null);
  const [copiedToken, setCopiedToken] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // USN Discount Check (10% on Hackathon only for USNs with 'LA' or 'U27...')
  const isUsnEligible = (usnVal: string | undefined | null): boolean => {
    if (!usnVal) return false;
    const clean = usnVal.toUpperCase().trim();
    return clean.length >= 4 && (clean.includes('LA') || clean.includes('U27XK') || clean.startsWith('U27'));
  };

  const hasEligibleUsn =
    isUsnEligible(leaderUsn) || members.some((m) => isUsnEligible(m.usn));

  const isDiscountApplicable = eventType === 'hackora' && hasEligibleUsn;

  // Auto-calculate fee based on event and discount eligibility (unless overridden)
  useEffect(() => {
    if (isAmountManuallyEdited) return;

    if (eventType === 'hackora') {
      setAmount(isDiscountApplicable ? 1080 : 1200);
    } else {
      setAmount(250);
    }
  }, [eventType, isDiscountApplicable, isAmountManuallyEdited]);

  // Default cash reference generator when switching to cash
  useEffect(() => {
    if (paymentMethod === 'cash') {
      if (!utrNumber || /^\d{12}$/.test(utrNumber)) {
        setUtrNumber(`CASH-${Date.now().toString().slice(-6)}`);
      }
    } else {
      if (utrNumber.startsWith('CASH-')) {
        setUtrNumber('');
      }
    }
  }, [paymentMethod]);

  const handleAddMember = () => {
    if (members.length >= 4) return;
    setMembers((prev) => [
      ...prev,
      { name: '', usn: '', branch: 'CSE', phone: '', email: '' },
    ]);
  };

  const handleRemoveMember = (idx: number) => {
    setMembers((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleMemberChange = (idx: number, field: keyof TeamMemberDetail, value: string) => {
    setMembers((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: value };
      return updated;
    });
  };

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select an image file (PNG, JPG, WebP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Image size must not exceed 5MB.');
      return;
    }

    setErrorMessage(null);
    setScreenshotFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setScreenshotPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleResetForm = () => {
    setTeamName('');
    setCollegeName('Lingaraj Appa Engineering College, Bidar');
    setThemeId(THEME_OPTIONS[0]);
    setProjectTitle('');
    setLeaderName('');
    setLeaderPhone('');
    setLeaderEmail('');
    setLeaderUsn('');
    setBranch('CSE');
    setYear('3rd Year');
    setMembers([]);
    setUtrNumber(paymentMethod === 'cash' ? `CASH-${Date.now().toString().slice(-6)}` : '');
    setPayerName('');
    setPayerUpiId('');
    setScreenshotFile(null);
    setScreenshotPreview(null);
    setSuccessRecord(null);
    setErrorMessage(null);
    setIsAmountManuallyEdited(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Form Validations
    if (!teamName.trim()) {
      setErrorMessage('Please enter the Team Name.');
      return;
    }
    if (!leaderName.trim()) {
      setErrorMessage('Please enter the Team Leader Name.');
      return;
    }
    const cleanPhone = leaderPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number for the Team Leader.');
      return;
    }

    let uploadedScreenshotUrl = '';

    // Online Payment Validations
    if (paymentMethod === 'upi') {
      const cleanUtr = utrNumber.trim();
      if (!/^\d{12}$/.test(cleanUtr)) {
        setErrorMessage('For Online UPI, an exact 12-digit numeric UTR / Transaction ID is required.');
        return;
      }
      if (!screenshotFile && !screenshotPreview) {
        setErrorMessage('Payment Screenshot proof is required for Online UPI payments.');
        return;
      }

      setIsSubmitting(true);

      // Upload screenshot to Supabase storage
      if (screenshotFile) {
        const uploadRes = await uploadPaymentScreenshot(
          screenshotFile,
          cleanPhone || 'admin_user',
          teamName || 'manual_team'
        );
        if (uploadRes.success && uploadRes.url) {
          uploadedScreenshotUrl = uploadRes.url;
        } else {
          // Fallback to preview Data URL if direct upload fails
          uploadedScreenshotUrl = screenshotPreview || '';
        }
      } else if (screenshotPreview) {
        uploadedScreenshotUrl = screenshotPreview;
      }
    } else {
      // Cash payment: no screenshot required
      setIsSubmitting(true);
    }

    const eventNames: Record<string, string> = {
      hackora: 'HACKORA 2026',
      ideathon: 'IDEATHON 2026',
      project_expo: 'PROJECT EXPO 2026',
    };

    const finalUtr =
      paymentMethod === 'cash'
        ? (utrNumber.trim() || `CASH-${Date.now().toString().slice(-6)}`)
        : utrNumber.trim();

    try {
      const res = await submitManualRegistration({
        teamName: teamName.trim(),
        leaderName: leaderName.trim(),
        leaderEmail: leaderEmail.trim() || `${cleanPhone}@participant.laec.edu.in`,
        leaderPhone: cleanPhone,
        collegeName: collegeName.trim(),
        studentId: leaderUsn.trim().toUpperCase(),
        branch,
        year,
        eventType,
        eventName: eventNames[eventType],
        amount: Number(amount) || (eventType === 'hackora' ? 1200 : 250),
        paymentMethod,
        utrNumber: finalUtr,
        payerName: payerName.trim() || leaderName.trim(),
        payerUpiId: paymentMethod === 'cash' ? 'cash@desk' : (payerUpiId.trim() || 'participant@upi'),
        paymentScreenshotUrl: uploadedScreenshotUrl,
        themeId,
        projectTitle: projectTitle.trim() || 'Fest Innovation Project',
        members,
        status: verificationStatus,
      });

      if (res.success && res.record) {
        setSuccessRecord(res.record);
        onSuccess(res.record);
      } else {
        setErrorMessage(res.error || 'Failed to submit manual registration. Please verify details.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Unexpected error occurred during registration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyTokenToClipboard = () => {
    if (!successRecord) return;
    navigator.clipboard.writeText(successRecord.registrationToken);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="relative w-full max-w-3xl rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-5 sm:p-7 text-slate-100 font-mono my-6 max-h-[92vh] overflow-y-auto"
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-cyan-400 uppercase tracking-widest">
                <span>Secretariat Desk</span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-slate-400">On-Spot Registration</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-display text-white">
                Manual Team Entry
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* SUCCESS STATE */}
        {/* ------------------------------------------------------------------ */}
        {successRecord ? (
          <div className="py-6 text-center space-y-5">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-xs text-emerald-400 uppercase tracking-widest font-bold">
                Registration Successful
              </span>
              <h3 className="text-2xl font-bold text-white font-display">
                {successRecord.teamName}
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                {successRecord.eventName} entry recorded directly into Secretariat ledger.
              </p>
            </div>

            {/* Token Badge */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 max-w-md mx-auto space-y-2">
              <div className="text-[10px] uppercase text-slate-500 tracking-wider">
                Official Registration Token
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-xl sm:text-2xl font-black text-cyan-300 font-mono tracking-wider">
                  {successRecord.registrationToken}
                </span>
                <button
                  type="button"
                  onClick={copyTokenToClipboard}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Copy Token"
                >
                  {copiedToken ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-slate-400">
                <span>Payment: <strong>₹{successRecord.amount}</strong></span>
                <span>•</span>
                <span className="uppercase text-emerald-400 font-bold">
                  {successRecord.paymentMethod === 'cash' ? 'Cash Verified' : 'Online Verified'}
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a
                href={`https://wa.me/91${successRecord.leaderPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                  `🎉 Congratulations ${successRecord.leaderName}! Your team "${successRecord.teamName}" has been successfully registered for ${successRecord.eventName} at LAEC Innovation Fest 2026.\n\n🎟️ Registration Token: ${successRecord.registrationToken}\n💳 Payment Mode: ${successRecord.paymentMethod === 'cash' ? 'Cash (Verified at Desk)' : 'Online UPI'}\n💰 Amount Paid: ₹${successRecord.amount}\n\nJoin the official WhatsApp Community: https://chat.whatsapp.com/KHE6DJo1fu0IrNtfjuLO50\n\nSee you at Lingaraj Appa Engineering College, Bidar!`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 shadow-lg transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Send WhatsApp Receipt to Leader</span>
              </a>

              <button
                type="button"
                onClick={handleResetForm}
                className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-colors"
              >
                Register Another Team
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          /* ------------------------------------------------------------------ */
          /* REGISTRATION FORM */
          /* ------------------------------------------------------------------ */
          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-mono flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* 1. Event Selection & Payment Mode Switch */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Event Picker */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2.5">
                <label className="block text-xs uppercase tracking-wider text-slate-400 font-bold">
                  1. Select Event Track
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEventType('hackora');
                      setIsAmountManuallyEdited(false);
                    }}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      eventType === 'hackora'
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md ring-1 ring-cyan-400/30'
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-bold">HACKORA</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">₹1,200</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEventType('ideathon');
                      setIsAmountManuallyEdited(false);
                    }}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      eventType === 'ideathon'
                        ? 'bg-purple-500/20 border-purple-400 text-purple-300 shadow-md ring-1 ring-purple-400/30'
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-bold">IDEATHON</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">₹250</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEventType('project_expo');
                      setIsAmountManuallyEdited(false);
                    }}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      eventType === 'project_expo'
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-md ring-1 ring-emerald-400/30'
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-bold">EXPO</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">₹250</div>
                  </button>
                </div>
              </div>

              {/* Payment Method Toggle */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2.5">
                <label className="block text-xs uppercase tracking-wider text-slate-400 font-bold flex items-center justify-between">
                  <span>2. Payment Collection Method</span>
                  {paymentMethod === 'cash' ? (
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                      No Screenshot Needed
                    </span>
                  ) : (
                    <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                      Screenshot Required
                    </span>
                  )}
                </label>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                      paymentMethod === 'cash'
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300 ring-1 ring-amber-400/30 shadow-md'
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Banknote className="w-4 h-4" />
                    <div className="text-left">
                      <div className="text-xs font-bold">Cash on Desk</div>
                      <div className="text-[9px] text-slate-400">Offline Collection</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                      paymentMethod === 'upi'
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 ring-1 ring-cyan-400/30 shadow-md'
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <div className="text-left">
                      <div className="text-xs font-bold">Online (UPI)</div>
                      <div className="text-[9px] text-slate-400">Requires Screenshot</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* 2. Team Information */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
              <div className="text-xs uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Team & Project Info</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">
                    Team Name <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="Enter team name"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">College / Institution</label>
                  <input
                    type="text"
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    placeholder="Enter college name"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">Track / Theme</label>
                  <select
                    value={themeId}
                    onChange={(e) => setThemeId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:border-cyan-400 focus:outline-none"
                  >
                    {THEME_OPTIONS.map((th) => (
                      <option key={th} value={th}>
                        {th}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">Project / Idea Title</label>
                  <input
                    type="text"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder="Enter project or concept title"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 3. Team Leader Details & USN Discount Indicator */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Team Leader Details</span>
                </div>

                {isDiscountApplicable && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold animate-pulse">
                    <BadgePercent className="w-3.5 h-3.5" />
                    <span>10% College Discount Applied (₹1,080)</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">
                    Leader Name <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={leaderName}
                    onChange={(e) => setLeaderName(e.target.value)}
                    placeholder="Full name"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">
                    Leader Phone (10 digits) <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={leaderPhone}
                    onChange={(e) => setLeaderPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="Mobile number"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">Leader Email</label>
                  <input
                    type="email"
                    value={leaderEmail}
                    onChange={(e) => setLeaderEmail(e.target.value)}
                    placeholder="Email address"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">
                    USN / Student ID
                  </label>
                  <input
                    type="text"
                    value={leaderUsn}
                    onChange={(e) => setLeaderUsn(e.target.value.toUpperCase())}
                    placeholder="Student USN"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-400 focus:outline-none uppercase"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">Branch / Dept</label>
                  <input
                    type="text"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    placeholder="CSE / ISE / ECE"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">Year of Study</label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 4. Additional Team Members */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                  Additional Team Members ({members.length} added)
                </div>

                {members.length < 4 && (
                  <button
                    type="button"
                    onClick={handleAddMember}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Member</span>
                  </button>
                )}
              </div>

              {members.length === 0 ? (
                <div className="text-[11px] text-slate-500 italic py-2">
                  Solo registration. Click "+ Add Member" above if the team has more participants.
                </div>
              ) : (
                <div className="space-y-3 pt-1">
                  {members.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-900 border border-slate-800 relative space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                        <span>Member #{idx + 2}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveMember(idx)}
                          className="text-slate-500 hover:text-red-400 p-1"
                          title="Remove member"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                        <input
                          type="text"
                          value={m.name}
                          onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                          placeholder="Member full name"
                          className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:border-cyan-400 focus:outline-none"
                        />
                        <input
                          type="text"
                          value={m.usn || ''}
                          onChange={(e) =>
                            handleMemberChange(idx, 'usn', e.target.value.toUpperCase())
                          }
                          placeholder="Member USN"
                          className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:border-cyan-400 focus:outline-none uppercase"
                        />
                        <input
                          type="text"
                          value={m.branch || ''}
                          onChange={(e) => handleMemberChange(idx, 'branch', e.target.value)}
                          placeholder="Branch"
                          className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:border-cyan-400 focus:outline-none"
                        />
                        <input
                          type="tel"
                          value={m.phone || ''}
                          onChange={(e) => handleMemberChange(idx, 'phone', e.target.value)}
                          placeholder="Phone number"
                          className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:border-cyan-400 focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 5. Payment & Screenshot Section */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
              <div className="text-xs uppercase tracking-wider text-slate-400 font-bold flex items-center justify-between">
                <span>Payment & Verification Record</span>
                <span className="text-cyan-400 font-bold">
                  Fee: ₹{amount} {isDiscountApplicable && '(10% Off)'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">
                    Amount Collected (₹) <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => {
                      setAmount(Number(e.target.value));
                      setIsAmountManuallyEdited(true);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-emerald-400 font-bold text-xs focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">
                    {paymentMethod === 'cash' ? 'Cash Receipt / Ref No.' : '12-Digit UTR Number *'}
                  </label>
                  <input
                    type="text"
                    required={paymentMethod === 'upi'}
                    maxLength={paymentMethod === 'upi' ? 12 : 20}
                    value={utrNumber}
                    onChange={(e) =>
                      setUtrNumber(
                        paymentMethod === 'upi'
                          ? e.target.value.replace(/\D/g, '')
                          : e.target.value
                      )
                    }
                    placeholder={paymentMethod === 'cash' ? 'CASH-xxxxxx' : '12 digits numeric'}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-400 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">Verification Status</label>
                  <select
                    value={verificationStatus}
                    onChange={(e: any) => setVerificationStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="verified">Verified (Confirmed)</option>
                    <option value="pending">Pending Review</option>
                  </select>
                </div>
              </div>

              {/* CASH MODE NOTICE */}
              {paymentMethod === 'cash' && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>
                    <strong>Cash Payment Active:</strong> Physical cash received at registration desk. No screenshot proof is needed.
                  </span>
                </div>
              )}

              {/* ONLINE UPI SCREENSHOT UPLOAD */}
              {paymentMethod === 'upi' && (
                <div className="space-y-2 pt-1">
                  <label className="block text-[11px] text-slate-300 font-bold flex items-center justify-between">
                    <span>Payment Proof Screenshot <span className="text-cyan-400">*</span></span>
                    <span className="text-[10px] text-slate-400 font-normal">JPG, PNG, WebP (Max 5MB)</span>
                  </label>

                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleScreenshotChange}
                    className="hidden"
                  />

                  {screenshotPreview ? (
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={screenshotPreview}
                          alt="Screenshot preview"
                          className="w-14 h-14 object-cover rounded-lg border border-slate-700 bg-slate-950 shrink-0"
                        />
                        <div>
                          <div className="text-xs font-bold text-white">
                            {screenshotFile?.name || 'Payment Screenshot Loaded'}
                          </div>
                          <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                            <Check className="w-3 h-3" />
                            <span>Ready to save with record</span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setScreenshotFile(null);
                          setScreenshotPreview(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                        title="Remove image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full p-5 rounded-2xl border-2 border-dashed border-slate-700 hover:border-cyan-400 bg-slate-900/60 hover:bg-slate-900 transition-all flex flex-col items-center justify-center gap-2 group cursor-pointer"
                    >
                      <UploadCloud className="w-6 h-6 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                      <div className="text-xs text-slate-300 font-medium">
                        Click or drag payment screenshot here
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        Supports UPI confirmation receipts and bank transfer slips
                      </div>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Modal Bottom Actions */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 rounded-xl bg-brand-gradient hover:opacity-95 text-slate-950 font-bold font-mono text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Registering Team...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Register Team ({paymentMethod === 'cash' ? 'Cash' : 'Online'})</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};
