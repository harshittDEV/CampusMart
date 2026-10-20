import React, { useRef, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Animated,
  Easing,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Campus3DScene } from '../components/Campus3DScene';
import { PrimaryButton } from '../components/PrimaryButton';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants';
import { RootStackParamList } from '../types';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

export const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  // Brand reveal drivers (Scenes 4, 5, 6)
  const brandOpacity = useRef(new Animated.Value(0)).current;
  const brandY = useRef(new Animated.Value(18)).current;

  const supportOpacity = useRef(new Animated.Value(0)).current;
  const supportY = useRef(new Animated.Value(14)).current;

  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const buttonY = useRef(new Animated.Value(18)).current;

  const [canSkip, setCanSkip] = useState(true);

  useEffect(() => {
    // Timed coordinated reveals
    const brandAnim = Animated.parallel([
      Animated.timing(brandOpacity, {
        toValue: 1,
        duration: 650,
        delay: 1600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(brandY, {
        toValue: 0,
        duration: 650,
        delay: 1600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);

    const supportAnim = Animated.parallel([
      Animated.timing(supportOpacity, {
        toValue: 1,
        duration: 600,
        delay: 2000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(supportY, {
        toValue: 0,
        duration: 600,
        delay: 2000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);

    const buttonAnim = Animated.parallel([
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 600,
        delay: 2300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(buttonY, {
        toValue: 0,
        duration: 600,
        delay: 2300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);

    Animated.parallel([brandAnim, supportAnim, buttonAnim]).start();

    return () => {
      brandAnim.stop();
      supportAnim.stop();
      buttonAnim.stop();
    };
  }, []);

  const handleContinue = () => {
    navigation.navigate('RoleSelection');
  };

  const handleSkip = () => {
    navigation.navigate('RoleSelection');
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <SafeAreaView style={styles.safeArea}>
        {/* ── Top Header: Brand Pill & Skip Option ─────────────── */}
        <View style={styles.topHeader}>
          <View style={styles.networkBadge}>
            <View style={styles.pulseDot} />
            <Text style={styles.networkText}>VERIFIED CAMPUS NETWORK</Text>
          </View>

          {canSkip && (
            <TouchableOpacity
              onPress={handleSkip}
              style={styles.skipBtn}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              activeOpacity={0.7}
              accessibilityLabel="Skip intro"
            >
              <Text style={styles.skipText}>Skip</Text>
              <Ionicons name="chevron-forward" size={14} color={Colors.textTertiary} />
            </TouchableOpacity>
          )}
        </View>

        {/* ── Center: 3D Campus & Graduation Cap Scene ─────────── */}
        <View style={styles.sceneContainer}>
          <Campus3DScene />
        </View>

        {/* ── Bottom Content: Wordmark, Taglines & Action ───────── */}
        <View style={styles.bottomSection}>
          {/* Wordmark & Tagline (Scene 4) */}
          <Animated.View
            style={[
              styles.brandContainer,
              {
                opacity: brandOpacity,
                transform: [{ translateY: brandY }],
              },
            ]}
          >
            <View style={styles.wordmarkRow}>
              <View style={styles.logoSquare}>
                <Ionicons name="cart" size={20} color={Colors.white} />
              </View>
              <Text style={styles.brandTitle}>CampusMart</Text>
            </View>

            <Text style={styles.brandTagline}>Your campus. Your marketplace.</Text>
          </Animated.View>

          {/* Supporting Message (Scene 5) */}
          <Animated.View
            style={[
              styles.supportContainer,
              {
                opacity: supportOpacity,
                transform: [{ translateY: supportY }],
              },
            ]}
          >
            <Text style={styles.supportText}>
              Buy smarter. Sell locally. Connect campuses.
            </Text>
          </Animated.View>

          {/* Continue Button (Scene 6) */}
          <Animated.View
            style={[
              styles.buttonContainer,
              {
                opacity: buttonOpacity,
                transform: [{ translateY: buttonY }],
              },
            ]}
          >
            <PrimaryButton
              title="Get Started"
              onPress={handleContinue}
              icon="arrow-forward"
            />
            <Text style={styles.institutionHint}>
              Exclusively for verified students, faculty & campus members
            </Text>
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xs,
    height: 44,
  },
  networkBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingVertical: 4,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    gap: 6,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
  networkText: {
    fontSize: 10,
    fontWeight: Typography.bold,
    color: Colors.primary,
    letterSpacing: 0.6,
  },
  skipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },
  skipText: {
    fontSize: Typography.caption,
    fontWeight: Typography.medium,
    color: Colors.textTertiary,
  },

  sceneContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    maxHeight: SCREEN_HEIGHT * 0.44,
  },

  bottomSection: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Platform.OS === 'ios' ? Spacing.lg : Spacing.xl,
    alignItems: 'center',
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  wordmarkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: 6,
  },
  logoSquare: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.card,
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    letterSpacing: -0.8,
  },
  brandTagline: {
    fontSize: Typography.heading3,
    fontWeight: Typography.semiBold,
    color: Colors.textSecondary,
    letterSpacing: -0.2,
  },

  supportContainer: {
    alignItems: 'center',
    marginTop: Spacing.xs,
    marginBottom: Spacing.xl,
  },
  supportText: {
    fontSize: Typography.bodySmall,
    fontWeight: Typography.regular,
    color: Colors.textTertiary,
    textAlign: 'center',
    letterSpacing: 0.1,
  },

  buttonContainer: {
    width: '100%',
    maxWidth: 400,
  },
  institutionHint: {
    fontSize: 11,
    color: Colors.textTertiary,
    textAlign: 'center',
    marginTop: Spacing.md,
    letterSpacing: 0.2,
  },
});
