import { allowMethod, clearAdminSession } from '../_auth.js';

export default function handler(req, res) {
  if (!allowMethod(req, res, 'POST')) return;
  clearAdminSession(res);
  res.status(200).json({ success: true });
}
