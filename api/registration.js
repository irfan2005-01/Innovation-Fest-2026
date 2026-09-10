import { randomUUID } from 'node:crypto';
import { allowMethod, supabaseConfig, supabaseRequest } from './_auth.js';

const EVENT_TYPES = new Set(['hackora', 'ideathon', 'project_expo', 'expo']);
const FALLBACK_TEAM_ID = '3c3fb2a8-b358-4d08-b175-37a7eace0055';

function error(res, status, message) {
  res.status(status).json({ success: false, error: message });
}

export default async function handler(req, res) {
  if (!allowMethod(req, res, 'POST')) return;

  const data = req.body || {};
  const utrNumber = String(data.utrNumber || '').trim();
  const payerName = String(data.payerName || data.leaderName || '').trim();
  const payerUpiId = String(data.payerUpiId || '').trim();
  const screenshotUrl = String(data.paymentScreenshotUrl || data.payment_screenshot_url || '').trim();
  const eventType = data.eventType === 'expo' ? 'project_expo' : data.eventType;

  if (!/^\d{12}$/.test(utrNumber)) return error(res, 400, 'UTR must be exactly 12 digits.');
  if (!payerName) return error(res, 400, 'Payer account holder name is required.');
  if (!payerUpiId.includes('@')) return error(res, 400, 'A valid payer UPI ID is required.');
  if (!screenshotUrl) return error(res, 400, 'Payment verification screenshot is required.');
  if (!EVENT_TYPES.has(eventType)) return error(res, 400, 'Invalid event type.');

  try {
    const duplicateResponse = await supabaseRequest(
      `payments?select=id&utr_number=eq.${encodeURIComponent(utrNumber)}&status=in.(pending,verified)&limit=1`
    );
    const duplicates = duplicateResponse.ok ? await duplicateResponse.json() : [];
    if (duplicates.length) return error(res, 409, 'This UTR has already been submitted for another registration.');

    const registrationToken = `LAEC-IF26-${eventType.toUpperCase().slice(0, 4)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const leaderEmail = String(data.leaderEmail || '').trim().toLowerCase() || `${utrNumber.slice(0, 8)}@participant.laec.edu.in`;
    let userId = '24e22701-66f2-4637-9c40-ce40de7cd94a';

    const profileResponse = await supabaseRequest(`profiles?select=id&email=eq.${encodeURIComponent(leaderEmail)}&limit=1`);
    if (profileResponse.ok) {
      const profiles = await profileResponse.json();
      if (profiles[0]?.id) userId = profiles[0].id;
    }

    if (userId === '24e22701-66f2-4637-9c40-ce40de7cd94a') {
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
          user_metadata: { full_name: data.leaderName || payerName },
        }),
      });
      if (authResponse.ok) {
        const newUser = await authResponse.json();
        userId = newUser?.id || userId;
      }
    }

    await supabaseRequest('profiles?on_conflict=id', {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates' },
      body: JSON.stringify({
        id: userId,
        full_name: data.leaderName || payerName,
        email: leaderEmail,
        phone: data.leaderPhone || '',
        college: data.collegeName || 'Lingaraj Appa Engineering College',
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
      college: data.collegeName,
      branch: data.branch,
      year: data.year,
      student_id: data.studentId,
      payer_name: payerName,
      payer_upi_id: payerUpiId,
    });
    const teamResponse = await supabaseRequest('teams?select=id', {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({
        team_code: registrationToken,
        name: data.teamName || `${data.leaderName || 'Fest'}'s Team`,
        leader_id: userId,
        theme_id: data.themeId || null,
        event_type: eventType,
        project_title: projectMetadata,
        status: 'pending',
        payment_status: 'unpaid',
        payment_utr: utrNumber,
        payment_amount: data.amount,
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

    const paymentResponse = await supabaseRequest('payments?select=id', {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({
        team_id: teamId,
        user_id: userId,
        event_type: eventType,
        event_name: data.eventName || 'Hackora 2026',
        amount: data.amount,
        payment_method: 'upi',
        utr_number: utrNumber,
        payer_name: payerName,
        payer_upi_id: payerUpiId,
        status: 'pending',
      }),
    });
    if (!paymentResponse.ok) {
      const detail = await paymentResponse.json().catch(() => ({}));
      return error(res, 500, detail.message || 'Could not save the registration.');
    }

    const payments = await paymentResponse.json();
    res.status(201).json({ success: true, id: payments[0]?.id, registrationToken });
  } catch (err) {
    console.error('Registration API error:', err);
    error(res, 500, 'Registration service is temporarily unavailable.');
  }
}
