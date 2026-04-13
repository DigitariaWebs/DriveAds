import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Company, ValidationStatus } from '../constants/Types';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import { Spacing } from '../constants/Spacing';
import Card from './ui/Card';
import Badge from './ui/Badge';
import BrandLogo from './BrandLogo';

type Props = {
  company: Company;
  onPress?: () => void;
};

const statusBadge: Record<ValidationStatus, { variant: 'success' | 'warning' | 'danger'; label: string }> = {
  validated: { variant: 'success', label: 'Validée' },
  pending: { variant: 'warning', label: 'En attente' },
  rejected: { variant: 'danger', label: 'Refusée' },
};

export default function CompanyCard({ company, onPress }: Props) {
  const badge = statusBadge[company.status];

  return (
    <Card variant="surface" onPress={onPress} style={styles.card}>
      <View style={styles.row}>
        <BrandLogo domain={company.domain} name={company.companyName} size={44} />
        <View style={styles.info}>
          <Text style={styles.name}>{company.companyName}</Text>
          <View style={styles.detailsRow}>
            <Badge variant="navy" label={company.sector} />
          </View>
          <View style={styles.metaRow}>
            <Feather name="map-pin" size={13} color={Colors.gray500} />
            <Text style={styles.meta}>{company.city}</Text>
            {company.campaignsCount > 0 && (
              <>
                <Text style={styles.dot}>·</Text>
                <Feather name="volume-2" size={13} color={Colors.gray500} />
                <Text style={styles.meta}>
                  {company.campaignsCount} campagne{company.campaignsCount > 1 ? 's' : ''}
                </Text>
              </>
            )}
          </View>
        </View>
        <Badge variant={badge.variant} label={badge.label} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    marginLeft: Spacing.md,
    marginRight: Spacing.sm,
  },
  name: {
    ...Typography.h3,
    color: Colors.black,
  },
  detailsRow: {
    flexDirection: 'row',
    marginTop: Spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: Spacing.xs,
  },
  meta: {
    ...Typography.bodySmall,
    color: Colors.gray500,
  },
  dot: {
    color: Colors.gray400,
    marginHorizontal: 2,
  },
});
