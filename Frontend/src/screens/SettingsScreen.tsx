import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants';
import { useMarketplace } from '../context';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const { userProfile, resetDemoData } = useMarketplace();

  const [orderAlerts, setOrderAlerts] = useState(true);
  const [chatAlerts, setChatAlerts] = useState(true);
  const [campusListingAlerts, setCampusListingAlerts] = useState(false);

  const handleResetSession = () => {
    Alert.alert(
      'Reset Demo Session',
      'This will reset all created listings, orders, messages, and saved items back to the default demo state. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset Demo',
          style: 'destructive',
          onPress: async () => {
            await resetDemoData();
            Alert.alert(
              'Session Reset',
              'Demo session has been restored to default seeds.',
              [
                {
                  text: 'Restart Onboarding',
                  onPress: () => {
                    navigation.reset({
                      index: 0,
                      routes: [{ name: 'Welcome' }],
                    });
                  },
                },
                {
                  text: 'Stay on Marketplace',
                },
              ]
            );
          },
        },
      ]
    );
  };

  const handleSignOut = () => {
    Alert.alert(
      'Exit Demo Session',
      'Return to the welcome and role selection screen?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Return to Start',
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Welcome' }],
            });
          },
        },
      ]
    );
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      <SafeAreaView edges={['top']} style={styles.safeHeader}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings & Controls</Text>
          <View style={{ width: 36 }} />
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Account Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Identity</Text>
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Campus Email</Text>
              <Text style={styles.infoVal}>{userProfile.email}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Verified College</Text>
              <Text style={styles.infoVal} numberOfLines={1}>
                {userProfile.institutionName}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Campus Role</Text>
              <Text style={styles.infoVal}>{userProfile.role}</Text>
            </View>
          </View>
        </View>

        {/* Local Notification Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Prototype Notification Toggles</Text>
          <View style={styles.card}>
            <View style={styles.switchRow}>
              <View style={styles.switchMeta}>
                <Text style={styles.switchTitle}>Order & Handover Updates</Text>
                <Text style={styles.switchSub}>Alerts when order status changes</Text>
              </View>
              <Switch
                value={orderAlerts}
                onValueChange={setOrderAlerts}
                trackColor={{ false: Colors.border, true: Colors.primarySoft }}
                thumbColor={orderAlerts ? Colors.primary : '#F4F3F4'}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.switchRow}>
              <View style={styles.switchMeta}>
                <Text style={styles.switchTitle}>Buyer & Seller Chat Inquiries</Text>
                <Text style={styles.switchSub}>Alerts for new messages on your listings</Text>
              </View>
              <Switch
                value={chatAlerts}
                onValueChange={setChatAlerts}
                trackColor={{ false: Colors.border, true: Colors.primarySoft }}
                thumbColor={chatAlerts ? Colors.primary : '#F4F3F4'}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.switchRow}>
              <View style={styles.switchMeta}>
                <Text style={styles.switchTitle}>New Campus Listings Digest</Text>
                <Text style={styles.switchSub}>Weekly highlights from your college</Text>
              </View>
              <Switch
                value={campusListingAlerts}
                onValueChange={setCampusListingAlerts}
                trackColor={{ false: Colors.border, true: Colors.primarySoft }}
                thumbColor={campusListingAlerts ? Colors.primary : '#F4F3F4'}
              />
            </View>
          </View>
        </View>

        {/* Demo Controls */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Developer & Prototype Actions</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.actionRow} onPress={handleResetSession}>
              <Ionicons name="refresh-circle-outline" size={20} color="#D97706" />
              <View style={{ flex: 1 }}>
                <Text style={[styles.actionRowText, { color: '#D97706' }]}>
                  Reset Demo State to Initial Seeds
                </Text>
                <Text style={styles.actionRowSub}>
                  Restores default mock products, orders, and chats
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={Colors.textTertiary} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.actionRow} onPress={handleSignOut}>
              <Ionicons name="log-out-outline" size={20} color="#DC2626" />
              <View style={{ flex: 1 }}>
                <Text style={[styles.actionRowText, { color: '#DC2626' }]}>
                  Return to Onboarding (Role Selection)
                </Text>
                <Text style={styles.actionRowSub}>
                  Re-test the 4-step role & college onboarding sequence
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={Colors.textTertiary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Architecture note */}
        <View style={styles.architectureBox}>
          <Ionicons name="code-slash" size={18} color={Colors.primary} />
          <Text style={styles.architectureText}>
            Architecture: React Native + Expo SDK 57 + TypeScript. Local service layer is designed for drop-in replacement with Spring Boot and PostgreSQL APIs in Phase 2.
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
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.caption,
    fontWeight: Typography.bold,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  infoRow: {
    paddingVertical: Spacing.xs,
  },
  infoLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  infoVal: {
    fontSize: Typography.bodySmall,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: Spacing.sm,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
  },
  switchMeta: {
    flex: 1,
    marginRight: Spacing.md,
  },
  switchTitle: {
    fontSize: Typography.bodySmall,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  switchSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  actionRowText: {
    fontSize: Typography.bodySmall,
    fontWeight: Typography.bold,
  },
  actionRowSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  architectureBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#EEF2FF',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  architectureText: {
    flex: 1,
    fontSize: 11,
    color: Colors.primary,
    lineHeight: 15,
  },
});
