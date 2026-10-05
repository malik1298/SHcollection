import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { Product, Category, Order, WebsiteSettings, AdminUser } from '../src/types/index.js';

function getDatabasePaths() {
  const localDir = path.resolve(process.cwd(), 'data');
  const localFile = path.join(localDir, 'store.json');

  const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
  const tmpDir = path.join('/tmp', 'sh-collection-data');
  const tmpFile = path.join(tmpDir, 'store.json');

  return {
    isServerless,
    localDir,
    localFile,
    tmpDir,
    tmpFile,
  };
}

export interface CustomerAccount {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  salt: string;
  role: 'customer';
  phone?: string;
  createdAt: string;
}

export interface DatabaseSchema {
  admin: AdminUser;
  settings: WebsiteSettings;
  categories: Category[];
  products: Product[];
  orders: Order[];
  customers?: CustomerAccount[];
}

export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const generatedSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, generatedSalt, 10000, 64, 'sha512').toString('hex');
  return { hash, salt: generatedSalt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const checkHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return checkHash === hash;
}

const defaultAdminCreds = hashPassword('Furqan123');

const defaultSettings: WebsiteSettings = {
  websiteName: 'SH Collection',
  tagline: 'Haute Couture & Luxury Bridal Formals',
  businessType: 'Ladies Bridal & Luxury Formal Dresses',
  logoText: 'SH Collection',
  logoImage: '',
  favicon: '',
  description: 'SH Collection is a luxury bridal and haute couture atelier showcasing exquisite hand-embroidered gowns, traditional lehngas, and bespoke formal wear.',
  heroImage: 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=1920&q=85',
  heroTitle: 'Regal Elegance for Your Special Day',
  heroSubtitle: 'Discover handcrafted bridal couture, zardozi masterworks, and ethereal silhouettes meticulously tailored to make your wedding unforgettable.',
  heroButtonText: 'Explore Bridal Collection',
  heroSaleButtonText: 'View Festive Sale',
  primaryColor: '#722F37',
  secondaryColor: '#D4AF37',
  currencyName: 'PKR',
  currencySymbol: 'Rs.',
  currencyPosition: 'prefix',
  whatsappNumber: '+92 300 1234567',
  whatsappDefaultMessage: 'Hello SH Collection! I am interested in inquiring about bridal and luxury formal outfits.',
  phone: '+92 300 1234567',
  email: 'contact@shcollection.com',
  address: 'Flagship Bridal Studio, MM Alam Road, Gulberg III, Lahore, Pakistan',
  businessHours: 'Mon - Sat: 11:00 AM - 9:00 PM (Appointments Preferred)',
  socialLinks: {
    instagram: 'https://instagram.com/shcollection',
    facebook: 'https://facebook.com/shcollection',
    tiktok: 'https://tiktok.com/@shcollection',
    pinterest: 'https://pinterest.com/shcollection',
  },
  footerText: 'SH Collection is a premier luxury fashion atelier celebrating heritage craftsmanship, delicate embroideries, and majestic bridal silhouettes.',
  orderSlip: {
    showLogo: true,
    showWebsiteName: true,
    showCustomerName: true,
    showPhone: true,
    showEmail: true,
    showAddress: true,
    showOrderNumber: true,
    showDate: true,
    showProducts: true,
    showQuantity: true,
    showPrices: true,
    showDiscount: true,
    showShipping: true,
    showTotal: true,
    showNotes: true,
    showWhatsapp: true,
    showEmailContact: true,
    showFooterText: true,
    headerNote: 'OFFICIAL BRIDAL ORDER INVOICE & SPECIFICATION SLIP',
    footerNote: 'Thank you for choosing SH Collection. Each bridal piece is tailored with hand-embroidered artisanal care. For custom fittings or alterations, please contact our concierge via WhatsApp.',
  },
};

const defaultCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'Bridal Couture',
    slug: 'bridal-couture',
    description: 'Bespoke Barat & Walima royal ensembles, majestic lehngas, and regal farshi ghararas.',
    image: 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'cat-2',
    name: 'Luxury Formals',
    slug: 'luxury-formals',
    description: 'Heavy hand-embellished pure raw silk, organza, and tissue formals for weddings and celebrations.',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'cat-3',
    name: 'Royal Velvet Edit',
    slug: 'royal-velvet-edit',
    description: 'Micro silk velvet shirts, shawls, and pishwas adorned with vintage dabka, tilla, and zardozi.',
    image: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'cat-4',
    name: 'Festive Pret',
    slug: 'festive-pret',
    description: 'Pret-a-porter luxury ensembles featuring intricate threadwork, cutwork, and organza dupattas.',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'cat-5',
    name: 'Semi-Formals',
    slug: 'semi-formals',
    description: 'Contemporary chic cuts, flared peplums, and sophisticated silhouette for intimate gatherings.',
    image: 'https://images.unsplash.com/photo-1518049362265-d5b2a6467637?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'cat-6',
    name: 'Bridal Accessories',
    slug: 'bridal-accessories',
    description: 'Handcrafted heirloom shawls, embellished potli bags, and embellished bridal veils.',
    image: 'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&w=800&q=80',
  },
];

const defaultProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Noor-e-Jahan Royal Crimson Barat Lehnga',
    sku: 'SH-BR-01',
    category: 'bridal-couture',
    description: 'A masterpiece bridal ensemble in deep crimson red pure raw silk. Features a majestic kalidar flared lehnga heavily embellished with marori, dabka, naqshi, real swarovski crystals, and fine resham floral jaal. Accompanied by a heavily bordered organza veil dupatta with four-sided matha patti.',
    price: 245000,
    saleEnabled: true,
    salePercentage: 15,
    salePrice: 208250,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'Custom Bridal Stitching'],
    colors: [
      { name: 'Crimson Wine', hex: '#6B1D2F' },
      { name: 'Deep Burgundy', hex: '#4A1521' },
      { name: 'Scarlet Gold', hex: '#8B0000' },
    ],
    stock: 7,
    availability: 'in_stock',
    featured: true,
    newArrival: true,
    isSale: true,
    published: true,
    images: [
      'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=900&q=85',
    ],
    videos: ['https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-luxurious-gown-41270-large.mp4'],
    createdAt: '2026-09-15T10:00:00Z',
    updatedAt: '2026-09-15T10:00:00Z',
  },
  {
    id: 'prod-2',
    name: 'Zahra Champagne Gold Tissue Bridal Gown',
    sku: 'SH-BR-02',
    category: 'bridal-couture',
    description: 'Grandeur reimagined in luminous champagne gold tissue and French net. Crafted with iridescent badla, hand-set micro pearls, sequins, and metallic tilla embroidery. The floor-length trailing gown is cinched with an embroidered waist belt and scalloped border dupatta.',
    price: 290000,
    saleEnabled: false,
    salePercentage: 0,
    salePrice: 290000,
    sizes: ['XS', 'S', 'M', 'L', 'Custom Bridal Stitching'],
    colors: [
      { name: 'Champagne Gold', hex: '#D4AF37' },
      { name: 'Soft Ivory', hex: '#FFF8DC' },
    ],
    stock: 5,
    availability: 'made_to_order',
    featured: true,
    newArrival: true,
    isSale: false,
    published: true,
    images: [
      'https://images.unsplash.com/photo-1518049362265-d5b2a6467637?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=900&q=85',
    ],
    videos: [],
    createdAt: '2026-09-18T12:00:00Z',
    updatedAt: '2026-09-18T12:00:00Z',
  },
  {
    id: 'prod-3',
    name: 'Mah-e-Nau Emerald Velvet Farshi Gharara',
    sku: 'SH-VE-01',
    category: 'royal-velvet-edit',
    description: 'Exquisite jewel-toned emerald green pure micro silk velvet kurti enriched with traditional zardozi, kora, and marori embroidery on neckline and hem. Paired with a billowing farshi gharara in gold banarsi brocade and a contrasting rust tissue embroidered dupatta.',
    price: 195000,
    saleEnabled: true,
    salePercentage: 20,
    salePrice: 156000,
    sizes: ['S', 'M', 'L', 'XL', 'Custom Bridal Stitching'],
    colors: [
      { name: 'Emerald Jewel', hex: '#0B5345' },
      { name: 'Midnight Wine', hex: '#4A1521' },
    ],
    stock: 8,
    availability: 'in_stock',
    featured: true,
    newArrival: false,
    isSale: true,
    published: true,
    images: [
      'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=85',
    ],
    videos: [],
    createdAt: '2026-09-20T14:30:00Z',
    updatedAt: '2026-09-20T14:30:00Z',
  },
  {
    id: 'prod-4',
    name: 'Rukhsar Rose Gold Handcrafted Walima Maxi',
    sku: 'SH-BR-03',
    category: 'bridal-couture',
    description: 'An ethereal blush and dusty rose bridal maxi adorned with antique silver zari, Swarovski cut beads, and 3D floral petals. Layered with shimmer chiffon lining and accompanied by an extended tulle veil featuring scalloped crystal tassels.',
    price: 260000,
    saleEnabled: true,
    salePercentage: 10,
    salePrice: 234000,
    sizes: ['XS', 'S', 'M', 'L', 'Custom Bridal Stitching'],
    colors: [
      { name: 'Blush Rose Gold', hex: '#B76E79' },
      { name: 'Dusty Peach', hex: '#FADBD8' },
    ],
    stock: 4,
    availability: 'in_stock',
    featured: true,
    newArrival: true,
    isSale: true,
    published: true,
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1518049362265-d5b2a6467637?auto=format&fit=crop&w=900&q=85',
    ],
    videos: [],
    createdAt: '2026-09-22T09:15:00Z',
    updatedAt: '2026-09-22T09:15:00Z',
  },
  {
    id: 'prod-5',
    name: 'Aria Ivory Pearl Organza Kalidar',
    sku: 'SH-LF-01',
    category: 'luxury-formals',
    description: 'An angelic ivory 16-kali pure silk organza anarkali featuring hand-cut resham applique, mother-of-pearl embellishments, and golden tilla jaali work. Paired with straight raw silk pants and a heavily sprayed kamdani dupatta.',
    price: 135000,
    saleEnabled: false,
    salePercentage: 0,
    salePrice: 135000,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Pearl Ivory', hex: '#FFFFF0' },
      { name: 'Alabaster White', hex: '#F8F9FA' },
    ],
    stock: 12,
    availability: 'in_stock',
    featured: false,
    newArrival: true,
    isSale: false,
    published: true,
    images: [
      'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=900&q=85',
    ],
    videos: [],
    createdAt: '2026-09-25T11:00:00Z',
    updatedAt: '2026-09-25T11:00:00Z',
  },
  {
    id: 'prod-6',
    name: 'Darakhshan Ruby Festive Silk Ensemble',
    sku: 'SH-FP-01',
    category: 'festive-pret',
    description: 'Vibrant ruby red pure raw silk straight long tunic with detailed hand-embroidered neckline, gota patti work, and delicate mirror highlights on sleeves. Paired with silk flared trousers and a printed tissue silk dupatta.',
    price: 75000,
    saleEnabled: true,
    salePercentage: 25,
    salePrice: 56250,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Ruby Wine', hex: '#9B111E' },
      { name: 'Plum Velvet', hex: '#4A154B' },
    ],
    stock: 15,
    availability: 'in_stock',
    featured: true,
    newArrival: false,
    isSale: true,
    published: true,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=85',
    ],
    videos: [],
    createdAt: '2026-09-28T16:00:00Z',
    updatedAt: '2026-09-28T16:00:00Z',
  },
  {
    id: 'prod-7',
    name: 'Sultana Antique Gold Velvet Peshwas',
    sku: 'SH-VE-02',
    category: 'royal-velvet-edit',
    description: 'Regal silhouette cut from pure midnight plum velvet, framed with antique bronze zardozi yoke, karchob borders, and mukesh sprayed chiffon dupatta. Perfectly tailored for winter weddings.',
    price: 185000,
    saleEnabled: true,
    salePercentage: 15,
    salePrice: 157250,
    sizes: ['S', 'M', 'L', 'XL', 'Custom Bridal Stitching'],
    colors: [
      { name: 'Midnight Plum', hex: '#3B1E32' },
      { name: 'Royal Crimson', hex: '#722F37' },
    ],
    stock: 6,
    availability: 'in_stock',
    featured: true,
    newArrival: true,
    isSale: true,
    published: true,
    images: [
      'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=900&q=85',
    ],
    videos: [],
    createdAt: '2026-09-30T10:00:00Z',
    updatedAt: '2026-09-30T10:00:00Z',
  },
  {
    id: 'prod-8',
    name: 'Mehrunissa Embellished Peplum & Sharara',
    sku: 'SH-SF-01',
    category: 'semi-formals',
    description: 'Modern bridal fusion outfit featuring a structured peplum top in pastel pistachio organza with pearl tassels, paired with a double-layered tiered crushed silk sharara and embroidered net dupatta.',
    price: 98000,
    saleEnabled: false,
    salePercentage: 0,
    salePrice: 98000,
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Pistachio Sage', hex: '#9CAF88' },
      { name: 'Blush Ice', hex: '#F0E6EF' },
    ],
    stock: 9,
    availability: 'in_stock',
    featured: false,
    newArrival: true,
    isSale: false,
    published: true,
    images: [
      'https://images.unsplash.com/photo-1518049362265-d5b2a6467637?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&w=900&q=85',
    ],
    videos: [],
    createdAt: '2026-10-01T08:00:00Z',
    updatedAt: '2026-10-01T08:00:00Z',
  },
  {
    id: 'prod-9',
    name: 'Heirloom Crimson Zardozi Velvet Shawl',
    sku: 'SH-AC-01',
    category: 'bridal-accessories',
    description: 'A collectible royal crimson micro silk velvet shawl enriched with 4-sided matha patti zardozi borders, intricate corner paisley paisleys, and delicate dabka tassels.',
    price: 85000,
    saleEnabled: true,
    salePercentage: 10,
    salePrice: 76500,
    sizes: ['One Size (2.75 Yards)'],
    colors: [
      { name: 'Royal Crimson', hex: '#722F37' },
      { name: 'Emerald Velvet', hex: '#0B5345' },
      { name: 'Midnight Black', hex: '#1C1C1C' },
    ],
    stock: 14,
    availability: 'in_stock',
    featured: true,
    newArrival: false,
    isSale: true,
    published: true,
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=900&q=85',
    ],
    videos: [],
    createdAt: '2026-10-02T14:00:00Z',
    updatedAt: '2026-10-02T14:00:00Z',
  },
];

