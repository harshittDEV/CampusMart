import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants';
import { useMarketplace } from '../context';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'EditProfile'>;

export const EditProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { userProfile, setUserProfile } = useMarketplace();

  const [name, setName] = useState(userProfile.name);
  const [department, setDepartment] = useState(userProfile.department || '');
  const [academicYear, setAcademicYear] = useState(userProfile.academicYear || '');
  const [phone, setPhone] = useState(userProfile.phone || '+91 98765 43210');

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Full name cannot be empty.');
      return;
    }

    setUserProfile({
      name: name.trim(),
      department: department.trim(),
      academicYear: academicYear.trim(),
      phone: phone.trim(),
    });

    Alert.alert('Profile Updated', 'Your campus profile details have been saved locally.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      <SafeAreaView edges={['top']} style={styles.safeHeader}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.saveBtnText}>Save</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Institutional Verification Notice (Read-Only) */}
        <View style={styles.lockedSection}>
          <View style={styles.lockedHeader}>
            <Ionicons name="lock-closed" size={16} color={Colors.textSecondary} />
            <Text style={styles.lockedTitle}>Verified Institutional Identity</Text>
          </View>
          <Text style={styles.lockedSub}>
            Your role and campus affiliation are tied to your institutional credentials and cannot be edited directly.
          </Text>

          <View style={styles.lockedPillsRow}>
            <View style={styles.lockedPill}>
              <Text style={styles.lockedPillLabel}>Role</Text>
              <Text style={styles.lockedPillValue}>{userProfile.role}</Text>
            </View>
            <View style={[styles.lockedPill, { flex: 2 }]}>
              <Text style={styles.lockedPillLabel}>Institution</Text>
              <Text style={styles.lockedPillValue} numberOfLines={1}>
                {userProfile.institutionName}
              </Text>
            </View>
          </View>
        </View>

        {/* Editable Fields */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="e.g. Harshit Singh"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Department / Major</Text>
          <TextInput
            style={styles.input}
            value={department}
            onChangeText={setDepartment}
            placeholder="e.g. Computer Science & Engineering"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>
            {userProfile.role === 'STUDENT' ? 'Academic Year / Semester' : 'Designation / Staff Title'}
          </Text>
          <TextInput
            style={styles.input}
            value={academicYear}
            onChangeText={setAcademicYear}
            placeholder="e.g. 3rd Year / 6th Sem"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Contact Phone (For Handover SMS/Coordination)</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="+91 98765 43210"
          />
        </View>

        <TouchableOpacity style={styles.saveActionBtn} onPress={handleSave}>
          <Text style={styles.saveActionText}>Save Changes</Text>
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
  saveBtnText: {
    fontSize: Typography.label,
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
  lockedSection: {
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xl,
    ...Shadows.card,
  },
  lockedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  lockedTitle: {
    fontSize: Typography.caption,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  lockedSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 15,
    marginBottom: Spacing.md,
  },
  lockedPillsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  lockedPill: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  lockedPillLabel: {
    fontSize: 9,
    fontWeight: Typography.bold,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
  },
  lockedPillValue: {
    fontSize: 12,
    fontWeight: Typography.bold,
    color: Colors.primary,
    marginTop: 2,
  },
  formGroup: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: Typography.caption,
    fontWeight: Typography.bold,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.xs,
  },
  input: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    fontSize: Typography.body,
    color: Colors.textPrimary,
  },
  saveActionBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: Platform.OS === 'ios' ? 16 : 14,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    marginTop: Spacing.md,
    ...Shadows.button,
  },
  saveActionText: {
    color: Colors.white,
    fontWeight: Typography.bold,
    fontSize: Typography.label,
  },
});
