import React from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BrandLogo } from '../BrandLogo';
import { Badge } from '../Badge';
import { Company, Campaign } from '../../mocks/data';
import { COLORS, FONTS, RADIUS, SHADOWS } from '../../constants/theme';

interface CompanyDetailModalProps {
  visible: boolean;
  company: Company | null;
  campaigns: Campaign[];
  onClose: () => void;
}

export function CompanyDetailModal({
  visible,
  company,
  campaigns,
  onClose,
}: CompanyDetailModalProps) {
  if (!company) return null;

  const companyCampaigns = campaigns.filter((c) => c.domain === company.domain);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.navyTint }}>
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: COLORS.gray100,
            backgroundColor: COLORS.white,
          }}
        >
          <TouchableOpacity
            onPress={onClose}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: COLORS.navySoft,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="close" size={18} color={COLORS.navy} />
          </TouchableOpacity>
          <Text
            style={{
              fontFamily: FONTS.black,
              fontSize: 15,
              color: COLORS.navy,
            }}
          >
            Entreprise
          </Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
        >
          {/* Hero — Brand + Name */}
          <View
            style={{
              backgroundColor: COLORS.white,
              paddingVertical: 24,
              paddingHorizontal: 20,
              alignItems: 'center',
              borderBottomWidth: 1,
              borderBottomColor: COLORS.gray100,
            }}
          >
            <BrandLogo
              domain={company.domain}
              name={company.name}
              size="xl"
            />
            <Text
              style={{
                fontFamily: FONTS.black,
                fontSize: 22,
                color: COLORS.navy,
                marginTop: 14,
                letterSpacing: -0.4,
              }}
            >
              {company.name}
            </Text>
            <Text
              style={{
                fontFamily: FONTS.medium,
                fontSize: 12,
                color: COLORS.gray500,
                marginTop: 2,
              }}
            >
              {company.sector} · {company.city}
            </Text>
            <View style={{ marginTop: 8 }}>
              <Badge
                variant={company.status === 'validated' ? 'success' : 'warning'}
                icon={
                  company.status === 'validated'
                    ? 'checkmark-circle'
                    : 'time-outline'
                }
              >
                {company.status === 'validated' ? 'Validée' : 'En attente'}
              </Badge>
            </View>
          </View>

          {/* Gallery */}
          {company.gallery.length > 0 && (
            <View style={{ marginTop: 16 }}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  paddingHorizontal: 16,
                  gap: 10,
                }}
              >
                {company.gallery.map((uri, idx) => (
                  <View
                    key={idx}
                    style={{
                      width: 180,
                      height: 120,
                      borderRadius: RADIUS.xl,
                      overflow: 'hidden',
                      backgroundColor: COLORS.navySoft,
                      ...SHADOWS.sm,
                    }}
                  >
                    <Image
                      source={{ uri }}
                      style={{ width: '100%', height: '100%' }}
                      resizeMode="cover"
                    />
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Description */}
          <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
            <Text
              style={{
                fontFamily: FONTS.bold,
                fontSize: 14,
                color: COLORS.navy,
                marginBottom: 8,
              }}
            >
              À propos
            </Text>
            <Text
              style={{
                fontFamily: FONTS.regular,
                fontSize: 13,
                lineHeight: 20,
                color: COLORS.gray600,
              }}
            >
              {company.description}
            </Text>
          </View>

          {/* Info grid */}
          <View style={{ paddingHorizontal: 20, marginTop: 18 }}>
            <Text
              style={{
                fontFamily: FONTS.bold,
                fontSize: 14,
                color: COLORS.navy,
                marginBottom: 10,
              }}
            >
              Informations
            </Text>
            <View
              style={{
                backgroundColor: COLORS.white,
                borderRadius: RADIUS.xl,
                padding: 14,
                borderWidth: 1,
                borderColor: COLORS.gray100,
                ...SHADOWS.sm,
              }}
            >
              <InfoRow
                icon="calendar-outline"
                label="Fondée en"
                value={company.founded}
              />
              <Divider />
              <InfoRow
                icon="business-outline"
                label="Siège social"
                value={company.headquarters}
              />
              <Divider />
              <InfoRow
                icon="people-outline"
                label="Employés"
                value={company.employees}
              />
              <Divider />
              <InfoRow
                icon="globe-outline"
                label="Site web"
                value={company.website}
              />
              <Divider />
              <InfoRow
                icon="wallet-outline"
                label="Budget total"
                value={`${(company.budgetTotal / 1000).toFixed(1)}k €`}
              />
            </View>
          </View>

          {/* Campaigns */}
          {companyCampaigns.length > 0 && (
            <View style={{ paddingHorizontal: 20, marginTop: 18 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 10,
                }}
              >
                <Text
                  style={{
                    fontFamily: FONTS.bold,
                    fontSize: 14,
                    color: COLORS.navy,
                  }}
                >
                  Campagnes
                </Text>
                <Badge variant="navy">{companyCampaigns.length}</Badge>
              </View>
              <View style={{ gap: 10 }}>
                {companyCampaigns.map((c) => (
                  <View
                    key={c.id}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: COLORS.white,
                      borderRadius: RADIUS.xl,
                      padding: 12,
                      borderWidth: 1,
                      borderColor: COLORS.gray100,
                      ...SHADOWS.sm,
                    }}
                  >
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: COLORS.navySoft,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Ionicons
                        name={c.icon}
                        size={18}
                        color={COLORS.navy}
                      />
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text
                        style={{
                          fontFamily: FONTS.bold,
                          fontSize: 13,
                          color: COLORS.navy,
                        }}
                      >
                        {c.brand}
                      </Text>
                      <Text
                        style={{
                          fontFamily: FONTS.medium,
                          fontSize: 10,
                          color: COLORS.gray500,
                          marginTop: 1,
                        }}
                      >
                        {c.city} · {c.reward} € · {c.durationDays}j
                      </Text>
                    </View>
                    <Badge
                      variant={
                        c.status === 'active'
                          ? 'success'
                          : c.status === 'completed'
                            ? 'neutral'
                            : 'navy'
                      }
                    >
                      {c.status === 'active'
                        ? 'ACTIVE'
                        : c.status === 'completed'
                          ? 'FAIT'
                          : 'DISPO'}
                    </Badge>
                  </View>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

function InfoRow({
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
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
      }}
    >
      <View
        style={{
          width: 30,
          height: 30,
          borderRadius: 15,
          backgroundColor: COLORS.navySoft,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons name={icon} size={14} color={COLORS.navy} />
      </View>
      <Text
        style={{
          flex: 1,
          marginLeft: 12,
          fontFamily: FONTS.medium,
          fontSize: 12,
          color: COLORS.gray500,
        }}
      >
        {label}
      </Text>
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

function Divider() {
  return (
    <View
      style={{
        height: 1,
        backgroundColor: COLORS.gray100,
        marginHorizontal: -14,
      }}
    />
  );
}
