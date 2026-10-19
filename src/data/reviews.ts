import { Review } from '../types';

export const SEED_REVIEWS: Review[] = [
  {
    id: 'rev_1',
    orderId: 'seed_ord_1',
    listingId: 'prod_1',
    reviewerId: 'user_priya',
    reviewerName: 'Priya Nair',
    reviewerInstitution: 'R V College of Engineering, Bangalore',
    sellerId: 'user_aarav',
    rating: 5,
    comment: 'Punctual meetup near the canteen. The calculator works flawlessly and was just as described!',
    createdAt: '2026-10-10T14:00:00Z',
  },
  {
    id: 'rev_2',
    orderId: 'seed_ord_2',
    listingId: 'prod_2',
    reviewerId: 'user_manish',
    reviewerName: 'Manish Verma',
    reviewerInstitution: 'B M S College of Engineering, Bangalore',
    sellerId: 'user_kavya',
    rating: 4.8,
    comment: 'Super smooth transaction. Cycle was well-oiled and clean. Highly recommended seller on campus!',
    createdAt: '2026-10-12T17:30:00Z',
  },
];
