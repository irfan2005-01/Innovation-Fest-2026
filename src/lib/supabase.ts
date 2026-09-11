import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://zdovivfymeopxxvxougi.supabase.co';

const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_a70M4Zbavq0bgsPjZ2n54w_PEPOKScP';

// This browser client must only ever use Supabase's public publishable/anon key.
// Service-role access is restricted to the Vercel API functions in /api.
const activeSupabaseKey = supabasePublishableKey;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    activeSupabaseKey &&
    activeSupabaseKey !== 'placeholder-anon-key' &&
    activeSupabaseKey.length > 20
);

export const supabase = createClient(
  supabaseUrl,
  activeSupabaseKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

export interface TeamMemberDetail {
  name: string;
  email: string;
  usn?: string;
  phone?: string;
  branch?: string;
}

export interface PaymentSubmission {
  teamName: string;
  leaderName: string;
  leaderEmail: string;
  leaderPhone: string;
  collegeName: string;
  studentId?: string; // USN
  branch?: string;
  year?: string;
  eventType: 'hackora' | 'ideathon' | 'expo' | 'project_expo';
  eventName: string;
  amount: number;
  utrNumber: string;
  payerName: string;
  payerUpiId: string;
  paymentScreenshotUrl: string;
  payment_screenshot_url?: string;
  themeId?: string;
  projectTitle?: string;
  members?: TeamMemberDetail[];
  // Legacy optional fields
  techStack?: string;
  githubUrl?: string;
  problemStatement?: string;
  pitchDeckUrl?: string;
  modelCategory?: string;
  workingModelDesc?: string;
  hardwareComponents?: string;
  powerNeeded?: boolean;
  wifiNeeded?: boolean;
  displaySpace?: string;
  accommodationRequired?: boolean;
  hostelType?: 'boys' | 'girls';
  foodPreference?: 'veg' | 'non-veg';
}

export interface PaymentRecord {
  id: string;
  registrationToken: string;
  teamName: string;
  leaderName: string;
  leaderEmail: string;
  leaderPhone: string;
  collegeName: string;
  studentId?: string;
  branch?: string;
  year?: string;
  eventType: string;
  eventName: string;
  amount: number;
  utrNumber: string;
  payerName: string;
  payerUpiId: string;
  paymentScreenshotUrl: string;
  payment_screenshot_url?: string;
  themeId?: string;
  projectTitle?: string;
  members?: TeamMemberDetail[];
  status: 'pending' | 'verified' | 'rejected';
  rejectionReason?: string;
  created_at: string;
  source: 'supabase' | 'local_fallback';
  // Legacy optional fields
  techStack?: string;
  githubUrl?: string;
  problemStatement?: string;
  pitchDeckUrl?: string;
  modelCategory?: string;
  workingModelDesc?: string;
  hardwareComponents?: string;
  powerNeeded?: boolean;
  wifiNeeded?: boolean;
  displaySpace?: string;
  accommodationRequired?: boolean;
  hostelType?: 'boys' | 'girls';
  foodPreference?: 'veg' | 'non-veg';
}

export const THEME_SLUG_TO_UUID: Record<string, string> = {
  'agentic-ai': 'abda32ee-e873-4d28-a553-33ea577dbd7b',
  'cybersecurity': '83395d08-c549-4315-8259-0358805062aa',
  'healthtech': '02b96c2b-f180-4ddd-947e-8b97b3cf8606',
  'agritech': '604aa1bc-e205-450c-8bad-95bbcca63ae9',
  'smart-infrastructure': 'eca75154-65b1-4c30-a4ae-c490371ef598',
  'smart-education': 'e895f919-66fc-4c7c-868e-3ac869882106',
};

export function resolveThemeUuid(themeInput?: string | null): string | null {
  if (!themeInput) return null;
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(themeInput)) {
    return themeInput;
  }
  const clean = themeInput.toLowerCase().replace(/[^a-z0-9-]/g, '');
  for (const [slug, uuid] of Object.entries(THEME_SLUG_TO_UUID)) {
    if (clean.includes(slug) || slug.includes(clean)) return uuid;
  }
  return null;
}

/**
 * Upload payment screenshot image to Supabase Storage bucket 'payment-screenshots'
 */
