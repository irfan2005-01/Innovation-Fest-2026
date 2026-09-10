import { allowMethod, requireAdmin } from '../_auth.js';

export default function handler(req, res) {
  if (!allowMethod(req, res, 'GET')) return;
  if (!requireAdmin(req, res)) return;
  res.status(200).json({ authenticated: true });
}
