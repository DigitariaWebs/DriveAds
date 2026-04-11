import { Ionicons } from '@expo/vector-icons';

type IoniconName = keyof typeof Ionicons.glyphMap;

export type CampaignStatus = 'available' | 'active' | 'completed' | 'upcoming';

export type TrackingMode = 'gps' | 'manual';

export type Campaign = {
  id: string;
  brand: string;
  domain: string;
  title: string;
  description: string;
  city: string;
  zones: string[];
  startDate: string;
  endDate: string;
  durationDays: number;
  reward: number;
  progress?: number; // 0..1
  kmDone?: number;
  kmTotal?: number;
  driversAssigned?: number;
  driversNeeded?: number;
  assignedDriverIds?: string[];
  icon: IoniconName;
  status: CampaignStatus;
  trackingMode?: TrackingMode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  heroImage?: any;
};

export const initialCampaigns: Campaign[] = [
  {
    id: 'c1',
    brand: 'Nike Air Max 2024',
    domain: 'nike.com',
    title: 'Nike Air Max 2024',
    description:
      'Campagne street sur les artères principales de Paris et Banlieue.',
    city: 'Paris',
    zones: ['Paris Centre', 'La Défense', 'Saint-Denis'],
    startDate: '01 avril',
    endDate: '20 avril',
    durationDays: 20,
    reward: 350,
    progress: 0.75,
    kmDone: 1500,
    kmTotal: 2000,
    driversAssigned: 4,
    driversNeeded: 4,
    assignedDriverIds: ['d1', 'd4', 'd5', 'd7'],
    icon: 'shirt',
    status: 'active',
  },
  {
    id: 'c2',
    brand: 'Adidas Originals',
    domain: 'adidas.com',
    title: 'Adidas Originals',
    description: 'Wrap complet — gamme street 2024.',
    city: 'Paris Centre',
    zones: ['Paris 1er', 'Paris 3ème', 'Le Marais'],
    startDate: '15 avril',
    endDate: '30 avril',
    durationDays: 15,
    reward: 400,
    driversAssigned: 2,
    driversNeeded: 5,
    assignedDriverIds: ['d1', 'd5'],
    icon: 'shirt-outline',
    status: 'available',
  },
  {
    id: 'c3',
    brand: 'Coca-Cola Summer',
    domain: 'coca-cola.com',
    title: 'Coca-Cola Summer',
    description: 'Opération été — fraîcheur et visibilité urbaine.',
    city: 'Île-de-France',
    zones: ['Paris', 'Banlieue Nord', 'Banlieue Sud'],
    startDate: '01 avril',
    endDate: '21 avril',
    durationDays: 20,
    reward: 280,
    progress: 0.55,
    kmDone: 1100,
    kmTotal: 2000,
    driversAssigned: 3,
    driversNeeded: 3,
    assignedDriverIds: ['d1', 'd4', 'd7'],
    icon: 'cafe',
    status: 'active',
    trackingMode: 'gps',
    heroImage: require('../assets/SUV Toyota RAV4 aux couleurs Coca-Cola.png'),
  },
  {
    id: 'c4',
    brand: 'Renault Électrique',
    domain: 'renault.com',
    title: 'Renault Électrique',
    description: 'Lancement nouvelle gamme e-mobilité.',
    city: 'Lyon',
    zones: ['Lyon Centre', 'Villeurbanne', 'Bron'],
    startDate: '05 mai',
    endDate: '26 mai',
    durationDays: 21,
    reward: 520,
    driversAssigned: 0,
    driversNeeded: 4,
    assignedDriverIds: [],
    icon: 'car-sport',
    status: 'available',
  },
  {
    id: 'c5',
    brand: 'Samsung Galaxy',
    domain: 'samsung.com',
    title: 'Samsung Galaxy',
    description: 'Lancement du nouveau smartphone pliable.',
    city: 'Marseille',
    zones: ['Vieux-Port', 'Castellane'],
    startDate: '12 février',
    endDate: '05 mars',
    durationDays: 21,
    reward: 460,
    driversAssigned: 3,
    driversNeeded: 3,
    assignedDriverIds: ['d1', 'd4', 'd7'],
    icon: 'phone-portrait',
    status: 'completed',
  },
];

// Legacy alias — some files still import `campaigns`
export const campaigns = initialCampaigns;

export type NotificationItem = {
  id: string;
  type: 'campaign' | 'payment' | 'validation' | 'system';
  icon: IoniconName;
  title: string;
  body: string;
  time: string;
  unread: boolean;
};

