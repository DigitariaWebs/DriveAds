import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Colors } from '../constants/Colors';
import { FontFamily } from '../constants/Typography';
import { Spacing } from '../constants/Spacing';

type Tab = {
  key: string;
  label: string;
  icon: keyof typeof Feather.glyphMap;
  badge?: number;
};

type Props = {
  tabs: Tab[];
  activeKey: string;
  onChange: (key: string) => void;
};

export default function BottomTabBar({ tabs, activeKey, onChange }: Props) {
  const insets = useSafeAreaInsets();

  const handlePress = (key: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onChange(key);
  };

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, Spacing.sm) }]}>
      {tabs.map((tab) => {
        const active = tab.key === activeKey;
        const color = active ? Colors.navy : Colors.gray400;

        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            onPress={() => handlePress(tab.key)}
            activeOpacity={0.7}
          >
            <View style={styles.iconWrapper}>
              <Feather name={tab.icon} size={24} color={color} />
              {tab.badge !== undefined && tab.badge > 0 && (
                <View style={styles.badge}>
                  {tab.badge > 1 ? (
                    <Text style={styles.badgeText}>
                      {tab.badge > 99 ? '99+' : tab.badge}
                    </Text>
                  ) : null}
                </View>
              )}
            </View>
            <Text style={[styles.label, { color }]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
    paddingTop: Spacing.sm,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    position: 'relative',
  },
  label: {
    fontFamily: FontFamily.medium,
    fontSize: 11,
    marginTop: 2,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: Colors.danger,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 9,
    fontWeight: '700',
  },
});
