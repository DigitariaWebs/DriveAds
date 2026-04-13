import { View, Text, ScrollView, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Company, Campaign } from '../../constants/Types';
import { Colors } from '../../constants/Colors';
import { Typography, FontFamily } from '../../constants/Typography';
import { Spacing, Radius, Shadows } from '../../constants/Spacing';
import BrandLogo from '../BrandLogo';
import Badge from '../ui/Badge';
import Card from '../ui/Card';

type Props = {
  visible: boolean;
  company: Company | null;
  campaigns: Campaign[];
  onClose: () => void;
};

export default function CompanyDetailModal({ visible, company, campaigns, onClose }: Props) {
  if (!company) return null;

  const relatedCampaigns = campaigns.filter((c) => c.companyId === company.id);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.modal}>
        <View style={styles.handle} />

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <BrandLogo domain={company.domain} name={company.companyName} size={64} />
            <Text style={styles.name}>{company.companyName}</Text>
            <View style={styles.badgeRow}>
              <Badge variant="navy" label={company.sector} />
              <Badge variant="neutral" label={company.city} icon="map-pin" />
            </View>
          </View>

          {/* Info */}
          <Card variant="surface" style={styles.infoCard}>
            {company.description ? (
              <Text style={styles.description}>{company.description}</Text>
            ) : null}

            <View style={styles.infoRow}>
              <Feather name="calendar" size={16} color={Colors.gray500} />
              <Text style={styles.infoLabel}>Fondée :</Text>
              <Text style={styles.infoValue}>{company.founded || '—'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Feather name="map-pin" size={16} color={Colors.gray500} />
              <Text style={styles.infoLabel}>Siège :</Text>
              <Text style={styles.infoValue}>{company.headquarters || '—'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Feather name="globe" size={16} color={Colors.gray500} />
              <Text style={styles.infoLabel}>Site :</Text>
              <Text style={styles.infoValue}>{company.website || '—'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Feather name="dollar-sign" size={16} color={Colors.gray500} />
              <Text style={styles.infoLabel}>Budget :</Text>
              <Text style={styles.infoValue}>{company.budgetTotal.toLocaleString()} €</Text>
            </View>
            <View style={styles.infoRow}>
              <Feather name="users" size={16} color={Colors.gray500} />
              <Text style={styles.infoLabel}>Employés :</Text>
              <Text style={styles.infoValue}>{company.employees || '—'}</Text>
            </View>
          </Card>

          {/* Gallery */}
          {company.gallery.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Galerie</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {company.gallery.map((url, i) => (
                  <Image
                    key={i}
                    source={{ uri: url }}
                    style={styles.galleryImage}
                    contentFit="cover"
                  />
                ))}
              </ScrollView>
            </View>
          )}

          {/* Related campaigns */}
          {relatedCampaigns.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Campagnes ({relatedCampaigns.length})
              </Text>
              {relatedCampaigns.map((c) => (
                <View key={c.id} style={styles.campaignRow}>
                  <View style={styles.campaignInfo}>
                    <Text style={styles.campaignTitle}>{c.title}</Text>
                    <Text style={styles.campaignMeta}>
                      {c.city} · {c.reward} € · {c.durationDays} jours
                    </Text>
                  </View>
                  <Badge
                    variant={
                      c.status === 'active' ? 'info' : c.status === 'completed' ? 'neutral' : 'success'
                    }
                    label={
                      c.status === 'active' ? 'En cours' : c.status === 'completed' ? 'Terminée' : 'Disponible'
                    }
                  />
                </View>
              ))}
            </View>
          )}

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Fermer</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: { flex: 1, backgroundColor: Colors.navyTint },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: Colors.gray300, alignSelf: 'center',
    marginTop: Spacing.md, marginBottom: Spacing.lg,
  },
  content: { paddingHorizontal: Spacing.xl, paddingBottom: Spacing.huge },

  header: { alignItems: 'center', marginBottom: Spacing.xl },
  name: { ...Typography.h1, color: Colors.black, marginTop: Spacing.lg, marginBottom: Spacing.md },
  badgeRow: { flexDirection: 'row', gap: Spacing.sm },

  infoCard: { marginBottom: Spacing.lg },
  description: { ...Typography.body, color: Colors.gray700, lineHeight: 24, marginBottom: Spacing.lg },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  infoLabel: { ...Typography.bodySmall, fontFamily: FontFamily.medium, color: Colors.gray600 },
  infoValue: { ...Typography.bodySmall, color: Colors.gray800, flex: 1 },

  section: { marginBottom: Spacing.xl },
  sectionTitle: { ...Typography.h3, color: Colors.black, marginBottom: Spacing.md },

  galleryImage: { width: 200, height: 140, borderRadius: Radius.md, marginRight: Spacing.md },

  campaignRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.gray100,
  },
  campaignInfo: { flex: 1 },
  campaignTitle: { ...Typography.bodyMedium, color: Colors.black },
  campaignMeta: { ...Typography.caption, color: Colors.gray500, marginTop: 2 },

  closeBtn: {
    alignItems: 'center', paddingVertical: Spacing.lg, marginTop: Spacing.lg,
    borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.navy,
  },
  closeBtnText: { ...Typography.button, color: Colors.navy },
});
