import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  StatusBar,
  TextInput,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { StepIndicator, PrimaryButton } from '../components';
import { Colors, Typography, Spacing, BorderRadius } from '../constants';
import { ROLE_CARDS } from '../constants';
import { RootStackParamList } from '../types';
import { getInstitutionById } from '../services/institutionService';
import { useMarketplace } from '../context';

type Props = NativeStackScreenProps<RootStackParamList, 'ProfileSetup'>;

/**
 * Profile Setup Screen (Step 4 of onboarding).
 *
 * Collects local profile details (Name, Department, Academic Year / Designation)
 * and initializes the shared marketplace state before navigating to Home Dashboard.
 */
export const ProfileSetupScreen: React.FC<Props> = ({ route, navigation }) => {
  const { selectedRole, institutionId, institutionName } = route.params;
  const { initializeUserFromOnboarding } = useMarketplace();

  const institution = getInstitutionById(institutionId);
  const displayName = institutionName ?? institution?.name ?? 'Institution';
  const roleLabel =
    ROLE_CARDS.find((c) => c.role === selectedRole)?.title ?? selectedRole;

  const [name, setName] = useState('Harshit Singh');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [academicYear, setAcademicYear] = useState(
    selectedRole === 'STUDENT' ? '3rd Year / 6th Semester' : 'Faculty / Staff Member'
  );

  const handleFinish = () => {
    // Initialize profile into shared state
    initializeUserFromOnboarding(
      selectedRole,
      institutionId,
      displayName,
      name,
      department,
      academicYear
    );

    // Enter Main Marketplace
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs' }],
    });
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
                <StepIndicator totalSteps={4} currentStep={3} />
                <Text style={styles.stepLabel}>Step 4 of 4</Text>
              </View>

              {/* Icon */}
              <View style={styles.heroIconWrapper}>
                <View style={styles.heroIcon}>
                  <Ionicons name="person" size={28} color={Colors.white} />
                </View>
              </View>
            </View>
          </SafeAreaView>
          <View style={styles.headerCurve} />
        </LinearGradient>

        {/* ── Body ─────────────────────────────────────────────── */}
        <View style={styles.contentSection}>
          {/* Context Badges */}
          <View style={styles.badgeGroup}>
            <View style={styles.badge}>
              <View style={styles.badgeDot} />
              <Text style={styles.badgeLabel}>Role</Text>
              <Text style={styles.badgeValue}>{roleLabel}</Text>
            </View>

            <View style={styles.badge}>
              <View style={[styles.badgeDot, { backgroundColor: Colors.success }]} />
              <Text style={styles.badgeLabel}>Campus</Text>
              <Text style={styles.badgeValue} numberOfLines={1}>
                {displayName}
              </Text>
            </View>
          </View>

          {/* Heading */}
          <View style={styles.headingContainer}>
            <Text style={styles.heading}>Set up your profile</Text>
            <Text style={styles.subheading}>
              Personalize your CampusMart identity.
            </Text>
          </View>

          {/* Avatar Placeholder */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarCircle}>
              <Ionicons name="person" size={36} color={Colors.primary} />
            </View>
            <Text style={styles.avatarLabel}>Campus profile avatar</Text>
          </View>

          {/* Form Fields (Interactive & pre-filled with demo values) */}
          <View style={styles.formGroup}>
            <Text style={styles.fieldLabel}>Full Name</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="person-outline"
                size={18}
                color={Colors.textTertiary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Rahul Sharma"
                placeholderTextColor={Colors.textTertiary}
                value={name}
                onChangeText={setName}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.fieldLabel}>Department / Major</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="school-outline"
                size={18}
                color={Colors.textTertiary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Computer Science & Engineering"
                placeholderTextColor={Colors.textTertiary}
                value={department}
                onChangeText={setDepartment}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.fieldLabel}>
              {selectedRole === 'STUDENT'
                ? 'Academic Year'
                : 'Designation / Staff Title'}
            </Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="calendar-outline"
                size={18}
                color={Colors.textTertiary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.textInput}
                placeholder={
                  selectedRole === 'STUDENT'
                    ? 'e.g. 3rd Year / 6th Semester'
                    : 'e.g. Assistant Professor'
                }
                placeholderTextColor={Colors.textTertiary}
                value={academicYear}
                onChangeText={setAcademicYear}
              />
            </View>
          </View>

          {/* Dev notice banner */}
          <View style={styles.devNoticeCard}>
            <Ionicons name="information-circle" size={20} color={Colors.primary} />
            <Text style={styles.devNoticeText}>
              Local Prototype Mode: Completing setup will initialize your verified campus session and open the live marketplace dashboard.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom CTA */}
      <View style={styles.bottomContainer}>
        <PrimaryButton
          title="Complete Setup & Enter"
          onPress={handleFinish}
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

  // ── Content ─────────────────────────────────────────────────────
  contentSection: {
    paddingHorizontal: Spacing.xl,
    marginTop: -Spacing.xs,
  },
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

  headingContainer: {
    marginBottom: Spacing.xl,
  },
  heading: {
    fontSize: Typography.heading2,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  subheading: {
    fontSize: Typography.label,
    fontWeight: Typography.regular,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    lineHeight: Typography.label * 1.5,
  },

  // ── Avatar ──────────────────────────────────────────────────────
  avatarSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primaryLight,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLabel: {
    fontSize: Typography.caption,
    color: Colors.textSecondary,
    fontWeight: Typography.medium,
  },

  // ── Form ────────────────────────────────────────────────────────
  formGroup: {
    marginBottom: Spacing.md,
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

  // ── Dev notice ──────────────────────────────────────────────────
  devNoticeCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.primaryLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.sm,
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  devNoticeText: {
    flex: 1,
    fontSize: Typography.caption,
    color: Colors.primary,
    lineHeight: Typography.caption * 1.4,
  },

  // ── Sticky Bottom CTA ───────────────────────────────────────────
  bottomContainer: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? Spacing.xxxl : Spacing.xl,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
});
