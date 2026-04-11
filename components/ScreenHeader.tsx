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
          paddingLeft: 8,
          paddingRight: 16,
          paddingTop: 2,
          paddingBottom: 2,
        }}
      >
        {showLogo ? <AppLogo size="lg" variant="transparent" /> : <View />}

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {rightAction}

          {onNotificationPress && (
            <TouchableOpacity
              onPress={onNotificationPress}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
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
                size={17}
                color={COLORS.navy}
              />
              {notificationBadge !== undefined && notificationBadge > 0 && (
                <View
                  style={{
                    position: 'absolute',
                    top: 5,
                    right: 5,
                    minWidth: 14,
                    height: 14,
                    paddingHorizontal: 3,
                    borderRadius: 7,
                    backgroundColor: COLORS.danger,
                    borderWidth: 1.5,
                    borderColor: COLORS.white,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontFamily: FONTS.bold,
                      fontSize: 8,
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
                width: 36,
                height: 36,
                borderRadius: 18,
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
                size={16}
                color={COLORS.navy}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Title section */}
      {(title || subtitle) && (
        <View style={{ paddingHorizontal: 20, marginTop: 8, marginBottom: 14 }}>
          {subtitle && (
            <Text
              style={{
                fontFamily: FONTS.medium,
                fontSize: 11,
                color: COLORS.gray500,
                letterSpacing: 0.2,
              }}
            >
              {subtitle}
            </Text>
          )}
          {title && (
            <Text
              style={{
                fontFamily: FONTS.black,
                fontSize: 21,
                color: COLORS.navy,
                marginTop: subtitle ? 1 : 0,
                letterSpacing: -0.3,
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
