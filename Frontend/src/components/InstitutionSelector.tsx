import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  FlatList,
  Pressable,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Institution } from '../types';
import { searchInstitutions, getInstitutions } from '../services/institutionService';
import { SearchBar } from './SearchBar';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface InstitutionSelectorProps {
  selectedInstitution: Institution | null;
  onSelect: (institution: Institution) => void;
}

/**
 * A modern searchable institution selector.
 *
 * Renders as a tappable field on the screen; when pressed, opens a
 * bottom-sheet-style modal with a search bar and a virtualized
 * FlatList that can handle thousands of institutions efficiently.
 */
export const InstitutionSelector: React.FC<InstitutionSelectorProps> = ({
  selectedInstitution,
  onSelect,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const allInstitutions = useMemo(() => getInstitutions(), []);

  const filteredInstitutions = useMemo(
    () => searchInstitutions(searchQuery),
    [searchQuery],
  );

  const openModal = useCallback(() => {
    setSearchQuery('');
    setModalVisible(true);
  }, []);

  useEffect(() => {
    if (modalVisible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          speed: 14,
          bounciness: 4,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [modalVisible, slideAnim, fadeAnim]);

  const closeModal = useCallback(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setModalVisible(false);
    });
  }, [slideAnim, fadeAnim]);

  const handleSelect = useCallback(
    (institution: Institution) => {
      onSelect(institution);
      closeModal();
    },
    [onSelect, closeModal],
  );

  // ─── Row renderer ───────────────────────────────────────────────
  const renderItem = useCallback(
    ({ item }: { item: Institution }) => {
      const isSelected = selectedInstitution?.id === item.id;
      return (
        <Pressable
          onPress={() => handleSelect(item)}
          style={({ pressed }) => [
            styles.listItem,
            isSelected && styles.listItemSelected,
            pressed && styles.listItemPressed,
          ]}
          accessibilityRole="radio"
          accessibilityState={{ selected: isSelected }}
          accessibilityLabel={item.name}
        >
          <View style={styles.listItemContent}>
            <Text
              style={[styles.listItemName, isSelected && styles.listItemNameSelected]}
              numberOfLines={2}
            >
              {item.name}
            </Text>
            {item.city && (
              <Text style={styles.listItemCity}>{item.city}</Text>
            )}
          </View>
          {isSelected && (
            <View style={styles.listItemCheck}>
              <Ionicons name="checkmark" size={16} color={Colors.white} />
            </View>
          )}
        </Pressable>
      );
    },
    [selectedInstitution, handleSelect],
  );

  const keyExtractor = useCallback((item: Institution) => item.id, []);

  // ─── Empty state ────────────────────────────────────────────────
  const renderEmpty = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Ionicons name="search-outline" size={48} color={Colors.borderMedium} />
        <Text style={styles.emptyTitle}>No institutions found</Text>
        <Text style={styles.emptySubtitle}>
          Try a different spelling or search term
        </Text>
      </View>
    ),
    [],
  );

  // ─── Trigger field ──────────────────────────────────────────────
  return (
    <>
      <Pressable
        onPress={openModal}
        style={({ pressed }) => [
          styles.trigger,
          selectedInstitution && styles.triggerSelected,
          pressed && styles.triggerPressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Select institution"
      >
        <View style={styles.triggerContent}>
          {selectedInstitution ? (
            <>
              <View style={styles.triggerCheckIcon}>
                <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
              </View>
              <View style={styles.triggerTextContainer}>
                <Text style={styles.triggerSelectedText} numberOfLines={1}>
                  {selectedInstitution.name}
                </Text>
                {selectedInstitution.city && (
                  <Text style={styles.triggerCityText} numberOfLines={1}>
                    {selectedInstitution.city}
                  </Text>
                )}
              </View>
            </>
          ) : (
            <>
              <Ionicons
                name="business-outline"
                size={20}
                color={Colors.textTertiary}
                style={styles.triggerIcon}
              />
              <Text style={styles.triggerPlaceholder}>Select institution</Text>
            </>
          )}
        </View>
        <Ionicons
          name="chevron-down"
          size={20}
          color={Colors.textTertiary}
        />
      </Pressable>

      {/* Bottom-sheet modal */}
      <Modal
        visible={modalVisible}
        animationType="none"
        transparent
        onRequestClose={closeModal}
        statusBarTranslucent
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalWrapper}
        >
          {/* Overlay */}
          <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
            <Pressable style={styles.overlayPressable} onPress={closeModal} />
          </Animated.View>

          {/* Sheet */}
          <Animated.View
            style={[
              styles.sheet,
              { transform: [{ translateY: slideAnim }] },
            ]}
          >
            {/* Handle bar */}
            <View style={styles.handleRow}>
              <View style={styles.handleBar} />
            </View>

            {/* Header */}
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Select institution</Text>
              <Text style={styles.sheetCount}>
                {filteredInstitutions.length} of {allInstitutions.length} institutions
              </Text>
            </View>

            {/* Search */}
            <View style={styles.searchContainer}>
              <SearchBar
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
            </View>

            {/* List */}
            <FlatList
              data={filteredInstitutions}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
              ListEmptyComponent={renderEmpty}
              contentContainerStyle={styles.listContent}
              keyboardShouldPersistTaps="handled"
              initialNumToRender={15}
              maxToRenderPerBatch={20}
              windowSize={7}
              showsVerticalScrollIndicator={false}
            />
          </Animated.View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  // ── Trigger ─────────────────────────────────────────────────────
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingVertical: 14,
    paddingHorizontal: Spacing.lg,
    ...Shadows.card,
  },
  triggerSelected: {
    borderColor: Colors.success,
    backgroundColor: Colors.successLight,
  },
  triggerPressed: {
    opacity: 0.85,
  },
  triggerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  triggerIcon: {
    marginRight: Spacing.md,
  },
  triggerPlaceholder: {
    fontSize: Typography.body,
    fontWeight: Typography.regular,
    color: Colors.textTertiary,
  },
  triggerCheckIcon: {
    marginRight: Spacing.md,
  },
  triggerTextContainer: {
    flex: 1,
  },
  triggerSelectedText: {
    fontSize: Typography.body,
    fontWeight: Typography.semiBold,
    color: Colors.textPrimary,
  },
  triggerCityText: {
    fontSize: Typography.caption,
    fontWeight: Typography.regular,
    color: Colors.textSecondary,
    marginTop: 2,
  },

  // ── Modal ───────────────────────────────────────────────────────
  modalWrapper: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  overlayPressable: {
    flex: 1,
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 0.8,
    backgroundColor: Colors.background,
    borderTopLeftRadius: BorderRadius.xxl,
    borderTopRightRadius: BorderRadius.xxl,
    overflow: 'hidden',
  },
  handleRow: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.borderMedium,
  },
  sheetHeader: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  sheetTitle: {
    fontSize: Typography.heading3,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  sheetCount: {
    fontSize: Typography.caption,
    fontWeight: Typography.regular,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  searchContainer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.md,
  },

  // ── List ────────────────────────────────────────────────────────
  listContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.hero,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  listItemSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  listItemPressed: {
    backgroundColor: Colors.borderLight,
  },
  listItemContent: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  listItemName: {
    fontSize: Typography.label,
    fontWeight: Typography.medium,
    color: Colors.textPrimary,
    lineHeight: Typography.label * 1.4,
  },
  listItemNameSelected: {
    color: Colors.primary,
    fontWeight: Typography.semiBold,
  },
  listItemCity: {
    fontSize: Typography.caption,
    fontWeight: Typography.regular,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  listItemCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Empty ───────────────────────────────────────────────────────
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.hero,
    gap: Spacing.sm,
  },
  emptyTitle: {
    fontSize: Typography.body,
    fontWeight: Typography.semiBold,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
  emptySubtitle: {
    fontSize: Typography.caption,
    fontWeight: Typography.regular,
    color: Colors.textTertiary,
  },
});
