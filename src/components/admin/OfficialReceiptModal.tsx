import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Printer,
  Download,
  Share2,
  CheckCircle2,
  Clock,
  CreditCard,
  Banknote,
  FileCheck,
} from 'lucide-react';
import QRCode from 'qrcode';
import { PaymentRecord } from '../../lib/supabase';

interface OfficialReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: PaymentRecord | null;
}

// Convert amount to words in Indian Rupees
function convertAmountToWords(amount: number): string {
  if (isNaN(amount) || amount === 0) return 'Zero Rupees Only';

  const ones = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function convert(n: number): string {
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '');
    if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' and ' + convert(n % 100) : '');
    if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 !== 0 ? ' ' + convert(n % 1000) : '');
    return convert(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 !== 0 ? ' ' + convert(n % 100000) : '');
  }

  return convert(Math.round(amount)).trim() + ' Rupees Only';
}

export const OfficialReceiptModal: React.FC<OfficialReceiptModalProps> = ({
  isOpen,
  onClose,
  record,
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  useEffect(() => {
    if (!record) return;

    const qrData = `INNOVATION FEST 2026 // OFFICIAL RECEIPT\n` +
      `Token: ${record.registrationToken}\n` +
      `Team: ${record.teamName}\n` +
      `Leader: ${record.leaderName} (${record.studentId || 'N/A'})\n` +
      `Event: ${record.eventName}\n` +
      `College: ${record.collegeName}\n` +
      `Amount Paid: ₹${record.amount}\n` +
      `Mode: ${(record.paymentMethod || 'UPI').toUpperCase()}\n` +
      `Ref/UTR: ${record.utrNumber || 'CASH-SECRETARIAT'}\n` +
      `Status: ${record.status.toUpperCase()}`;

    QRCode.toDataURL(qrData, {
      width: 220,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    })
      .then((url) => setQrCodeUrl(url))
      .catch((err) => console.error('QR Generation Error:', err));
  }, [record]);

  if (!isOpen || !record) return null;

  const receiptNo = `REC-2026-${record.registrationToken}`;
  const isVerified = record.status === 'verified';
  const isCash = record.paymentMethod === 'cash';
  const amountWords = convertAmountToWords(Number(record.amount) || 0);

  const formattedDate = new Date(record.created_at).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const formattedTime = new Date(record.created_at).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Trigger Print to PDF
  const handlePrint = () => {
    window.print();
  };

  // Download Standalone Offline HTML File
  const handleDownloadHTML = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Receipt_${record.registrationToken}_${record.teamName}</title>
  <style>
    @page { size: A4 portrait; margin: 10mm; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
      background: #ffffff;
      color: #0f172a;
      margin: 0;
      padding: 20px;
    }
    .receipt-container {
      max-width: 800px;
      margin: 0 auto;
      border: 2px solid #0f172a;
      border-radius: 8px;
      padding: 24px;
    }
    .header-table { width: 100%; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 16px; }
    .header-table td { vertical-align: middle; }
    .title-org { font-size: 11px; text-transform: uppercase; font-weight: bold; color: #475569; letter-spacing: 1px; }
    .title-college { font-size: 20px; font-weight: 900; color: #0f172a; margin: 2px 0; }
    .title-sub { font-size: 10px; color: #64748b; }
    .title-fest { font-size: 13px; font-weight: 800; color: #0284c7; text-transform: uppercase; margin-top: 4px; }
    .title-receipt { font-size: 12px; font-weight: bold; background: #0f172a; color: #ffffff; display: inline-block; padding: 2px 8px; border-radius: 4px; margin-top: 4px; }
    
    .meta-bar {
      display: flex;
      justify-content: space-between;
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      padding: 10px 14px;
      border-radius: 6px;
      font-size: 11px;
      margin-bottom: 16px;
    }
    .meta-item { display: inline-block; margin-right: 20px; }
    .meta-label { color: #64748b; font-size: 10px; text-transform: uppercase; }
    .meta-value { font-weight: bold; color: #0f172a; font-family: monospace; font-size: 12px; }

    .data-table { width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 11px; }
    .data-table th, .data-table td { border: 1px solid #cbd5e1; padding: 6px 10px; text-align: left; }
    .data-table th { background: #f1f5f9; font-weight: bold; color: #0f172a; }

    .stamp {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 4px;
      font-weight: bold;
      font-size: 11px;
      border: 1px solid #059669;
      background: #ecfdf5;
      color: #065f46;
    }

    .terms { font-size: 10px; color: #64748b; line-height: 1.4; border-top: 1px solid #e2e8f0; padding-top: 10px; margin-top: 16px; }
    .sig-row { display: flex; justify-content: space-between; margin-top: 36px; padding-top: 10px; }
    .sig-box { text-align: center; width: 200px; border-top: 1px solid #94a3b8; font-size: 11px; font-weight: bold; padding-top: 6px; }
    .print-btn {
      display: block;
      margin: 20px auto;
      padding: 10px 20px;
      background: #0284c7;
      color: #fff;
      font-weight: bold;
      border: none;
      border-radius: 6px;
      cursor: pointer;
    }
    @media print {
      .print-btn { display: none !important; }
      body { padding: 0; }
      .receipt-container { border: 2px solid #000; }
    }
  </style>
</head>
<body>
  <button class="print-btn" onclick="window.print()">🖨️ Print / Save as PDF</button>
  <div class="receipt-container">
    <table class="header-table">
      <tr>
        <td style="width: 80px;">
          <img src="${window.location.origin}/assets/laec-crest.png" style="width: 70px; height: auto;" alt="LAEC Crest" />
        </td>
        <td style="text-align: center;">
          <div class="title-org">Sharana Basaveshwar Vidya Vardhak Sangha's</div>
          <div class="title-college">LINGARAJ APPA ENGINEERING COLLEGE, BIDAR</div>
          <div class="title-sub">(Approved by AICTE, New Delhi • Affiliated to VTU, Belagavi • Accredited by NAAC)</div>
          <div class="title-sub">Gumpa, Near Central Bus Stand, Bidar - 585403, Karnataka</div>
          <div class="title-fest">INNOVATION FEST 2026 // ENGINEERS' DAY CELEBRATIONS</div>
          <div class="title-receipt">OFFICIAL EVENT REGISTRATION & PAYMENT RECEIPT</div>
        </td>
        <td style="width: 90px; text-align: right;">
          ${qrCodeUrl ? `<img src="${qrCodeUrl}" style="width: 85px; height: 85px;" alt="QR Code" />` : ''}
        </td>
      </tr>
    </table>

    <div class="meta-bar">
      <div>
        <div class="meta-label">Receipt Reference</div>
        <div class="meta-value">${receiptNo}</div>
      </div>
      <div>
        <div class="meta-label">Registration Token</div>
        <div class="meta-value" style="color: #0284c7;">${record.registrationToken}</div>
      </div>
      <div>
        <div class="meta-label">Date & Time Issued</div>
        <div class="meta-value">${formattedDate} ${formattedTime}</div>
      </div>
      <div>
        <div class="meta-label">Payment Status</div>
        <div class="stamp">${isVerified ? 'VERIFIED & CONFIRMED' : 'PROVISIONAL REGISTRATION'}</div>
      </div>
    </div>

    <table class="data-table">
      <tr>
        <th style="width: 25%;">Registered Event</th>
        <td style="width: 75%; font-weight: bold; font-size: 13px;">${record.eventName} (${record.eventType.toUpperCase()})</td>
      </tr>
      <tr>
        <th>Team Name</th>
        <td style="font-weight: bold; font-size: 13px; color: #0284c7;">${record.teamName}</td>
      </tr>
      <tr>
        <th>College / Institution</th>
        <td style="font-weight: bold;">${record.collegeName}</td>
      </tr>
      <tr>
        <th>Team Leader</th>
        <td><strong>${record.leaderName}</strong> (USN: ${record.studentId || 'N/A'}) • Phone: ${record.leaderPhone} • Email: ${record.leaderEmail}</td>
      </tr>
      ${record.themeId ? `<tr><th>Track / Theme</th><td><strong>${record.themeId}</strong></td></tr>` : ''}
      ${record.projectTitle ? `<tr><th>Project / Pitch Title</th><td><strong>${record.projectTitle}</strong></td></tr>` : ''}
    </table>

    ${record.members && record.members.length > 0 ? `
    <div style="font-size: 11px; font-weight: bold; margin-bottom: 6px; text-transform: uppercase;">Team Members Roll:</div>
    <table class="data-table">
      <thead>
        <tr>
          <th style="width: 8%;">Sl No.</th>
          <th>Participant Name</th>
          <th>Role</th>
          <th>USN / Student ID</th>
          <th>Contact Details</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td><strong>${record.leaderName}</strong></td>
          <td><span style="font-weight: bold; color: #0284c7;">Team Leader</span></td>
          <td>${record.studentId || 'N/A'}</td>
          <td>${record.leaderPhone} | ${record.leaderEmail}</td>
        </tr>
        ${record.members.map((m, idx) => `
          <tr>
            <td>${idx + 2}</td>
            <td><strong>${m.name}</strong></td>
            <td>Member</td>
            <td>${m.usn || 'N/A'}</td>
            <td>${m.phone || '—'} | ${m.email || '—'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    ` : ''}

    <div style="font-size: 11px; font-weight: bold; margin-bottom: 6px; text-transform: uppercase;">Fee Particulars & Accounts Breakdown:</div>
    <table class="data-table">
      <thead>
        <tr>
          <th style="width: 8%;">Sl.</th>
          <th>Fee Description</th>
          <th>Payment Mode</th>
          <th>Reference / UTR No.</th>
          <th style="text-align: right; width: 18%;">Amount (INR)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1.</td>
          <td><strong>Team Registration Fee - ${record.eventName}</strong><br/><span style="font-size: 10px; color: #64748b;">Full Access Pass, Evaluation Kit & Official Certificates</span></td>
          <td><strong>${isCash ? 'Cash at Secretariat' : 'Online UPI'}</strong></td>
          <td><code style="font-family: monospace; font-size: 11px; font-weight: bold;">${record.utrNumber || (isCash ? 'CASH-DESK-' + record.registrationToken : 'N/A')}</code></td>
          <td style="text-align: right; font-weight: bold; font-size: 13px;">₹${Number(record.amount).toLocaleString('en-IN')}.00</td>
        </tr>
        <tr>
          <td colspan="4" style="text-align: right; font-weight: bold;">Total Amount Received:</td>
          <td style="text-align: right; font-weight: 900; font-size: 14px; color: #059669;">₹${Number(record.amount).toLocaleString('en-IN')}.00</td>
        </tr>
      </tbody>
    </table>

    <div style="background: #f8fafc; border: 1px dashed #cbd5e1; padding: 8px 12px; border-radius: 4px; font-size: 11px; margin-bottom: 16px;">
      <strong>Amount in Words:</strong> <span style="font-style: italic; color: #0f172a;">${amountWords}</span>
    </div>

    <div class="terms">
      <strong>Terms & Official Instructions:</strong><br/>
      1. This document serves as the official fee voucher and entry badge for the registered team.<br/>
      2. All team members must report to the campus registration desk with their original college ID card.<br/>
      3. Registration includes technical kit, participant lanyard, Wi-Fi credentials, meals & refreshments, and participation certificates.<br/>
      4. Registration fees are non-refundable under all festival guidelines.
    </div>

    <div class="sig-row">
      <div class="sig-box">
        Team Leader Signature<br/>
        <span style="font-size: 9px; font-weight: normal; color: #64748b;">(Digital Acceptance Confirmed)</span>
      </div>
      <div style="text-align: center;">
        <div style="display: inline-block; border: 2px solid #059669; color: #059669; padding: 6px 14px; border-radius: 50%; font-size: 10px; font-weight: 900; text-transform: uppercase; transform: rotate(-5deg);">
          ★ LAEC BIDAR ★<br/>SECRETARIAT<br/>VERIFIED
        </div>
      </div>
      <div class="sig-box">
        Authorized Signatory<br/>
        <span style="font-size: 9px; font-weight: normal; color: #64748b;">Convener, Innovation Fest 2026</span>
      </div>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Official_Receipt_${record.teamName.replace(/\s+/g, '_')}_${record.registrationToken}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // WhatsApp share link
  const whatsappUrl = `https://wa.me/${record.leaderPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
    `🏛️ *LINGARAJ APPA ENGINEERING COLLEGE, BIDAR*\n` +
    `*INNOVATION FEST 2026 // OFFICIAL RECEIPT*\n\n` +
    `Dear ${record.leaderName},\n` +
    `Here is the official registration & payment receipt for team *${record.teamName}*.\n\n` +
    `🎟️ *Registration Token:* ${record.registrationToken}\n` +
    `🏆 *Event:* ${record.eventName}\n` +
    `💰 *Amount Paid:* ₹${record.amount} (${isCash ? 'Cash Verified' : 'UPI Online'})\n` +
    `💳 *Reference / UTR:* ${record.utrNumber || 'CASH-SECRETARIAT'}\n` +
    `📅 *Date:* ${formattedDate}\n` +
    `✅ *Status:* ${isVerified ? 'VERIFIED & CONFIRMED' : 'PROVISIONAL'}\n\n` +
    `Please present this receipt along with your college ID card at the campus secretariat desk on arrival.\n\n` +
    `Official Community: https://chat.whatsapp.com/KHE6DJo1fu0IrNtfjuLO50`
  )}`;

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Top Control Bar (Screen Only) */}
        <div className="p-4 sm:p-5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between flex-wrap gap-3 shrink-0 print-hide">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>Official Participant Receipt</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  {record.registrationToken}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Official institutional receipt & fee acknowledgement document for {record.teamName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-95 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-cyan-500/25 active:scale-95 transition-all"
              title="Print or Save as Vector PDF"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={handleDownloadHTML}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
              title="Download Standalone HTML Receipt"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Download HTML</span>
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
              title="Send Receipt to Participant on WhatsApp"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Send WhatsApp</span>
            </a>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors ml-1"
              title="Close Receipt Viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable & Visible Receipt Body */}
        <div className="p-4 sm:p-6 overflow-y-auto bg-slate-950 flex-1">
          <div
            id="official-printable-receipt"
            className="w-full max-w-3xl mx-auto bg-white text-slate-900 rounded-2xl p-6 sm:p-8 border-2 border-slate-900 shadow-xl font-sans"
          >
            {/* Institutional Header */}
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-5 gap-4">
              <div className="w-16 sm:w-20 shrink-0">
                <img
                  src="/assets/laec-crest.png"
                  alt="LAEC Crest"
                  className="w-14 sm:w-16 h-auto object-contain mx-auto"
                  onError={(e) => {
                    // Fallback if image fails to load
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>

              <div className="text-center flex-1 px-2">
                <div className="text-[10px] sm:text-[11px] font-bold tracking-widest text-slate-500 uppercase">
                  Sharana Basaveshwar Vidya Vardhak Sangha's
                </div>
                <h1 className="text-base sm:text-xl font-black text-slate-950 tracking-tight leading-tight mt-0.5 font-display">
                  LINGARAJ APPA ENGINEERING COLLEGE, BIDAR
                </h1>
                <div className="text-[9px] sm:text-[10px] text-slate-600 mt-0.5">
                  (Approved by AICTE, New Delhi • Affiliated to VTU, Belagavi • Accredited by NAAC)
                </div>
                <div className="text-[9px] text-slate-500">
                  Gumpa, Near Central Bus Stand, Bidar - 585403, Karnataka
                </div>
                <div className="text-xs sm:text-sm font-black text-sky-700 tracking-wide uppercase mt-1">
                  INNOVATION FEST 2026 // ENGINEERS' DAY CELEBRATIONS
                </div>
                <div className="inline-block px-3 py-0.5 mt-1 rounded bg-slate-950 text-white font-mono text-[10px] sm:text-xs font-bold tracking-wider">
                  OFFICIAL PARTICIPATION & FEE ACKNOWLEDGEMENT RECEIPT
                </div>
              </div>

              <div className="w-20 sm:w-24 shrink-0 text-right">
                {qrCodeUrl ? (
                  <div className="inline-block p-1 border border-slate-300 rounded bg-white shadow-sm">
                    <img
                      src={qrCodeUrl}
                      alt="Receipt QR Code"
                      className="w-16 sm:w-20 h-16 sm:h-20"
                    />
                    <div className="text-[7px] text-center font-mono font-bold text-slate-600 mt-0.5 uppercase tracking-tighter">
                      SCAN TO VERIFY
                    </div>
                  </div>
                ) : (
                  <div className="w-20 h-20 bg-slate-100 rounded border border-slate-300 flex items-center justify-center text-[9px] text-slate-400">
                    QR Ready
                  </div>
                )}
              </div>
            </div>

            {/* Receipt Metadata Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 border border-slate-300 rounded-xl p-3 my-4 text-xs font-mono">
              <div>
                <div className="text-[9px] uppercase tracking-wider text-slate-500 font-sans font-semibold">
                  Receipt Reference
                </div>
                <div className="font-bold text-slate-950 text-[11px] sm:text-xs mt-0.5">
                  {receiptNo}
                </div>
              </div>

              <div>
                <div className="text-[9px] uppercase tracking-wider text-slate-500 font-sans font-semibold">
                  Registration Token
                </div>
                <div className="font-black text-sky-700 text-xs sm:text-sm mt-0.5">
                  {record.registrationToken}
                </div>
              </div>

              <div>
                <div className="text-[9px] uppercase tracking-wider text-slate-500 font-sans font-semibold">
                  Issued On
                </div>
                <div className="font-medium text-slate-800 text-[10px] sm:text-[11px] mt-0.5">
                  {formattedDate}, {formattedTime}
                </div>
              </div>

              <div>
                <div className="text-[9px] uppercase tracking-wider text-slate-500 font-sans font-semibold">
                  Status
                </div>
                <div className="mt-0.5">
                  {isVerified ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 border border-emerald-300 text-emerald-800 text-[10px] font-bold">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      VERIFIED & CONFIRMED
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-100 border border-amber-300 text-amber-800 text-[10px] font-bold">
                      <Clock className="w-3 h-3 text-amber-600" />
                      PROVISIONAL
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Contestant Particulars Table */}
            <div className="mb-4">
              <table className="w-full text-xs border border-slate-300 border-collapse">
                <tbody>
                  <tr className="border-b border-slate-300">
                    <td className="w-1/3 bg-slate-100 px-3 py-2 font-bold text-slate-700 uppercase text-[10px]">
                      Registered Event
                    </td>
                    <td className="w-2/3 px-3 py-2 font-black text-slate-900 text-sm">
                      {record.eventName}{' '}
                      <span className="text-[10px] font-mono font-normal text-slate-500 uppercase">
                        ({record.eventType})
                      </span>
                    </td>
                  </tr>

                  <tr className="border-b border-slate-300">
                    <td className="bg-slate-100 px-3 py-2 font-bold text-slate-700 uppercase text-[10px]">
                      Team Name
                    </td>
                    <td className="px-3 py-2 font-black text-sky-800 text-sm">
                      {record.teamName}
                    </td>
                  </tr>

                  <tr className="border-b border-slate-300">
                    <td className="bg-slate-100 px-3 py-2 font-bold text-slate-700 uppercase text-[10px]">
                      Institution / College
                    </td>
                    <td className="px-3 py-2 font-bold text-slate-800">
                      {record.collegeName}
                    </td>
                  </tr>

                  <tr className="border-b border-slate-300">
                    <td className="bg-slate-100 px-3 py-2 font-bold text-slate-700 uppercase text-[10px]">
                      Team Leader Details
                    </td>
                    <td className="px-3 py-2 text-slate-800">
                      <span className="font-bold text-slate-950">{record.leaderName}</span>
                      {record.studentId && (
                        <span className="font-mono text-slate-600"> (USN: {record.studentId})</span>
                      )}
                      <div className="text-[11px] text-slate-600 flex items-center gap-3 mt-0.5">
                        <span>📞 {record.leaderPhone}</span>
                        <span>✉️ {record.leaderEmail}</span>
                      </div>
                    </td>
                  </tr>

                  {record.themeId && (
                    <tr className="border-b border-slate-300">
                      <td className="bg-slate-100 px-3 py-2 font-bold text-slate-700 uppercase text-[10px]">
                        Allocated Track / Theme
                      </td>
                      <td className="px-3 py-2 font-semibold text-slate-900">
                        {record.themeId}
                      </td>
                    </tr>
                  )}

                  {record.projectTitle && (
                    <tr className="border-b border-slate-300">
                      <td className="bg-slate-100 px-3 py-2 font-bold text-slate-700 uppercase text-[10px]">
                        Project / Solution Title
                      </td>
                      <td className="px-3 py-2 font-semibold text-slate-900">
                        {record.projectTitle}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Team Members Roll (If present) */}
            {record.members && record.members.length > 0 && (
              <div className="mb-4">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1 flex items-center justify-between">
                  <span>Accredited Team Roster ({record.members.length + 1} Members)</span>
                </div>
                <table className="w-full text-[11px] border border-slate-300 border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-300 text-left">
                      <th className="px-2.5 py-1.5 font-bold text-slate-700 w-10">#</th>
                      <th className="px-2.5 py-1.5 font-bold text-slate-700">Member Name</th>
                      <th className="px-2.5 py-1.5 font-bold text-slate-700">Role</th>
                      <th className="px-2.5 py-1.5 font-bold text-slate-700">USN / ID</th>
                      <th className="px-2.5 py-1.5 font-bold text-slate-700">Contact Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-200 bg-sky-50/40">
                      <td className="px-2.5 py-1 font-mono font-bold text-slate-600">1</td>
                      <td className="px-2.5 py-1 font-bold text-slate-900">
                        {record.leaderName}
                      </td>
                      <td className="px-2.5 py-1 font-bold text-sky-800 text-[10px]">
                        Team Leader
                      </td>
                      <td className="px-2.5 py-1 font-mono text-slate-700">
                        {record.studentId || '—'}
                      </td>
                      <td className="px-2.5 py-1 text-slate-600 text-[10px]">
                        {record.leaderPhone} • {record.leaderEmail}
                      </td>
                    </tr>
                    {record.members.map((m, idx) => (
                      <tr key={idx} className="border-b border-slate-200">
                        <td className="px-2.5 py-1 font-mono text-slate-500">{idx + 2}</td>
                        <td className="px-2.5 py-1 font-semibold text-slate-900">{m.name}</td>
                        <td className="px-2.5 py-1 text-slate-500 text-[10px]">Member</td>
                        <td className="px-2.5 py-1 font-mono text-slate-600">{m.usn || '—'}</td>
                        <td className="px-2.5 py-1 text-slate-600 text-[10px]">
                          {m.phone || '—'} • {m.email || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Financial Ledger Table */}
            <div className="mb-4">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                Fee Particulars & Accounts Breakdown
              </div>
              <table className="w-full text-xs border border-slate-300 border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 text-left">
                    <th className="px-3 py-2 font-bold text-slate-700 w-10">Sl.</th>
                    <th className="px-3 py-2 font-bold text-slate-700">Fee Particulars</th>
                    <th className="px-3 py-2 font-bold text-slate-700">Mode</th>
                    <th className="px-3 py-2 font-bold text-slate-700">Reference / UTR</th>
                    <th className="px-3 py-2 font-bold text-slate-700 text-right w-28">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-300">
                    <td className="px-3 py-2 font-mono text-slate-500">1.</td>
                    <td className="px-3 py-2">
                      <div className="font-bold text-slate-900">
                        Team Registration Fee — {record.eventName}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Includes Access Pass, Technical Evaluation, Kit & E-Certificates
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <span className="inline-flex items-center gap-1 font-semibold text-slate-800">
                        {isCash ? (
                          <>
                            <Banknote className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Cash Desk</span>
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                            <span>UPI Online</span>
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-3 py-2 font-mono text-slate-700 font-bold text-[11px]">
                      {record.utrNumber || (isCash ? `CASH-${record.registrationToken}` : 'N/A')}
                    </td>
                    <td className="px-3 py-2 font-black text-slate-900 text-right text-sm">
                      ₹{Number(record.amount).toLocaleString('en-IN')}.00
                    </td>
                  </tr>

                  <tr className="bg-slate-50">
                    <td colSpan={4} className="px-3 py-2 text-right font-bold text-slate-700">
                      Total Amount Received:
                    </td>
                    <td className="px-3 py-2 font-black text-emerald-800 text-right text-base font-mono">
                      ₹{Number(record.amount).toLocaleString('en-IN')}.00
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Amount in Words Box */}
              <div className="mt-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <span className="font-bold text-slate-700 uppercase text-[10px] tracking-wider block sm:inline mr-2">
                  Amount in Words:
                </span>
                <span className="font-bold italic text-slate-900 font-serif">
                  {amountWords}
                </span>
              </div>
            </div>

            {/* Official Terms & Conditions */}
            <div className="border-t border-slate-200 pt-3 text-[9px] text-slate-500 leading-relaxed">
              <div className="font-bold text-slate-700 uppercase tracking-wider mb-0.5">
                Official Instructions & Notice:
              </div>
              <ol className="list-decimal pl-4 space-y-0.5">
                <li>
                  This document serves as the official fee voucher and entry pass for the enrolled team at Innovation Fest 2026.
                </li>
                <li>
                  All team members must carry their valid College / Institution Photo ID cards along with this receipt for campus security check-in.
                </li>
                <li>
                  Participation entitles the team to technical evaluation slots, event kits, credentials, meals & refreshments, and official certificates.
                </li>
                <li>
                  Registration fees once paid are strictly non-refundable and non-transferable under all festival guidelines.
                </li>
              </ol>
            </div>

            {/* Signatures & Seal Section */}
            <div className="mt-8 pt-4 border-t-2 border-slate-900 flex items-end justify-between text-xs">
              <div className="text-center w-40">
                <div className="font-mono text-[9px] text-slate-400 mb-6">
                  [DIGITALLY VERIFIED]
                </div>
                <div className="border-t border-slate-400 pt-1 font-bold text-slate-800 text-[11px]">
                  Participant / Leader
                </div>
                <div className="text-[9px] text-slate-500">Candidate Signature</div>
              </div>

              {/* Circular Seal Emblem */}
              <div className="text-center">
                <div className="inline-block p-2 rounded-full border-2 border-emerald-700 text-emerald-800 text-center font-bold text-[8px] uppercase tracking-tighter shadow-sm transform -rotate-3 bg-emerald-50/50">
                  <div className="font-black text-[9px]">★ LAEC BIDAR ★</div>
                  <div>SECRETARIAT</div>
                  <div>OFFICIAL SEAL</div>
                  <div className="text-[7px] text-emerald-600">SEPTEMBER 2026</div>
                </div>
              </div>

              <div className="text-center w-44">
                <div className="font-mono text-[9px] text-emerald-700 font-bold mb-6">
                  ✓ AUTHORIZED AUDIT
                </div>
                <div className="border-t border-slate-400 pt-1 font-bold text-slate-900 text-[11px]">
                  Convener & Accounts Officer
                </div>
                <div className="text-[9px] text-slate-500">Innovation Fest 2026, LAEC</div>
              </div>
            </div>

            {/* Bottom Computer Disclaimer */}
            <div className="mt-5 pt-2 border-t border-dashed border-slate-300 text-[8px] text-center text-slate-400 font-mono">
              COMPUTER-GENERATED AUTHENTIC RECEIPT • VALID WITH QR CODE VERIFICATION • LINGARAJ APPA ENGINEERING COLLEGE, BIDAR
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
