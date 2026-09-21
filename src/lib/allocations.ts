export interface TeamAllocationRecord {
  teamId: string; // Team ID / Registration Token
  teamName: string;
  leaderName: string;
  leaderPhone?: string;
  leaderEmail?: string;
  collegeName: string;
  members?: string[];
  trackNumber: string; // '01' | '02' | '03' | '04' | '05' | '06' | 'OPEN' | 'UNASSIGNED'
  trackName: string;
  problemStatementCode: string; // e.g. 'AI-01', 'CY-02', 'CUSTOM'
  problemStatementTitle: string; // e.g. 'AI Campus Assistant'
  customNotes?: string;
  allocatedAt: string;
}

const ALLOCATIONS_STORAGE_KEY = 'hackora_2026_team_allocations';

export function getStoredAllocations(): Record<string, TeamAllocationRecord> {
  try {
    const raw = localStorage.getItem(ALLOCATIONS_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, TeamAllocationRecord>;
  } catch (err) {
    console.error('Error reading stored allocations:', err);
    return {};
  }
}

export function saveTeamAllocation(record: TeamAllocationRecord): Record<string, TeamAllocationRecord> {
  try {
    const current = getStoredAllocations();
    current[record.teamId] = {
      ...record,
      allocatedAt: new Date().toISOString(),
    };
    // Also index by teamName lowercased for resilient cross-lookup
    if (record.teamName) {
      current[`name_${record.teamName.toLowerCase().trim()}`] = record;
    }
    localStorage.setItem(ALLOCATIONS_STORAGE_KEY, JSON.stringify(current));
    return current;
  } catch (err) {
    console.error('Error saving team allocation:', err);
    return getStoredAllocations();
  }
}

export function deleteTeamAllocation(teamId: string, teamName?: string): Record<string, TeamAllocationRecord> {
  try {
    const current = getStoredAllocations();
    delete current[teamId];
    if (teamName) {
      delete current[`name_${teamName.toLowerCase().trim()}`];
    }
    localStorage.setItem(ALLOCATIONS_STORAGE_KEY, JSON.stringify(current));
    return current;
  } catch (err) {
    console.error('Error deleting team allocation:', err);
    return getStoredAllocations();
  }
}

export function exportAllocationsToCSV(records: Array<{
  slNo: number;
  teamId: string;
  teamName: string;
  leaderName: string;
  leaderPhone: string;
  collegeName: string;
  membersSummary: string;
  trackNumber: string;
  trackName: string;
  psCode: string;
  psTitle: string;
  customNotes: string;
  status: string;
}>) {
  const headers = [
    'Sl No',
    'Team ID / Token',
    'Team Name',
    'Team Leader',
    'Leader Contact',
    'College Name',
    'Team Members',
    'Assigned Track Number',
    'Assigned Track Name',
    'Problem Statement Code',
    'Problem Statement Title',
    'Custom Project Notes',
    'Status',
  ];

  const escapeCSV = (str: any) => {
    if (str === null || str === undefined) return '""';
    const s = String(str).replace(/"/g, '""');
    return `"${s}"`;
  };

  const rows = records.map((r) => [
    r.slNo,
    escapeCSV(r.teamId),
    escapeCSV(r.teamName),
    escapeCSV(r.leaderName),
    escapeCSV(r.leaderPhone),
    escapeCSV(r.collegeName),
    escapeCSV(r.membersSummary),
    escapeCSV(r.trackNumber),
    escapeCSV(r.trackName),
    escapeCSV(r.psCode),
    escapeCSV(r.psTitle),
    escapeCSV(r.customNotes),
    escapeCSV(r.status),
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute(
    'download',
    `HACKORA_2026_Problem_Statement_Allocations_${new Date().toISOString().slice(0, 10)}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

