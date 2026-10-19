import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProductCard, EmptyState, CategoryChip } from '../components';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants';
import { CATEGORIES } from '../data';
import { useMarketplace } from '../context';
import { RootStackParamList } from '../types';
import { listingService } from '../services/listingService';

type Props = NativeStackScreenProps<RootStackParamList, 'SearchResults'>;

export const SearchResultsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { initialQuery = '', categoryId } = route.params || {};
  const { products, isWishlisted, toggleWishlist } = useMarketplace();

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryId || null);

  const results = useMemo(() => {
    return listingService.search(products, query, {
      categoryId: selectedCategory || undefined,
      sortBy: 'recent',
    });
  }, [products, query, selectedCategory]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* ── Search Header ────────────────────────────────────── */}
      <SafeAreaView edges={['top']} style={styles.safeHeader}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>

          <View style={styles.inputBox}>
            <Ionicons name="search-outline" size={18} color={Colors.textTertiary} />
            <TextInput
              style={styles.input}
              placeholder="Search books, cycles, laptops..."
              placeholderTextColor={Colors.textTertiary}
              value={query}
              onChangeText={setQuery}
              autoFocus={!initialQuery}
              returnKeyType="search"
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')}>
                <Ionicons name="close-circle" size={18} color={Colors.textTertiary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Category horizontal scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
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

      {/* ── Results List ─────────────────────────────────────── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>
            {results.length} {results.length === 1 ? 'item' : 'items'} found
          </Text>
          {selectedCategory && (
            <TouchableOpacity onPress={() => setSelectedCategory(null)}>
              <Text style={styles.clearFilterText}>Clear category</Text>
            </TouchableOpacity>
          )}
        </View>

        {results.length === 0 ? (
          <EmptyState
            iconName="search-outline"
            title="No Matching Items"
            description="We couldn't find anything matching your search term. Try a different keyword or campus filter."
            actionLabel="Reset Search"
            onAction={() => {
              setQuery('');
              setSelectedCategory(null);
            }}
          />
        ) : (
          <View style={styles.productsGrid}>
            {results.map((product) => (
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
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  safeHeader: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    ...Shadows.card,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Platform.OS === 'ios' ? 8 : 6,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.xs,
  },
  input: {
    flex: 1,
    fontSize: Typography.bodySmall,
    color: Colors.textPrimary,
  },
  categoryScroll: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    paddingTop: Spacing.xs,
    gap: Spacing.xs,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.hero,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xs,
  },
  metaText: {
    fontSize: Typography.caption,
    fontWeight: Typography.semiBold,
    color: Colors.textSecondary,
  },
  clearFilterText: {
    fontSize: Typography.caption,
    color: Colors.secondary,
    fontWeight: Typography.semiBold,
  },
  productsGrid: {
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.sm,
  },
});
