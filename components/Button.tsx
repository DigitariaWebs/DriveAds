import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ViewStyle,
  StyleProp,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, RADIUS, SHADOWS } from '../constants/theme';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  style?: StyleProp<ViewStyle>;
}

const SIZE_MAP: Record<
  Size,
  { paddingVertical: number; paddingHorizontal: number; fontSize: number; iconSize: number }
> = {
  sm: { paddingVertical: 10, paddingHorizontal: 16, fontSize: 13, iconSize: 16 },
  md: { paddingVertical: 14, paddingHorizontal: 20, fontSize: 15, iconSize: 18 },
  lg: { paddingVertical: 18, paddingHorizontal: 24, fontSize: 16, iconSize: 20 },
};

export function Button({
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'right',
  style,
}: ButtonProps) {
  const sizing = SIZE_MAP[size];

  const variantContainer: Record<Variant, ViewStyle> = {
    primary: {
      backgroundColor: COLORS.navy,
      ...SHADOWS.md,
    },
    secondary: {
      backgroundColor: COLORS.navySoft,
    },
    outline: {
      backgroundColor: COLORS.white,
      borderWidth: 1.5,
      borderColor: COLORS.navy,
    },
    ghost: {
      backgroundColor: 'transparent',
    },
    danger: {
      backgroundColor: COLORS.danger,
      ...SHADOWS.md,
    },
  };

  const variantText: Record<Variant, string> = {
    primary: COLORS.white,
    secondary: COLORS.navy,
    outline: COLORS.navy,
    ghost: COLORS.navy,
    danger: COLORS.white,
  };

  const color = variantText[variant];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
      style={[
        {
          borderRadius: RADIUS.lg,
          paddingVertical: sizing.paddingVertical,
          paddingHorizontal: sizing.paddingHorizontal,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          width: fullWidth ? '100%' : undefined,
          opacity: disabled ? 0.5 : 1,
        },
        variantContainer[variant],
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={color} />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <View style={{ marginRight: 8 }}>
              <Ionicons name={icon} size={sizing.iconSize} color={color} />
            </View>
          )}
          <Text
            style={{
              fontFamily: FONTS.bold,
              fontSize: sizing.fontSize,
              color,
              letterSpacing: 0.3,
            }}
          >
            {children}
          </Text>
          {icon && iconPosition === 'right' && (
            <View style={{ marginLeft: 8 }}>
              <Ionicons name={icon} size={sizing.iconSize} color={color} />
            </View>
          )}
        </>
      )}
    </TouchableOpacity>
  );
}
