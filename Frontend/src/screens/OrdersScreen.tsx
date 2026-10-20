import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CompositeNavigationProp, useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants';
import { useMarketplace } from '../context';
import { RootStackParamList, MainTabParamList } from '../types';
import { StatusBadge, EmptyState } from '../components';

type NavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'OrdersTab'>,
  NativeStackNavigationProp<RootStackParamList>
>;

type RouteProps = RouteProp<MainTabParamList, 'OrdersTab'>;

export const OrdersScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { orders, userProfile } = useMarketplace();

  const [activeTab, setActiveTab] = useState<'buying' | 'selling'>(
    route.params?.initialTab || 'buying'
  );

  const buyingOrders = useMemo(() => {
    return orders.filter((o) => o.buyerId === userProfile.id);
  }, [orders, userProfile.id]);

  const sellingOrders = useMemo(() => {
    return orders.filter((o) => o.sellerId === userProfile.id);
  }, [orders, userProfile.id]);

  const currentList = activeTab === 'buying' ? buyingOrders : sellingOrders;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      <SafeAreaView edges={['top']} style={styles.safeHeader}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Orders & Handovers</Text>
        </View>

        {/* Segmented control: Buying vs Selling */}
        <View style={styles.segmentContainer}>
          <TouchableOpacity
            style={[styles.segmentBtn, activeTab === 'buying' && styles.segmentBtnActive]}
            onPress={() => setActiveTab('buying')}
            activeOpacity={0.8}
          >
            <Ionicons
              name="bag-handle-outline"
              size={16}
              color={activeTab === 'buying' ? Colors.primary : Colors.textSecondary}
            />
            <Text
              style={[
                styles.segmentText,
                activeTab === 'buying' && styles.segmentTextActive,
              ]}
            >
              Buying ({buyingOrders.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.segmentBtn, activeTab === 'selling' && styles.segmentBtnActive]}
            onPress={() => setActiveTab('selling')}
            activeOpacity={0.8}
          >
            <Ionicons
              name="storefront-outline"
              size={16}
              color={activeTab === 'selling' ? Colors.primary : Colors.textSecondary}
            />
            <Text
              style={[
                styles.segmentText,
                activeTab === 'selling' && styles.segmentTextActive,
              ]}
            >
              Selling ({sellingOrders.length})
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {currentList.length === 0 ? (
          <EmptyState
            iconName={activeTab === 'buying' ? 'bag-outline' : 'pricetags-outline'}
            title={activeTab === 'buying' ? 'No Purchases Yet' : 'No Sales Yet'}
            description={
              activeTab === 'buying'
                ? 'Your active and past purchases from verified campus members will be tracked here.'
                : 'Orders placed by other students for your listings will appear here for pickup coordination.'
            }
            actionLabel={activeTab === 'buying' ? 'Browse Campus Items' : 'List an Item'}
            onAction={() =>
              navigation.navigate(
                'MainTabs',
                { screen: activeTab === 'buying' ? 'ExploreTab' : 'SellTab' } as never
              )
            }
          />
        ) : (
          currentList.map((order) => {
            const isBuyer = order.buyerId === userProfile.id;
            const otherPartyName = isBuyer ? order.sellerName : order.buyerName;
            const otherPartyCampus = isBuyer
              ? order.sellerInstitutionName
              : order.buyerInstitutionName;

            return (
              <TouchableOpacity
                key={order.id}
                style={styles.orderCard}
                onPress={() => navigation.navigate('OrderDetails', { orderId: order.id })}
                activeOpacity={0.85}
              >
                {/* Header row: Order ID & Date */}
                <View style={styles.cardHeader}>
                  <View style={styles.idRow}>
                    <Text style={styles.orderIdText}>Order #{order.id.slice(-6)}</Text>
                    <StatusBadge status={order.orderStatus} size="sm" />
                  </View>
                  <Text style={styles.dateText}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </Text>
                </View>

                {/* Content row */}
                <View style={styles.cardBody}>
                  <Image
                    source={{ uri: order.productSnapshot.image }}
                    style={styles.thumb}
                    resizeMode="cover"
                  />
                  <View style={styles.bodyCol}>
                    <Text style={styles.productTitle} numberOfLines={2}>
                      {order.productSnapshot.title}
                    </Text>
                    <Text style={styles.otherPartyText} numberOfLines={1}>
                      {isBuyer ? `Seller: ${otherPartyName}` : `Buyer: ${otherPartyName}`}
                    </Text>
                    <Text style={styles.campusLine} numberOfLines={1}>
                      📍 {otherPartyCampus}
                    </Text>
                    <View style={styles.priceRow}>
                      <Text style={styles.amount}>
                        ₹{order.amount.toLocaleString('en-IN')}
                      </Text>
                      <View style={styles.paymentBadge}>
                        <Text style={styles.paymentBadgeText}>
                          {order.paymentStatus === 'PAID_DEMO'
                            ? 'Paid (Demo)'
                            : order.paymentStatus === 'NOT_REQUIRED'
                            ? 'Pay on Pickup'
                            : 'Pending'}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Bottom hint row */}
                <View style={styles.cardFooter}>
                  <Text style={styles.footerHint}>
                    Tap to view campus meeting details & handover actions →
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })
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
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.md,
    ...Shadows.card,
  },
  header: {
    paddingTop: Spacing.xs,
    marginBottom: Spacing.md,
  },
  headerTitle: {
    fontSize: Typography.heading2,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
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
    gap: 6,
    paddingVertical: Spacing.xs + 3,
    borderRadius: BorderRadius.full,
  },
  segmentBtnActive: {
    backgroundColor: Colors.white,
    ...Shadows.card,
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.xl,
    paddingBottom: Spacing.hero,
  },
  orderCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    ...Shadows.card,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xs,
  },
  idRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  orderIdText: {
    fontSize: 12,
    fontWeight: Typography.bold,
    color: Colors.textSecondary,
  },
  dateText: {
    fontSize: 11,
    color: Colors.textTertiary,
  },
  cardBody: {
    flexDirection: 'row',
    padding: Spacing.md,
    gap: Spacing.md,
  },
  thumb: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.borderLight,
  },
  bodyCol: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productTitle: {
    fontSize: Typography.bodySmall,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    lineHeight: Typography.bodySmall * 1.3,
  },
  otherPartyText: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  campusLine: {
    fontSize: 10,
    color: Colors.textTertiary,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  amount: {
    fontSize: Typography.heading3,
    fontWeight: Typography.bold,
    color: Colors.primary,
  },
  paymentBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  paymentBadgeText: {
    fontSize: 10,
    fontWeight: Typography.semiBold,
    color: Colors.primary,
  },
  cardFooter: {
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  footerHint: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: Typography.medium,
  },
});
