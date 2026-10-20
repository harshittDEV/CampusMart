import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants';
import { useMarketplace } from '../context';
import { RootStackParamList } from '../types';
import { EmptyState } from '../components';

type Props = NativeStackScreenProps<RootStackParamList, 'Notifications'>;

export const NotificationsScreen: React.FC<Props> = ({ navigation }) => {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    unreadNotificationCount,
  } = useMarketplace();

  const handleNotificationPress = (notif: typeof notifications[0]) => {
    markNotificationAsRead(notif.id);
    if (notif.targetScreen === 'OrderDetails' && notif.targetId) {
      navigation.navigate('OrderDetails', { orderId: notif.targetId });
    } else if (notif.targetScreen === 'Chat' && notif.targetId) {
      navigation.navigate('Chat', { conversationId: notif.targetId });
    } else if (notif.targetScreen === 'ProductDetails' && notif.targetId) {
      navigation.navigate('ProductDetails', { productId: notif.targetId });
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'ORDER_UPDATE':
        return { name: 'bag-check' as const, color: Colors.primary };
      case 'NEW_MESSAGE':
        return { name: 'chatbubble-ellipses' as const, color: '#0891B2' };
      case 'LISTING_PUBLISHED':
        return { name: 'cloud-done' as const, color: Colors.success };
      case 'LISTING_SOLD':
        return { name: 'cash' as const, color: '#D97706' };
      default:
        return { name: 'notifications' as const, color: Colors.primary };
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      <SafeAreaView edges={['top']} style={styles.safeHeader}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadNotificationCount > 0 ? (
            <TouchableOpacity onPress={markAllNotificationsAsRead}>
              <Text style={styles.markAllText}>Mark all read</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ width: 36 }} />
          )}
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {notifications.length === 0 ? (
          <EmptyState
            iconName="notifications-outline"
            title="You're All Caught Up"
            description="No new campus notifications right now. Alerts about orders, messages, and listings will appear here."
          />
        ) : (
          notifications.map((notif) => {
            const iconInfo = getIconForType(notif.type);
            return (
              <TouchableOpacity
                key={notif.id}
                style={[styles.notifCard, !notif.read && styles.notifCardUnread]}
                onPress={() => handleNotificationPress(notif)}
                activeOpacity={0.8}
              >
                <View style={[styles.iconCircle, { backgroundColor: iconInfo.color + '18' }]}>
                  <Ionicons name={iconInfo.name} size={20} color={iconInfo.color} />
                </View>

                <View style={styles.contentCol}>
                  <View style={styles.titleRow}>
                    <Text style={[styles.notifTitle, !notif.read && styles.notifTitleUnread]}>
                      {notif.title}
                    </Text>
                    <Text style={styles.timeText}>
                      {new Date(notif.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>
                  <Text style={styles.messageText}>{notif.message}</Text>
                </View>

                {!notif.read && <View style={styles.unreadDot} />}
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
  markAllText: {
    fontSize: Typography.caption,
    fontWeight: Typography.bold,
    color: Colors.primary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.xl,
    paddingBottom: Spacing.hero,
  },
  notifCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
    ...Shadows.card,
  },
  notifCardUnread: {
    backgroundColor: '#EEF2FF',
    borderColor: Colors.primarySoft,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentCol: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  notifTitle: {
    fontSize: Typography.bodySmall,
    color: Colors.textPrimary,
  },
  notifTitleUnread: {
    fontWeight: Typography.bold,
    color: Colors.primary,
  },
  timeText: {
    fontSize: 10,
    color: Colors.textTertiary,
  },
  messageText: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
});
