import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/Colors';
import { FontFamily } from '../constants/Typography';
import { Shadows } from '../constants/Spacing';
import { useData } from '../context/DataContext';
import { TAB_BAR_HEIGHT, TAB_BAR_BOTTOM } from '../constants/TabBarStyle';
import NotificationItemComponent from './NotificationItem';

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const {
    notifications,
    unreadCount,
    markNotificationRead,
    markAllNotificationsRead,
  } = useData();

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Notifications</Text>
          <Text style={styles.headerSubtitle}>
            {notifications.length} notification{notifications.length > 1 ? 's' : ''}
          </Text>
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity
            onPress={markAllNotificationsRead}
            style={styles.markAllBtn}
            activeOpacity={0.7}
          >
            <Feather name="check" size={16} color={Colors.navy} />
            <Text style={styles.markAllText}>Tout lire</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Unread banner */}
      {unreadCount > 0 && (
        <View style={styles.bannerWrap}>
          <LinearGradient
            colors={[Colors.navy, Colors.navyLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.banner}
          >
            <View style={styles.bannerIcon}>
              <Feather name="bell" size={18} color={Colors.navy} />
            </View>
            <View style={styles.bannerText}>
              <Text style={styles.bannerCount}>{unreadCount} non lue{unreadCount > 1 ? 's' : ''}</Text>
              <Text style={styles.bannerHint}>Appuyez pour marquer comme lu</Text>
            </View>
            <View style={styles.bannerBadge}>
              <Text style={styles.bannerBadgeText}>{unreadCount}</Text>
            </View>
          </LinearGradient>
        </View>
      )}

      {/* List */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <NotificationItemComponent
            notification={item}
            onPress={() => markNotificationRead(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Feather name="bell-off" size={32} color={Colors.gray300} />
            </View>
            <Text style={styles.emptyTitle}>Aucune notification</Text>
            <Text style={styles.emptyText}>Vous êtes à jour</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.navyTint,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerTitle: {
    fontFamily: FontFamily.black,
    fontSize: 22,
    color: Colors.black,
  },
  headerSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: Colors.gray500,
    marginTop: 2,
  },
  markAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.navySoft,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 100,
  },
  markAllText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 11,
    color: Colors.navy,
  },

  // Banner
  bannerWrap: {
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 18,
    gap: 12,
  },
  bannerIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerText: {
    flex: 1,
  },
  bannerCount: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    color: Colors.white,
  },
  bannerHint: {
    fontFamily: FontFamily.regular,
    fontSize: 10,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 1,
  },
  bannerBadge: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerBadgeText: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: Colors.white,
  },

  // List
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: TAB_BAR_HEIGHT + TAB_BAR_BOTTOM + 16,
  },

  // Empty
  empty: {
    alignItems: 'center',
    paddingTop: 80,
    gap: 8,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  emptyTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 15,
    color: Colors.gray700,
  },
  emptyText: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: Colors.gray400,
  },
});
