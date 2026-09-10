export interface TimelineItem {
  id: string;
  day: 'Day 1' | 'Day 2';
  time: string;
  title: string;
  description: string;
  checkpointNumber?: string;
  type: 'milestone' | 'checkpoint' | 'review' | 'activity' | 'ceremony';
  status: 'upcoming' | 'current' | 'completed';
  tags: string[];
}

export interface Amenity {
  id: string;
  title: string;
  description: string;
  iconName: string;
  badge: string;
  features: string[];
}

export interface Prize {
  id: string;
  rank: string;
  title: string;
  amount: string;
  trophy: string;
  description: string;
  perks: string[];
  gradient: string;
  badgeText: string;
}

export interface SpecialCitation {
  id: string;
  title: string;
  reward: string;
  description: string;
  iconName: string;
  accentColor: string;
}

export interface Sponsor {
  name: string;
  tier: 'platinum' | 'gold' | 'silver' | 'community';
  tagline: string;
  logoPlaceholder: string;
  badge: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'General' | 'Rules' | 'Logistics' | 'Judging';
}

export interface TrackItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  problemExamples: string[];
  badge: string;
}

export interface OfficialTheme {
  id: string;
  title: string;
  tagline: string;
  image: string;
  color: string;
  accentBg: string;
  description: string;
  subtracks: string[];
}

export interface EventItem {
  id: 'hackora' | 'ideathon' | 'expo';
  name: string;
  tagline: string;
  subtitle: string;
  description: string;
  teamSize: string;
  fee: string;
  prizePool: string;
  firstPrize: string;
  secondPrize: string;
  format: string;
  iconName: string;
  colorTheme: string;
  accentBadge: string;
  highlights: string[];
  rules: string[];
}

export interface ResourceItem {
  id: string;
  title: string;
  desc: string;
  filename: string;
  link: string;
  type: 'Brochure' | 'Guidelines' | 'Poster' | 'Banner';
  badge: string;
}

export type PageId =
  | 'home'
  | 'events'
  | 'about'
  | 'themes'
  | 'tracks'
  | 'schedule'
  | 'hospitality'
  | 'resources'
  | 'sponsors'
  | 'faq'
  | 'admin';


