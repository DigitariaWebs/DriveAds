import React, { useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Swipeable, RectButton } from 'react-native-gesture-handler';
import { NotificationItem as NotificationType } from '../constants/Types';
import { Colors } from '../constants/Colors';
import { FontFamily } from '../constants/Typography';
import { Feather } from '@expo/vector-icons';

type Props = {
  notification: NotificationType;
  onPress?: () => void;
  onArchive?: () => void;
  onDelete?: () => void;
};

export default function NotificationItemComponent({
  notification,
  onPress,
  onArchive,
  onDelete,
}: Props) {
  const unread = notification.unread;
  const swipeableRef = useRef<Swipeable>(null);

  const renderRightActions = (
    _progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>,
  ) => {
    const archiveScale = dragX.interpolate({
      inputRange: [-160, -80, 0],
      outputRange: [1, 0.9, 0.6],
      extrapolate: 'clamp',
    });
    const deleteScale = dragX.interpolate({
      inputRange: [-160, -80, 0],
      outputRange: [1, 0.9, 0.6],
      extrapolate: 'clamp',
    });

    return (
      <View style={styles.actionsRow}>
        <RectButton
          style={[styles.action, styles.archiveAction]}
          onPress={() => {
            swipeableRef.current?.close();
            onArchive?.();
          }}
        >
          <Animated.View style={{ transform: [{ scale: archiveScale }], alignItems: 'center' }}>
            <Feather name="archive" size={18} color={Colors.white} />
            <Text style={styles.actionLabel}>Archiver</Text>
          </Animated.View>
        </RectButton>
        <RectButton
          style={[styles.action, styles.deleteAction]}
          onPress={() => {
            swipeableRef.current?.close();
            onDelete?.();
          }}
        >
          <Animated.View style={{ transform: [{ scale: deleteScale }], alignItems: 'center' }}>
            <Feather name="trash-2" size={18} color={Colors.white} />
            <Text style={styles.actionLabel}>Supprimer</Text>
          </Animated.View>
        </RectButton>
      </View>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      friction={2}
      rightThreshold={40}
      overshootRight={false}
      containerStyle={styles.swipeContainer}
    >
      <RectButton
        style={[styles.card, unread && styles.cardUnread]}
        onPress={onPress}
      >
        <View style={styles.cardInner}>
          {/* Icon — flat monochrome */}
          <View style={styles.iconCol}>
            <Feather
              name={notification.icon as keyof typeof Feather.glyphMap}
              size={18}
              color={unread ? Colors.navy : Colors.gray500}
            />
          </View>

          {/* Content */}
          <View style={styles.content}>
            <View style={styles.titleRow}>
              <Text
                style={[styles.title, unread && styles.titleUnread]}
                numberOfLines={1}
              >
                {notification.title}
              </Text>
              <Text style={[styles.time, unread && styles.timeUnread]}>
                {notification.time}
              </Text>
            </View>
            <Text style={styles.body} numberOfLines={2}>
              {notification.body}
            </Text>
          </View>

          {/* Unread dot */}
          {unread && <View style={styles.dot} />}
        </View>
      </RectButton>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  swipeContainer: {
    borderRadius: 18,
    marginBottom: 8,
    overflow: 'hidden',
  },
  card: {
    borderRadius: 18,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray100,
  },
  cardUnread: {
    backgroundColor: '#F0F3FB',
    borderColor: 'rgba(35,52,102,0.1)',
  },
  cardInner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
    paddingRight: 16,
  },
  iconCol: {
    width: 34,
    alignItems: 'center',
    paddingTop: 2,
  },
  content: {
    flex: 1,
    marginLeft: 8,
    marginRight: 8,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
    gap: 8,
  },
  title: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13.5,
    color: Colors.gray700,
    flex: 1,
    letterSpacing: -0.1,
  },
  titleUnread: {
    fontFamily: FontFamily.bold,
    color: Colors.black,
  },
  time: {
    fontFamily: FontFamily.medium,
    fontSize: 10.5,
    color: Colors.gray400,
  },
  timeUnread: {
    color: Colors.navy,
  },
  body: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    lineHeight: 17,
    color: Colors.gray500,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.navy,
    marginTop: 6,
  },

  // Swipe actions
  actionsRow: {
    flexDirection: 'row',
    width: 160,
    height: '100%',
  },
  action: {
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  archiveAction: {
    backgroundColor: Colors.navyLight,
  },
  deleteAction: {
    backgroundColor: Colors.danger,
  },
  actionLabel: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: Colors.white,
    marginTop: 4,
    letterSpacing: 0.3,
  },
});
