import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { FontFamily } from '../../constants/Typography';
import { Shadows } from '../../constants/Spacing';
import { TAB_BAR_HEIGHT, TAB_BAR_BOTTOM } from '../../constants/TabBarStyle';
import Button from '../../components/ui/Button';

const CITIES = ['Paris', 'Lyon', 'Caen', 'Marseille', 'Nice', 'Bordeaux'];

export default function EditProfileScreen() {
  const insets = useSafeAreaInsets();

  const [firstName, setFirstName] = useState('Marie');
  const [lastName, setLastName] = useState('Dupont');
  const [email, setEmail] = useState('marie.dupont@email.com');
  const [phone, setPhone] = useState('+33 6 12 34 56 78');
  const [selectedCity, setSelectedCity] = useState('Paris');

  const handleSave = () => {
    Alert.alert('Succès', 'Vos modifications ont été enregistrées.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <Feather name="arrow-left" size={22} color={Colors.navy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Modifier le profil</Text>
        <View style={styles.headerBtnPlaceholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT + TAB_BAR_BOTTOM + 20 }}
      >
        <View style={styles.content}>
          {/* Avatar */}
          <View style={styles.avatarSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>MD</Text>
            </View>
            <TouchableOpacity style={styles.changePhotoBtn}>
              <Feather name="camera" size={14} color={Colors.navy} />
              <Text style={styles.changePhotoText}>Changer la photo</Text>
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.formCard}>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Prénom</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="Prénom"
                  placeholderTextColor={Colors.gray400}
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Nom</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Nom"
                  placeholderTextColor={Colors.gray400}
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Email</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Email"
                  placeholderTextColor={Colors.gray400}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Téléphone</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Téléphone"
                  placeholderTextColor={Colors.gray400}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Ville</Text>
              <View style={styles.chipRow}>
                {CITIES.map((city) => (
                  <TouchableOpacity
                    key={city}
                    style={[
                      styles.chip,
                      selectedCity === city && styles.chipActive,
                    ]}
                    onPress={() => setSelectedCity(city)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selectedCity === city && styles.chipTextActive,
                      ]}
                    >
                      {city}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Save button */}
          <View style={styles.buttonWrap}>
            <Button size="lg" onPress={handleSave}>
              Enregistrer les modifications
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.navyTint },

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

  // Avatar
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontFamily: FontFamily.bold,
    fontSize: 28,
    color: Colors.white,
  },
  changePhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.navySoft,
    borderRadius: 20,
  },
  changePhotoText: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
    color: Colors.navy,
  },

  // Form
  formCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 16,
    ...Shadows.sm,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
    color: Colors.gray500,
    marginBottom: 6,
    marginLeft: 4,
  },
  inputWrapper: {
    backgroundColor: Colors.navyTint,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  input: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: Colors.black,
    padding: 0,
  },

  // City chips
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.navyTint,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  chipActive: {
    backgroundColor: Colors.navySoft,
    borderColor: Colors.navy,
  },
  chipText: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
    color: Colors.gray500,
  },
  chipTextActive: {
    color: Colors.navy,
  },

  buttonWrap: {
    marginTop: 24,
    alignItems: 'center',
  },
});
