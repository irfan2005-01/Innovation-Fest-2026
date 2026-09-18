import { Prize, SpecialCitation } from '../types';

export const podiumPrizes: Prize[] = [
  {
    id: 'first-place',
    rank: '01',
    title: 'Flagship Champions — 1st Prize',
    amount: '₹25,000',
    trophy: 'The HACKORA Gold Trophy',
    badgeText: 'Top Overall Submission',
    gradient: 'from-amber-400 via-orange-500 to-yellow-300',
    description: 'Awarded to the team delivering the most exceptional, technically sophisticated, and practically impactful solution at HACKORA 2026.',
    perks: [
      '₹25,000 Direct Cash Prize',
      'The Prestigious HACKORA 2026 Winner Trophy',
      'Individual Certificates of Excellence (Signed by VTU & LAEC)',
      'Fast-track Direct Pitch to Karnataka Startup Incubators',
    ],
  },
  {
    id: 'second-place',
    rank: '02',
    title: 'First Runner-Up — 2nd Prize',
    amount: '₹10,000',
    trophy: 'The HACKORA Silver Trophy',
    badgeText: '1st Runner-Up',
    gradient: 'from-cyan-400 via-blue-500 to-indigo-400',
    description: 'Recognizing the first runner-up team displaying superlative architecture, solid execution, and high innovation quotient.',
    perks: [
      '₹10,000 Direct Cash Prize',
      'HACKORA 2026 Runner-Up Trophy',
      'Individual Certificates of Excellence',
      'Incubator Mentorship Sessions & Tech Connects',
    ],
  },
];

export const specialCitations: SpecialCitation[] = [];

export const universalPerks = [
  'Official VTU-affiliated Certificate of Participation for all verified builders',
  'Direct offline interaction and networking with jury panels & industry experts',
  'Open innovation platform with free computing labs, power, and Wi-Fi',
];


