import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  Product,
  Order,
  Conversation,
  Message,
  AppNotification,
  Review,
  Report,
  UserProfile,
  CampusScopeFilter,
  OrderStatus,
  PaymentStatus,
  Role,
} from '../types';
import {
  SEED_PRODUCTS,
  SEED_ORDERS,
  SEED_CONVERSATIONS,
  SEED_MESSAGES,
  SEED_NOTIFICATIONS,
  SEED_REVIEWS,
} from '../data';
import { storageService } from '../services/storageService';

const STORAGE_KEYS = {
  USER_PROFILE: 'CM_USER_PROFILE',
  PRODUCTS: 'CM_PRODUCTS',
  WISHLIST: 'CM_WISHLIST',
  ORDERS: 'CM_ORDERS',
  CONVERSATIONS: 'CM_CONVERSATIONS',
  MESSAGES: 'CM_MESSAGES',
  NOTIFICATIONS: 'CM_NOTIFICATIONS',
  REVIEWS: 'CM_REVIEWS',
  REPORTS: 'CM_REPORTS',
  CAMPUS_SCOPE: 'CM_CAMPUS_SCOPE',
};

const DEFAULT_USER: UserProfile = {
  id: 'current_user',
  name: 'Harshit Singh',
  email: 'harshit.singh@rvce.edu.in',
  role: 'STUDENT',
  institutionId: '1rv',
  institutionName: 'R V College of Engineering, Bangalore',
  department: 'Computer Science & Engineering',
  academicYear: '3rd Year / 6th Sem',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  memberSince: 'August 2024',
};

