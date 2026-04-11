import React, { useState } from 'react';
import { View } from 'react-native';
import { Screen } from '../../components/Screen';
import { BottomTabBar, TabDef } from '../../components/BottomTabBar';
import { CreateCampaignModal } from '../../components/modals/CreateCampaignModal';
import { AssignDriversModal } from '../../components/modals/AssignDriversModal';
import { AdminHomeTab } from './admin/HomeTab';
import { AdminDriversTab } from './admin/DriversTab';
import { AdminCampaignsTab } from './admin/CampaignsTab';
import { AdminCompaniesTab } from './admin/CompaniesTab';
import {
  drivers,
  companies,
  initialCampaigns,
  Campaign,
} from '../../mocks/data';
import { COLORS } from '../../constants/theme';

interface AdminDashboardScreenProps {
  onLogout?: () => void;
}

type TabKey = 'home' | 'drivers' | 'campaigns' | 'companies';

export function AdminDashboardScreen({ onLogout }: AdminDashboardScreenProps) {
  const [active, setActive] = useState<TabKey>('home');
  const [campaignList, setCampaignList] = useState<Campaign[]>(initialCampaigns);
  const [createVisible, setCreateVisible] = useState(false);
  const [assignCampaign, setAssignCampaign] = useState<Campaign | null>(null);

  const pendingDrivers = drivers.filter((d) => d.status === 'pending').length;
  const pendingCompanies = companies.filter((c) => c.status === 'pending').length;

  const tabs: TabDef<TabKey>[] = [
    { key: 'home', icon: 'grid', label: 'Accueil' },
    { key: 'drivers', icon: 'people', label: 'Chauffeurs', badge: pendingDrivers },
    { key: 'campaigns', icon: 'megaphone', label: 'Campagnes' },
    {
      key: 'companies',
      icon: 'business',
      label: 'Entreprises',
      badge: pendingCompanies,
    },
  ];

  const handleLogout = () => onLogout?.();

  const handleCreateCampaign = (
    data: Omit<
      Campaign,
      'id' | 'status' | 'icon' | 'assignedDriverIds' | 'driversAssigned'
    >
  ) => {
    const newCampaign: Campaign = {
      ...data,
      id: `c${Date.now()}`,
      status: 'available',
      icon: 'pricetag',
      assignedDriverIds: [],
      driversAssigned: 0,
    };
    setCampaignList((prev) => [newCampaign, ...prev]);
  };

  const handleAssignDrivers = (campaignId: string, driverIds: string[]) => {
    setCampaignList((prev) =>
      prev.map((c) =>
        c.id === campaignId
          ? {
              ...c,
              assignedDriverIds: driverIds,
              driversAssigned: driverIds.length,
            }
          : c
      )
    );
  };

  return (
    <Screen backgroundColor={COLORS.navyTint}>
      <View style={{ flex: 1 }}>
        {active === 'home' && (
          <AdminHomeTab
            campaigns={campaignList}
            onLogout={handleLogout}
            onOpenDrivers={() => setActive('drivers')}
            onOpenCompanies={() => setActive('companies')}
            onOpenCampaigns={() => setActive('campaigns')}
            onCreateCampaign={() => setCreateVisible(true)}
          />
        )}
        {active === 'drivers' && <AdminDriversTab onLogout={handleLogout} />}
        {active === 'campaigns' && (
          <AdminCampaignsTab
            campaigns={campaignList}
            onLogout={handleLogout}
            onCreateCampaign={() => setCreateVisible(true)}
            onAssignCampaign={(c) => setAssignCampaign(c)}
          />
        )}
        {active === 'companies' && <AdminCompaniesTab onLogout={handleLogout} />}
      </View>

      <BottomTabBar tabs={tabs} activeKey={active} onChange={setActive} />

      <CreateCampaignModal
        visible={createVisible}
        onClose={() => setCreateVisible(false)}
        onCreate={handleCreateCampaign}
      />

      <AssignDriversModal
        visible={assignCampaign !== null}
        campaign={assignCampaign}
        drivers={drivers}
        onClose={() => setAssignCampaign(null)}
        onConfirm={handleAssignDrivers}
      />
    </Screen>
  );
}
