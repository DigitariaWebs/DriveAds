/**
 * DriveAds Design System
 *
 * Palette: Navy #233466 + White
 * Font: Poppins (loaded in app/_layout.tsx)
 */

export const COLORS = {
  // Brand
  navy: '#233466',
  navyLight: '#3A4B8A',
  navyDark: '#1A2752',
  navySoft: '#EEF1F8', // surface for icon circles, subtle backgrounds
  navyTint: '#F5F7FB', // very subtle screen tint

  // Base
  white: '#FFFFFF',
  black: '#0A0E1F',

  // Neutrals
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray900: '#111827',

  // Status
  success: '#10B981',
  successSoft: '#D1FAE5',
  warning: '#F59E0B',
  warningSoft: '#FEF3C7',
  danger: '#EF4444',
  dangerSoft: '#FEE2E2',
  info: '#3B82F6',
  infoSoft: '#DBEAFE',

  // Overlays
  navyOverlay10: 'rgba(35, 52, 102, 0.1)',
  navyOverlay05: 'rgba(35, 52, 102, 0.05)',
  blackOverlay40: 'rgba(10, 14, 31, 0.4)',
  blackOverlay60: 'rgba(10, 14, 31, 0.6)',
} as const;

export const RADIUS = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 22,
  xxl: 28,
  full: 9999,
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
} as const;

export const SHADOWS = {
  sm: {
    shadowColor: COLORS.navy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  md: {
    shadowColor: COLORS.navy,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  lg: {
    shadowColor: COLORS.navy,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    elevation: 8,
  },
} as const;

export const FONTS = {
  regular: 'Poppins_400Regular',
  medium: 'Poppins_500Medium',
  semibold: 'Poppins_600SemiBold',
  bold: 'Poppins_700Bold',
  black: 'Poppins_800ExtraBold',
} as const;

// Text presets — use these as style props on <Text>
export const TYPO = {
  displayLarge: {
    fontFamily: FONTS.black,
    fontSize: 34,
    lineHeight: 42,
    letterSpacing: -0.8,
    color: COLORS.navy,
  },
  display: {
    fontFamily: FONTS.black,
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: -0.5,
    color: COLORS.navy,
  },
  h1: {
    fontFamily: FONTS.black,
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.3,
    color: COLORS.navy,
  },
  h2: {
    fontFamily: FONTS.bold,
    fontSize: 20,
    lineHeight: 28,
    color: COLORS.navy,
  },
  h3: {
    fontFamily: FONTS.bold,
    fontSize: 17,
    lineHeight: 24,
    color: COLORS.navy,
  },
  bodyLarge: {
    fontFamily: FONTS.regular,
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.gray600,
  },
  body: {
    fontFamily: FONTS.regular,
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.gray600,
  },
  bodyMedium: {
    fontFamily: FONTS.medium,
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.gray700,
  },
  bodySmall: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.gray500,
  },
  caption: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.gray500,
    letterSpacing: 0.2,
  },
  captionUpper: {
    fontFamily: FONTS.semibold,
    fontSize: 11,
    lineHeight: 14,
    color: COLORS.gray500,
    letterSpacing: 1,
    textTransform: 'uppercase' as const,
  },
  button: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    letterSpacing: 0.3,
  },
  buttonSmall: {
    fontFamily: FONTS.semibold,
    fontSize: 14,
    letterSpacing: 0.2,
  },
} as const;
