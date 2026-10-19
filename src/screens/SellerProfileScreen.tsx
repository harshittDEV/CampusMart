import React, { useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  StatusBar,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants';
import { useMarketplace } from '../context';
import { RootStackParamList } from '../types';
import { ProductCard } from '../components';

type Props = NativeStackScreenProps<RootStackParamList, 'SellerProfile'>;

export const SellerProfileScreen: React.FC<Props> = ({ route, navigation }) => {
  const { sellerId } = route.params;
  const { products, reviews, isWishlisted, toggleWishlist } = useMarketplace();

  // Find listings by this seller
  const sellerListings = useMemo(() => {
    return products.filter((p) => p.sellerId === sellerId);
  }, [products, sellerId]);

  // Find reviews for this seller
  const sellerReviews = useMemo(() => {
    return reviews.filter((r) => r.sellerId === sellerId);
  }, [reviews, sellerId]);

  // Seller metadata from first listing or fallback
  const firstListing = sellerListings[0];
  const sellerName = firstListing?.sellerName || 'Verified Member';
  const sellerRole = firstListing?.sellerRole || 'STUDENT';
  const sellerCampus = firstListing?.sellerInstitutionName || 'Verified VTU Campus';
  const sellerAvatar = firstListing?.sellerAvatar;

  const avgRating =
    sellerReviews.length > 0
      ? (sellerReviews.reduce((sum, r) => sum + r.rating, 0) / sellerReviews.length).toFixed(1)
      : '4.9';

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      <SafeAreaView edges={['top']} style={styles.safeHeader}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Seller Profile</Text>
          <View style={{ width: 36 }} />
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarRow}>
            {sellerAvatar ? (
              <Image source={{ uri: sellerAvatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarInitial}>{sellerName.charAt(0)}</Text>
              </View>
            )}
            <View style={styles.profileMeta}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>{sellerName}</Text>
                <View style={styles.roleTag}>
                  <Text style={styles.roleTagText}>{sellerRole}</Text>
                </View>
              </View>

              <View style={styles.campusRow}>
                <Ionicons name="school-outline" size={13} color={Colors.textSecondary} />
                <Text style={styles.campusText} numberOfLines={2}>
                  {sellerCampus}
                </Text>
              </View>

              <View style={styles.verifiedRow}>
                <Ionicons name="shield-checkmark" size={13} color={Colors.success} />
                <Text style={styles.verifiedText}>Verified Campus Identity</Text>
              </View>
            </View>
          </View>

          {/* Stats Bar */}
          <View style={styles.statsBar}>
            <View style={styles.statCol}>
              <Text style={styles.statVal}>{sellerListings.length}</Text>
              <Text style={styles.statLabel}>Listings</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCol}>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={14} color="#F59E0B" />
                <Text style={styles.statVal}>{avgRating}</Text>
              </View>
              <Text style={styles.statLabel}>{sellerReviews.length} Reviews</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCol}>
              <Text style={styles.statVal}>100%</Text>
              <Text style={styles.statLabel}>Handover Rate</Text>
            </View>
          </View>
        </View>

        {/* Listings by this seller */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Items for Sale ({sellerListings.length})
          </Text>
          <View style={styles.listingsGrid}>
            {sellerListings.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                isWishlisted={isWishlisted(prod.id)}
                onToggleWishlist={() => toggleWishlist(prod.id)}
                onPress={() =>
                  navigation.navigate('ProductDetails', { productId: prod.id })
                }
              />
            ))}
          </View>
        </View>

        {/* Reviews Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Campus Handover Reviews</Text>

          {sellerReviews.length === 0 ? (
            <View style={styles.emptyReviewBox}>
              <Ionicons name="chatbox-outline" size={24} color={Colors.textTertiary} />
              <Text style={styles.emptyReviewText}>
                No reviews yet. Reviews are created after completed campus handovers.
              </Text>
            </View>
          ) : (
            sellerReviews.map((rev) => (
              <View key={rev.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View>
                    <Text style={styles.reviewerName}>{rev.reviewerName}</Text>
                    <Text style={styles.reviewerCampus}>{rev.reviewerInstitution}</Text>
                  </View>
                  <View style={styles.starsRow}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Ionicons
                        key={s}
                        name={s <= rev.rating ? 'star' : 'star-outline'}
                        size={14}
                        color="#F59E0B"
                      />
                    ))}
                  </View>
                </View>
                <Text style={styles.reviewComment}>{rev.comment}</Text>
                <Text style={styles.reviewDate}>
                  {new Date(rev.createdAt).toLocaleDateString()}
                </Text>
              </View>
            ))
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
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    ...Shadows.card,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: Typography.heading3,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.xl,
    paddingBottom: Spacing.hero,
  },
  profileCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xl,
    ...Shadows.card,
  },
  avatarRow: {
    flexDirection: 'row',
    gap: Spacing.lg,
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  avatarFallback: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 26,
    fontWeight: Typography.bold,
    color: Colors.white,
  },
  profileMeta: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  name: {
    fontSize: Typography.heading3,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  roleTag: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  roleTagText: {
    fontSize: 10,
    fontWeight: Typography.bold,
    color: Colors.primary,
  },
  campusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  campusText: {
    fontSize: Typography.caption,
    color: Colors.textSecondary,
    flex: 1,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  verifiedText: {
    fontSize: 11,
    color: Colors.success,
    fontWeight: Typography.medium,
  },
  statsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statVal: {
    fontSize: Typography.body,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.border,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.heading3,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  listingsGrid: {
    width: '100%',
  },
  emptyReviewBox: {
    backgroundColor: Colors.white,
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyReviewText: {
    fontSize: Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  reviewCard: {
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.sm,
    ...Shadows.card,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
  reviewerName: {
    fontSize: Typography.bodySmall,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  reviewerCampus: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewComment: {
    fontSize: Typography.bodySmall,
    color: Colors.textPrimary,
    lineHeight: Typography.bodySmall * 1.35,
    marginTop: 4,
  },
  reviewDate: {
    fontSize: 10,
    color: Colors.textTertiary,
    marginTop: 6,
  },
});
