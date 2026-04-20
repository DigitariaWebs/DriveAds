import { Tabs } from 'expo-router';
import GlassTabBar from '../../components/GlassTabBar';

const COMPANY_ICONS = {
  home: { icon: 'home' as const, label: 'Accueil' },
  request: { icon: 'plus-circle' as const, label: 'Nouvelle' },
  'my-campaigns': { icon: 'list' as const, label: 'Campagnes' },
  notifications: { icon: 'bell' as const, label: 'Notifications' },
  profile: { icon: 'briefcase' as const, label: 'Profil' },
};

export default function CompanyLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <GlassTabBar {...props} iconMap={COMPANY_ICONS} />}
    >
      <Tabs.Screen name="home" options={{ title: 'Accueil' }} />
      <Tabs.Screen name="request" options={{ title: 'Nouvelle' }} />
      <Tabs.Screen name="my-campaigns" options={{ title: 'Campagnes' }} />
      <Tabs.Screen name="notifications" options={{ title: 'Notifications' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profil' }} />
    </Tabs>
  );
}
