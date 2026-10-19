import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants';
import { StatusBadge } from '../components';
import { useMarketplace } from '../context';
import { RootStackParamList } from '../types';
import { CATEGORIES } from '../data';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetails'>;

export const ProductDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { productId } = route.params;
  const {
    products,
    userProfile,
    isWishlisted,
    toggleWishlist,
    getOrCreateConversation,
  } = useMarketplace();

  const product = products.find((p) => p.id === productId);

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!product) {
    return (
      <SafeAreaView style={styles.notFoundRoot}>
        <Ionicons name="alert-circle-outline" size={48} color={Colors.textTertiary} />
        <Text style={styles.notFoundTitle}>Listing Not Found</Text>
        <Text style={styles.notFoundSub}>
          This listing may have been deleted or archived by the seller.
        </Text>
        <TouchableOpacity style={styles.backHomeBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backHomeText}>Return to Marketplace</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const isOwner = product.sellerId === userProfile.id;
  const isAvailable = product.status === 'ACTIVE';
  const category = CATEGORIES.find((c) => c.id === product.categoryId);
  const images = product.images.length > 0 ? product.images : [
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
  ];

  const handleContactSeller = () => {
    if (isOwner) {
      navigation.navigate('MyListings');
      return;
    }
    const conv = getOrCreateConversation(product);
    navigation.navigate('Chat', {
      conversationId: conv.id,
      productId: product.id,
      sellerId: product.sellerId,
      sellerName: product.sellerName,
    });
  };

  const handleBuyNow = () => {
    if (isOwner) {
      Alert.alert('Your Listing', 'You cannot purchase your own listing.');
      return;
    }
    if (!isAvailable) {
      Alert.alert(
        'Item Unavailable',
        `This item is currently ${product.status.toLowerCase()}. You cannot purchase it at this time.`
      );
      return;
    }
    navigation.navigate('Checkout', { productId: product.id });
  };

  const handleReport = () => {
    navigation.navigate('ReportListing', {
      productId: product.id,
      productTitle: product.title,
    });
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* ── Scrollable Body ──────────────────────────────────── */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Image Gallery */}
        <View style={styles.galleryContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const slide = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
              setActiveImageIndex(slide);
            }}
            scrollEventThrottle={16}
          >
            {images.map((imgUri, idx) => (
              <Image
                key={idx}
                source={{ uri: imgUri }}
                style={styles.galleryImage}
                resizeMode="cover"
              />
            ))}
          </ScrollView>

          {/* Top Overlay Bar */}
          <SafeAreaView edges={['top']} style={styles.overlayTopBar}>
            <TouchableOpacity
              style={styles.overlayBtn}
              onPress={() => navigation.goBack()}
              activeOpacity={0.8}
            >
              <Ionicons name="arrow-back" size={22} color={Colors.white} />
            </TouchableOpacity>

            <View style={styles.overlayRightGroup}>
              <TouchableOpacity
                style={styles.overlayBtn}
                onPress={() => toggleWishlist(product.id)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={isWishlisted(product.id) ? 'heart' : 'heart-outline'}
                  size={22}
                  color={isWishlisted(product.id) ? '#EF4444' : Colors.white}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.overlayBtn}
                onPress={handleReport}
                activeOpacity={0.8}
              >
                <Ionicons name="flag-outline" size={20} color={Colors.white} />
              </TouchableOpacity>
            </View>
          </SafeAreaView>

          {/* Image Dots Indicator */}
          {images.length > 1 && (
            <View style={styles.dotsRow}>
              {images.map((_, idx) => (
                <View
                  key={idx}
                  style={[styles.dot, activeImageIndex === idx && styles.dotActive]}
                />
              ))}
            </View>
          )}

          {/* Status Badge Tag on Image */}
          {product.status !== 'ACTIVE' && (
            <View style={styles.statusOverlay}>
              <StatusBadge status={product.status} size="md" />
            </View>
          )}
        </View>

        {/* ── Main Product Content ─────────────────────────────── */}
        <View style={styles.contentCard}>
          {/* Own Listing Banner */}
          {isOwner && (
            <View style={styles.ownerBanner}>
              <Ionicons name="person-circle-outline" size={20} color={Colors.primary} />
              <Text style={styles.ownerBannerText}>
                This is your listing. You can manage or edit details anytime.
              </Text>
            </View>
          )}

          {/* Category & Condition Row */}
          <View style={styles.metaBadgeRow}>
            {category && (
              <View style={styles.categoryBadge}>
                <Ionicons name={category.iconName as any} size={14} color={Colors.primary} />
                <Text style={styles.categoryBadgeText}>{category.name}</Text>
              </View>
            )}
            <StatusBadge status={product.condition} size="md" />
          </View>

          {/* Title */}
          <Text style={styles.title}>{product.title}</Text>

          {/* Price Container */}
          <View style={styles.priceContainer}>
            <View style={styles.priceRow}>
              <Text style={styles.currencySymbol}>₹</Text>
              <Text style={styles.price}>{product.price.toLocaleString('en-IN')}</Text>
              {product.originalPrice && (
                <Text style={styles.originalPrice}>
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </Text>
              )}
            </View>
            {product.negotiable && (
              <View style={styles.negotiablePill}>
                <Ionicons name="swap-horizontal" size={12} color={Colors.success} />
                <Text style={styles.negotiablePillText}>Price Negotiable</Text>
              </View>
            )}
          </View>

          {/* Campus Handover & Pickup Section */}
          <View style={styles.sectionBox}>
            <Text style={styles.sectionHeading}>Campus & Pickup Location</Text>
            <View style={styles.campusCard}>
              <View style={styles.campusIconCircle}>
                <Ionicons name="business" size={20} color={Colors.primary} />
              </View>
              <View style={styles.campusInfo}>
                <Text style={styles.campusName}>{product.sellerInstitutionName}</Text>
                <View style={styles.locationDetailRow}>
                  <Ionicons name="location-outline" size={14} color={Colors.textSecondary} />
                  <Text style={styles.locationDetailText}>{product.pickupLocation}</Text>
                </View>
              </View>
            </View>
            <View style={styles.pickupNotice}>
              <Ionicons name="shield-checkmark-outline" size={15} color={Colors.primary} />
              <Text style={styles.pickupNoticeText}>
                Handover happens in-person on campus. No hidden courier or shipping charges.
              </Text>
            </View>
          </View>

          {/* Description Section */}
          <View style={styles.sectionBox}>
            <Text style={styles.sectionHeading}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          {/* Seller Card */}
          <View style={styles.sectionBox}>
            <Text style={styles.sectionHeading}>Seller Details</Text>
            <TouchableOpacity
              style={styles.sellerCard}
              onPress={() =>
                navigation.navigate('SellerProfile', { sellerId: product.sellerId })
              }
              activeOpacity={0.8}
            >
              <View style={styles.sellerAvatarWrap}>
                {product.sellerAvatar ? (
                  <Image source={{ uri: product.sellerAvatar }} style={styles.sellerAvatar} />
                ) : (
                  <View style={styles.sellerAvatarFallback}>
                    <Text style={styles.sellerAvatarInitial}>
                      {product.sellerName.charAt(0)}
                    </Text>
                  </View>
                )}
                <View style={styles.verifiedCheckBadge}>
                  <Ionicons name="checkmark" size={10} color={Colors.white} />
                </View>
              </View>

              <View style={styles.sellerMeta}>
                <View style={styles.sellerNameRow}>
                  <Text style={styles.sellerName}>{product.sellerName}</Text>
                  <View style={styles.roleTag}>
                    <Text style={styles.roleTagText}>{product.sellerRole}</Text>
                  </View>
                </View>
                <Text style={styles.sellerCollege} numberOfLines={1}>
                  {product.sellerInstitutionName}
                </Text>
                <View style={styles.verifiedRow}>
                  <Ionicons name="shield-checkmark" size={12} color={Colors.success} />
                  <Text style={styles.verifiedLabel}>Verified Campus Member</Text>
                </View>
              </View>

              <Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} />
            </TouchableOpacity>
          </View>

          {/* Safety Notice */}
          <View style={styles.safetyBox}>
            <Ionicons name="warning-outline" size={18} color="#D97706" />
            <Text style={styles.safetyText}>
              Campus Safety Tip: Inspect items before paying. Always meet in daylight at well-populated campus spots like canteens, libraries, or department blocks.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* ── Fixed Bottom Actions ─────────────────────────────── */}
      <SafeAreaView edges={['bottom']} style={styles.safeFooter}>
        <View style={styles.footerRow}>
          {isOwner ? (
            <>
              <TouchableOpacity
                style={styles.secondaryBtn}
                onPress={() => navigation.navigate('MyListings')}
              >
                <Ionicons name="list" size={18} color={Colors.primary} />
                <Text style={styles.secondaryBtnText}>My Listings</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={() => navigation.navigate('EditListing', { productId: product.id })}
              >
                <Ionicons name="create-outline" size={18} color={Colors.white} />
                <Text style={styles.primaryBtnText}>Edit Listing</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={styles.secondaryBtn}
                onPress={handleContactSeller}
                activeOpacity={0.8}
              >
                <Ionicons name="chatbubble-ellipses-outline" size={18} color={Colors.primary} />
                <Text style={styles.secondaryBtnText}>Contact Seller</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.primaryBtn, !isAvailable && styles.primaryBtnDisabled]}
                onPress={handleBuyNow}
                disabled={!isAvailable}
                activeOpacity={0.8}
              >
                <Ionicons name="flash-outline" size={18} color={Colors.white} />
                <Text style={styles.primaryBtnText}>
                  {isAvailable ? 'Buy Now' : `Item ${product.status}`}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },
  galleryContainer: {
    width: SCREEN_WIDTH,
    height: 340,
    backgroundColor: '#0F172A',
    position: 'relative',
  },
  galleryImage: {
    width: SCREEN_WIDTH,
    height: 340,
  },
  overlayTopBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xs,
  },
  overlayRightGroup: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  overlayBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotsRow: {
    position: 'absolute',
    bottom: Spacing.md,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  dotActive: {
    width: 18,
    backgroundColor: Colors.white,
  },
  statusOverlay: {
    position: 'absolute',
    bottom: Spacing.md,
    left: Spacing.lg,
  },

  contentCard: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
  },
  ownerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  ownerBannerText: {
    flex: 1,
    fontSize: Typography.caption,
    color: Colors.primary,
    fontWeight: Typography.medium,
  },
  metaBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  categoryBadgeText: {
    fontSize: Typography.caption,
    fontWeight: Typography.semiBold,
    color: Colors.primary,
  },
  title: {
    fontSize: Typography.heading2,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    lineHeight: Typography.heading2 * 1.3,
    marginBottom: Spacing.md,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    marginBottom: Spacing.lg,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currencySymbol: {
    fontSize: Typography.heading2,
    fontWeight: Typography.bold,
    color: Colors.primary,
    marginRight: 2,
  },
  price: {
    fontSize: 32,
    fontWeight: Typography.bold,
    color: Colors.primary,
    letterSpacing: -0.5,
  },
  originalPrice: {
    fontSize: Typography.body,
    color: Colors.textTertiary,
    textDecorationLine: 'line-through',
    marginLeft: Spacing.sm,
  },
  negotiablePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  negotiablePillText: {
    fontSize: 11,
    fontWeight: Typography.semiBold,
    color: Colors.success,
  },

  sectionBox: {
    marginBottom: Spacing.xl,
  },
  sectionHeading: {
    fontSize: Typography.caption,
    fontWeight: Typography.bold,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  campusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.md,
    ...Shadows.card,
  },
  campusIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  campusInfo: {
    flex: 1,
  },
  campusName: {
    fontSize: Typography.bodySmall,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  locationDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationDetailText: {
    fontSize: Typography.caption,
    color: Colors.textSecondary,
    flex: 1,
  },
  pickupNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EEF2FF',
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.sm,
  },
  pickupNoticeText: {
    fontSize: 11,
    color: Colors.primary,
    flex: 1,
  },
  description: {
    fontSize: Typography.body,
    color: Colors.textPrimary,
    lineHeight: Typography.body * 1.5,
  },

  sellerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.md,
    ...Shadows.card,
  },
  sellerAvatarWrap: {
    position: 'relative',
  },
  sellerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  sellerAvatarFallback: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sellerAvatarInitial: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: Typography.bold,
  },
  verifiedCheckBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  sellerMeta: {
    flex: 1,
  },
  sellerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  sellerName: {
    fontSize: Typography.body,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  roleTag: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: BorderRadius.xs,
  },
  roleTagText: {
    fontSize: 9,
    fontWeight: Typography.bold,
    color: Colors.primary,
  },
  sellerCollege: {
    fontSize: Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  verifiedLabel: {
    fontSize: 11,
    color: Colors.success,
    fontWeight: Typography.medium,
  },

  safetyBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFBEB',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#FDE68A',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  safetyText: {
    flex: 1,
    fontSize: Typography.caption,
    color: '#92400E',
    lineHeight: Typography.caption * 1.4,
  },

  safeFooter: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    ...Shadows.card,
  },
  footerRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  secondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Platform.OS === 'ios' ? 14 : 12,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  secondaryBtnText: {
    fontSize: Typography.label,
    fontWeight: Typography.bold,
    color: Colors.primary,
  },
  primaryBtn: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Platform.OS === 'ios' ? 14 : 12,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    ...Shadows.button,
  },
  primaryBtnDisabled: {
    backgroundColor: Colors.textTertiary,
    shadowOpacity: 0,
  },
  primaryBtnText: {
    fontSize: Typography.label,
    fontWeight: Typography.bold,
    color: Colors.white,
  },

  notFoundRoot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  notFoundTitle: {
    fontSize: Typography.heading2,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginTop: Spacing.md,
  },
  notFoundSub: {
    fontSize: Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xs,
    marginBottom: Spacing.xl,
  },
  backHomeBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
  },
  backHomeText: {
    color: Colors.white,
    fontWeight: Typography.bold,
    fontSize: Typography.label,
  },
});
