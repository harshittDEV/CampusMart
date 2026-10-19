import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants';
import { useMarketplace } from '../context';
import { RootStackParamList, ListingStatus } from '../types';
import { StatusBadge, EmptyState } from '../components';

type Props = NativeStackScreenProps<RootStackParamList, 'MyListings'>;

export const MyListingsScreen: React.FC<Props> = ({ navigation }) => {
  const { userProfile, products, deleteProduct } = useMarketplace();

  const [activeTab, setActiveTab] = useState<'ALL' | ListingStatus>('ALL');

  // Filter listings owned by current user
  const myListings = useMemo(() => {
    return products.filter((p) => p.sellerId === userProfile.id);
  }, [products, userProfile.id]);

  const displayedListings = useMemo(() => {
    if (activeTab === 'ALL') return myListings;
    return myListings.filter((p) => p.status === activeTab);
  }, [myListings, activeTab]);

  const handleDelete = (productId: string, title: string) => {
    Alert.alert(
      'Delete Listing',
      `Are you sure you want to delete "${title}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteProduct(productId);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* ── Top Header ────────────────────────────────────────── */}
      <SafeAreaView edges={['top']} style={styles.safeHeader}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Listings</Text>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => navigation.navigate('MainTabs', { screen: 'SellTab' } as never)}
          >
            <Ionicons name="add" size={22} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Status Filter Tabs */}
        <View style={styles.tabsRow}>
          {(['ALL', 'ACTIVE', 'RESERVED', 'SOLD'] as const).map((tab) => {
            const isActive = activeTab === tab;
            const count =
              tab === 'ALL'
                ? myListings.length
                : myListings.filter((l) => l.status === tab).length;
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.tabBtn, isActive && styles.tabBtnActive]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                  {tab === 'ALL' ? 'All' : tab.charAt(0) + tab.slice(1).toLowerCase()} ({count})
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </SafeAreaView>

      {/* ── Content List ─────────────────────────────────────── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {displayedListings.length === 0 ? (
          <EmptyState
            iconName="pricetag-outline"
            title="No Listings Here"
            description={
              activeTab === 'ALL'
                ? "You haven't listed any items for sale yet. Tap '+' to create your first campus listing!"
                : `No items currently marked as ${activeTab.toLowerCase()}.`
            }
            actionLabel="List an Item"
            onAction={() =>
              navigation.navigate('MainTabs', { screen: 'SellTab' } as never)
            }
          />
        ) : (
          displayedListings.map((listing) => (
            <View key={listing.id} style={styles.listingCard}>
              <TouchableOpacity
                style={styles.cardMain}
                onPress={() =>
                  navigation.navigate('ProductDetails', { productId: listing.id })
                }
                activeOpacity={0.8}
              >
                <Image
                  source={{ uri: listing.images[0] }}
                  style={styles.thumb}
                  resizeMode="cover"
                />
                <View style={styles.metaCol}>
                  <View style={styles.statusRow}>
                    <StatusBadge status={listing.status} size="sm" />
                    <Text style={styles.dateText}>
                      {new Date(listing.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                  <Text style={styles.title} numberOfLines={2}>
                    {listing.title}
                  </Text>
                  <Text style={styles.price}>₹{listing.price.toLocaleString('en-IN')}</Text>
                  <Text style={styles.pickupSpot} numberOfLines={1}>
                    📍 {listing.pickupLocation}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Actions row */}
              <View style={styles.cardActionsRow}>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() =>
                    navigation.navigate('EditListing', { productId: listing.id })
                  }
                >
                  <Ionicons name="create-outline" size={16} color={Colors.primary} />
                  <Text style={styles.actionBtnText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionBtn, styles.deleteBtn]}
                  onPress={() => handleDelete(listing.id, listing.title)}
                >
                  <Ionicons name="trash-outline" size={16} color="#DC2626" />
                  <Text style={[styles.actionBtnText, styles.deleteText]}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
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
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.sm,
    gap: Spacing.xs,
  },
  tabBtn: {
    paddingVertical: 6,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background,
  },
  tabBtnActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: Typography.caption,
    fontWeight: Typography.medium,
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.white,
    fontWeight: Typography.bold,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.xl,
    paddingBottom: Spacing.hero,
  },
  listingCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    ...Shadows.card,
  },
  cardMain: {
    flexDirection: 'row',
    padding: Spacing.md,
    gap: Spacing.md,
  },
  thumb: {
    width: 90,
    height: 90,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.borderLight,
  },
  metaCol: {
    flex: 1,
    justifyContent: 'space-between',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateText: {
    fontSize: 10,
    color: Colors.textTertiary,
  },
  title: {
    fontSize: Typography.bodySmall,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    lineHeight: Typography.bodySmall * 1.3,
  },
  price: {
    fontSize: Typography.heading3,
    fontWeight: Typography.bold,
    color: Colors.primary,
  },
  pickupSpot: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  cardActionsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: Spacing.sm,
  },
  deleteBtn: {
    borderLeftWidth: 1,
    borderLeftColor: Colors.borderLight,
  },
  actionBtnText: {
    fontSize: Typography.caption,
    fontWeight: Typography.bold,
    color: Colors.primary,
  },
  deleteText: {
    color: '#DC2626',
  },
});
