import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, RADIUS, SHADOWS } from '../constants/theme';

export type TabDef<K extends string = string> = {
  key: K;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  badge?: number;
};

interface BottomTabBarProps<K extends string> {
  tabs: TabDef<K>[];
  activeKey: K;
  onChange: (key: K) => void;
}

export function BottomTabBar<K extends string>({
  tabs,
  activeKey,
  onChange,
}: BottomTabBarProps<K>) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        position: 'absolute',
        left: 16,
        right: 16,
        bottom: Math.max(insets.bottom, 12),
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: COLORS.white,
          borderRadius: RADIUS.xxl,
          paddingVertical: 10,
          paddingHorizontal: 8,
          ...SHADOWS.lg,
          borderWidth: 1,
          borderColor: COLORS.gray100,
        }}
      >
        {tabs.map((tab) => {
          const active = tab.key === activeKey;
          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => onChange(tab.key)}
              activeOpacity={0.85}
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 6,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 34,
                  borderRadius: RADIUS.md,
                  backgroundColor: active ? COLORS.navy : 'transparent',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons
                  name={tab.icon}
                  size={20}
                  color={active ? COLORS.white : COLORS.gray400}
                />
                {tab.badge !== undefined && tab.badge > 0 && (
                  <View
                    style={{
                      position: 'absolute',
                      top: -2,
                      right: -2,
                      minWidth: 16,
                      height: 16,
                      paddingHorizontal: 4,
                      borderRadius: 8,
                      backgroundColor: COLORS.danger,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: 1.5,
                      borderColor: COLORS.white,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: FONTS.bold,
                        fontSize: 9,
                        color: COLORS.white,
                        lineHeight: Platform.OS === 'ios' ? 11 : 13,
                      }}
                    >
                      {tab.badge > 9 ? '9+' : tab.badge}
                    </Text>
                  </View>
                )}
              </View>
              <Text
                style={{
                  fontFamily: active ? FONTS.bold : FONTS.medium,
                  fontSize: 10,
                  color: active ? COLORS.navy : COLORS.gray400,
                  marginTop: 4,
                }}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
