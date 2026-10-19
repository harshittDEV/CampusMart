import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors, Spacing } from '../constants';

interface StepIndicatorProps {
  totalSteps: number;
  currentStep: number;
}

/**
 * A minimal step/progress indicator for the onboarding flow.
 * Shows which step the user is on with pill-shaped dots.
 */
export const StepIndicator: React.FC<StepIndicatorProps> = ({
  totalSteps,
  currentStep,
}) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }, (_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            i === currentStep && styles.dotActive,
            i < currentStep && styles.dotCompleted,
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
  },
  dotActive: {
    width: 28,
    backgroundColor: Colors.primary,
  },
  dotCompleted: {
    backgroundColor: Colors.primarySoft,
  },
});
