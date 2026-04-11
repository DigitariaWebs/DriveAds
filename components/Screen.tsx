import React from 'react';
import { View, ViewStyle, StatusBar, StyleProp } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { COLORS } from '../constants/theme';

interface ScreenProps {
  children: React.ReactNode;
  backgroundColor?: string;
  statusBarStyle?: 'light-content' | 'dark-content';
  edges?: Edge[];
  style?: StyleProp<ViewStyle>;
  noSafeArea?: boolean;
}

export function Screen({
  children,
  backgroundColor = COLORS.white,
  statusBarStyle = 'dark-content',
  edges = ['top', 'left', 'right'],
  style,
  noSafeArea = false,
}: ScreenProps) {
  const content = noSafeArea ? (
    <View style={[{ flex: 1, backgroundColor }, style]}>{children}</View>
  ) : (
    <SafeAreaView edges={edges} style={[{ flex: 1, backgroundColor }, style]}>
      {children}
    </SafeAreaView>
  );

  return (
    <>
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor={backgroundColor}
        translucent
      />
      {content}
    </>
  );
}
