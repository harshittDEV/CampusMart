import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants';
import { useMarketplace } from '../context';
import { RootStackParamList, ReportReason } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'ReportListing'>;

const REASONS: { id: ReportReason; label: string; desc: string }[] = [
  {
    id: 'SUSPICIOUS_OR_FRAUDULENT',
    label: 'Suspicious or Fraudulent Listing',
    desc: 'Seller requests advance UPI or external off-platform payments',
  },
  {
    id: 'INCORRECT_PRODUCT_INFO',
    label: 'Incorrect Product Information',
    desc: 'Specs, photo, condition, or edition differs from description',
  },
  {
    id: 'PROHIBITED_ITEM',
    label: 'Prohibited Item',
    desc: 'Item violates campus safety policies or university guidelines',
  },
  {
    id: 'INAPPROPRIATE_CONTENT',
    label: 'Inappropriate Content',
    desc: 'Offensive language, images, or harassment',
  },
  {
    id: 'SUSPECTED_SCAM',
    label: 'Suspected Scam',
    desc: 'Unrealistic price or fake identity claims',
  },
  {
    id: 'OTHER',
    label: 'Other Issue',
    desc: 'Any other concern regarding this campus listing',
  },
];

export const ReportListingScreen: React.FC<Props> = ({ route, navigation }) => {
  const { productId, productTitle } = route.params;
  const { userProfile, submitReport } = useMarketplace();

  const [selectedReason, setSelectedReason] = useState<ReportReason>('SUSPICIOUS_OR_FRAUDULENT');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    submitReport({
      listingId: productId,
      listingTitle: productTitle,
      reporterId: userProfile.id,
      reason: selectedReason,
      description: description.trim() || undefined,
    });

    Alert.alert(
      'Report Submitted',
      'Thank you for helping keep the CampusMart community safe. Your report has been recorded locally for review.',
      [{ text: 'Done', onPress: () => navigation.goBack() }]
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
          <Text style={styles.headerTitle}>Report Listing</Text>
          <View style={{ width: 36 }} />
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.itemTitleBanner}>
          Reporting: <Text style={styles.bold}>{productTitle}</Text>
        </Text>

        <Text style={styles.sectionHeading}>Why are you reporting this item?</Text>

        <View style={styles.reasonsList}>
          {REASONS.map((r) => {
            const isSelected = selectedReason === r.id;
            return (
              <TouchableOpacity
                key={r.id}
                style={[styles.reasonCard, isSelected && styles.reasonCardActive]}
                onPress={() => setSelectedReason(r.id)}
              >
                <Ionicons
                  name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                  size={20}
                  color={isSelected ? Colors.primary : Colors.textTertiary}
                />
                <View style={styles.reasonMeta}>
                  <Text style={[styles.reasonLabel, isSelected && styles.reasonLabelActive]}>
                    {r.label}
                  </Text>
                  <Text style={styles.reasonDesc}>{r.desc}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.sectionHeading}>Additional Details (Optional)</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Please share any specific details that will help our student moderation team..."
          placeholderTextColor={Colors.textTertiary}
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
        />

        <View style={styles.safetyBox}>
          <Ionicons name="shield-outline" size={18} color={Colors.primary} />
          <Text style={styles.safetyText}>
            Reports are kept confidential between you and CampusMart campus moderators.
          </Text>
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitBtnText}>Submit Report</Text>
        </TouchableOpacity>
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
  itemTitleBanner: {
    fontSize: Typography.bodySmall,
    color: Colors.textSecondary,
    backgroundColor: '#EEF2FF',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
  },
  bold: {
    fontWeight: Typography.bold,
    color: Colors.primary,
  },
  sectionHeading: {
    fontSize: Typography.caption,
    fontWeight: Typography.bold,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },
  reasonsList: {
    gap: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  reasonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.md,
  },
  reasonCardActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  reasonMeta: {
    flex: 1,
  },
  reasonLabel: {
    fontSize: Typography.bodySmall,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  reasonLabelActive: {
    color: Colors.primary,
  },
  reasonDesc: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  textArea: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: Typography.bodySmall,
    color: Colors.textPrimary,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: Spacing.lg,
  },
  safetyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: '#EEF2FF',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xl,
  },
  safetyText: {
    flex: 1,
    fontSize: 11,
    color: Colors.primary,
  },
  submitBtn: {
    backgroundColor: '#DC2626',
    paddingVertical: Platform.OS === 'ios' ? 16 : 14,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
  },
  submitBtnText: {
    fontSize: Typography.label,
    fontWeight: Typography.bold,
    color: Colors.white,
  },
});
