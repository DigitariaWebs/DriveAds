import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { FontFamily } from '../../constants/Typography';
import { Shadows } from '../../constants/Spacing';
import { TAB_BAR_HEIGHT, TAB_BAR_BOTTOM } from '../../constants/TabBarStyle';
import GradientHeader from '../../components/GradientHeader';

// ─── Types ──────────────────────────────────────────────────
type DocStatus = 'validated' | 'pending' | 'missing';

type Document = {
  id: string;
  icon: keyof typeof Feather.glyphMap;
  name: string;
  status: DocStatus;
  date: string | null;
};

const STATUS_CONFIG: Record<
  DocStatus,
  { label: string; bg: string; color: string }
> = {
  validated: { label: 'Validé', bg: 'rgba(16,185,129,0.14)', color: '#059669' },
  pending: { label: 'En attente', bg: 'rgba(245,158,11,0.16)', color: '#B45309' },
  missing: { label: 'Non fourni', bg: Colors.gray100, color: Colors.gray500 },
};

const DOCUMENTS: Document[] = [
  {
    id: '1',
    icon: 'credit-card',
    name: 'Permis de conduire',
    status: 'validated',
    date: '12 mars 2026',
  },
  {
    id: '2',
    icon: 'file-text',
    name: 'Carte grise',
    status: 'validated',
    date: '10 mars 2026',
  },
  {
    id: '3',
    icon: 'shield',
    name: "Attestation d'assurance",
    status: 'pending',
    date: '8 avril 2026',
  },
  {
    id: '4',
    icon: 'dollar-sign',
    name: 'RIB bancaire',
    status: 'missing',
    date: null,
  },
];

// ─── Component ──────────────────────────────────────────────
export default function DocumentsScreen() {
  const validatedCount = DOCUMENTS.filter((d) => d.status === 'validated').length;

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: TAB_BAR_HEIGHT + TAB_BAR_BOTTOM + 20,
        }}
      >
        <GradientHeader
          title="Mes documents"
          subtitle={`${validatedCount} / ${DOCUMENTS.length} documents validés`}
        />

        <View style={styles.content}>
          {DOCUMENTS.map((doc) => {
            const statusConfig = STATUS_CONFIG[doc.status];
            return (
              <TouchableOpacity
                key={doc.id}
                style={styles.docCard}
                activeOpacity={0.85}
              >
                <Feather
                  name={doc.icon}
                  size={20}
                  color={
                    doc.status === 'missing' ? Colors.gray400 : Colors.navy
                  }
                  style={styles.docIcon}
                />

                <View style={styles.docInfo}>
                  <Text style={styles.docName}>{doc.name}</Text>
                  <Text style={styles.docDate}>
                    {doc.date ? `Ajouté le ${doc.date}` : 'Non fourni'}
                  </Text>
                </View>

                <View
                  style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}
                >
                  <Text
                    style={[styles.statusText, { color: statusConfig.color }]}
                  >
                    {statusConfig.label}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity style={styles.addButton} activeOpacity={0.88}>
            <Feather name="upload" size={16} color={Colors.white} />
            <Text style={styles.addButtonText}>Ajouter un document</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F6F6F2',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  // Document card — flat, monochrome
  docCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 16,
    marginBottom: 10,
    gap: 14,
    borderWidth: 1,
    borderColor: Colors.gray100,
    ...Shadows.sm,
  },
  docIcon: {
    width: 24,
    textAlign: 'center',
  },
  docInfo: {
    flex: 1,
  },
  docName: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    color: Colors.black,
    letterSpacing: -0.1,
  },
  docDate: {
    fontFamily: FontFamily.regular,
    fontSize: 11.5,
    color: Colors.gray500,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 100,
  },
  statusText: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },

  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.navy,
    borderRadius: 100,
    height: 50,
    gap: 8,
    marginTop: 14,
    ...Shadows.md,
  },
  addButtonText: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    color: Colors.white,
  },
});
