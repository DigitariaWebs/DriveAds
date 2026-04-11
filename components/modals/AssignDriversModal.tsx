import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../Button';
import { BrandLogo } from '../BrandLogo';
import { Campaign, Driver } from '../../mocks/data';
import { COLORS, FONTS, RADIUS } from '../../constants/theme';

interface AssignDriversModalProps {
  visible: boolean;
  campaign: Campaign | null;
  drivers: Driver[];
  onClose: () => void;
  onConfirm: (campaignId: string, driverIds: string[]) => void;
}

export function AssignDriversModal({
  visible,
  campaign,
  drivers,
  onClose,
  onConfirm,
}: AssignDriversModalProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (campaign) {
      setSelected(new Set(campaign.assignedDriverIds ?? []));
    }
  }, [campaign]);

  if (!campaign) return null;

  const validatedDrivers = drivers.filter((d) => d.status === 'validated');
  const needed = campaign.driversNeeded ?? 0;
  const count = selected.size;
  const full = count >= needed;

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (count >= needed) return prev;
        next.add(id);
      }
      return next;
    });
  };

  const handleConfirm = () => {
    onConfirm(campaign.id, Array.from(selected));
    onClose();
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
            paddingHorizontal: 20,
            paddingVertical: 14,
            borderBottomWidth: 1,
            borderBottomColor: COLORS.gray100,
            backgroundColor: COLORS.white,
          }}
        >
          <TouchableOpacity
            onPress={onClose}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: COLORS.navySoft,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="close" size={20} color={COLORS.navy} />
          </TouchableOpacity>
          <Text
            style={{
              fontFamily: FONTS.black,
              fontSize: 17,
              color: COLORS.navy,
            }}
          >
            Assigner des chauffeurs
          </Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Campaign summary */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: COLORS.white,
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: COLORS.gray100,
          }}
        >
          <BrandLogo domain={campaign.domain} name={campaign.brand} size="lg" />
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text
              style={{
                fontFamily: FONTS.black,
                fontSize: 16,
                color: COLORS.navy,
              }}
            >
              {campaign.brand}
            </Text>
            <Text
              style={{
                fontFamily: FONTS.medium,
                fontSize: 12,
                color: COLORS.gray500,
                marginTop: 2,
              }}
            >
              {campaign.city} · {campaign.reward} € · {campaign.durationDays} j
            </Text>
          </View>
          <View
            style={{
              backgroundColor: full ? COLORS.successSoft : COLORS.navySoft,
              paddingHorizontal: 12,
              paddingVertical: 7,
              borderRadius: RADIUS.full,
            }}
          >
            <Text
              style={{
                fontFamily: FONTS.black,
                fontSize: 13,
                color: full ? COLORS.success : COLORS.navy,
              }}
            >
              {count} / {needed}
            </Text>
          </View>
        </View>

        {/* Drivers list */}
        <FlatList
          data={validatedDrivers}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 120, gap: 8 }}
          renderItem={({ item }) => {
            const isSelected = selected.has(item.id);
            const disabled = !isSelected && full;
            const initials = item.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2);

            return (
              <TouchableOpacity
                onPress={() => toggle(item.id)}
                activeOpacity={0.85}
                disabled={disabled}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: COLORS.white,
                  borderRadius: RADIUS.xl,
                  padding: 14,
                  borderWidth: 1.5,
                  borderColor: isSelected ? COLORS.navy : COLORS.gray100,
                  opacity: disabled ? 0.4 : 1,
                }}
              >
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: COLORS.navySoft,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontFamily: FONTS.black,
                      fontSize: 15,
                      color: COLORS.navy,
                    }}
                  >
                    {initials}
                  </Text>
                </View>

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
                      {item.city}
                    </Text>
                    <Text
                      style={{
                        marginHorizontal: 6,
                        color: COLORS.gray400,
                      }}
                    >
                      •
                    </Text>
                    <Ionicons name="star" size={11} color={COLORS.warning} />
                    <Text
                      style={{
                        fontFamily: FONTS.medium,
                        fontSize: 11,
                        color: COLORS.gray500,
                        marginLeft: 3,
                      }}
                    >
                      {item.rating} · {item.campaignsDone} camp.
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 13,
                    borderWidth: 2,
                    borderColor: isSelected ? COLORS.navy : COLORS.gray300,
                    backgroundColor: isSelected ? COLORS.navy : 'transparent',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {isSelected && (
                    <Ionicons name="checkmark" size={16} color={COLORS.white} />
                  )}
                </View>
              </TouchableOpacity>
            );
          }}
        />

        {/* Footer CTA */}
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            padding: 16,
            backgroundColor: COLORS.white,
            borderTopWidth: 1,
            borderTopColor: COLORS.gray100,
          }}
        >
          <Button
            variant="primary"
            size="lg"
            fullWidth
            icon="checkmark-circle"
            onPress={handleConfirm}
          >
            Confirmer l'assignation ({count})
          </Button>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
