import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  LayoutAnimation,
  UIManager,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Colors } from '../constants/Colors';
import { FontFamily } from '../constants/Typography';
import { TAB_BAR_HEIGHT, TAB_BAR_BOTTOM } from '../constants/TabBarStyle';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type IconName = keyof typeof Feather.glyphMap;

type TabMeta = {
  icon: IconName;
  label: string;
};

type Props = BottomTabBarProps & {
  iconMap: Record<string, TabMeta>;
};

export default function GlassTabBar({
  state,
  descriptors,
  navigation,
  iconMap,
}: Props) {
  const insets = useSafeAreaInsets();

  const handlePress = (index: number, route: any, isFocused: boolean) => {
    LayoutAnimation.configureNext(
      LayoutAnimation.create(200, 'easeInEaseOut', 'opacity'),
    );
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name, route.params);
    }
  };

  // Only render tabs that have iconMap entries (hides hidden routes)
  const visibleRoutes = state.routes
    .map((route, i) => ({ route, index: i }))
    .filter(({ route }) => iconMap[route.name]);

  return (
    <View
      style={[
        styles.wrap,
        { bottom: Math.max(insets.bottom, 12) + TAB_BAR_BOTTOM - 16 },
      ]}
      pointerEvents="box-none"
    >
      <BlurView
        intensity={Platform.OS === 'ios' ? 40 : 60}
        tint="dark"
        style={styles.bar}
      >
        {/* Color tint on top of blur so branding stays consistent */}
        <View style={styles.tintOverlay} pointerEvents="none" />
        <View style={styles.hairline} pointerEvents="none" />

        <View style={styles.row}>
          {visibleRoutes.map(({ route, index }) => {
            const meta = iconMap[route.name];
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;
            const badge = options.tabBarBadge as number | string | undefined;

            return (
              <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                onPress={() => handlePress(index, route, isFocused)}
                activeOpacity={0.85}
                style={[
                  styles.tab,
                  isFocused ? styles.tabActive : styles.tabInactive,
                ]}
              >
                <View style={styles.iconWrap}>
                  <Feather
                    name={meta.icon}
                    size={isFocused ? 18 : 20}
                    color={
                      isFocused ? Colors.white : 'rgba(255,255,255,0.55)'
                    }
                  />
                  {badge !== undefined && Number(badge) > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>
                        {Number(badge) > 9 ? '9+' : badge}
                      </Text>
                    </View>
                  )}
                </View>

                {isFocused && (
                  <Text style={styles.tabLabel} numberOfLines={1}>
                    {meta.label}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 16,
    right: 16,
  },
  bar: {
    height: TAB_BAR_HEIGHT,
    borderRadius: TAB_BAR_HEIGHT / 2,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.45,
        shadowRadius: 28,
      },
      android: {
        elevation: 18,
      },
    }),
  },
  tintOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10,14,31,0.45)',
  },
  hairline: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: TAB_BAR_HEIGHT / 2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    borderRadius: 22,
    gap: 6,
  },
  tabInactive: {
    width: 44,
  },
  tabActive: {
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  iconWrap: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontFamily: FontFamily.bold,
    fontSize: 12,
    color: Colors.white,
    letterSpacing: 0.1,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -7,
    backgroundColor: Colors.danger,
    borderRadius: 8,
    minWidth: 15,
    height: 15,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: 'rgba(10,14,31,0.85)',
  },
  badgeText: {
    fontFamily: FontFamily.bold,
    color: Colors.white,
    fontSize: 9,
  },
});
