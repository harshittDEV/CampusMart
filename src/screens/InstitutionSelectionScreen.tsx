import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { StepIndicator, PrimaryButton, InstitutionSelector } from '../components';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants';
import { ROLE_CARDS } from '../constants';
import { Institution, Role, RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'InstitutionSelection'>;

/**
 * Institution Selection Screen (Step 2 of onboarding).
 *
 * The user has already selected a role on the previous screen.
 * Here they choose the institution they're associated with
 * before proceeding to email verification.
 *
 * Preserves CampusMart's established visual language — gradient
 * hero header, curved edge, step indicator, bottom CTA bar.
 */
export const InstitutionSelectionScreen: React.FC<Props> = ({
  route,
  navigation,
}) => {
  const { selectedRole } = route.params;
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);

  // Find the user-friendly role label
  const roleLabel =
    ROLE_CARDS.find((c) => c.role === selectedRole)?.title ?? selectedRole;

  const handleContinue = useCallback(() => {
    if (selectedInstitution) {
      navigation.navigate('EmailAuthentication', {
        selectedRole,
        institutionId: selectedInstitution.id,
        institutionName: selectedInstitution.name,
      });
    }
  }, [selectedInstitution, selectedRole, navigation]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Gradient Hero Header ────────────────────────────── */}
        <LinearGradient
          colors={Colors.gradientHeader as unknown as [string, string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroHeader}
        >
          <SafeAreaView>
            <View style={styles.heroContent}>
              {/* Back button */}
              <View style={styles.topRow}>
                <Ionicons
                  name="arrow-back"
                  size={22}
                  color={Colors.white}
                  onPress={() => navigation.goBack()}
                  accessibilityLabel="Go back"
                />
              </View>

              {/* Step indicator */}
              <View style={styles.stepRow}>
                <StepIndicator totalSteps={4} currentStep={1} />
                <Text style={styles.stepLabel}>Step 2 of 4</Text>
              </View>

              {/* Icon */}
              <View style={styles.heroIconWrapper}>
                <View style={styles.heroIcon}>
                  <Ionicons name="business" size={30} color={Colors.white} />
                </View>
              </View>
            </View>
          </SafeAreaView>

          {/* Curved bottom edge */}
          <View style={styles.heroCurve} />
        </LinearGradient>

        {/* ── Main Content ────────────────────────────────────── */}
        <View style={styles.contentSection}>
          {/* Role badge (subtle) */}
          <View style={styles.roleBadge}>
            <View style={styles.roleDot} />
            <Text style={styles.roleText}>
              Continuing as <Text style={styles.roleValue}>{roleLabel}</Text>
            </Text>
          </View>

          {/* Heading */}
          <View style={styles.headingContainer}>
            <Text style={styles.heading}>Select your institution</Text>
            <Text style={styles.subheading}>
              Choose the college or institution you're associated with.
            </Text>
          </View>

          {/* Selector */}
          <View style={styles.selectorContainer}>
            <InstitutionSelector
              selectedInstitution={selectedInstitution}
              onSelect={setSelectedInstitution}
            />
          </View>

          {/* Helper */}
          <Text style={styles.helperText}>
            Can't find your institution? More will be added soon.
          </Text>
        </View>
      </ScrollView>

      {/* ── Sticky bottom CTA ──────────────────────────────────── */}
      <View style={styles.bottomContainer}>
        <PrimaryButton
          title="Continue"
          onPress={handleContinue}
          disabled={selectedInstitution === null}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xxl,
  },

  // ── Hero Header ─────────────────────────────────────────────────
  heroHeader: {
    paddingTop: Platform.OS === 'android' ? 40 : 0,
    paddingBottom: 40,
    position: 'relative',
  },
  heroContent: {
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.xxl,
  },
  stepLabel: {
    fontSize: Typography.caption,
    fontWeight: Typography.medium,
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 0.5,
  },
  heroIconWrapper: {
    alignItems: 'center',
  },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  heroCurve: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 24,
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },

  // ── Content ─────────────────────────────────────────────────────
  contentSection: {
    paddingHorizontal: Spacing.xl,
    marginTop: -Spacing.xs,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: Colors.primaryLight,
    paddingVertical: Spacing.xs + 2,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.full,
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
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
  headingContainer: {
    marginBottom: Spacing.xxl,
  },
  heading: {
    fontSize: Typography.heading2,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    lineHeight: Typography.heading2 * 1.3,
    letterSpacing: -0.3,
  },
  subheading: {
    fontSize: Typography.label,
    fontWeight: Typography.regular,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
    lineHeight: Typography.label * 1.5,
  },
  selectorContainer: {
    marginBottom: Spacing.lg,
  },
  helperText: {
    fontSize: Typography.caption,
    fontWeight: Typography.regular,
    color: Colors.textTertiary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },

  // ── Bottom CTA ──────────────────────────────────────────────────
  bottomContainer: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? Spacing.xxxl : Spacing.xl,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
});
