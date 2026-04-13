import { Tabs } from 'expo-router';
import { tabBarScreenOptions } from '../../constants/TabBarStyle';
import TabIcon from '../../components/TabIcon';

export default function CompanyLayout() {
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
        name="request"
        options={{
          title: 'Nouvelle',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="plus-circle" />
          ),
        }}
      />
      <Tabs.Screen
        name="my-campaigns"
        options={{
          title: 'Campagnes',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="list" />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notifications',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="bell" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="briefcase" />
          ),
        }}
      />
    </Tabs>
  );
}
