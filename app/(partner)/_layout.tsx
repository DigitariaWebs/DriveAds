import { Tabs } from 'expo-router';
import GlassTabBar from '../../components/GlassTabBar';

const PARTNER_ICONS = {
  home: { icon: 'home' as const, label: 'Accueil' },
  stock: { icon: 'droplet' as const, label: 'Stock' },
  ads: { icon: 'monitor' as const, label: 'Pubs' },
  revenue: { icon: 'bar-chart-2' as const, label: 'Revenus' },
  notifications: { icon: 'bell' as const, label: 'Alertes' },
};

export default function PartnerLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <GlassTabBar {...props} iconMap={PARTNER_ICONS} />}
    >
      <Tabs.Screen name="home" options={{ title: 'Accueil' }} />
      <Tabs.Screen name="stock" options={{ title: 'Stock' }} />
      <Tabs.Screen name="ads" options={{ title: 'Pubs' }} />
      <Tabs.Screen name="revenue" options={{ title: 'Revenus' }} />
      <Tabs.Screen name="notifications" options={{ title: 'Alertes' }} />
      <Tabs.Screen name="profile" options={{ href: null }} />
    </Tabs>
  );
}
