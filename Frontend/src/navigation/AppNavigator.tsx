import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  WelcomeScreen,
  RoleSelectionScreen,
  InstitutionSelectionScreen,
  EmailAuthenticationScreen,
  ProfileSetupScreen,
  CampusSelectionScreen,
  ProductDetailsScreen,
  SearchResultsScreen,
  CheckoutScreen,
  OrderDetailsScreen,
  ChatListScreen,
  ChatScreen,
  SellerProfileScreen,
  MyListingsScreen,
  EditListingScreen,
  WishlistScreen,
  EditProfileScreen,
  NotificationsScreen,
  SettingsScreen,
  ReportListingScreen,
  HelpSafetyScreen,
} from '../screens';
import { MainTabNavigator } from './MainTabNavigator';
import { RootStackParamList } from '../types';
import { Colors } from '../constants';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Root Application Navigator
 *
 * Flow:
 *   Onboarding: RoleSelection → InstitutionSelection → EmailAuthentication → ProfileSetup
 *   Main App: MainTabs (Home, Explore, Sell, Orders, Profile)
 *   Sub-flows: ProductDetails, Checkout, OrderDetails, Chat, etc.
 */
export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
          animation: 'slide_from_right',
        }}
      >
        {/* Welcome Opening Screen */}
        <Stack.Screen name="Welcome" component={WelcomeScreen} />

        {/* Onboarding screens */}
        <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
        <Stack.Screen name="InstitutionSelection" component={InstitutionSelectionScreen} />
        <Stack.Screen name="EmailAuthentication" component={EmailAuthenticationScreen} />
        <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
        <Stack.Screen name="CampusSelection" component={CampusSelectionScreen} />

        {/* 5-Tab Marketplace Hub */}
        <Stack.Screen name="MainTabs" component={MainTabNavigator} />

        {/* Secondary Marketplace Screens */}
        <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
        <Stack.Screen name="SearchResults" component={SearchResultsScreen} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
        <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
        <Stack.Screen name="ChatList" component={ChatListScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="SellerProfile" component={SellerProfileScreen} />
        <Stack.Screen name="MyListings" component={MyListingsScreen} />
        <Stack.Screen name="EditListing" component={EditListingScreen} />
        <Stack.Screen name="Wishlist" component={WishlistScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="ReportListing" component={ReportListingScreen} />
        <Stack.Screen name="HelpSafety" component={HelpSafetyScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
