import { allowMethod, setAdminSession } from '../_auth.js';

export default function handler(req, res) {
  if (!allowMethod(req, res, 'POST')) return;

  if (!process.env.ADMIN_PASSCODE || req.body?.passcode !== process.env.ADMIN_PASSCODE) {
    res.status(401).json({ error: 'Incorrect Secretariat passcode.' });
    return;
  }

  setAdminSession(res);
  res.status(200).json({ success: true });
}
