export type UserRole = 'driver' | 'advertiser' | 'partner';
export type CampaignStatus = 'available' | 'active' | 'completed' | 'upcoming';
export type ValidationStatus = 'pending' | 'validated' | 'rejected';
export type TrackingMode = 'gps' | 'manual';
export type NotificationType = 'campaign' | 'payment' | 'validation' | 'system';

export type Driver = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: 'Paris' | 'Lyon' | 'Caen' | 'Marseille' | 'Nice' | 'Bordeaux';
  vehicleModel: string;
  vehicleYear: string;
  licensePlate: string;
  vehicleType: 'Berline' | 'SUV' | 'Utilitaire' | 'Autre';
  status: ValidationStatus;
  joinedAt: string;
  campaignsDone: number;
  rating: number;
  totalKm: number;
  totalEarnings: number;
  documentsUploaded: boolean;
};

export type Company = {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  domain: string;
  sector: string;
  city: string;
  website: string;
  description: string;
  status: ValidationStatus;
  founded: string;
  headquarters: string;
  budgetTotal: number;
  employees: string;
  campaignsCount: number;
  gallery: string[];
};

export type Partner = {
  id: string;
  businessName: string;
  managerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  openingHours: string;
  terminalStatus: 'online' | 'maintenance' | 'offline';
  monthlySprayRevenue: number;
  monthlyAdsRevenue: number;
};

export type Campaign = {
  id: string;
  companyId: string;
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
  status: CampaignStatus;
  progress: number;
  kmDone: number;
  kmTotal: number;
  driversNeeded: number;
  driversAssigned: number;
  assignedDriverIds: string[];
  trackingMode: TrackingMode;
  heroImage?: any;
};

export type NotificationItem = {
  id: string;
  type: NotificationType;
  icon: string;
  title: string;
  body: string;
  time: string;
  unread: boolean;
};

export type TrackingEvent = {
  id: string;
  time: string;
  icon: string;
  color: 'success' | 'info' | 'warning' | 'navy';
  text: string;
  driver?: string;
};

export type DriverStats = {
  monthlyEarnings: number;
  totalEarnings: number;
  campaignsDone: number;
  rating: number;
  totalKm: number;
  activeCampaigns: number;
  growthPercent: number;
};

export type AdminStats = {
  monthlyRevenue: number;
  revenueGrowth: number;
  totalDrivers: number;
  totalCompanies: number;
  activeCampaigns: number;
  pendingDrivers: number;
  pendingCompanies: number;
  citiesBreakdown: { city: string; vehicles: number }[];
};
