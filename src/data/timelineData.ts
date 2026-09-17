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
      'Engineers’ Day Inaugural Ceremony followed by the official commencement of HACKORA 2026. The 24-hour continuous countdown clock officially starts across all 6 themes.',
    type: 'milestone',
    status: 'current',
    tags: ['Kick-Off', '24H Clock Starts', 'Engineers\' Day'],
  },
  {
    id: 't-3',
    day: 'Day 1',
    time: '03:00 PM',
    title: 'HACKORA Checkpoint 01: Mentorship & Problem Validation',
    checkpointNumber: '01',
    description:
      'Faculty mentors and domain experts visit hackathon team workstations to review problem statements, feasibility, and technical architectures.',
    type: 'checkpoint',
    status: 'upcoming',
    tags: ['Hackora', 'Mentor Review', 'Architecture Check'],
  },
  {
    id: 't-4',
    day: 'Day 1',
    time: '08:00 PM',
    title: 'HACKORA Checkpoint 02: Core Feature Review & Hot Dinner',
    checkpointNumber: '02',
    description:
      'Technical architects review code integration, database schemas, and early prototypes, followed by hot dinner for all participants.',
    type: 'review',
    status: 'upcoming',
    tags: ['Hackora', 'Dinner Window', 'Feature Review'],
  },
  {
    id: 't-5',
    day: 'Day 1',
    time: '12:00 AM',
    title: 'Midnight Refreshments, Coffee & Night Mentorship Checkpoint',
    checkpointNumber: '03',
    description:
      'Midnight energy snacks, hot coffee, and unblocking sessions with senior technical leads for overnight hacking squads.',
    type: 'activity',
    status: 'upcoming',
    tags: ['Midnight Fuel', 'Coffee', 'Night Support'],
  },
  {
    id: 't-6',
    day: 'Day 2',
    time: '08:00 AM',
    title: 'Pre-Dawn Sprint & South Indian Breakfast',
    checkpointNumber: '04',
    description:
      'Hot breakfast served in the dining hall. Final styling, bug fixing, and presentation slide deck preparations.',
    type: 'activity',
    status: 'upcoming',
    tags: ['Breakfast', 'Bug Squashing', 'Slide Prep'],
  },
  {
    id: 't-7',
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
    id: 't-8',
    day: 'Day 2',
    time: '11:30 AM',
    title: 'IDEATHON 2026 Live Pitching & Jury Presentations',
    checkpointNumber: '05',
    description:
      'Ideathon squads present their problem statements, concept decks, and feasibility roadmaps before expert jury panels in the seminar auditorium.',
    type: 'checkpoint',
    status: 'upcoming',
    tags: ['Ideathon', '22 September', 'Live Pitching', 'Jury Round'],
  },
  {
    id: 't-9',
    day: 'Day 2',
    time: '01:30 PM',
    title: 'PROJECT EXPO 2026 Live Demonstrations & Model Exhibition',
    checkpointNumber: '06',
    description:
      'Project Expo participants demonstrate functional hardware models, embedded IoT devices, and software prototypes live across exhibition stalls.',
    type: 'checkpoint',
    status: 'upcoming',
    tags: ['Project Expo', '22 September', 'Hardware Demo', 'Exhibition Floor'],
  },
  {
    id: 't-10',
    day: 'Day 2',
    time: '03:00 PM',
    title: 'HACKORA 2026 Offline Jury Evaluation & Prototype Defense',
    description:
      'Jury panels conduct comprehensive offline physical evaluations at hackathon participant workstations. Live software execution and testing.',
    type: 'review',
    status: 'upcoming',
    tags: ['Hackora Defense', 'Live Testing', 'Jury Evaluation'],
  },
  {
    id: 't-11',
    day: 'Day 2',
    time: '05:00 PM',
    title: 'Valedictory & Grand Prize Distribution Ceremony',
    description:
      'Honoring champion teams across Hackora, Ideathon, and Project Expo with ₹45,000+ cash prizes, trophies, and official VTU Certificates of Participation.',
    type: 'ceremony',
    status: 'upcoming',
    tags: ['Valedictory', 'Cash Prizes', 'VTU Certificates'],
  },
];
