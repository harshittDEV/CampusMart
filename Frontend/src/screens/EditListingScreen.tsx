import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  StatusBar,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants';
import { CATEGORIES } from '../data';
import { useMarketplace } from '../context';
import { RootStackParamList, ProductCondition, ListingStatus } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'EditListing'>;

const STATUSES: { id: ListingStatus; label: string }[] = [
  { id: 'ACTIVE', label: 'Active' },
  { id: 'RESERVED', label: 'Reserved' },
  { id: 'SOLD', label: 'Sold' },
];

export const EditListingScreen: React.FC<Props> = ({ route, navigation }) => {
  const { productId } = route.params;
  const { products, updateProduct, userProfile } = useMarketplace();

  const product = products.find((p) => p.id === productId);

  if (!product || product.sellerId !== userProfile.id) {
    return (
      <SafeAreaView style={styles.notFoundRoot}>
        <Text style={styles.notFoundTitle}>Permission Denied</Text>
        <Text style={styles.notFoundSub}>You can only edit listings that you own.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const [title, setTitle] = useState(product.title);
  const [description, setDescription] = useState(product.description);
  const [price, setPrice] = useState(product.price.toString());
  const [pickupLocation, setPickupLocation] = useState(product.pickupLocation);
  const [negotiable, setNegotiable] = useState(product.negotiable);
  const [status, setStatus] = useState<ListingStatus>(product.status);

  const handleSave = () => {
    if (!title.trim() || !price.trim() || !description.trim()) {
      Alert.alert('Required Fields', 'Title, price, and description cannot be empty.');
      return;
    }

    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      Alert.alert('Invalid Price', 'Please enter a valid price in INR.');
      return;
    }

    updateProduct(product.id, {
      title: title.trim(),
      description: description.trim(),
      price: numPrice,
      pickupLocation: pickupLocation.trim(),
      negotiable,
      status,
    });

    Alert.alert('Listing Updated', 'Your listing details have been saved.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      <SafeAreaView edges={['top']} style={styles.safeHeader}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Listing</Text>
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
        {/* Status Selector */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Listing Status</Text>
          <View style={styles.statusRow}>
            {STATUSES.map((s) => {
              const isSelected = status === s.id;
              return (
                <TouchableOpacity
                  key={s.id}
                  style={[styles.statusChip, isSelected && styles.statusChipActive]}
                  onPress={() => setStatus(s.id)}
                >
                  <Text style={[styles.statusChipText, isSelected && styles.statusChipTextActive]}>
                    {s.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Title */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Item title"
          />
        </View>

        {/* Price */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Price (₹ INR)</Text>
          <TextInput
            style={styles.input}
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />
        </View>

        {/* Negotiable */}
        <View style={styles.switchRow}>
          <Text style={styles.label}>Price Negotiable</Text>
          <Switch
            value={negotiable}
            onValueChange={setNegotiable}
            trackColor={{ false: Colors.border, true: Colors.primarySoft }}
            thumbColor={negotiable ? Colors.primary : '#F4F3F4'}
          />
        </View>

        {/* Handover Spot */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Campus Pickup Location</Text>
          <TextInput
            style={styles.input}
            value={pickupLocation}
            onChangeText={setPickupLocation}
          />
        </View>

        {/* Description */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.textArea}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
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
  textArea: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: Typography.body,
    color: Colors.textPrimary,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  statusRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  statusChip: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statusChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  statusChipText: {
    fontSize: Typography.caption,
    fontWeight: Typography.semiBold,
    color: Colors.textPrimary,
  },
  statusChipTextActive: {
    color: Colors.white,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
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
  notFoundRoot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  notFoundTitle: {
    fontSize: Typography.heading2,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  notFoundSub: {
    fontSize: Typography.body,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  backBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
  },
  backBtnText: {
    color: Colors.white,
    fontWeight: Typography.bold,
  },
});