const defaultOrders: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'SH-2026-1001',
    customerName: 'Ayesha Khan',
    phone: '+92 321 9876543',
    email: 'ayesha.khan@example.com',
    address: 'House 42-B, Sector F-7/2',
    city: 'Islamabad',
    province: 'Islamabad Capital Territory',
    postalCode: '44000',
    notes: 'Please ensure bridal stitching includes extra margin for alterations.',
    items: [
      {
        productId: 'prod-1',
        name: 'Noor-e-Jahan Royal Crimson Barat Lehnga',
        sku: 'SH-BR-01',
        price: 208250,
        originalPrice: 245000,
        quantity: 1,
        size: 'Custom Bridal Stitching',
        color: 'Crimson Wine',
        image: 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=300&q=80',
      },
    ],
    subtotal: 208250,
    discount: 36750,
    shipping: 0,
    grandTotal: 208250,
    currency: 'PKR',
    currencySymbol: 'Rs.',
    status: 'Confirmed',
    paymentMethod: 'Advance Bank Wire (50%) + Cash on Delivery',
    createdAt: '2026-10-03T11:20:00Z',
    updatedAt: '2026-10-03T15:45:00Z',
  },
  {
    id: 'ord-1002',
    orderNumber: 'SH-2026-1002',
    customerName: 'Zainab Fatima',
    phone: '+92 301 4567890',
    email: 'zainab.f@example.com',
    address: 'Apartment 704, Royal Towers, Clifton Block 4',
    city: 'Karachi',
    province: 'Sindh',
    postalCode: '75600',
    notes: 'Expedited shipping requested for upcoming wedding festivities.',
    items: [
      {
        productId: 'prod-3',
        name: 'Mah-e-Nau Emerald Velvet Farshi Gharara',
        sku: 'SH-VE-01',
        price: 156000,
        originalPrice: 195000,
        quantity: 1,
        size: 'M',
        color: 'Emerald Jewel',
        image: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=300&q=80',
      },
    ],
    subtotal: 156000,
    discount: 39000,
    shipping: 0,
    grandTotal: 156000,
    currency: 'PKR',
    currencySymbol: 'Rs.',
    status: 'Processing',
    paymentMethod: 'Cash on Delivery',
    createdAt: '2026-10-04T09:10:00Z',
    updatedAt: '2026-10-04T09:30:00Z',
  },
];

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    const { isServerless, localDir, localFile, tmpDir, tmpFile } = getDatabasePaths();

    try {
      let targetFile = localFile;

      if (isServerless && fs.existsSync(tmpFile)) {
        targetFile = tmpFile;
      } else if (!fs.existsSync(localFile) && fs.existsSync(tmpFile)) {
        targetFile = tmpFile;
      }

      if (fs.existsSync(targetFile)) {
        const raw = fs.readFileSync(targetFile, 'utf-8');
        const parsed = JSON.parse(raw) as DatabaseSchema;

        const loaded: DatabaseSchema = {
          admin: parsed.admin || {
            id: 'admin-1',
            email: 'shcollection@gmail.com',
            name: 'Furqan (SH Collection Admin)',
            passwordHash: defaultAdminCreds.hash,
            salt: defaultAdminCreds.salt,
            role: 'super_admin',
            updatedAt: new Date().toISOString(),
          },
          settings: { ...defaultSettings, ...(parsed.settings || {}) },
          categories: parsed.categories?.length ? parsed.categories : defaultCategories,
          products: parsed.products?.length ? parsed.products : defaultProducts,
          orders: parsed.orders || defaultOrders,
          customers: parsed.customers || [],
        };

        // In serverless, if reading from read-only bundle, prime the /tmp store
        if (isServerless && targetFile !== tmpFile) {
          try {
            if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
            fs.writeFileSync(tmpFile, JSON.stringify(loaded, null, 2), 'utf-8');
          } catch {
            // Ignore /tmp write failure
          }
        }

        return loaded;
      }
    } catch (err) {
      console.error('Error loading DB file, initializing defaults:', err);
    }

    const initial: DatabaseSchema = {
      admin: {
        id: 'admin-1',
        email: 'shcollection@gmail.com',
        name: 'Furqan (SH Collection Admin)',
        passwordHash: defaultAdminCreds.hash,
        salt: defaultAdminCreds.salt,
        role: 'super_admin',
        updatedAt: new Date().toISOString(),
      },
      settings: defaultSettings,
      categories: defaultCategories,
      products: defaultProducts,
      orders: defaultOrders,
      customers: [],
    };

    this.saveData(initial);
    return initial;
  }

  private saveData(data: DatabaseSchema): void {
    const { isServerless, localDir, localFile, tmpDir, tmpFile } = getDatabasePaths();
    this.data = data;

    const json = JSON.stringify(data, null, 2);

    if (isServerless) {
      try {
        if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
        fs.writeFileSync(tmpFile, json, 'utf-8');
        return;
      } catch (err) {
        console.warn('Failed writing to serverless tmp directory:', err);
      }
    }

    try {
      if (!fs.existsSync(localDir)) {
        fs.mkdirSync(localDir, { recursive: true });
      }
      fs.writeFileSync(localFile, json, 'utf-8');
    } catch (err: any) {
      // If filesystem is read-only (like in some cloud environments), fallback to /tmp
      try {
        if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
        fs.writeFileSync(tmpFile, json, 'utf-8');
      } catch {
        console.error('Failed to save DB to disk:', err?.message || err);
      }
    }
  }

  // --- Auth ---
  public getAdmin(): AdminUser {
    return this.data.admin;
  }

  public updateAdminPassword(newPasswordHash: string, newSalt: string): void {
    this.data.admin.passwordHash = newPasswordHash;
    this.data.admin.salt = newSalt;
    this.data.admin.updatedAt = new Date().toISOString();
    this.saveData(this.data);
  }

  // --- Settings ---
  public getSettings(): WebsiteSettings {
    return this.data.settings;
  }

  public updateSettings(partial: Partial<WebsiteSettings>): WebsiteSettings {
    this.data.settings = {
      ...this.data.settings,
      ...partial,
      orderSlip: {
        ...this.data.settings.orderSlip,
        ...(partial.orderSlip || {}),
      },
      socialLinks: {
        ...this.data.settings.socialLinks,
        ...(partial.socialLinks || {}),
      },
    };
    this.saveData(this.data);
    return this.data.settings;
  }

  // --- Categories ---
  public getCategories(): Category[] {
    // Dynamically compute product counts
    return this.data.categories.map((c) => ({
      ...c,
      count: this.data.products.filter((p) => p.category === c.slug && p.published).length,
    }));
  }

  public addCategory(cat: Omit<Category, 'id'>): Category {
    const newCat: Category = {
      ...cat,
      id: 'cat-' + Date.now(),
      slug: cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    };
    this.data.categories.push(newCat);
    this.saveData(this.data);
    return newCat;
  }

  public updateCategory(id: string, updates: Partial<Category>): Category | null {
    const idx = this.data.categories.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    this.data.categories[idx] = { ...this.data.categories[idx], ...updates };
    this.saveData(this.data);
    return this.data.categories[idx];
  }

  public deleteCategory(id: string): boolean {
    const initLen = this.data.categories.length;
    this.data.categories = this.data.categories.filter((c) => c.id !== id);
    if (this.data.categories.length !== initLen) {
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  // --- Products ---
  public getProducts(filter?: {
    category?: string;
    saleOnly?: boolean;
    featuredOnly?: boolean;
    newOnly?: boolean;
    publishedOnly?: boolean;
  }): Product[] {
    let list = [...this.data.products];
    if (filter?.publishedOnly) {
      list = list.filter((p) => p.published);
    }
    if (filter?.category) {
      list = list.filter((p) => p.category === filter.category);
    }
    if (filter?.saleOnly) {
      list = list.filter((p) => p.isSale || p.saleEnabled);
    }
    if (filter?.featuredOnly) {
      list = list.filter((p) => p.featured);
    }
    if (filter?.newOnly) {
      list = list.filter((p) => p.newArrival);
    }
    return list;
  }

  public getProductById(id: string): Product | null {
    return this.data.products.find((p) => p.id === id) || null;
  }

  public addProduct(prod: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product {
    const now = new Date().toISOString();
    // Auto-calculate sale price if sale enabled
    const salePrice = prod.saleEnabled && prod.salePercentage > 0
      ? Math.round(prod.price * (1 - prod.salePercentage / 100))
      : prod.price;

    const newProd: Product = {
      ...prod,
      id: 'prod-' + Date.now(),
      salePrice,
      isSale: prod.saleEnabled && prod.salePercentage > 0,
      createdAt: now,
      updatedAt: now,
    };
    this.data.products.unshift(newProd);
    this.saveData(this.data);
    return newProd;
  }

  public updateProduct(id: string, updates: Partial<Product>): Product | null {
    const idx = this.data.products.findIndex((p) => p.id === id);
    if (idx === -1) return null;

    const existing = this.data.products[idx];
    const updatedPrice = updates.price !== undefined ? updates.price : existing.price;
    const updatedSaleEnabled = updates.saleEnabled !== undefined ? updates.saleEnabled : existing.saleEnabled;
    const updatedSalePercentage = updates.salePercentage !== undefined ? updates.salePercentage : existing.salePercentage;

    let salePrice = existing.salePrice;
    if (updatedSaleEnabled && updatedSalePercentage > 0) {
      salePrice = Math.round(updatedPrice * (1 - updatedSalePercentage / 100));
    } else {
      salePrice = updatedPrice;
    }

    this.data.products[idx] = {
      ...existing,
      ...updates,
      price: updatedPrice,
      saleEnabled: updatedSaleEnabled,
      salePercentage: updatedSalePercentage,
      salePrice,
      isSale: updatedSaleEnabled && updatedSalePercentage > 0,
      updatedAt: new Date().toISOString(),
    };
    this.saveData(this.data);
    return this.data.products[idx];
  }

  public deleteProduct(id: string): boolean {
    const initLen = this.data.products.length;
    this.data.products = this.data.products.filter((p) => p.id !== id);
    if (this.data.products.length !== initLen) {
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  public duplicateProduct(id: string): Product | null {
    const orig = this.getProductById(id);
    if (!orig) return null;

    const now = new Date().toISOString();
    const duplicated: Product = {
      ...orig,
      id: 'prod-' + Date.now(),
      name: `${orig.name} (Copy)`,
      sku: `${orig.sku}-COPY-${Math.floor(Math.random() * 100)}`,
      createdAt: now,
      updatedAt: now,
    };

    this.data.products.unshift(duplicated);
    this.saveData(this.data);
    return duplicated;
  }

  // --- Orders ---
  public getOrders(): Order[] {
    return [...this.data.orders].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public getOrderById(id: string): Order | null {
    return this.data.orders.find((o) => o.id === id || o.orderNumber === id) || null;
  }

  public createOrder(orderInput: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Order {
    const now = new Date().toISOString();
    const orderNumber = `SH-${new Date().getFullYear()}-${1000 + this.data.orders.length + 1}`;
    const newOrder: Order = {
      ...orderInput,
      id: 'ord-' + Date.now(),
      orderNumber,
      createdAt: now,
      updatedAt: now,
    };
    this.data.orders.unshift(newOrder);
    this.saveData(this.data);
    return newOrder;
  }

  public updateOrderStatus(id: string, status: Order['status']): Order | null {
    const idx = this.data.orders.findIndex((o) => o.id === id || o.orderNumber === id);
    if (idx === -1) return null;
    this.data.orders[idx].status = status;
    this.data.orders[idx].updatedAt = new Date().toISOString();
    this.saveData(this.data);
    return this.data.orders[idx];
  }

  public deleteOrder(id: string): boolean {
    const initLen = this.data.orders.length;
    this.data.orders = this.data.orders.filter((o) => o.id !== id && o.orderNumber !== id);
    if (this.data.orders.length !== initLen) {
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  // --- Stats ---
  public getStats() {
    const products = this.data.products;
    const orders = this.data.orders;
    const totalSales = orders.reduce((sum, o) => (o.status !== 'Cancelled' ? sum + o.grandTotal : sum), 0);
    const pendingOrders = orders.filter((o) => o.status === 'Pending').length;
    const completedOrders = orders.filter((o) => o.status === 'Delivered').length;

    return {
      totalProducts: products.length,
      activeProducts: products.filter((p) => p.published).length,
      saleProducts: products.filter((p) => p.saleEnabled && p.published).length,
      totalOrders: orders.length,
      pendingOrders,
      completedOrders,
      totalSales,
      recentOrders: orders.slice(0, 5),
      recentProducts: products.slice(0, 5),
    };
  }

  // --- Customers ---
  public getCustomers(): CustomerAccount[] {
    if (!this.data.customers) {
      this.data.customers = [];
    }
    return this.data.customers;
  }

  public getCustomerByEmail(email: string): CustomerAccount | undefined {
    const norm = email.trim().toLowerCase();
    return this.getCustomers().find((c) => c.email.toLowerCase() === norm);
  }

  public createCustomer(name: string, email: string, password: string, phone?: string): CustomerAccount {
    const { hash, salt } = hashPassword(password);
    const newCustomer: CustomerAccount = {
      id: 'cust-' + Date.now(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash: hash,
      salt,
      role: 'customer',
      phone: phone ? phone.trim() : '',
      createdAt: new Date().toISOString(),
    };

    if (!this.data.customers) {
      this.data.customers = [];
    }
    this.data.customers.push(newCustomer);
    this.saveData(this.data);
    return newCustomer;
  }
}

export const db = new Database();
