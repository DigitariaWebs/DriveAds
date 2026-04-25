import { Tabs } from 'expo-router';
import GlassTabBar from '../../components/GlassTabBar';

const ADVERTISER_ICONS = {
  home: { icon: 'home' as const, label: 'Accueil' },
  campaigns: { icon: 'list' as const, label: 'Campagnes' },
  stats: { icon: 'bar-chart-2' as const, label: 'Stats' },
  notifications: { icon: 'bell' as const, label: 'Notifications' },
  profile: { icon: 'briefcase' as const, label: 'Compte' },
};

export default function AdvertiserLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <GlassTabBar {...props} iconMap={ADVERTISER_ICONS} />}
    >
      <Tabs.Screen name="home" options={{ title: 'Accueil' }} />
      <Tabs.Screen name="campaigns" options={{ title: 'Campagnes' }} />
      <Tabs.Screen name="stats" options={{ title: 'Stats' }} />
      <Tabs.Screen name="notifications" options={{ title: 'Notifications' }} />
      <Tabs.Screen name="profile" options={{ title: 'Compte' }} />
    </Tabs>
  );
}
