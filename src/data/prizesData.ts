import { Prize, SpecialCitation } from '../types';

export const podiumPrizes: Prize[] = [
  {
    id: 'first-place',
    rank: '01',
    title: 'Grand Champions — Winner',
    amount: '₹45,000+',
    trophy: 'The HACKORA Gold Trophy',
    badgeText: 'Top Overall Submission',
    gradient: 'from-amber-400 via-orange-500 to-yellow-300',
    description: 'Awarded to the team delivering the most exceptional, technically sophisticated, and practically impactful product of INNOVATION FEST 2026.',
    perks: [
      '₹45,000+ Consolidated Cash Prize Pool & Awards',
      'The Prestigious HACKORA 2026 Winner Trophy',
      'Individual Certificates of Excellence (Signed by VTU & LAEC)',
      'Fast-track Direct Pitch to Karnataka Startup Incubators',
      'Exclusive Winner Swag Box & Cloud Credits worth $2,500',
    ],
  },
  {
    id: 'second-place',
    rank: '02',
    title: 'First Runner-Up',
    amount: '₹30,000',
    trophy: 'The NEXORA Silver Trophy',
    badgeText: '1st Runner-Up',
    gradient: 'from-cyan-400 via-blue-500 to-indigo-400',
    description: 'Recognizing the first runner-up team displaying superlative architecture, solid execution, and high innovation quotient.',
    perks: [
      '₹30,000 Direct Cash Prize',
      'NEXORA 2026 Runner-Up Silver Trophy',
      'Individual Certificates of Excellence',
      'Incubator Mentorship Sessions & Tech Swag',
      'Cloud Infrastructure credits worth $1,000',
    ],
  },
  {
    id: 'third-place',
    rank: '03',
    title: 'Second Runner-Up',
    amount: '₹15,000',
    trophy: 'The NEXORA Bronze Trophy',
    badgeText: '2nd Runner-Up',
    gradient: 'from-purple-400 via-fuchsia-500 to-pink-500',
    description: 'Honoring the second runner-up for exemplary teamwork, technical ingenuity, and compelling live pitch performance.',
    perks: [
      '₹15,000 Direct Cash Prize',
      'NEXORA 2026 Bronze Trophy',
      'Individual Certificates of Excellence',
      'Industry Mentorship Connects',
      'Cloud vouchers & developer tool licenses',
    ],
  },
];

export const specialCitations: SpecialCitation[] = [
  {
    id: 'spec-uiux',
    title: 'Best UI / UX Prototype',
    reward: '₹5,000 + Citation Plaque',
    description: 'Awarded for unmatched user empathy, micro-interactions, accessibility compliance, and design system polish.',
    iconName: 'Palette',
    accentColor: '#00F2FE',
  },
  {
    id: 'spec-innovation',
    title: 'Most Innovative Technical Solution',
    reward: '₹5,000 + Citation Plaque',
    description: 'Recognizing novel architectural engineering, deep algorithmic ingenuity, or frontier hardware/software integration.',
    iconName: 'Cpu',
    accentColor: '#8B5CF6',
  },
  {
    id: 'spec-women',
    title: 'Best All-Women Developer Team',
    reward: '₹5,000 + Citation Plaque',
    description: 'Celebrating women in engineering excelling in technical leadership, high-velocity code development, and problem solving.',
    iconName: 'Sparkles',
    accentColor: '#F97316',
  },
];

export const universalPerks = [
  'Official VTU-affiliated Certificate of Participation for all verified builders',
  'Exclusive NEXORA 2026 Builder Kit (Official T-Shirt, Stickers, Desk Mat & Badges)',
  '24-Hour continuous networking with industry leads, judges & recruiters',
  'Resume inclusion in the exclusive NEXORA 2026 Talent Directory shared with sponsors',
];

