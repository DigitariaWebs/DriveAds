import { Tabs } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { tabBarScreenOptions } from '../../constants/TabBarStyle';
import { useData } from '../../context/DataContext';
import TabIcon from '../../components/TabIcon';

export default function AdminLayout() {
  const { drivers, companies } = useData();
  const pendingCount =
    drivers.filter((d) => d.status === 'pending').length +
    companies.filter((c) => c.status === 'pending').length;

  return (
    <Tabs screenOptions={tabBarScreenOptions}>
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="grid" />
          ),
        }}
      />
      <Tabs.Screen
        name="validations"
        options={{
          title: 'Validations',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="check-circle" />
          ),
          tabBarBadge: pendingCount > 0 ? pendingCount : undefined,
          tabBarBadgeStyle: { backgroundColor: Colors.danger, fontSize: 9, fontWeight: '700' },
        }}
      />
      <Tabs.Screen
        name="campaigns"
        options={{
          title: 'Campagnes',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="volume-2" />
          ),
        }}
      />
      <Tabs.Screen
        name="directory"
        options={{
          title: 'Annuaire',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="users" />
          ),
        }}
      />
    </Tabs>
  );
}
