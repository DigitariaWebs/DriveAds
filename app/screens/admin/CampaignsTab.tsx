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
  active: { variant: 'success', label: 'EN COURS' },
  available: { variant: 'navy', label: 'DISPONIBLE' },
  completed: { variant: 'neutral', label: 'TERMINÉE' },
  upcoming: { variant: 'info', label: 'À VENIR' },
};

export function AdminCampaignsTab({
  campaigns,
  onLogout,
  onCreateCampaign,
  onAssignCampaign,
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
          marginTop: 12,
          marginBottom: 18,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: FONTS.medium,
              fontSize: 13,
              color: COLORS.gray500,
            }}
          >
            Gestion
          </Text>
          <Text
            style={{
              fontFamily: FONTS.black,
              fontSize: 26,
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
            paddingHorizontal: 16,
            height: 44,
            borderRadius: RADIUS.full,
            backgroundColor: COLORS.navy,
          }}
        >
          <Ionicons name="add" size={18} color={COLORS.white} />
          <Text
            style={{
              fontFamily: FONTS.bold,
              fontSize: 13,
              color: COLORS.white,
              marginLeft: 5,
            }}
          >
            Créer
          </Text>
        </TouchableOpacity>
      </View>

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
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: 120,
          gap: 12,
        }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <AdminCampaignCard
            campaign={item}
            onAssign={() => onAssignCampaign(item)}
          />
        )}
      />
    </View>
  );
}

function AdminCampaignCard({
  campaign,
  onAssign,
}: {
  campaign: Campaign;
  onAssign: () => void;
}) {
  const badge = statusToBadge[campaign.status];
  const fillRatio =
    campaign.driversNeeded !== undefined && campaign.driversNeeded > 0
      ? (campaign.driversAssigned ?? 0) / campaign.driversNeeded
      : 0;

  return (
    <Card padding="xl">
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        <BrandLogo domain={campaign.domain} name={campaign.brand} size="lg" />
        <View style={{ flex: 1, marginLeft: 14 }}>
          <Text
            style={{
              fontFamily: FONTS.black,
              fontSize: 16,
              color: COLORS.navy,
              letterSpacing: -0.2,
            }}
          >
            {campaign.brand}
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
              size={11}
              color={COLORS.gray500}
            />
            <Text
              style={{
                fontFamily: FONTS.medium,
                fontSize: 11,
                color: COLORS.gray500,
                marginLeft: 3,
              }}
            >
              {campaign.city}
            </Text>
          </View>
          <View style={{ marginTop: 8 }}>
            <Badge variant={badge.variant}>{badge.label}</Badge>
          </View>
        </View>
      </View>

      {/* Stats grid */}
      <View style={{ flexDirection: 'row', gap: 8, marginTop: 16 }}>
        <AdminMetric icon="cash-outline" label="Budget" value={`${campaign.reward} €`} />
        <AdminMetric
          icon="calendar-outline"
          label="Durée"
          value={`${campaign.durationDays} j`}
        />
        <AdminMetric
          icon="people-outline"
          label="Chauffeurs"
          value={`${campaign.driversAssigned ?? 0}/${campaign.driversNeeded ?? 0}`}
        />
      </View>

      {/* Assignment progress */}
      {campaign.driversNeeded !== undefined && (
        <View style={{ marginTop: 14 }}>
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
                fontSize: 11,
                color: COLORS.gray500,
              }}
            >
              Assignation
            </Text>
            <Text
              style={{
                fontFamily: FONTS.black,
                fontSize: 11,
                color: COLORS.navy,
              }}
            >
              {Math.round(fillRatio * 100)}%
            </Text>
          </View>
          <View
            style={{
              height: 7,
              backgroundColor: COLORS.gray100,
              borderRadius: RADIUS.full,
              overflow: 'hidden',
            }}
          >
            <View
              style={{
                width: `${fillRatio * 100}%`,
                height: '100%',
                backgroundColor:
                  fillRatio >= 1 ? COLORS.success : COLORS.navy,
                borderRadius: RADIUS.full,
              }}
            />
          </View>
        </View>
      )}

      {/* Actions */}
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
        <View style={{ flex: 1 }}>
          <Button
            variant="outline"
            size="sm"
            fullWidth
            icon="eye-outline"
            iconPosition="left"
          >
            Détails
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

function AdminMetric({
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
        padding: 10,
      }}
    >
      <View
        style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 3 }}
      >
        <Ionicons name={icon} size={11} color={COLORS.navy} />
        <Text
          style={{
            fontFamily: FONTS.medium,
            fontSize: 10,
            color: COLORS.gray500,
            marginLeft: 3,
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
