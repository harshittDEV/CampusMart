import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants';
import { useMarketplace } from '../context';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Chat'>;

const QUICK_PROMPTS = [
  'Is this still available?',
  'Can we meet near the library?',
  'Is the price negotiable?',
  'What semester notes are included?',
];

export const ChatScreen: React.FC<Props> = ({ route, navigation }) => {
  const { conversationId, productId, sellerId, sellerName } = route.params;
  const {
    conversations,
    messages,
    sendMessage,
    userProfile,
    products,
    getOrCreateConversation,
  } = useMarketplace();

  const scrollViewRef = useRef<any>(null);
  const [inputText, setInputText] = useState('');

  // Find or create conversation
  const product = products.find((p) => p.id === productId);
  const activeConv =
    conversations.find((c) => c.id === conversationId) ||
    (product ? getOrCreateConversation(product) : null);

  const activeConvId = activeConv ? activeConv.id : conversationId || 'conv_temp';
  const threadMessages = messages[activeConvId] || [];

  const displayName =
    sellerName ||
    (activeConv
      ? activeConv.participant1Id === userProfile.id
        ? activeConv.participant2Name
        : activeConv.participant1Name
      : 'Campus Member');

  useEffect(() => {
    // Scroll to bottom on initial load or message change
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 150);
  }, [threadMessages.length]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendMessage(activeConvId, inputText.trim());
    setInputText('');
  };

  const handleQuickPrompt = (prompt: string) => {
    sendMessage(activeConvId, prompt);
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* ── Top Header ────────────────────────────────────────── */}
      <SafeAreaView edges={['top']} style={styles.safeHeader}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>

          <View style={styles.headerInfo}>
            <Text style={styles.sellerTitle}>{displayName}</Text>
            <View style={styles.verifiedRow}>
              <Ionicons name="shield-checkmark" size={11} color={Colors.success} />
              <Text style={styles.verifiedText}>Verified Campus Member</Text>
            </View>
          </View>

          {sellerId && (
            <TouchableOpacity
              style={styles.profileBtn}
              onPress={() => navigation.navigate('SellerProfile', { sellerId })}
            >
              <Ionicons name="person-circle-outline" size={24} color={Colors.primary} />
            </TouchableOpacity>
          )}
        </View>

        {/* ── Listing Context Card ─────────────────────────────── */}
        {product && (
          <TouchableOpacity
            style={styles.listingBanner}
            onPress={() => navigation.navigate('ProductDetails', { productId: product.id })}
            activeOpacity={0.8}
          >
            <Image
              source={{ uri: product.images[0] }}
              style={styles.bannerThumb}
              resizeMode="cover"
            />
            <View style={styles.bannerMeta}>
              <Text style={styles.bannerTitle} numberOfLines={1}>
                {product.title}
              </Text>
              <Text style={styles.bannerPrice}>
                ₹{product.price.toLocaleString('en-IN')}
              </Text>
            </View>
            <View style={styles.viewListingBtn}>
              <Text style={styles.viewListingText}>View Item</Text>
              <Ionicons name="chevron-forward" size={12} color={Colors.primary} />
            </View>
          </TouchableOpacity>
        )}
      </SafeAreaView>

      {/* ── Messages List ────────────────────────────────────── */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Safety Tip in Chat */}
        <View style={styles.chatSafetyCard}>
          <Ionicons name="information-circle-outline" size={16} color={Colors.primary} />
          <Text style={styles.chatSafetyText}>
            Arrange to meet at daytime campus locations. Never share UPI PINs or passwords.
          </Text>
        </View>

        {threadMessages.map((msg) => {
          const isMe = msg.senderId === userProfile.id;
          return (
            <View
              key={msg.id}
              style={[styles.msgRow, isMe ? styles.msgRowMe : styles.msgRowOther]}
            >
              <View
                style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther]}
              >
                <Text style={[styles.bubbleText, isMe ? styles.bubbleTextMe : styles.bubbleTextOther]}>
                  {msg.text}
                </Text>
                <Text style={[styles.timestamp, isMe ? styles.timestampMe : styles.timestampOther]}>
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* ── Quick Prompts ─────────────────────────────────────── */}
      <View style={styles.quickPromptsRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.promptsScroll}>
          {QUICK_PROMPTS.map((p, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.promptChip}
              onPress={() => handleQuickPrompt(p)}
            >
              <Text style={styles.promptText}>{p}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ── Input Bar ─────────────────────────────────────────── */}
      <SafeAreaView edges={['bottom']} style={styles.safeInputBar}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Write a message to arrange handover..."
            placeholderTextColor={Colors.textTertiary}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={300}
          />
          <TouchableOpacity
            style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Ionicons name="send" size={18} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
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
  headerInfo: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  sellerTitle: {
    fontSize: Typography.body,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  verifiedText: {
    fontSize: 10,
    color: Colors.success,
    fontWeight: Typography.medium,
  },
  profileBtn: {
    padding: Spacing.xs,
  },
  listingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  bannerThumb: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.xs,
    backgroundColor: Colors.borderLight,
  },
  bannerMeta: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: Typography.caption,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  bannerPrice: {
    fontSize: 12,
    fontWeight: Typography.bold,
    color: Colors.primary,
  },
  viewListingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewListingText: {
    fontSize: 11,
    fontWeight: Typography.bold,
    color: Colors.primary,
  },

  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  chatSafetyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EEF2FF',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
  },
  chatSafetyText: {
    flex: 1,
    fontSize: 11,
    color: Colors.primary,
    lineHeight: 15,
  },
  msgRow: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
  },
  msgRowMe: {
    justifyContent: 'flex-end',
  },
  msgRowOther: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
  },
  bubbleMe: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 2,
  },
  bubbleOther: {
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 2,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  bubbleText: {
    fontSize: Typography.bodySmall,
    lineHeight: Typography.bodySmall * 1.35,
  },
  bubbleTextMe: {
    color: Colors.white,
  },
  bubbleTextOther: {
    color: Colors.textPrimary,
  },
  timestamp: {
    fontSize: 9,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  timestampMe: {
    color: 'rgba(255,255,255,0.7)',
  },
  timestampOther: {
    color: Colors.textTertiary,
  },

  quickPromptsRow: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingVertical: 6,
  },
  promptsScroll: {
    paddingHorizontal: Spacing.md,
  },
  promptChip: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.xs,
  },
  promptText: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: Typography.medium,
  },

  safeInputBar: {
    backgroundColor: Colors.white,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  textInput: {
    flex: 1,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    fontSize: Typography.bodySmall,
    color: Colors.textPrimary,
    maxHeight: 80,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.card,
  },
  sendBtnDisabled: {
    backgroundColor: Colors.textTertiary,
  },
});
