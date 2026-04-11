import React, { useState } from 'react';
import { View } from 'react-native';
import { Screen } from '../../components/Screen';
import { BottomTabBar, TabDef } from '../../components/BottomTabBar';
import { HomeTab } from './driver/HomeTab';
import { CampaignsTab } from './driver/CampaignsTab';
import { NotificationsTab } from './driver/NotificationsTab';
import { ProfileTab } from './driver/ProfileTab';
import { notifications } from '../../mocks/data';
import { COLORS } from '../../constants/theme';

interface DashboardScreenProps {
  onLogout?: () => void;
}

type TabKey = 'home' | 'campaigns' | 'notifications' | 'profile';

export function DashboardScreen({ onLogout }: DashboardScreenProps) {
  const [active, setActive] = useState<TabKey>('home');
  const unreadCount = notifications.filter((n) => n.unread).length;

  const tabs: TabDef<TabKey>[] = [
    { key: 'home', icon: 'home', label: 'Accueil' },
    { key: 'campaigns', icon: 'megaphone', label: 'Campagnes' },
    { key: 'notifications', icon: 'notifications', label: 'Notifs', badge: unreadCount },
    { key: 'profile', icon: 'person', label: 'Profil' },
  ];

  const handleLogout = () => onLogout?.();

  return (
    <Screen backgroundColor={COLORS.navyTint}>
      <View style={{ flex: 1 }}>
        {active === 'home' && (
          <HomeTab
            onLogout={handleLogout}
            onOpenNotifications={() => setActive('notifications')}
            onOpenCampaigns={() => setActive('campaigns')}
          />
        )}
        {active === 'campaigns' && (
          <CampaignsTab
            onLogout={handleLogout}
            onOpenNotifications={() => setActive('notifications')}
          />
        )}
        {active === 'notifications' && (
          <NotificationsTab onLogout={handleLogout} />
        )}
        {active === 'profile' && <ProfileTab onLogout={handleLogout} />}
      </View>

      <BottomTabBar tabs={tabs} activeKey={active} onChange={setActive} />
    </Screen>
  );
}
