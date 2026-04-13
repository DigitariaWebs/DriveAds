import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NotificationItem as NotificationType } from '../constants/Types';
import { Colors } from '../constants/Colors';
import { FontFamily } from '../constants/Typography';
import { Shadows } from '../constants/Spacing';
import { Feather } from '@expo/vector-icons';

type Props = {
  notification: NotificationType;
  onPress?: () => void;
};

const typeConfig: Record<string, { color: string; bg: string; icon: string }> = {
  campaign: { color: Colors.navy, bg: Colors.navySoft, icon: 'volume-2' },
  payment: { color: Colors.success, bg: Colors.successSoft, icon: 'credit-card' },
  validation: { color: Colors.info, bg: Colors.infoSoft, icon: 'check-circle' },
  system: { color: Colors.warning, bg: Colors.warningSoft, icon: 'settings' },
};

export default function NotificationItemComponent({ notification, onPress }: Props) {
  const config = typeConfig[notification.type] || typeConfig.campaign;

  return (
    <TouchableOpacity
      style={[styles.card, notification.unread && styles.cardUnread]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Icon */}
      <View style={[styles.iconWrap, { backgroundColor: config.bg }]}>
        <Feather
          name={notification.icon as keyof typeof Feather.glyphMap}
          size={18}
          color={config.color}
        />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, notification.unread && styles.titleUnread]} numberOfLines={1}>
            {notification.title}
          </Text>
          <Text style={styles.time}>{notification.time}</Text>
        </View>
        <Text style={styles.body} numberOfLines={2}>
          {notification.body}
        </Text>
      </View>

      {/* Unread dot */}
      {notification.unread && <View style={styles.dot} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.gray100,
  },
  cardUnread: {
    backgroundColor: Colors.navySoft,
    borderColor: 'rgba(35, 52, 102, 0.08)',
    ...Shadows.sm,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    marginLeft: 10,
    marginRight: 6,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  title: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
    color: Colors.gray700,
    flex: 1,
    marginRight: 8,
  },
  titleUnread: {
    fontFamily: FontFamily.bold,
    color: Colors.black,
  },
  time: {
    fontFamily: FontFamily.regular,
    fontSize: 10,
    color: Colors.gray400,
  },
  body: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    lineHeight: 16,
    color: Colors.gray500,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.navy,
    marginTop: 4,
  },
});
