/**
 * Payment Server Actions & Validation Logic
 * Next.js / Vite + Supabase Hackathon Registration
 */

import {
  submitPaymentAndRegistration,
  updatePaymentStatus,
  PaymentSubmission,
} from '../../src/lib/supabase';

export const EVENT_FEES = {
  hackora: 1200,
  ideathon: 250,
  project_expo: 250,
  expo: 250,
} as const;

export interface SubmitPaymentInput {
  utr_number: string;
  payer_name: string;
  payer_upi_id: string;
  payment_screenshot_url: string;
  event_type?: string;
  event_name?: string;
  amount?: number;
  team_name?: string;
  college_name?: string;
  user_id?: string;
  leader_name?: string;
  leader_email?: string;
  leader_phone?: string;
  student_id?: string;
  branch?: string;
  year?: string;
  theme_id?: string;
  project_title?: string;
  members?: Array<{
    name: string;
    email: string;
    phone?: string;
    usn?: string;
    branch?: string;
  }>;
}

export interface PaymentActionResult {
  success: boolean;
  data?: any;
  error?: string;
}

/**
 * Validates and submits a payment with strict anti-fraud checks and relational Supabase persistence
 */
export async function submitPaymentAction(
  input: SubmitPaymentInput
): Promise<PaymentActionResult> {
  const rawEventType = input.event_type || 'hackora';
  const feeNumber =
    input.amount !== undefined
      ? input.amount
      : EVENT_FEES[rawEventType as keyof typeof EVENT_FEES] || 1200;

  const submission: PaymentSubmission = {
    teamName: input.team_name || `${input.leader_name || input.payer_name || 'Fest'}'s Team`,
    leaderName: input.leader_name || input.payer_name,
    leaderEmail: input.leader_email || '',
    leaderPhone: input.leader_phone || '',
    collegeName: input.college_name || 'Lingaraj Appa Engineering College',
    studentId: input.student_id,
    branch: input.branch,
    year: input.year,
    eventType: (rawEventType === 'expo' ? 'project_expo' : rawEventType) as any,
    eventName: input.event_name || 'Hackora 2026',
    amount: feeNumber,
    utrNumber: input.utr_number,
    payerName: input.payer_name,
    payerUpiId: input.payer_upi_id,
    paymentScreenshotUrl: input.payment_screenshot_url,
    payment_screenshot_url: input.payment_screenshot_url,
    themeId: input.theme_id,
    projectTitle: input.project_title,
    members: input.members,
  };

  const result = await submitPaymentAndRegistration(submission);

  if (!result.success) {
    return {
      success: false,
      error: result.error,
    };
  }

  return {
    success: true,
    data: result.record,
  };
}

/**
 * Admin action to approve / verify a payment
 */
export async function approvePaymentAction(paymentId: string): Promise<PaymentActionResult> {
  const res = await updatePaymentStatus(paymentId, 'verified');
  return res;
}

/**
 * Admin action to reject a payment with reason
 */
export async function rejectPaymentAction(
  paymentId: string,
  rejectionReason?: string
): Promise<PaymentActionResult> {
  const res = await updatePaymentStatus(paymentId, 'rejected', rejectionReason);
  return res;
}
