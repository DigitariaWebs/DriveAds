import { useState } from 'react';
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
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { FontFamily } from '../../constants/Typography';
import { Shadows } from '../../constants/Spacing';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { TAB_BAR_HEIGHT, TAB_BAR_BOTTOM } from '../../constants/TabBarStyle';

const { width } = Dimensions.get('window');

// ─── Types ──────────────────────────────────────────────────
type Car = {
  id: string;
  name: string;
  plate: string;
  year: string;
  type: string;
  active: boolean;
  photos: any[];
};

const INITIAL_CARS: Car[] = [
  {
    id: '1',
    name: 'Audi Q5',
    plate: 'AB-123-CD',
    year: '2022',
    type: 'SUV',
    active: true,
    photos: [
      require('../../assets/car/audi-q5---1.jpg'),
      require('../../assets/car/audi-q5---2.jpg'),
      require('../../assets/car/audi-q5---3.jpg'),
      require('../../assets/car/audi-q5---4.jpg'),
      require('../../assets/car/audi-q5---5.jpg'),
    ],
  },
  {
    id: '2',
    name: 'Volkswagen Golf',
    plate: 'EF-456-GH',
    year: '2021',
    type: 'Berline',
    active: false,
    photos: [
      require('../../assets/car/golf---1.jpg'),
      require('../../assets/car/golf---2.jpg'),
      require('../../assets/car/golf---3.jpg'),
      require('../../assets/car/golf---4.jpg'),
      require('../../assets/car/golf---5.jpg'),
    ],
  },
];

const VEHICLE_TYPES = ['Berline', 'SUV', 'Utilitaire', 'Autre'];

