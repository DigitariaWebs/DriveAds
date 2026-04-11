import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../../../components/ScreenHeader';
import { Card } from '../../../components/Card';
import { Badge } from '../../../components/Badge';
import { StatCard } from '../../../components/StatCard';
import { BrandLogo } from '../../../components/BrandLogo';
import { campaigns, driverStats, notifications } from '../../../mocks/data';
import { COLORS, FONTS, RADIUS } from '../../../constants/theme';

interface HomeTabProps {
  onLogout: () => void;
  onOpenNotifications: () => void;
  onOpenCampaigns: () => void;
}

export function HomeTab({
  onLogout,
  onOpenNotifications,
  onOpenCampaigns,
}: HomeTabProps) {
  const activeCampaign = campaigns.find((c) => c.status === 'active');
  const availableCampaigns = campaigns.filter((c) => c.status === 'available');
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      <ScreenHeader
        subtitle="Bonjour"
        title={driverStats.name}
        notificationBadge={unreadCount}
        onNotificationPress={onOpenNotifications}
        onLogoutPress={onLogout}
      />

      {/* Earnings hero */}
      <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
        <Card variant="navy" padding="xl">
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
                  fontSize: 10,
                  color: 'rgba(255,255,255,0.7)',
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                }}
              >
                Gains ce mois
              </Text>
              <Text
                style={{
                  fontFamily: FONTS.black,
                  fontSize: 32,
                  color: COLORS.white,
                  marginTop: 6,
                  letterSpacing: -0.8,
                }}
              >
                {driverStats.monthlyEarnings} €
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
                  +{driverStats.monthlyGrowth}% vs mois dernier
                </Text>
              </View>
            </View>
            <View
              style={{
                width: 52,
                height: 52,
                borderRadius: 26,
                backgroundColor: 'rgba(255,255,255,0.12)',
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.2)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="wallet-outline" size={24} color={COLORS.white} />
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              marginTop: 22,
              paddingTop: 18,
              borderTopWidth: 1,
              borderTopColor: 'rgba(255,255,255,0.1)',
              gap: 16,
            }}
          >
            <HeroStat
              label="Total gagné"
              value={`${driverStats.totalEarnings} €`}
            />
            <HeroStat label="Campagnes" value={driverStats.campaignsCompleted} />
            <HeroStat label="Note" value={`${driverStats.rating}★`} />
          </View>
        </Card>
      </View>

      {/* Quick stats */}
      <View style={{ paddingHorizontal: 20, marginBottom: 18 }}>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <StatCard
            icon="flash"
            label="Campagnes actives"
            value={driverStats.activeCampaigns}
            style={{ flex: 1 }}
          />
          <StatCard
            icon="speedometer"
            label="Km parcourus"
            value={`${(driverStats.totalKm / 1000).toFixed(1)}k`}
            style={{ flex: 1 }}
          />
        </View>
      </View>

      {/* Active campaign */}
      {activeCampaign && (
        <View style={{ paddingHorizontal: 20, marginBottom: 18 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 14,
            }}
          >
            <Text style={{ fontFamily: FONTS.bold, fontSize: 15, color: COLORS.navy }}>
              Campagne en cours
            </Text>
            <Badge variant="success" icon="radio-button-on">
              EN COURS
            </Badge>
          </View>

          <Card padding="xl">
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <BrandLogo domain={activeCampaign.domain} name={activeCampaign.brand} size="lg" />
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text
                  style={{
                    fontFamily: FONTS.black,
                    fontSize: 17,
                    color: COLORS.navy,
                    letterSpacing: -0.2,
                  }}
                >
                  {activeCampaign.brand}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 3,
                  }}
                >
                  <Ionicons
                    name="location-outline"
                    size={12}
                    color={COLORS.gray500}
                  />
                  <Text
                    style={{
                      fontFamily: FONTS.medium,
                      fontSize: 12,
                      color: COLORS.gray500,
                      marginLeft: 3,
                    }}
                  >
                    {activeCampaign.city} · {activeCampaign.zones.length} zones
                  </Text>
                </View>
              </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 10, marginTop: 18 }}>
              <MiniMetric
                icon="time-outline"
                label="Restant"
                value={`${Math.round(activeCampaign.durationDays * (1 - (activeCampaign.progress ?? 0)))} j`}
              />
              <MiniMetric
                icon="cash-outline"
                label="Gains"
                value={`${activeCampaign.reward} €`}
              />
              <MiniMetric
                icon="speedometer-outline"
                label="Km"
                value={`${activeCampaign.kmDone}/${activeCampaign.kmTotal}`}
              />
            </View>

            <View style={{ marginTop: 18 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 8,
                }}
              >
                <Text
                  style={{
                    fontFamily: FONTS.semibold,
                    fontSize: 12,
                    color: COLORS.gray600,
                  }}
                >
                  Progression
                </Text>
                <Text
                  style={{
                    fontFamily: FONTS.black,
                    fontSize: 12,
                    color: COLORS.navy,
                  }}
                >
                  {Math.round((activeCampaign.progress ?? 0) * 100)}%
                </Text>
              </View>
              <View
                style={{
                  height: 8,
                  backgroundColor: COLORS.gray100,
                  borderRadius: RADIUS.full,
                  overflow: 'hidden',
                }}
              >
                <View
                  style={{
                    width: `${(activeCampaign.progress ?? 0) * 100}%`,
                    height: '100%',
                    backgroundColor: COLORS.navy,
                    borderRadius: RADIUS.full,
                  }}
                />
              </View>
            </View>
          </Card>
        </View>
      )}

      {/* Available campaigns preview */}
      <View style={{ paddingHorizontal: 24 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 14,
          }}
        >
          <Text style={{ fontFamily: FONTS.bold, fontSize: 15, color: COLORS.navy }}>
            Nouvelles opportunités
          </Text>
          <TouchableOpacity onPress={onOpenCampaigns}>
            <Text
              style={{
                fontFamily: FONTS.semibold,
                fontSize: 13,
                color: COLORS.navy,
              }}
            >
              Tout voir →
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ gap: 12 }}>
          {availableCampaigns.slice(0, 2).map((c) => (
            <Card key={c.id} padding="lg" onPress={onOpenCampaigns}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <BrandLogo domain={c.domain} name={c.brand} size="lg" />
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <Text
                    style={{
                      fontFamily: FONTS.bold,
                      fontSize: 15,
                      color: COLORS.navy,
                    }}
                  >
                    {c.brand}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 3,
                    }}
                  >
                    <Ionicons
                      name="location-outline"
                      size={12}
                      color={COLORS.gray500}
                    />
                    <Text
                      style={{
                        fontFamily: FONTS.regular,
                        fontSize: 12,
                        color: COLORS.gray500,
                        marginLeft: 3,
                      }}
                    >
                      {c.city}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      gap: 6,
                      marginTop: 8,
                    }}
                  >
                    <Badge variant="navy" icon="cash-outline">
                      {c.reward} €
                    </Badge>
                    <Badge variant="neutral" icon="time-outline">
                      {c.durationDays} j
                    </Badge>
                  </View>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={COLORS.gray300}
                />
              </View>
            </Card>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

function HeroStat({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <View style={{ flex: 1 }}>
      <Text
        style={{
          fontFamily: FONTS.regular,
          fontSize: 10,
          color: 'rgba(255,255,255,0.6)',
          letterSpacing: 0.3,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          fontFamily: FONTS.bold,
          fontSize: 15,
          color: COLORS.white,
          marginTop: 2,
        }}
      >
        {value}
      </Text>
    </View>
  );
}

function MiniMetric({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.navySoft,
        borderRadius: RADIUS.md,
        padding: 12,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
        <Ionicons name={icon} size={13} color={COLORS.navy} />
        <Text
          style={{
            fontFamily: FONTS.medium,
            fontSize: 10,
            color: COLORS.gray500,
            marginLeft: 4,
          }}
        >
          {label}
        </Text>
      </View>
      <Text
        style={{
          fontFamily: FONTS.black,
          fontSize: 14,
          color: COLORS.navy,
        }}
      >
        {value}
      </Text>
    </View>
  );
}
