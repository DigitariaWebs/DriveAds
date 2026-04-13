import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Typography, FontFamily } from '../../constants/Typography';
import { Spacing, Radius, Shadows } from '../../constants/Spacing';
import { useAuth } from '../../context/AuthContext';
import Screen from '../../components/ui/Screen';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

type MenuItem = {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  danger?: boolean;
  route?: string;
};

const MENU_ITEMS: MenuItem[] = [
  { icon: 'truck', label: 'Mes véhicules', route: '/(driver)/my-cars' },
  { icon: 'file-text', label: 'Documents', route: '/(driver)/documents' },
  { icon: 'credit-card', label: 'Paiements', route: '/(driver)/payments' },
  { icon: 'settings', label: 'Paramètres', route: '/(driver)/settings' },
  { icon: 'help-circle', label: 'Aide & Support', route: '/(driver)/support' },
  { icon: 'log-out', label: 'Se déconnecter', danger: true },
];

export default function DriverProfileScreen() {
  const { currentDriver, logout } = useAuth();

  const driver = currentDriver;
  const initials = driver
    ? `${driver.firstName[0]}${driver.lastName[0]}`.toUpperCase()
    : '??';

  const handleMenuPress = (item: MenuItem) => {
    if (item.danger) {
      logout().then(() => {
        router.replace('/(auth)/welcome');
      });
    } else if (item.route) {
      router.push(item.route as any);
    }
  };

  return (
    <Screen scroll>
      <View style={styles.content}>
        {/* Avatar + Name */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.name}>
            {driver ? `${driver.firstName} ${driver.lastName}` : 'Chauffeur'}
          </Text>
          <Text style={styles.email}>{driver?.email}</Text>
          {driver && (
            <Badge variant="navy" label={driver.city} icon="map-pin" />
          )}
        </View>

        {/* Stats row */}
        {driver && (
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{driver.totalEarnings.toLocaleString()} €</Text>
              <Text style={styles.statLabel}>gagnés</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{driver.campaignsDone}</Text>
              <Text style={styles.statLabel}>campagnes</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                <Feather name="star" size={13} color={Colors.warning} />
                <Text style={styles.statValue}>{driver.rating > 0 ? driver.rating.toFixed(1) : '—'}</Text>
              </View>
              <Text style={styles.statLabel}>note</Text>
            </View>
          </View>
        )}

        {/* Vehicle info card */}
        {driver && (
          <Card variant="surface" style={styles.vehicleCard}>
            <View style={styles.vehicleRow}>
              <Feather name="truck" size={22} color={Colors.navy} />
              <View style={styles.vehicleInfo}>
                <Text style={styles.vehicleModel}>
                  {driver.vehicleModel} · {driver.vehicleYear}
                </Text>
                <Text style={styles.vehiclePlate}>{driver.licensePlate}</Text>
              </View>
              <Badge variant="neutral" label={driver.vehicleType} />
            </View>
          </Card>
        )}

        {/* Menu list */}
        <Card variant="outlined" style={styles.menuCard} padding={0}>
          {MENU_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={item.label}
              style={[
                styles.menuItem,
                index < MENU_ITEMS.length - 1 && styles.menuItemBorder,
              ]}
              onPress={() => handleMenuPress(item)}
              activeOpacity={0.6}
            >
              <Feather
                name={item.icon}
                size={22}
                color={item.danger ? Colors.danger : Colors.navy}
              />
              <Text
                style={[
                  styles.menuLabel,
                  item.danger && styles.menuLabelDanger,
                ]}
              >
                {item.label}
              </Text>
              <Feather
                name="chevron-right"
                size={18}
                color={item.danger ? Colors.danger : Colors.gray400}
              />
            </TouchableOpacity>
          ))}
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.huge,
  },

  // Profile header
  profileHeader: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  avatarText: {
    fontFamily: FontFamily.bold,
    fontSize: 28,
    color: Colors.white,
  },
  name: {
    ...Typography.h2,
    color: Colors.black,
    marginBottom: Spacing.xs,
  },
  email: {
    ...Typography.bodySmall,
    color: Colors.gray500,
    marginBottom: Spacing.md,
  },

  // Stats row
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
    color: Colors.black,
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.gray500,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.gray200,
  },

  // Vehicle card
  vehicleCard: {
    marginBottom: Spacing.lg,
  },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleModel: {
    ...Typography.bodyMedium,
    color: Colors.black,
  },
  vehiclePlate: {
    ...Typography.caption,
    color: Colors.gray500,
    marginTop: 2,
  },

  // Menu
  menuCard: {
    marginBottom: Spacing.lg,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  menuLabel: {
    ...Typography.body,
    color: Colors.black,
    flex: 1,
  },
  menuLabelDanger: {
    color: Colors.danger,
  },
});
