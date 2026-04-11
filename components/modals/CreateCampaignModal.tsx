import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from '../Input';
import { Button } from '../Button';
import { BrandLogo } from '../BrandLogo';
import { Campaign } from '../../mocks/data';
import { COLORS, FONTS, RADIUS, SHADOWS } from '../../constants/theme';

interface CreateCampaignModalProps {
  visible: boolean;
  onClose: () => void;
  onCreate: (
    campaign: Omit<
      Campaign,
      'id' | 'status' | 'icon' | 'assignedDriverIds' | 'driversAssigned'
    >
  ) => void;
}

export function CreateCampaignModal({
  visible,
  onClose,
  onCreate,
}: CreateCampaignModalProps) {
  const [brand, setBrand] = useState('');
  const [domain, setDomain] = useState('');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');
  const [zones, setZones] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [durationDays, setDurationDays] = useState('');
  const [reward, setReward] = useState('');
  const [driversNeeded, setDriversNeeded] = useState('');

  const reset = () => {
    setBrand('');
    setDomain('');
    setDescription('');
    setCity('');
    setZones('');
    setStartDate('');
    setEndDate('');
    setDurationDays('');
    setReward('');
    setDriversNeeded('');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = () => {
    if (
      !brand ||
      !city ||
      !startDate ||
      !endDate ||
      !durationDays ||
      !reward ||
      !driversNeeded
    ) {
      Alert.alert('Champs manquants', 'Merci de remplir tous les champs obligatoires.');
      return;
    }

    const rewardNum = parseInt(reward, 10);
    const durationNum = parseInt(durationDays, 10);
    const driversNum = parseInt(driversNeeded, 10);

    if (isNaN(rewardNum) || isNaN(durationNum) || isNaN(driversNum)) {
      Alert.alert('Valeurs invalides', 'Budget, durée et chauffeurs doivent être des nombres.');
      return;
    }

    onCreate({
      brand,
      domain: domain || brand.toLowerCase().replace(/\s+/g, '') + '.com',
      title: brand,
      description: description || `Campagne ${brand} à ${city}.`,
      city,
      zones: zones
        .split(',')
        .map((z) => z.trim())
        .filter(Boolean),
      startDate,
      endDate,
      durationDays: durationNum,
      reward: rewardNum,
      driversNeeded: driversNum,
    });

    reset();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.navyTint }}>
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingVertical: 14,
            borderBottomWidth: 1,
            borderBottomColor: COLORS.gray100,
            backgroundColor: COLORS.white,
          }}
        >
          <TouchableOpacity
            onPress={handleClose}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: COLORS.navySoft,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="close" size={20} color={COLORS.navy} />
          </TouchableOpacity>
          <Text
            style={{
              fontFamily: FONTS.black,
              fontSize: 17,
              color: COLORS.navy,
            }}
          >
            Nouvelle campagne
          </Text>
          <View style={{ width: 40 }} />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Live preview */}
            {!!brand && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: COLORS.white,
                  borderRadius: RADIUS.xl,
                  padding: 14,
                  marginBottom: 18,
                  borderWidth: 1,
                  borderColor: COLORS.gray100,
                  ...SHADOWS.sm,
                }}
              >
                <BrandLogo domain={domain} name={brand} size="lg" />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text
                    style={{
                      fontFamily: FONTS.bold,
                      fontSize: 15,
                      color: COLORS.navy,
                    }}
                  >
                    {brand}
                  </Text>
                  <Text
                    style={{
                      fontFamily: FONTS.regular,
                      fontSize: 11,
                      color: COLORS.gray500,
                      marginTop: 2,
                    }}
                  >
                    Aperçu de la campagne
                  </Text>
                </View>
              </View>
            )}

            <SectionLabel>Marque</SectionLabel>
            <Input
              label="Nom de la marque *"
              placeholder="Nike, Adidas, Coca-Cola..."
              value={brand}
              onChangeText={setBrand}
              icon="pricetag-outline"
            />
            <Input
              label="Domaine (pour le logo)"
              placeholder="nike.com"
              value={domain}
              onChangeText={setDomain}
              autoCapitalize="none"
              icon="globe-outline"
            />
            <Input
              label="Description"
              placeholder="Détails de la campagne..."
              value={description}
              onChangeText={setDescription}
              multiline
              icon="reader-outline"
            />

            <View style={{ height: 6 }} />
            <SectionLabel>Localisation</SectionLabel>
            <Input
              label="Ville *"
              placeholder="Paris"
              value={city}
              onChangeText={setCity}
              icon="location-outline"
            />
            <Input
              label="Zones (séparées par des virgules)"
              placeholder="Paris Centre, La Défense, Saint-Denis"
              value={zones}
              onChangeText={setZones}
              icon="map-outline"
            />

            <View style={{ height: 6 }} />
            <SectionLabel>Planning</SectionLabel>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <Input
                  label="Début *"
                  placeholder="01 avril"
                  value={startDate}
                  onChangeText={setStartDate}
                  icon="calendar-outline"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Input
                  label="Fin *"
                  placeholder="20 avril"
                  value={endDate}
                  onChangeText={setEndDate}
                  icon="calendar-outline"
                />
              </View>
            </View>
            <Input
              label="Durée (jours) *"
              placeholder="20"
              value={durationDays}
              onChangeText={setDurationDays}
              keyboardType="numeric"
              icon="time-outline"
            />

            <View style={{ height: 6 }} />
            <SectionLabel>Budget & équipe</SectionLabel>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <Input
                  label="Budget (€) *"
                  placeholder="350"
                  value={reward}
                  onChangeText={setReward}
                  keyboardType="numeric"
                  icon="cash-outline"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Input
                  label="Chauffeurs *"
                  placeholder="4"
                  value={driversNeeded}
                  onChangeText={setDriversNeeded}
                  keyboardType="numeric"
                  icon="people-outline"
                />
              </View>
            </View>

            {/* Actions */}
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
              <View style={{ flex: 1 }}>
                <Button variant="outline" size="lg" fullWidth onPress={handleClose}>
                  Annuler
                </Button>
              </View>
              <View style={{ flex: 1 }}>
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  icon="checkmark"
                  onPress={handleSubmit}
                >
                  Créer
                </Button>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <Text
      style={{
        fontFamily: FONTS.semibold,
        fontSize: 11,
        color: COLORS.gray500,
        letterSpacing: 1,
        textTransform: 'uppercase',
        marginBottom: 10,
        marginTop: 4,
      }}
    >
      {children}
    </Text>
  );
}
