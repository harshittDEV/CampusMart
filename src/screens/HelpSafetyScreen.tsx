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
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'HelpSafety'>;

const GUIDELINES = [
  {
    icon: 'sunny-outline' as const,
    title: 'Meet in Daylight at Well-Populated Spots',
    desc: 'Always meet at familiar campus locations like college canteens, main library stairs, or department academic blocks during open hours.',
  },
  {
    icon: 'hardware-chip-outline' as const,
    title: 'Inspect Electronics & Gear Before Paying',
    desc: 'Test devices thoroughly. Bring a portable charger or power bank if testing laptops, calculators, or monitors on campus.',
  },
  {
    icon: 'lock-closed-outline' as const,
    title: 'Never Share UPI PINs or Passwords',
    desc: 'Remember: receiving money never requires entering your UPI PIN or scanning QR codes. Beware of advance-payment requests.',
  },
  {
    icon: 'school-outline' as const,
    title: 'Verify College Identity',
    desc: 'CampusMart checks institutional domains (.edu, .edu.in, .ac.in). Keep conversations on the app so student moderation can support you.',
  },
];

const FAQS = [
  {
    q: 'How does campus handover work?',
    a: 'Buyers and sellers agree on a convenient campus spot (e.g. library, cafeteria, hostel security gate). The item is inspected and handed over directly.',
  },
  {
    q: 'Can I purchase items from students at other colleges?',
    a: 'Yes! Toggle your browsing scope to "Other Campuses" or "All Campuses". Coordinate a mutually convenient handover spot between institutions.',
  },
  {
    q: 'Are there any platform commissions or listing fees?',
    a: 'CampusMart is 100% free for college students and faculty members. No commission is deducted from your sales.',
  },
];

export const HelpSafetyScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      <SafeAreaView edges={['top']} style={styles.safeHeader}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Safety & Guidelines</Text>
          <View style={{ width: 36 }} />
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner */}
        <View style={styles.heroBanner}>
          <Ionicons name="shield-checkmark" size={32} color={Colors.white} />
          <Text style={styles.heroTitle}>Student-First Safety</Text>
          <Text style={styles.heroSub}>
            CampusMart connects verified college communities to make campus trade secure, transparent, and trusted.
          </Text>
        </View>

        {/* Guidelines */}
        <Text style={styles.sectionHeading}>Handover Best Practices</Text>
        <View style={styles.guidelinesList}>
          {GUIDELINES.map((g, idx) => (
            <View key={idx} style={styles.guidelineCard}>
              <View style={styles.iconCircle}>
                <Ionicons name={g.icon} size={20} color={Colors.primary} />
              </View>
              <View style={styles.guidelineMeta}>
                <Text style={styles.guidelineTitle}>{g.title}</Text>
                <Text style={styles.guidelineDesc}>{g.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* FAQs */}
        <Text style={styles.sectionHeading}>Frequently Asked Questions</Text>
        <View style={styles.faqList}>
          {FAQS.map((faq, idx) => (
            <View key={idx} style={styles.faqCard}>
              <Text style={styles.faqQuestion}>{faq.q}</Text>
              <Text style={styles.faqAnswer}>{faq.a}</Text>
            </View>
          ))}
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
  heroBanner: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.xl,
    ...Shadows.button,
  },
  heroTitle: {
    fontSize: Typography.heading2,
    fontWeight: Typography.bold,
    color: Colors.white,
    marginTop: Spacing.sm,
  },
  heroSub: {
    fontSize: Typography.caption,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    marginTop: Spacing.xs,
    lineHeight: 18,
  },
  sectionHeading: {
    fontSize: Typography.caption,
    fontWeight: Typography.bold,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.md,
    marginLeft: Spacing.xs,
  },
  guidelinesList: {
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  guidelineCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.md,
    ...Shadows.card,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guidelineMeta: {
    flex: 1,
  },
  guidelineTitle: {
    fontSize: Typography.bodySmall,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  guidelineDesc: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  faqList: {
    gap: Spacing.sm,
  },
  faqCard: {
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  faqQuestion: {
    fontSize: Typography.bodySmall,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  faqAnswer: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 17,
    marginTop: 4,
  },
});
