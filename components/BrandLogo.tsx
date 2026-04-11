import React, { useEffect, useState } from 'react';
import { View, Text, Image, ViewStyle, StyleProp } from 'react-native';
import { COLORS, FONTS, SHADOWS } from '../constants/theme';
import { BRAND_LOGO_OVERRIDES } from '../constants/brandLogos';

type Size = 'sm' | 'md' | 'lg' | 'xl';

const SIZE_MAP: Record<Size, { box: number; fontSize: number }> = {
  sm: { box: 40, fontSize: 13 },
  md: { box: 56, fontSize: 17 },
  lg: { box: 64, fontSize: 19 },
  xl: { box: 80, fontSize: 24 },
};

interface BrandLogoProps {
  domain?: string;
  name: string;
  size?: Size;
  style?: StyleProp<ViewStyle>;
}

type Stage = 'clearbit' | 'google' | 'initials';

export function BrandLogo({ domain, name, size = 'md', style }: BrandLogoProps) {
  const { box, fontSize } = SIZE_MAP[size];

  const localOverride = domain ? BRAND_LOGO_OVERRIDES[domain] : undefined;

  // Stage progression: try clearbit (best quality) → google favicon → initials
  const [stage, setStage] = useState<Stage>('clearbit');

  // Reset stage if domain changes
  useEffect(() => {
    setStage('clearbit');
  }, [domain]);

  const initials = name
    .split(' ')
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const containerStyle: StyleProp<ViewStyle> = [
    {
      width: box,
      height: box,
      borderRadius: box / 4,
      backgroundColor: COLORS.white,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: COLORS.gray100,
      ...SHADOWS.sm,
    },
    style,
  ];

  // Local override always wins
  if (localOverride) {
    return (
      <View style={containerStyle}>
        <Image
          source={localOverride}
          style={{ width: box * 0.78, height: box * 0.78 }}
          resizeMode="contain"
        />
      </View>
    );
  }

  if (!domain || stage === 'initials') {
    return (
      <View style={containerStyle}>
        <Text
          style={{
            fontFamily: FONTS.black,
            fontSize,
            color: COLORS.navy,
            letterSpacing: -0.5,
          }}
        >
          {initials}
        </Text>
      </View>
    );
  }

  const remoteUri =
    stage === 'clearbit'
      ? `https://logo.clearbit.com/${domain}?size=256`
      : `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

  return (
    <View style={containerStyle}>
      <Image
        source={{ uri: remoteUri }}
        style={{ width: box * 0.78, height: box * 0.78 }}
        resizeMode="contain"
        onError={() => {
          if (stage === 'clearbit') setStage('google');
          else setStage('initials');
        }}
      />
    </View>
  );
}
