import { Tabs } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { useData } from '../../context/DataContext';
import GlassTabBar from '../../components/GlassTabBar';

const DRIVER_ICONS = {
  home: { icon: 'home' as const, label: 'Accueil' },
  campaigns: { icon: 'volume-2' as const, label: 'Campagnes' },
  notifications: { icon: 'bell' as const, label: 'Notifications' },
  profile: { icon: 'user' as const, label: 'Profil' },
};

export default function DriverLayout() {
  const { unreadCount } = useData();

  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <GlassTabBar {...props} iconMap={DRIVER_ICONS} />}
    >
      <Tabs.Screen name="home" options={{ title: 'Accueil' }} />
      <Tabs.Screen name="campaigns" options={{ title: 'Campagnes' }} />
      <Tabs.Screen name="campaign/[id]" options={{ href: null }} />
      <Tabs.Screen name="my-campaigns" options={{ href: null }} />
      <Tabs.Screen name="my-cars" options={{ href: null }} />
      <Tabs.Screen name="documents" options={{ href: null }} />
      <Tabs.Screen name="payments" options={{ href: null }} />
      <Tabs.Screen name="settings" options={{ href: null }} />
      <Tabs.Screen name="support" options={{ href: null }} />
      <Tabs.Screen name="withdraw" options={{ href: null }} />
      <Tabs.Screen name="statement" options={{ href: null }} />
      <Tabs.Screen name="stats" options={{ href: null }} />
      <Tabs.Screen name="transaction-detail" options={{ href: null }} />
      <Tabs.Screen name="edit-profile" options={{ href: null }} />
      <Tabs.Screen name="change-password" options={{ href: null }} />
      <Tabs.Screen name="notification-email" options={{ href: null }} />
      <Tabs.Screen name="terms" options={{ href: null }} />
      <Tabs.Screen name="privacy" options={{ href: null }} />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notifications',
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: Colors.danger,
            fontSize: 9,
            fontWeight: '700',
          },
        }}
      />
      <Tabs.Screen name="profile" options={{ title: 'Profil' }} />
    </Tabs>
  );
}
