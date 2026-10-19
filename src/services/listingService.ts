import { Product, CampusScopeFilter } from '../types';
import { SEED_PRODUCTS } from '../data/products';

export const listingService = {
  getAll(): Product[] {
    return SEED_PRODUCTS;
  },

  getById(id: string, productList: Product[] = SEED_PRODUCTS): Product | undefined {
    return productList.find((p) => p.id === id);
  },

  filterByCampus(
    products: Product[],
    userCampusId: string,
    scope: CampusScopeFilter
  ): Product[] {
    if (scope === 'MY_CAMPUS') {
      return products.filter((p) => p.sellerInstitutionId === userCampusId);
    }
    if (scope === 'OTHER_CAMPUSES') {
      return products.filter((p) => p.sellerInstitutionId !== userCampusId);
    }
    return products;
  },

  search(
    products: Product[],
    query: string,
    filters?: {
      categoryId?: string;
      condition?: string;
      minPrice?: number;
      maxPrice?: number;
      sortBy?: 'recommended' | 'recent' | 'price_low' | 'price_high';
    }
  ): Product[] {
    let result = [...products];

    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.sellerInstitutionName.toLowerCase().includes(q) ||
          p.sellerName.toLowerCase().includes(q)
      );
    }

    if (filters?.categoryId) {
      result = result.filter((p) => p.categoryId === filters.categoryId);
    }

    if (filters?.condition) {
      result = result.filter((p) => p.condition === filters.condition);
    }

    if (filters?.minPrice !== undefined) {
      result = result.filter((p) => p.price >= (filters.minPrice ?? 0));
    }

    if (filters?.maxPrice !== undefined) {
      result = result.filter((p) => p.price <= (filters.maxPrice ?? Infinity));
    }

    if (filters?.sortBy === 'recent') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (filters?.sortBy === 'price_low') {
      result.sort((a, b) => a.price - b.price);
    } else if (filters?.sortBy === 'price_high') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  },
};
