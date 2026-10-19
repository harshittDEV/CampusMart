import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants';
import { Product } from '../types';
import { StatusBadge } from './StatusBadge';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
  horizontal?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  isWishlisted,
  onToggleWishlist,
  horizontal = false,
}) => {
  const [imgError, setImgError] = useState(false);
  const imageUrl = !imgError && product.images?.[0] ? product.images[0] : FALLBACK_IMAGE;

  return (
    <TouchableOpacity
      style={[styles.card, horizontal ? styles.horizontalCard : styles.verticalCard]}
      onPress={onPress}
      activeOpacity={0.88}
    >
      {/* Product Image Container */}
      <View style={horizontal ? styles.horizontalImageWrapper : styles.verticalImageWrapper}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
          onError={() => setImgError(true)}
        />

        {/* Wishlist Heart Button */}
        <TouchableOpacity
          style={styles.wishlistBtn}
          onPress={onToggleWishlist}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isWishlisted ? 'heart' : 'heart-outline'}
            size={18}
            color={isWishlisted ? '#EF4444' : Colors.textSecondary}
          />
        </TouchableOpacity>

        {/* Condition Tag */}
        <View style={styles.conditionTag}>
          <StatusBadge status={product.condition} size="sm" />
        </View>
      </View>

      {/* Details Container */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>

        {/* Campus & Seller */}
        <View style={styles.campusRow}>
          <Ionicons name="business-outline" size={13} color={Colors.primary} />
          <Text style={styles.campusText} numberOfLines={1}>
            {product.sellerInstitutionName}
          </Text>
        </View>

        {/* Price Row */}
        <View style={styles.priceRow}>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>₹{product.price.toLocaleString('en-IN')}</Text>
            {product.originalPrice && product.originalPrice > product.price && (
              <Text style={styles.originalPrice}>₹{product.originalPrice.toLocaleString('en-IN')}</Text>
            )}
          </View>
          {product.negotiable && (
            <View style={styles.negotiableTag}>
              <Text style={styles.negotiableText}>Negotiable</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
    overflow: 'hidden',
  },
  verticalCard: {
    width: '100%',
    marginBottom: Spacing.md,
  },
  horizontalCard: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
    height: 128,
  },
  verticalImageWrapper: {
    width: '100%',
    height: 170,
    backgroundColor: Colors.borderLight,
    position: 'relative',
  },
  horizontalImageWrapper: {
    width: 120,
    height: '100%',
    backgroundColor: Colors.borderLight,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  wishlistBtn: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.card,
  },
  conditionTag: {
    position: 'absolute',
    bottom: Spacing.sm,
    left: Spacing.sm,
  },
  content: {
    padding: Spacing.md,
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: Typography.body,
    fontWeight: Typography.semiBold,
    color: Colors.textPrimary,
    lineHeight: Typography.body * 1.3,
    marginBottom: Spacing.xs,
  },
  campusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: Spacing.xs,
  },
  campusText: {
    fontSize: Typography.caption,
    color: Colors.textSecondary,
    flex: 1,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.xs,
  },
  price: {
    fontSize: Typography.heading3,
    fontWeight: Typography.bold,
    color: Colors.primary,
  },
  originalPrice: {
    fontSize: Typography.caption,
    color: Colors.textTertiary,
    textDecorationLine: 'line-through',
  },
  negotiableTag: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: Spacing.xs + 2,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  negotiableText: {
    fontSize: 10,
    fontWeight: Typography.medium,
    color: Colors.success,
  },
});
