import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';

export default function DriverMyCampaignsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mes campagnes</Text>
      <Text style={styles.subtitle}>Missions acceptées</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.navyTint,
  },
  title: {
    ...Typography.h1,
    color: Colors.navy,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.gray500,
    marginTop: 8,
  },
});
