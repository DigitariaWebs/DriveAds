import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppLogo } from './AppLogo';
import { COLORS, FONTS, SHADOWS } from '../constants/theme';

interface ScreenHeaderProps {
  title?: string;
  subtitle?: string;
  showLogo?: boolean;
  notificationBadge?: number;
  onNotificationPress?: () => void;
  onLogoutPress?: () => void;
  rightAction?: React.ReactNode;
}

export function ScreenHeader({
  title,
  subtitle,
  showLogo = true,
  notificationBadge,
  onNotificationPress,
  onLogoutPress,
  rightAction,
}: ScreenHeaderProps) {
  return (
    <View>
      {/* Top bar with logo and actions */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: 16,
          paddingRight: 20,
          paddingTop: 4,
          paddingBottom: 4,
        }}
      >
        {showLogo ? <AppLogo size="xl" variant="transparent" /> : <View />}

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          {rightAction}

          {onNotificationPress && (
            <TouchableOpacity
              onPress={onNotificationPress}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: COLORS.white,
                alignItems: 'center',
                justifyContent: 'center',
                ...SHADOWS.sm,
                borderWidth: 1,
                borderColor: COLORS.gray100,
              }}
            >
              <Ionicons
                name="notifications-outline"
                size={21}
                color={COLORS.navy}
              />
              {notificationBadge !== undefined && notificationBadge > 0 && (
                <View
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    minWidth: 16,
                    height: 16,
                    paddingHorizontal: 4,
                    borderRadius: 8,
                    backgroundColor: COLORS.danger,
                    borderWidth: 2,
                    borderColor: COLORS.white,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontFamily: FONTS.bold,
                      fontSize: 9,
                      color: COLORS.white,
                    }}
                  >
                    {notificationBadge > 9 ? '9+' : notificationBadge}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          )}

          {onLogoutPress && (
            <TouchableOpacity
              onPress={onLogoutPress}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: COLORS.white,
                alignItems: 'center',
                justifyContent: 'center',
                ...SHADOWS.sm,
                borderWidth: 1,
                borderColor: COLORS.gray100,
              }}
            >
              <Ionicons
                name="log-out-outline"
                size={20}
                color={COLORS.navy}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Title section */}
      {(title || subtitle) && (
        <View style={{ paddingHorizontal: 24, marginTop: 12, marginBottom: 18 }}>
          {subtitle && (
            <Text
              style={{
                fontFamily: FONTS.medium,
                fontSize: 13,
                color: COLORS.gray500,
              }}
            >
              {subtitle}
            </Text>
          )}
          {title && (
            <Text
              style={{
                fontFamily: FONTS.black,
                fontSize: 26,
                color: COLORS.navy,
                marginTop: subtitle ? 2 : 0,
                letterSpacing: -0.4,
              }}
            >
              {title}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}