export const notifications: NotificationItem[] = [
  {
    id: 'n1',
    type: 'campaign',
    icon: 'megaphone',
    title: 'Nouvelle campagne disponible',
    body: 'Adidas Originals cherche 5 chauffeurs à Paris. Rémunération 400 €.',
    time: 'Il y a 12 min',
    unread: true,
  },
  {
    id: 'n2',
    type: 'payment',
    icon: 'cash',
    title: 'Paiement reçu',
    body: 'Votre dernière campagne Samsung Galaxy a été réglée : 460 €.',
    time: 'Il y a 2 h',
    unread: true,
  },
  {
    id: 'n3',
    type: 'validation',
    icon: 'checkmark-circle',
    title: 'Profil validé',
    body: "Vos documents de véhicule ont été validés par l'équipe DriveAds.",
    time: 'Hier',
    unread: true,
  },
  {
    id: 'n4',
    type: 'campaign',
    icon: 'radio',
    title: 'Campagne active',
    body: 'Nike Air Max 2024 — 75% de progression. Plus que 5 jours.',
    time: 'Hier',
    unread: false,
  },
  {
    id: 'n5',
    type: 'system',
    icon: 'shield-checkmark',
    title: 'Bienvenue sur DriveAds',
    body: 'Remplissez votre profil pour accéder aux campagnes.',
    time: 'Il y a 3 j',
    unread: false,
  },
];

export type Driver = {
  id: string;
  name: string;
  city: string;
  campaignsDone: number;
  rating: number;
  status: 'validated' | 'pending' | 'rejected';
  joinedAt: string;
};

export const drivers: Driver[] = [
  {
    id: 'd1',
    name: 'Marie Dubois',
    city: 'Paris',
    campaignsDone: 12,
    rating: 4.9,
    status: 'validated',
    joinedAt: '2024-01-15',
  },
  {
    id: 'd2',
    name: 'Julien Martin',
    city: 'Paris',
    campaignsDone: 0,
    rating: 0,
    status: 'pending',
    joinedAt: '2026-04-08',
  },
  {
    id: 'd3',
    name: 'Sophie Laurent',
    city: 'Marseille',
    campaignsDone: 0,
    rating: 0,
    status: 'pending',
    joinedAt: '2026-04-07',
  },
  {
    id: 'd4',
    name: 'Thomas Bernard',
    city: 'Lyon',
    campaignsDone: 8,
    rating: 4.7,
    status: 'validated',
    joinedAt: '2024-06-22',
  },
  {
    id: 'd5',
    name: 'Claire Petit',
    city: 'Bordeaux',
    campaignsDone: 5,
    rating: 4.8,
    status: 'validated',
    joinedAt: '2024-11-03',
  },
  {
    id: 'd6',
    name: 'Alexandre Roux',
    city: 'Paris',
    campaignsDone: 0,
    rating: 0,
    status: 'pending',
    joinedAt: '2026-04-05',
  },
  {
    id: 'd7',
    name: 'Emma Moreau',
    city: 'Nice',
    campaignsDone: 3,
    rating: 4.6,
    status: 'validated',
    joinedAt: '2025-02-18',
  },
];

export type Company = {
  id: string;
  name: string;
  domain: string;
  city: string;
  sector: string;
  campaignsCount: number;
  status: 'validated' | 'pending';
  icon: IoniconName;
  description: string;
  founded: string;
  headquarters: string;
  website: string;
  budgetTotal: number;
  employees: string;
  gallery: string[];
};

