import { EventItem } from '../types';

export const eventsData: EventItem[] = [
  {
    id: 'hackora',
    name: 'HACKORA 2026',
    tagline: 'HACK THE AURA!',
    subtitle: '24-Hour National Hackathon',
    description:
      'A premier 24-hour national hackathon where teams solve real-world problems, build working software/hardware solutions, and demonstrate their technical skills under continuous live execution.',
    teamSize: '2–4 Members',
    fee: '₹1,200 / team',
    prizePool: '₹35,000',
    firstPrize: '₹25,000',
    secondPrize: '₹10,000',
    format: '24-Hour Continuous Offline Hackathon (21 Sep 11:00 AM – 22 Sep 11:00 AM)',
    iconName: 'Zap',
    colorTheme: 'cyan',
    accentBadge: 'Flagship 24H Sprint • 21–22 Sep',
    highlights: [
      'Open innovation tracks across 6 official themes',
      'Continuous mentorship sessions throughout the 24-hour sprint',
      '1st Prize: ₹25,000 + Gold Trophy | 2nd Prize: ₹10,000 + Silver Trophy',
      'Direct pitch opportunities to startup incubators and VC networks',
      'Official VTU-affiliated Certificate of Participation for all verified builders',
    ],
    rules: [
      'Each team must consist of 2–4 members (inter-college teams permitted).',
      'Each participant can belong to only ONE active team.',
      'All code must be authored during the 24-hour sprint. Open-source libraries permitted.',
      'Strictly NO online code submission / GitHub upload. All teams must bring working prototypes and laptops to LAEC campus on 22 September.',
      'Participants must present valid college ID cards or USN credentials at check-in.',
      'The jury decision will be final and binding.',
    ],
  },
  {
    id: 'ideathon',
    name: 'IDEATHON 2026',
    tagline: 'THINK IT. PITCH IT. CHANGE IT.',
    subtitle: 'Ideate & Pitch Solutions',
    description:
      'Develop an innovative solution to a real-world problem and present your idea with clarity, creativity, and conviction before an expert jury of industry leaders and researchers on 22 September 2026.',
    teamSize: '1–2 Members',
    fee: '₹250 / team',
    prizePool: '₹5,000',
    firstPrize: '₹3,000',
    secondPrize: '₹2,000',
    format: 'Live Concept Pitch & Jury Presentation (22 September 2026)',
    iconName: 'Lightbulb',
    colorTheme: 'purple',
    accentBadge: 'Pitch Competition • 22 Sep',
    highlights: [
      'Present to industry leaders and academic evaluators on 22 September',
      'Refine problem definition, market feasibility, and execution roadmap',
      '1st Prize: ₹3,000 | 2nd Prize: ₹2,000',
      'Official Certificate of Participation for all presenters',
    ],
    rules: [
      'Each team must consist of 1–2 members.',
      'The idea should solve a clearly defined real-world problem.',
      'Participants must present their solution deck within the allotted time (5-minute pitch + 3-minute Q&A).',
      'Originality, feasibility, innovation, and impact will be evaluated.',
      'The jury decision will be final.',
    ],
  },
  {
    id: 'expo',
    name: 'PROJECT EXPO 2026',
    tagline: 'SHOWCASE. INSPIRE. CREATE IMPACT.',
    subtitle: 'Software & Working Model Exhibition 2026',
    description:
      'Exhibit your working software system, web/mobile application, AI/ML prototype, IoT or engineering model directly to industry evaluators, faculty experts, and peer innovators on 22 September 2026 at the LAEC campus. Open to students across all engineering branches (CSE, ISE, ECE, Mech, Civil, etc.)!',
    teamSize: '1–2 Members',
    fee: '₹250 / team',
    prizePool: '₹5,000',
    firstPrize: '₹3,000',
    secondPrize: '₹2,000',
    format: 'In-Person Software & Working Model Showcase (22 September 2026)',
    iconName: 'Box',
    colorTheme: 'emerald',
    accentBadge: 'Exhibition & Demo • 22 Sep',
    highlights: [
      'Dedicated booth table with power access in the LAEC exhibition hall',
      'Live interactive demonstration before visiting jury panels',
      'Open to all domains: Software apps, AI/ML models, IoT systems, and working prototypes across all branches',
      '1st Prize: ₹3,000 | 2nd Prize: ₹2,000',
      'Official Certificate of Participation for all exhibitors',
    ],
    rules: [
      'Each team must consist of 1–2 members.',
      'Projects must be functional and demonstrated live before the jury (software demos on laptops or physical setups).',
      'Teams must bring their laptops, setups, and any necessary accessories or power adapters.',
      'Slide deck (PPT) or documentation should accompany the live demonstration.',
      'The jury decision will be final.',
    ],
  },
];

export interface TrackPrizeInfo {
  eventId: string;
  name: string;
  category: string;
  pool: string;
  firstPrize: string;
  secondPrize: string;
  color: 'cyan' | 'purple' | 'emerald';
}

export const consolidatedPrizes = {
  totalPool: '₹45,000+',
  hackora: '₹35,000 (1st: ₹25,000, 2nd: ₹10,000)',
  ideathon: '₹5,000 (1st: ₹3,000, 2nd: ₹2,000)',
  expo: '₹5,000 (1st: ₹3,000, 2nd: ₹2,000)',
  tracks: [
    {
      eventId: 'hackora',
      name: 'HACKORA 2026',
      category: '24-Hour National Hackathon',
      pool: '₹35,000',
      firstPrize: '₹25,000 + Gold Trophy',
      secondPrize: '₹10,000 + Silver Trophy',
      color: 'cyan',
    },
    {
      eventId: 'ideathon',
      name: 'IDEATHON 2026',
      category: 'Pitch Competition (22 Sep)',
      pool: '₹5,000',
      firstPrize: '₹3,000 Cash Grant',
      secondPrize: '₹2,000 Cash Grant',
      color: 'purple',
    },
    {
      eventId: 'expo',
      name: 'PROJECT EXPO 2026',
      category: 'Software & Working Model Expo (22 Sep)',
      pool: '₹5,000',
      firstPrize: '₹3,000 Cash Grant',
      secondPrize: '₹2,000 Cash Grant',
      color: 'emerald',
    },
  ] as TrackPrizeInfo[],
  certificateNote: 'Official Certificate of Participation for all verified participants across all tracks.',
};

