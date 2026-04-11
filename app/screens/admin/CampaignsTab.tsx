import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../../../components/ScreenHeader';
import { Card } from '../../../components/Card';
import { Badge } from '../../../components/Badge';
import { BrandLogo } from '../../../components/BrandLogo';
import { Button } from '../../../components/Button';
import { Campaign, CampaignStatus } from '../../../mocks/data';
import { COLORS, FONTS, RADIUS } from '../../../constants/theme';

interface AdminCampaignsTabProps {
  campaigns: Campaign[];
  onLogout: () => void;
  onCreateCampaign: () => void;
  onAssignCampaign: (campaign: Campaign) => void;
  onTrackCampaign: (campaign: Campaign) => void;
}

type Filter = 'all' | 'active' | 'available' | 'completed';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'Toutes' },
  { key: 'active', label: 'Actives' },
  { key: 'available', label: 'Disponibles' },
  { key: 'completed', label: 'Terminées' },
];

const statusToBadge: Record<
  CampaignStatus,
  { variant: 'success' | 'navy' | 'neutral' | 'info'; label: string }
> = {
  active: { variant: 'success', label: 'ACTIVE' },
  available: { variant: 'navy', label: 'DISPO' },
  completed: { variant: 'neutral', label: 'TERMINÉE' },
  upcoming: { variant: 'info', label: 'À VENIR' },
};

export function AdminCampaignsTab({
  campaigns,
  onLogout,
  onCreateCampaign,
  onAssignCampaign,
  onTrackCampaign,
}: AdminCampaignsTabProps) {
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = campaigns.filter((c) =>
    filter === 'all' ? true : c.status === filter
  );

  return (
    <View style={{ flex: 1 }}>
      <ScreenHeader showLogo onLogoutPress={onLogout} />

      {/* Title row with inline Créer button */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 24,
          marginTop: 10,
          marginBottom: 14,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: FONTS.medium,
              fontSize: 12,
              color: COLORS.gray500,
            }}
          >
            Gestion
          </Text>
          <Text
            style={{
              fontFamily: FONTS.black,
              fontSize: 24,
              color: COLORS.navy,
              marginTop: 2,
              letterSpacing: -0.4,
            }}
          >
            Campagnes
          </Text>
        </View>
        <TouchableOpacity
          onPress={onCreateCampaign}
          activeOpacity={0.85}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 14,
            height: 38,
            borderRadius: RADIUS.full,
            backgroundColor: COLORS.navy,
          }}
        >
          <Ionicons name="add" size={16} color={COLORS.white} />
          <Text
            style={{
              fontFamily: FONTS.bold,
              fontSize: 12,
              color: COLORS.white,
              marginLeft: 4,
            }}
          >
            Créer
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <View style={{ paddingLeft: 24, marginBottom: 12 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 24, gap: 6 }}
        >
          {FILTERS.map((f) => {
            const active = filter === f.key;
            return (
              <TouchableOpacity
                key={f.key}
                onPress={() => setFilter(f.key)}
                activeOpacity={0.85}
                style={{
                  paddingHorizontal: 13,
                  paddingVertical: 7,
                  borderRadius: RADIUS.full,
                  backgroundColor: active ? COLORS.navy : COLORS.white,
                  borderWidth: 1,
                  borderColor: active ? COLORS.navy : COLORS.gray200,
                }}
              >
                <Text
                  style={{
                    fontFamily: active ? FONTS.bold : FONTS.medium,
                    fontSize: 12,
                    color: active ? COLORS.white : COLORS.gray600,
                  }}
                >
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: 120,
          gap: 10,
        }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <AdminCampaignCard
            campaign={item}
            onAssign={() => onAssignCampaign(item)}
            onTrack={() => onTrackCampaign(item)}
          />
        )}
      />
    </View>
  );
}

