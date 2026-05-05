import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import {
  Driver,
  Campaign,
  NotificationItem,
  TrackingEvent,
  DriverStats,
  ValidationStatus,
} from '../constants/Types';
import {
  mockDrivers,
  mockNotifications,
  mockTrackingEvents,
  mockDriverStats,
} from '../mocks/data';
import { useAuth } from './AuthContext';
import {
  fetchCampaigns,
  fetchMyCampaigns,
  acceptCampaignApi,
} from '../lib/campaigns-api';

type MyCampaigns = {
  active: Campaign[];
  upcoming: Campaign[];
  completed: Campaign[];
};

type DataContextType = {
  drivers: Driver[];
  campaigns: Campaign[];
  campaignsLoading: boolean;
  campaignsError: string | null;
  myCampaigns: MyCampaigns;
  myCampaignsLoading: boolean;
  notifications: NotificationItem[];
  trackingEvents: TrackingEvent[];
  driverStats: DriverStats;
  // Driver actions
  addDriver: (driver: Driver) => void;
  updateDriverStatus: (id: string, status: ValidationStatus) => void;
  // Campaign actions
  refreshCampaigns: () => Promise<void>;
  refreshMyCampaigns: () => Promise<void>;
  acceptCampaign: (campaignId: string) => Promise<Campaign>;
  // Notification actions
  markNotificationRead: (id: string) => void;
  deleteNotification: (id: string) => void;
  archiveNotification: (id: string) => void;
  markAllNotificationsRead: () => void;
  unreadCount: number;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

const EMPTY_MINE: MyCampaigns = { active: [], upcoming: [], completed: [] };

export function DataProvider({ children }: { children: ReactNode }) {
  const { role, status, currentDriver } = useAuth();
  const driverId = currentDriver?.id ?? null;

  const [drivers, setDrivers] = useState<Driver[]>(mockDrivers);
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(mockNotifications);
  const [trackingEvents] = useState<TrackingEvent[]>(mockTrackingEvents);
  const [driverStats] = useState<DriverStats>(mockDriverStats);

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [campaignsLoading, setCampaignsLoading] = useState(false);
  const [campaignsError, setCampaignsError] = useState<string | null>(null);

  const [myCampaigns, setMyCampaigns] = useState<MyCampaigns>(EMPTY_MINE);
  const [myCampaignsLoading, setMyCampaignsLoading] = useState(false);

  const canFetch = role === 'driver' && status === 'validated';

  const refreshCampaigns = useCallback(async () => {
    if (!canFetch) {
      setCampaigns([]);
      return;
    }
    setCampaignsLoading(true);
    setCampaignsError(null);
    try {
      const data = await fetchCampaigns(driverId);
      setCampaigns(data);
    } catch (e: any) {
      setCampaignsError(e?.message ?? 'Erreur de chargement');
    } finally {
      setCampaignsLoading(false);
    }
  }, [canFetch, driverId]);

  const refreshMyCampaigns = useCallback(async () => {
    if (!canFetch) {
      setMyCampaigns(EMPTY_MINE);
      return;
    }
    setMyCampaignsLoading(true);
    try {
      const data = await fetchMyCampaigns(driverId);
      setMyCampaigns(data);
    } catch {
      setMyCampaigns(EMPTY_MINE);
    } finally {
      setMyCampaignsLoading(false);
    }
  }, [canFetch, driverId]);

  // Initial fetch on auth-ready.
  useEffect(() => {
    refreshCampaigns();
    refreshMyCampaigns();
  }, [refreshCampaigns, refreshMyCampaigns]);

  const acceptCampaign = useCallback(
    async (campaignId: string) => {
      const updated = await acceptCampaignApi(campaignId, driverId);
      // Refresh both lists so UI converges immediately.
      await Promise.all([refreshCampaigns(), refreshMyCampaigns()]);
      return updated;
    },
    [driverId, refreshCampaigns, refreshMyCampaigns],
  );

  const addDriver = (driver: Driver) => {
    setDrivers((prev) => [...prev, driver]);
  };

  const updateDriverStatus = (id: string, validation: ValidationStatus) => {
    setDrivers((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: validation } : d)),
    );
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n)),
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const archiveNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <DataContext.Provider
      value={{
        drivers,
        campaigns,
        campaignsLoading,
        campaignsError,
        myCampaigns,
        myCampaignsLoading,
        notifications,
        trackingEvents,
        driverStats,
        addDriver,
        updateDriverStatus,
        refreshCampaigns,
        refreshMyCampaigns,
        acceptCampaign,
        markNotificationRead,
        markAllNotificationsRead,
        deleteNotification,
        archiveNotification,
        unreadCount,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
