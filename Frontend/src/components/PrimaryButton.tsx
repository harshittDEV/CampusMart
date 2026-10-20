import React, { useRef } from 'react';
import {
  StyleSheet,
  Text,
  Pressable,
  Animated,
  View,
  ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  icon?: string;
}

/**
 * A premium gradient CTA button with arrow icon, press animation, and disabled state.
 */
export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  disabled = false,
  style,
  icon = 'arrow-forward',
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled) return;
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    if (disabled) return;
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const gradientColors = disabled
    ? (Colors.gradientButtonDisabled as unknown as [string, string])
    : (Colors.gradientButton as unknown as [string, string]);

  return (
    <Animated.View
      style={[
        { transform: [{ scale: scaleAnim }] },
        !disabled && Shadows.button,
        disabled && Shadows.buttonDisabled,
        style,
      ]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.button}
        >
          <Text style={[styles.buttonText, disabled && styles.buttonTextDisabled]}>
            {title}
          </Text>
          <View style={[styles.iconCircle, disabled && styles.iconCircleDisabled]}>
            <Ionicons
              name={icon as keyof typeof Ionicons.glyphMap}
              size={18}
              color={disabled ? Colors.disabledText : Colors.primary}
            />
          </View>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xxl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  buttonText: {
    fontSize: Typography.body,
    fontWeight: Typography.semiBold,
    color: Colors.textOnPrimary,
    letterSpacing: 0.3,
  },
  buttonTextDisabled: {
    color: Colors.disabledText,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleDisabled: {
    backgroundColor: Colors.disabledBackground,
  },
});
