import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../../../components/ScreenHeader';
import { Card } from '../../../components/Card';
import { IconCircle } from '../../../components/IconCircle';
import { driverStats } from '../../../mocks/data';
import { COLORS, FONTS, RADIUS, SHADOWS } from '../../../constants/theme';

interface ProfileTabProps {
  onLogout: () => void;
}

type MenuItem = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  subtitle?: string;
};

const menu: MenuItem[] = [
  { icon: 'car-outline', label: 'Mon véhicule', subtitle: 'Infos & documents' },
  { icon: 'document-text-outline', label: 'Documents', subtitle: 'Permis, carte grise, assurance' },
  { icon: 'card-outline', label: 'Paiements', subtitle: 'IBAN & historique' },
  { icon: 'settings-outline', label: 'Paramètres', subtitle: 'Notifications, langue, compte' },
  { icon: 'help-circle-outline', label: 'Aide', subtitle: 'FAQ & support' },
];

export function ProfileTab({ onLogout }: ProfileTabProps) {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      <ScreenHeader subtitle="Mon compte" title="Profil" />

      {/* Avatar + name card */}
      <View style={{ paddingHorizontal: 24, marginBottom: 20 }}>
        <Card padding="xxl">
          <View style={{ alignItems: 'center' }}>
            <View
              style={{
                width: 90,
                height: 90,
                borderRadius: 45,
                backgroundColor: COLORS.navy,
                alignItems: 'center',
                justifyContent: 'center',
                ...SHADOWS.md,
              }}
            >
              <Text
                style={{
                  fontFamily: FONTS.black,
                  fontSize: 32,
                  color: COLORS.white,
                  letterSpacing: -0.5,
                }}
              >
                {driverStats.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </Text>
            </View>
            <Text
              style={{
                fontFamily: FONTS.black,
                fontSize: 21,
                color: COLORS.navy,
                marginTop: 16,
                letterSpacing: -0.3,
              }}
            >
              {driverStats.name}
            </Text>
            <Text
              style={{
                fontFamily: FONTS.regular,
                fontSize: 13,
                color: COLORS.gray500,
                marginTop: 3,
              }}
            >
              {driverStats.email}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 8,
              }}
            >
              <Ionicons name="location" size={12} color={COLORS.navy} />
              <Text
                style={{
                  fontFamily: FONTS.semibold,
                  fontSize: 12,
                  color: COLORS.navy,
                  marginLeft: 4,
                }}
              >
                {driverStats.city}
              </Text>
              <Text
                style={{
                  fontFamily: FONTS.regular,
                  fontSize: 12,
                  color: COLORS.gray400,
                  marginHorizontal: 8,
                }}
              >
                •
              </Text>
              <Ionicons name="car" size={12} color={COLORS.navy} />
              <Text
                style={{
                  fontFamily: FONTS.semibold,
                  fontSize: 12,
                  color: COLORS.navy,
                  marginLeft: 4,
                }}
              >
                {driverStats.vehicleModel}
              </Text>
            </View>
          </View>

          {/* Stats row */}
          <View
            style={{
              flexDirection: 'row',
              marginTop: 22,
              paddingTop: 18,
              borderTopWidth: 1,
              borderTopColor: COLORS.gray100,
              gap: 8,
            }}
          >
            <ProfileStat label="Gagné" value={`${driverStats.totalEarnings}€`} />
            <Divider />
            <ProfileStat label="Campagnes" value={driverStats.campaignsCompleted} />
            <Divider />
            <ProfileStat label="Note" value={`${driverStats.rating}★`} />
          </View>
        </Card>
      </View>

      {/* Menu */}
      <View style={{ paddingHorizontal: 24, gap: 10 }}>
        {menu.map((item) => (
          <TouchableOpacity key={item.label} activeOpacity={0.85}>
            <Card padding="lg">
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
                    {item.label}
                  </Text>
                  {item.subtitle && (
                    <Text
                      style={{
                        fontFamily: FONTS.regular,
                        fontSize: 12,
                        color: COLORS.gray500,
                        marginTop: 2,
                      }}
                    >
                      {item.subtitle}
                    </Text>
                  )}
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={COLORS.gray300}
                />
              </View>
            </Card>
          </TouchableOpacity>
        ))}

        {/* Logout */}
        <TouchableOpacity onPress={onLogout} activeOpacity={0.85}>
          <Card padding="lg">
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: COLORS.dangerSoft,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="log-out-outline" size={24} color={COLORS.danger} />
              </View>
              <Text
                style={{
                  flex: 1,
                  marginLeft: 14,
                  fontFamily: FONTS.bold,
                  fontSize: 14,
                  color: COLORS.danger,
                }}
              >
                Se déconnecter
              </Text>
            </View>
          </Card>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function ProfileStat({ label, value }: { label: string; value: string | number }) {
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <Text
        style={{
          fontFamily: FONTS.black,
          fontSize: 17,
          color: COLORS.navy,
          letterSpacing: -0.3,
        }}
      >
        {value}
      </Text>
      <Text
        style={{
          fontFamily: FONTS.medium,
          fontSize: 11,
          color: COLORS.gray500,
          marginTop: 2,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

function Divider() {
  return (
    <View
      style={{
        width: 1,
        backgroundColor: COLORS.gray100,
      }}
    />
  );
}
