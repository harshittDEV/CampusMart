import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Image,
  TextInput,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import {
  ProductCard,
  CategoryChip,
  CampusScopeSelector,
  EmptyState,
} from '../components';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants';
import { CATEGORIES } from '../data';
import { useMarketplace } from '../context';
import { RootStackParamList, MainTabParamList } from '../types';
import { listingService } from '../services/listingService';

type NavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'HomeTab'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const {
    userProfile,
    campusScope,
    setCampusScope,
    products,
    wishlist,
    toggleWishlist,
    isWishlisted,
    unreadNotificationCount,
  } = useMarketplace();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filter products by campus scope
  const scopedProducts = useMemo(() => {
    return listingService.filterByCampus(products, userProfile.institutionId, campusScope);
  }, [products, userProfile.institutionId, campusScope]);

  // Filter by category if selected
  const displayedProducts = useMemo(() => {
    if (!selectedCategory) return scopedProducts;
    return scopedProducts.filter((p) => p.categoryId === selectedCategory);
  }, [scopedProducts, selectedCategory]);

  // Featured items (most saved or top prices)
  const featuredProducts = useMemo(() => {
    return [...scopedProducts]
      .sort((a, b) => (b.savesCount || 0) - (a.savesCount || 0))
      .slice(0, 4);
  }, [scopedProducts]);

  // Recently listed
  const recentProducts = useMemo(() => {
    return [...displayedProducts]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [displayedProducts]);

  const handleSelectCategory = (catId: string) => {
    setSelectedCategory((prev) => (prev === catId ? null : catId));
  };

  const handleShowInstitutionInfo = () => {
    Alert.alert(
      'Verified Institution',
      `${userProfile.institutionName}\n\nYour account is verified at this institution. You can buy and sell items within your campus, or toggle browsing to discover items across other colleges in India.`,
      [{ text: 'Got It' }]
    );
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* ── Top Header ────────────────────────────────────────── */}
      <SafeAreaView edges={['top']} style={styles.safeHeader}>
        <View style={styles.header}>
          {/* Left: Branding & Greeting */}
          <View style={styles.headerLeft}>
            <View style={styles.brandRow}>
              <View style={styles.logoBadge}>
                <Ionicons name="cart" size={16} color={Colors.white} />
              </View>
              <Text style={styles.brandName}>CampusMart</Text>
            </View>
            <Text style={styles.greetingText}>
              Hi, {userProfile.name.split(' ')[0]} 👋
            </Text>
          </View>

          {/* Right: Notification Bell & Profile Avatar */}
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => navigation.navigate('Notifications')}
              activeOpacity={0.7}
              accessibilityLabel="Notifications"
            >
              <Ionicons name="notifications-outline" size={22} color={Colors.textPrimary} />
              {unreadNotificationCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.avatarBtn}
              onPress={() => navigation.navigate('MainTabs', { screen: 'ProfileTab' } as never)}
              activeOpacity={0.7}
            >
              {userProfile.avatar ? (
                <Image source={{ uri: userProfile.avatar }} style={styles.avatarImg} />
              ) : (
                <View style={styles.avatarFallback}>
                  <Text style={styles.avatarInitial}>
                    {userProfile.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Institution Verification Badge */}
        <TouchableOpacity
          style={styles.institutionBar}
          onPress={handleShowInstitutionInfo}
          activeOpacity={0.8}
        >
          <Ionicons name="shield-checkmark" size={14} color={Colors.success} />
          <Text style={styles.institutionText} numberOfLines={1}>
            {userProfile.institutionName}
          </Text>
          <Ionicons name="chevron-forward" size={12} color={Colors.textTertiary} />
        </TouchableOpacity>
      </SafeAreaView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Search Bar Trigger ───────────────────────────────── */}
        <View style={styles.searchSection}>
          <TouchableOpacity
            style={styles.searchBarTrigger}
            onPress={() => navigation.navigate('SearchResults', {})}
            activeOpacity={0.8}
          >
            <Ionicons name="search-outline" size={20} color={Colors.primary} />
            <Text style={styles.searchPlaceholder}>
              Search books, electronics, cycles...
            </Text>
            <View style={styles.filterIconCircle}>
              <Ionicons name="options-outline" size={16} color={Colors.primary} />
            </View>
          </TouchableOpacity>
        </View>

        {/* ── Campus Selector ──────────────────────────────────── */}
        <View style={styles.campusSection}>
          <Text style={styles.sectionTitle}>Browsing Scope</Text>
          <CampusScopeSelector
            currentScope={campusScope}
            onSelectScope={setCampusScope}
            institutionName={userProfile.institutionName}
          />
        </View>

        {/* ── Categories Carousel ──────────────────────────────── */}
        <View style={styles.categoriesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            {selectedCategory && (
              <TouchableOpacity onPress={() => setSelectedCategory(null)}>
                <Text style={styles.clearFilterText}>Show All</Text>
              </TouchableOpacity>
            )}
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScroll}
          >
            {CATEGORIES.map((cat) => (
              <CategoryChip
                key={cat.id}
                category={cat}
                isSelected={selectedCategory === cat.id}
                onPress={() => handleSelectCategory(cat.id)}
              />
            ))}
          </ScrollView>
        </View>

        {/* ── Featured Products Carousel ───────────────────────── */}
        {!selectedCategory && featuredProducts.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.featuredBadgeRow}>
                <Ionicons name="flame" size={18} color="#EA580C" />
                <Text style={styles.sectionTitle}>Popular on Campus</Text>
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate('ExploreTab', undefined)}
              >
                <Text style={styles.seeAllText}>Explore</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredScroll}
            >
              {featuredProducts.map((product) => (
                <View key={`feat_${product.id}`} style={styles.featuredCardWrapper}>
                  <ProductCard
                    product={product}
                    isWishlisted={isWishlisted(product.id)}
                    onToggleWishlist={() => toggleWishlist(product.id)}
                    onPress={() =>
                      navigation.navigate('ProductDetails', { productId: product.id })
                    }
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* ── Recently Listed Products ─────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {selectedCategory
                ? `${CATEGORIES.find((c) => c.id === selectedCategory)?.name || 'Category'} (${recentProducts.length})`
                : 'Recently Listed'}
            </Text>
            <Text style={styles.itemCountText}>{recentProducts.length} items</Text>
          </View>

          {recentProducts.length === 0 ? (
            <EmptyState
              iconName="cube-outline"
              title="No Listings Found"
              description="No products match the selected campus scope and category filter."
              actionLabel="Reset Scope to All Campuses"
              onAction={() => {
                setCampusScope('ALL_CAMPUSES');
                setSelectedCategory(null);
              }}
            />
          ) : (
            <View style={styles.productsGrid}>
              {recentProducts.map((product) => (
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
        </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.sm,
  },
  headerLeft: {
    flex: 1,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logoBadge: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    fontSize: Typography.bodySmall,
    fontWeight: Typography.bold,
    color: Colors.primary,
    letterSpacing: -0.2,
  },
  greetingText: {
    fontSize: Typography.heading3,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 9,
    fontWeight: Typography.bold,
  },
  avatarBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  avatarFallback: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    color: Colors.white,
    fontWeight: Typography.bold,
    fontSize: 16,
  },
  institutionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EEF2FF',
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.sm,
    paddingVertical: 6,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
  },
  institutionText: {
    flex: 1,
    fontSize: 12,
    fontWeight: Typography.medium,
    color: Colors.primary,
  },

  // ── Scroll Content ──────────────────────────────────────────────
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.hero,
  },
  searchSection: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xs,
  },
  searchBarTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
    gap: Spacing.sm,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: Typography.bodySmall,
    color: Colors.textTertiary,
  },
  filterIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  campusSection: {
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.sm,
  },
  sectionTitle: {
    fontSize: Typography.heading3,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  featuredBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllText: {
    fontSize: Typography.caption,
    fontWeight: Typography.semiBold,
    color: Colors.primary,
  },
  itemCountText: {
    fontSize: Typography.caption,
    color: Colors.textTertiary,
  },
  clearFilterText: {
    fontSize: Typography.caption,
    fontWeight: Typography.semiBold,
    color: Colors.secondary,
  },

  categoriesSection: {
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.xl,
  },
  categoriesScroll: {
    paddingVertical: Spacing.xs,
  },

  section: {
    marginTop: Spacing.xl,
    paddingHorizontal: Spacing.xl,
  },
  featuredScroll: {
    paddingVertical: Spacing.xs,
    gap: Spacing.md,
  },
  featuredCardWrapper: {
    width: 240,
  },
  productsGrid: {
    width: '100%',
  },
});
