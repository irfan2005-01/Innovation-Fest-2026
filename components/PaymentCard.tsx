import React, { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  QrCode,
  CreditCard,
  Upload,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  X,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../src/lib/supabase';
import { submitPaymentAction } from '../lib/actions/payment';

export interface PaymentCardProps {
  event: {
    id: string;
    name: string;
    feeNumber: number;
    feeDisplay: string;
    accent?: string;
    isDiscountApplied?: boolean;
    originalFeeDisplay?: string;
    discountLabel?: string;
  };
  teamName: string;
  collegeName?: string;
  leaderName?: string;
  leaderEmail?: string;
  leaderPhone?: string;
  studentId?: string;
  branch?: string;
  year?: string;
  themeId?: string;
  projectTitle?: string;
  members?: Array<{
    name: string;
    email: string;
    phone?: string;
    usn?: string;
    branch?: string;
  }>;
  userId?: string;
  teamId?: string;
  onSuccess?: (paymentRecord: any) => void;
  onBack?: () => void;
  className?: string;
}

const OFFICIAL_UPI_ID =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_UPI_ID) ||
  '76206467008324@cnrb';

const OFFICIAL_PAYEE =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_UPI_NAME) ||
  'PRESIDENT AND PRINCIPAL LINGRAJ APPA ENGINEERING COLLEGE E';

