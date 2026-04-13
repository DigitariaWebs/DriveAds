import { Tabs } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { tabBarScreenOptions } from '../../constants/TabBarStyle';
import { useData } from '../../context/DataContext';
import TabIcon from '../../components/TabIcon';

export default function DriverLayout() {
  const { unreadCount } = useData();

  return (
    <Tabs screenOptions={tabBarScreenOptions}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="home" />
          ),
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
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="bell" />
          ),
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
          tabBarBadgeStyle: { backgroundColor: Colors.danger, fontSize: 9, fontWeight: '700' },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="user" />
          ),
        }}
      />
    </Tabs>
  );
}