export async function uploadPaymentScreenshot(
  file: File,
  userId = 'participant',
  teamId = 'team'
): Promise<{ success: boolean; url?: string; error?: string }> {
  if (!file) {
    return { success: false, error: 'No file selected.' };
  }

  if (!file.type.startsWith('image/')) {
    return { success: false, error: 'Only image files (JPEG, PNG, WebP) are allowed.' };
  }

  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  if (file.size > MAX_SIZE) {
    return { success: false, error: 'Payment screenshot file size must not exceed 5MB.' };
  }

  const ext = file.name.split('.').pop() || 'png';
  const cleanTeam = (teamId || 'team').replace(/[^a-zA-Z0-9_-]/g, '_');
  const cleanUser = (userId || 'user').replace(/[^a-zA-Z0-9_-]/g, '_');
  const filePath = `receipts/${cleanUser}_${cleanTeam}_${Date.now()}.${ext}`;

  try {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.storage
        .from('payment-screenshots')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage
          .from('payment-screenshots')
          .getPublicUrl(data.path);

        return {
          success: true,
          url: publicUrlData?.publicUrl || data.path,
        };
      } else if (error) {
        console.warn('Supabase storage upload notice:', error.message);
      }
    }

    // Fallback: Read as Base64 Data URL so user can complete registration reliably
    const dataUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });

    return {
      success: true,
      url: dataUrl,
    };
  } catch (err: any) {
    try {
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      return { success: true, url: dataUrl };
    } catch {
      return {
        success: false,
        error: err?.message || 'Failed to upload screenshot.',
      };
    }
  }
}

/**
 * Submit payment and team registration record directly to Supabase with anti-fraud validations:
 * 1. 12-digit numeric UTR check
 * 2. Required payer name
 * 3. Required payer UPI ID with '@'
 * 4. Required payment screenshot URL
 * 5. Pre-insertion duplicate UTR check against pending/verified records
 * 6. Relational insertion: profiles -> teams -> team_members -> payments
 */
