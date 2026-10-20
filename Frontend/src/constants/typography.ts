import { Platform } from 'react-native';

/**
 * CampusMart design tokens — Typography
 *
 * Uses system fonts to avoid external dependencies.
 * San Francisco on iOS, Roboto on Android.
 */

const fontFamily = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'System',
});

export const Typography = {
  fontFamily,

  // Font sizes
  heading1: 28,
  heading2: 22,
  heading3: 18,
  body: 15,
  bodySmall: 13,
  caption: 12,
  label: 14,

  // Font weights
  bold: '700' as const,
  semiBold: '600' as const,
  medium: '500' as const,
  regular: '400' as const,

  // Line heights
  lineHeightHeading: 1.3,
  lineHeightBody: 1.5,
} as const;
