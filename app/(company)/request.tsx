import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { Typography, FontFamily } from '../../constants/Typography';
import { Spacing, Radius, Shadows } from '../../constants/Spacing';
import { Campaign } from '../../constants/Types';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { TAB_BAR_HEIGHT, TAB_BAR_BOTTOM } from '../../constants/TabBarStyle';

const CITIES = ['Paris', 'Lyon', 'Caen', 'Marseille', 'Toutes les villes'];

export default function CompanyRequestScreen() {
  const insets = useSafeAreaInsets();
  const { currentCompany } = useAuth();
  const { addCampaign } = useData();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');
  const [zones, setZones] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [driversNeeded, setDriversNeeded] = useState('');
  const [budget, setBudget] = useState('');

  const validate = (): boolean => {
    if (!title.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir le titre de la campagne.');
      return false;
    }
    if (!city) {
      Alert.alert('Erreur', 'Veuillez sélectionner une ville.');
      return false;
    }
    if (!startDate.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir la date de début.');
      return false;
    }
    if (!endDate.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir la date de fin.');
      return false;
    }
    if (!driversNeeded.trim() || isNaN(Number(driversNeeded))) {
      Alert.alert('Erreur', 'Veuillez saisir un nombre de véhicules valide.');
      return false;
    }
    if (!budget.trim() || isNaN(Number(budget))) {
      Alert.alert('Erreur', 'Veuillez saisir un budget valide.');
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const company = currentCompany;
    const zonesArray = zones
      .split(',')
      .map((z) => z.trim())
      .filter(Boolean);

    const newCampaign: Campaign = {
      id: `camp_${Date.now()}`,
      companyId: company?.id ?? 'c1',
      brand: company?.companyName ?? 'Entreprise',
      domain: company?.domain ?? 'company.com',
      title: title.trim(),
      description: description.trim(),
      city: city === 'Toutes les villes' ? 'Paris' : city,
      zones: zonesArray.length > 0 ? zonesArray : [city],
      startDate: startDate.trim(),
      endDate: endDate.trim(),
      durationDays: 30,
      reward: Number(budget),
      status: 'available',
      progress: 0,
      kmDone: 0,
      kmTotal: Number(driversNeeded) * 1500,
      driversNeeded: Number(driversNeeded),
      driversAssigned: 0,
      assignedDriverIds: [],
      trackingMode: 'gps',
    };

    addCampaign(newCampaign);
    Alert.alert('Succès', 'Votre campagne a été soumise avec succès !', [
      { text: 'OK', onPress: () => router.push('/(company)/my-campaigns') },
    ]);
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Nouvelle campagne</Text>
          <Text style={styles.headerSubtitle}>Créez votre demande</Text>
        </View>
        <View style={styles.headerIcon}>
          <Feather name="edit-3" size={20} color={Colors.navy} />
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Input
            label="Titre de la campagne"
            placeholder="Ex: Nike Air Max 2026"
            value={title}
            onChangeText={setTitle}
            icon="type"
          />

          <Input
            label="Description"
            placeholder="Décrivez les objectifs de votre campagne..."
            value={description}
            onChangeText={setDescription}
            multiline
          />

          <Text style={styles.pickerLabel}>Ville ciblée</Text>
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
            label="Zones spécifiques (optionnel)"
            placeholder="Paris Centre, La Défense, Opéra"
            value={zones}
            onChangeText={setZones}
            icon="map-pin"
          />

          <View style={styles.dateRow}>
            <View style={styles.dateField}>
              <Input
                label="Date de début"
                placeholder="JJ/MM/AAAA"
                value={startDate}
                onChangeText={setStartDate}
                icon="calendar"
              />
            </View>
            <View style={styles.dateField}>
              <Input
                label="Date de fin"
                placeholder="JJ/MM/AAAA"
                value={endDate}
                onChangeText={setEndDate}
                icon="calendar"
              />
            </View>
          </View>

          <Input
            label="Nombre de véhicules souhaités"
            placeholder="4"
            value={driversNeeded}
            onChangeText={setDriversNeeded}
            icon="truck"
            keyboardType="number-pad"
          />

          <Input
            label="Budget par véhicule en €"
            placeholder="350"
            value={budget}
            onChangeText={setBudget}
            icon="dollar-sign"
            keyboardType="number-pad"
          />

          <View style={styles.submitArea}>
            <Button
              variant="primary"
              size="lg"
              icon="send"
              onPress={handleSubmit}
            >
              Soumettre la campagne
            </Button>
          </View>

          <View style={{ height: TAB_BAR_HEIGHT + TAB_BAR_BOTTOM + 16 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.navyTint,
  },
  flex: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerTitle: {
    fontFamily: FontFamily.black,
    fontSize: 22,
    color: Colors.black,
  },
  headerSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: Colors.gray500,
    marginTop: 2,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },

  scrollContent: {
    paddingHorizontal: 20,
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
    paddingHorizontal: 16,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  chipActive: {
    backgroundColor: Colors.navy,
    borderColor: Colors.navy,
  },
  chipText: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: Colors.gray600,
  },
  chipTextActive: {
    fontFamily: FontFamily.semiBold,
    color: Colors.white,
  },
  dateRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  dateField: {
    flex: 1,
  },
  submitArea: {
    marginTop: Spacing.lg,
  },
});
