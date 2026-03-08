// RIDGE Design System — locked brand tokens
export const Colors = {
  // Primary palette
  forestGreen: '#1E3A2F',
  burntOrange: '#C56A2D',
  boneTan: '#E8E1D3',
  charcoal: '#2A2A2A',
  olive: '#4A5C45',

  // Wind analysis
  windSafe: '#22C55E',
  windCaution: '#EAB308',
  windDanger: '#EF4444',

  // UI surfaces
  background: '#1A1A1A',
  surface: '#242424',
  surfaceElevated: '#2E2E2E',
  border: '#3A3A3A',

  // Text
  textPrimary: '#E8E1D3',
  textSecondary: '#A8A89A',
  textMuted: '#6B6B60',

  // Interactive
  primary: '#1E3A2F',
  primaryLight: '#2A5240',
  accent: '#C56A2D',
  accentLight: '#D4824A',
} as const;

export const Typography = {
  // Bebas Neue for headlines, Inter for body
  headline: 'BebasNeue-Regular',
  body: 'Inter-Regular',
  bodyMedium: 'Inter-Medium',
  bodySemiBold: 'Inter-SemiBold',
  bodyBold: 'Inter-Bold',
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;
