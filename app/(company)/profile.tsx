import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Typography, FontFamily } from '../../constants/Typography';
import { Spacing, Radius, Shadows } from '../../constants/Spacing';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Screen from '../../components/ui/Screen';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import BrandLogo from '../../components/BrandLogo';

export default function CompanyProfileScreen() {
  const { currentCompany, logout } = useAuth();
  const { campaigns } = useData();

  const company = currentCompany;
  const companyId = company?.id ?? 'c1';

  const companyCampaigns = campaigns.filter((c) => c.companyId === companyId);
  const totalBudget = companyCampaigns.reduce((sum, c) => sum + c.reward * c.driversNeeded, 0);
  const uniqueCities = [...new Set(companyCampaigns.map((c) => c.city))];

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/welcome');
  };

  return (
    <Screen scroll>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.profileHeader}>
          <BrandLogo
            domain={company?.domain ?? 'company.com'}
            name={company?.companyName ?? 'E'}
            size={80}
          />
          <Text style={styles.name}>{company?.companyName ?? 'Entreprise'}</Text>
          <View style={styles.badgeRow}>
            {company?.sector && <Badge variant="navy" label={company.sector} />}
            {company?.city && <Badge variant="neutral" label={company.city} icon="map-pin" />}
          </View>
        </View>

        {/* Contact info card */}
        <Card variant="surface" style={styles.infoCard}>
          <Text style={styles.cardTitle}>Informations de contact</Text>
          <View style={styles.infoRow}>
            <Feather name="user" size={18} color={Colors.gray500} />
            <Text style={styles.infoValue}>{company?.contactName ?? '—'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Feather name="mail" size={18} color={Colors.gray500} />
            <Text style={styles.infoValue}>{company?.email ?? '—'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Feather name="phone" size={18} color={Colors.gray500} />
            <Text style={styles.infoValue}>{company?.phone ?? '—'}</Text>
          </View>
          {company?.website ? (
            <View style={styles.infoRow}>
              <Feather name="globe" size={18} color={Colors.gray500} />
              <Text style={styles.infoValue}>{company.website}</Text>
            </View>
          ) : null}
        </Card>

        {/* Activity card */}
        <Card variant="surface" style={styles.infoCard}>
          <Text style={styles.cardTitle}>Activité</Text>
          <View style={styles.activityRow}>
            <View style={styles.activityStat}>
              <Text style={styles.activityValue}>{companyCampaigns.length}</Text>
              <Text style={styles.activityLabel}>Campagnes lancées</Text>
            </View>
            <View style={styles.activityDivider} />
            <View style={styles.activityStat}>
              <Text style={styles.activityValue}>{totalBudget.toLocaleString()} €</Text>
              <Text style={styles.activityLabel}>Budget total</Text>
            </View>
            <View style={styles.activityDivider} />
            <View style={styles.activityStat}>
              <Text style={styles.activityValue}>{uniqueCities.length}</Text>
              <Text style={styles.activityLabel}>Villes ciblées</Text>
            </View>
          </View>
        </Card>

        {/* Actions */}
        <View style={styles.actions}>
          <Button variant="outline" size="lg" icon="edit" onPress={() => {}}>
            Modifier le profil
          </Button>
          <View style={styles.actionSpacer} />
          <Button variant="danger" size="lg" icon="log-out" onPress={handleLogout}>
            Se déconnecter
          </Button>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.huge,
  },

  // Header
  profileHeader: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  name: {
    ...Typography.h1,
    color: Colors.black,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },

  // Info card
  infoCard: {
    marginBottom: Spacing.lg,
  },
  cardTitle: {
    ...Typography.h3,
    color: Colors.black,
    marginBottom: Spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  infoValue: {
    ...Typography.body,
    color: Colors.gray700,
    flex: 1,
  },

  // Activity
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityStat: {
    flex: 1,
    alignItems: 'center',
  },
  activityDivider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.gray200,
  },
  activityValue: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
    color: Colors.navy,
  },
  activityLabel: {
    ...Typography.caption,
    color: Colors.gray500,
    marginTop: 2,
    textAlign: 'center',
  },

  // Actions
  actions: {
    marginTop: Spacing.lg,
  },
  actionSpacer: {
    height: Spacing.md,
  },
});
