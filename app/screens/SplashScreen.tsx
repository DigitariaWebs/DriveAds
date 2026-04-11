import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { Screen } from '../../components/Screen';
import { AppLogo } from '../../components/AppLogo';
import { COLORS, FONTS } from '../../constants/theme';

interface SplashScreenProps {
  onFinish: () => void;
}

const Dot = ({ delay }: { delay: number }) => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 500 }),
          withTiming(0.3, { duration: 500 })
        ),
        -1,
        false
      )
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: COLORS.navy,
          marginHorizontal: 4,
        },
        style,
      ]}
    />
  );
};

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const logoScale = useSharedValue(0.7);
  const logoOpacity = useSharedValue(0);
  const taglineOpacity = useSharedValue(0);

  useEffect(() => {
    logoOpacity.value = withTiming(1, { duration: 700, easing: Easing.out(Easing.cubic) });
    logoScale.value = withTiming(1, { duration: 900, easing: Easing.out(Easing.back(1.4)) });
    taglineOpacity.value = withDelay(
      500,
      withTiming(1, { duration: 700, easing: Easing.out(Easing.cubic) })
    );

    const timer = setTimeout(onFinish, 2400);
    return () => clearTimeout(timer);
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
    transform: [{ translateY: (1 - taglineOpacity.value) * 12 }],
  }));

  return (
    <Screen backgroundColor={COLORS.white}>
      {/* Decorative background circles */}
      <View
        style={{
          position: 'absolute',
          top: -180,
          right: -120,
          width: 360,
          height: 360,
          borderRadius: 180,
          backgroundColor: COLORS.navySoft,
          opacity: 0.9,
        }}
      />
      <View
        style={{
          position: 'absolute',
          top: -100,
          right: -50,
          width: 260,
          height: 260,
          borderRadius: 130,
          backgroundColor: COLORS.navyOverlay05,
        }}
      />
      <View
        style={{
          position: 'absolute',
          bottom: -140,
          left: -120,
          width: 340,
          height: 340,
          borderRadius: 170,
          backgroundColor: COLORS.navySoft,
          opacity: 0.8,
        }}
      />
      <View
        style={{
          position: 'absolute',
          bottom: -80,
          left: -40,
          width: 200,
          height: 200,
          borderRadius: 100,
          backgroundColor: COLORS.navyOverlay05,
        }}
      />

      {/* Content */}
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Animated.View style={logoStyle}>
          <AppLogo size="xl" />
        </Animated.View>

        <Animated.View style={[{ marginTop: 20, paddingHorizontal: 32 }, taglineStyle]}>
          <Text
            style={{
              fontFamily: FONTS.medium,
              fontSize: 15,
              color: COLORS.gray500,
              textAlign: 'center',
              letterSpacing: 0.2,
            }}
          >
            Transformez votre véhicule en revenu
          </Text>
        </Animated.View>
      </View>

      {/* Loading dots */}
      <View
        style={{
          position: 'absolute',
          bottom: 60,
          left: 0,
          right: 0,
          flexDirection: 'row',
          justifyContent: 'center',
        }}
      >
        <Dot delay={0} />
        <Dot delay={200} />
        <Dot delay={400} />
      </View>
    </Screen>
  );
}
