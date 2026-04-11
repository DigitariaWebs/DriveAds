import React from 'react';
import { Image, ImageStyle, StyleProp } from 'react-native';

type Size = 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
type Variant = 'default' | 'transparent';

const SIZES: Record<Size, { width: number; height: number }> = {
  sm: { width: 110, height: 34 },
  md: { width: 160, height: 48 },
  lg: { width: 220, height: 66 },
  xl: { width: 280, height: 84 },
  xxl: { width: 360, height: 110 },
};

const LOGO_DEFAULT = require('../assets/logo.png');
const LOGO_TRANSPARENT = require('../assets/logo-removebg-preview.png');

interface AppLogoProps {
  size?: Size;
  variant?: Variant;
  style?: StyleProp<ImageStyle>;
}

export function AppLogo({
  size = 'md',
  variant = 'default',
  style,
}: AppLogoProps) {
  const source = variant === 'transparent' ? LOGO_TRANSPARENT : LOGO_DEFAULT;
  return (
    <Image
      source={source}
      style={[SIZES[size], style]}
      resizeMode="contain"
      left={-80}
    />
  );
}
