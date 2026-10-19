import React, { useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RoleCardData } from '../types';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants';

interface RoleCardProps {
  data: RoleCardData;
  isSelected: boolean;
  onPress: () => void;
  index: number;
}

/**
 * A premium selectable card representing a user role.
 * Features per-role accent colors, smooth selection animation,
 * colored icon badge, and radio indicator.
 */
export const RoleCard: React.FC<RoleCardProps> = ({ data, isSelected, onPress, index }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const selectionAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Staggered entrance animation
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      delay: index * 80,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, index]);

  // Selection animation
  useEffect(() => {
    Animated.spring(selectionAnim, {
      toValue: isSelected ? 1 : 0,
      useNativeDriver: false,
      speed: 20,
      bounciness: 8,
    }).start();
  }, [isSelected, selectionAnim]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const borderColor = selectionAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.border, data.color],
  });

  const backgroundColor = selectionAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.surface, data.lightColor],
  });

  return (
    <Animated.View
      style={{
        transform: [
          { scale: scaleAnim },
          {
            translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0],
            }),
          },
        ],
        opacity: fadeAnim,
      }}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityRole="radio"
        accessibilityState={{ selected: isSelected }}
        accessibilityLabel={`${data.title}: ${data.description}`}
      >
        <Animated.View
          style={[
            styles.card,
            {
              borderColor,
              backgroundColor,
            },
            isSelected ? Shadows.cardSelected : Shadows.card,
          ]}
        >
          {/* Colored left accent bar */}
          <View
            style={[
              styles.accentBar,
              { backgroundColor: isSelected ? data.color : 'transparent' },
            ]}
          />

          {/* Icon badge */}
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: isSelected ? data.color : data.lightColor,
              },
            ]}
          >
            <Ionicons
              name={data.icon as keyof typeof Ionicons.glyphMap}
              size={22}
              color={isSelected ? Colors.white : data.color}
            />
          </View>

          {/* Text content */}
          <View style={styles.textContainer}>
            <Text
              style={[
                styles.title,
                isSelected && { color: data.color },
              ]}
              numberOfLines={1}
            >
              {data.title}
            </Text>
            <Text
              style={[
                styles.description,
                isSelected && styles.descriptionSelected,
              ]}
              numberOfLines={2}
            >
              {data.description}
            </Text>
          </View>

          {/* Selection checkmark */}
          <View
            style={[
              styles.checkContainer,
              isSelected && {
                backgroundColor: data.color,
                borderColor: data.color,
              },
            ]}
          >
            {isSelected && (
              <Ionicons name="checkmark" size={14} color={Colors.white} />
            )}
          </View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
    paddingVertical: 14,
    paddingRight: Spacing.lg,
    paddingLeft: 0,
    marginBottom: Spacing.md,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  accentBar: {
    width: 4,
    alignSelf: 'stretch',
    borderTopLeftRadius: BorderRadius.lg,
    borderBottomLeftRadius: BorderRadius.lg,
    marginRight: Spacing.md,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  textContainer: {
    flex: 1,
    marginRight: Spacing.md,
  },
  title: {
    fontSize: Typography.body,
    fontWeight: Typography.semiBold,
    color: Colors.textPrimary,
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  description: {
    fontSize: Typography.caption,
    fontWeight: Typography.regular,
    color: Colors.textSecondary,
    lineHeight: Typography.caption * 1.4,
  },
  descriptionSelected: {
    color: Colors.textSecondary,
  },
  checkContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.borderMedium,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
});
