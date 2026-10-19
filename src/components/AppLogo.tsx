import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants';

interface AppLogoProps {
  size?: 'small' | 'large';
}

/**
 * CampusMart branded logo with gradient background and storefront icon.
 * Used in the welcome screen header and can be reused across the app.
 */
export const AppLogo: React.FC<AppLogoProps> = ({ size = 'large' }) => {
  const isLarge = size === 'large';
  const logoSize = isLarge ? 72 : 48;
  const iconSize = isLarge ? 36 : 22;
  const borderRadius = isLarge ? 22 : 14;

  return (
    <View style={styles.container}>
      <View style={[styles.logoShadow, { borderRadius }]}>
        <LinearGradient
          colors={['#4F46E5', '#7C3AED']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.logoGradient,
            {
              width: logoSize,
              height: logoSize,
              borderRadius,
            },
          ]}
        >
          <Ionicons name="storefront" size={iconSize} color={Colors.white} />
        </LinearGradient>
      </View>

      <View style={styles.brandRow}>
        <Text style={[styles.brandName, !isLarge && styles.brandNameSmall]}>
          Campus
        </Text>
        <Text style={[styles.brandAccent, !isLarge && styles.brandAccentSmall]}>
          Mart
        </Text>
      </View>

      {isLarge && (
        <View style={styles.taglineContainer}>
          <View style={styles.taglineDot} />
          <Text style={styles.tagline}>Your Campus Marketplace</Text>
          <View style={styles.taglineDot} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  logoShadow: {
    ...Shadows.logo,
    marginBottom: Spacing.lg,
  },
  logoGradient: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandName: {
    fontSize: 26,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  brandNameSmall: {
    fontSize: 18,
  },
  brandAccent: {
    fontSize: 26,
    fontWeight: Typography.bold,
    color: Colors.primary,
    letterSpacing: -0.5,
  },
  brandAccentSmall: {
    fontSize: 18,
  },
  taglineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
    gap: Spacing.sm,
  },
  tagline: {
    fontSize: Typography.bodySmall,
    fontWeight: Typography.medium,
    color: Colors.textTertiary,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  taglineDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primarySoft,
  },
});
