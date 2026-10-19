import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, Typography, BorderRadius, Spacing } from '../constants';
import { OrderStatus, ListingStatus, ProductCondition } from '../types';

interface StatusBadgeProps {
  status: OrderStatus | ListingStatus | ProductCondition | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  let bg: string = Colors.primaryLight;
  let text: string = Colors.primary;
  let label: string = status;

  switch (status) {
    case 'CONFIRMED':
    case 'COMPLETED':
    case 'ACTIVE':
    case 'NEW':
      bg = Colors.successLight;
      text = Colors.success;
      label = status === 'CONFIRMED' ? 'Confirmed' : status === 'COMPLETED' ? 'Completed' : status === 'ACTIVE' ? 'Active' : 'Brand New';
      break;

    case 'PENDING':
    case 'LIKE_NEW':
      bg = '#FEF3C7';
      text = '#D97706';
      label = status === 'PENDING' ? 'Pending' : 'Like New';
      break;

    case 'READY_FOR_PICKUP':
      bg = '#E0E7FF';
      text = '#4338CA';
      label = 'Ready for Pickup';
      break;

    case 'RESERVED':
      bg = '#FEE2E2';
      text = '#DC2626';
      label = 'Reserved';
      break;

    case 'SOLD':
    case 'CANCELLED':
      bg = '#F1F5F9';
      text = '#64748B';
      label = status === 'SOLD' ? 'Sold' : 'Cancelled';
      break;

    case 'GOOD':
      bg = '#ECFEFF';
      text = '#0891B2';
      label = 'Good Condition';
      break;

    case 'FAIR':
      bg = '#FFF7ED';
      text = '#EA580C';
      label = 'Fair Condition';
      break;

    case 'NEEDS_REPAIR':
      bg = '#FEE2E2';
      text = '#DC2626';
      label = 'Needs Repair';
      break;

    default:
      label = status;
      break;
  }

  const isSmall = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: bg },
        isSmall ? styles.badgeSm : styles.badgeMd,
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: text },
          isSmall ? styles.textSm : styles.textMd,
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeSm: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  badgeMd: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  text: {
    fontWeight: Typography.semiBold,
    textTransform: 'uppercase',
  },
  textSm: {
    fontSize: 10,
    letterSpacing: 0.4,
  },
  textMd: {
    fontSize: Typography.caption,
    letterSpacing: 0.5,
  },
});
