import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  StatusBar,
  Platform,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppLogo, RoleCard, PrimaryButton, StepIndicator } from '../components';
import { Colors, Typography, Spacing, BorderRadius } from '../constants';
import { ROLE_CARDS } from '../constants';
import { Role, RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'RoleSelection'>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * Welcome / Role Selection Screen
 *
 * The first screen of CampusMart — a premium onboarding experience.
 * Users select how they are connected to their campus before proceeding.
 */
export const RoleSelectionScreen: React.FC<Props> = ({ navigation }) => {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const handleRoleSelect = useCallback((role: Role) => {
    setSelectedRole(role);
  }, []);

  const handleContinue = useCallback(() => {
    if (selectedRole) {
      navigation.navigate('InstitutionSelection', { selectedRole });
    }
  }, [selectedRole, navigation]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Gradient Hero Header */}
        <LinearGradient
          colors={Colors.gradientHeader as unknown as [string, string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroHeader}
        >
          <SafeAreaView>
            <View style={styles.heroContent}>
              {/* Step indicator */}
              <View style={styles.stepRow}>
                <StepIndicator totalSteps={4} currentStep={0} />
                <Text style={styles.stepLabel}>Step 1 of 4</Text>
              </View>

              {/* Logo */}
              <View style={styles.logoSection}>
                <View style={styles.logoIconWrapper}>
                  <View style={styles.logoIcon}>
                    <Text style={styles.logoEmoji}>🏪</Text>
                  </View>
                </View>
                <Text style={styles.heroBrandName}>
                  Campus<Text style={styles.heroBrandAccent}>Mart</Text>
                </Text>
                <Text style={styles.heroTagline}>Your Campus Marketplace</Text>
              </View>
            </View>
          </SafeAreaView>

          {/* Curved bottom edge */}
          <View style={styles.heroCurve} />
        </LinearGradient>

        {/* Main Content */}
        <View style={styles.contentSection}>
          {/* Heading */}
          <View style={styles.headingContainer}>
            <Text style={styles.heading}>
              How are you connected{'\n'}to your campus?
            </Text>
            <Text style={styles.subheading}>
              Select your role to personalize your experience
            </Text>
          </View>

          {/* Role cards */}
          <View style={styles.cardsContainer}>
            {ROLE_CARDS.map((card, index) => (
              <RoleCard
                key={card.role}
                data={card}
                isSelected={selectedRole === card.role}
                onPress={() => handleRoleSelect(card.role)}
                index={index}
              />
            ))}
          </View>

          {/* Helper text */}
          <Text style={styles.helperText}>
            You can change your role later in settings
          </Text>
        </View>
      </ScrollView>

      {/* Sticky bottom CTA */}
      <View style={styles.bottomContainer}>
        <PrimaryButton
          title="Continue"
          onPress={handleContinue}
          disabled={selectedRole === null}
        />
        <Text style={styles.privacyText}>
          By continuing, you agree to our{' '}
          <Text style={styles.privacyLink}>Terms</Text> and{' '}
          <Text style={styles.privacyLink}>Privacy Policy</Text>
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('MainTabs')}
          style={styles.demoBypassBtn}
          activeOpacity={0.7}
        >
          <Text style={styles.demoBypassText}>
            Developer Demo: Enter Marketplace Directly →
          </Text>
        </TouchableOpacity>
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

  // Hero Header
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
  logoSection: {
    alignItems: 'center',
  },
  logoIconWrapper: {
    marginBottom: Spacing.md,
  },
  logoIcon: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  logoEmoji: {
    fontSize: 36,
  },
  heroBrandName: {
    fontSize: 30,
    fontWeight: Typography.bold,
    color: Colors.white,
    letterSpacing: -0.5,
  },
  heroBrandAccent: {
    color: '#FDE68A',
  },
  heroTagline: {
    fontSize: Typography.bodySmall,
    fontWeight: Typography.medium,
    color: 'rgba(255,255,255,0.7)',
    marginTop: Spacing.xs,
    letterSpacing: 1,
    textTransform: 'uppercase',
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

  // Content
  contentSection: {
    paddingHorizontal: Spacing.xl,
    marginTop: -Spacing.xs,
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
  cardsContainer: {
    marginBottom: Spacing.lg,
  },
  helperText: {
    fontSize: Typography.caption,
    fontWeight: Typography.regular,
    color: Colors.textTertiary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },

  // Bottom CTA
  bottomContainer: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? Spacing.xxxl : Spacing.xl,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  privacyText: {
    fontSize: 11,
    fontWeight: Typography.regular,
    color: Colors.textTertiary,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
  privacyLink: {
    color: Colors.primary,
    fontWeight: Typography.medium,
  },
  demoBypassBtn: {
    marginTop: Spacing.sm,
    paddingVertical: Spacing.xs,
    alignItems: 'center',
  },
  demoBypassText: {
    fontSize: 12,
    fontWeight: Typography.semiBold,
    color: Colors.primary,
  },
});
