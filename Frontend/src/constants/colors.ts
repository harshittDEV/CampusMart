/**
 * CampusMart design tokens — Colors
 *
 * A refined, multi-color professional palette.
 * Primary: deep indigo-blue — authoritative, modern, premium.
 * Secondary: warm coral — energetic CTA accent.
 * Each role has its own color for visual personality.
 */
export const Colors = {
  // Primary brand
  primary: '#4F46E5',
  primaryLight: '#EEF2FF',
  primaryDark: '#3730A3',
  primarySoft: '#818CF8',

  // Secondary accent (CTAs, highlights)
  secondary: '#F97316',
  secondaryLight: '#FFF7ED',
  secondaryDark: '#EA580C',

  // Success / confirmation
  success: '#10B981',
  successLight: '#ECFDF5',

  // Neutrals
  white: '#FFFFFF',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  borderMedium: '#CBD5E1',

  // Text
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  textTertiary: '#94A3B8',
  textOnPrimary: '#FFFFFF',
  textOnSecondary: '#FFFFFF',

  // Role accent colors
  roleStudent: '#4F46E5',
  roleStudentLight: '#EEF2FF',
  roleFaculty: '#0891B2',
  roleFacultyLight: '#ECFEFF',
  roleStaff: '#059669',
  roleStaffLight: '#ECFDF5',
  roleSecurity: '#DC2626',
  roleSecurityLight: '#FEF2F2',
  roleOther: '#7C3AED',
  roleOtherLight: '#F5F3FF',

  // States
  selected: '#4F46E5',
  selectedBackground: '#EEF2FF',
  selectedBorder: '#4F46E5',
  disabled: '#E2E8F0',
  disabledText: '#94A3B8',
  disabledBackground: '#F1F5F9',

  // Gradients (start, end)
  gradientPrimary: ['#4F46E5', '#7C3AED'] as readonly string[],
  gradientSecondary: ['#F97316', '#F59E0B'] as readonly string[],
  gradientHeader: ['#4F46E5', '#6366F1', '#818CF8'] as readonly string[],
  gradientButton: ['#4F46E5', '#6366F1'] as readonly string[],
  gradientButtonDisabled: ['#CBD5E1', '#E2E8F0'] as readonly string[],

  // Shadows
  shadowColor: '#0F172A',
  shadowPrimary: '#4F46E5',
} as const;
