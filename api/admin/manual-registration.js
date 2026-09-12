import { randomUUID } from 'node:crypto';
import { allowMethod, requireAdmin, supabaseConfig, supabaseRequest } from '../_auth.js';

const EVENT_TYPES = new Set(['hackora', 'ideathon', 'project_expo', 'expo']);
const FALLBACK_TEAM_ID = '3c3fb2a8-b358-4d08-b175-37a7eace0055';

function error(res, status, message) {
  res.status(status).json({ success: false, error: message });
}

export default async function handler(req, res) {
  if (!allowMethod(req, res, 'POST') || !requireAdmin(req, res)) return;

  const data = req.body || {};
  const paymentMethod = data.paymentMethod === 'cash' ? 'cash' : 'upi';
  const eventType = data.eventType === 'expo' ? 'project_expo' : (data.eventType || 'hackora');
  const amount = Number(data.amount) || (eventType === 'hackora' ? 1200 : 250);
  const teamName = String(data.teamName || '').trim();
  const leaderName = String(data.leaderName || '').trim();
  const leaderPhone = String(data.leaderPhone || '').trim();
  const collegeName = String(data.collegeName || 'Lingaraj Appa Engineering College').trim();
  const status = data.status === 'pending' ? 'pending' : 'verified';

  if (!teamName) return error(res, 400, 'Team name is required.');
  if (!leaderName) return error(res, 400, 'Leader name is required.');
  if (!leaderPhone) return error(res, 400, 'Leader phone is required.');
  if (!EVENT_TYPES.has(eventType)) return error(res, 400, 'Invalid event type.');

  let utrNumber = String(data.utrNumber || '').trim();
  let screenshotUrl = String(data.paymentScreenshotUrl || data.payment_screenshot_url || '').trim();
  let payerName = String(data.payerName || leaderName).trim();
  let payerUpiId = String(data.payerUpiId || '').trim();

  // Conditional validation based on payment method
  if (paymentMethod === 'cash') {
    // For Cash: no screenshot needed. Generate clean numeric receipt or accept reference
    if (!utrNumber) {
      // 12-digit numeric receipt identifier safe for any DB constraints
      utrNumber = `99${Date.now().toString().slice(-10)}`;
    }
    if (!screenshotUrl) {
      screenshotUrl = '';
    }
    if (!payerUpiId) {
      payerUpiId = 'cash@desk';
    }
  } else {
    // For Online UPI: 12-digit numeric UTR and screenshot are strictly required
    if (!/^\d{12}$/.test(utrNumber)) {
      return error(res, 400, 'Online payment requires a valid 12-digit UTR number.');
    }
    if (!screenshotUrl) {
      return error(res, 400, 'Online payment requires a payment screenshot proof.');
    }
  }

  try {
    const registrationToken =
      data.registrationToken ||
      `LAEC-IF26-${eventType.toUpperCase().slice(0, 4)}-${Math.floor(1000 + Math.random() * 9000)}`;

    const leaderEmail =
      String(data.leaderEmail || '').trim().toLowerCase() ||
      `${utrNumber.slice(0, 8)}@participant.laec.edu.in`;

    let userId = '24e22701-66f2-4637-9c40-ce40de7cd94a';

    const profileResponse = await supabaseRequest(
      `profiles?select=id&email=eq.${encodeURIComponent(leaderEmail)}&limit=1`
    );
    if (profileResponse.ok) {
      const profiles = await profileResponse.json();
      if (profiles[0]?.id) userId = profiles[0].id;
    }

    if (userId === '24e22701-66f2-4637-9c40-ce40de7cd94a') {
      try {
        const { url, serviceKey } = supabaseConfig();
        const authResponse = await fetch(`${url}/auth/v1/admin/users`, {
          method: 'POST',
          headers: {
            apikey: serviceKey,
            Authorization: `Bearer ${serviceKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: leaderEmail,
            email_confirm: true,
            user_metadata: { full_name: leaderName },
          }),
        });
        if (authResponse.ok) {
          const newUser = await authResponse.json();
          userId = newUser?.id || userId;
        }
      } catch (authErr) {
        console.warn('Auth user create notice:', authErr);
      }
    }

    // Upsert profile
    await supabaseRequest('profiles?on_conflict=id', {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates' },
      body: JSON.stringify({
        id: userId,
        full_name: leaderName,
        email: leaderEmail,
        phone: leaderPhone,
        college: collegeName,
        branch: data.branch || 'Engineering',
        year_of_study: data.year || 'Student',
        student_id: data.studentId || '',
        city: 'Bidar',
        state: 'Karnataka',
        role: 'participant',
        checkin_token: `chk_${randomUUID().replace(/-/g, '').slice(0, 24)}`,
      }),
    });

    const projectMetadata = JSON.stringify({
      title: data.projectTitle || 'Innovation Project',
      theme: data.themeId || '',
      screenshot_url: screenshotUrl,
      members: data.members || [],
      college: collegeName,
      branch: data.branch,
      year: data.year,
      student_id: data.studentId,
      payer_name: payerName,
      payer_upi_id: payerUpiId,
      payment_method: paymentMethod,
    });

    const teamResponse = await supabaseRequest('teams?select=id', {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({
        team_code: registrationToken,
        name: teamName,
        leader_id: userId,
        theme_id: data.themeId || null,
        event_type: eventType,
        project_title: projectMetadata,
        status: status,
        payment_status: status === 'verified' ? 'verified' : 'unpaid',
        payment_utr: utrNumber,
        payment_amount: amount,
      }),
    });
    const teams = teamResponse.ok ? await teamResponse.json() : [];
    const teamId = teams[0]?.id || FALLBACK_TEAM_ID;

    if (teams[0]?.id) {
      await supabaseRequest('team_members', {
        method: 'POST',
        body: JSON.stringify({ team_id: teamId, user_id: userId, role: 'leader' }),
      });
    }

    const paymentPayload = {
      team_id: teamId,
      user_id: userId,
      registration_token: registrationToken,
      event_type: eventType,
      event_name: data.eventName || (eventType === 'hackora' ? 'Hackora 2026' : eventType === 'ideathon' ? 'Ideathon 2026' : 'Project Expo 2026'),
      amount: amount,
      payment_method: paymentMethod,
      utr_number: utrNumber,
      payer_name: payerName,
      payer_upi_id: payerUpiId,
      payment_screenshot_url: screenshotUrl,
      status: status,
      team_name: teamName,
      college_name: collegeName,
      leader_name: leaderName,
      leader_email: leaderEmail,
      leader_phone: leaderPhone,
      student_id: data.studentId || '',
      branch: data.branch || '',
      year: data.year || '',
      theme_id: data.themeId || '',
      project_title: data.projectTitle || '',
      members: data.members || [],
      verified_at: status === 'verified' ? new Date().toISOString() : null,
    };

    const paymentResponse = await supabaseRequest('payments?select=id', {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify(paymentPayload),
    });

    if (!paymentResponse.ok) {
      const detail = await paymentResponse.json().catch(() => ({}));
      return error(res, 500, detail.message || 'Could not save the manual payment record.');
    }

    const payments = await paymentResponse.json();
    res.status(201).json({
      success: true,
      id: payments[0]?.id,
      registrationToken,
      record: {
        ...paymentPayload,
        id: payments[0]?.id || `man-${Date.now()}`,
      },
    });
  } catch (err) {
    console.error('Manual registration API error:', err);
    error(res, 500, 'Manual registration failed on server.');
  }
}

