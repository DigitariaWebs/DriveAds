import { Platform } from 'react-native';
import { Colors } from './Colors';
import { FontFamily } from './Typography';

// Floating glass tab bar
export const TAB_BAR_HEIGHT = 62;
export const TAB_BAR_BOTTOM = 24;

export const tabBarScreenOptions = {
  headerShown: false as const,
  tabBarActiveTintColor: Colors.white,
  tabBarInactiveTintColor: 'rgba(255,255,255,0.45)',
  tabBarLabelStyle: {
    fontFamily: FontFamily.semiBold,
    fontSize: 9,
    marginTop: 1,
  },
  tabBarIconStyle: {
    marginTop: 2,
  },
  tabBarItemStyle: {
    paddingTop: 2,
  },
  tabBarStyle: {
    position: 'absolute' as const,
    bottom: TAB_BAR_BOTTOM,
    left: 0,
    right: 0,
    marginHorizontal: 24,
    height: TAB_BAR_HEIGHT,
    borderRadius: 24,
    backgroundColor: 'rgba(26, 39, 82, 0.92)',
    borderTopWidth: 0,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    paddingBottom: 6,
    paddingTop: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.4,
        shadowRadius: 24,
      },
      android: {
        elevation: 16,
      },
    }),
  },
} as const;