interface MarketplaceContextType {
  isLoaded: boolean;
  userProfile: UserProfile;
  setUserProfile: (profile: Partial<UserProfile>) => void;
  initializeUserFromOnboarding: (role: Role, institutionId: string, institutionName: string, name?: string, dept?: string, year?: string) => void;
  campusScope: CampusScopeFilter;
  setCampusScope: (scope: CampusScopeFilter) => void;
  products: Product[];
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => Product;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  orders: Order[];
  addOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, paymentStatus?: PaymentStatus) => void;
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  sendMessage: (conversationId: string, text: string) => void;
  getOrCreateConversation: (product: Product) => Conversation;
  notifications: AppNotification[];
  unreadNotificationCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => void;
  reports: Report[];
  submitReport: (report: Omit<Report, 'id' | 'createdAt' | 'status'>) => void;
  resetDemoData: () => Promise<void>;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [userProfile, setUserProfileState] = useState<UserProfile>(DEFAULT_USER);
  const [campusScope, setCampusScopeState] = useState<CampusScopeFilter>('MY_CAMPUS');
  const [products, setProducts] = useState<Product[]>(SEED_PRODUCTS);
  const [wishlist, setWishlist] = useState<string[]>(['prod_1', 'prod_4']);
  const [orders, setOrders] = useState<Order[]>(SEED_ORDERS);
  const [conversations, setConversations] = useState<Conversation[]>(SEED_CONVERSATIONS);
  const [messages, setMessages] = useState<Record<string, Message[]>>(SEED_MESSAGES);
  const [notifications, setNotifications] = useState<AppNotification[]>(SEED_NOTIFICATIONS);
  const [reviews, setReviews] = useState<Review[]>(SEED_REVIEWS);
  const [reports, setReports] = useState<Report[]>([]);

  // Load from local storage on startup
  useEffect(() => {
    const loadSavedState = async () => {
      try {
        const [
          savedProfile,
          savedProducts,
          savedWishlist,
          savedOrders,
          savedConversations,
          savedMessages,
          savedNotifications,
          savedReviews,
          savedReports,
          savedScope,
        ] = await Promise.all([
          storageService.getItem<UserProfile>(STORAGE_KEYS.USER_PROFILE),
          storageService.getItem<Product[]>(STORAGE_KEYS.PRODUCTS),
          storageService.getItem<string[]>(STORAGE_KEYS.WISHLIST),
          storageService.getItem<Order[]>(STORAGE_KEYS.ORDERS),
          storageService.getItem<Conversation[]>(STORAGE_KEYS.CONVERSATIONS),
          storageService.getItem<Record<string, Message[]>>(STORAGE_KEYS.MESSAGES),
          storageService.getItem<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS),
          storageService.getItem<Review[]>(STORAGE_KEYS.REVIEWS),
          storageService.getItem<Report[]>(STORAGE_KEYS.REPORTS),
          storageService.getItem<CampusScopeFilter>(STORAGE_KEYS.CAMPUS_SCOPE),
        ]);

        if (savedProfile) setUserProfileState(savedProfile);
        if (savedProducts) setProducts(savedProducts);
        if (savedWishlist) setWishlist(savedWishlist);
        if (savedOrders) setOrders(savedOrders);
        if (savedConversations) setConversations(savedConversations);
        if (savedMessages) setMessages(savedMessages);
        if (savedNotifications) setNotifications(savedNotifications);
        if (savedReviews) setReviews(savedReviews);
        if (savedReports) setReports(savedReports);
        if (savedScope) setCampusScopeState(savedScope);
      } catch {
        // Fallback to initial seeds
      } finally {
        setIsLoaded(true);
      }
    };

    loadSavedState();
  }, []);

  // Update profile
  const setUserProfile = useCallback((partial: Partial<UserProfile>) => {
    setUserProfileState((prev) => {
      const updated = { ...prev, ...partial };
      storageService.setItem(STORAGE_KEYS.USER_PROFILE, updated);
      return updated;
    });
  }, []);

  const initializeUserFromOnboarding = useCallback(
    (role: Role, institutionId: string, institutionName: string, name?: string, dept?: string, year?: string) => {
      setUserProfileState((prev) => {
        const updated: UserProfile = {
          ...prev,
          role,
          institutionId,
          institutionName,
          name: name && name.trim() ? name.trim() : prev.name,
          department: dept && dept.trim() ? dept.trim() : prev.department,
          academicYear: year && year.trim() ? year.trim() : prev.academicYear,
        };
        storageService.setItem(STORAGE_KEYS.USER_PROFILE, updated);
        return updated;
      });
    },
    []
  );

  const setCampusScope = useCallback((scope: CampusScopeFilter) => {
    setCampusScopeState(scope);
    storageService.setItem(STORAGE_KEYS.CAMPUS_SCOPE, scope);
  }, []);

  // Wishlist toggle
  const toggleWishlist = useCallback((productId: string) => {
    setWishlist((prev) => {
      const next = prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId];
      storageService.setItem(STORAGE_KEYS.WISHLIST, next);
      return next;
    });
  }, []);

  const isWishlisted = useCallback((productId: string) => wishlist.includes(productId), [wishlist]);

  // Product management
  const addProduct = useCallback(
    (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
      const newProduct: Product = {
        ...productData,
        id: `prod_${Date.now()}`,
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setProducts((prev) => {
        const next = [newProduct, ...prev];
        storageService.setItem(STORAGE_KEYS.PRODUCTS, next);
        return next;
      });

      // Local notification
      const notif: AppNotification = {
        id: `notif_${Date.now()}`,
        type: 'LISTING_PUBLISHED',
        title: 'Listing Published',
        message: `Your item "${newProduct.title}" is now visible to campus buyers.`,
        timestamp: new Date().toISOString(),
        read: false,
        targetScreen: 'ProductDetails',
        targetId: newProduct.id,
      };
      setNotifications((prev) => {
        const nextNotifs = [notif, ...prev];
        storageService.setItem(STORAGE_KEYS.NOTIFICATIONS, nextNotifs);
        return nextNotifs;
      });

      return newProduct;
    },
    []
  );

  const updateProduct = useCallback((productId: string, updates: Partial<Product>) => {
    setProducts((prev) => {
      const next = prev.map((p) =>
        p.id === productId ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
      );
      storageService.setItem(STORAGE_KEYS.PRODUCTS, next);
      return next;
    });
  }, []);

  const deleteProduct = useCallback((productId: string) => {
    setProducts((prev) => {
      const next = prev.filter((p) => p.id !== productId);
      storageService.setItem(STORAGE_KEYS.PRODUCTS, next);
      return next;
    });
    setWishlist((prev) => {
      const next = prev.filter((id) => id !== productId);
      storageService.setItem(STORAGE_KEYS.WISHLIST, next);
      return next;
    });
  }, []);

  // Order management
  const addOrder = useCallback((orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `ord_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setOrders((prev) => {
      const next = [newOrder, ...prev];
      storageService.setItem(STORAGE_KEYS.ORDERS, next);
      return next;
    });

    // Mark listing status as RESERVED
    setProducts((prev) => {
      const next = prev.map((p) => (p.id === newOrder.listingId ? { ...p, status: 'RESERVED' as const } : p));
      storageService.setItem(STORAGE_KEYS.PRODUCTS, next);
      return next;
    });

    // Notify user
    const notif: AppNotification = {
      id: `notif_${Date.now()}`,
      type: 'ORDER_UPDATE',
      title: 'Order Placed (Demo)',
      message: `Your demo order #${newOrder.id.slice(-6)} for "${newOrder.productSnapshot.title}" is placed.`,
      timestamp: new Date().toISOString(),
      read: false,
      targetScreen: 'OrderDetails',
      targetId: newOrder.id,
    };
    setNotifications((prev) => {
      const next = [notif, ...prev];
      storageService.setItem(STORAGE_KEYS.NOTIFICATIONS, next);
      return next;
    });

    return newOrder;
  }, []);

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus, paymentStatus?: PaymentStatus) => {
    setOrders((prev) => {
      const next = prev.map((ord) => {
        if (ord.id !== orderId) return ord;
        return {
          ...ord,
          orderStatus: status,
          paymentStatus: paymentStatus ?? ord.paymentStatus,
          updatedAt: new Date().toISOString(),
        };
      });
      storageService.setItem(STORAGE_KEYS.ORDERS, next);
      return next;
    });

    // If cancelled, make product ACTIVE again; if completed, make SOLD
    const foundOrder = orders.find((o) => o.id === orderId);
    if (foundOrder) {
      if (status === 'CANCELLED') {
        setProducts((prev) => {
          const next = prev.map((p) => (p.id === foundOrder.listingId ? { ...p, status: 'ACTIVE' as const } : p));
          storageService.setItem(STORAGE_KEYS.PRODUCTS, next);
          return next;
        });
      } else if (status === 'COMPLETED') {
        setProducts((prev) => {
          const next = prev.map((p) => (p.id === foundOrder.listingId ? { ...p, status: 'SOLD' as const } : p));
          storageService.setItem(STORAGE_KEYS.PRODUCTS, next);
          return next;
        });
      }
    }
  }, [orders]);

  // Chat management
  const sendMessage = useCallback((conversationId: string, text: string) => {
    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      conversationId,
      senderId: 'current_user',
      senderName: 'You',
      text,
      timestamp: new Date().toISOString(),
      read: true,
    };

    setMessages((prev) => {
      const currentList = prev[conversationId] || [];
      const next = { ...prev, [conversationId]: [...currentList, newMsg] };
      storageService.setItem(STORAGE_KEYS.MESSAGES, next);
      return next;
    });

    setConversations((prev) => {
      const next = prev.map((c) => {
        if (c.id !== conversationId) return c;
        return {
          ...c,
          lastMessage: text,
          lastMessageTimestamp: newMsg.timestamp,
        };
      });
      storageService.setItem(STORAGE_KEYS.CONVERSATIONS, next);
      return next;
    });
  }, []);

  const getOrCreateConversation = useCallback(
    (product: Product): Conversation => {
      const existing = conversations.find(
        (c) => c.listingId === product.id && (c.participant2Id === product.sellerId || c.participant1Id === product.sellerId)
      );
      if (existing) return existing;

      const newConv: Conversation = {
        id: `conv_${Date.now()}`,
        listingId: product.id,
        listingTitle: product.title,
        listingPrice: product.price,
        listingImage: product.images[0] || '',
        participant1Id: 'current_user',
        participant1Name: userProfile.name,
        participant2Id: product.sellerId,
        participant2Name: product.sellerName,
        lastMessage: `Started inquiry for ${product.title}`,
        lastMessageTimestamp: new Date().toISOString(),
        unreadCount: 0,
      };

      setConversations((prev) => {
        const next = [newConv, ...prev];
        storageService.setItem(STORAGE_KEYS.CONVERSATIONS, next);
        return next;
      });

      return newConv;
    },
    [conversations, userProfile.name]
  );

  // Notifications
  const unreadNotificationCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications((prev) => {
      const next = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      storageService.setItem(STORAGE_KEYS.NOTIFICATIONS, next);
      return next;
    });
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications((prev) => {
      const next = prev.map((n) => ({ ...n, read: true }));
      storageService.setItem(STORAGE_KEYS.NOTIFICATIONS, next);
      return next;
    });
  }, []);

  // Reviews
  const addReview = useCallback((reviewData: Omit<Review, 'id' | 'createdAt'>) => {
    const newReview: Review = {
      ...reviewData,
      id: `rev_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setReviews((prev) => {
      const next = [newReview, ...prev];
      storageService.setItem(STORAGE_KEYS.REVIEWS, next);
      return next;
    });
  }, []);

  // Reports
  const submitReport = useCallback((reportData: Omit<Report, 'id' | 'createdAt' | 'status'>) => {
    const newReport: Report = {
      ...reportData,
      id: `rep_${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'RECEIVED',
    };
    setReports((prev) => {
      const next = [newReport, ...prev];
      storageService.setItem(STORAGE_KEYS.REPORTS, next);
      return next;
    });
  }, []);

  // Reset Demo Session safely
  const resetDemoData = useCallback(async () => {
    await storageService.clear();
    setUserProfileState(DEFAULT_USER);
    setCampusScopeState('MY_CAMPUS');
    setProducts(SEED_PRODUCTS);
    setWishlist(['prod_1', 'prod_4']);
    setOrders(SEED_ORDERS);
    setConversations(SEED_CONVERSATIONS);
    setMessages(SEED_MESSAGES);
    setNotifications(SEED_NOTIFICATIONS);
    setReviews(SEED_REVIEWS);
    setReports([]);
  }, []);

  const value = useMemo(
    () => ({
      isLoaded,
      userProfile,
      setUserProfile,
      initializeUserFromOnboarding,
      campusScope,
      setCampusScope,
      products,
      wishlist,
      toggleWishlist,
      isWishlisted,
      addProduct,
      updateProduct,
      deleteProduct,
      orders,
      addOrder,
      updateOrderStatus,
      conversations,
      messages,
      sendMessage,
      getOrCreateConversation,
      notifications,
      unreadNotificationCount,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      reviews,
      addReview,
      reports,
      submitReport,
      resetDemoData,
    }),
    [
      isLoaded,
      userProfile,
      setUserProfile,
      initializeUserFromOnboarding,
      campusScope,
      setCampusScope,
      products,
      wishlist,
      toggleWishlist,
      isWishlisted,
      addProduct,
      updateProduct,
      deleteProduct,
      orders,
      addOrder,
      updateOrderStatus,
      conversations,
      messages,
      sendMessage,
      getOrCreateConversation,
      notifications,
      unreadNotificationCount,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      reviews,
      addReview,
      reports,
      submitReport,
      resetDemoData,
    ]
  );

  return <MarketplaceContext.Provider value={value}>{children}</MarketplaceContext.Provider>;
};

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
};
