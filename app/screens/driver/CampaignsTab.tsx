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
import { IconCircle } from '../../../components/IconCircle';
import { BrandLogo } from '../../../components/BrandLogo';
import { Button } from '../../../components/Button';
import { campaigns, Campaign, CampaignStatus } from '../../../mocks/data';
import { COLORS, FONTS, RADIUS } from '../../../constants/theme';

interface CampaignsTabProps {
  onLogout: () => void;
  onOpenNotifications: () => void;
}

type Filter = 'all' | 'available' | 'active' | 'completed';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'Toutes' },
  { key: 'available', label: 'Disponibles' },
  { key: 'active', label: 'Actives' },
  { key: 'completed', label: 'Terminées' },
];

const statusToBadge: Record<
  CampaignStatus,
  { variant: 'success' | 'navy' | 'neutral' | 'info'; label: string }
> = {
  active: { variant: 'success', label: 'EN COURS' },
  available: { variant: 'navy', label: 'DISPONIBLE' },
  completed: { variant: 'neutral', label: 'TERMINÉE' },
  upcoming: { variant: 'info', label: 'À VENIR' },
};

export function CampaignsTab({ onLogout, onOpenNotifications }: CampaignsTabProps) {
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = campaigns.filter((c) =>
    filter === 'all' ? true : c.status === filter
  );

  return (
    <View style={{ flex: 1 }}>
      <ScreenHeader
        subtitle="Découvrez"
        title="Campagnes"
        onNotificationPress={onOpenNotifications}
        onLogoutPress={onLogout}
      />

      {/* Filters */}
      <View style={{ paddingLeft: 24, marginBottom: 16 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 24, gap: 8 }}
        >
          {FILTERS.map((f) => {
            const active = filter === f.key;
            return (
              <TouchableOpacity
                key={f.key}
                onPress={() => setFilter(f.key)}
                activeOpacity={0.85}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 9,
                  borderRadius: RADIUS.full,
                  backgroundColor: active ? COLORS.navy : COLORS.white,
                  borderWidth: 1,
                  borderColor: active ? COLORS.navy : COLORS.gray200,
                }}
              >
                <Text
                  style={{
                    fontFamily: active ? FONTS.bold : FONTS.medium,
                    fontSize: 13,
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
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 120, gap: 14 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <CampaignDetailCard campaign={item} />}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 60 }}>
            <IconCircle icon="search-outline" size="lg" variant="soft" />
            <Text
              style={{
                fontFamily: FONTS.bold,
                fontSize: 15,
                color: COLORS.navy,
                marginTop: 14,
              }}
            >
              Aucune campagne
            </Text>
            <Text
              style={{
                fontFamily: FONTS.regular,
                fontSize: 13,
                color: COLORS.gray500,
                marginTop: 4,
              }}
            >
              Revenez plus tard
            </Text>
          </View>
        }
      />
    </View>
  );
}

function CampaignDetailCard({ campaign }: { campaign: Campaign }) {
  const badge = statusToBadge[campaign.status];
  const isAvailable = campaign.status === 'available';

  return (
    <Card padding="xl">
      {/* Header row */}
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        <BrandLogo domain={campaign.domain} name={campaign.brand} size="lg" />
        <View style={{ flex: 1, marginLeft: 14 }}>
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
                fontSize: 17,
                color: COLORS.navy,
                letterSpacing: -0.2,
                flex: 1,
              }}
              numberOfLines={1}
            >
              {campaign.brand}
            </Text>
          </View>
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
              {campaign.city} · {campaign.zones.length} zones
            </Text>
          </View>
          <View style={{ marginTop: 8 }}>
            <Badge variant={badge.variant}>{badge.label}</Badge>
          </View>
        </View>
      </View>

      {/* Description */}
      <Text
        style={{
          fontFamily: FONTS.regular,
          fontSize: 13,
          lineHeight: 19,
          color: COLORS.gray600,
          marginTop: 14,
        }}
      >
        {campaign.description}
      </Text>

      {/* Metrics */}
      <View
        style={{
          flexDirection: 'row',
          gap: 8,
          marginTop: 14,
        }}
      >
        <MetricBlock
          icon="calendar-outline"
          label="Dates"
          value={`${campaign.startDate} → ${campaign.endDate}`}
        />
      </View>
      <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
        <MetricBlock
          icon="cash-outline"
          label="Gains"
          value={`${campaign.reward} €`}
          flex={1}
        />
        <MetricBlock
          icon="time-outline"
          label="Durée"
          value={`${campaign.durationDays} jours`}
          flex={1}
        />
        {campaign.driversNeeded !== undefined && (
          <MetricBlock
            icon="people-outline"
            label="Chauffeurs"
            value={`${campaign.driversAssigned}/${campaign.driversNeeded}`}
            flex={1}
          />
        )}
      </View>

      {/* Progress if active */}
      {campaign.status === 'active' && campaign.progress !== undefined && (
        <View style={{ marginTop: 16 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 6,
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
              {Math.round(campaign.progress * 100)}%
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
                width: `${campaign.progress * 100}%`,
                height: '100%',
                backgroundColor: COLORS.navy,
                borderRadius: RADIUS.full,
              }}
            />
          </View>
        </View>
      )}

      {/* Actions */}
      {isAvailable && (
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 18 }}>
          <View style={{ flex: 1 }}>
            <Button variant="outline" size="md" fullWidth>
              Refuser
            </Button>
          </View>
          <View style={{ flex: 1 }}>
            <Button variant="primary" size="md" fullWidth icon="checkmark">
              Accepter
            </Button>
          </View>
        </View>
      )}
    </Card>
  );
}

function MetricBlock({
  icon,
  label,
  value,
  flex,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  flex?: number;
}) {
  return (
    <View
      style={{
        flex,
        backgroundColor: COLORS.navySoft,
        borderRadius: RADIUS.md,
        padding: 10,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 3 }}>
        <Ionicons name={icon} size={12} color={COLORS.navy} />
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
          fontFamily: FONTS.bold,
          fontSize: 12,
          color: COLORS.navy,
        }}
      >
        {value}
      </Text>
    </View>
  );
}
