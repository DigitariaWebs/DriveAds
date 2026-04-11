import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../../../components/ScreenHeader';
import { Card } from '../../../components/Card';
import { StatCard } from '../../../components/StatCard';
import { IconCircle } from '../../../components/IconCircle';
import { Badge } from '../../../components/Badge';
import { adminStats, drivers, companies, Campaign } from '../../../mocks/data';
import { COLORS, FONTS, RADIUS, SHADOWS } from '../../../constants/theme';

interface AdminHomeTabProps {
  campaigns: Campaign[];
  onLogout: () => void;
  onOpenDrivers: () => void;
  onOpenCompanies: () => void;
  onOpenCampaigns: () => void;
  onCreateCampaign: () => void;
}

export function AdminHomeTab({
  campaigns,
  onLogout,
  onOpenDrivers,
  onOpenCompanies,
  onOpenCampaigns,
  onCreateCampaign,
}: AdminHomeTabProps) {
  const pendingDrivers = drivers.filter((d) => d.status === 'pending').slice(0, 2);
  const pendingCompanies = companies
    .filter((c) => c.status === 'pending')
    .slice(0, 1);
  const pendingItems = [
    ...pendingDrivers.map((d) => ({
      id: `d-${d.id}`,
      type: 'Chauffeur',
      name: d.name,
      city: d.city,
      icon: 'person' as const,
    })),
    ...pendingCompanies.map((c) => ({
      id: `c-${c.id}`,
      type: 'Entreprise',
      name: c.name,
      city: c.city,
      icon: 'business' as const,
    })),
  ];

  const activeCount = campaigns.filter((c) => c.status === 'active').length;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      <ScreenHeader
        subtitle="Panneau administrateur"
        title="Tableau de bord"
        onLogoutPress={onLogout}
        rightAction={
          <View>
            <Badge variant="navy" icon="shield-checkmark">
              ADMIN
            </Badge>
          </View>
        }
      />

      {/* Revenue hero */}
      <View style={{ paddingHorizontal: 24, marginBottom: 20 }}>
        <Card variant="navy" padding="xxl">
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontFamily: FONTS.medium,
                  fontSize: 11,
                  color: 'rgba(255,255,255,0.7)',
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                }}
              >
                Revenu ce mois
              </Text>
              <Text
                style={{
                  fontFamily: FONTS.black,
                  fontSize: 38,
                  color: COLORS.white,
                  marginTop: 8,
                  letterSpacing: -1,
                }}
              >
                {(adminStats.monthlyRevenue / 1000).toFixed(1)}k €
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  alignSelf: 'flex-start',
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: RADIUS.full,
                  marginTop: 14,
                }}
              >
                <Ionicons name="trending-up" size={13} color={COLORS.white} />
                <Text
                  style={{
                    fontFamily: FONTS.semibold,
                    fontSize: 11,
                    color: COLORS.white,
                    marginLeft: 5,
                  }}
                >
                  +{adminStats.monthlyGrowth}% vs mois dernier
                </Text>
              </View>
            </View>
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: 'rgba(255,255,255,0.12)',
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.2)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="analytics" size={30} color={COLORS.white} />
            </View>
          </View>
        </Card>
      </View>

      {/* KPI row 1 */}
      <View style={{ paddingHorizontal: 24, marginBottom: 12 }}>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <StatCard
            icon="people"
            label="Chauffeurs actifs"
            value={adminStats.totalDrivers}
            trend={`+${adminStats.newDriversThisWeek}`}
            style={{ flex: 1 }}
          />
          <StatCard
            icon="business"
            label="Entreprises"
            value={adminStats.totalCompanies}
            trend={`+${adminStats.newCompaniesThisWeek}`}
            style={{ flex: 1 }}
          />
        </View>
      </View>

      {/* KPI row 2 */}
      <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <StatCard
            icon="megaphone"
            label="Campagnes actives"
            value={activeCount}
            style={{ flex: 1 }}
          />
          <StatCard
            icon="alert-circle"
            label="En attente"
            value={adminStats.pendingValidations}
            style={{ flex: 1 }}
          />
        </View>
      </View>

      {/* Quick actions */}
      <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
        <Text
          style={{
            fontFamily: FONTS.bold,
            fontSize: 18,
            color: COLORS.navy,
            marginBottom: 14,
          }}
        >
          Actions rapides
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          <QuickAction
            icon="people-outline"
            title="Chauffeurs"
            subtitle="Voir & valider"
            count={drivers.filter((d) => d.status === 'pending').length}
            onPress={onOpenDrivers}
          />
          <QuickAction
            icon="business-outline"
            title="Entreprises"
            subtitle="Voir & valider"
            count={companies.filter((c) => c.status === 'pending').length}
            onPress={onOpenCompanies}
          />
          <QuickAction
            icon="add-circle-outline"
            title="Créer campagne"
            subtitle="Nouvelle annonce"
            onPress={onCreateCampaign}
          />
          <QuickAction
            icon="analytics-outline"
            title="Suivi"
            subtitle={`${activeCount} en cours`}
            onPress={onOpenCampaigns}
          />
        </View>
      </View>

      {/* Pending validations */}
      <View style={{ paddingHorizontal: 24 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 14,
          }}
        >
          <Text
            style={{
              fontFamily: FONTS.bold,
              fontSize: 18,
              color: COLORS.navy,
            }}
          >
            À valider
          </Text>
          <Badge variant="warning">{adminStats.pendingValidations}</Badge>
        </View>

        <View style={{ gap: 10 }}>
          {pendingItems.map((item) => (
            <Card key={item.id} padding="lg">
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <IconCircle icon={item.icon} size="md" variant="soft" />
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <Text
                    style={{
                      fontFamily: FONTS.bold,
                      fontSize: 14,
                      color: COLORS.navy,
                    }}
                  >
                    {item.name}
                  </Text>
                  <Text
                    style={{
                      fontFamily: FONTS.medium,
                      fontSize: 12,
                      color: COLORS.gray500,
                      marginTop: 2,
                    }}
                  >
                    {item.type} · {item.city}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TouchableOpacity
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      backgroundColor: COLORS.successSoft,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Ionicons
                      name="checkmark"
                      size={18}
                      color={COLORS.success}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      backgroundColor: COLORS.dangerSoft,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Ionicons name="close" size={18} color={COLORS.danger} />
                  </TouchableOpacity>
                </View>
              </View>
            </Card>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

function QuickAction({
  icon,
  title,
  subtitle,
  count,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  count?: number;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={{
        width: '47.5%',
        backgroundColor: COLORS.white,
        borderRadius: RADIUS.xl,
        padding: 16,
        borderWidth: 1,
        borderColor: COLORS.gray100,
        ...SHADOWS.sm,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 14,
        }}
      >
        <IconCircle icon={icon} size="md" variant="soft" />
        {count !== undefined && count > 0 && (
          <View
            style={{
              backgroundColor: COLORS.danger,
              borderRadius: RADIUS.full,
              minWidth: 22,
              height: 22,
              paddingHorizontal: 7,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                fontFamily: FONTS.bold,
                fontSize: 11,
                color: COLORS.white,
              }}
            >
              {count}
            </Text>
          </View>
        )}
      </View>
      <Text
        style={{
          fontFamily: FONTS.bold,
          fontSize: 14,
          color: COLORS.navy,
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          fontFamily: FONTS.regular,
          fontSize: 11,
          color: COLORS.gray500,
          marginTop: 2,
        }}
      >
        {subtitle}
      </Text>
    </TouchableOpacity>
  );
}
