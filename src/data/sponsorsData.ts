export interface TitleSponsor {
  name: string;
  subtitle: string;
  tagline: string;
  motto: string;
  bannerImage: string;
  category: string;
  description: string;
  corePillars: string[];
}

export const titleSponsor: TitleSponsor = {
  name: 'Rotary Silver Club',
  subtitle: 'People of Action',
  tagline: 'Service Above Self',
  motto: 'Ideas • Innovation • Impact',
  bannerImage: '/images/rotary-silver-club-title-sponsor.png',
  category: 'Official Title Sponsor',
  description:
    'Dedicated to empowering the next generation of engineers, fostering technological innovation, community development, and leadership excellence across Karnataka.',
  corePillars: ['Community', 'Leadership', 'Opportunity', 'Service'],
};

// Backwards compatibility empty arrays for clean imports
export interface SponsorSlot {
  name: string;
  category: string;
  perks: string;
  slotLabel: string;
  accent: string;
}

export const platinumPartners: SponsorSlot[] = [];
export const goldPartners: SponsorSlot[] = [];
export const silverAndCommunityPartners: { name: string; role: string }[] = [];

