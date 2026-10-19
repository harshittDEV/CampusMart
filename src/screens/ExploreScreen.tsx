import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Modal,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CompositeNavigationProp, useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { ProductCard, CategoryChip, EmptyState } from '../components';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants';
import { CATEGORIES } from '../data';
import { useMarketplace } from '../context';
import { RootStackParamList, MainTabParamList, ProductCondition } from '../types';
import { listingService } from '../services/listingService';

const TRENDING_SEARCHES = [
  'Calculator',
  'Cycle',
  'VTU Notes',
  'Monitor',
  'Electric Kettle',
  'Guitar',
  'Table',
];

const SORT_OPTIONS: { id: 'recommended' | 'recent' | 'price_low' | 'price_high'; label: string }[] = [
  { id: 'recommended', label: 'Recommended' },
  { id: 'recent', label: 'Recently Listed' },
  { id: 'price_low', label: 'Price: Low to High' },
  { id: 'price_high', label: 'Price: High to Low' },
];

const CONDITIONS: { id: ProductCondition; label: string }[] = [
  { id: 'NEW', label: 'New' },
  { id: 'LIKE_NEW', label: 'Like New' },
  { id: 'GOOD', label: 'Good' },
  { id: 'FAIR', label: 'Fair' },
  { id: 'NEEDS_REPAIR', label: 'Needs Repair' },
];

type NavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'ExploreTab'>,
  NativeStackNavigationProp<RootStackParamList>
>;

type RouteProps = RouteProp<MainTabParamList, 'ExploreTab'>;

