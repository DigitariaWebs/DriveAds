import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Colors } from '../constants/Colors';
import { FontFamily } from '../constants/Typography';

type Props = {
  domain: string;
  name: string;
  size?: number;
  // When the campaign/company has a real uploaded logo (A1 brand identity),
  // use it instead of falling back to clearbit/google favicons.
  logoUrl?: string;
  brandColor?: string;
};

const brandColors = [
  Colors.navy,
  Colors.info,
  Colors.success,
  Colors.warning,
  Colors.danger,
  Colors.navyLight,
];

function getColorForName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return brandColors[Math.abs(hash) % brandColors.length];
}

export default function BrandLogo({
  domain,
  name,
  size = 48,
  logoUrl,
  brandColor,
}: Props) {
  const [fallbackLevel, setFallbackLevel] = useState(0);

  const clearbitUrl = `https://logo.clearbit.com/${domain}?size=256`;
  const googleUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  const initial = (name || '?')[0].toUpperCase();
  const bgColor = brandColor ?? getColorForName(name);

  // Real uploaded logo wins. Falls back to clearbit/google then initial circle.
  const sources: string[] = [];
  if (logoUrl) sources.push(logoUrl);
  sources.push(clearbitUrl, googleUrl);

  if (fallbackLevel >= sources.length) {
    return (
      <View
        style={[
          styles.initialCircle,
          { width: size, height: size, borderRadius: size / 2, backgroundColor: bgColor },
        ]}
      >
        <Text style={[styles.initial, { fontSize: size * 0.4 }]}>{initial}</Text>
      </View>
    );
  }

  return (
    <Image
      source={{ uri: sources[fallbackLevel] }}
      style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
      contentFit="cover"
      onError={() => setFallbackLevel((prev) => prev + 1)}
      placeholder={undefined}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: Colors.gray100,
  },
  initialCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: {
    fontFamily: FontFamily.bold,
    color: Colors.white,
  },
});