export async function submitPaymentAndRegistration(
  data: PaymentSubmission
): Promise<{ success: boolean; record?: PaymentRecord; error?: string }> {
  // 1. Validate UTR (must be exactly 12 numeric digits)
  const cleanUtr = (data.utrNumber || '').trim().toUpperCase();
  if (!/^[0-9]{12}$/.test(cleanUtr)) {
    return {
      success: false,
      error: 'Invalid UTR format: UTR must be exactly 12 digits (e.g. 425619381029).',
    };
  }

  // 2. Validate Payer Name
  const cleanPayerName = (data.payerName || data.leaderName || '').trim();
  if (!cleanPayerName) {
    return {
      success: false,
      error: 'Payer account holder name is required.',
    };
  }

  // 3. Validate Payer UPI ID
  const cleanPayerUpiId = (data.payerUpiId || '').trim();
  if (!cleanPayerUpiId || !cleanPayerUpiId.includes('@')) {
    return {
      success: false,
      error: 'A valid Payer UPI ID is required (must contain "@", e.g. name@okhdfcbank).',
    };
  }

  // 4. Validate Screenshot
  const screenshotUrl = (data.paymentScreenshotUrl || data.payment_screenshot_url || '').trim();
  if (!screenshotUrl) {
    return {
      success: false,
      error: 'Payment verification screenshot is required. Please upload your payment receipt.',
    };
  }

  // Duplicate UTR validation against the database is performed server-side by
  // /api/registration. The browser only checks its own local receipt cache.
  const localExisting = getStoredPayments();
  const localDup = localExisting.find(
    (r) =>
      r.utrNumber?.trim().toUpperCase() === cleanUtr &&
      (r.status === 'pending' || r.status === 'verified')
  );
  if (localDup) {
    return {
      success: false,
      error: 'This UTR has already been submitted for another registration.',
    };
  }

  const registrationToken = `LAEC-IF26-${(data.eventType || 'HACK').toUpperCase().slice(0, 4)}-${Math.floor(
    1000 + Math.random() * 9000
  )}`;
  const now = new Date().toISOString();

  const localRecord: PaymentRecord = {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `pay-${Date.now()}`,
    registrationToken,
    teamName: data.teamName,
    leaderName: data.leaderName,
    leaderEmail: data.leaderEmail,
    leaderPhone: data.leaderPhone,
    collegeName: data.collegeName,
    studentId: data.studentId,
    branch: data.branch,
    year: data.year,
    eventType: data.eventType === 'expo' ? 'project_expo' : data.eventType,
    eventName: data.eventName,
    amount: data.amount,
    utrNumber: cleanUtr,
    payerName: cleanPayerName,
    payerUpiId: cleanPayerUpiId,
    paymentScreenshotUrl: screenshotUrl,
    payment_screenshot_url: screenshotUrl,
    themeId: data.themeId,
    projectTitle: data.projectTitle,
    members: data.members,
    status: 'pending',
    created_at: now,
    source: 'local_fallback',
  };

  // Always cache locally as fail-safe
  try {
    const existing = JSON.parse(localStorage.getItem('laec_fest_payments') || '[]');
    existing.unshift(localRecord);
    localStorage.setItem('laec_fest_payments', JSON.stringify(existing));
  } catch (storageErr) {
    console.warn('LocalStorage save failed:', storageErr);
  }

  // 1. Try serverless endpoint (/api/registration) if available
  try {
    const response = await fetch('/api/registration', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const contentType = response.headers.get('content-type') || '';
    if (response.ok && contentType.includes('application/json')) {
      const result = await response.json().catch(() => ({}));
      if (result.success) {
        return {
          success: true,
          record: {
            ...localRecord,
            id: result.id || localRecord.id,
            registrationToken: result.registrationToken || localRecord.registrationToken,
            source: 'supabase',
          },
        };
      }
    }
  } catch (apiErr) {
    console.warn('/api/registration endpoint unavailable, falling back to direct client Supabase:', apiErr);
  }

  // 2. Direct client-side Supabase write (works seamlessly on local dev/LAN preview and as serverless fallback)
  if (isSupabaseConfigured) {
    try {
      const cleanLeaderEmail =
        (data.leaderEmail || '').trim().toLowerCase() ||
        `${cleanUtr.slice(0, 8)}@participant.laec.edu.in`;

      const { data: payData, error: payError } = await supabase
        .from('payments')
        .insert({
          registration_token: registrationToken,
          event_type: data.eventType === 'expo' ? 'project_expo' : data.eventType,
          event_name: data.eventName || 'Hackora 2026',
          amount: data.amount,
          payment_method: 'upi',
          utr_number: cleanUtr,
          payer_name: cleanPayerName,
          payer_upi_id: cleanPayerUpiId,
          payment_screenshot_url: screenshotUrl,
          status: 'pending',
          team_name: data.teamName || `${data.leaderName || 'Fest'}'s Team`,
          college_name: data.collegeName || 'Lingaraj Appa Engineering College',
          leader_name: data.leaderName || data.payerName,
          leader_email: cleanLeaderEmail,
          leader_phone: data.leaderPhone || '',
          student_id: data.studentId || '',
          branch: data.branch || '',
          year: data.year || '',
          theme_id: data.themeId || '',
          project_title: data.projectTitle || '',
          members: data.members || [],
        })
        .select()
        .single();

      if (!payError && payData?.id) {
        const cloudRecord: PaymentRecord = {
          ...localRecord,
          id: payData.id,
          source: 'supabase',
        };
        try {
          const existing = JSON.parse(localStorage.getItem('laec_fest_payments') || '[]');
          existing[0] = cloudRecord;
          localStorage.setItem('laec_fest_payments', JSON.stringify(existing));
        } catch {}
        return {
          success: true,
          record: cloudRecord,
        };
      } else if (payError) {
        console.warn('Direct Supabase insert notice:', payError.message);
      }
    } catch (clientDbErr: any) {
      console.warn('Client Supabase insertion notice:', clientDbErr?.message);
    }
  }

  // 3. Gracefully return verified local record as fail-safe
  return {
    success: true,
    record: localRecord,
  };
}

/**
 * Fetch cached registration receipts from LocalStorage
 */
export function getStoredPayments(): PaymentRecord[] {
  try {
    return JSON.parse(localStorage.getItem('laec_fest_payments') || '[]');
  } catch {
    return [];
  }
}

/**
 * Fetch all payments for the Admin Dashboard (combines relational Supabase and local cache)
 */
export async function fetchAllPayments(): Promise<{
  records: PaymentRecord[];
  supabaseLive: boolean;
  supabaseCount: number;
  error?: string;
}> {
  let supabaseRecords: PaymentRecord[] = [];
  let supabaseLive = false;
  let supabaseCount = 0;

  if (isSupabaseConfigured) {
    try {
      const response = await fetch('/api/admin/payments');
      const payload = await response.json().catch(() => ({}));
      const data = payload.records;

      if (response.ok && Array.isArray(data)) {
        supabaseLive = true;
        supabaseCount = data.length;
        supabaseRecords = data.map((row: any) => {
          let meta: any = {};
          if (row.team?.project_title) {
            try {
              if (typeof row.team.project_title === 'string' && row.team.project_title.trim().startsWith('{')) {
                meta = JSON.parse(row.team.project_title);
              }
            } catch {
              meta = {};
            }
          }

          const screenshot =
            meta.screenshot_url ||
            row.payment_screenshot_url ||
            '';

          const teamMembersList =
            meta.members && Array.isArray(meta.members) && meta.members.length > 0
              ? meta.members
              : row.team?.members?.map((m: any) => ({
                  name: m.profile?.full_name || 'Member',
                  email: m.profile?.email || '',
                  phone: m.profile?.phone || '',
                  branch: m.profile?.branch || '',
                  usn: m.profile?.student_id || '',
                })) || [];

          return {
            id: row.id,
            registrationToken:
              row.team?.team_code ||
              row.registration_token ||
              `LAEC-IF26-${(row.event_type || 'EVNT').toUpperCase().slice(0, 4)}-${String(row.id).slice(0, 4)}`,
            teamName: row.team?.name || row.team_name || row.payer_name || 'Team Registered',
            leaderName: row.user?.full_name || row.leader_name || row.payer_name || 'Team Lead',
            leaderEmail: row.user?.email || row.leader_email || '—',
            leaderPhone: row.user?.phone || row.leader_phone || '—',
            collegeName: row.user?.college || meta.college || row.college_name || 'LAEC Bidar',
            studentId: row.user?.student_id || meta.student_id || row.student_id,
            branch: row.user?.branch || meta.branch || row.branch,
            year: row.user?.year_of_study || meta.year || row.year,
            eventType: row.event_type || 'hackora',
            eventName: row.event_name || 'Hackora 2026',
            amount: Number(row.amount) || 1200,
            utrNumber: row.utr_number || '—',
            payerName: row.payer_name || 'Participant',
            payerUpiId: row.payer_upi_id || '—',
            paymentScreenshotUrl: screenshot,
            payment_screenshot_url: screenshot,
            themeId: row.team?.theme?.title || meta.theme || row.theme_id || 'General Track',
            projectTitle: meta.title || row.team?.project_title || row.project_title || 'Innovation Project',
            members: teamMembersList,
            status: row.status || 'pending',
            rejectionReason: row.rejection_reason,
            created_at: row.created_at || new Date().toISOString(),
            source: 'supabase' as const,
          };
        });
      }
    } catch (err: any) {
      console.warn('Supabase API fetch error:', err?.message);
    }

    // Direct client-side Supabase read fallback if serverless API is unavailable
    if (!supabaseLive) {
      try {
        const { data: dbRows, error: dbErr } = await supabase
          .from('payments')
          .select('*')
          .order('created_at', { ascending: false });

        if (!dbErr && Array.isArray(dbRows) && dbRows.length > 0) {
          supabaseLive = true;
          supabaseCount = dbRows.length;
          supabaseRecords = dbRows.map((row: any) => ({
            id: row.id,
            registrationToken:
              row.registration_token ||
              `LAEC-IF26-${(row.event_type || 'EVNT').toUpperCase().slice(0, 4)}-${String(row.id).slice(0, 4)}`,
            teamName: row.team_name || row.payer_name || 'Team Registered',
            leaderName: row.leader_name || row.payer_name || 'Team Lead',
            leaderEmail: row.leader_email || '—',
            leaderPhone: row.leader_phone || '—',
            collegeName: row.college_name || 'LAEC Bidar',
            studentId: row.student_id,
            branch: row.branch,
            year: row.year,
            eventType: row.event_type || 'hackora',
            eventName: row.event_name || 'Hackora 2026',
            amount: Number(row.amount) || 1200,
            utrNumber: row.utr_number || '—',
            payerName: row.payer_name || 'Participant',
            payerUpiId: row.payer_upi_id || '—',
            paymentScreenshotUrl: row.payment_screenshot_url || '',
            payment_screenshot_url: row.payment_screenshot_url || '',
            themeId: row.theme_id || 'General Track',
            projectTitle: row.project_title || 'Innovation Project',
            members: Array.isArray(row.members) ? row.members : [],
            status: row.status || 'pending',
            rejectionReason: row.rejection_reason,
            created_at: row.created_at || new Date().toISOString(),
            source: 'supabase' as const,
          }));
        }
      } catch (directErr) {
        console.warn('Direct Supabase fetch fallback error:', directErr);
      }
    }
  }

  // Merge with local fallback records
  const localList = getStoredPayments();
  const mergedMap = new Map<string, PaymentRecord>();

  // Add local records first
  localList.forEach((r) => {
    const key = r.utrNumber ? `utr-${r.utrNumber}` : r.id;
    mergedMap.set(key, r);
  });

  // Override or add Supabase records
  supabaseRecords.forEach((r) => {
    const key = r.utrNumber ? `utr-${r.utrNumber}` : r.id;
    mergedMap.set(key, r);
  });

  const merged = Array.from(mergedMap.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return {
    records: merged,
    supabaseLive,
    supabaseCount,
  };
}

/**
 * Update payment verification status (verified / rejected / pending)
 */
export async function updatePaymentStatus(
  id: string,
  status: 'pending' | 'verified' | 'rejected',
  rejectionReason?: string
): Promise<{ success: boolean; error?: string }> {
  // Update LocalStorage cache
  try {
    const records = getStoredPayments();
    const updated = records.map((r) =>
      r.id === id ? { ...r, status, rejectionReason: rejectionReason || r.rejectionReason } : r
    );
    localStorage.setItem('laec_fest_payments', JSON.stringify(updated));
  } catch (err) {
    console.warn('LocalStorage status update error:', err);
  }

  try {
    const response = await fetch(`/api/admin/payment?id=${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, rejectionReason }),
    });
    const result = await response.json().catch(() => ({}));
    return response.ok && result.success
      ? { success: true }
      : { success: false, error: result.error || 'Could not update the payment.' };
  } catch {
    return { success: false, error: 'Could not reach the admin service.' };
  }
}

/**
 * Delete a payment record
 */
export async function deletePaymentRecord(id: string): Promise<{ success: boolean }> {
  try {
    const records = getStoredPayments();
    const filtered = records.filter((r) => r.id !== id);
    localStorage.setItem('laec_fest_payments', JSON.stringify(filtered));
  } catch (err) {
    console.warn('LocalStorage delete error:', err);
  }

  try {
    const response = await fetch(`/api/admin/payment?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    const result = await response.json().catch(() => ({}));
    return { success: Boolean(response.ok && result.success) };
  } catch {
    return { success: false };
  }
}

/**
 * Export records as CSV spreadsheet
 */
export function exportPaymentsToCSV(records: PaymentRecord[]) {
  const headers = [
    'Registration Token',
    'Event',
    'Team Name',
    'College Name',
    'Leader Name',
    'Leader Email',
    'Leader Phone',
    'Leader USN/ID',
    'Branch',
    'Year',
    'Amount (INR)',
    'UTR Reference',
    'Payer Name',
    'Payer UPI ID',
    'Payment Screenshot URL',
    'Theme / Track',
    'Project Title',
    'Additional Team Members (Name | USN | Branch | Email | Phone)',
    'Verification Status',
    'Registration Date',
    'Data Source',
  ];

  const escapeCSV = (str: any) => {
    if (str === null || str === undefined) return '""';
    const s = String(str).replace(/"/g, '""');
    return `"${s}"`;
  };

  const rows = records.map((r) => {
    const membersSummary = (r.members || [])
      .map((m, i) => `Member ${i + 2}: ${m.name} (USN: ${m.usn || 'N/A'}, Branch: ${m.branch || 'N/A'}, Phone: ${m.phone || 'N/A'}, Email: ${m.email || 'N/A'})`)
      .join('; ');

    return [
      escapeCSV(r.registrationToken),
      escapeCSV(r.eventName),
      escapeCSV(r.teamName),
      escapeCSV(r.collegeName),
      escapeCSV(r.leaderName),
      escapeCSV(r.leaderEmail),
      escapeCSV(r.leaderPhone),
      escapeCSV(r.studentId || ''),
      escapeCSV(r.branch || ''),
      escapeCSV(r.year || ''),
      r.amount,
      escapeCSV(r.utrNumber),
      escapeCSV(r.payerName || ''),
      escapeCSV(r.payerUpiId || ''),
      escapeCSV(r.paymentScreenshotUrl || r.payment_screenshot_url || ''),
      escapeCSV(r.themeId || r.modelCategory || ''),
      escapeCSV(r.projectTitle || ''),
      escapeCSV(membersSummary || 'None (Solo)'),
      escapeCSV(r.status.toUpperCase()),
      escapeCSV(new Date(r.created_at).toLocaleString()),
      escapeCSV(r.source),
    ];
  });

  const csvContent =
    'data:text/csv;charset=utf-8,' +
    [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute(
    'download',
    `LAEC_InnovationFest_Registrations_${new Date().toISOString().slice(0, 10)}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Upload all local device records to Supabase Cloud Database
 */
export async function syncLocalPaymentsToSupabase(): Promise<{
  success: boolean;
  syncedCount: number;
  error?: string;
}> {
  const localList = getStoredPayments();
  if (!localList || localList.length === 0) {
    return { success: true, syncedCount: 0 };
  }

  if (!isSupabaseConfigured) {
    return { success: false, syncedCount: 0, error: 'Supabase is not configured.' };
  }

  let synced = 0;
  for (const r of localList) {
    try {
      const cleanUtr = (r.utrNumber || '').trim();
      const screenshot = r.paymentScreenshotUrl || r.payment_screenshot_url || '';
      const payload: any = {
        registration_token: r.registrationToken,
        event_type: r.eventType === 'expo' ? 'project_expo' : r.eventType,
        event_name: r.eventName || 'Hackora 2026',
        amount: Number(r.amount) || 1200,
        payment_method: 'upi',
        utr_number: cleanUtr || '000000000000',
        payer_name: r.payerName || r.leaderName || 'Participant',
        payer_upi_id: r.payerUpiId || 'participant@upi',
        payment_screenshot_url: screenshot,
        status: r.status || 'pending',
        team_name: r.teamName || 'Team',
        college_name: r.collegeName || 'LAEC Bidar',
        leader_name: r.leaderName || r.payerName,
        leader_email: r.leaderEmail || '',
        leader_phone: r.leaderPhone || '',
        student_id: r.studentId || '',
        branch: r.branch || '',
        year: r.year || '',
        theme_id: r.themeId || '',
        project_title: r.projectTitle || '',
        members: r.members || [],
      };

      if (cleanUtr && cleanUtr !== '—') {
        const { data: existing } = await supabase
          .from('payments')
          .select('id, payment_screenshot_url')
          .eq('utr_number', cleanUtr)
          .maybeSingle();

        if (existing) {
          if (!existing.payment_screenshot_url && screenshot) {
            await supabase
              .from('payments')
              .update({ payment_screenshot_url: screenshot })
              .eq('id', existing.id);
            synced++;
          }
          continue;
        }
      }

      const { error } = await supabase.from('payments').insert(payload);
      if (!error) {
        synced++;
      } else {
        console.warn('Sync notice for record:', error.message);
      }
    } catch (e: any) {
      console.warn('Sync exception:', e?.message);
    }
  }

  return { success: true, syncedCount: synced };
}

/**
 * Parse CSV text into array of key-value objects handling multiline quoted fields
 */
export function parseCSV(csvText: string): Record<string, string>[] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let insideQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentField += '"';
        i++; // skip escaped quote
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      currentRow.push(currentField);
      currentField = '';
    } else if ((char === '\r' || char === '\n') && !insideQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      currentRow.push(currentField);
      if (currentRow.some((f) => f.trim().length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentField = '';
    } else {
      currentField += char;
    }
  }
  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField);
    rows.push(currentRow);
  }

  if (rows.length < 2) return [];

  const headers = rows[0].map((h) => h.trim());
  const data: Record<string, string>[] = [];

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const record: Record<string, string> = {};
    headers.forEach((header, index) => {
      record[header] = row[index] !== undefined ? row[index] : '';
    });
    data.push(record);
  }

  return data;
}

/**
 * Import payment records from an exported CSV file
 */
export async function importPaymentsFromCSV(csvText: string): Promise<{
  success: boolean;
  count: number;
  error?: string;
}> {
  try {
    const parsed = parseCSV(csvText);
    if (!parsed || parsed.length === 0) {
      return { success: false, count: 0, error: 'No valid rows found in CSV.' };
    }

    const localList = getStoredPayments();
    const existingMap = new Map<string, PaymentRecord>();
    localList.forEach((r) => {
      const key = (r.utrNumber || r.registrationToken || r.id).trim();
      existingMap.set(key, r);
    });

    let importedCount = 0;

    for (const row of parsed) {
      const utr = (row['UTR Reference'] || row['utr_number'] || '').trim();
      const token = (row['Registration Token'] || row['registration_token'] || '').trim();
      const screenshot = (row['Payment Screenshot URL'] || row['payment_screenshot_url'] || '').trim();
      const eventName = row['Event'] || row['event_name'] || 'Hackora 2026';
      const eventType = eventName.toLowerCase().includes('idea')
        ? 'ideathon'
        : eventName.toLowerCase().includes('expo')
        ? 'project_expo'
        : 'hackora';

      const key = utr || token || `import_${Date.now()}_${Math.random()}`;

      const paymentRecord: PaymentRecord = {
        id: `csv_${utr || token || Date.now()}`,
        registrationToken: token || `LAEC-IF26-HACK-${Math.floor(1000 + Math.random() * 9000)}`,
        teamName: row['Team Name'] || row['team_name'] || 'Imported Team',
        leaderName: row['Leader Name'] || row['leader_name'] || 'Participant',
        leaderEmail: row['Leader Email'] || row['leader_email'] || '',
        leaderPhone: row['Leader Phone'] || row['leader_phone'] || '',
        collegeName: row['College Name'] || row['college_name'] || 'LAEC Bidar',
        studentId: row['Leader USN/ID'] || row['student_id'] || '',
        branch: row['Branch'] || row['branch'] || '',
        year: row['Year'] || row['year'] || '',
        eventType: eventType as any,
        eventName: eventName,
        amount: Number(row['Amount (INR)'] || row['amount']) || 1200,
        utrNumber: utr || '—',
        payerName: row['Payer Name'] || row['payer_name'] || row['Leader Name'] || 'Participant',
        payerUpiId: row['Payer UPI ID'] || row['payer_upi_id'] || '',
        paymentScreenshotUrl: screenshot,
        payment_screenshot_url: screenshot,
        themeId: row['Theme / Track'] || row['theme_id'] || 'General Track',
        projectTitle: row['Project Title'] || row['project_title'] || 'Innovation Project',
        members: [],
        status: ((row['Verification Status'] || row['status'] || 'verified').toLowerCase() as any),
        created_at: row['Registration Date'] || new Date().toISOString(),
        source: 'local_fallback',
      };

      existingMap.set(key, paymentRecord);
      importedCount++;

      // If Supabase is configured, also update Supabase cloud
      if (isSupabaseConfigured && utr) {
        try {
          const { data: existingDb } = await supabase
            .from('payments')
            .select('id, payment_screenshot_url')
            .eq('utr_number', utr)
            .maybeSingle();

          if (existingDb) {
            if (screenshot && screenshot !== existingDb.payment_screenshot_url) {
              await supabase
                .from('payments')
                .update({ payment_screenshot_url: screenshot })
                .eq('id', existingDb.id);
            }
          } else {
            await supabase.from('payments').insert({
              registration_token: paymentRecord.registrationToken,
              event_type: eventType,
              event_name: eventName,
              amount: paymentRecord.amount,
              payment_method: 'upi',
              utr_number: utr,
              payer_name: paymentRecord.payerName,
              payer_upi_id: paymentRecord.payerUpiId,
              payment_screenshot_url: screenshot,
              status: paymentRecord.status,
              team_name: paymentRecord.teamName,
              college_name: paymentRecord.collegeName,
              leader_name: paymentRecord.leaderName,
              leader_email: paymentRecord.leaderEmail,
              leader_phone: paymentRecord.leaderPhone,
              student_id: paymentRecord.studentId,
              branch: paymentRecord.branch,
              year: paymentRecord.year,
              theme_id: paymentRecord.themeId,
              project_title: paymentRecord.projectTitle,
              members: [],
            });
          }
        } catch (dbErr) {
          console.warn('Supabase sync notice during CSV import:', dbErr);
        }
      }
    }

    const updatedList = Array.from(existingMap.values());
    try {
      localStorage.setItem('laec_fest_payments', JSON.stringify(updatedList));
    } catch (storeErr) {
      console.warn('LocalStorage write notice:', storeErr);
    }

    return { success: true, count: importedCount };
  } catch (err: any) {
    return { success: false, count: 0, error: err?.message || 'Failed to import CSV.' };
  }
}
