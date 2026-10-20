import { Role } from './roles';

/**
 * Main bottom tab navigator param list.
 */
export type MainTabParamList = {
  HomeTab: undefined;
  ExploreTab: { categoryId?: string; query?: string } | undefined;
  SellTab: { editProductId?: string } | undefined;
  OrdersTab: { initialTab?: 'buying' | 'selling' } | undefined;
  ProfileTab: undefined;
};

/**
 * Root stack navigator param list.
 * Covers both onboarding and modal/sub-flow screens.
 */
export type RootStackParamList = {
  // Opening & Onboarding screens
  Welcome: undefined;
  RoleSelection: undefined;
  CampusSelection?: { selectedRole: Role };
  InstitutionSelection: { selectedRole: Role };
  EmailAuthentication: {
    selectedRole: Role;
    institutionId: string;
    institutionName?: string;
  };
  ProfileSetup: {
    selectedRole: Role;
    institutionId: string;
    institutionName?: string;
  };

  // Main application tabs
  MainTabs: undefined;

  // Secondary stack & modal screens
  ProductDetails: { productId: string };
  SearchResults: { initialQuery?: string; categoryId?: string };
  Checkout: { productId: string };
  OrderDetails: { orderId: string };
  Chat: {
    conversationId?: string;
    productId?: string;
    sellerId?: string;
    sellerName?: string;
  };
  ChatList: undefined;
  SellerProfile: { sellerId: string };
  ReportListing: { productId: string; productTitle: string };
  EditListing: { productId: string };
  MyListings: undefined;
  Wishlist: undefined;
  EditProfile: undefined;
  Notifications: undefined;
  Settings: undefined;
  HelpSafety: undefined;
};