function AdminCampaignCard({
  campaign,
  onAssign,
  onTrack,
}: {
  campaign: Campaign;
  onAssign: () => void;
  onTrack: () => void;
}) {
  const badge = statusToBadge[campaign.status];
  const fillRatio =
    campaign.driversNeeded !== undefined && campaign.driversNeeded > 0
      ? (campaign.driversAssigned ?? 0) / campaign.driversNeeded
      : 0;
  const progress = campaign.progress ?? 0;
  const isActive = campaign.status === 'active';

  return (
    <Card padding="lg">
      {/* Header row — compact */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <BrandLogo domain={campaign.domain} name={campaign.brand} size="md" />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Text
              style={{
                fontFamily: FONTS.black,
                fontSize: 14,
                color: COLORS.navy,
                letterSpacing: -0.2,
                flex: 1,
                marginRight: 6,
              }}
              numberOfLines={1}
            >
              {campaign.brand}
            </Text>
            <Badge variant={badge.variant}>{badge.label}</Badge>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 2,
            }}
          >
            <Ionicons
              name="location-outline"
              size={10}
              color={COLORS.gray500}
            />
            <Text
              style={{
                fontFamily: FONTS.medium,
                fontSize: 10,
                color: COLORS.gray500,
                marginLeft: 2,
              }}
            >
              {campaign.city}
            </Text>
            <Text
              style={{
                marginHorizontal: 4,
                color: COLORS.gray300,
                fontSize: 10,
              }}
            >
              •
            </Text>
            <Ionicons
              name="cash-outline"
              size={10}
              color={COLORS.gray500}
            />
            <Text
              style={{
                fontFamily: FONTS.bold,
                fontSize: 10,
                color: COLORS.navy,
                marginLeft: 2,
              }}
            >
              {campaign.reward} €
            </Text>
            <Text
              style={{
                marginHorizontal: 4,
                color: COLORS.gray300,
                fontSize: 10,
              }}
            >
              •
            </Text>
            <Ionicons
              name="calendar-outline"
              size={10}
              color={COLORS.gray500}
            />
            <Text
              style={{
                fontFamily: FONTS.medium,
                fontSize: 10,
                color: COLORS.gray500,
                marginLeft: 2,
              }}
            >
              {campaign.durationDays}j
            </Text>
          </View>
        </View>
      </View>

      {/* Progress section */}
      <View style={{ marginTop: 10 }}>
        {/* Drivers assignment */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 4,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="people-outline" size={11} color={COLORS.gray500} />
            <Text
              style={{
                fontFamily: FONTS.semibold,
                fontSize: 10,
                color: COLORS.gray500,
                marginLeft: 3,
              }}
            >
              Chauffeurs
            </Text>
          </View>
          <Text
            style={{
              fontFamily: FONTS.black,
              fontSize: 10,
              color: COLORS.navy,
            }}
          >
            {campaign.driversAssigned ?? 0} / {campaign.driversNeeded ?? 0}
          </Text>
        </View>
        <View
          style={{
            height: 5,
            backgroundColor: COLORS.gray100,
            borderRadius: RADIUS.full,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              width: `${fillRatio * 100}%`,
              height: '100%',
              backgroundColor: fillRatio >= 1 ? COLORS.success : COLORS.navy,
            }}
          />
        </View>

        {/* Active progress (km) */}
        {isActive && (
          <>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 8,
                marginBottom: 4,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons
                  name="speedometer-outline"
                  size={11}
                  color={COLORS.gray500}
                />
                <Text
                  style={{
                    fontFamily: FONTS.semibold,
                    fontSize: 10,
                    color: COLORS.gray500,
                    marginLeft: 3,
                  }}
                >
                  Km parcourus
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: FONTS.black,
                  fontSize: 10,
                  color: COLORS.navy,
                }}
              >
                {campaign.kmDone ?? 0} / {campaign.kmTotal ?? 0} km ·{' '}
                {Math.round(progress * 100)}%
              </Text>
            </View>
            <View
              style={{
                height: 5,
                backgroundColor: COLORS.gray100,
                borderRadius: RADIUS.full,
                overflow: 'hidden',
              }}
            >
              <View
                style={{
                  width: `${progress * 100}%`,
                  height: '100%',
                  backgroundColor: COLORS.success,
                }}
              />
            </View>
          </>
        )}
      </View>

      {/* Actions */}
      <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
        <View style={{ flex: 1 }}>
          <Button
            variant="outline"
            size="sm"
            fullWidth
            icon="navigate-outline"
            iconPosition="left"
            onPress={onTrack}
          >
            Suivi
          </Button>
        </View>
        {campaign.status !== 'completed' && (
          <View style={{ flex: 1 }}>
            <Button
              variant="primary"
              size="sm"
              fullWidth
              icon="person-add"
              iconPosition="left"
              onPress={onAssign}
            >
              Assigner
            </Button>
          </View>
        )}
      </View>
    </Card>
  );
}