// ─── Component ──────────────────────────────────────────────
export default function MyCarsScreen() {
  const insets = useSafeAreaInsets();
  const [cars, setCars] = useState<Car[]>(INITIAL_CARS);
  const [selectedCar, setSelectedCar] = useState<Car>(cars[0]);
  const [selectedPhoto, setSelectedPhoto] = useState(0);

  // Edit modal
  const [showEdit, setShowEdit] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPlate, setEditPlate] = useState('');
  const [editYear, setEditYear] = useState('');
  const [editType, setEditType] = useState('');
  const [editingCarId, setEditingCarId] = useState<string | null>(null);

  // Add modal
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPlate, setNewPlate] = useState('');
  const [newYear, setNewYear] = useState('');
  const [newType, setNewType] = useState('');

  // ─── Actions ────────────────────────────────────────────
  const openEdit = (car: Car) => {
    setEditingCarId(car.id);
    setEditName(car.name);
    setEditPlate(car.plate);
    setEditYear(car.year);
    setEditType(car.type);
    setShowEdit(true);
  };

  const saveEdit = () => {
    if (!editName.trim() || !editPlate.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir le nom et la plaque.');
      return;
    }
    setCars((prev) =>
      prev.map((c) =>
        c.id === editingCarId
          ? { ...c, name: editName.trim(), plate: editPlate.trim(), year: editYear.trim(), type: editType }
          : c,
      ),
    );
    const updated = cars.find((c) => c.id === editingCarId);
    if (updated && selectedCar.id === editingCarId) {
      setSelectedCar({ ...updated, name: editName.trim(), plate: editPlate.trim(), year: editYear.trim(), type: editType });
    }
    setShowEdit(false);
    Alert.alert('Succès', 'Véhicule modifié avec succès.');
  };

  const deleteCar = (carId: string) => {
    Alert.alert(
      'Supprimer',
      'Êtes-vous sûr de vouloir supprimer ce véhicule ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            const remaining = cars.filter((c) => c.id !== carId);
            setCars(remaining);
            if (selectedCar.id === carId && remaining.length > 0) {
              setSelectedCar(remaining[0]);
              setSelectedPhoto(0);
            }
            setShowEdit(false);
          },
        },
      ],
    );
  };

  const toggleActive = (carId: string) => {
    setCars((prev) =>
      prev.map((c) => ({ ...c, active: c.id === carId })),
    );
    setSelectedCar((prev) => ({ ...prev, active: prev.id === carId }));
  };

  const deletePhoto = (photoIndex: number) => {
    if (selectedCar.photos.length <= 1) {
      Alert.alert('Erreur', 'Vous devez garder au moins une photo.');
      return;
    }
    Alert.alert('Supprimer', 'Supprimer cette photo ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: () => {
          const newPhotos = selectedCar.photos.filter((_, i) => i !== photoIndex);
          const updatedCar = { ...selectedCar, photos: newPhotos };
          setCars((prev) => prev.map((c) => (c.id === selectedCar.id ? updatedCar : c)));
          setSelectedCar(updatedCar);
          setSelectedPhoto(Math.min(selectedPhoto, newPhotos.length - 1));
        },
      },
    ]);
  };

  const addCar = () => {
    if (!newName.trim() || !newPlate.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir le nom et la plaque.');
      return;
    }
    const newCar: Car = {
      id: `car_${Date.now()}`,
      name: newName.trim(),
      plate: newPlate.trim().toUpperCase(),
      year: newYear.trim() || '2024',
      type: newType || 'Berline',
      active: false,
      photos: [require('../../assets/car/golf---1.jpg')], // placeholder
    };
    setCars((prev) => [...prev, newCar]);
    setNewName('');
    setNewPlate('');
    setNewYear('');
    setNewType('');
    setShowAdd(false);
    Alert.alert('Succès', 'Véhicule ajouté avec succès.');
  };

  // ─── Render ─────────────────────────────────────────────
  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <Feather name="arrow-left" size={22} color={Colors.navy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes véhicules</Text>
        <TouchableOpacity onPress={() => setShowAdd(true)} style={styles.headerBtn}>
          <Feather name="plus" size={22} color={Colors.navy} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT + TAB_BAR_BOTTOM + 20 }}
      >
        {/* Car selector tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carSelectorRow}
          style={styles.carSelectorScroll}
        >
          {cars.map((car) => {
            const isSelected = selectedCar.id === car.id;
            return (
              <TouchableOpacity
                key={car.id}
                style={[styles.carTab, isSelected && styles.carTabActive]}
                onPress={() => { setSelectedCar(car); setSelectedPhoto(0); }}
                activeOpacity={0.7}
              >
                <Image source={car.photos[0]} style={styles.carTabImage} />
                <View style={styles.carTabInfo}>
                  <Text style={[styles.carTabName, isSelected && styles.carTabNameActive]}>
                    {car.name}
                  </Text>
                  <Text style={styles.carTabPlate}>{car.plate}</Text>
                </View>
                {car.active && <Badge variant="success" label="Active" />}
              </TouchableOpacity>
            );
          })}

          {/* Add car button in the selector */}
          <TouchableOpacity
            style={styles.addCarTab}
            onPress={() => setShowAdd(true)}
            activeOpacity={0.7}
          >
            <Feather name="plus" size={20} color={Colors.navy} />
            <Text style={styles.addCarText}>Ajouter</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Main photo */}
        <View style={styles.mainPhotoWrap}>
          <Image source={selectedCar.photos[selectedPhoto]} style={styles.mainPhoto} />
          <View style={styles.photoCounter}>
            <Text style={styles.photoCounterText}>
              {selectedPhoto + 1}/{selectedCar.photos.length}
            </Text>
          </View>
          {/* Delete photo overlay */}
          <TouchableOpacity
            style={styles.deletePhotoBtn}
            onPress={() => deletePhoto(selectedPhoto)}
          >
            <Feather name="trash-2" size={16} color={Colors.white} />
          </TouchableOpacity>
        </View>

        {/* Photo thumbnails + add photo */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.thumbRow}
          style={styles.thumbScroll}
        >
          {selectedCar.photos.map((photo, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => setSelectedPhoto(i)}
              activeOpacity={0.7}
            >
              <Image
                source={photo}
                style={[styles.thumb, selectedPhoto === i && styles.thumbActive]}
              />
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.addPhotoThumb} activeOpacity={0.7}>
            <Feather name="camera" size={18} color={Colors.navy} />
          </TouchableOpacity>
        </ScrollView>

        {/* Car details */}
        <View style={styles.detailsSection}>
          <View style={styles.nameRow}>
            <Text style={styles.carName}>{selectedCar.name}</Text>
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => openEdit(selectedCar)}
            >
              <Feather name="edit-2" size={16} color={Colors.navy} />
            </TouchableOpacity>
          </View>

          <View style={styles.badgeRow}>
            <Badge variant="navy" label={selectedCar.type} />
            <Badge variant="neutral" label={selectedCar.year} />
            {selectedCar.active ? (
              <Badge variant="success" label="En service" />
            ) : (
              <TouchableOpacity onPress={() => toggleActive(selectedCar.id)}>
                <Badge variant="warning" label="Activer" />
              </TouchableOpacity>
            )}
          </View>

          {/* Info card */}
          <View style={styles.infoCard}>
            <InfoRow icon="credit-card" label="Plaque" value={selectedCar.plate} />
            <InfoRow icon="calendar" label="Année" value={selectedCar.year} />
            <InfoRow icon="truck" label="Type" value={selectedCar.type} />
            <InfoRow icon="image" label="Photos" value={`${selectedCar.photos.length} photos`} />
          </View>

          {/* Action buttons */}
          <View style={styles.actionsRow}>
            <View style={styles.actionBtn}>
              <Button variant="outline" size="md" icon="edit-2" onPress={() => openEdit(selectedCar)}>
                Modifier
              </Button>
            </View>
            <View style={styles.actionBtn}>
              <Button variant="danger" size="md" icon="trash-2" onPress={() => deleteCar(selectedCar.id)}>
                Supprimer
              </Button>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* ─── Edit Modal ──────────────────────────────────── */}
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

          <ScrollView contentContainerStyle={styles.modalContent} keyboardShouldPersistTaps="handled">
            <Text style={styles.fieldLabel}>Nom du véhicule</Text>
            <TextInput style={styles.input} value={editName} onChangeText={setEditName} placeholder="Audi Q5" placeholderTextColor={Colors.gray400} />

            <Text style={styles.fieldLabel}>Plaque d'immatriculation</Text>
            <TextInput style={styles.input} value={editPlate} onChangeText={setEditPlate} placeholder="AB-123-CD" placeholderTextColor={Colors.gray400} autoCapitalize="characters" />

            <Text style={styles.fieldLabel}>Année</Text>
            <TextInput style={styles.input} value={editYear} onChangeText={setEditYear} placeholder="2022" placeholderTextColor={Colors.gray400} keyboardType="number-pad" />

            <Text style={styles.fieldLabel}>Type de véhicule</Text>
            <View style={styles.typeRow}>
              {VEHICLE_TYPES.map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.typeChip, editType === t && styles.typeChipActive]}
                  onPress={() => setEditType(t)}
                >
                  <Text style={[styles.typeChipText, editType === t && styles.typeChipTextActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActions}>
              <Button variant="primary" size="lg" icon="check" onPress={saveEdit}>
                Enregistrer
              </Button>
              <View style={{ height: 10 }} />
              <Button variant="danger" size="md" icon="trash-2" onPress={() => editingCarId && deleteCar(editingCarId)}>
                Supprimer ce véhicule
              </Button>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* ─── Add Modal ───────────────────────────────────── */}
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

          <ScrollView contentContainerStyle={styles.modalContent} keyboardShouldPersistTaps="handled">
            <Text style={styles.fieldLabel}>Nom du véhicule</Text>
            <TextInput style={styles.input} value={newName} onChangeText={setNewName} placeholder="Ex: Peugeot 308" placeholderTextColor={Colors.gray400} />

            <Text style={styles.fieldLabel}>Plaque d'immatriculation</Text>
            <TextInput style={styles.input} value={newPlate} onChangeText={setNewPlate} placeholder="AB-123-CD" placeholderTextColor={Colors.gray400} autoCapitalize="characters" />

            <Text style={styles.fieldLabel}>Année</Text>
            <TextInput style={styles.input} value={newYear} onChangeText={setNewYear} placeholder="2024" placeholderTextColor={Colors.gray400} keyboardType="number-pad" />

            <Text style={styles.fieldLabel}>Type de véhicule</Text>
            <View style={styles.typeRow}>
              {VEHICLE_TYPES.map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.typeChip, newType === t && styles.typeChipActive]}
                  onPress={() => setNewType(t)}
                >
                  <Text style={[styles.typeChipText, newType === t && styles.typeChipTextActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.uploadArea} activeOpacity={0.7}>
              <Feather name="camera" size={28} color={Colors.navy} />
              <Text style={styles.uploadText}>Ajouter des photos</Text>
              <Text style={styles.uploadHint}>Appuyez pour prendre ou choisir des photos</Text>
            </TouchableOpacity>

            <View style={styles.modalActions}>
              <Button variant="primary" size="lg" icon="plus" onPress={addCar}>
                Ajouter le véhicule
              </Button>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

// ─── Info Row Helper ────────────────────────────────────────
function InfoRow({ icon, label, value }: { icon: keyof typeof Feather.glyphMap; label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Feather name={icon} size={16} color={Colors.gray400} />
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
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
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontFamily: FontFamily.bold,
    fontSize: 16,
    color: Colors.navy,
  },

  // Car selector
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
  carTabPlate: { fontFamily: FontFamily.regular, fontSize: 10, color: Colors.gray400, marginTop: 1 },
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
  addCarText: { fontFamily: FontFamily.medium, fontSize: 11, color: Colors.navy },

  // Main photo
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
  photoCounterText: { fontFamily: FontFamily.semiBold, fontSize: 11, color: Colors.white },
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

  // Thumbnails
  thumbScroll: { flexGrow: 0 },
  thumbRow: { paddingHorizontal: 16, gap: 8, paddingBottom: 20 },
  thumb: { width: 56, height: 42, borderRadius: 10, borderWidth: 2, borderColor: 'transparent' },
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

  // Details
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
  infoLabel: { fontFamily: FontFamily.medium, fontSize: 12, color: Colors.gray500, width: 60 },
  infoValue: { fontFamily: FontFamily.semiBold, fontSize: 13, color: Colors.black, flex: 1 },

  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  actionBtn: { flex: 1 },

  // ─── Modals ───────────────────────────────────────────────
  modal: { flex: 1, backgroundColor: Colors.navyTint },
  modalHandle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: Colors.gray300, alignSelf: 'center', marginTop: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  modalTitle: { fontFamily: FontFamily.bold, fontSize: 18, color: Colors.black },
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
  typeChipTextActive: {
    color: Colors.white,
  },
  uploadArea: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 28,
    marginTop: 20,
    borderWidth: 1.5,
    borderColor: Colors.gray200,
    borderStyle: 'dashed',
    gap: 6,
  },
  uploadText: { fontFamily: FontFamily.semiBold, fontSize: 14, color: Colors.navy },
  uploadHint: { fontFamily: FontFamily.regular, fontSize: 11, color: Colors.gray400 },
});
