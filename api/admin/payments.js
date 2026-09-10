import { allowMethod, requireAdmin, supabaseRequest } from '../_auth.js';

const paymentSelect = '*,team:teams(*,theme:themes(*),members:team_members(*,profile:profiles(*))),user:profiles!payments_user_id_fkey(*)';

export default async function handler(req, res) {
  if (!allowMethod(req, res, 'GET') || !requireAdmin(req, res)) return;

  try {
    const response = await supabaseRequest(`payments?select=${encodeURIComponent(paymentSelect)}&order=created_at.desc`);
    if (!response.ok) throw new Error('Unable to load payments.');
    res.status(200).json({ records: await response.json() });
  } catch (err) {
    console.error('Admin payments fetch error:', err);
    res.status(500).json({ error: 'Unable to load payments.' });
  }
}
