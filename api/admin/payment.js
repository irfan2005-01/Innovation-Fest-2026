import { allowMethod, requireAdmin, supabaseRequest } from '../_auth.js';

const allowedStatuses = new Set(['pending', 'verified', 'rejected']);

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return;
  const id = String(req.query.id || '');
  if (!id) return res.status(400).json({ error: 'Payment id is required.' });

  try {
    if (req.method === 'PATCH') {
      const status = req.body?.status;
      if (!allowedStatuses.has(status)) return res.status(400).json({ error: 'Invalid payment status.' });

      const response = await supabaseRequest(`payments?id=eq.${encodeURIComponent(id)}&select=team_id`, {
        method: 'PATCH',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify({
          status,
          rejection_reason: req.body?.rejectionReason || null,
          verified_at: status === 'verified' ? new Date().toISOString() : null,
        }),
      });
      if (!response.ok) throw new Error('Unable to update payment.');
      const rows = await response.json();
      const teamId = rows[0]?.team_id;
      if (teamId) {
        await supabaseRequest(`teams?id=eq.${encodeURIComponent(teamId)}`, {
          method: 'PATCH',
          body: JSON.stringify({
            payment_status: status === 'verified' ? 'verified' : status === 'rejected' ? 'rejected' : 'unpaid',
            payment_verified_at: status === 'verified' ? new Date().toISOString() : null,
          }),
        });
      }
      return res.status(200).json({ success: true });
    }

    if (req.method === 'DELETE') {
      const lookup = await supabaseRequest(`payments?id=eq.${encodeURIComponent(id)}&select=team_id&limit=1`);
      const rows = lookup.ok ? await lookup.json() : [];
      const response = await supabaseRequest(`payments?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Unable to delete payment.');
      const teamId = rows[0]?.team_id;
      if (teamId) {
        await supabaseRequest(`team_members?team_id=eq.${encodeURIComponent(teamId)}`, { method: 'DELETE' });
        await supabaseRequest(`teams?id=eq.${encodeURIComponent(teamId)}`, { method: 'DELETE' });
      }
      return res.status(200).json({ success: true });
    }

    res.setHeader('Allow', 'PATCH, DELETE');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Admin payment mutation error:', err);
    return res.status(500).json({ error: 'Unable to update payment.' });
  }
}
