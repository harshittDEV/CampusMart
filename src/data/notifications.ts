import { AppNotification } from '../types';

export const SEED_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_1',
    type: 'ORDER_UPDATE',
    title: 'Order Confirmed',
    message: 'Aarav Patel confirmed your order for Casio FX-991EX Classwiz.',
    timestamp: '2026-10-18T16:50:00Z',
    read: false,
    targetScreen: 'OrderDetails',
    targetId: 'ord_101',
  },
  {
    id: 'notif_2',
    type: 'NEW_MESSAGE',
    title: 'New message from Aarav Patel',
    message: 'Sure! I have class until 4 PM. Can we meet near the library after that?',
    timestamp: '2026-10-18T16:45:00Z',
    read: false,
    targetScreen: 'Chat',
    targetId: 'conv_1',
  },
  {
    id: 'notif_3',
    type: 'ORDER_UPDATE',
    title: 'New Order Received',
    message: 'Rohit Kulkarni placed an order for your Prestige 1.5L Electric Kettle.',
    timestamp: '2026-10-18T16:00:00Z',
    read: true,
    targetScreen: 'OrderDetails',
    targetId: 'ord_102',
  },
  {
    id: 'notif_4',
    type: 'SYSTEM',
    title: 'Welcome to CampusMart!',
    message: 'Your campus identity is ready. Browse listings from your college or discover verified student gear across India.',
    timestamp: '2026-10-17T08:00:00Z',
    read: true,
  },
];
