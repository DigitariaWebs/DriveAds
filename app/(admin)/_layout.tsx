import { Tabs } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { useData } from '../../context/DataContext';
import GlassTabBar from '../../components/GlassTabBar';

const ADMIN_ICONS = {
  dashboard: { icon: 'grid' as const, label: 'Accueil' },
  validations: { icon: 'check-circle' as const, label: 'Validations' },
  campaigns: { icon: 'volume-2' as const, label: 'Campagnes' },
  directory: { icon: 'users' as const, label: 'Annuaire' },
};

export default function AdminLayout() {
  const { drivers, companies } = useData();
  const pendingCount =
    drivers.filter((d) => d.status === 'pending').length +
    companies.filter((c) => c.status === 'pending').length;

  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <GlassTabBar {...props} iconMap={ADMIN_ICONS} />}
    >
      <Tabs.Screen name="dashboard" options={{ title: 'Accueil' }} />
      <Tabs.Screen
        name="validations"
        options={{
          title: 'Validations',
          tabBarBadge: pendingCount > 0 ? pendingCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: Colors.danger,
            fontSize: 9,
            fontWeight: '700',
          },
        }}
      />
      <Tabs.Screen name="campaigns" options={{ title: 'Campagnes' }} />
      <Tabs.Screen name="directory" options={{ title: 'Annuaire' }} />
    </Tabs>
  );
}
