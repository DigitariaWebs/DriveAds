import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Typography, FontFamily } from '../../constants/Typography';
import { Spacing, Radius } from '../../constants/Spacing';
import { Campaign } from '../../constants/Types';
import { useData } from '../../context/DataContext';
import Input from '../ui/Input';
import Button from '../ui/Button';
import BrandLogo from '../BrandLogo';

type Props = {
  visible: boolean;
  onClose: () => void;
};

const CITIES = ['Paris', 'Lyon', 'Caen', 'Marseille', 'Nice', 'Bordeaux'];

export default function CreateCampaignModal({ visible, onClose }: Props) {
  const { addCampaign } = useData();

  const [brand, setBrand] = useState('');
  const [domain, setDomain] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');
  const [zones, setZones] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reward, setReward] = useState('');
  const [driversNeeded, setDriversNeeded] = useState('');

  const resetForm = () => {
    setBrand('');
    setDomain('');
    setTitle('');
    setDescription('');
    setCity('');
    setZones('');
    setStartDate('');
    setEndDate('');
    setReward('');
    setDriversNeeded('');
  };

  const handleCreate = () => {
    if (!brand.trim() || !title.trim() || !city || !reward.trim() || !driversNeeded.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires.');
      return;
    }

    const zonesArray = zones.split(',').map((z) => z.trim()).filter(Boolean);

    const campaign: Campaign = {
      id: `camp_${Date.now()}`,
      companyId: '',
      brand: brand.trim(),
      domain: domain.trim() || `${brand.trim().toLowerCase()}.com`,
      title: title.trim(),
      description: description.trim(),
      city,
      zones: zonesArray.length > 0 ? zonesArray : [city],
      startDate: startDate.trim() || '2026-05-01',
      endDate: endDate.trim() || '2026-06-30',
      durationDays: 60,
      reward: Number(reward),
      status: 'available',
      progress: 0,
      kmDone: 0,
      kmTotal: Number(driversNeeded) * 1500,
      driversNeeded: Number(driversNeeded),
      driversAssigned: 0,
      assignedDriverIds: [],
      trackingMode: 'gps',
    };

    addCampaign(campaign);
    resetForm();
    onClose();
    Alert.alert('Succès', 'Campagne créée avec succès !');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.modal}>
        <View style={styles.handle} />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Créer une campagne</Text>
          <TouchableOpacity onPress={onClose}>
            <Feather name="x" size={24} color={Colors.gray500} />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Live brand preview */}
          {domain.trim().length > 3 && (
            <View style={styles.brandPreview}>
              <BrandLogo domain={domain.trim()} name={brand || domain} size={56} />
            </View>
          )}

          <Input
            label="Nom de la marque"
            placeholder="Nike"
            value={brand}
            onChangeText={setBrand}
            icon="tag"
          />
          <Input
            label="Domaine (optionnel)"
            placeholder="nike.com"
            value={domain}
            onChangeText={setDomain}
            icon="globe"
          />
          <Input
            label="Titre de la campagne"
            placeholder="Nike Air Max 2026"
            value={title}
            onChangeText={setTitle}
            icon="type"
          />
          <Input
            label="Description"
            placeholder="Objectifs et détails de la campagne..."
            value={description}
            onChangeText={setDescription}
            multiline
          />

          <Text style={styles.pickerLabel}>Ville</Text>
          <View style={styles.chipRow}>
            {CITIES.map((c) => (
              <TouchableOpacity
                key={c}
                style={[styles.chip, city === c && styles.chipActive]}
                onPress={() => setCity(c)}
                activeOpacity={0.7}
              >
                <Text style={[styles.chipText, city === c && styles.chipTextActive]}>
                  {c}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Input
            label="Zones (optionnel)"
            placeholder="Centre-ville, Gare, Université"
            value={zones}
            onChangeText={setZones}
            icon="map-pin"
          />

          <View style={styles.row}>
            <View style={styles.halfField}>
              <Input label="Date début" placeholder="JJ/MM/AAAA" value={startDate} onChangeText={setStartDate} />
            </View>
            <View style={styles.halfField}>
              <Input label="Date fin" placeholder="JJ/MM/AAAA" value={endDate} onChangeText={setEndDate} />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfField}>
              <Input label="Rémunération €" placeholder="350" value={reward} onChangeText={setReward} keyboardType="number-pad" />
            </View>
            <View style={styles.halfField}>
              <Input label="Chauffeurs" placeholder="4" value={driversNeeded} onChangeText={setDriversNeeded} keyboardType="number-pad" />
            </View>
          </View>

          <View style={styles.submitArea}>
            <Button variant="primary" size="lg" icon="check-circle" onPress={handleCreate}>
              Créer la campagne
            </Button>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: Colors.navyTint,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.gray300,
    alignSelf: 'center',
    marginTop: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
  },
  headerTitle: {
    ...Typography.h2,
    color: Colors.black,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.huge,
  },
  brandPreview: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  pickerLabel: {
    ...Typography.caption,
    color: Colors.gray600,
    marginBottom: Spacing.xs,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  chip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.gray200,
    backgroundColor: Colors.white,
  },
  chipActive: {
    borderColor: Colors.navy,
    backgroundColor: Colors.navySoft,
  },
  chipText: {
    ...Typography.bodySmall,
    color: Colors.gray600,
  },
  chipTextActive: {
    fontFamily: FontFamily.semiBold,
    color: Colors.navy,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  halfField: {
    flex: 1,
  },
  submitArea: {
    marginTop: Spacing.lg,
  },
});
