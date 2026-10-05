import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';
import { db, verifyPassword, hashPassword } from './db.js';

export const app = express();

// Store active session tokens with expiration (7 days) and user role
const activeSessions = new Map<string, { userId: string; role: 'admin' | 'customer'; expires: number }>();

export function generateToken(userId: string, role: 'admin' | 'customer' = 'customer'): string {
  const token = crypto.randomBytes(32).toString('hex');
  const expires = Date.now() + 7 * 24 * 60 * 60 * 1000;
  activeSessions.set(token, { userId, role, expires });
  return token;
}

export function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Admin authentication token required' });
  }

  const token = authHeader.split(' ')[1];
  const session = activeSessions.get(token);

  if (!session || session.expires < Date.now()) {
    if (session) activeSessions.delete(token);
    return res.status(401).json({ error: 'Session expired or invalid. Please log in again.' });
  }

  if (session.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Access denied. Admin privileges required.' });
  }

  next();
}

// ----------------- CORS & SECURITY HEADERS -----------------
app.use((req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// Middlewares
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Determine safe uploads directory (handles serverless read-only filesystem)
const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const UPLOADS_DIR = isServerless
  ? path.join('/tmp', 'sh-collection-uploads')
  : path.resolve(process.cwd(), 'uploads');

try {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
} catch {
  // Ignore upload dir creation error on read-only environments
}

app.use('/uploads', express.static(UPLOADS_DIR));

// ----------------- API ROUTES -----------------

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    brand: 'SH Collection',
    environment: process.env.NODE_ENV || 'production',
    timestamp: new Date().toISOString(),
  });
});

// Unified Role-Based Auth (Admin & Customer)
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const admin = db.getAdmin();
  const normInput = email.replace(/\s+/g, '').toLowerCase();
  const normDb = admin.email.replace(/\s+/g, '').toLowerCase();

  // 1. Check Admin Credentials
  const isAdminEmail =
    normInput === normDb ||
    normInput === 'shcollection@gmail.com' ||
    normInput === 'collection@gmail.com';

  if (isAdminEmail) {
    const isValidAdminPassword = verifyPassword(password, admin.passwordHash, admin.salt);
    if (!isValidAdminPassword) {
      return res.status(401).json({ error: 'Invalid credentials. Please verify your password.' });
    }

    const token = generateToken(admin.id, 'admin');
    return res.json({
      token,
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: 'admin',
      },
    });
  }

  // 2. Check Customer Credentials
  const customer = db.getCustomerByEmail(email);
  if (customer) {
    const isValidCustomerPassword = verifyPassword(password, customer.passwordHash, customer.salt);
    if (!isValidCustomerPassword) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = generateToken(customer.id, 'customer');
    return res.json({
      token,
      user: {
        id: customer.id,
        email: customer.email,
        name: customer.name,
        phone: customer.phone,
        role: 'customer',
      },
    });
  }

  // Auto-provision demo client account for testing convenience if credentials match demo
  if (normInput === 'client@example.com' || normInput === 'ayesha@example.com') {
    const newCust = db.createCustomer('Ayesha Khan', email, password, '+92 300 9876543');
    const token = generateToken(newCust.id, 'customer');
    return res.json({
      token,
      user: {
        id: newCust.id,
        email: newCust.email,
        name: newCust.name,
        phone: newCust.phone,
        role: 'customer',
      },
    });
  }

  return res.status(401).json({ error: 'Account not found. Please register or check your login details.' });
});

// Customer Registration
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  const normInput = email.replace(/\s+/g, '').toLowerCase();
  if (normInput === 'shcollection@gmail.com' || normInput === 'collection@gmail.com') {
    return res.status(400).json({ error: 'This email is reserved for administration.' });
  }

  const existing = db.getCustomerByEmail(email);
  if (existing) {
    return res.status(400).json({ error: 'An account with this email already exists. Please sign in.' });
  }

  const customer = db.createCustomer(name, email, password, phone);
  const token = generateToken(customer.id, 'customer');
  res.status(201).json({
    token,
    user: {
      id: customer.id,
      email: customer.email,
      name: customer.name,
      phone: customer.phone,
      role: 'customer',
    },
  });
});

// Forgot Password
app.post('/api/auth/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email address is required' });
  }

  res.json({
    success: true,
    message: 'If an account exists with this email, password reset instructions have been sent.',
  });
});

app.get('/api/auth/verify', requireAdminAuth, (_req, res) => {
  const admin = db.getAdmin();
  res.json({
    user: {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    },
  });
});

