import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  Image,
  StatusBar,
  Alert,
  Modal,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants';
import { CATEGORIES } from '../data';
import { useMarketplace } from '../context';
import { ProductCondition } from '../types';
import { StatusBadge } from '../components';

const SAMPLE_IMAGES = [
  'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
];

const CONDITIONS: { id: ProductCondition; label: string; desc: string }[] = [
  { id: 'NEW', label: 'New', desc: 'Unopened with original tags/box' },
  { id: 'LIKE_NEW', label: 'Like New', desc: 'Barely used, zero flaws' },
  { id: 'GOOD', label: 'Good', desc: 'Minor wear, fully functional' },
  { id: 'FAIR', label: 'Fair', desc: 'Visible marks/scratches, works' },
  { id: 'NEEDS_REPAIR', label: 'Needs Repair', desc: 'Requires fixing or parts' },
];

export const SellScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { userProfile, addProduct } = useMarketplace();

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [condition, setCondition] = useState<ProductCondition>('GOOD');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [negotiable, setNegotiable] = useState(true);
  const [pickupLocation, setPickupLocation] = useState('Campus Library or Canteen');
  const [images, setImages] = useState<string[]>([SAMPLE_IMAGES[0]]);

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewVisible, setPreviewVisible] = useState(false);

  // Pick image using Expo ImagePicker
  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Needed',
          'Camera roll permissions are needed to select photos. You can also pick from the sample photos below.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0].uri) {
        setImages((prev) => [...prev, result.assets[0].uri]);
      }
    } catch {
      // Fallback
      Alert.alert('Notice', 'Sample images are available for testing listing creation.');
    }
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!title.trim()) {
      errs.title = 'Product title is required';
    } else if (title.trim().length < 4) {
      errs.title = 'Title must be at least 4 characters';
    }

    if (!description.trim()) {
      errs.description = 'Please describe your item';
    }

    if (!categoryId) {
      errs.category = 'Please select a category';
    }

    if (!price.trim()) {
      errs.price = 'Price is required';
    } else {
      const num = parseFloat(price);
      if (isNaN(num) || num <= 0) {
        errs.price = 'Enter a valid positive price';
      }
    }

    if (!pickupLocation.trim()) {
      errs.pickupLocation = 'Specify where on campus you prefer to meet';
    }

    if (images.length === 0) {
      errs.images = 'Please attach at least one photo';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePublish = () => {
    if (!validate()) {
      Alert.alert('Incomplete Form', 'Please fill in all required fields marked in red.');
      return;
    }

    const created = addProduct({
      title: title.trim(),
      description: description.trim(),
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      categoryId,
      condition,
      negotiable,
      images,
      sellerId: userProfile.id,
      sellerName: userProfile.name,
      sellerRole: userProfile.role,
      sellerInstitutionId: userProfile.institutionId,
      sellerInstitutionName: userProfile.institutionName,
      sellerAvatar: userProfile.avatar,
      pickupLocation: pickupLocation.trim(),
      savesCount: 0,
    });

    // Reset Form
    setTitle('');
    setDescription('');
    setPrice('');
    setOriginalPrice('');
    setCategoryId('');
    setErrors({});

    Alert.alert(
      'Listing Published! 🎉',
      `"${created.title}" is now published on CampusMart under ${userProfile.institutionName}.`,
      [
        {
          text: 'View Listing',
          onPress: () => navigation.navigate('ProductDetails', { productId: created.id }),
        },
        {
          text: 'My Listings',
          onPress: () => navigation.navigate('MyListings'),
        },
      ]
    );
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      <SafeAreaView edges={['top']} style={styles.safeHeader}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Sell an Item</Text>
          <TouchableOpacity
            style={styles.previewBtn}
            onPress={() => {
              if (validate()) setPreviewVisible(true);
            }}
          >
            <Ionicons name="eye-outline" size={16} color={Colors.primary} />
            <Text style={styles.previewBtnText}>Preview</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.headerSubtitle}>
          List within {userProfile.institutionName}
        </Text>
      </SafeAreaView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Photo Selection */}
        <View style={styles.formSection}>
          <Text style={styles.sectionLabel}>Photos ({images.length}/5)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoRow}>
            <TouchableOpacity style={styles.addPhotoBtn} onPress={handlePickImage} activeOpacity={0.8}>
              <Ionicons name="camera-outline" size={28} color={Colors.primary} />
              <Text style={styles.addPhotoText}>Add Photo</Text>
            </TouchableOpacity>

            {images.map((uri, idx) => (
              <View key={idx} style={styles.photoThumbWrapper}>
                <Image source={{ uri }} style={styles.photoThumb} />
                <TouchableOpacity
                  style={styles.removePhotoBtn}
                  onPress={() => setImages((prev) => prev.filter((_, i) => i !== idx))}
                >
                  <Ionicons name="close" size={14} color={Colors.white} />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          {/* Sample quick photos */}
          <Text style={styles.quickSampleHint}>Or pick a sample item photo:</Text>
          <View style={styles.sampleRow}>
            {SAMPLE_IMAGES.map((sampleUri, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => setImages([sampleUri])}
                style={[styles.sampleBtn, images.includes(sampleUri) && styles.sampleBtnActive]}
              >
                <Image source={{ uri: sampleUri }} style={styles.sampleImg} />
              </TouchableOpacity>
            ))}
          </View>
          {errors.images && <Text style={styles.errorText}>{errors.images}</Text>}
        </View>

        {/* Title */}
        <View style={styles.formSection}>
          <Text style={styles.sectionLabel}>Listing Title *</Text>
          <TextInput
            style={[styles.textInput, errors.title && styles.inputError]}
            placeholder="e.g. Casio FX-991EX Calculator / Sem 4 Books"
            placeholderTextColor={Colors.textTertiary}
            value={title}
            onChangeText={setTitle}
          />
          {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
        </View>

        {/* Category Picker */}
        <View style={styles.formSection}>
          <Text style={styles.sectionLabel}>Category *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
            {CATEGORIES.map((cat) => {
              const isSelected = categoryId === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.catChip, isSelected && styles.catChipActive]}
                  onPress={() => setCategoryId(cat.id)}
                >
                  <Ionicons
                    name={cat.iconName as any}
                    size={16}
                    color={isSelected ? Colors.white : Colors.textPrimary}
                  />
                  <Text style={[styles.catChipText, isSelected && styles.catChipTextActive]}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
        </View>

        {/* Condition Picker */}
        <View style={styles.formSection}>
          <Text style={styles.sectionLabel}>Condition *</Text>
          <View style={styles.conditionsList}>
            {CONDITIONS.map((c) => {
              const isSelected = condition === c.id;
              return (
                <TouchableOpacity
                  key={c.id}
                  style={[styles.condRow, isSelected && styles.condRowActive]}
                  onPress={() => setCondition(c.id)}
                >
                  <View style={styles.condRowLeft}>
                    <Text style={[styles.condTitle, isSelected && styles.condTitleActive]}>
                      {c.label}
                    </Text>
                    <Text style={styles.condDesc}>{c.desc}</Text>
                  </View>
                  <Ionicons
                    name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                    size={20}
                    color={isSelected ? Colors.primary : Colors.textTertiary}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Price & Original Price */}
        <View style={styles.formSection}>
          <View style={styles.priceInputsRow}>
            <View style={styles.priceCol}>
              <Text style={styles.sectionLabel}>Price (₹) *</Text>
              <View style={[styles.priceInputBox, errors.price && styles.inputError]}>
                <Text style={styles.currencyPrefix}>₹</Text>
                <TextInput
                  style={styles.priceNumInput}
                  placeholder="950"
                  placeholderTextColor={Colors.textTertiary}
                  keyboardType="numeric"
                  value={price}
                  onChangeText={setPrice}
                />
              </View>
              {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
            </View>

            <View style={styles.priceCol}>
              <Text style={styles.sectionLabel}>Original Price (₹)</Text>
              <View style={styles.priceInputBox}>
                <Text style={styles.currencyPrefix}>₹</Text>
                <TextInput
                  style={styles.priceNumInput}
                  placeholder="1500 (opt)"
                  placeholderTextColor={Colors.textTertiary}
                  keyboardType="numeric"
                  value={originalPrice}
                  onChangeText={setOriginalPrice}
                />
              </View>
            </View>
          </View>

          {/* Negotiable switch */}
          <View style={styles.negotiableRow}>
            <View>
              <Text style={styles.negotiableTitle}>Price is Negotiable</Text>
              <Text style={styles.negotiableSub}>Allow buyers to make counter offers</Text>
            </View>
            <Switch
              value={negotiable}
              onValueChange={setNegotiable}
              trackColor={{ false: Colors.border, true: Colors.primarySoft }}
              thumbColor={negotiable ? Colors.primary : '#F4F3F4'}
            />
          </View>
        </View>

        {/* Pickup & Campus Location */}
        <View style={styles.formSection}>
          <Text style={styles.sectionLabel}>Campus Handover Spot *</Text>
          <TextInput
            style={[styles.textInput, errors.pickupLocation && styles.inputError]}
            placeholder="e.g. Mech Dept Block, Library entrance, Hostel Gate"
            placeholderTextColor={Colors.textTertiary}
            value={pickupLocation}
            onChangeText={setPickupLocation}
          />
          {errors.pickupLocation && <Text style={styles.errorText}>{errors.pickupLocation}</Text>}
        </View>

        {/* Description */}
        <View style={styles.formSection}>
          <Text style={styles.sectionLabel}>Description *</Text>
          <TextInput
            style={[styles.textArea, errors.description && styles.inputError]}
            placeholder="Mention edition, reason for selling, working condition, accessories included..."
            placeholderTextColor={Colors.textTertiary}
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
          />
          {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
        </View>

        {/* Publish Action Button */}
        <TouchableOpacity style={styles.publishBtn} onPress={handlePublish} activeOpacity={0.85}>
          <Ionicons name="cloud-upload-outline" size={20} color={Colors.white} />
          <Text style={styles.publishBtnText}>Publish Listing</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ── Preview Modal ─────────────────────────────────────── */}
      <Modal visible={previewVisible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.previewModalRoot}>
          <View style={styles.previewModalHeader}>
            <Text style={styles.previewModalTitle}>Listing Preview</Text>
            <TouchableOpacity onPress={() => setPreviewVisible(false)}>
              <Ionicons name="close" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.previewScroll} showsVerticalScrollIndicator={false}>
            {images.length > 0 && (
              <Image source={{ uri: images[0] }} style={styles.previewImage} resizeMode="cover" />
            )}
            <View style={styles.previewContent}>
              <StatusBadge status={condition} size="md" />
              <Text style={styles.previewTitle}>{title || 'Untitled Listing'}</Text>
              <Text style={styles.previewPrice}>₹{price || '0'}</Text>
              <Text style={styles.previewCampus}>{userProfile.institutionName}</Text>
              <Text style={styles.previewPickup}>📍 {pickupLocation}</Text>
              <Text style={styles.previewDesc}>{description || 'No description provided'}</Text>
            </View>
          </ScrollView>

          <View style={styles.previewFooter}>
            <TouchableOpacity
              style={styles.previewPublishBtn}
              onPress={() => {
                setPreviewVisible(false);
                handlePublish();
              }}
            >
              <Text style={styles.previewPublishText}>Looks Great, Publish Now</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
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
    paddingBottom: Spacing.md,
    ...Shadows.card,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.xs,
  },
  headerTitle: {
    fontSize: Typography.heading2,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  previewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  previewBtnText: {
    fontSize: Typography.caption,
    fontWeight: Typography.bold,
    color: Colors.primary,
  },
  headerSubtitle: {
    fontSize: Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.xl,
    paddingBottom: Spacing.hero,
  },
  formSection: {
    marginBottom: Spacing.xl,
  },
  sectionLabel: {
    fontSize: Typography.caption,
    fontWeight: Typography.bold,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  photoRow: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
  },
  addPhotoBtn: {
    width: 90,
    height: 90,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primaryLight,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
    gap: 4,
  },
  addPhotoText: {
    fontSize: 11,
    fontWeight: Typography.bold,
    color: Colors.primary,
  },
  photoThumbWrapper: {
    position: 'relative',
    marginRight: Spacing.sm,
  },
  photoThumb: {
    width: 90,
    height: 90,
    borderRadius: BorderRadius.md,
  },
  removePhotoBtn: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#DC2626',
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickSampleHint: {
    fontSize: 11,
    color: Colors.textTertiary,
    marginBottom: Spacing.xs,
  },
  sampleRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  sampleBtn: {
    borderRadius: BorderRadius.sm,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  sampleBtnActive: {
    borderColor: Colors.primary,
  },
  sampleImg: {
    width: 44,
    height: 44,
  },
  textInput: {
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
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  errorText: {
    fontSize: 11,
    color: '#DC2626',
    marginTop: 4,
    fontWeight: Typography.medium,
  },
  chipsScroll: {
    gap: Spacing.xs,
  },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.xs,
  },
  catChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  catChipText: {
    fontSize: Typography.caption,
    color: Colors.textPrimary,
  },
  catChipTextActive: {
    color: Colors.white,
    fontWeight: Typography.bold,
  },
  conditionsList: {
    gap: Spacing.xs,
  },
  condRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  condRowActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  condRowLeft: {
    flex: 1,
  },
  condTitle: {
    fontSize: Typography.bodySmall,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  condTitleActive: {
    color: Colors.primary,
  },
  condDesc: {
    fontSize: Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  priceInputsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  priceCol: {
    flex: 1,
  },
  priceInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
  },
  currencyPrefix: {
    fontSize: Typography.body,
    fontWeight: Typography.bold,
    color: Colors.textSecondary,
    marginRight: 4,
  },
  priceNumInput: {
    flex: 1,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    fontSize: Typography.body,
    color: Colors.textPrimary,
  },
  negotiableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: Spacing.md,
  },
  negotiableTitle: {
    fontSize: Typography.bodySmall,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  negotiableSub: {
    fontSize: Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  publishBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    paddingVertical: Platform.OS === 'ios' ? 16 : 14,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.md,
    ...Shadows.button,
  },
  publishBtnText: {
    fontSize: Typography.label,
    fontWeight: Typography.bold,
    color: Colors.white,
  },

  // Preview Modal
  previewModalRoot: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  previewModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  previewModalTitle: {
    fontSize: Typography.heading3,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  previewScroll: {
    flex: 1,
  },
  previewImage: {
    width: '100%',
    height: 240,
  },
  previewContent: {
    padding: Spacing.xl,
    gap: Spacing.sm,
  },
  previewTitle: {
    fontSize: Typography.heading2,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  previewPrice: {
    fontSize: 26,
    fontWeight: Typography.bold,
    color: Colors.primary,
  },
  previewCampus: {
    fontSize: Typography.caption,
    fontWeight: Typography.semiBold,
    color: Colors.textSecondary,
  },
  previewPickup: {
    fontSize: Typography.caption,
    color: Colors.textPrimary,
  },
  previewDesc: {
    fontSize: Typography.body,
    color: Colors.textPrimary,
    lineHeight: Typography.body * 1.5,
    marginTop: Spacing.md,
  },
  previewFooter: {
    padding: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  previewPublishBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
  },
  previewPublishText: {
    color: Colors.white,
    fontWeight: Typography.bold,
    fontSize: Typography.label,
  },
});
