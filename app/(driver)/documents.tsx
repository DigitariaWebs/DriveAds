import { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Colors } from '../../constants/Colors';
import { FontFamily } from '../../constants/Typography';
import { Shadows } from '../../constants/Spacing';
import { TAB_BAR_HEIGHT, TAB_BAR_BOTTOM } from '../../constants/TabBarStyle';
import GradientHeader from '../../components/GradientHeader';
import {
  fetchDocuments,
  submitDocumentType,
  type DocumentSummary,
  type DocumentType,
  type DocumentStatus,
} from '../../lib/documents-api';

const STATUS_CONFIG: Record<
  DocumentStatus,
  { label: string; bg: string; color: string; icon: keyof typeof Feather.glyphMap }
> = {
  approved: {
    label: 'Validé',
    bg: 'rgba(16,185,129,0.14)',
    color: '#059669',
    icon: 'check-circle',
  },
  pending: {
    label: 'En cours',
    bg: 'rgba(245,158,11,0.16)',
    color: '#B45309',
    icon: 'clock',
  },
  rejected: {
    label: 'Rejeté',
    bg: 'rgba(220,38,38,0.14)',
    color: '#B91C1C',
    icon: 'x-circle',
  },
  missing: {
    label: 'À fournir',
    bg: Colors.gray100,
    color: Colors.gray500,
    icon: 'upload',
  },
};

const TYPE_ICONS: Record<DocumentType, keyof typeof Feather.glyphMap> = {
  license: 'credit-card',
  registration: 'file-text',
  insurance: 'shield',
  rib: 'dollar-sign',
  vehicle_photos: 'camera',
};

type LocalAsset = { uri: string; name?: string; mimeType?: string };

