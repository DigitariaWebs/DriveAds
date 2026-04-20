import React, { ReactNode, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/Colors';
import { FontFamily } from '../constants/Typography';

const { width } = Dimensions.get('window');

// ─── Seeded background noise ───────────────────────────────
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

type NoiseDot = {
  key: number;
  top: number;
  left: number;
  size: number;
  opacity: number;
};

const generateNoise = (count: number, w: number, h: number): NoiseDot[] => {
  const dots: NoiseDot[] = [];
  for (let i = 0; i < count; i++) {
    const sizeRoll = seededRandom(i * 3.73);
    dots.push({
      key: i,
      top: seededRandom(i * 1.31) * h,
      left: seededRandom(i * 2.27) * w,
      size: sizeRoll > 0.9 ? 2 : 1,
      opacity: 0.02 + seededRandom(i * 4.13) * 0.06,
    });
  }
  return dots;
};

// ─── Props ─────────────────────────────────────────────────
type Props = {
  title: string;
  subtitle?: string;
  rightIcon?: keyof typeof Feather.glyphMap;
  onRightPress?: () => void;
  onBackPress?: () => void;
  children?: ReactNode;
};

// ─── Component ─────────────────────────────────────────────
export default function GradientHeader({
  title,
  subtitle,
  rightIcon,
  onRightPress,
  onBackPress,
  children,
}: Props) {
  const insets = useSafeAreaInsets();
  const noise = useMemo(() => generateNoise(180, width, 240), []);

  const handleBack = () => {
    if (onBackPress) onBackPress();
    else if (router.canGoBack()) router.back();
  };

  return (
    <View style={[styles.hero, { paddingTop: insets.top + 12 }]}>
      <LinearGradient
        colors={[Colors.navyDark, Colors.navy, Colors.navyLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {/* Warm glow */}
      <View style={styles.glowWarmWrap} pointerEvents="none">
        <LinearGradient
          colors={['rgba(244,184,81,0.28)', 'rgba(244,184,81,0)']}
          style={styles.glowOrb}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
      </View>
      {/* Cool glow */}
      <View style={styles.glowCoolWrap} pointerEvents="none">
        <LinearGradient
          colors={['rgba(150,170,255,0.2)', 'rgba(150,170,255,0)']}
          style={styles.glowOrb}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
      </View>
      {/* Sheen */}
      <LinearGradient
        colors={['rgba(255,255,255,0.04)', 'rgba(255,255,255,0)']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0.5 }}
        pointerEvents="none"
      />
      {/* Noise */}
      <View style={styles.noiseLayer} pointerEvents="none">
        {noise.map((d) => (
          <View
            key={d.key}
            style={{
              position: 'absolute',
              top: d.top,
              left: d.left,
              width: d.size,
              height: d.size,
              borderRadius: d.size / 2,
              backgroundColor: '#FFFFFF',
              opacity: d.opacity,
            }}
          />
        ))}
      </View>

      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.iconBtn}
          activeOpacity={0.75}
        >
          <Feather name="arrow-left" size={18} color={Colors.white} />
        </TouchableOpacity>

        {rightIcon && onRightPress ? (
          <TouchableOpacity
            onPress={onRightPress}
            style={styles.iconBtn}
            activeOpacity={0.75}
          >
            <Feather name={rightIcon} size={18} color={Colors.white} />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconBtn} />
        )}
      </View>

      {/* Title */}
      <View style={styles.titleBlock}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingHorizontal: 20,
    paddingBottom: 28,
    overflow: 'hidden',
  },
  glowWarmWrap: {
    position: 'absolute',
    top: -80,
    right: -60,
    width: 260,
    height: 260,
  },
  glowCoolWrap: {
    position: 'absolute',
    bottom: -60,
    left: -40,
    width: 220,
    height: 220,
  },
  glowOrb: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
  },
  noiseLayer: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.9,
  },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  titleBlock: {
    marginTop: 4,
  },
  title: {
    fontFamily: FontFamily.black,
    fontSize: 28,
    color: Colors.white,
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  subtitle: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: 'rgba(255,255,255,0.65)',
    marginTop: 4,
  },
});