export const PaymentCard: React.FC<PaymentCardProps> = ({
  event,
  teamName,
  collegeName = '',
  leaderName = '',
  leaderEmail = '',
  leaderPhone = '',
  studentId = '',
  branch = '',
  year = '',
  themeId = '',
  projectTitle = '',
  members = [],
  userId = 'participant',
  teamId = 'team',
  onSuccess,
  onBack,
  className = '',
}) => {
  // Form State
  const [payerName, setPayerName] = useState(leaderName);
  const [payerUpiId, setPayerUpiId] = useState('');
  const [utrNumber, setUtrNumber] = useState('');
  const [utrTouched, setUtrTouched] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [showBankStandee, setShowBankStandee] = useState(false);

  // Screenshot Upload State
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [isUploadingScreenshot, setIsUploadingScreenshot] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Overall Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedUpi, setCopiedUpi] = useState(false);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(OFFICIAL_UPI_ID);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  // UTR Change Handler (Strict digits only, max 12 characters)
  const handleUtrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 12);
    setUtrNumber(digitsOnly);
    setUtrTouched(true);
    if (errorMessage) setErrorMessage(null);
  };

  // File Selection and Upload to Supabase Storage bucket 'payment-screenshots'
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setErrorMessage(null);

    // 1. Validate File Type (image/* only)
    if (!file.type.startsWith('image/')) {
      setUploadError('Only image files (JPEG, PNG, WebP) are accepted.');
      return;
    }

    // 2. Validate File Size (max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setUploadError(`File is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maximum allowed is 5MB.`);
      return;
    }

    setScreenshotFile(file);
    const localPreviewUrl = URL.createObjectURL(file);
    setScreenshotPreview(localPreviewUrl);

    // 3. Upload to Supabase Storage in background with dedicated loading state
    setIsUploadingScreenshot(true);
    const ext = file.name.split('.').pop() || 'png';
    const cleanTeam = (teamName || teamId || 'team').replace(/[^a-zA-Z0-9_-]/g, '_');
    const cleanUser = (userId || 'user').replace(/[^a-zA-Z0-9_-]/g, '_');
    const storagePath = `${cleanUser}/${cleanTeam}-${Date.now()}.${ext}`;

    try {
      let finalUrl = '';
      if (isSupabaseConfigured) {
        const { data, error: uploadErr } = await supabase.storage
          .from('payment-screenshots')
          .upload(storagePath, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (!uploadErr && data) {
          const { data: publicUrlData } = supabase.storage
            .from('payment-screenshots')
            .getPublicUrl(data.path);
          finalUrl = publicUrlData?.publicUrl || data.path;
        } else if (uploadErr) {
          console.warn('Storage upload notice (falling back to data URL):', uploadErr.message);
        }
      }

      // If storage bucket upload is unavailable or fallback needed:
      if (!finalUrl) {
        finalUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      }

      setUploadedUrl(finalUrl);
    } catch (err: any) {
      console.warn('Screenshot upload error:', err);
      // Generate base64 fallback so participant can still register
      try {
        const fallbackUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        setUploadedUrl(fallbackUrl);
      } catch {
        setUploadError('Failed to process screenshot image. Please try again.');
      }
    } finally {
      setIsUploadingScreenshot(false);
    }
  };

  const removeScreenshot = () => {
    setScreenshotFile(null);
    setScreenshotPreview(null);
    setUploadedUrl(null);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Form Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validate Payer Name
    if (!payerName.trim()) {
      setErrorMessage('Payer account holder name is required.');
      return;
    }

    // Validate Payer UPI ID
    if (!payerUpiId.trim()) {
      setErrorMessage('Payer UPI ID is required.');
      return;
    }
    if (!payerUpiId.includes('@')) {
      setErrorMessage('A valid UPI ID is required (must contain "@", e.g. name@okhdfcbank).');
      return;
    }

    // Validate UTR (Must be exactly 12 digits)
    if (utrNumber.length !== 12) {
      setErrorMessage(`Invalid UTR format: UTR must be exactly 12 digits (currently ${utrNumber.length}/12).`);
      return;
    }

    // Validate Screenshot
    if (!uploadedUrl && !screenshotFile) {
      setErrorMessage('Please upload a screenshot of your successful UPI payment transaction.');
      return;
    }

    if (isUploadingScreenshot) {
      setErrorMessage('Payment screenshot is still uploading. Please wait a moment.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Ensure we have the final screenshot URL
      let finalScreenshotUrl = uploadedUrl;
      if (!finalScreenshotUrl && screenshotFile) {
        finalScreenshotUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(screenshotFile);
        });
      }

      const result = await submitPaymentAction({
        utr_number: utrNumber,
        payer_name: payerName.trim(),
        payer_upi_id: payerUpiId.trim(),
        payment_screenshot_url: finalScreenshotUrl || '',
        event_type: event.id,
        event_name: event.name,
        amount: event.feeNumber,
        team_name: teamName,
        college_name: collegeName,
        leader_name: leaderName || payerName.trim(),
        leader_email: leaderEmail,
        leader_phone: leaderPhone,
        student_id: studentId,
        branch: branch,
        year: year,
        theme_id: themeId,
        project_title: projectTitle,
        members: members,
      });

      if (result.success && result.data) {
        if (onSuccess) {
          onSuccess(result.data);
        }
      } else {
        setErrorMessage(result.error || 'Failed to submit payment. Please verify your details.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Payment submission failed. Please check your network connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isUtrInvalid = utrTouched && utrNumber.length > 0 && utrNumber.length !== 12;
  const cleanUpiId = OFFICIAL_UPI_ID.trim();
  const encodedPayee = encodeURIComponent(OFFICIAL_PAYEE.trim());
  const feeAmount = Number(event.feeNumber) || 1200;
  const formattedAmount = feeAmount.toFixed(2);
  const cleanTeamCode = (teamName || 'TEAM').replace(/[^a-zA-Z0-9]/g, '').slice(0, 15);
  const transactionNote = encodeURIComponent(`IF26 ${event.name} ${cleanTeamCode}`);

  // NPCI UPI URI with auto-entered & locked amount (am = mam locks the amount):
  const directUpiIntentUrl = `upi://pay?pa=${cleanUpiId}&pn=${encodedPayee}&mc=8220&am=${formattedAmount}&mam=${formattedAmount}&cu=INR&tn=${transactionNote}`;

  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(
      directUpiIntentUrl,
      {
        width: 320,
        margin: 1.5,
        color: {
          dark: '#020617',
          light: '#FFFFFF',
        },
        errorCorrectionLevel: 'M',
      },
      (err, url) => {
        if (!err && url && isMounted) {
          setQrDataUrl(url);
        }
      }
    );
    return () => {
      isMounted = false;
    };
  }, [directUpiIntentUrl]);

  return (
    <div className={`space-y-4 max-w-full overflow-hidden ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Error Notification Banner */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs font-mono flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <strong className="block font-bold">Submission Error:</strong>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/90 border border-cyan-500/30 space-y-4">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <QrCode className="w-4 h-4" />
              <span>Official UPI Payment Desk — {event.name}</span>
            </span>
            <div className="flex items-center gap-2">
              {event.originalFeeDisplay && event.isDiscountApplied && (
                <span className="text-xs font-mono text-slate-500 line-through">
                  {event.originalFeeDisplay}
                </span>
              )}
              <span
                className={`text-xs font-mono px-3 py-1 rounded-full border font-bold flex items-center gap-1.5 ${
                  event.isDiscountApplied
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                }`}
              >
                {event.isDiscountApplied && <Sparkles className="w-3.5 h-3.5 text-emerald-400" />}
                <span>Fee: {event.feeDisplay} {event.isDiscountApplied ? '(10% LAEC Discount)' : ''}</span>
              </span>
            </div>
          </div>

          {/* QR Code & Payee Details */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-4 rounded-xl bg-slate-900 border border-slate-700">
            {/* Dynamic Locked Amount QR Code */}
            {showBankStandee ? (
              <div className="w-full sm:w-56 flex-shrink-0 flex flex-col items-center justify-center p-3.5 bg-white rounded-2xl shadow-xl border border-slate-200">
                <img
                  src="/assets/official-payment-qr.png"
                  alt="Official Canara Bank UPI Standee"
                  className="w-44 h-44 sm:w-48 sm:h-48 max-w-[190px] max-h-[190px] object-contain rounded-lg block mx-auto"
                />
                <span className="text-[10px] font-mono text-slate-900 mt-2 font-black tracking-wider text-center">
                  PHYSICAL BANK STANDEE
                </span>
                <button
                  type="button"
                  onClick={() => setShowBankStandee(false)}
                  className="text-[9.5px] font-mono text-cyan-700 hover:text-cyan-900 font-bold underline mt-1 text-center"
                >
                  ← Switch to Auto-Amount QR (₹{feeAmount} Locked)
                </button>
              </div>
            ) : (
              <div className="w-full sm:w-56 flex-shrink-0 flex flex-col items-center justify-center p-3.5 bg-white rounded-2xl shadow-xl border-2 border-emerald-500/50">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt={`UPI QR Code for ₹${feeAmount}`}
                    className="w-44 h-44 sm:w-48 sm:h-48 max-w-[190px] max-h-[190px] object-contain rounded-lg block mx-auto"
                  />
                ) : (
                  <div className="w-44 h-44 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-cyan-600 animate-spin" />
                  </div>
                )}
                <div className="mt-2 text-center w-full">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-black tracking-wider">
                    🔒 Auto-Filled: ₹{feeAmount} (Locked)
                  </span>
                  <span className="block text-[9px] font-mono text-slate-600 mt-0.5 font-semibold">
                    Amount is fixed & cannot be modified
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowBankStandee(true)}
                    className="text-[9px] font-mono text-slate-500 underline mt-1 hover:text-slate-800 block mx-auto"
                  >
                    View Bank Standee Photo
                  </button>
                </div>
              </div>
            )}

            {/* Official UPI Details */}
            <div className="space-y-3 flex-1 min-w-0 w-full text-xs font-mono">
              <div>
                <div className="text-slate-400 text-[11px]">Beneficiary / Payee:</div>
                <div className="font-bold text-white text-sm break-words">{OFFICIAL_PAYEE}</div>
              </div>

              <div>
                <div className="text-slate-400 text-[11px]">Official UPI ID:</div>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <code className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-cyan-400 font-bold text-xs select-all break-all">
                    {OFFICIAL_UPI_ID}
                  </code>
                  <button
                    type="button"
                    onClick={handleCopyUpi}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 transition-colors flex items-center gap-1 text-[11px]"
                  >
                    {copiedUpi ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Mobile Deep-Link */}
              <div className="pt-1">
                <a
                  href={directUpiIntentUrl}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all active:scale-[0.98]"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Tap to Pay ₹{feeAmount} on Mobile UPI App</span>
                </a>
              </div>

              {/* Verified Merchant Instructions */}
              <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-[10.5px] text-emerald-200/90 leading-relaxed">
                🔒 <strong className="text-white">Fixed Amount Gateway:</strong> When you scan the QR or tap to pay, your UPI app (Google Pay, PhonePe, Paytm, BHIM) will automatically enter <strong className="text-emerald-300 font-bold">{event.feeDisplay}</strong> as a locked, non-editable amount.
              </div>

              <div className="text-[10px] text-slate-400 pt-0.5">
                Pay exactly <strong className="text-white">{event.feeDisplay}</strong>. Mention{' '}
                <strong className="text-cyan-300">REG-{teamName || 'TEAM'}</strong> in remarks.
              </div>
            </div>
          </div>

          {/* Form Fields: Payer Name, Payer UPI ID, UTR, and Screenshot */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700 space-y-4 font-mono text-xs">
            <div className="flex items-center gap-1.5 text-cyan-400 uppercase tracking-wider font-bold">
              <CreditCard className="w-4 h-4" />
              <span>Payment Verification Details</span>
            </div>

            {/* Payer Name & Payer UPI ID (Required) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">
                  Payer Account Holder Name *
                </label>
                <input
                  type="text"
                  required
                  value={payerName}
                  onChange={(e) => setPayerName(e.target.value)}
                  placeholder="Enter payer full name"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Name shown on debit bank account
                </span>
              </div>

              <div>
                <label className="block text-[11px] text-slate-300 mb-1">
                  Payer UPI ID *
                </label>
                <input
                  type="text"
                  required
                  value={payerUpiId}
                  onChange={(e) => setPayerUpiId(e.target.value)}
                  placeholder="Enter UPI ID"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Must contain '@'
                </span>
              </div>
            </div>

            {/* 12-Digit UTR Number Field with Strict Validation */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] text-slate-300">
                  12-Digit UPI Reference Number (UTR) *
                </label>
                <span
                  className={`text-[10px] font-bold ${
                    utrNumber.length === 12
                      ? 'text-emerald-400'
                      : utrNumber.length > 0
                      ? 'text-amber-400'
                      : 'text-slate-500'
                  }`}
                >
                  {utrNumber.length}/12 digits
                </span>
              </div>

              <input
                type="text"
                required
                inputMode="numeric"
                maxLength={12}
                value={utrNumber}
                onChange={handleUtrChange}
                onBlur={() => setUtrTouched(true)}
                placeholder="Enter 12-digit UTR reference number"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950 text-cyan-300 font-mono text-sm tracking-widest font-bold focus:outline-none border transition-colors ${
                  isUtrInvalid
                    ? 'border-red-500 ring-1 ring-red-500'
                    : utrNumber.length === 12
                    ? 'border-emerald-500 ring-1 ring-emerald-500/50'
                    : 'border-cyan-500/60 focus:border-cyan-400'
                }`}
              />

              {isUtrInvalid && (
                <div className="text-red-400 text-[10px] mt-1 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 shrink-0" />
                  <span>UTR must be exactly 12 numeric digits (currently {utrNumber.length}).</span>
                </div>
              )}
              {!isUtrInvalid && (
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Check your GPay, PhonePe, or Paytm receipt for the 12-digit UTR/Ref number.
                </span>
              )}
            </div>

            {/* Payment Screenshot Upload Area (image/*, max 5MB) */}
            <div>
              <label className="block text-[11px] text-slate-300 mb-1">
                Payment Verification Screenshot * (Image proof from UPI app, max 5MB)
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="payment-screenshot-upload"
              />

              {uploadError && (
                <div className="text-red-400 text-[10px] mb-2 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Upload Dropzone or Image Preview */}
              {!screenshotPreview ? (
                <label
                  htmlFor="payment-screenshot-upload"
                  className="border-2 border-dashed border-slate-700 hover:border-cyan-400/80 rounded-2xl p-5 flex flex-col items-center justify-center cursor-pointer bg-slate-950/60 hover:bg-slate-950 transition-all group"
                >
                  <div className="p-3 rounded-full bg-slate-900 group-hover:bg-cyan-500/10 text-slate-400 group-hover:text-cyan-300 transition-colors mb-2">
                    <Upload className="w-5 h-5" />
                  </div>
                  <span className="text-xs text-slate-200 font-bold">
                    Click to browse or drop payment screenshot
                  </span>
                  <span className="text-[10px] text-slate-500 mt-1">
                    Accepts PNG, JPEG, WebP (Max size: 5MB)
                  </span>
                </label>
              ) : (
                <div className="relative rounded-2xl bg-slate-950 border border-cyan-500/40 p-3 flex items-center gap-3.5">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-700">
                    <img
                      src={screenshotPreview}
                      alt="Payment proof preview"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-white font-bold truncate">
                      {screenshotFile?.name || 'payment-screenshot.png'}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {screenshotFile
                        ? `${(screenshotFile.size / (1024 * 1024)).toFixed(2)} MB`
                        : 'Image loaded'}
                    </div>

                    {/* Dedicated Screenshot Uploading Spinner */}
                    {isUploadingScreenshot && (
                      <div className="flex items-center gap-1.5 text-cyan-400 text-[10px] mt-1 animate-pulse">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>Uploading to secure storage...</span>
                      </div>
                    )}

                    {!isUploadingScreenshot && uploadedUrl && (
                      <div className="flex items-center gap-1 text-emerald-400 text-[10px] mt-1 font-bold">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Screenshot attached & verified</span>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={removeScreenshot}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-red-400 transition-colors"
                    title="Remove Screenshot"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Manual verification desk checks UTR & screenshot to prevent duplicate or fraudulent entries.
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-2">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-mono text-xs font-semibold transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          )}

          <button
            type="submit"
            disabled={isSubmitting || isUploadingScreenshot || utrNumber.length !== 12}
            className="flex-1 sm:flex-none px-7 py-3 rounded-xl font-bold font-mono text-xs text-slate-950 bg-brand-gradient hover:opacity-95 shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>Verifying & Submitting...</span>
              </>
            ) : isUploadingScreenshot ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>Uploading Screenshot...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Verify & Submit Registration</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
