export interface Pillar {
  number: string;
  title: string;
  tagline: string;
  description: string;
  iconName: string;
  gradient: string;
  stats: string;
}

export const pillarsData: Pillar[] = [
  {
    number: '01',
    title: 'Continuous 24H Sprint',
    tagline: 'Zero Midway Eliminations',
    description: 'Unlike conventional hackathons that cut teams halfway, NEXORA guarantees every single builder the full uninterrupted 24-hour development cycle to bring their idea to life.',
    iconName: 'Timer',
    gradient: 'from-[#00F2FE]/20 to-[#00F2FE]/5 border-[#00F2FE]/40',
    stats: '1,440 Mins Pure Dev Time',
  },
  {
    number: '02',
    title: '100% Fair Ground',
    tagline: 'Zero Pre-Cooked Codebases',
    description: 'Real engineering starts at 11:00 AM on campus. Challenge statements are broadcast live, ensuring that spontaneous ingenuity and teamwork triumph over pre-packaged repos.',
    iconName: 'ShieldCheck',
    gradient: 'from-[#8B5CF6]/20 to-[#8B5CF6]/5 border-[#8B5CF6]/40',
    stats: 'Live Problem Release at 11 AM',
  },
  {
    number: '03',
    title: '24/7 Technical Mentorship',
    tagline: 'Dedicated Industry Unblockers',
    description: 'Senior enterprise architects, cloud evangelists, and faculty specialists roam the arena through day and night to debug architecture issues, optimize databases, and refine user flows.',
    iconName: 'Users',
    gradient: 'from-[#F97316]/20 to-[#F97316]/5 border-[#F97316]/40',
    stats: '15+ Industry Mentors On-Site',
  },
  {
    number: '04',
    title: 'State-Level Showcase',
    tagline: 'Direct Pitch to Investors & Founders',
    description: 'Step into the spotlight. Demonstrate your running code directly before venture scouts, startup CTOs, and distinguished university evaluators during live parallel jury sessions.',
    iconName: 'Rocket',
    gradient: 'from-[#EC4899]/20 to-[#EC4899]/5 border-[#EC4899]/40',
    stats: '₹1,00,000+ Total Prize Pool',
  },
];

