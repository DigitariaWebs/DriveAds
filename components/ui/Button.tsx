import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Spacing } from '../../constants/Spacing';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

type Props = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: keyof typeof Feather.glyphMap;
  loading?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  children: string;
};

// ─── Variant configs ────────────────────────────────────────
// primary  = "Dark" chip   → solid navy, white text
// secondary = "Container"  → light bg, navy text, soft shadow
// outline  = "Border" chip → transparent, navy border, navy text
// ghost    = "Container"   → light bg, no border, subtle shadow
// danger   = "Both" chip   → gradient bg, white text, shadow

type VariantConfig = {
  text: TextStyle;
  loaderColor: string;
  useGradient?: boolean;
  gradientColors?: readonly [string, string, ...string[]];
  container: ViewStyle;
};

const variantConfigs: Record<ButtonVariant, VariantConfig> = {
  primary: {
    container: { backgroundColor: Colors.navy },
    text: { color: Colors.white },
    loaderColor: Colors.white,
  },
  secondary: {
    container: {
      backgroundColor: Colors.navySoft,
      shadowColor: Colors.navy,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 3,
    },
    text: { color: Colors.navy },
    loaderColor: Colors.navy,
  },
  outline: {
    container: {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: Colors.navy,
    },
    text: { color: Colors.navy },
    loaderColor: Colors.navy,
  },
  ghost: {
    container: {
      backgroundColor: Colors.gray50,
      shadowColor: Colors.navy,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 2,
    },
    text: { color: Colors.navy },
    loaderColor: Colors.navy,
  },
  danger: {
    container: {},
    text: { color: Colors.white },
    loaderColor: Colors.white,
    useGradient: true,
    gradientColors: [Colors.danger, '#D83030'],
  },
};

const sizeConfigs: Record<ButtonSize, { height: number; paddingHorizontal: number; font: TextStyle; iconSize: number }> = {
  sm: { height: 30, paddingHorizontal: Spacing.lg, font: Typography.buttonSmall, iconSize: 14 },
  md: { height: 38, paddingHorizontal: Spacing.xl, font: Typography.button, iconSize: 16 },
  lg: { height: 44, paddingHorizontal: Spacing.xxl, font: Typography.button, iconSize: 18 },
};

export default function Button({
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  disabled = false,
  onPress,
  children,
}: Props) {
  const v = variantConfigs[variant];
  const s = sizeConfigs[size];

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  const content = (
    <>
      {loading ? (
        <ActivityIndicator color={v.loaderColor} size="small" />
      ) : (
        <>
          {icon && (
            <Feather
              name={icon}
              size={s.iconSize}
              color={v.text.color as string}
              style={styles.icon}
            />
          )}
          <Text style={[s.font, v.text]}>{children}</Text>
        </>
      )}
    </>
  );

  // Gradient variant (danger)
  if (v.useGradient && v.gradientColors) {
    return (
      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled || loading}
        activeOpacity={0.7}
        style={[disabled && styles.disabled]}
      >
        <LinearGradient
          colors={v.gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.base,
            {
              height: s.height,
              paddingHorizontal: s.paddingHorizontal,
              shadowColor: v.gradientColors[0],
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 5,
            },
          ]}
        >
          {content}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  // All other variants
  return (
    <TouchableOpacity
      style={[
        styles.base,
        v.container,
        { height: s.height, paddingHorizontal: s.paddingHorizontal },
        disabled && styles.disabled,
      ]}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {content}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9999,
  },
  icon: {
    marginRight: Spacing.sm,
  },
  disabled: {
    opacity: 0.5,
  },
});
