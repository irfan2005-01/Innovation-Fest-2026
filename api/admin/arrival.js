import { allowMethod, requireAdmin, supabaseRequest } from '../_auth.js';

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return;
  const id = String(req.query.id || '');
  if (!id) return res.status(400).json({ error: 'Payment id is required.' });

  try {
    if (req.method === 'PATCH') {
      const arrived = Boolean(req.body?.arrived);
      const arrivedAt = req.body?.arrivedAt || (arrived ? new Date().toISOString() : null);

      // Attempt update with dedicated columns first
      let response = await supabaseRequest(`payments?id=eq.${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify({
          arrived,
          arrived_at: arrived ? arrivedAt : null,
        }),
      });

      // If schema cache doesn't have arrived column, fallback to rejection_reason ARRIVED: timestamp
      if (!response.ok) {
        const arrivalTag = arrived ? `ARRIVED:${arrivedAt}` : null;
        response = await supabaseRequest(`payments?id=eq.${encodeURIComponent(id)}`, {
          method: 'PATCH',
          headers: { Prefer: 'return=representation' },
          body: JSON.stringify({
            rejection_reason: arrivalTag,
          }),
        });
      }

      if (!response.ok) {
        throw new Error('Unable to update contestant arrival status.');
      }

      return res.status(200).json({ success: true, arrived, arrivedAt });
    }

    res.setHeader('Allow', 'PATCH');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Admin arrival mutation error:', err);
    return res.status(500).json({ error: 'Unable to update arrival status.' });
  }
}

