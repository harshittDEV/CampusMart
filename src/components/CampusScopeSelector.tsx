import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../constants';
import { CampusScopeFilter } from '../types';

interface CampusScopeSelectorProps {
  currentScope: CampusScopeFilter;
  onSelectScope: (scope: CampusScopeFilter) => void;
  institutionName: string;
}

export const CampusScopeSelector: React.FC<CampusScopeSelectorProps> = ({
  currentScope,
  onSelectScope,
  institutionName,
}) => {
  const options: { id: CampusScopeFilter; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { id: 'MY_CAMPUS', label: 'My Campus', icon: 'school-outline' },
    { id: 'OTHER_CAMPUSES', label: 'Other Campuses', icon: 'globe-outline' },
    { id: 'ALL_CAMPUSES', label: 'All Campuses', icon: 'layers-outline' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.segmentContainer}>
        {options.map((opt) => {
          const isActive = currentScope === opt.id;
          return (
            <TouchableOpacity
              key={opt.id}
              style={[styles.segmentBtn, isActive && styles.segmentBtnActive]}
              onPress={() => onSelectScope(opt.id)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={opt.icon}
                size={14}
                color={isActive ? Colors.primary : Colors.textSecondary}
              />
              <Text style={[styles.segmentText, isActive && styles.segmentTextActive]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Scope helper message */}
      <View style={styles.infoRow}>
        <Ionicons name="information-circle-outline" size={13} color={Colors.textTertiary} />
        <Text style={styles.infoText} numberOfLines={1}>
          {currentScope === 'MY_CAMPUS'
            ? `Showing listings within ${institutionName}`
            : currentScope === 'OTHER_CAMPUSES'
            ? 'Browsing listings from other verified institutions'
            : 'Viewing listings across all participating campuses'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.sm,
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#EEF2FF',
    borderRadius: BorderRadius.full,
    padding: 3,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.full,
  },
  segmentBtnActive: {
    backgroundColor: Colors.white,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  segmentText: {
    fontSize: Typography.caption,
    fontWeight: Typography.medium,
    color: Colors.textSecondary,
  },
  segmentTextActive: {
    color: Colors.primary,
    fontWeight: Typography.bold,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
    paddingHorizontal: Spacing.xs,
  },
  infoText: {
    fontSize: 11,
    color: Colors.textTertiary,
    flex: 1,
  },
});
