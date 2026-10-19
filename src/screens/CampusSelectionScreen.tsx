import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { StepIndicator } from '../components';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'CampusSelection'>;

/**
 * Placeholder Campus Selection Screen.
 *
 * Shows the selected role and a placeholder message.
 * To be fully implemented in a future sprint.
 */
export const CampusSelectionScreen: React.FC<Props> = ({ route }) => {
  const selectedRole = route.params?.selectedRole ?? 'STUDENT';

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Gradient Header */}
      <LinearGradient
        colors={Colors.gradientHeader as unknown as [string, string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <SafeAreaView>
          <View style={styles.headerContent}>
            <StepIndicator totalSteps={3} currentStep={1} />
            <Text style={styles.stepLabel}>Step 2 of 3</Text>
          </View>
        </SafeAreaView>
        <View style={styles.headerCurve} />
      </LinearGradient>

      {/* Body */}
      <View style={styles.body}>
        <View style={styles.iconContainer}>
          <LinearGradient
            colors={['#4F46E5', '#7C3AED']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconGradient}
          >
            <Ionicons name="location" size={36} color={Colors.white} />
          </LinearGradient>
        </View>

        <Text style={styles.heading}>Select Your Campus</Text>
        <Text style={styles.subheading}>
          Search and select the college or university you're associated with.
        </Text>

        {/* Role badge */}
        <View style={styles.roleBadge}>
          <View style={styles.roleDot} />
          <Text style={styles.roleText}>
            Continuing as: <Text style={styles.roleValue}>{selectedRole}</Text>
          </Text>
        </View>

        {/* Coming soon card */}
        <View style={styles.comingSoonCard}>
          <Ionicons name="construct-outline" size={24} color={Colors.primarySoft} />
          <Text style={styles.comingSoonTitle}>Coming Soon</Text>
          <Text style={styles.comingSoonText}>
            Campus search and selection will be available in the next update.
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: Platform.OS === 'android' ? 40 : 0,
    paddingBottom: 36,
    position: 'relative',
  },
  headerContent: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    gap: Spacing.sm,
  },
  stepLabel: {
    fontSize: Typography.caption,
    fontWeight: Typography.medium,
    color: 'rgba(255,255,255,0.7)',
  },
  headerCurve: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 24,
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.xxxl,
  },
  iconContainer: {
    ...Shadows.logo,
    borderRadius: 32,
    marginBottom: Spacing.xxl,
  },
  iconGradient: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: Typography.heading2,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    letterSpacing: -0.3,
  },
  subheading: {
    fontSize: Typography.label,
    fontWeight: Typography.regular,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xxl,
    lineHeight: Typography.label * 1.5,
    maxWidth: 280,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.full,
    gap: Spacing.sm,
    marginBottom: Spacing.xxxl,
  },
  roleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  roleText: {
    fontSize: Typography.caption,
    fontWeight: Typography.medium,
    color: Colors.primary,
  },
  roleValue: {
    fontWeight: Typography.bold,
  },
  comingSoonCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xxl,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    gap: Spacing.sm,
  },
  comingSoonTitle: {
    fontSize: Typography.body,
    fontWeight: Typography.semiBold,
    color: Colors.textPrimary,
  },
  comingSoonText: {
    fontSize: Typography.caption,
    fontWeight: Typography.regular,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.caption * 1.5,
  },
});
