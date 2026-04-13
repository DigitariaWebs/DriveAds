import { useEffect } from 'react';
import { router } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Colors } from '../constants/Colors';

export default function Index() {
  const { role, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!role) {
      router.replace('/(auth)/welcome');
    } else if (role === 'driver') {
      router.replace('/(driver)/home');
    } else if (role === 'company') {
      router.replace('/(company)/home');
    } else if (role === 'admin') {
      router.replace('/(admin)/dashboard');
    }
  }, [role, isLoading]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.navy} />
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
});