export const ExploreScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { products, isWishlisted, toggleWishlist } = useMarketplace();

  // Search & filter states
  const [searchQuery, setSearchQuery] = useState(route.params?.query || '');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    route.params?.categoryId || null
  );
  const [selectedCondition, setSelectedCondition] = useState<string | null>(null);
  const [selectedSort, setSelectedSort] = useState<'recommended' | 'recent' | 'price_low' | 'price_high'>('recommended');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    return listingService.search(products, searchQuery, {
      categoryId: selectedCategory || undefined,
      condition: selectedCondition || undefined,
      minPrice: minPrice ? parseInt(minPrice, 10) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice, 10) : undefined,
      sortBy: selectedSort,
    });
  }, [products, searchQuery, selectedCategory, selectedCondition, minPrice, maxPrice, selectedSort]);

  const hasActiveFilters =
    Boolean(selectedCategory) ||
    Boolean(selectedCondition) ||
    Boolean(minPrice) ||
    Boolean(maxPrice) ||
    selectedSort !== 'recommended';

  const clearAllFilters = () => {
    setSelectedCategory(null);
    setSelectedCondition(null);
    setMinPrice('');
    setMaxPrice('');
    setSelectedSort('recommended');
    setSearchQuery('');
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* ── Top Header ────────────────────────────────────────── */}
      <SafeAreaView edges={['top']} style={styles.headerSafe}>
        <View style={styles.header}>
          <Text style={styles.screenTitle}>Explore Marketplace</Text>
          <TouchableOpacity
            style={[styles.filterTrigger, hasActiveFilters && styles.filterTriggerActive]}
            onPress={() => setFilterModalVisible(true)}
            activeOpacity={0.7}
          >
            <Ionicons
              name="filter"
              size={18}
              color={hasActiveFilters ? Colors.white : Colors.textPrimary}
            />
            {hasActiveFilters && <View style={styles.activeFilterDot} />}
          </TouchableOpacity>
        </View>

        {/* Search Input Bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color={Colors.textTertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search title, category, campus, seller..."
            placeholderTextColor={Colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close-circle" size={18} color={Colors.textTertiary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Categories Bar */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          <TouchableOpacity
            style={[styles.allChip, !selectedCategory && styles.allChipActive]}
            onPress={() => setSelectedCategory(null)}
          >
            <Text style={[styles.allChipText, !selectedCategory && styles.allChipTextActive]}>
              All Categories
            </Text>
          </TouchableOpacity>
          {CATEGORIES.map((cat) => (
            <CategoryChip
              key={cat.id}
              category={cat}
              isSelected={selectedCategory === cat.id}
              onPress={() => setSelectedCategory((prev) => (prev === cat.id ? null : cat.id))}
            />
          ))}
        </ScrollView>
      </SafeAreaView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Trending Searches Tags */}
        {!searchQuery && !hasActiveFilters && (
          <View style={styles.trendingSection}>
            <View style={styles.trendingTitleRow}>
              <Ionicons name="trending-up" size={16} color={Colors.primary} />
              <Text style={styles.trendingTitle}>Trending searches</Text>
            </View>
            <View style={styles.trendingTags}>
              {TRENDING_SEARCHES.map((tag) => (
                <TouchableOpacity
                  key={tag}
                  style={styles.tag}
                  onPress={() => setSearchQuery(tag)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.tagText}>{tag}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Results Bar */}
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>
            {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'} found
          </Text>
          {hasActiveFilters && (
            <TouchableOpacity onPress={clearAllFilters}>
              <Text style={styles.clearBtnText}>Clear filters</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Product List */}
        {filteredProducts.length === 0 ? (
          <EmptyState
            iconName="search-outline"
            title="No Results Found"
            description="We couldn't find any products matching your search criteria. Try adjusting your query or resetting filters."
            actionLabel="Clear All Filters"
            onAction={clearAllFilters}
          />
        ) : (
          <View style={styles.listContainer}>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={isWishlisted(product.id)}
                onToggleWishlist={() => toggleWishlist(product.id)}
                onPress={() =>
                  navigation.navigate('ProductDetails', { productId: product.id })
                }
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* ── Filter & Sort Modal ───────────────────────────────── */}
      <Modal
        visible={filterModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <SafeAreaView style={styles.modalRoot}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter & Sort</Text>
            <TouchableOpacity
              onPress={() => setFilterModalVisible(false)}
              style={styles.modalCloseBtn}
            >
              <Ionicons name="close" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
            {/* Sort Order */}
            <Text style={styles.filterSectionTitle}>Sort By</Text>
            <View style={styles.sortOptionsGroup}>
              {SORT_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.id}
                  style={[
                    styles.sortOptionBtn,
                    selectedSort === opt.id && styles.sortOptionBtnActive,
                  ]}
                  onPress={() => setSelectedSort(opt.id)}
                >
                  <Text
                    style={[
                      styles.sortOptionText,
                      selectedSort === opt.id && styles.sortOptionTextActive,
                    ]}
                  >
                    {opt.label}
                  </Text>
                  {selectedSort === opt.id && (
                    <Ionicons name="checkmark-circle" size={18} color={Colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Condition */}
            <Text style={styles.filterSectionTitle}>Product Condition</Text>
            <View style={styles.chipRow}>
              {CONDITIONS.map((cond) => {
                const isActive = selectedCondition === cond.id;
                return (
                  <TouchableOpacity
                    key={cond.id}
                    style={[styles.condChip, isActive && styles.condChipActive]}
                    onPress={() =>
                      setSelectedCondition((prev) => (prev === cond.id ? null : cond.id))
                    }
                  >
                    <Text style={[styles.condChipText, isActive && styles.condChipTextActive]}>
                      {cond.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Price Range */}
            <Text style={styles.filterSectionTitle}>Price Range (INR)</Text>
            <View style={styles.priceInputsRow}>
              <View style={styles.priceBox}>
                <Text style={styles.priceCurrency}>₹</Text>
                <TextInput
                  style={styles.priceInput}
                  placeholder="Min"
                  placeholderTextColor={Colors.textTertiary}
                  keyboardType="numeric"
                  value={minPrice}
                  onChangeText={setMinPrice}
                />
              </View>
              <Text style={styles.toText}>to</Text>
              <View style={styles.priceBox}>
                <Text style={styles.priceCurrency}>₹</Text>
                <TextInput
                  style={styles.priceInput}
                  placeholder="Max"
                  placeholderTextColor={Colors.textTertiary}
                  keyboardType="numeric"
                  value={maxPrice}
                  onChangeText={setMaxPrice}
                />
              </View>
            </View>
          </ScrollView>

          {/* Modal Actions */}
          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.resetBtn} onPress={clearAllFilters}>
              <Text style={styles.resetBtnText}>Reset All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applyBtn}
              onPress={() => setFilterModalVisible(false)}
            >
              <Text style={styles.applyBtnText}>
                Apply Filters ({filteredProducts.length})
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerSafe: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    ...Shadows.card,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.sm,
  },
  screenTitle: {
    fontSize: Typography.heading2,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  filterTrigger: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  filterTriggerActive: {
    backgroundColor: Colors.primary,
  },
  activeFilterDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.secondary,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    marginHorizontal: Spacing.xl,
    paddingHorizontal: Spacing.md,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.body,
    color: Colors.textPrimary,
  },
  categoryScroll: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
    gap: Spacing.xs,
  },
  allChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    marginRight: Spacing.sm,
    justifyContent: 'center',
  },
  allChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  allChipText: {
    fontSize: Typography.caption,
    fontWeight: Typography.medium,
    color: Colors.textSecondary,
  },
  allChipTextActive: {
    color: Colors.white,
    fontWeight: Typography.bold,
  },

  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.hero,
  },
  trendingSection: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
  },
  trendingTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.sm,
  },
  trendingTitle: {
    fontSize: Typography.caption,
    fontWeight: Typography.semiBold,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  trendingTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  tag: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  tagText: {
    fontSize: 12,
    fontWeight: Typography.medium,
    color: Colors.primary,
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  resultsCount: {
    fontSize: Typography.caption,
    fontWeight: Typography.semiBold,
    color: Colors.textSecondary,
  },
  clearBtnText: {
    fontSize: Typography.caption,
    fontWeight: Typography.semiBold,
    color: Colors.secondary,
  },
  listContainer: {
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.xs,
  },

  // Modal styles
  modalRoot: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  modalTitle: {
    fontSize: Typography.heading3,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  modalCloseBtn: {
    padding: Spacing.xs,
  },
  modalScroll: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
  },
  filterSectionTitle: {
    fontSize: Typography.caption,
    fontWeight: Typography.bold,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.md,
    marginTop: Spacing.lg,
  },
  sortOptionsGroup: {
    gap: Spacing.xs,
  },
  sortOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sortOptionBtnActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  sortOptionText: {
    fontSize: Typography.bodySmall,
    color: Colors.textPrimary,
  },
  sortOptionTextActive: {
    fontWeight: Typography.bold,
    color: Colors.primary,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  condChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  condChipActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  condChipText: {
    fontSize: Typography.caption,
    color: Colors.textPrimary,
  },
  condChipTextActive: {
    color: Colors.white,
    fontWeight: Typography.bold,
  },
  priceInputsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  priceBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
  },
  priceCurrency: {
    fontSize: Typography.body,
    fontWeight: Typography.bold,
    color: Colors.textSecondary,
    marginRight: 4,
  },
  priceInput: {
    flex: 1,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    fontSize: Typography.body,
    color: Colors.textPrimary,
  },
  toText: {
    fontSize: Typography.caption,
    color: Colors.textTertiary,
  },
  modalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    gap: Spacing.md,
  },
  resetBtn: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  resetBtnText: {
    fontSize: Typography.label,
    fontWeight: Typography.semiBold,
    color: Colors.textSecondary,
  },
  applyBtn: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBtnText: {
    fontSize: Typography.label,
    fontWeight: Typography.bold,
    color: Colors.white,
  },
});
