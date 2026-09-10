import { TimelineItem } from '../types';

export const timelineData: TimelineItem[] = [
  {
    id: 't-1',
    day: 'Day 1',
    time: '09:00 AM',
    title: 'Registration & Participant Check-In',
    description:
      'Teams arrive at LAEC Central Computing Arena. In-person desk verification, USN / College ID confirmation, Wi-Fi credentials distribution, and workstation settlement.',
    type: 'milestone',
    status: 'completed',
    tags: ['Check-In', 'LAEC Arena', 'Kit Distribution'],
  },
  {
    id: 't-2',
    day: 'Day 1',
    time: '11:00 AM',
    title: 'Inauguration & HACKORA 2026 Kick-Off',
    description:
      'Engineers’ Day Inaugural Ceremony followed by the official commencement of HACKORA 2026. The 24-hour countdown clock officially starts across all 6 themes.',
    type: 'milestone',
    status: 'current',
    tags: ['Kick-Off', '24H Clock Starts', 'Engineers\' Day'],
  },
  {
    id: 't-3',
    day: 'Day 1',
    time: '02:00 PM',
    title: 'IDEATHON 2026 Jury Presentations (Round 1)',
    checkpointNumber: '01',
    description:
      'Ideathon teams present their problem statements, concept decks, and feasibility roadmaps before the expert evaluation jury.',
    type: 'checkpoint',
    status: 'upcoming',
    tags: ['Ideathon', 'Pitch Round', 'Jury Review'],
  },
  {
    id: 't-4',
    day: 'Day 1',
    time: '04:00 PM',
    title: 'PROJECT EXPO 2026 Demonstrations & Judging',
    checkpointNumber: '02',
    description:
      'Project Expo participants demonstrate working hardware models, embedded IoT devices, and software prototypes in the main exhibition hall.',
    type: 'checkpoint',
    status: 'upcoming',
    tags: ['Project Expo', 'Hardware Demo', 'Exhibition'],
  },
  {
    id: 't-5',
    day: 'Day 1',
    time: '08:00 PM',
    title: 'Checkpoint 03: Architecture Review & Dinner Window',
    checkpointNumber: '03',
    description:
      'Faculty mentors and technical architects review integration pipelines, database designs, and prototype state, followed by hot dinner.',
    type: 'review',
    status: 'upcoming',
    tags: ['Mentorship', 'Dinner', 'Progress Review'],
  },
  {
    id: 't-6',
    day: 'Day 1',
    time: '12:00 AM',
    title: 'Midnight Refreshments, Coffee & Mentorship Checkpoint',
    checkpointNumber: '04',
    description:
      'Midnight energy snacks, hot coffee, and unblocking sessions with senior technical leads for overnight hacking squads.',
    type: 'activity',
    status: 'upcoming',
    tags: ['Midnight Fuel', 'Coffee', 'Night Support'],
  },
  {
    id: 't-7',
    day: 'Day 2',
    time: '08:00 AM',
    title: 'Pre-Dawn Sprint & South Indian Breakfast',
    checkpointNumber: '05',
    description:
      'Hot breakfast served in the dining hall. Final styling, bug fixing, and presentation slide deck preparations.',
    type: 'activity',
    status: 'upcoming',
    tags: ['Breakfast', 'Bug Squashing', 'Slide Prep'],
  },
  {
    id: 't-8',
    day: 'Day 2',
    time: '11:00 AM',
    title: 'HACKORA Code Freeze & Sprint Submission Lock',
    description:
      '24 continuous hours completed! All coding ceases. Local prototypes are packaged and prepared for physical hardware/laptop demonstration.',
    type: 'milestone',
    status: 'upcoming',
    tags: ['Code Freeze', '24H Completed', 'Strict Lock'],
  },
  {
    id: 't-9',
    day: 'Day 2',
    time: '02:00 PM',
    title: 'Final In-Person Jury Evaluation & Prototype Defense',
    description:
      'Jury panels conduct comprehensive offline physical evaluations at participant workstations. Live software execution and hardware testing.',
    type: 'review',
    status: 'upcoming',
    tags: ['Offline Defense', 'Live Testing', 'Jury Evaluation'],
  },
  {
    id: 't-10',
    day: 'Day 2',
    time: '05:00 PM',
    title: 'Valedictory & Grand Prize Distribution Ceremony',
    description:
      'Honoring champion teams with ₹45,000+ cash prizes, trophies, special domain citations, and official VTU Certificates of Participation.',
    type: 'ceremony',
    status: 'upcoming',
    tags: ['Valedictory', 'Cash Prizes', 'VTU Certificates'],
  },
];