app.post('/api/auth/change-password', requireAdminAuth, (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current password and new password are required' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters long' });
  }

  if (confirmPassword && newPassword !== confirmPassword) {
    return res.status(400).json({ error: 'New passwords do not match' });
  }

  const admin = db.getAdmin();
  const isValid = verifyPassword(currentPassword, admin.passwordHash, admin.salt);
  if (!isValid) {
    return res.status(401).json({ error: 'Current password is incorrect' });
  }

  const { hash, salt } = hashPassword(newPassword);
  db.updateAdminPassword(hash, salt);
  res.json({ success: true, message: 'Password successfully updated' });
});

// Settings (Live Admin Configurations)
app.get('/api/settings', (_req, res) => {
  const settings = db.getSettings();
  res.json(settings);
});

app.put('/api/settings', requireAdminAuth, (req, res) => {
  try {
    const updated = db.updateSettings(req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update settings' });
  }
});

// Categories
app.get('/api/categories', (_req, res) => {
  const categories = db.getCategories();
  res.json(categories);
});

app.post('/api/categories', requireAdminAuth, (req, res) => {
  const { name, description, image, slug } = req.body;
  if (!name) return res.status(400).json({ error: 'Category name is required' });

  const category = db.addCategory({
    name,
    description: description || '',
    image: image || '',
    slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    count: 0,
  });
  res.status(201).json(category);
});

app.delete('/api/categories/:id', requireAdminAuth, (req, res) => {
  const ok = db.deleteCategory(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Category not found' });
  res.json({ success: true });
});

// Products
app.get('/api/products', (req, res) => {
  const { category, search, saleOnly, featured, newArrivals, publishedOnly, limit } = req.query;
  let products = db.getProducts({
    category: category as string,
    saleOnly: saleOnly === 'true',
    featuredOnly: featured === 'true',
    newOnly: newArrivals === 'true',
    publishedOnly: publishedOnly !== 'false',
  });

  if (search && typeof search === 'string') {
    const q = search.toLowerCase().trim();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q)
    );
  }

  if (limit) {
    const l = parseInt(limit as string, 10);
    if (!isNaN(l) && l > 0) {
      products = products.slice(0, l);
    }
  }

  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const product = db.getProductById(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

app.post('/api/products', requireAdminAuth, (req, res) => {
  const product = db.addProduct(req.body);
  res.status(201).json(product);
});

app.put('/api/products/:id', requireAdminAuth, (req, res) => {
  const product = db.updateProduct(req.params.id, req.body);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

app.delete('/api/products/:id', requireAdminAuth, (req, res) => {
  const ok = db.deleteProduct(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Product not found' });
  res.json({ success: true });
});

// Orders
app.get('/api/orders', requireAdminAuth, (_req, res) => {
  const orders = db.getOrders();
  res.json(orders);
});

app.get('/api/orders/:id', (req, res) => {
  const order = db.getOrderById(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

app.post('/api/orders', (req, res) => {
  const order = db.createOrder(req.body);
  res.status(201).json(order);
});

app.put('/api/orders/:id', requireAdminAuth, (req, res) => {
  const { status } = req.body;
  if (!status) return res.status(400).json({ error: 'Status is required' });
  const order = db.updateOrderStatus(req.params.id, status);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

app.delete('/api/orders/:id', requireAdminAuth, (req, res) => {
  const ok = db.deleteOrder(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Order not found' });
  res.json({ success: true });
});

// Dashboard Stats
app.get('/api/stats', requireAdminAuth, (_req, res) => {
  const stats = db.getStats();
  res.json(stats);
});

// File / Image Upload handling (base64 image storage or URL)
app.post('/api/upload', requireAdminAuth, (req, res) => {
  const { dataUrl } = req.body;
  if (!dataUrl) {
    return res.status(400).json({ error: 'No image data provided' });
  }

  try {
    const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      if (dataUrl.startsWith('http')) {
        return res.json({ url: dataUrl });
      }
      return res.status(400).json({ error: 'Invalid data URL format' });
    }

    const ext = matches[1].split('/')[1] || 'jpg';
    const safeName = `sh-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${ext}`;
    const filePath = path.join(UPLOADS_DIR, safeName);
    const buffer = Buffer.from(matches[2], 'base64');
    fs.writeFileSync(filePath, buffer);

    const fileUrl = `/uploads/${safeName}`;
    res.json({ url: fileUrl });
  } catch (err: any) {
    console.error('File upload error:', err);
    // In serverless environments where file saving may be ephemeral, dataUrl can still be used
    if (dataUrl.length < 500000) {
      return res.json({ url: dataUrl });
    }
    res.status(500).json({ error: err.message || 'File upload failed' });
  }
});

// Unhandled API routes fallback
app.all('/api/*', (_req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Global Express error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[SH Collection Server Error]:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});
