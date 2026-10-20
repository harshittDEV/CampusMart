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
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants';
import { useMarketplace } from '../context';
import { RootStackParamList } from '../types';
import { EmptyState } from '../components';

type Props = NativeStackScreenProps<RootStackParamList, 'ChatList'>;

export const ChatListScreen: React.FC<Props> = ({ navigation }) => {
  const { conversations, userProfile } = useMarketplace();

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      <SafeAreaView edges={['top']} style={styles.safeHeader}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Messages & Inquiries</Text>
          <View style={{ width: 36 }} />
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {conversations.length === 0 ? (
          <EmptyState
            iconName="chatbubble-ellipses-outline"
            title="No Conversations Yet"
            description="When you contact a campus seller or receive an inquiry about your listing, chats will appear here."
            actionLabel="Browse Marketplace"
            onAction={() => navigation.navigate('MainTabs', { screen: 'ExploreTab' } as never)}
          />
        ) : (
          conversations.map((conv) => {
            const isUserP1 = conv.participant1Id === userProfile.id;
            const otherPartyName = isUserP1 ? conv.participant2Name : conv.participant1Name;

            return (
              <TouchableOpacity
                key={conv.id}
                style={styles.convCard}
                onPress={() =>
                  navigation.navigate('Chat', {
                    conversationId: conv.id,
                    productId: conv.listingId,
                    sellerId: conv.participant2Id,
                    sellerName: otherPartyName,
                  })
                }
                activeOpacity={0.8}
              >
                <Image
                  source={{ uri: conv.listingImage }}
                  style={styles.itemThumb}
                  resizeMode="cover"
                />

                <View style={styles.convMeta}>
                  <View style={styles.topRow}>
                    <Text style={styles.otherName} numberOfLines={1}>
                      {otherPartyName}
                    </Text>
                    <Text style={styles.timeText}>
                      {new Date(conv.lastMessageTimestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>

                  <Text style={styles.listingTitle} numberOfLines={1}>
                    Re: {conv.listingTitle} (₹{conv.listingPrice.toLocaleString('en-IN')})
                  </Text>

                  <View style={styles.msgRow}>
                    <Text style={styles.lastMsg} numberOfLines={1}>
                      {conv.lastMessage}
                    </Text>
                    {conv.unreadCount > 0 && (
                      <View style={styles.unreadDot} />
                    )}
                  </View>
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
  convCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    gap: Spacing.md,
    ...Shadows.card,
  },
  itemThumb: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.borderLight,
  },
  convMeta: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  otherName: {
    fontSize: Typography.bodySmall,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  timeText: {
    fontSize: 11,
    color: Colors.textTertiary,
  },
  listingTitle: {
    fontSize: 11,
    fontWeight: Typography.semiBold,
    color: Colors.primary,
    marginBottom: 4,
  },
  msgRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lastMsg: {
    fontSize: Typography.caption,
    color: Colors.textSecondary,
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginLeft: 6,
  },
});
