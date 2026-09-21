export interface ProblemStatement {
  id: string; // e.g. 'AI-01'
  code: string; // e.g. 'AI-01'
  title: string;
  isNew?: boolean;
}

export interface ChallengeTrack {
  id: string; // e.g. 'track-01'
  number: string; // '01'
  title: string;
  themeName: string;
  colorName: string;
  badgeColor: string;
  borderColor: string;
  accentBg: string;
  textColor: string;
  problemStatements: ProblemStatement[];
}

export const HACKORA_CHALLENGE_TRACKS: ChallengeTrack[] = [
  {
    id: 'track-01',
    number: '01',
    title: 'Track 01: Agentic AI, Automation & Developer Tools',
    themeName: 'Agentic AI, Automation & Developer Tools',
    colorName: 'violet',
    badgeColor: 'bg-purple-500/15 text-purple-300 border-purple-500/40',
    borderColor: 'border-purple-500/40',
    accentBg: 'bg-purple-500/10',
    textColor: 'text-purple-400',
    problemStatements: [
      { id: 'AI-01', code: 'AI-01', title: 'AI Campus Assistant' },
      { id: 'AI-02', code: 'AI-02', title: 'Intelligent Placement Coach' },
      { id: 'AI-03', code: 'AI-03', title: 'TAILOR24 – Smart Tailoring & Delivery' },
    ],
  },
  {
    id: 'track-02',
    number: '02',
    title: 'Track 02: Cybersecurity, Privacy & Data Trust',
    themeName: 'Cybersecurity, Privacy & Data Trust',
    colorName: 'red',
    badgeColor: 'bg-red-500/15 text-red-300 border-red-500/40',
    borderColor: 'border-red-500/40',
    accentBg: 'bg-red-500/10',
    textColor: 'text-red-400',
    problemStatements: [
      { id: 'CY-01', code: 'CY-01', title: 'Deepfake & Misinformation Detector' },
      { id: 'CY-02', code: 'CY-02', title: 'Secure Digital Certificate Verification' },
      { id: 'CY-03', code: 'CY-03', title: 'Public Website Security & Data-Leak Scanner' },
    ],
  },
  {
    id: 'track-03',
    number: '03',
    title: 'Track 03: HealthTech, Bio-Innovation & Assistive Technology',
    themeName: 'HealthTech, Bio-Innovation & Assistive Technology',
    colorName: 'emerald',
    badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
    borderColor: 'border-emerald-500/40',
    accentBg: 'bg-emerald-500/10',
    textColor: 'text-emerald-400',
    problemStatements: [
      { id: 'HT-01', code: 'HT-01', title: 'AI-Based Early Health Risk Screening' },
      { id: 'HT-02', code: 'HT-02', title: 'Smart Assistive Communication Platform' },
      { id: 'HT-03', code: 'HT-03', title: 'Smart Blood Bank Demand & Inventory' },
    ],
  },
  {
    id: 'track-04',
    number: '04',
    title: 'Track 04: Agritech, Rural Economy & Food Systems',
    themeName: 'Agritech, Rural Economy & Food Systems',
    colorName: 'amber',
    badgeColor: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
    borderColor: 'border-amber-500/40',
    accentBg: 'bg-amber-500/10',
    textColor: 'text-amber-400',
    problemStatements: [
      { id: 'AG-01', code: 'AG-01', title: 'Smart Farmer Advisory System' },
      { id: 'AG-02', code: 'AG-02', title: 'Farm-to-Market Platform' },
      { id: 'AG-03', code: 'AG-03', title: 'Digital Retail Milk Procurement & Delivery' },
    ],
  },
  {
    id: 'track-05',
    number: '05',
    title: 'Track 05: Smart Infrastructure, Mobility & Clean Technology',
    themeName: 'Smart Infrastructure, Mobility & Clean Technology',
    colorName: 'cyan',
    badgeColor: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40',
    borderColor: 'border-cyan-500/40',
    accentBg: 'bg-cyan-500/10',
    textColor: 'text-cyan-400',
    problemStatements: [
      { id: 'SM-01', code: 'SM-01', title: 'EV Charging Optimization' },
      { id: 'SM-02', code: 'SM-02', title: 'Smart Campus Energy Management' },
      { id: 'SM-03', code: 'SM-03', title: 'AI-Powered Automatic Attendance System' },
    ],
  },
  {
    id: 'track-06',
    number: '06',
    title: 'Track 06: Smart Education, EdTech & Campus Management',
    themeName: 'Smart Education, EdTech & Campus Management',
    colorName: 'pink',
    badgeColor: 'bg-pink-500/15 text-pink-300 border-pink-500/40',
    borderColor: 'border-pink-500/40',
    accentBg: 'bg-pink-500/10',
    textColor: 'text-pink-400',
    problemStatements: [
      { id: 'SE-01', code: 'SE-01', title: 'AI Meeting & Action Tracker' },
      { id: 'SE-02', code: 'SE-02', title: 'Smart System Reservation & Allocation' },
      { id: 'SE-03', code: 'SE-03', title: 'Mother-Tongue Curriculum Translation' },
      { id: 'SE-04', code: 'SE-04', title: 'Function Hall Booking & Management System', isNew: true },
    ],
  },
];

export const ALL_HACKORA_PROBLEM_STATEMENTS: Array<ProblemStatement & { trackNumber: string; trackName: string }> =
  HACKORA_CHALLENGE_TRACKS.flatMap((track) =>
    track.problemStatements.map((ps) => ({
      ...ps,
      trackNumber: track.number,
      trackName: track.themeName,
    }))
  );

export function getProblemStatementByCode(code: string) {
  if (!code) return null;
  const clean = code.trim().toUpperCase();
  return (
    ALL_HACKORA_PROBLEM_STATEMENTS.find(
      (ps) => ps.code.toUpperCase() === clean || ps.id.toUpperCase() === clean
    ) || null
  );
}

export function getTrackByNumber(trackNumber: string) {
  if (!trackNumber) return null;
  const num = trackNumber.padStart(2, '0');
  return HACKORA_CHALLENGE_TRACKS.find((t) => t.number === num) || null;
}

