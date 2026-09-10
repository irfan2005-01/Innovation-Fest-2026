import { createHmac, timingSafeEqual } from 'node:crypto';

const SESSION_COOKIE = 'laec_admin_session';
const SESSION_TTL_SECONDS = 60 * 60 * 8;

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required server environment variable: ${name}`);
  return value;
}

export function supabaseConfig() {
  return {
    url: (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').replace(/\/$/, ''),
    serviceKey: requiredEnv('SUPABASE_SERVICE_ROLE_KEY'),
  };
}

export async function supabaseRequest(path, options = {}) {
  const { url, serviceKey } = supabaseConfig();
  if (!url) throw new Error('Missing required server environment variable: SUPABASE_URL');

  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  return response;
}

function sign(value) {
  return createHmac('sha256', requiredEnv('ADMIN_SESSION_SECRET')).update(value).digest('hex');
}

function readCookie(req, name) {
  const prefix = `${name}=`;
  return (req.headers.cookie || '')
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix))
    ?.slice(prefix.length);
}

export function setAdminSession(res) {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const value = `admin.${expiresAt}`;
  res.setHeader(
    'Set-Cookie',
    `${SESSION_COOKIE}=${value}.${sign(value)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_TTL_SECONDS}`
  );
}

export function clearAdminSession(res) {
  res.setHeader('Set-Cookie', `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`);
}

export function requireAdmin(req, res) {
  const cookie = readCookie(req, SESSION_COOKIE);
  const [role, expiresAt, signature] = (cookie || '').split('.');
  const value = `${role}.${expiresAt}`;
  const expectedSignature = sign(value);
  const validSignature =
    signature &&
    signature.length === expectedSignature.length &&
    timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));

  if (role !== 'admin' || !Number.isFinite(Number(expiresAt)) || Number(expiresAt) < Date.now() / 1000 || !validSignature) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }

  return true;
}

export function allowMethod(req, res, method) {
  if (req.method === method) return true;
  res.setHeader('Allow', method);
  res.status(405).json({ error: 'Method not allowed' });
  return false;
}
