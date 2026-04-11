import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../../../components/ScreenHeader';
import { Card } from '../../../components/Card';
import { Badge } from '../../../components/Badge';
import {
  notifications as initialNotifications,
  NotificationItem,
} from '../../../mocks/data';
import { COLORS, FONTS, RADIUS } from '../../../constants/theme';

interface NotificationsTabProps {
  onLogout: () => void;
}

const typeColorMap: Record<
  NotificationItem['type'],
  { bg: string; fg: string }
> = {
  campaign: { bg: COLORS.navySoft, fg: COLORS.navy },
  payment: { bg: COLORS.successSoft, fg: COLORS.success },
  validation: { bg: COLORS.infoSoft, fg: COLORS.info },
  system: { bg: COLORS.warningSoft, fg: COLORS.warning },
};

export function NotificationsTab({ onLogout }: NotificationsTabProps) {
  const [items, setItems] = useState(initialNotifications);
  const unreadCount = items.filter((n) => n.unread).length;

  const markAllRead = () => {
    setItems(items.map((n) => ({ ...n, unread: false })));
  };

  return (
    <View style={{ flex: 1 }}>
      <ScreenHeader
        subtitle="Centre d'alertes"
        title="Notifications"
        onLogoutPress={onLogout}
        rightAction={
          unreadCount > 0 ? (
            <TouchableOpacity
              onPress={markAllRead}
              style={{
                paddingHorizontal: 14,
                height: 36,
                borderRadius: RADIUS.full,
                backgroundColor: COLORS.navySoft,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  fontFamily: FONTS.semibold,
                  fontSize: 12,
                  color: COLORS.navy,
                }}
              >
                Tout lire
              </Text>
            </TouchableOpacity>
          ) : null
        }
      />

      {/* Stats summary */}
      <View style={{ paddingHorizontal: 24, marginBottom: 16 }}>
        <Card variant="navy" padding="xl">
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View>
              <Text
                style={{
                  fontFamily: FONTS.medium,
                  fontSize: 11,
                  color: 'rgba(255,255,255,0.7)',
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                }}
              >
                Non lues
              </Text>
              <Text
                style={{
                  fontFamily: FONTS.black,
                  fontSize: 30,
                  color: COLORS.white,
                  marginTop: 4,
                  letterSpacing: -0.5,
                }}
              >
                {unreadCount}
              </Text>
              <Text
                style={{
                  fontFamily: FONTS.regular,
                  fontSize: 12,
                  color: 'rgba(255,255,255,0.7)',
                  marginTop: 2,
                }}
              >
                sur {items.length} notifications
              </Text>
            </View>
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: 'rgba(255,255,255,0.12)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons
                name="notifications"
                size={26}
                color={COLORS.white}
              />
            </View>
          </View>
        </Card>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: 120,
          gap: 10,
        }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const colors = typeColorMap[item.type];
          return (
            <Card padding="lg">
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: colors.bg,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons name={item.icon} size={20} color={colors.fg} />
                </View>

                <View style={{ flex: 1, marginLeft: 14 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                    }}
                  >
                    <Text
                      style={{
                        flex: 1,
                        fontFamily: FONTS.bold,
                        fontSize: 14,
                        color: COLORS.navy,
                        paddingRight: 8,
                      }}
                    >
                      {item.title}
                    </Text>
                    {item.unread && (
                      <View
                        style={{
                          width: 9,
                          height: 9,
                          borderRadius: 5,
                          backgroundColor: COLORS.danger,
                          marginTop: 4,
                        }}
                      />
                    )}
                  </View>
                  <Text
                    style={{
                      fontFamily: FONTS.regular,
                      fontSize: 12,
                      lineHeight: 17,
                      color: COLORS.gray600,
                      marginTop: 3,
                    }}
                  >
                    {item.body}
                  </Text>
                  <Text
                    style={{
                      fontFamily: FONTS.medium,
                      fontSize: 11,
                      color: COLORS.gray400,
                      marginTop: 6,
                    }}
                  >
                    {item.time}
                  </Text>
                </View>
              </View>
            </Card>
          );
        }}
      />
    </View>
  );
}
