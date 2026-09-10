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
  name: 'Official Fest Partners',
  subtitle: 'Innovation Fest 2026',
  tagline: 'Empowering Future Engineers',
  motto: 'Ideas • Innovation • Impact',
  bannerImage: '',
  category: 'Partnership Desk',
  description:
    'Dedicated to empowering the next generation of engineers, fostering technological innovation, community development, and leadership excellence.',
  corePillars: ['Community', 'Leadership', 'Opportunity', 'Innovation'],
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

