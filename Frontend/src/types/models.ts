import { Role } from './roles';

export type UserRole = Role | `${Role}`;

export type ProductCondition = 'NEW' | 'LIKE_NEW' | 'GOOD' | 'FAIR' | 'NEEDS_REPAIR';

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  description: string;
  color?: string;
}

export type ListingStatus = 'ACTIVE' | 'RESERVED' | 'SOLD' | 'ARCHIVED';

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  categoryId: string;
  condition: ProductCondition;
  negotiable: boolean;
  images: string[];
  sellerId: string;
  sellerName: string;
  sellerRole: UserRole;
  sellerInstitutionId: string;
  sellerInstitutionName: string;
  sellerAvatar?: string;
  pickupLocation: string;
  status: ListingStatus;
  createdAt: string;
  updatedAt: string;
  savesCount?: number;
}

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'READY_FOR_PICKUP'
  | 'COMPLETED'
  | 'CANCELLED';

export type PaymentStatus =
  | 'NOT_REQUIRED'
  | 'PENDING'
  | 'PAID_DEMO'
  | 'FAILED_DEMO'
  | 'REFUNDED_PLACEHOLDER';

export type PaymentMethod = 'ONLINE_DEMO' | 'PICKUP_DEMO';

export interface Order {
  id: string;
  listingId: string;
  productSnapshot: {
    id: string;
    title: string;
    price: number;
    image: string;
    categoryId: string;
    condition: ProductCondition;
  };
  buyerId: string;
  buyerName: string;
  buyerRole: UserRole;
  buyerInstitutionId: string;
  buyerInstitutionName: string;
  sellerId: string;
  sellerName: string;
  sellerRole: UserRole;
  sellerInstitutionId: string;
  sellerInstitutionName: string;
  amount: number;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  pickupNote?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  listingId: string;
  listingTitle: string;
  listingPrice: number;
  listingImage: string;
  participant1Id: string;
  participant1Name: string;
  participant2Id: string;
  participant2Name: string;
  lastMessage: string;
  lastMessageTimestamp: string;
  unreadCount: number;
}

export type NotificationType =
  | 'ORDER_UPDATE'
  | 'NEW_MESSAGE'
  | 'LISTING_SOLD'
  | 'LISTING_PUBLISHED'
  | 'SYSTEM';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  targetScreen?: string;
  targetId?: string;
}

export interface Review {
  id: string;
  orderId: string;
  listingId: string;
  reviewerId: string;
  reviewerName: string;
  reviewerInstitution: string;
  sellerId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export type ReportReason =
  | 'SUSPICIOUS_OR_FRAUDULENT'
  | 'INCORRECT_PRODUCT_INFO'
  | 'PROHIBITED_ITEM'
  | 'INAPPROPRIATE_CONTENT'
  | 'SUSPECTED_SCAM'
  | 'OTHER';

export interface Report {
  id: string;
  listingId: string;
  listingTitle: string;
  reporterId: string;
  reason: ReportReason;
  description?: string;
  createdAt: string;
  status: 'RECEIVED' | 'IN_REVIEW';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  institutionId: string;
  institutionName: string;
  department?: string;
  academicYear?: string;
  avatar?: string;
  memberSince: string;
  phone?: string;
}

export type CampusScopeFilter = 'MY_CAMPUS' | 'OTHER_CAMPUSES' | 'ALL_CAMPUSES';
