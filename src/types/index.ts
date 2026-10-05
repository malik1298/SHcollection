export type ProductAvailability = 'in_stock' | 'pre_order' | 'made_to_order' | 'out_of_stock';

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string; // category slug or name
  description: string;
  price: number; // original/base price
  saleEnabled: boolean;
  salePercentage: number;
  salePrice: number; // calculated: price * (1 - salePercentage / 100) or override
  sizes: string[];
  colors: ProductColor[];
  stock: number;
  availability: ProductAvailability;
  featured: boolean;
  newArrival: boolean;
  isSale: boolean;
  published: boolean;
  images: string[];
  videos: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  count?: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  sku: string;
  price: number;
  originalPrice: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  grandTotal: number;
  currency: string;
  currencySymbol: string;
  status: OrderStatus;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export interface SocialLinks {
  instagram: string;
  facebook: string;
  tiktok: string;
  pinterest: string;
  whatsapp?: string;
}

export interface OrderSlipSettings {
  showLogo: boolean;
  showWebsiteName: boolean;
  showCustomerName: boolean;
  showPhone: boolean;
  showEmail: boolean;
  showAddress: boolean;
  showOrderNumber: boolean;
  showDate: boolean;
  showProducts: boolean;
  showQuantity: boolean;
  showPrices: boolean;
  showDiscount: boolean;
  showShipping: boolean;
  showTotal: boolean;
  showNotes: boolean;
  showWhatsapp: boolean;
  showEmailContact: boolean;
  showFooterText: boolean;
  headerNote: string;
  footerNote: string;
}

export interface WebsiteSettings {
  websiteName: string;
  tagline: string;
  businessType: string;
  logoText: string;
  logoImage: string; // URL or base64
  favicon: string;
  description: string;
  heroImage: string; // URL or base64
  heroTitle: string;
  heroSubtitle: string;
  heroButtonText: string;
  heroSaleButtonText: string;
  primaryColor: string;
  secondaryColor: string;
  currencyName: string;
  currencySymbol: string;
  currencyPosition: 'prefix' | 'suffix';
  whatsappNumber: string;
  whatsappDefaultMessage: string;
  phone: string;
  email: string;
  address: string;
  businessHours: string;
  socialLinks: SocialLinks;
  footerText: string;
  orderSlip: OrderSlipSettings;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  salt: string;
  role: 'super_admin' | 'admin';
  updatedAt: string;
}

export interface FilterOptions {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  saleOnly?: boolean;
  newOnly?: boolean;
  featuredOnly?: boolean;
  size?: string;
  color?: string;
  availability?: string;
  search?: string;
  sortBy?: 'price-asc' | 'price-desc' | 'newest' | 'popular' | 'sale-discount';
}

export interface CartItem {
  id: string; // unique item id (productId + size + color)
  productId: string;
  product: Product;
  quantity: number;
  size: string;
  color: string;
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  address?: string;
  createdAt: string;
}

