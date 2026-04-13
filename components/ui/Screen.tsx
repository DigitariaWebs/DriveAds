import React, { ReactNode } from 'react';
import { ScrollView, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';

type Props = {
  backgroundColor?: string;
  statusBarStyle?: 'light-content' | 'dark-content';
  edges?: Edge[];
  scroll?: boolean;
  children: ReactNode;
};

export default function Screen({
  backgroundColor = Colors.navyTint,
  statusBarStyle = 'dark-content',
  edges = ['top', 'left', 'right'],
  scroll = false,
  children,
}: Props) {
  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]} edges={edges}>
      <StatusBar barStyle={statusBarStyle} />
      {scroll ? (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        children
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
