import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  TextInput,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants';
import { useMarketplace } from '../context';
import { RootStackParamList, OrderStatus } from '../types';
import { StatusBadge } from '../components';

type Props = NativeStackScreenProps<RootStackParamList, 'OrderDetails'>;

export const OrderDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { orderId } = route.params;
  const {
    orders,
    userProfile,
    updateOrderStatus,
    addReview,
    reviews,
  } = useMarketplace();

  const order = orders.find((o) => o.id === orderId);

  // Review modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  if (!order) {
    return (
      <SafeAreaView style={styles.errorRoot}>
        <Text style={styles.errorTitle}>Order not found</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>Return to Orders</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const isBuyer = order.buyerId === userProfile.id;
  const isSeller = order.sellerId === userProfile.id;
  const hasReviewed = reviews.some((r) => r.orderId === order.id);

  // Status transitions
  const handleMarkReady = () => {
    Alert.alert(
      'Ready for Pickup',
      'Notify the buyer that the item is ready for handover at your agreed campus spot?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            updateOrderStatus(order.id, 'READY_FOR_PICKUP');
          },
        },
      ]
    );
  };

  const handleCompleteOrder = () => {
    Alert.alert(
      'Confirm Handover Complete',
      'Have you met on campus and completed the item physical handover?',
      [
        { text: 'Not Yet', style: 'cancel' },
        {
          text: 'Yes, Complete Order',
          onPress: () => {
            updateOrderStatus(order.id, 'COMPLETED', 'PAID_DEMO');
          },
        },
      ]
    );
  };

  const handleCancelOrder = () => {
    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this order? The item will be made available to other students again.',
      [
        { text: 'Keep Order', style: 'cancel' },
        {
          text: 'Cancel Order',
          style: 'destructive',
          onPress: () => {
            updateOrderStatus(order.id, 'CANCELLED');
          },
        },
      ]
    );
  };

  const handleSubmitReview = () => {
    if (!comment.trim()) {
      Alert.alert('Review Comment', 'Please write a brief note about your handover experience.');
      return;
    }

    addReview({
      orderId: order.id,
      listingId: order.listingId,
      reviewerId: userProfile.id,
      reviewerName: userProfile.name,
      reviewerInstitution: userProfile.institutionName,
      sellerId: order.sellerId,
      rating,
      comment: comment.trim(),
    });

    setReviewModalOpen(false);
    Alert.alert('Review Submitted ⭐', 'Thank you for keeping CampusMart trusted and verified!');
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      <SafeAreaView edges={['top']} style={styles.safeHeader}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerBackBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerTitle}>Order #{order.id.slice(-6)}</Text>
            <Text style={styles.headerSub}>
              {new Date(order.createdAt).toLocaleDateString()}
            </Text>
          </View>
          <StatusBadge status={order.orderStatus} size="sm" />
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Item Card */}
        <TouchableOpacity
          style={styles.card}
          onPress={() =>
            navigation.navigate('ProductDetails', { productId: order.listingId })
          }
          activeOpacity={0.8}
        >
          <View style={styles.itemRow}>
            <Image
              source={{ uri: order.productSnapshot.image }}
              style={styles.itemThumb}
              resizeMode="cover"
            />
            <View style={styles.itemCol}>
              <Text style={styles.itemTitle} numberOfLines={2}>
                {order.productSnapshot.title}
              </Text>
              <StatusBadge status={order.productSnapshot.condition} size="sm" />
              <Text style={styles.itemPrice}>
                ₹{order.amount.toLocaleString('en-IN')}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Handover & Parties Section */}
        <View style={styles.card}>
          <Text style={styles.cardHeading}>Parties & Campus Details</Text>

          {/* Buyer */}
          <View style={styles.partyRow}>
            <View style={styles.partyAvatar}>
              <Ionicons name="person" size={16} color={Colors.primary} />
            </View>
            <View style={styles.partyMeta}>
              <Text style={styles.partyRole}>BUYER {isBuyer && '(You)'}</Text>
              <Text style={styles.partyName}>{order.buyerName}</Text>
              <Text style={styles.partyCampus}>{order.buyerInstitutionName}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Seller */}
          <View style={styles.partyRow}>
            <View style={styles.partyAvatar}>
              <Ionicons name="storefront" size={16} color={Colors.secondary} />
            </View>
            <View style={styles.partyMeta}>
              <Text style={styles.partyRole}>SELLER {isSeller && '(You)'}</Text>
              <Text style={styles.partyName}>{order.sellerName}</Text>
              <Text style={styles.partyCampus}>{order.sellerInstitutionName}</Text>
            </View>
          </View>

          {order.pickupNote && (
            <View style={styles.handoverNoteBox}>
              <Ionicons name="location-outline" size={16} color={Colors.primary} />
              <View style={{ flex: 1 }}>
                <Text style={styles.handoverNoteTitle}>Handover Location / Note</Text>
                <Text style={styles.handoverNoteText}>{order.pickupNote}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Status Timeline Card */}
        <View style={styles.card}>
          <Text style={styles.cardHeading}>Handover Progress</Text>
          <View style={styles.timeline}>
            <View style={styles.timelineStep}>
              <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
              <View style={styles.stepTextCol}>
                <Text style={styles.stepTitle}>Order Placed</Text>
                <Text style={styles.stepDesc}>Order created and confirmed locally</Text>
              </View>
            </View>

            <View style={styles.timelineStep}>
              <Ionicons
                name={
                  order.orderStatus === 'READY_FOR_PICKUP' || order.orderStatus === 'COMPLETED'
                    ? 'checkmark-circle'
                    : 'ellipse-outline'
                }
                size={20}
                color={
                  order.orderStatus === 'READY_FOR_PICKUP' || order.orderStatus === 'COMPLETED'
                    ? Colors.success
                    : Colors.textTertiary
                }
              />
              <View style={styles.stepTextCol}>
                <Text style={styles.stepTitle}>Ready for Pickup</Text>
                <Text style={styles.stepDesc}>Seller is ready to meet on campus</Text>
              </View>
            </View>

            <View style={styles.timelineStep}>
              <Ionicons
                name={
                  order.orderStatus === 'COMPLETED' ? 'checkmark-circle' : 'ellipse-outline'
                }
                size={20}
                color={order.orderStatus === 'COMPLETED' ? Colors.success : Colors.textTertiary}
              />
              <View style={styles.stepTextCol}>
                <Text style={styles.stepTitle}>Handover Completed</Text>
                <Text style={styles.stepDesc}>Both parties met and item was handed over</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Payment Summary */}
        <View style={styles.card}>
          <Text style={styles.cardHeading}>Payment Summary</Text>
          <View style={styles.payRow}>
            <Text style={styles.payLabel}>Payment Method</Text>
            <Text style={styles.payVal}>
              {order.paymentMethod === 'ONLINE_DEMO' ? 'Online Escrow (Demo)' : 'Pay on Pickup (Demo)'}
            </Text>
          </View>
          <View style={styles.payRow}>
            <Text style={styles.payLabel}>Payment Status</Text>
            <Text style={[styles.payVal, { color: Colors.primary, fontWeight: 'bold' }]}>
              {order.paymentStatus}
            </Text>
          </View>
          <View style={styles.payRow}>
            <Text style={styles.payLabel}>Total Amount</Text>
            <Text style={[styles.payVal, styles.payValBold]}>
              ₹{order.amount.toLocaleString('en-IN')}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* ── Contextual Actions Footer ─────────────────────────── */}
      <SafeAreaView edges={['bottom']} style={styles.safeFooter}>
        <View style={styles.footerActionRow}>
          {/* Quick Chat action */}
          <TouchableOpacity
            style={styles.chatBtn}
            onPress={() =>
              navigation.navigate('Chat', {
                productId: order.listingId,
                sellerId: isBuyer ? order.sellerId : order.buyerId,
                sellerName: isBuyer ? order.sellerName : order.buyerName,
              })
            }
          >
            <Ionicons name="chatbubble-outline" size={18} color={Colors.primary} />
            <Text style={styles.chatBtnText}>Chat</Text>
          </TouchableOpacity>

          {/* Seller Actions */}
          {isSeller && order.orderStatus === 'CONFIRMED' && (
            <TouchableOpacity style={styles.primaryActionBtn} onPress={handleMarkReady}>
              <Text style={styles.primaryActionText}>Mark Ready for Pickup</Text>
            </TouchableOpacity>
          )}

          {isSeller && order.orderStatus === 'READY_FOR_PICKUP' && (
            <TouchableOpacity style={styles.primaryActionBtn} onPress={handleCompleteOrder}>
              <Text style={styles.primaryActionText}>Confirm Handover</Text>
            </TouchableOpacity>
          )}

          {/* Buyer Actions */}
          {isBuyer && (order.orderStatus === 'CONFIRMED' || order.orderStatus === 'PENDING') && (
            <TouchableOpacity style={styles.cancelBtn} onPress={handleCancelOrder}>
              <Text style={styles.cancelBtnText}>Cancel Order</Text>
            </TouchableOpacity>
          )}

          {isBuyer && order.orderStatus === 'READY_FOR_PICKUP' && (
            <TouchableOpacity style={styles.primaryActionBtn} onPress={handleCompleteOrder}>
              <Text style={styles.primaryActionText}>Item Received & Complete</Text>
            </TouchableOpacity>
          )}

          {/* Review Action */}
          {isBuyer && order.orderStatus === 'COMPLETED' && !hasReviewed && (
            <TouchableOpacity
              style={styles.reviewBtn}
              onPress={() => setReviewModalOpen(true)}
            >
              <Ionicons name="star" size={16} color={Colors.white} />
              <Text style={styles.reviewBtnText}>Review Seller</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>

      {/* ── Review Modal ─────────────────────────────────────── */}
      <Modal visible={reviewModalOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.reviewModalBox}>
            <Text style={styles.reviewModalTitle}>Rate Your Experience</Text>
            <Text style={styles.reviewModalSub}>
              How was your campus handover with {order.sellerName}?
            </Text>

            {/* Stars */}
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                  <Ionicons
                    name={star <= rating ? 'star' : 'star-outline'}
                    size={32}
                    color="#F59E0B"
                  />
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.reviewInput}
              placeholder="Write feedback about punctuality, item condition, etc."
              placeholderTextColor={Colors.textTertiary}
              value={comment}
              onChangeText={setComment}
              multiline
              numberOfLines={3}
            />

            <View style={styles.reviewModalBtns}>
              <TouchableOpacity
                style={styles.reviewCancelBtn}
                onPress={() => setReviewModalOpen(false)}
              >
                <Text style={styles.reviewCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.reviewSubmitBtn}
                onPress={handleSubmitReview}
              >
                <Text style={styles.reviewSubmitText}>Submit Review</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  headerBackBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleWrap: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  headerTitle: {
    fontSize: Typography.heading3,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  headerSub: {
    fontSize: Typography.caption,
    color: Colors.textTertiary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.xl,
    paddingBottom: Spacing.hero,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
    ...Shadows.card,
  },
  cardHeading: {
    fontSize: Typography.caption,
    fontWeight: Typography.bold,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.md,
  },
  itemRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  itemThumb: {
    width: 75,
    height: 75,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.borderLight,
  },
  itemCol: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemTitle: {
    fontSize: Typography.bodySmall,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    lineHeight: Typography.bodySmall * 1.3,
  },
  itemPrice: {
    fontSize: Typography.heading3,
    fontWeight: Typography.bold,
    color: Colors.primary,
  },
  partyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  partyAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  partyMeta: {
    flex: 1,
  },
  partyRole: {
    fontSize: 10,
    fontWeight: Typography.bold,
    color: Colors.textTertiary,
  },
  partyName: {
    fontSize: Typography.bodySmall,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  partyCampus: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: Spacing.md,
  },
  handoverNoteBox: {
    flexDirection: 'row',
    gap: Spacing.sm,
    backgroundColor: '#EEF2FF',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.md,
  },
  handoverNoteTitle: {
    fontSize: 11,
    fontWeight: Typography.bold,
    color: Colors.primary,
    marginBottom: 2,
  },
  handoverNoteText: {
    fontSize: 12,
    color: Colors.textPrimary,
  },
  timeline: {
    gap: Spacing.lg,
  },
  timelineStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  stepTextCol: {
    flex: 1,
  },
  stepTitle: {
    fontSize: Typography.bodySmall,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  stepDesc: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  payRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  payLabel: {
    fontSize: Typography.bodySmall,
    color: Colors.textSecondary,
  },
  payVal: {
    fontSize: Typography.bodySmall,
    color: Colors.textPrimary,
  },
  payValBold: {
    fontWeight: Typography.bold,
    color: Colors.primary,
    fontSize: Typography.body,
  },
  safeFooter: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    ...Shadows.card,
  },
  footerActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  chatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  chatBtnText: {
    fontSize: Typography.bodySmall,
    fontWeight: Typography.bold,
    color: Colors.primary,
  },
  primaryActionBtn: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    ...Shadows.button,
  },
  primaryActionText: {
    fontSize: Typography.label,
    fontWeight: Typography.bold,
    color: Colors.white,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#FEE2E2',
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: Typography.label,
    fontWeight: Typography.bold,
    color: '#DC2626',
  },
  reviewBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F59E0B',
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    borderRadius: BorderRadius.full,
  },
  reviewBtnText: {
    fontSize: Typography.label,
    fontWeight: Typography.bold,
    color: Colors.white,
  },
  errorRoot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorTitle: {
    fontSize: Typography.heading3,
    marginBottom: Spacing.md,
  },
  backBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  backBtnText: {
    color: Colors.white,
    fontWeight: Typography.bold,
  },

  // Review modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  reviewModalBox: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    ...Shadows.card,
  },
  reviewModalTitle: {
    fontSize: Typography.heading2,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  reviewModalSub: {
    fontSize: Typography.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: Spacing.lg,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  reviewInput: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: Typography.body,
    color: Colors.textPrimary,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: Spacing.lg,
  },
  reviewModalBtns: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  reviewCancelBtn: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  reviewCancelText: {
    fontSize: Typography.label,
    fontWeight: Typography.semiBold,
    color: Colors.textSecondary,
  },
  reviewSubmitBtn: {
    flex: 1.5,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
  },
  reviewSubmitText: {
    fontSize: Typography.label,
    fontWeight: Typography.bold,
    color: Colors.white,
  },
});