export default function DocumentsScreen() {
  const [docs, setDocs] = useState<DocumentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingType, setUploadingType] = useState<DocumentType | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await fetchDocuments();
      setDocs(list);
    } catch {
      setDocs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const pickImages = async (count: number): Promise<LocalAsset[]> => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission refusée', 'Accès à la galerie nécessaire.');
      return [];
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: count > 1,
      selectionLimit: count,
      quality: 0.85,
    });
    if (res.canceled) return [];
    return res.assets.map((a) => ({
      uri: a.uri,
      name: a.fileName ?? `image-${Date.now()}.jpg`,
      mimeType: a.mimeType ?? 'image/jpeg',
    }));
  };

  const pickPdf = async (): Promise<LocalAsset[]> => {
    const res = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'image/*'],
      copyToCacheDirectory: true,
      multiple: false,
    });
    if (res.canceled) return [];
    const f = res.assets[0];
    return [
      {
        uri: f.uri,
        name: f.name,
        mimeType: f.mimeType ?? 'application/octet-stream',
      },
    ];
  };

  const handleUpload = async (doc: DocumentSummary) => {
    Alert.alert(
      doc.label,
      `${doc.requiredCount} fichier${doc.requiredCount > 1 ? 's' : ''} requis. Choisissez la source.`,
      [
        {
          text: 'Galerie (photos)',
          onPress: async () => {
            const assets = await pickImages(doc.requiredCount);
            if (assets.length === 0) return;
            if (assets.length !== doc.requiredCount) {
              Alert.alert(
                'Sélection incomplète',
                `Veuillez sélectionner exactement ${doc.requiredCount} fichier(s).`,
              );
              return;
            }
            await submit(doc.type, assets);
          },
        },
        ...(doc.requiredCount === 1
          ? [
              {
                text: 'Fichier (PDF/Image)',
                onPress: async () => {
                  const assets = await pickPdf();
                  if (assets.length === 0) return;
                  await submit(doc.type, assets);
                },
              },
            ]
          : []),
        { text: 'Annuler', style: 'cancel' as const },
      ],
    );
  };

  const submit = async (type: DocumentType, assets: LocalAsset[]) => {
    setUploadingType(type);
    try {
      const next = await submitDocumentType(type, assets);
      setDocs(next);
      Alert.alert('Envoyé', 'Vos documents sont en cours de vérification.');
    } catch (e: any) {
      Alert.alert('Erreur', e?.message ?? 'Envoi échoué.');
    } finally {
      setUploadingType(null);
    }
  };

  const approvedCount = docs.filter((d) => d.status === 'approved').length;

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: TAB_BAR_HEIGHT + TAB_BAR_BOTTOM + 20,
        }}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={load}
            tintColor={Colors.navy}
          />
        }
      >
        <GradientHeader
          title="Mes documents"
          subtitle={`${approvedCount} / ${docs.length} documents validés`}
        />

        <View style={styles.content}>
          {docs.map((doc) => {
            const status = STATUS_CONFIG[doc.status];
            const isUploading = uploadingType === doc.type;
            return (
              <TouchableOpacity
                key={doc.type}
                style={styles.docCard}
                onPress={() => handleUpload(doc)}
                disabled={isUploading || doc.status === 'pending'}
                activeOpacity={0.85}
              >
                <View style={styles.docTopRow}>
                  <Feather
                    name={TYPE_ICONS[doc.type]}
                    size={20}
                    color={
                      doc.status === 'missing'
                        ? Colors.gray400
                        : Colors.navy
                    }
                    style={styles.docIcon}
                  />

                  <View style={styles.docInfo}>
                    <Text style={styles.docName}>{doc.label}</Text>
                    <Text style={styles.docDate}>
                      {doc.filesCount > 0
                        ? `${doc.filesCount}/${doc.requiredCount} fichier${doc.requiredCount > 1 ? 's' : ''}`
                        : `${doc.requiredCount} fichier${doc.requiredCount > 1 ? 's' : ''} requis`}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: status.bg },
                    ]}
                  >
                    {isUploading ? (
                      <ActivityIndicator size="small" color={status.color} />
                    ) : (
                      <Text
                        style={[styles.statusText, { color: status.color }]}
                      >
                        {status.label}
                      </Text>
                    )}
                  </View>
                </View>

                <Text style={styles.docDescription}>{doc.description}</Text>

                {doc.status === 'rejected' && doc.rejectReason && (
                  <View style={styles.rejectBox}>
                    <Feather
                      name="alert-triangle"
                      size={14}
                      color={Colors.danger}
                    />
                    <Text style={styles.rejectText}>{doc.rejectReason}</Text>
                  </View>
                )}

                {doc.status !== 'pending' && (
                  <View style={styles.uploadHint}>
                    <Feather
                      name={
                        doc.status === 'missing' ? 'upload' : 'refresh-cw'
                      }
                      size={12}
                      color={Colors.navy}
                    />
                    <Text style={styles.uploadHintText}>
                      {doc.status === 'missing'
                        ? 'Toucher pour uploader'
                        : doc.status === 'rejected'
                          ? 'Toucher pour ré-uploader'
                          : 'Toucher pour remplacer'}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F6F6F2' },
  content: { paddingHorizontal: 20, paddingTop: 20 },

  docCard: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.gray100,
    ...Shadows.sm,
  },
  docTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  docIcon: { width: 24, textAlign: 'center' },
  docInfo: { flex: 1 },
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
  docDescription: {
    fontFamily: FontFamily.regular,
    fontSize: 11.5,
    color: Colors.gray500,
    marginTop: 8,
    lineHeight: 16,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 100,
    minWidth: 60,
    alignItems: 'center',
  },
  statusText: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  rejectBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 10,
    padding: 10,
    backgroundColor: 'rgba(220,38,38,0.08)',
    borderRadius: 10,
  },
  rejectText: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: Colors.danger,
    flex: 1,
    lineHeight: 16,
  },
  uploadHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  uploadHintText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 11,
    color: Colors.navy,
  },
});
