import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  StatusBar,
  TextInput,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { StepIndicator, PrimaryButton } from '../components';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants';
import { ROLE_CARDS } from '../constants';
import { RootStackParamList } from '../types';
import { getInstitutionById } from '../services/institutionService';

type Props = NativeStackScreenProps<RootStackParamList, 'EmailAuthentication'>;

/**
 * Placeholder Email Authentication Screen (Step 3 of onboarding).
 *
 * Displays the selected role and institution to confirm they were
 * preserved across navigation. Provides an institutional email input
 * and a clear development placeholder flow to ProfileSetup.
 * Does not simulate fake OTPs or fake successful authentications.
 */
export const EmailAuthenticationScreen: React.FC<Props> = ({ route, navigation }) => {
  const { selectedRole, institutionId, institutionName } = route.params;
  const [email, setEmail] = useState('');

  const institution = getInstitutionById(institutionId);
  const displayName = institutionName ?? institution?.name ?? 'Selected Institution';
  const roleLabel =
    ROLE_CARDS.find((c) => c.role === selectedRole)?.title ?? selectedRole;

  const handleSendCode = () => {
    Alert.alert(
      'Development Placeholder',
      'Institutional email verification will be integrated with the Spring Boot backend service in a future milestone.\n\nNo real email or OTP was dispatched. You may now continue to preview the Profile Setup screen.',
      [
        {
          text: 'Continue to Profile Setup',
          onPress: () => {
            navigation.navigate('ProfileSetup', {
              selectedRole,
              institutionId,
              institutionName: displayName,
            });
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Gradient Header ──────────────────────────────────── */}
        <LinearGradient
          colors={Colors.gradientHeader as unknown as [string, string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <SafeAreaView>
            <View style={styles.headerContent}>
              {/* Back */}
              <View style={styles.topRow}>
                <Ionicons
                  name="arrow-back"
                  size={22}
                  color={Colors.white}
                  onPress={() => navigation.goBack()}
                  accessibilityLabel="Go back"
                />
              </View>

              <View style={styles.stepRow}>
                <StepIndicator totalSteps={4} currentStep={2} />
                <Text style={styles.stepLabel}>Step 3 of 4</Text>
              </View>

              {/* Icon */}
              <View style={styles.heroIconWrapper}>
                <View style={styles.heroIcon}>
                  <Ionicons name="mail" size={28} color={Colors.white} />
                </View>
              </View>
            </View>
          </SafeAreaView>
          <View style={styles.headerCurve} />
        </LinearGradient>

        {/* ── Body ─────────────────────────────────────────────── */}
        <View style={styles.body}>
          {/* Context badges */}
          <View style={styles.badgeGroup}>
            <View style={styles.badge}>
              <View style={styles.badgeDot} />
              <Text style={styles.badgeLabel}>Role</Text>
              <Text style={styles.badgeValue}>{roleLabel}</Text>
            </View>

            <View style={styles.badge}>
              <View style={[styles.badgeDot, { backgroundColor: Colors.success }]} />
              <Text style={styles.badgeLabel}>Institution</Text>
              <Text style={styles.badgeValue} numberOfLines={1}>
                {displayName}
              </Text>
            </View>
          </View>

          <Text style={styles.heading}>Verify your institution</Text>
          <Text style={styles.subheading}>
            We'll use your institutional email to verify your campus membership.
          </Text>

          {/* Email input field */}
          <View style={styles.inputWrapper}>
            <Text style={styles.fieldLabel}>Campus Email Address</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="mail-outline"
                size={20}
                color={Colors.textTertiary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.textInput}
                placeholder="yourname@institution.edu.in"
                placeholderTextColor={Colors.textTertiary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            <Text style={styles.fieldHint}>
              Must end with your college domain (e.g. .edu, .edu.in, .ac.in)
            </Text>
          </View>

          {/* Coming soon notice */}
          <View style={styles.comingSoonCard}>
            <View style={styles.noticeIconCircle}>
              <Ionicons name="construct-outline" size={20} color={Colors.primary} />
            </View>
            <View style={styles.noticeTextContainer}>
              <Text style={styles.comingSoonTitle}>Phase 1 Preview Mode</Text>
              <Text style={styles.comingSoonText}>
                Email dispatch and OTP verification will connect to the Spring Boot authentication service in Phase 2.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom CTA */}
      <View style={styles.bottomContainer}>
        <PrimaryButton
          title="Send Verification Code"
          onPress={handleSendCode}
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

  // ── Header ──────────────────────────────────────────────────────
  header: {
    paddingTop: Platform.OS === 'android' ? 40 : 0,
    paddingBottom: 36,
    position: 'relative',
  },
  headerContent: {
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  stepLabel: {
    fontSize: Typography.caption,
    fontWeight: Typography.medium,
    color: 'rgba(255,255,255,0.7)',
  },
  heroIconWrapper: {
    alignItems: 'center',
  },
  heroIcon: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
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

  // ── Body ────────────────────────────────────────────────────────
  body: {
    paddingHorizontal: Spacing.xl,
    marginTop: -Spacing.xs,
  },
  heading: {
    fontSize: Typography.heading2,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
    letterSpacing: -0.3,
  },
  subheading: {
    fontSize: Typography.label,
    fontWeight: Typography.regular,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
    lineHeight: Typography.label * 1.5,
  },

  // ── Badges ──────────────────────────────────────────────────────
  badgeGroup: {
    width: '100%',
    gap: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    paddingVertical: Spacing.xs + 2,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    gap: Spacing.sm,
  },
  badgeDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Colors.primary,
  },
  badgeLabel: {
    fontSize: Typography.caption,
    fontWeight: Typography.medium,
    color: Colors.textSecondary,
  },
  badgeValue: {
    fontSize: Typography.caption,
    fontWeight: Typography.bold,
    color: Colors.primary,
    flex: 1,
  },

  // ── Input ───────────────────────────────────────────────────────
  inputWrapper: {
    marginBottom: Spacing.xl,
  },
  fieldLabel: {
    fontSize: Typography.caption,
    fontWeight: Typography.semiBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Platform.OS === 'ios' ? 12 : 6,
  },
  inputIcon: {
    marginRight: Spacing.sm,
  },
  textInput: {
    flex: 1,
    fontSize: Typography.body,
    color: Colors.textPrimary,
  },
  fieldHint: {
    fontSize: Typography.caption,
    color: Colors.textTertiary,
    marginTop: Spacing.xs,
  },

  // ── Coming soon ─────────────────────────────────────────────────
  comingSoonCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    gap: Spacing.md,
  },
  noticeIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noticeTextContainer: {
    flex: 1,
  },
  comingSoonTitle: {
    fontSize: Typography.bodySmall,
    fontWeight: Typography.semiBold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  comingSoonText: {
    fontSize: Typography.caption,
    fontWeight: Typography.regular,
    color: Colors.textSecondary,
    lineHeight: Typography.caption * 1.4,
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
