export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
  children?: NavItem[];
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export interface StaffMember {
  id: string;
  name: string;
  title: string;
  bio: string | null;
  photoUrl: string | null;
  section: 'directors' | 'division_heads' | 'founders';
  sortOrder: number;
  isActive: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: string;
  categoryId: string | null;
  images: string[];
  isActive: boolean;
  requiresShipping: boolean;
  externalUrl: string | null;
  category?: Category;
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  sku: string | null;
  stock: number;
  isActive: boolean;
  sortOrder: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
}

export interface CartItem {
  productId: string;
  variantId?: string;
  name: string;
  variantName?: string;
  price: number;
  quantity: number;
  image?: string;
}
