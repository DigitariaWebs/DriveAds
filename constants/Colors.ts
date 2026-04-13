export const Colors = {
  // Brand
  navy: '#233466',
  navyLight: '#3A4B8A',
  navyDark: '#1A2752',
  navySoft: '#EEF1F8',
  navyTint: '#F5F7FB',

  // Base
  white: '#FFFFFF',
  black: '#0A0E1F',

  // Gray scale (Tailwind neutral)
  gray50: '#FAFAFA',
  gray100: '#F5F5F5',
  gray200: '#E5E5E5',
  gray300: '#D4D4D4',
  gray400: '#A3A3A3',
  gray500: '#737373',
  gray600: '#525252',
  gray700: '#404040',
  gray800: '#262626',
  gray900: '#171717',

  // Semantic
  success: '#10B981',
  successSoft: '#D1FAE5',
  warning: '#F59E0B',
  warningSoft: '#FEF3C7',
  danger: '#EF4444',
  dangerSoft: '#FEE2E2',
  info: '#3B82F6',
  infoSoft: '#DBEAFE',

  // Aliases
  primary: '#233466',
  primaryLight: '#3A4B8A',
  primaryDark: '#1A2752',
  background: '#F5F7FB',
  surface: '#FFFFFF',
  textPrimary: '#0A0E1F',
  textSecondary: '#737373',
  border: '#E5E5E5',
} as const;

export type ColorName = keyof typeof Colors;