export const companies: Company[] = [
  {
    id: 'e1',
    name: 'Nike France',
    domain: 'nike.com',
    city: 'Paris',
    sector: 'Mode & Sport',
    campaignsCount: 3,
    status: 'validated',
    icon: 'shirt',
    description:
      "Nike est le leader mondial de l'équipement sportif et des chaussures de sport. La filiale française lance régulièrement des campagnes de street-marketing ciblant les zones urbaines dynamiques.",
    founded: '1964',
    headquarters: 'Beaverton, Oregon',
    website: 'nike.com',
    budgetTotal: 12500,
    employees: '76 000+',
    gallery: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'e2',
    name: 'Adidas Europe',
    domain: 'adidas.com',
    city: 'Paris',
    sector: 'Mode & Sport',
    campaignsCount: 2,
    status: 'validated',
    icon: 'shirt-outline',
    description:
      "Adidas, la marque aux trois bandes, privilégie les campagnes publicitaires street et urban pour promouvoir ses dernières collections auprès d'une audience jeune et active.",
    founded: '1949',
    headquarters: 'Herzogenaurach, Allemagne',
    website: 'adidas.com',
    budgetTotal: 8200,
    employees: '62 000+',
    gallery: [
      'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'e3',
    name: 'Coca-Cola France',
    domain: 'coca-cola.com',
    city: 'Lyon',
    sector: 'Boissons',
    campaignsCount: 1,
    status: 'pending',
    icon: 'cafe',
    description:
      "Coca-Cola France utilise DriveAds pour diffuser ses campagnes estivales à travers l'Île-de-France. L'objectif : maximiser la visibilité de la marque sur les routes les plus fréquentées.",
    founded: '1886',
    headquarters: 'Atlanta, USA',
    website: 'coca-cola.com',
    budgetTotal: 5600,
    employees: '700 000+',
    gallery: [
      'https://images.unsplash.com/photo-1554866585-cd94860890b7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'e4',
    name: 'Renault SAS',
    domain: 'renault.com',
    city: 'Boulogne',
    sector: 'Automobile',
    campaignsCount: 1,
    status: 'validated',
    icon: 'car-sport',
    description:
      "Le constructeur français Renault mise sur DriveAds pour promouvoir sa nouvelle gamme électrique à travers les grandes villes de France.",
    founded: '1899',
    headquarters: 'Boulogne-Billancourt',
    website: 'renault.com',
    budgetTotal: 10400,
    employees: '111 000+',
    gallery: [
      'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'e5',
    name: 'Samsung France',
    domain: 'samsung.com',
    city: 'Paris',
    sector: 'Tech',
    campaignsCount: 1,
    status: 'pending',
    icon: 'phone-portrait',
    description:
      'Samsung Electronics France lance ses campagnes autour du lancement des derniers smartphones et produits connectés à travers les zones urbaines dynamiques.',
    founded: '1938',
    headquarters: 'Suwon, Corée du Sud',
    website: 'samsung.com',
    budgetTotal: 9200,
    employees: '270 000+',
    gallery: [
      'https://images.unsplash.com/photo-1567581935884-3349723552ca?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
    ],
  },
];

export type TrackingEvent = {
  id: string;
  time: string;
  icon: IoniconName;
  color: 'success' | 'info' | 'warning' | 'navy';
  text: string;
  driver?: string;
};

export const trackingEventsFor = (campaignId: string): TrackingEvent[] => {
  // Shared mock activity feed — real impl would be per-campaign
  void campaignId;
  return [
    {
      id: 'ev1',
      time: '14:22',
      icon: 'location',
      color: 'success',
      text: 'Nouveau point visité · Gare de Lyon',
      driver: 'Marie Dubois',
    },
    {
      id: 'ev2',
      time: '14:05',
      icon: 'pause-circle',
      color: 'warning',
      text: "En pause · Station Shell A6",
      driver: 'Emma Moreau',
    },
    {
      id: 'ev3',
      time: '13:48',
      icon: 'speedometer',
      color: 'navy',
      text: '+12 km parcourus en 20 min',
      driver: 'Thomas Bernard',
    },
    {
      id: 'ev4',
      time: '13:30',
      icon: 'checkmark-circle',
      color: 'success',
      text: 'Zone Paris Centre complétée',
      driver: 'Marie Dubois',
    },
    {
      id: 'ev5',
      time: '12:12',
      icon: 'play-circle',
      color: 'info',
      text: "Début de tournée",
      driver: 'Emma Moreau',
    },
  ];
};

export const driverStats = {
  name: 'Marie Dubois',
  email: 'marie.dubois@example.com',
  city: 'Paris',
  monthlyEarnings: 450,
  monthlyGrowth: 12,
  totalEarnings: 4320,
  campaignsCompleted: 12,
  activeCampaigns: 1,
  rating: 4.9,
  totalKm: 18500,
  joinedMonths: 8,
  vehicleModel: 'Peugeot 308 · 2022',
};

export const adminStats = {
  totalDrivers: 128,
  newDriversThisWeek: 8,
  totalCompanies: 42,
  newCompaniesThisWeek: 3,
  activeCampaigns: 8,
  monthlyRevenue: 12400,
  monthlyGrowth: 18,
  pendingValidations: 6,
};
