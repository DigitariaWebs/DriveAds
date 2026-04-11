import React from 'react';
import { View, Text, ViewStyle, StyleProp } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, RADIUS } from '../constants/theme';

type Variant =
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral'
  | 'navy';

interface BadgeProps {
  children: React.ReactNode;
  variant?: Variant;
  icon?: keyof typeof Ionicons.glyphMap;
  style?: StyleProp<ViewStyle>;
}

const VARIANT_MAP: Record<Variant, { bg: string; fg: string }> = {
  success: { bg: COLORS.successSoft, fg: COLORS.success },
  warning: { bg: COLORS.warningSoft, fg: COLORS.warning },
  danger: { bg: COLORS.dangerSoft, fg: COLORS.danger },
  info: { bg: COLORS.infoSoft, fg: COLORS.info },
  neutral: { bg: COLORS.gray100, fg: COLORS.gray600 },
  navy: { bg: COLORS.navySoft, fg: COLORS.navy },
};

export function Badge({
  children,
  variant = 'neutral',
  icon,
  style,
}: BadgeProps) {
  const { bg, fg } = VARIANT_MAP[variant];

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: bg,
          borderRadius: RADIUS.full,
          paddingHorizontal: 10,
          paddingVertical: 5,
          alignSelf: 'flex-start',
        },
        style,
      ]}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={12}
          color={fg}
          style={{ marginRight: 4 }}
        />
      )}
      <Text
        style={{
          fontFamily: FONTS.semibold,
          fontSize: 11,
          color: fg,
          letterSpacing: 0.3,
        }}
      >
        {children}
      </Text>
    </View>
  );
}
