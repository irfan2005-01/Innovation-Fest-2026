import { Amenity } from '../types';

export const amenitiesData: Amenity[] = [
  {
    id: 'meal-plan',
    title: '24H Gourmet Meal Plan',
    badge: '7 Catered Meals & Refreshments',
    iconName: 'Utensils',
    description: 'Keep your cognitive performance at its peak with round-the-clock nutritious meals and refreshments provided at zero cost to all participants.',
    features: [
      'Welcome breakfast & welcome brew',
      'Wholesome executive working lunch',
      'Evening high tea with artisan savories',
      'Full course buffet dinner at 8:30 PM',
      'Midnight coffee, Red Bull & energy snacks',
      'Pre-dawn sunrise breakfast & juice bar',
      'Grand valedictory celebration feast',
    ],
  },
  {
    id: 'network',
    title: 'Gigabit Redundant Network',
    badge: 'Dual Leased Line ISP Failover',
    iconName: 'Wifi',
    description: 'Ultra-low latency dual-line campus backbone engineered to handle concurrent Docker builds, NPM pulls, and AI model inference without throttling.',
    features: [
      'Dedicated 1 Gbps symmetrical optical trunk',
      'Automated load balancing across multiple ISPs',
      'Isolated secure VLAN for all hackathon teams',
      'Low packet loss for remote API invocations',
    ],
  },
  {
    id: 'power',
    title: 'High-Capacity Power Stations',
    badge: 'Uninterrupted Clean Power',
    iconName: 'Zap',
    description: 'Every team workstation is equipped with dedicated industrial-grade surge-protected multi-point sockets connected to campus backup diesel generators.',
    features: [
      '4 to 6 multi-plug sockets per workbench',
      '100% online double-conversion UPS protection',
      'Zero blackout guarantee with auto-start DG sets',
      'Dedicated chargers for laptops, tablets, and test devices',
    ],
  },
  {
    id: 'rest',
    title: 'Gender-Segregated Rest Lounges',
    badge: 'Quiet Rejuvenation Pods',
    iconName: 'Moon',
    description: 'Air-conditioned, clean, quiet zones designed specifically for power naps and physical rest between intense debugging marathons.',
    features: [
      'Separate secure lounges for male & female builders',
      'Comfortable reclining lounge beds & fresh linens',
      'Access-controlled and supervised entry',
      'Full hygiene and shower facility access',
    ],
  },
  {
    id: 'security',
    title: '24/7 Monitored Campus Security',
    badge: 'Safe & Guarded Perimeter',
    iconName: 'ShieldCheck',
    description: 'Comprehensive multi-tiered security protocols ensuring participant safety, property protection, and continuous faculty vigilance throughout the night.',
    features: [
      '24/7 LAEC security staff at all perimeter gates',
      'CCTV surveillance across entire computing arena',
      'Senior faculty wardens and coordinators on-site overnight',
      'Strict NFC/QR identity badge validation',
    ],
  },
  {
    id: 'medical',
    title: 'Medical Post & First-Aid Desk',
    badge: 'Emergency Escalation Ready',
    iconName: 'HeartPulse',
    description: 'On-premise health outpost staffed by qualified medical personnel to attend to minor ailments, headaches, stress relief, and emergencies.',
    features: [
      '24-hour certified nurse and first-responder team',
      'Full inventory of OTC meds, eye drops, pain relief',
      'Dedicated standby on-call college ambulance',
      'Affiliated tie-up with District Super-Specialty Hospital',
    ],
  },
];

