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
import { Campaign, Driver } from '../../constants/Types';
import { Colors } from '../../constants/Colors';
import { Typography, FontFamily } from '../../constants/Typography';
import { Spacing, Radius, Shadows } from '../../constants/Spacing';
import { useData } from '../../context/DataContext';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

type Props = {
  visible: boolean;
  campaign: Campaign | null;
  onClose: () => void;
};

export default function AssignDriversModal({ visible, campaign, onClose }: Props) {
  const { drivers, assignDriverToCampaign } = useData();
  const [selected, setSelected] = useState<string[]>([]);

  if (!campaign) return null;

  const availableDrivers = drivers.filter(
    (d) => d.status === 'validated' && !campaign.assignedDriverIds.includes(d.id),
  );
  const remaining = campaign.driversNeeded - campaign.driversAssigned;
  const limit = Math.max(0, remaining);

  const toggleDriver = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= limit) {
        Alert.alert('Limite atteinte', `Vous ne pouvez sélectionner que ${limit} chauffeur(s).`);
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleConfirm = () => {
    if (selected.length === 0) return;
    assignDriverToCampaign(campaign.id, selected);
    setSelected([]);
    onClose();
    Alert.alert('Succès', `${selected.length} chauffeur(s) assigné(s) avec succès !`);
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

        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Assigner des chauffeurs</Text>
            <Text style={styles.headerSubtitle}>{campaign.title}</Text>
          </View>
          <TouchableOpacity onPress={onClose}>
            <Feather name="x" size={24} color={Colors.gray500} />
          </TouchableOpacity>
        </View>

        <View style={styles.counterRow}>
          <Text style={styles.counter}>
            {selected.length}/{limit} chauffeurs sélectionnés
          </Text>
        </View>

        <ScrollView style={styles.flex} contentContainerStyle={styles.listContent}>
          {availableDrivers.length === 0 ? (
            <View style={styles.empty}>
              <Feather name="users" size={48} color={Colors.gray300} />
              <Text style={styles.emptyText}>Aucun chauffeur disponible</Text>
            </View>
          ) : (
            availableDrivers.map((driver) => {
              const isSelected = selected.includes(driver.id);
              return (
                <TouchableOpacity
                  key={driver.id}
                  style={[styles.driverRow, isSelected && styles.driverRowSelected]}
                  onPress={() => toggleDriver(driver.id)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.checkbox, isSelected && styles.checkboxChecked]}>
                    {isSelected && <Feather name="check" size={14} color={Colors.white} />}
                  </View>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {driver.firstName[0]}{driver.lastName[0]}
                    </Text>
                  </View>
                  <View style={styles.driverInfo}>
                    <Text style={styles.driverName}>
                      {driver.firstName} {driver.lastName}
                    </Text>
                    <Text style={styles.driverMeta}>
                      {driver.vehicleModel} · {driver.city}
                    </Text>
                  </View>
                  {driver.rating > 0 && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                      <Feather name="star" size={12} color="#F59E0B" />
                      <Text style={styles.rating}>{driver.rating.toFixed(1)}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>

        {selected.length > 0 && (
          <View style={styles.footer}>
            <Button variant="primary" size="lg" icon="check-circle" onPress={handleConfirm}>
              {`Confirmer (${selected.length})`}
            </Button>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: { flex: 1, backgroundColor: Colors.navyTint },
  flex: { flex: 1 },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: Colors.gray300, alignSelf: 'center',
    marginTop: Spacing.md,
  },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl, paddingVertical: Spacing.lg,
  },
  headerTitle: { ...Typography.h2, color: Colors.black },
  headerSubtitle: { ...Typography.bodySmall, color: Colors.gray500, marginTop: 2 },

  counterRow: {
    paddingHorizontal: Spacing.xl, paddingBottom: Spacing.md,
  },
  counter: { ...Typography.bodyMedium, color: Colors.navy },

  listContent: { paddingHorizontal: Spacing.xl, paddingBottom: Spacing.huge },

  driverRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    padding: Spacing.lg, backgroundColor: Colors.white, borderRadius: Radius.lg,
    marginBottom: Spacing.sm, ...Shadows.sm,
  },
  driverRowSelected: { backgroundColor: Colors.navySoft, borderWidth: 1.5, borderColor: Colors.navy },

  checkbox: {
    width: 22, height: 22, borderRadius: 6, borderWidth: 1.5,
    borderColor: Colors.gray300, alignItems: 'center', justifyContent: 'center',
  },
  checkboxChecked: { backgroundColor: Colors.navy, borderColor: Colors.navy },

  avatar: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.navy, alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontFamily: FontFamily.bold, fontSize: 13, color: Colors.white },

  driverInfo: { flex: 1 },
  driverName: { ...Typography.bodyMedium, color: Colors.black },
  driverMeta: { ...Typography.caption, color: Colors.gray500 },
  rating: { ...Typography.bodySmall, color: Colors.gray600 },

  empty: { alignItems: 'center', paddingTop: 60, gap: Spacing.md },
  emptyText: { ...Typography.body, color: Colors.gray400 },

  footer: {
    paddingHorizontal: Spacing.xl, paddingVertical: Spacing.lg,
    backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.gray200,
  },
});
