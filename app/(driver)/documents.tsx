import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { FontFamily } from '../../constants/Typography';
import { Shadows } from '../../constants/Spacing';
import { TAB_BAR_HEIGHT, TAB_BAR_BOTTOM } from '../../constants/TabBarStyle';

// ─── Types ──────────────────────────────────────────────────
type DocStatus = 'validated' | 'pending' | 'missing';

type Document = {
  id: string;
  icon: keyof typeof Feather.glyphMap;
  iconBg: string;
  iconColor: string;
  name: string;
  status: DocStatus;
  date: string | null;
};

const STATUS_CONFIG: Record<DocStatus, { label: string; bg: string; color: string }> = {
  validated: { label: 'Validé', bg: Colors.successSoft, color: Colors.success },
  pending: { label: 'En attente', bg: Colors.warningSoft, color: Colors.warning },
  missing: { label: 'Non fourni', bg: Colors.gray100, color: Colors.gray500 },
};

const DOCUMENTS: Document[] = [
  {
    id: '1',
    icon: 'credit-card',
    iconBg: Colors.infoSoft,
    iconColor: Colors.info,
    name: 'Permis de conduire',
    status: 'validated',
    date: '12 mars 2026',
  },
  {
    id: '2',
    icon: 'file-text',
    iconBg: Colors.successSoft,
    iconColor: Colors.success,
    name: 'Carte grise',
    status: 'validated',
    date: '10 mars 2026',
  },
  {
    id: '3',
    icon: 'shield',
    iconBg: Colors.warningSoft,
    iconColor: Colors.warning,
    name: "Attestation d'assurance",
    status: 'pending',
    date: '8 avril 2026',
  },
  {
    id: '4',
    icon: 'dollar-sign',
    iconBg: Colors.navySoft,
    iconColor: Colors.navy,
    name: 'RIB bancaire',
    status: 'missing',
    date: null,
  },
];

// ─── Component ──────────────────────────────────────────────
export default function DocumentsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <Feather name="arrow-left" size={22} color={Colors.navy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes documents</Text>
        <View style={styles.headerBtnPlaceholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT + TAB_BAR_BOTTOM + 20 }}
      >
        <View style={styles.content}>
          {/* Document cards */}
          {DOCUMENTS.map((doc) => {
            const statusConfig = STATUS_CONFIG[doc.status];
            return (
              <TouchableOpacity key={doc.id} style={styles.docCard} activeOpacity={0.7}>
                {/* Icon */}
                <View style={[styles.docIconWrap, { backgroundColor: doc.iconBg }]}>
                  <Feather name={doc.icon} size={20} color={doc.iconColor} />
                </View>

                {/* Info */}
                <View style={styles.docInfo}>
                  <Text style={styles.docName}>{doc.name}</Text>
                  <Text style={styles.docDate}>
                    {doc.date ? `Ajouté le ${doc.date}` : 'Non fourni'}
                  </Text>
                </View>

                {/* Status badge */}
                <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
                  <Text style={[styles.statusText, { color: statusConfig.color }]}>
                    {statusConfig.label}
                  </Text>
                </View>

                <Feather name="chevron-right" size={18} color={Colors.gray400} />
              </TouchableOpacity>
            );
          })}

          {/* Add document button */}
          <TouchableOpacity style={styles.addButton} activeOpacity={0.7}>
            <Feather name="upload" size={18} color={Colors.white} />
            <Text style={styles.addButtonText}>Ajouter un document</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.navyTint },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  headerBtnPlaceholder: { width: 40 },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontFamily: FontFamily.bold,
    fontSize: 16,
    color: Colors.navy,
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },

  // Document card
  docCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    gap: 12,
    ...Shadows.sm,
  },
  docIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  docInfo: {
    flex: 1,
  },
  docName: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
    color: Colors.black,
  },
  docDate: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: Colors.gray500,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 100,
  },
  statusText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },

  // Add button
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.navy,
    borderRadius: 9999,
    height: 44,
    gap: 8,
    marginTop: 8,
  },
  addButtonText: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    color: Colors.white,
  },
});
