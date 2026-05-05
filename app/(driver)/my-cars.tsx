import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '../../constants/Colors';
import { FontFamily } from '../../constants/Typography';
import { Shadows } from '../../constants/Spacing';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import GradientHeader from '../../components/GradientHeader';
import { TAB_BAR_HEIGHT, TAB_BAR_BOTTOM } from '../../constants/TabBarStyle';
import {
  fetchVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  activateVehicle,
  addVehiclePhotos,
  deleteVehiclePhoto,
  type Vehicle,
  type VehicleType,
} from '../../lib/vehicles-api';
import { uploadAsset } from '../../lib/asset-upload';

const VEHICLE_TYPES: VehicleType[] = ['Berline', 'SUV', 'Utilitaire', 'Autre'];

const PLACEHOLDER_PHOTO = require('../../assets/car/golf---1.jpg');

function fullName(v: Vehicle): string {
  return `${v.make} ${v.model}`.trim();
}

export default function MyCarsScreen() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [max, setMax] = useState(3);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState(0);

  // Edit modal
  const [showEdit, setShowEdit] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editMake, setEditMake] = useState('');
  const [editModel, setEditModel] = useState('');
  const [editPlate, setEditPlate] = useState('');
  const [editYear, setEditYear] = useState('');
  const [editType, setEditType] = useState<VehicleType>('Berline');

  // Add modal
  const [showAdd, setShowAdd] = useState(false);
  const [newMake, setNewMake] = useState('');
  const [newModel, setNewModel] = useState('');
  const [newPlate, setNewPlate] = useState('');
  const [newYear, setNewYear] = useState('');
  const [newType, setNewType] = useState<VehicleType>('Berline');

  const [submitting, setSubmitting] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);

  const selected = useMemo(
    () => vehicles.find((v) => v.id === selectedId) ?? vehicles[0] ?? null,
    [vehicles, selectedId],
  );

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchVehicles();
      setVehicles(res.vehicles);
      setMax(res.max);
      if (res.vehicles.length > 0 && !res.vehicles.find((v) => v.id === selectedId)) {
        setSelectedId(res.vehicles[0].id);
        setSelectedPhoto(0);
      }
    } catch {
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  }, [selectedId]);

  useEffect(() => {
    load();
  }, [load]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const openEdit = (v: Vehicle) => {
    setEditId(v.id);
    setEditMake(v.make);
    setEditModel(v.model);
    setEditPlate(v.licensePlate);
    setEditYear(v.year);
    setEditType(v.type);
    setShowEdit(true);
  };

  const saveEdit = async () => {
    if (!editId) return;
    if (!editMake.trim() || !editModel.trim() || !editPlate.trim()) {
      Alert.alert('Erreur', 'Marque, modèle et plaque obligatoires.');
      return;
    }
    setSubmitting(true);
    try {
      await updateVehicle(editId, {
        make: editMake.trim(),
        model: editModel.trim(),
        licensePlate: editPlate.trim(),
        year: editYear.trim() || '2024',
        type: editType,
      });
      await load();
      setShowEdit(false);
      Alert.alert('Succès', 'Véhicule modifié.');
    } catch (e: any) {
      Alert.alert('Erreur', e?.message ?? 'Sauvegarde échouée.');
    } finally {
      setSubmitting(false);
    }
  };

  const removeVehicle = (v: Vehicle) => {
    Alert.alert(
      'Supprimer',
      `Supprimer "${fullName(v)}" ? Photos et inspection associées seront aussi supprimées.`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteVehicle(v.id);
              await load();
              setShowEdit(false);
            } catch (e: any) {
              Alert.alert('Erreur', e?.message ?? 'Suppression échouée.');
            }
          },
        },
      ],
    );
  };

  const toggleActive = async (v: Vehicle) => {
    if (v.isActive) return;
    try {
      const next = await activateVehicle(v.id);
      setVehicles(next);
    } catch (e: any) {
      Alert.alert('Erreur', e?.message ?? 'Activation échouée.');
    }
  };

  const addCar = async () => {
    if (!newMake.trim() || !newModel.trim() || !newPlate.trim()) {
      Alert.alert('Erreur', 'Marque, modèle et plaque obligatoires.');
      return;
    }
    setSubmitting(true);
    try {
      await createVehicle({
        make: newMake.trim(),
        model: newModel.trim(),
        licensePlate: newPlate.trim(),
        year: newYear.trim() || '2024',
        type: newType,
      });
      setNewMake('');
      setNewModel('');
      setNewPlate('');
      setNewYear('');
      setNewType('Berline');
      setShowAdd(false);
      await load();
      Alert.alert('Succès', 'Véhicule ajouté.');
    } catch (e: any) {
      Alert.alert('Erreur', e?.message ?? 'Ajout échoué.');
    } finally {
      setSubmitting(false);
    }
  };

  const pickAndUploadPhotos = async () => {
    if (!selected) return;
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission refusée', 'Accès galerie nécessaire.');
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 5,
      quality: 0.85,
    });
    if (res.canceled) return;
    setPhotoUploading(true);
    try {
      const uploaded = [];
      for (const a of res.assets) {
        const f = await uploadAsset(
          {
            uri: a.uri,
            name: a.fileName ?? `vehicle-${Date.now()}.jpg`,
            mimeType: a.mimeType ?? 'image/jpeg',
          },
          'asset',
        );
        uploaded.push(f);
      }
      const updated = await addVehiclePhotos(selected.id, uploaded);
      setVehicles((prev) =>
        prev.map((v) => (v.id === updated.id ? updated : v)),
      );
    } catch (e: any) {
      Alert.alert('Erreur', e?.message ?? 'Upload échoué.');
    } finally {
      setPhotoUploading(false);
    }
  };

  const removePhoto = (publicId: string) => {
    if (!selected) return;
    if (selected.photos.length === 0) return;
    Alert.alert('Supprimer', 'Supprimer cette photo ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          try {
            const updated = await deleteVehiclePhoto(selected.id, publicId);
            setVehicles((prev) =>
              prev.map((v) => (v.id === updated.id ? updated : v)),
            );
            if (selectedPhoto >= updated.photos.length) {
              setSelectedPhoto(Math.max(0, updated.photos.length - 1));
            }
          } catch (e: any) {
            Alert.alert('Erreur', e?.message ?? 'Suppression échouée.');
          }
        },
      },
    ]);
  };

  const canAdd = vehicles.length < max;

  if (loading && vehicles.length === 0) {
    return (
      <View style={[styles.screen, styles.center]}>
        <ActivityIndicator color={Colors.navy} />
      </View>
    );
  }

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
          title="Mes véhicules"
          subtitle={`${vehicles.length} / ${max} véhicule${vehicles.length > 1 ? 's' : ''}`}
          rightIcon={canAdd ? 'plus' : undefined}
          onRightPress={canAdd ? () => setShowAdd(true) : undefined}
        />

        {vehicles.length === 0 ? (
          <View style={styles.empty}>
            <Feather name="truck" size={32} color={Colors.gray400} />
            <Text style={styles.emptyTitle}>Aucun véhicule enregistré</Text>
            <View style={{ marginTop: 12 }}>
              <Button variant="primary" size="md" icon="plus" onPress={() => setShowAdd(true)}>
                Ajouter un véhicule
              </Button>
            </View>
          </View>
        ) : (
          <>
            <View style={styles.carsContentTop} />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.carSelectorRow}
              style={styles.carSelectorScroll}
            >
              {vehicles.map((v) => {
                const isSelected = selected?.id === v.id;
                const cover = v.photos[0]?.url
                  ? { uri: v.photos[0].url }
                  : PLACEHOLDER_PHOTO;
                return (
                  <TouchableOpacity
                    key={v.id}
                    style={[styles.carTab, isSelected && styles.carTabActive]}
                    onPress={() => {
                      setSelectedId(v.id);
                      setSelectedPhoto(0);
                    }}
                    activeOpacity={0.7}
                  >
                    <Image source={cover} style={styles.carTabImage} />
                    <View style={styles.carTabInfo}>
                      <Text
                        style={[
                          styles.carTabName,
                          isSelected && styles.carTabNameActive,
                        ]}
                      >
                        {fullName(v)}
                      </Text>
                      <Text style={styles.carTabPlate}>{v.licensePlate}</Text>
                    </View>
                    {v.isActive && <Badge variant="success" label="Active" />}
                  </TouchableOpacity>
                );
              })}

              {canAdd && (
                <TouchableOpacity
                  style={styles.addCarTab}
                  onPress={() => setShowAdd(true)}
                  activeOpacity={0.7}
                >
                  <Feather name="plus" size={20} color={Colors.navy} />
                  <Text style={styles.addCarText}>Ajouter</Text>
                </TouchableOpacity>
              )}
            </ScrollView>

            {selected && (
              <>
                <View style={styles.mainPhotoWrap}>
                  <Image
                    source={
                      selected.photos[selectedPhoto]?.url
                        ? { uri: selected.photos[selectedPhoto].url }
                        : PLACEHOLDER_PHOTO
                    }
                    style={styles.mainPhoto}
                  />
                  <View style={styles.photoCounter}>
                    <Text style={styles.photoCounterText}>
                      {selected.photos.length === 0
                        ? '0/0'
                        : `${selectedPhoto + 1}/${selected.photos.length}`}
                    </Text>
                  </View>
                  {selected.photos[selectedPhoto] && (
                    <TouchableOpacity
                      style={styles.deletePhotoBtn}
                      onPress={() =>
                        removePhoto(selected.photos[selectedPhoto].publicId)
                      }
                    >
                      <Feather name="trash-2" size={16} color={Colors.white} />
                    </TouchableOpacity>
                  )}
                </View>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.thumbRow}
                  style={styles.thumbScroll}
                >
                  {selected.photos.map((p, i) => (
                    <TouchableOpacity
                      key={p.publicId}
                      onPress={() => setSelectedPhoto(i)}
                      activeOpacity={0.7}
                    >
                      <Image
                        source={{ uri: p.url }}
                        style={[
                          styles.thumb,
                          selectedPhoto === i && styles.thumbActive,
                        ]}
                      />
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity
                    style={styles.addPhotoThumb}
                    onPress={pickAndUploadPhotos}
                    disabled={photoUploading}
                    activeOpacity={0.7}
                  >
                    {photoUploading ? (
                      <ActivityIndicator size="small" color={Colors.navy} />
                    ) : (
                      <Feather name="camera" size={18} color={Colors.navy} />
                    )}
                  </TouchableOpacity>
                </ScrollView>

                <View style={styles.detailsSection}>
                  <View style={styles.nameRow}>
                    <Text style={styles.carName}>{fullName(selected)}</Text>
                    <TouchableOpacity
                      style={styles.editBtn}
                      onPress={() => openEdit(selected)}
                    >
                      <Feather name="edit-2" size={16} color={Colors.navy} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.badgeRow}>
                    <Badge variant="navy" label={selected.type} />
                    <Badge variant="neutral" label={selected.year} />
                    {selected.isActive ? (
                      <Badge variant="success" label="En service" />
                    ) : (
                      <TouchableOpacity onPress={() => toggleActive(selected)}>
                        <Badge variant="warning" label="Activer" />
                      </TouchableOpacity>
                    )}
                  </View>

                  <View style={styles.infoCard}>
                    <InfoRow
                      icon="credit-card"
                      label="Plaque"
                      value={selected.licensePlate}
                    />
                    <InfoRow icon="calendar" label="Année" value={selected.year} />
                    <InfoRow icon="truck" label="Type" value={selected.type} />
                    <InfoRow
                      icon="image"
                      label="Photos"
                      value={`${selected.photos.length} photo${selected.photos.length !== 1 ? 's' : ''}`}
                    />
                    {selected.inspection && (
                      <InfoRow
                        icon="shield"
                        label="Contrôle"
                        value={
                          selected.inspection.status === 'missing'
                            ? 'Non renseigné'
                            : selected.inspection.status === 'expired'
                              ? `Expiré (${Math.abs(selected.inspection.daysUntilExpiry ?? 0)}j)`
                              : selected.inspection.status === 'expiring'
                                ? `Expire dans ${selected.inspection.daysUntilExpiry}j`
                                : `Valide (${selected.inspection.daysUntilExpiry}j)`
                        }
                      />
                    )}
                  </View>

                  <View style={styles.actionsRow}>
                    <View style={styles.actionBtn}>
                      <Button
                        variant="outline"
                        size="md"
                        icon="edit-2"
                        onPress={() => openEdit(selected)}
                      >
                        Modifier
                      </Button>
                    </View>
                    <View style={styles.actionBtn}>
                      <Button
                        variant="danger"
                        size="md"
                        icon="trash-2"
                        onPress={() => removeVehicle(selected)}
                      >
                        Supprimer
                      </Button>
                    </View>
                  </View>
                </View>
              </>
            )}
          </>
        )}
      </ScrollView>

      <Modal
        visible={showEdit}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowEdit(false)}
      >
        <View style={styles.modal}>
          <View style={styles.modalHandle} />
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Modifier le véhicule</Text>
            <TouchableOpacity onPress={() => setShowEdit(false)}>
              <Feather name="x" size={22} color={Colors.gray500} />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.modalContent}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.fieldLabel}>Marque</Text>
            <TextInput
              style={styles.input}
              value={editMake}
              onChangeText={setEditMake}
              placeholder="Audi"
              placeholderTextColor={Colors.gray400}
            />

            <Text style={styles.fieldLabel}>Modèle</Text>
            <TextInput
              style={styles.input}
              value={editModel}
              onChangeText={setEditModel}
              placeholder="Q5"
              placeholderTextColor={Colors.gray400}
            />

            <Text style={styles.fieldLabel}>Plaque d'immatriculation</Text>
            <TextInput
              style={styles.input}
              value={editPlate}
              onChangeText={setEditPlate}
              placeholder="AB-123-CD"
              placeholderTextColor={Colors.gray400}
              autoCapitalize="characters"
            />

            <Text style={styles.fieldLabel}>Année</Text>
            <TextInput
              style={styles.input}
              value={editYear}
              onChangeText={setEditYear}
              placeholder="2022"
              placeholderTextColor={Colors.gray400}
              keyboardType="number-pad"
            />

            <Text style={styles.fieldLabel}>Type de véhicule</Text>
            <View style={styles.typeRow}>
              {VEHICLE_TYPES.map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.typeChip, editType === t && styles.typeChipActive]}
                  onPress={() => setEditType(t)}
                >
                  <Text
                    style={[
                      styles.typeChipText,
                      editType === t && styles.typeChipTextActive,
                    ]}
                  >
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActions}>
              <Button
                variant="primary"
                size="lg"
                icon="check"
                loading={submitting}
                onPress={saveEdit}
              >
                Enregistrer
              </Button>
              <View style={{ height: 10 }} />
              <Button
                variant="danger"
                size="md"
                icon="trash-2"
                onPress={() => {
                  const v = vehicles.find((x) => x.id === editId);
                  if (v) removeVehicle(v);
                }}
              >
                Supprimer ce véhicule
              </Button>
            </View>
          </ScrollView>
        </View>
      </Modal>

      <Modal
        visible={showAdd}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAdd(false)}
      >
        <View style={styles.modal}>
          <View style={styles.modalHandle} />
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Ajouter un véhicule</Text>
            <TouchableOpacity onPress={() => setShowAdd(false)}>
              <Feather name="x" size={22} color={Colors.gray500} />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.modalContent}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.fieldLabel}>Marque</Text>
            <TextInput
              style={styles.input}
              value={newMake}
              onChangeText={setNewMake}
              placeholder="Peugeot"
              placeholderTextColor={Colors.gray400}
            />

            <Text style={styles.fieldLabel}>Modèle</Text>
            <TextInput
              style={styles.input}
              value={newModel}
              onChangeText={setNewModel}
              placeholder="308"
              placeholderTextColor={Colors.gray400}
            />

            <Text style={styles.fieldLabel}>Plaque d'immatriculation</Text>
            <TextInput
              style={styles.input}
              value={newPlate}
              onChangeText={setNewPlate}
              placeholder="AB-123-CD"
              placeholderTextColor={Colors.gray400}
              autoCapitalize="characters"
            />

            <Text style={styles.fieldLabel}>Année</Text>
            <TextInput
              style={styles.input}
              value={newYear}
              onChangeText={setNewYear}
              placeholder="2024"
              placeholderTextColor={Colors.gray400}
              keyboardType="number-pad"
            />

            <Text style={styles.fieldLabel}>Type de véhicule</Text>
            <View style={styles.typeRow}>
              {VEHICLE_TYPES.map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.typeChip, newType === t && styles.typeChipActive]}
                  onPress={() => setNewType(t)}
                >
                  <Text
                    style={[
                      styles.typeChipText,
                      newType === t && styles.typeChipTextActive,
                    ]}
                  >
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.uploadHint}>
              <Feather name="info" size={14} color={Colors.gray400} />
              <Text style={styles.uploadHintText}>
                Vous pourrez ajouter des photos après création.
              </Text>
            </View>

            <View style={styles.modalActions}>
              <Button
                variant="primary"
                size="lg"
                icon="plus"
                loading={submitting}
                onPress={addCar}
              >
                Ajouter le véhicule
              </Button>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      <Feather name={icon} size={16} color={Colors.gray400} />
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F6F6F2' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  empty: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 40,
    gap: 8,
  },
  emptyTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
    color: Colors.gray700,
    marginTop: 8,
  },

  carsContentTop: { height: 16 },

  carSelectorScroll: { flexGrow: 0 },
  carSelectorRow: {
    paddingHorizontal: 16,
    gap: 10,
    paddingBottom: 16,
  },
  carTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 10,
    gap: 10,
    borderWidth: 1.5,
    borderColor: Colors.gray200,
    ...Shadows.sm,
  },
  carTabActive: {
    borderColor: Colors.navy,
    backgroundColor: Colors.navySoft,
  },
  carTabImage: { width: 48, height: 36, borderRadius: 8 },
  carTabInfo: {},
  carTabName: { fontFamily: FontFamily.bold, fontSize: 13, color: Colors.gray700 },
  carTabNameActive: { color: Colors.navy },
  carTabPlate: {
    fontFamily: FontFamily.regular,
    fontSize: 10,
    color: Colors.gray400,
    marginTop: 1,
  },
  addCarTab: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 10,
    paddingHorizontal: 20,
    gap: 4,
    borderWidth: 1.5,
    borderColor: Colors.gray200,
    borderStyle: 'dashed',
  },
  addCarText: {
    fontFamily: FontFamily.medium,
    fontSize: 11,
    color: Colors.navy,
  },

  mainPhotoWrap: {
    marginHorizontal: 16,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 12,
    ...Shadows.md,
  },
  mainPhoto: { width: '100%', height: 220, borderRadius: 20 },
  photoCounter: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  photoCounterText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 11,
    color: Colors.white,
  },
  deletePhotoBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(239,68,68,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  thumbScroll: { flexGrow: 0 },
  thumbRow: { paddingHorizontal: 16, gap: 8, paddingBottom: 20 },
  thumb: {
    width: 56,
    height: 42,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  thumbActive: { borderColor: Colors.navy },
  addPhotoThumb: {
    width: 56,
    height: 42,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.gray200,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },

  detailsSection: { paddingHorizontal: 16 },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  carName: { fontFamily: FontFamily.black, fontSize: 22, color: Colors.black },
  editBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: Colors.navySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeRow: { flexDirection: 'row', gap: 6, marginBottom: 16 },

  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    ...Shadows.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  infoLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: Colors.gray500,
    width: 70,
  },
  infoValue: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    color: Colors.black,
    flex: 1,
  },

  actionsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  actionBtn: { flex: 1 },

  modal: { flex: 1, backgroundColor: Colors.navyTint },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.gray300,
    alignSelf: 'center',
    marginTop: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  modalTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 18,
    color: Colors.black,
  },
  modalContent: { paddingHorizontal: 20, paddingBottom: 40 },
  modalActions: { marginTop: 24 },

  fieldLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: Colors.gray600,
    marginBottom: 6,
    marginTop: 16,
  },
  input: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    height: 44,
    paddingHorizontal: 14,
    fontFamily: FontFamily.regular,
    fontSize: 14,
    color: Colors.black,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  typeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeChip: {
    paddingHorizontal: 16,
    height: 34,
    justifyContent: 'center',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: Colors.gray200,
    backgroundColor: Colors.white,
  },
  typeChipActive: {
    backgroundColor: Colors.navy,
    borderColor: Colors.navy,
  },
  typeChipText: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: Colors.gray600,
  },
  typeChipTextActive: { color: Colors.white },
  uploadHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 24,
    paddingHorizontal: 4,
  },
  uploadHintText: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: Colors.gray500,
  },
});
