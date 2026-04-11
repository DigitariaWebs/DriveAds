import React from 'react';
import { View, Text, ViewStyle, StyleProp } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, RADIUS, SHADOWS } from '../constants/theme';

interface StatCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string | number;
  trend?: string;
  trendDirection?: 'up' | 'down';
  style?: StyleProp<ViewStyle>;
}

export function StatCard({
  icon,
  label,
  value,
  trend,
  trendDirection = 'up',
  style,
}: StatCardProps) {
  const trendColor =
    trendDirection === 'up' ? COLORS.success : COLORS.danger;

  return (
    <View
      style={[
        {
          backgroundColor: COLORS.white,
          borderRadius: RADIUS.xl,
          padding: 16,
          borderWidth: 1,
          borderColor: COLORS.gray100,
          ...SHADOWS.sm,
        },
        style,
      ]}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 14,
        }}
      >
        <View
          style={{
            width: 38,
            height: 38,
            borderRadius: RADIUS.md,
            backgroundColor: COLORS.navySoft,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name={icon} size={19} color={COLORS.navy} />
        </View>
        {trend && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor:
                trendDirection === 'up'
                  ? COLORS.successSoft
                  : COLORS.dangerSoft,
              borderRadius: RADIUS.full,
              paddingHorizontal: 8,
              paddingVertical: 3,
            }}
          >
            <Ionicons
              name={trendDirection === 'up' ? 'trending-up' : 'trending-down'}
              size={11}
              color={trendColor}
            />
            <Text
              style={{
                fontFamily: FONTS.semibold,
                fontSize: 10,
                color: trendColor,
                marginLeft: 3,
              }}
            >
              {trend}
            </Text>
          </View>
        )}
      </View>
      <Text
        style={{
          fontFamily: FONTS.black,
          fontSize: 22,
          color: COLORS.navy,
          marginBottom: 2,
          letterSpacing: -0.3,
        }}
      >
        {value}
      </Text>
      <Text
        style={{
          fontFamily: FONTS.medium,
          fontSize: 12,
          color: COLORS.gray500,
        }}
      >
        {label}
      </Text>
    </View>
  );
}
