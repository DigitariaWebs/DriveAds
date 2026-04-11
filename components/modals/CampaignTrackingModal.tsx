import React, { useState, useEffect } from 'react';
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
import {
  Campaign,
  Driver,
  TrackingMode,
  trackingEventsFor,
} from '../../mocks/data';
import { COLORS, FONTS, RADIUS, SHADOWS } from '../../constants/theme';

interface CampaignTrackingModalProps {
  visible: boolean;
  campaign: Campaign | null;
  drivers: Driver[];
  onClose: () => void;
  onChangeMode: (campaignId: string, mode: TrackingMode) => void;
}

const eventColorMap: Record<
  'success' | 'info' | 'warning' | 'navy',
  { bg: string; fg: string }
> = {
  success: { bg: COLORS.successSoft, fg: COLORS.success },
  info: { bg: COLORS.infoSoft, fg: COLORS.info },
  warning: { bg: COLORS.warningSoft, fg: COLORS.warning },
  navy: { bg: COLORS.navySoft, fg: COLORS.navy },
};

export function CampaignTrackingModal({
  visible,
  campaign,
  drivers,
  onClose,
  onChangeMode,
}: CampaignTrackingModalProps) {
  const [mode, setMode] = useState<TrackingMode>('gps');

  useEffect(() => {
    if (campaign) {
      setMode(campaign.trackingMode ?? 'gps');
    }
  }, [campaign]);

  if (!campaign) return null;

  const assignedDrivers = (campaign.assignedDriverIds ?? [])
    .map((id) => drivers.find((d) => d.id === id))
    .filter((d): d is Driver => !!d);

  const totalKm = campaign.kmTotal ?? 0;
  const doneKm = campaign.kmDone ?? 0;
  const progress = campaign.progress ?? 0;
  const events = trackingEventsFor(campaign.id);

  // Fake zone progress
  const zonesProgress = campaign.zones.map((zone, idx) => ({
    name: zone,
    progress: Math.min(1, Math.max(0.15, progress - idx * 0.1 + 0.2)),
  }));

  const handleModeChange = (next: TrackingMode) => {
    setMode(next);
    onChangeMode(campaign.id, next);
  };

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
            Suivi campagne
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: RADIUS.full,
              backgroundColor: COLORS.successSoft,
            }}
          >
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: COLORS.success,
                marginRight: 4,
              }}
            />
            <Text
              style={{
                fontFamily: FONTS.bold,
                fontSize: 9,
                color: COLORS.success,
                letterSpacing: 0.3,
              }}
            >
              LIVE
            </Text>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
        >
          {/* Hero card with image */}
          <View
            style={{
              marginHorizontal: 14,
              marginTop: 12,
              borderRadius: RADIUS.xxl,
              overflow: 'hidden',
              backgroundColor: COLORS.navy,
              ...SHADOWS.lg,
            }}
          >
            {campaign.heroImage && (
              <View style={{ height: 160, backgroundColor: COLORS.navy }}>
                <Image
                  source={campaign.heroImage}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                />
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: COLORS.blackOverlay40,
                  }}
                />
              </View>
            )}
            <View style={{ padding: 14 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <BrandLogo
                  domain={campaign.domain}
                  name={campaign.brand}
                  size="md"
                />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text
                    style={{
                      fontFamily: FONTS.black,
                      fontSize: 15,
                      color: COLORS.white,
                      letterSpacing: -0.2,
                    }}
                  >
                    {campaign.brand}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 1,
                    }}
                  >
                    <Ionicons
                      name="location-outline"
                      size={10}
                      color="rgba(255,255,255,0.7)"
                    />
                    <Text
                      style={{
                        fontFamily: FONTS.medium,
                        fontSize: 10,
                        color: 'rgba(255,255,255,0.7)',
                        marginLeft: 2,
                      }}
                    >
                      {campaign.city} · {campaign.zones.length} zones
                    </Text>
                  </View>
                </View>
              </View>

              {/* KPI row */}
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 12,
                  paddingTop: 12,
                  borderTopWidth: 1,
                  borderTopColor: 'rgba(255,255,255,0.12)',
                }}
              >
                <HeroKpi label="Km" value={`${doneKm}/${totalKm}`} />
                <HeroKpi label="Avancée" value={`${Math.round(progress * 100)}%`} />
                <HeroKpi label="Véhicules" value={`${assignedDrivers.length}`} />
                <HeroKpi
                  label="Zones"
                  value={`${campaign.zones.length}`}
                />
              </View>

              {/* Global progress bar */}
              <View
                style={{
                  height: 5,
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  borderRadius: RADIUS.full,
                  overflow: 'hidden',
                  marginTop: 10,
                }}
              >
                <View
                  style={{
                    width: `${progress * 100}%`,
                    height: '100%',
                    backgroundColor: COLORS.white,
                  }}
                />
              </View>
            </View>
          </View>

          {/* Tracking mode */}
          <View style={{ marginHorizontal: 14, marginTop: 16 }}>
            <SectionTitle>Mode de suivi</SectionTitle>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <ModeCard
                active={mode === 'gps'}
                icon="navigate"
                title="GPS"
                subtitle="Temps réel"
                onPress={() => handleModeChange('gps')}
              />
              <ModeCard
                active={mode === 'manual'}
                icon="hand-left"
                title="Manuel"
                subtitle="Confirmation"
                onPress={() => handleModeChange('manual')}
              />
            </View>
          </View>

          {/* Live map (fake) */}
          <View style={{ marginHorizontal: 14, marginTop: 16 }}>
            <SectionTitle>Carte en direct</SectionTitle>
            <View
              style={{
                height: 180,
                borderRadius: RADIUS.xxl,
                overflow: 'hidden',
                backgroundColor: COLORS.navySoft,
                borderWidth: 1,
                borderColor: COLORS.gray100,
                ...SHADOWS.sm,
              }}
            >
              {/* Grid pattern overlay */}
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}
              >
                {[0, 1, 2, 3].map((i) => (
                  <View
                    key={`h${i}`}
                    style={{
                      position: 'absolute',
                      top: `${25 * (i + 1)}%`,
                      left: 0,
                      right: 0,
                      height: 1,
                      backgroundColor: 'rgba(35, 52, 102, 0.06)',
                    }}
                  />
                ))}
                {[0, 1, 2, 3, 4].map((i) => (
                  <View
                    key={`v${i}`}
                    style={{
                      position: 'absolute',
                      left: `${20 * (i + 1)}%`,
                      top: 0,
                      bottom: 0,
                      width: 1,
                      backgroundColor: 'rgba(35, 52, 102, 0.06)',
                    }}
                  />
                ))}
              </View>

              {/* Fake route line */}
              <View
                style={{
                  position: 'absolute',
                  top: 60,
                  left: 30,
                  right: 40,
                  height: 2,
                  backgroundColor: COLORS.navy,
                  opacity: 0.4,
                  borderRadius: 1,
                  transform: [{ rotate: '-8deg' }],
                }}
              />
              <View
                style={{
                  position: 'absolute',
                  top: 110,
                  left: 80,
                  right: 60,
                  height: 2,
                  backgroundColor: COLORS.navy,
                  opacity: 0.4,
                  borderRadius: 1,
                  transform: [{ rotate: '6deg' }],
                }}
              />

              {/* Driver markers */}
              {[
                { top: 40, left: 35, color: COLORS.success, name: 'M' },
                { top: 90, left: 140, color: COLORS.success, name: 'T' },
                { top: 130, left: 230, color: COLORS.warning, name: 'E' },
              ]
                .slice(0, assignedDrivers.length)
                .map((marker, idx) => (
                  <View
                    key={idx}
                    style={{
                      position: 'absolute',
                      top: marker.top,
                      left: marker.left,
                      alignItems: 'center',
                    }}
                  >
                    <View
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 14,
                        backgroundColor: marker.color,
                        borderWidth: 3,
                        borderColor: COLORS.white,
                        alignItems: 'center',
                        justifyContent: 'center',
                        ...SHADOWS.md,
                      }}
                    >
                      <Ionicons
                        name="car-sport"
                        size={14}
                        color={COLORS.white}
                      />
                    </View>
                    <View
                      style={{
                        marginTop: 3,
                        paddingHorizontal: 6,
                        paddingVertical: 1,
                        borderRadius: 4,
                        backgroundColor: COLORS.white,
                        ...SHADOWS.sm,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: FONTS.bold,
                          fontSize: 8,
                          color: COLORS.navy,
                        }}
                      >
                        {marker.name}
                      </Text>
                    </View>
                  </View>
                ))}

              {/* Zone labels */}
              <View
                style={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: RADIUS.sm,
                  ...SHADOWS.sm,
                }}
              >
                <Text
                  style={{
                    fontFamily: FONTS.bold,
                    fontSize: 9,
                    color: COLORS.navy,
                  }}
                >
                  {campaign.city.toUpperCase()}
                </Text>
              </View>
            </View>
          </View>

          {/* Zones coverage */}
          <View style={{ marginHorizontal: 14, marginTop: 16 }}>
            <SectionTitle>Zones couvertes</SectionTitle>
            <View
              style={{
                backgroundColor: COLORS.white,
                borderRadius: RADIUS.xl,
                padding: 12,
                borderWidth: 1,
                borderColor: COLORS.gray100,
                ...SHADOWS.sm,
              }}
            >
              {zonesProgress.map((zone, idx) => (
                <View
                  key={zone.name}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 6,
                    borderTopWidth: idx === 0 ? 0 : 1,
                    borderTopColor: COLORS.gray100,
                  }}
                >
                  <View
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 11,
                      backgroundColor:
                        zone.progress >= 1
                          ? COLORS.success
                          : COLORS.navySoft,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Ionicons
                      name={
                        zone.progress >= 1
                          ? 'checkmark'
                          : 'location-outline'
                      }
                      size={11}
                      color={
                        zone.progress >= 1 ? COLORS.white : COLORS.navy
                      }
                    />
                  </View>
                  <Text
                    style={{
                      flex: 1,
                      marginLeft: 10,
                      fontFamily: FONTS.semibold,
                      fontSize: 12,
                      color: COLORS.navy,
                    }}
                  >
                    {zone.name}
                  </Text>
                  <View
                    style={{
                      width: 60,
                      height: 4,
                      backgroundColor: COLORS.gray100,
                      borderRadius: 2,
                      overflow: 'hidden',
                      marginRight: 8,
                    }}
                  >
                    <View
                      style={{
                        width: `${zone.progress * 100}%`,
                        height: '100%',
                        backgroundColor:
                          zone.progress >= 1 ? COLORS.success : COLORS.navy,
                      }}
                    />
                  </View>
                  <Text
                    style={{
                      fontFamily: FONTS.black,
                      fontSize: 10,
                      color: COLORS.navy,
                      minWidth: 28,
                      textAlign: 'right',
                    }}
                  >
                    {Math.round(zone.progress * 100)}%
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Active drivers */}
          <View style={{ marginHorizontal: 14, marginTop: 16 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 8,
              }}
            >
              <SectionTitle noMargin>Chauffeurs actifs</SectionTitle>
              <Badge variant="navy">{assignedDrivers.length}</Badge>
            </View>

            <View style={{ gap: 6 }}>
              {assignedDrivers.map((d, idx) => {
                const share = 1 / Math.max(1, assignedDrivers.length);
                const kmDoneDriver = Math.round(doneKm * share);
                const kmTargetDriver = Math.round(totalKm * share);
                const driverProgress =
                  kmTargetDriver > 0 ? kmDoneDriver / kmTargetDriver : 0;
                const initials = d.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2);
                const lastSeen = ['2 min', '14 min', '1 h'][idx % 3];
                const speed = [52, 38, 0][idx % 3];
                const paused = speed === 0;

                return (
                  <View
                    key={d.id}
                    style={{
                      backgroundColor: COLORS.white,
                      borderRadius: RADIUS.xl,
                      padding: 10,
                      borderWidth: 1,
                      borderColor: COLORS.gray100,
                      ...SHADOWS.sm,
                    }}
                  >
                    <View
                      style={{ flexDirection: 'row', alignItems: 'center' }}
                    >
                      <View
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 17,
                          backgroundColor: COLORS.navySoft,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: FONTS.black,
                            fontSize: 11,
                            color: COLORS.navy,
                          }}
                        >
                          {initials}
                        </Text>
                      </View>
                      <View style={{ flex: 1, marginLeft: 10 }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: FONTS.bold,
                              fontSize: 12,
                              color: COLORS.navy,
                            }}
                          >
                            {d.name}
                          </Text>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}
                          >
                            <View
                              style={{
                                width: 5,
                                height: 5,
                                borderRadius: 2.5,
                                backgroundColor: paused
                                  ? COLORS.warning
                                  : COLORS.success,
                                marginRight: 3,
                              }}
                            />
                            <Text
                              style={{
                                fontFamily: FONTS.semibold,
                                fontSize: 9,
                                color: paused
                                  ? COLORS.warning
                                  : COLORS.success,
                              }}
                            >
                              {paused ? 'EN PAUSE' : 'EN ROUTE'}
                            </Text>
                          </View>
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
                            size={9}
                            color={COLORS.gray500}
                          />
                          <Text
                            style={{
                              fontFamily: FONTS.medium,
                              fontSize: 9,
                              color: COLORS.gray500,
                              marginLeft: 2,
                            }}
                          >
                            {d.city}
                          </Text>
                          <Text style={{ marginHorizontal: 4, color: COLORS.gray300, fontSize: 9 }}>
                            •
                          </Text>
                          <Ionicons
                            name="speedometer-outline"
                            size={9}
                            color={COLORS.gray500}
                          />
                          <Text
                            style={{
                              fontFamily: FONTS.medium,
                              fontSize: 9,
                              color: COLORS.gray500,
                              marginLeft: 2,
                            }}
                          >
                            {speed} km/h
                          </Text>
                          <Text style={{ marginHorizontal: 4, color: COLORS.gray300, fontSize: 9 }}>
                            •
                          </Text>
                          <Ionicons
                            name="time-outline"
                            size={9}
                            color={COLORS.gray500}
                          />
                          <Text
                            style={{
                              fontFamily: FONTS.medium,
                              fontSize: 9,
                              color: COLORS.gray500,
                              marginLeft: 2,
                            }}
                          >
                            {lastSeen}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View style={{ marginTop: 8 }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginBottom: 3,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: FONTS.semibold,
                            fontSize: 9,
                            color: COLORS.gray500,
                          }}
                        >
                          {kmDoneDriver} / {kmTargetDriver} km
                        </Text>
                        <Text
                          style={{
                            fontFamily: FONTS.black,
                            fontSize: 9,
                            color: COLORS.navy,
                          }}
                        >
                          {Math.round(driverProgress * 100)}%
                        </Text>
                      </View>
                      <View
                        style={{
                          height: 4,
                          backgroundColor: COLORS.gray100,
                          borderRadius: RADIUS.full,
                          overflow: 'hidden',
                        }}
                      >
                        <View
                          style={{
                            width: `${driverProgress * 100}%`,
                            height: '100%',
                            backgroundColor: COLORS.navy,
                          }}
                        />
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Activity feed */}
          <View style={{ marginHorizontal: 14, marginTop: 16 }}>
            <SectionTitle>Activité en direct</SectionTitle>
            <View
              style={{
                backgroundColor: COLORS.white,
                borderRadius: RADIUS.xl,
                padding: 12,
                borderWidth: 1,
                borderColor: COLORS.gray100,
                ...SHADOWS.sm,
              }}
            >
              {events.map((event, idx) => {
                const colors = eventColorMap[event.color];
                const isLast = idx === events.length - 1;
                return (
                  <View
                    key={event.id}
                    style={{ flexDirection: 'row', paddingBottom: isLast ? 0 : 10 }}
                  >
                    {/* Timeline bullet + line */}
                    <View style={{ alignItems: 'center', marginRight: 10 }}>
                      <View
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 12,
                          backgroundColor: colors.bg,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Ionicons name={event.icon} size={12} color={colors.fg} />
                      </View>
                      {!isLast && (
                        <View
                          style={{
                            flex: 1,
                            width: 1.5,
                            backgroundColor: COLORS.gray100,
                            marginTop: 2,
                          }}
                        />
                      )}
                    </View>

                    <View style={{ flex: 1, paddingTop: 2 }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                        }}
                      >
                        <Text
                          style={{
                            flex: 1,
                            fontFamily: FONTS.semibold,
                            fontSize: 11,
                            color: COLORS.navy,
                            lineHeight: 15,
                            paddingRight: 6,
                          }}
                        >
                          {event.text}
                        </Text>
                        <Text
                          style={{
                            fontFamily: FONTS.bold,
                            fontSize: 10,
                            color: COLORS.gray400,
                          }}
                        >
                          {event.time}
                        </Text>
                      </View>
                      {event.driver && (
                        <Text
                          style={{
                            fontFamily: FONTS.medium,
                            fontSize: 10,
                            color: COLORS.gray500,
                            marginTop: 1,
                          }}
                        >
                          {event.driver}
                        </Text>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

function SectionTitle({
  children,
  noMargin,
}: {
  children: string;
  noMargin?: boolean;
}) {
  return (
    <Text
      style={{
        fontFamily: FONTS.bold,
        fontSize: 13,
        color: COLORS.navy,
        marginBottom: noMargin ? 0 : 8,
      }}
    >
      {children}
    </Text>
  );
}

function HeroKpi({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flex: 1 }}>
      <Text
        style={{
          fontFamily: FONTS.black,
          fontSize: 13,
          color: COLORS.white,
        }}
      >
        {value}
      </Text>
      <Text
        style={{
          fontFamily: FONTS.medium,
          fontSize: 8,
          color: 'rgba(255,255,255,0.65)',
          marginTop: 1,
          letterSpacing: 0.3,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </Text>
    </View>
  );
}

function ModeCard({
  active,
  icon,
  title,
  subtitle,
  onPress,
}: {
  active: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: active ? COLORS.navy : COLORS.white,
        borderRadius: RADIUS.xl,
        padding: 12,
        borderWidth: 1.5,
        borderColor: active ? COLORS.navy : COLORS.gray100,
        ...SHADOWS.sm,
      }}
    >
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: active
            ? 'rgba(255,255,255,0.15)'
            : COLORS.navySoft,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons
          name={icon}
          size={15}
          color={active ? COLORS.white : COLORS.navy}
        />
      </View>
      <View style={{ marginLeft: 10 }}>
        <Text
          style={{
            fontFamily: FONTS.black,
            fontSize: 12,
            color: active ? COLORS.white : COLORS.navy,
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            fontFamily: FONTS.regular,
            fontSize: 9,
            color: active ? 'rgba(255,255,255,0.7)' : COLORS.gray500,
            marginTop: 1,
          }}
        >
          {subtitle}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
