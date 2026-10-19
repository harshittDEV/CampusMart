import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  StatusBar,
  Image,
  TouchableOpacity,
  Alert,
  TextInput,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants';
import { useMarketplace } from '../context';
import { RootStackParamList, PaymentMethod } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Checkout'>;

export const CheckoutScreen: React.FC<Props> = ({ route, navigation }) => {
  const { productId } = route.params;
  const { products, userProfile, addOrder } = useMarketplace();

  const product = products.find((p) => p.id === productId);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('ONLINE_DEMO');
  const [pickupNote, setPickupNote] = useState('Available after classes around 4:30 PM near library');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!product) {
    return (
      <SafeAreaView style={styles.errorRoot}>
        <Text style={styles.errorTitle}>Product not found</Text>
        <TouchableOpacity style={styles.btn} onPress={() => navigation.goBack()}>
          <Text style={styles.btnText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const platformFee = 0; // Free for university community
  const totalAmount = product.price + platformFee;

  const handleConfirmOrder = () => {
    if (product.sellerId === userProfile.id) {
      Alert.alert('Invalid Order', 'You cannot purchase your own product listing.');
      return;
    }

    if (product.status !== 'ACTIVE') {
      Alert.alert('Unavailable', 'This item has already been reserved or sold.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const createdOrder = addOrder({
        listingId: product.id,
        productSnapshot: {
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.images[0] || '',
          categoryId: product.categoryId,
          condition: product.condition,
        },
        buyerId: userProfile.id,
        buyerName: userProfile.name,
        buyerRole: userProfile.role,
        buyerInstitutionId: userProfile.institutionId,
        buyerInstitutionName: userProfile.institutionName,
        sellerId: product.sellerId,
        sellerName: product.sellerName,
        sellerRole: product.sellerRole,
        sellerInstitutionId: product.sellerInstitutionId,
        sellerInstitutionName: product.sellerInstitutionName,
        amount: totalAmount,
        orderStatus: 'CONFIRMED',
        paymentStatus: paymentMethod === 'ONLINE_DEMO' ? 'PAID_DEMO' : 'NOT_REQUIRED',
        paymentMethod,
        pickupNote: pickupNote.trim(),
      });

      setIsSubmitting(false);

      // Navigate to Order Details
      navigation.replace('OrderDetails', { orderId: createdOrder.id });
    }, 400);
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      <SafeAreaView edges={['top']} style={styles.safeHeader}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Order Checkout</Text>
          <View style={{ width: 36 }} />
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Product Summary Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Item Summary</Text>
          <View style={styles.itemRow}>
            <Image
              source={{ uri: product.images[0] }}
              style={styles.itemImage}
              resizeMode="cover"
            />
            <View style={styles.itemMeta}>
              <Text style={styles.itemTitle} numberOfLines={2}>
                {product.title}
              </Text>
              <Text style={styles.sellerLine}>Sold by {product.sellerName}</Text>
              <Text style={styles.itemPrice}>₹{product.price.toLocaleString('en-IN')}</Text>
            </View>
          </View>
        </View>

        {/* Campus Pickup & Handover Details */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Campus Handover Arrangement</Text>
          <View style={styles.infoRow}>
            <Ionicons name="business" size={18} color={Colors.primary} />
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Seller Institution</Text>
              <Text style={styles.infoVal}>{product.sellerInstitutionName}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="location" size={18} color={Colors.primary} />
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Default Meeting Location</Text>
              <Text style={styles.infoVal}>{product.pickupLocation}</Text>
            </View>
          </View>

          <View style={styles.noteBox}>
            <Text style={styles.noteLabel}>Optional Note to Seller:</Text>
            <TextInput
              style={styles.noteInput}
              value={pickupNote}
              onChangeText={setPickupNote}
              placeholder="e.g. Can meet after classes at 4 PM"
            />
          </View>
        </View>

        {/* Mock Payment Method Selection */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Select Payment Method</Text>

          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'ONLINE_DEMO' && styles.paymentOptionActive,
            ]}
            onPress={() => setPaymentMethod('ONLINE_DEMO')}
          >
            <Ionicons
              name={paymentMethod === 'ONLINE_DEMO' ? 'radio-button-on' : 'radio-button-off'}
              size={20}
              color={paymentMethod === 'ONLINE_DEMO' ? Colors.primary : Colors.textTertiary}
            />
            <View style={styles.paymentMeta}>
              <Text style={styles.paymentTitle}>Online Payment — Demo</Text>
              <Text style={styles.paymentSub}>Simulated instant student escrow checkout</Text>
            </View>
            <View style={styles.demoTag}>
              <Text style={styles.demoTagText}>DEMO</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'PICKUP_DEMO' && styles.paymentOptionActive,
            ]}
            onPress={() => setPaymentMethod('PICKUP_DEMO')}
          >
            <Ionicons
              name={paymentMethod === 'PICKUP_DEMO' ? 'radio-button-on' : 'radio-button-off'}
              size={20}
              color={paymentMethod === 'PICKUP_DEMO' ? Colors.primary : Colors.textTertiary}
            />
            <View style={styles.paymentMeta}>
              <Text style={styles.paymentTitle}>Pay on Pickup — Demo</Text>
              <Text style={styles.paymentSub}>Inspect item in-person & pay directly via UPI / Cash</Text>
            </View>
            <View style={styles.demoTag}>
              <Text style={styles.demoTagText}>DEMO</Text>
            </View>
          </TouchableOpacity>

          {/* Honest Simulation Disclaimer */}
          <View style={styles.disclaimerBox}>
            <Ionicons name="information-circle" size={18} color={Colors.primary} />
            <Text style={styles.disclaimerText}>
              Frontend Prototype Notice: This checkout simulates order creation locally. No actual bank, card, or UPI credentials are collected.
            </Text>
          </View>
        </View>

        {/* Cost Breakdown */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Price Breakdown</Text>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Item Price</Text>
            <Text style={styles.breakdownVal}>₹{product.price.toLocaleString('en-IN')}</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Campus Platform Fee</Text>
            <Text style={[styles.breakdownVal, { color: Colors.success }]}>FREE (₹0)</Text>
          </View>
          <View style={[styles.breakdownRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Payable</Text>
            <Text style={styles.totalVal}>₹{totalAmount.toLocaleString('en-IN')}</Text>
          </View>
        </View>
      </ScrollView>

      {/* ── Confirm CTA Footer ───────────────────────────────── */}
      <SafeAreaView edges={['bottom']} style={styles.safeFooter}>
        <View style={styles.footerRow}>
          <View>
            <Text style={styles.footerTotalLabel}>Total Amount</Text>
            <Text style={styles.footerTotalVal}>₹{totalAmount.toLocaleString('en-IN')}</Text>
          </View>
          <TouchableOpacity
            style={[styles.confirmBtn, isSubmitting && styles.confirmBtnDisabled]}
            onPress={handleConfirmOrder}
            disabled={isSubmitting}
            activeOpacity={0.85}
          >
            <Text style={styles.confirmBtnText}>
              {isSubmitting ? 'Placing Order...' : 'Place Order (Demo)'}
            </Text>
          </TouchableOpacity>
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
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
    ...Shadows.card,
  },
  cardTitle: {
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
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.borderLight,
  },
  itemMeta: {
    flex: 1,
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: Typography.body,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    lineHeight: Typography.body * 1.3,
  },
  sellerLine: {
    fontSize: Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  itemPrice: {
    fontSize: Typography.heading3,
    fontWeight: Typography.bold,
    color: Colors.primary,
    marginTop: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  infoCol: {
    flex: 1,
  },
  infoLabel: {
    fontSize: Typography.caption,
    color: Colors.textSecondary,
  },
  infoVal: {
    fontSize: Typography.bodySmall,
    fontWeight: Typography.semiBold,
    color: Colors.textPrimary,
    marginTop: 1,
  },
  noteBox: {
    marginTop: Spacing.xs,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  noteLabel: {
    fontSize: Typography.caption,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  noteInput: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    fontSize: Typography.bodySmall,
    color: Colors.textPrimary,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
  },
  paymentOptionActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  paymentMeta: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: Typography.bodySmall,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  paymentSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  demoTag: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  demoTagText: {
    fontSize: 9,
    fontWeight: Typography.bold,
    color: Colors.primary,
  },
  disclaimerBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#EEF2FF',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 11,
    color: Colors.primary,
    lineHeight: 15,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
  },
  breakdownLabel: {
    fontSize: Typography.bodySmall,
    color: Colors.textSecondary,
  },
  breakdownVal: {
    fontSize: Typography.bodySmall,
    fontWeight: Typography.semiBold,
    color: Colors.textPrimary,
  },
  totalRow: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  totalLabel: {
    fontSize: Typography.body,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  totalVal: {
    fontSize: Typography.heading2,
    fontWeight: Typography.bold,
    color: Colors.primary,
  },
  safeFooter: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    ...Shadows.card,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  footerTotalLabel: {
    fontSize: Typography.caption,
    color: Colors.textSecondary,
  },
  footerTotalVal: {
    fontSize: Typography.heading2,
    fontWeight: Typography.bold,
    color: Colors.primary,
  },
  confirmBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Platform.OS === 'ios' ? 14 : 12,
    borderRadius: BorderRadius.full,
    ...Shadows.button,
  },
  confirmBtnDisabled: {
    backgroundColor: Colors.textTertiary,
  },
  confirmBtnText: {
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
  btn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  btnText: {
    color: Colors.white,
    fontWeight: Typography.bold,
  },
});
