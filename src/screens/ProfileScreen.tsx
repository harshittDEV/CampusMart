import React from 'react';
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
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants';
import { useMarketplace } from '../context';
import { RootStackParamList, MainTabParamList } from '../types';

type NavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'ProfileTab'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface MenuItem {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  badge?: string;
  badgeColor?: string;
  action: () => void;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const {
    userProfile,
    products,
    wishlist,
    orders,
    conversations,
    unreadNotificationCount,
  } = useMarketplace();

  const myListingsCount = products.filter((p) => p.sellerId === userProfile.id).length;
  const myOrdersCount = orders.filter(
    (o) => o.buyerId === userProfile.id || o.sellerId === userProfile.id
  ).length;

  const menuSections: MenuSection[] = [
    {
      title: 'Marketplace Activity',
      items: [
        {
          id: 'my_listings',
          icon: 'pricetag-outline' as const,
          label: 'My Listings',
          badge: myListingsCount > 0 ? `${myListingsCount}` : undefined,
          action: () => navigation.navigate('MyListings'),
        },
        {
          id: 'saved_wishlist',
          icon: 'heart-outline' as const,
          label: 'Saved Wishlist',
          badge: wishlist.length > 0 ? `${wishlist.length}` : undefined,
          action: () => navigation.navigate('Wishlist'),
        },
        {
          id: 'orders',
          icon: 'bag-check-outline' as const,
          label: 'My Orders & Handovers',
          badge: myOrdersCount > 0 ? `${myOrdersCount}` : undefined,
          action: () => navigation.navigate('OrdersTab', undefined),
        },
        {
          id: 'messages',
          icon: 'chatbubbles-outline' as const,
          label: 'Messages & Inquiries',
          badge: conversations.length > 0 ? `${conversations.length}` : undefined,
          action: () => navigation.navigate('ChatList'),
        },
        {
          id: 'notifications',
          icon: 'notifications-outline' as const,
          label: 'Notifications',
          badge: unreadNotificationCount > 0 ? `${unreadNotificationCount} new` : undefined,
          badgeColor: '#EF4444',
          action: () => navigation.navigate('Notifications'),
        },
      ],
    },
    {
      title: 'Reputation & Account',
      items: [
        {
          id: 'seller_profile',
          icon: 'star-outline' as const,
          label: 'My Seller Profile & Reviews',
          action: () =>
            navigation.navigate('SellerProfile', { sellerId: userProfile.id }),
        },
        {
          id: 'edit_profile',
          icon: 'person-outline' as const,
          label: 'Edit Profile Information',
          action: () => navigation.navigate('EditProfile'),
        },
      ],
    },
    {
      title: 'Preferences & Safety',
      items: [
        {
          id: 'safety',
          icon: 'shield-checkmark-outline' as const,
          label: 'Campus Safety & Handover Tips',
          action: () => navigation.navigate('HelpSafety'),
        },
        {
          id: 'settings',
          icon: 'settings-outline' as const,
          label: 'Settings & Demo Controls',
          action: () => navigation.navigate('Settings'),
        },
      ],
    },
  ];

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      <SafeAreaView edges={['top']} style={styles.safeHeader}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Account & Profile</Text>
          <TouchableOpacity
            style={styles.settingsIconBtn}
            onPress={() => navigation.navigate('Settings')}
          >
            <Ionicons name="settings-outline" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── User Profile Header Card ─────────────────────────── */}
        <View style={styles.userCard}>
          <View style={styles.userTopRow}>
            {userProfile.avatar ? (
              <Image source={{ uri: userProfile.avatar }} style={styles.avatarImg} />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarInitial}>
                  {userProfile.name.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}

            <View style={styles.userInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.userName}>{userProfile.name}</Text>
                <View style={styles.roleTag}>
                  <Text style={styles.roleTagText}>{userProfile.role}</Text>
                </View>
              </View>

              {userProfile.department && (
                <Text style={styles.userSubText}>{userProfile.department}</Text>
              )}

              {userProfile.academicYear && (
                <Text style={styles.userYearText}>{userProfile.academicYear}</Text>
              )}
            </View>
          </View>

          {/* Institutional verification badge */}
          <View style={styles.institutionBadge}>
            <Ionicons name="shield-checkmark" size={15} color={Colors.success} />
            <View style={styles.institutionCol}>
              <Text style={styles.institutionTitle}>Verified Institution</Text>
              <Text style={styles.institutionName} numberOfLines={1}>
                {userProfile.institutionName}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Menu Sections ───────────────────────────────────── */}
        {menuSections.map((sec, secIdx) => (
          <View key={secIdx} style={styles.menuSection}>
            <Text style={styles.sectionHeading}>{sec.title}</Text>
            <View style={styles.menuCard}>
              {sec.items.map((item, itemIdx) => {
                const isLast = itemIdx === sec.items.length - 1;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.menuItem, !isLast && styles.menuItemBorder]}
                    onPress={item.action}
                    activeOpacity={0.7}
                  >
                    <View style={styles.menuItemLeft}>
                      <View style={styles.menuIconCircle}>
                        <Ionicons name={item.icon} size={18} color={Colors.primary} />
                      </View>
                      <Text style={styles.menuLabel}>{item.label}</Text>
                    </View>

                    <View style={styles.menuItemRight}>
                      {item.badge && (
                        <View
                          style={[
                            styles.badgePill,
                            item.badgeColor ? { backgroundColor: item.badgeColor } : {},
                          ]}
                        >
                          <Text style={styles.badgePillText}>{item.badge}</Text>
                        </View>
                      )}
                      <Ionicons name="chevron-forward" size={16} color={Colors.textTertiary} />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}

        {/* Version info */}
        <View style={styles.appInfoBox}>
          <Text style={styles.appInfoTitle}>CampusMart v1.0.0 (Prototype)</Text>
          <Text style={styles.appInfoSub}>
            Multi-Campus Marketplace for Colleges & Universities in India
          </Text>
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
  headerTitle: {
    fontSize: Typography.heading2,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  settingsIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.xl,
    paddingBottom: Spacing.hero,
  },
  userCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xl,
    ...Shadows.card,
  },
  userTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  avatarImg: {
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
  userInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  userName: {
    fontSize: Typography.heading3,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  roleTag: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  roleTagText: {
    fontSize: 10,
    fontWeight: Typography.bold,
    color: Colors.primary,
  },
  userSubText: {
    fontSize: Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  userYearText: {
    fontSize: 11,
    color: Colors.textTertiary,
    marginTop: 1,
  },
  institutionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: '#ECFDF5',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.md,
  },
  institutionCol: {
    flex: 1,
  },
  institutionTitle: {
    fontSize: 10,
    fontWeight: Typography.bold,
    color: Colors.success,
    textTransform: 'uppercase',
  },
  institutionName: {
    fontSize: 12,
    fontWeight: Typography.semiBold,
    color: '#065F46',
  },

  menuSection: {
    marginBottom: Spacing.lg,
  },
  sectionHeading: {
    fontSize: Typography.caption,
    fontWeight: Typography.bold,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  menuCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    ...Shadows.card,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  menuIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    fontSize: Typography.bodySmall,
    fontWeight: Typography.medium,
    color: Colors.textPrimary,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  badgePill: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  badgePillText: {
    fontSize: 10,
    fontWeight: Typography.bold,
    color: Colors.white,
  },
  appInfoBox: {
    alignItems: 'center',
    marginTop: Spacing.md,
    paddingVertical: Spacing.md,
  },
  appInfoTitle: {
    fontSize: Typography.caption,
    fontWeight: Typography.semiBold,
    color: Colors.textSecondary,
  },
  appInfoSub: {
    fontSize: 11,
    color: Colors.textTertiary,
    textAlign: 'center',
    marginTop: 2,
  },
});
