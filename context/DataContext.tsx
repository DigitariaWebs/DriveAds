import React, { createContext, useContext, useState, ReactNode } from 'react';
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
  mockCampaigns,
  mockNotifications,
  mockTrackingEvents,
  mockDriverStats,
} from '../mocks/data';

type DataContextType = {
  drivers: Driver[];
  campaigns: Campaign[];
  notifications: NotificationItem[];
  trackingEvents: TrackingEvent[];
  driverStats: DriverStats;
  // Driver actions
  addDriver: (driver: Driver) => void;
  updateDriverStatus: (id: string, status: ValidationStatus) => void;
  // Campaign actions
  addCampaign: (campaign: Campaign) => void;
  assignDriverToCampaign: (campaignId: string, driverIds: string[]) => void;
  acceptCampaign: (campaignId: string, driverId: string) => void;
  // Notification actions
  markNotificationRead: (id: string) => void;
  deleteNotification: (id: string) => void;
  archiveNotification: (id: string) => void;
  markAllNotificationsRead: () => void;
  unreadCount: number;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [drivers, setDrivers] = useState<Driver[]>(mockDrivers);
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(mockNotifications);
  const [trackingEvents] = useState<TrackingEvent[]>(mockTrackingEvents);
  const [driverStats] = useState<DriverStats>(mockDriverStats);

  const addDriver = (driver: Driver) => {
    setDrivers((prev) => [...prev, driver]);
  };

  const updateDriverStatus = (id: string, status: ValidationStatus) => {
    setDrivers((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status } : d))
    );
  };

  const addCampaign = (campaign: Campaign) => {
    setCampaigns((prev) => [...prev, campaign]);
  };

  const assignDriverToCampaign = (campaignId: string, driverIds: string[]) => {
    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === campaignId
          ? {
              ...c,
              assignedDriverIds: [...c.assignedDriverIds, ...driverIds],
              driversAssigned: c.driversAssigned + driverIds.length,
            }
          : c
      )
    );
  };

  const acceptCampaign = (campaignId: string, driverId: string) => {
    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === campaignId
          ? {
              ...c,
              assignedDriverIds: [...c.assignedDriverIds, driverId],
              driversAssigned: c.driversAssigned + 1,
            }
          : c
      )
    );
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const archiveNotification = (id: string) => {
    // Archive = mark as read + remove from the active list
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <DataContext.Provider
      value={{
        drivers,
        campaigns,
        notifications,
        trackingEvents,
        driverStats,
        addDriver,
        updateDriverStatus,
        addCampaign,
        assignDriverToCampaign,
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
